; Comments and strings
(comment) @comment
(string) @string

; Literals
(number) @number
(register) @variable.builtin

; Keywords
(operation) @keyword
(zero_operand_operation) @keyword
(for_keyword) @keyword
(to_keyword) @keyword
(step_keyword) @keyword
(end_keyword) @keyword
(include_keyword) @keyword
(map_keyword) @keyword
(min_keyword) @keyword
(max_keyword) @keyword
(floordiv_keyword) @keyword
(ceildiv_keyword) @keyword
(mod_keyword) @keyword

; Types
(named_type) @type

; Symbols and punctuation
[
  "<"
  ">"
  "["
  "]"
] @operator

[
  "="
  "+"
  "-"
  "*"
  "->"
] @operator

[
  ","
  ":"
] @punctuation.delimiter

[
  "#"
] @punctuation.special

; Identifiers by role
(definition name: (identifier) @variable)
(map_definition name: (identifier) @function)
(binding_statement name: (identifier) @variable)
(binding_statement map_ref: (identifier) @function)
(label name: (identifier) @variable)
(labeled_instruction label: (identifier) @variable)
(for_loop iv: (identifier) @variable.parameter)
(slice_ref base: (identifier) @variable)
(dim_or_sym) @variable.builtin
