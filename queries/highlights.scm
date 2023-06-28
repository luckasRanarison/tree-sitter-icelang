(comment) @comment

(string) @string
(number) @number
(null) @constant
(boolean) @constant

[
  "set"
  "function"
  "lambda"
  "if"
  "else"
  "match"
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

(stmt_var_decl
  name: (expr_identifier) @function
  value: (expr_lambda)
)

(stmt_func_decl
  name: (expr_identifier) @function
  args: (args
    (expr_identifier) @variable.parameter
  )
)

(expr_lambda
  args: (args
    (expr_identifier) @variable.parameter
  )
)

(expr_call
  func: (expr_identifier) @function
)

(expr_field
  field: (expr_identifier) @property
)

(expr_call
  func: (expr_field
    field: (expr_identifier) @function.method
  )
)

(expr_object
  (prop
    name: (expr_identifier) @function.method
    value: (expr_lambda)
  )
)

(expr_identifier) @variable
