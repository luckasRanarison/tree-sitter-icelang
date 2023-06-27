(comment) @comment

(string) @string
(number) @constant
(null) @constant
(boolean) @constant

[
  "set"
  "function"
  "lambda"
  "if"
  "else"
  "loop"
  "while"
  "for"
  "in"
  "to"
  "continue"
  "break"
  "return"
] @keyword

[
  "+"
  "-"
  "%"
  "*"
  "/"
  "="
  "!"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "and"
  "or"
  "to"
] @operator

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

(stmt_func_decl
  name: (expr_identifier) @function
  args: (args
    (expr
      (expr_identifier) @variable.parameter
    )
  )
)

(expr_lambda
  args: (args
    (expr
      (expr_identifier) @variable.parameter
    )
  )
)

(expr_call
  func: (expr
    (expr_identifier) @function
  )
)

(expr_field
  field: (expr_identifier) @property
)

(expr_call
  func: (expr
    (expr_field
      field: (expr_identifier) @function.method
    )
  )
)

(stmt_var_decl
  name: (expr_identifier) @function
  value: (expr
    (expr_lambda
      args: (args)
      body: (stmt
        (stmt_block)
      )
    )
  )
)

(expr_identifier) @variable
