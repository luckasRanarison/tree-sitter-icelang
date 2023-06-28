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
  name: "icelang",

  word: ($) => $.expr_identifier,

  extras: ($) => [/\s|\r?\n/, ";", $.comment],

  conflicts: ($) => [[$.stmt_block, $.expr_object]],

  rules: {
    program: ($) => repeat(seq($._stmt, optional(";"))),

    _stmt: ($) =>
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

    stmt_block: ($) => prec.right(seq("{", repeat($._stmt), "}")),

    stmt_var_decl: ($) =>
      seq(
        "set",
        field("name", $.expr_identifier),
        "=",
        field("value", $._expr)
      ),

    stmt_func_decl: ($) =>
      seq(
        "function",
        field("name", $.expr_identifier),
        field("args", $.args),
        field("body", $.stmt_block)
      ),

    args: ($) => seq("(", optional(commaSep($._expr)), ")"),

    stmt_loop: ($) => seq("loop", field("body", $.stmt_block)),

    stmt_while: ($) =>
      seq("while", field("condition", $._expr), field("body", $.stmt_block)),

    stmt_for: ($) =>
      seq(
        "for",
        field("iterator", $.iterator),
        "in",
        field("iterable", $._expr),
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

    stmt_return: ($) => seq("return", field("value", $._expr)),

    stmt_expression: ($) => $._expr,

    _expr: ($) =>
      choice(
        $.expr_literal,
        $.expr_group,
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

    expr_group: ($) => seq("(", $._expr, ")"),

    expr_identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    expr_array: ($) => seq("[", commaSep($._expr), "]"),

    expr_object: ($) => seq("{", optional(commaSep($.prop)), "}"),

    prop: ($) =>
      seq(
        field("name", choice($.expr_identifier, $.string)),
        ":",
        field("value", $._expr)
      ),

    expr_unary: ($) =>
      prec.right(
        PREC.UNARY,
        seq(field("oprator", choice("-", "!")), field("operand", $._expr))
      ),

    expr_binary: ($) => {
      const table = [
        [PREC.OR, "or"],
        [PREC.AND, "and"],
        [PREC.EQUALITY, choice("==", "!=")],
        [PREC.COMPARISON, choice(">=", "<=", "<", ">")],
        [PREC.RANGE, "to"],
        [PREC.TERM, choice("+", "-", "%")],
        [PREC.FACTOR, choice("*", "/")],
      ];

      return choice(
        ...table.map(([precVal, operator]) =>
          prec.left(
            precVal,
            seq(
              field("lhs", $._expr),
              field("operator", operator),
              field("rhs", $._expr)
            )
          )
        ),
        prec.right(
          PREC.ASSIGN,
          seq(
            field("lhs", choice($.expr_identifier, $.expr_index, $.expr_field)),
            field("operator", "="),
            field("rhs", $._expr)
          )
        )
      );
    },

    expr_index: ($) =>
      prec(
        PREC.INDEX,
        seq(field("arg", $._expr), "[", field("index", $._expr), "]")
      ),

    expr_field: ($) =>
      prec(
        PREC.FIELD,
        seq(field("arg", $._expr), ".", field("field", $.expr_identifier))
      ),

    expr_call: ($) =>
      prec(PREC.CALL, seq(field("func", $._expr), field("args", $.args))),

    expr_lambda: ($) =>
      seq("lambda", field("args", $.args), field("body", $._stmt)),

    expr_if: ($) =>
      seq(
        "if",
        field("condition", $._expr),
        field("body", $.stmt_block),
        optional($.else_branch)
      ),

    else_branch: ($) => seq("else", choice($.expr_if, $.stmt_block)),

    expr_match: ($) =>
      seq("match", field("value", $._expr), field("body", $.match_body)),

    match_body: ($) =>
      seq("{", commaSep(choice($.match_arm, $.default_arm)), "}"),

    match_arm: ($) =>
      seq(field("pattern", $._match_pattern), ":", field("value", $._stmt)),

    _match_pattern: ($) => choice($.literal_pattern, $.or_pattern),

    literal_pattern: ($) => $._expr,

    or_pattern: ($) => prec.left(seq($._match_pattern, ",", $._match_pattern)),

    default_arm: ($) => seq("_", ":", field("value", $._stmt)),

    comment: () => seq("--", /.*/),
  },
});
