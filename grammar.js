const PREC = {
  ASSIGN: 0,
  OR: 1,
  AND: 2,
  EQUALITY: 3,
  COMPARISON: 4,
  RANGE: 5,
  TERM: 6,
  FACTOR: 7,
  UNARY: 8,
  CALL: 9,
  FIELD: 10,
  INDEX: 11,
};

const commaSep = (rule) => repeat(seq(rule, optional(",")));

module.exports = grammar({
  name: "icleang",

  word: ($) => $.expr_identifier,

  extras: ($) => [/\s|\r?\n/, $.comment],

  conflicts: ($) => [[$.stmt_block, $.expr_object]],

  rules: {
    program: ($) => repeat(seq($.stmt, optional(";"))),

    stmt: ($) =>
      choice(
        $.stmt_block,
        $.stmt_var_decl,
        $.stmt_func_decl,
        $.stmt_loop,
        $.stmt_while,
        $.stmt_for,
        $.stmt_continue,
        $.stmt_break,
        $.stmt_return,
        $.stmt_expression
      ),

    stmt_block: ($) => prec.right(seq("{", repeat($.stmt), "}")),

    stmt_var_decl: ($) =>
      seq("set", field("name", $.expr_identifier), "=", field("value", $.expr)),

    stmt_func_decl: ($) =>
      seq(
        "function",
        field("name", $.expr_identifier),
        field("args", $.args),
        field("body", $.stmt_block)
      ),

    stmt_loop: ($) => seq("loop", field("body", $.stmt_block)),

    stmt_while: ($) =>
      seq("while", field("condition", $.expr), field("body", $.stmt_block)),

    stmt_for: ($) =>
      seq(
        "for",
        field("iterator", $.iterator),
        "in",
        field("iterable", $.expr),
        field("body", $.stmt_block)
      ),

    iterator: ($) =>
      choice(
        $.expr_identifier,
        seq(
          field("key", $.expr_identifier),
          ",",
          field("value", $.expr_identifier)
        )
      ),

    stmt_continue: () => seq("continue"),

    stmt_break: () => seq("break"),

    stmt_return: ($) => seq("return", field("value", $.expr)),

    stmt_expression: ($) => $.expr,

    expr: ($) =>
      choice(
        $.expr_literal,
        $.expr_identifier,
        $.expr_array,
        $.expr_object,
        $.expr_unary,
        $.expr_binary,
        $.expr_index,
        $.expr_field,
        $.expr_if,
        $.expr_match,
        $.expr_call,
        $.expr_lambda
      ),

    expr_literal: ($) => choice($.number, $.string, $.boolean, $.null),

    number: () => /[0-9]+(\.[0-9]+)?/,

    string: () => /"[^"]*"|'[^']*'/,

    boolean: () => choice("true", "false"),

    null: () => "null",

    expr_identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    expr_array: ($) => seq("[", commaSep($.expr), "]"),

    expr_object: ($) => seq("{", optional(commaSep($.prop)), "}"),

    prop: ($) =>
      seq(
        field("name", choice($.expr_identifier, $.string)),
        ":",
        field("value", $.expr)
      ),

    expr_unary: ($) =>
      prec.right(
        PREC.UNARY,
        seq(field("oprator", choice("-", "!")), field("operand", $.expr))
      ),

    expr_binary: ($) => {
      const table = [
        [prec.left, PREC.OR, "or"],
        [prec.left, PREC.AND, "and"],
        [prec.left, PREC.EQUALITY, choice("==", "!=")],
        [prec.left, PREC.COMPARISON, choice(">=", "<=", "<", ">")],
        [prec.left, PREC.RANGE, "to"],
        [prec.left, PREC.TERM, choice("+", "-", "%")],
        [prec.left, PREC.FACTOR, choice("*", "/")],
      ];
      return choice(
        ...table.map(([precFn, precVal, op]) =>
          precFn(
            precVal,
            seq(
              field("lhs", $.expr),
              field("operator", op),
              field("rhs", $.expr)
            )
          )
        ),
        prec.right(
          PREC.ASSIGN,
          seq(
            field("lhs", choice($.expr_identifier, $.expr_index, $.expr_field)),
            field("operator", "="),
            field("rhs", $.expr)
          )
        )
      );
    },

    expr_index: ($) =>
      prec(
        PREC.INDEX,
        seq(field("arg", $.expr), "[", field("index", $.expr), "]")
      ),

    expr_field: ($) =>
      prec(
        PREC.FIELD,
        seq(field("arg", $.expr), ".", field("field", $.expr_identifier))
      ),

    expr_call: ($) =>
      prec(PREC.CALL, seq(field("func", $.expr), field("args", $.args))),

    args: ($) => seq("(", optional(commaSep($.expr)), ")"),

    expr_lambda: ($) =>
      seq("lambda", field("args", $.args), field("body", $.stmt)),

    expr_if: ($) =>
      seq(
        "if",
        field("condition", $.expr),
        field("body", $.stmt_block),
        optional($.else_branch)
      ),

    else_branch: ($) => seq("else", choice($.expr_if, $.stmt_block)),

    expr_match: ($) =>
      seq(
        "match",
        field("pattern", $.expr),
        "{",
        field("arms", commaSep($.match_arm)),
        "}"
      ),

    match_arm: ($) =>
      seq(field("match", commaSep($.expr)), ":", field("body", $.stmt)),

    comment: () => seq("--", /.*/),
  },
});
