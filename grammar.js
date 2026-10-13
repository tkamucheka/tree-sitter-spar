export default grammar({
  name: "spar",

  extras: ($) => [/\\\r?\n/, /[ \t\r\n]+/],

  rules: {
    program: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.comment,
        $.include,
        $.map_definition,
        $.binding_statement,
        $.definition,
        $.labeled_instruction,
        $.label,
        $.for_loop,
        $.instruction,
      ),

    include: ($) => seq("#", alias(/include/i, $.include_keyword), $.string),

    map_definition: ($) =>
      seq(
        "#",
        field("name", $.identifier),
        "=",
        alias(/map/i, $.map_keyword),
        "<",
        field("params", $.dims_list),
        "->",
        field("body", $.affine_expr),
        ">",
      ),

    dims_list: ($) => seq($.dim_or_sym, repeat(seq(",", $.dim_or_sym))),

    dim_or_sym: ($) => token(/[dDsS][0-9]+/),

    binding_statement: ($) =>
      seq(
        field("name", $.identifier),
        "=",
        field(
          "extrema",
          choice(alias(/min/i, $.min_keyword), alias(/max/i, $.max_keyword)),
        ),
        "#",
        field("map_ref", $.identifier),
        "(",
        field("args", seq($.affine_expr, repeat(seq(",", $.affine_expr)))),
        ")",
      ),

    definition: ($) =>
      seq(field("name", $.identifier), "=", field("value", $.data_value)),

    data_value: ($) =>
      choice($.number, $.tensor_literal, $.tensor_type, $.identifier),

    tensor_literal: ($) => seq($.tensor_type, $.list),

    tensor_type: ($) => seq($.named_type, $.shape),

    named_type: ($) =>
      choice(
        alias(/matrix/i, $.matrix_keyword),
        alias(/vector/i, $.vector_keyword),
      ),

    shape: ($) => seq("<", $.dimension, repeat(seq(",", $.dimension)), ">"),

    dimension: ($) => choice($.number, $.identifier),

    list: ($) =>
      seq("[", optional(seq($.number, repeat(seq(",", $.number)))), "]"),

    labeled_instruction: ($) =>
      prec(
        1,
        seq(
          field("label", $.identifier),
          ":",
          field("instruction", $.instruction),
        ),
      ),

    label: ($) => prec(0, seq(field("name", $.identifier), ":")),

    for_loop: ($) =>
      seq(
        alias(/FOR/i, $.for_keyword),
        field("iv", $.identifier),
        "=",
        field("lower", $.affine_expr),
        alias(/TO/i, $.to_keyword),
        field("upper", $.affine_expr),
        alias(/STEP/i, $.step_keyword),
        field("step", $.affine_expr),
        repeat($._statement),
        alias(/END/i, $.end_keyword),
      ),

    instruction: ($) =>
      seq(
        choice(
          prec(
            1,
            seq(
              field("opcode", $.operation),
              field("operands", $.operand_list),
            ),
          ),
          field("opcode", $.zero_operand_operation),
        ),
      ),

    operation: ($) =>
      token(
        prec(
          1,
          /(LOADM|LOADV|LOADCOLV|LOADROWV|STOREM|STOREV|STOREROWV|STORECOLV|ADD|SUB|MULT|REDUCE|TRANSPOSE|RELU|SIGMOID|TANH|SOFTMAX|PRINT|RETURN)/i,
        ),
      ),
    zero_operand_operation: ($) => token(prec(1, /RETURN/i)),

    operand_list: ($) => seq($.operand, repeat(seq(",", $.operand))),

    operand: ($) => choice($.register, $.slice_ref, $.identifier, $.number),

    slice_ref: ($) =>
      choice(
        seq(field("base", $.identifier), field("offsets", $.index_group)),
        seq(
          field("base", $.identifier),
          field("offsets", $.index_group),
          field("sizes", $.index_group),
        ),
        seq(
          field("base", $.identifier),
          field("offsets", $.index_group),
          field("sizes", $.index_group),
          field("strides", $.index_group),
        ),
      ),

    index_group: ($) =>
      seq("[", $.affine_expr, repeat(seq(",", $.affine_expr)), "]"),

    index_expr: ($) => $.affine_expr,

    affine_expr: ($) => $.add_expr,

    add_expr: ($) =>
      prec.left(seq($.mul_expr, repeat(seq(choice("+", "-"), $.mul_expr)))),

    mul_expr: ($) => prec.left(seq($.unary_expr, repeat(seq("*", $.number)))),

    unary_expr: ($) => prec.right(seq(optional("-"), $.primary_expr)),

    primary_expr: ($) =>
      choice(
        $.dim_or_sym,
        $.number,
        seq("(", $.affine_expr, ")"),
        $.affine_function,
        $.identifier,
      ),

    affine_function: ($) =>
      seq(
        field(
          "name",
          choice(
            alias(/floordiv/i, $.floordiv_keyword),
            alias(/ceildiv/i, $.ceildiv_keyword),
            alias(/mod/i, $.mod_keyword),
            alias(/min/i, $.min_keyword),
            alias(/max/i, $.max_keyword),
          ),
        ),
        "(",
        field("args", seq($.affine_expr, repeat(seq(",", $.affine_expr)))),
        ")",
      ),

    register: ($) => /[Rr][0-9]+/,

    identifier: ($) => /[%A-Za-z_][A-Za-z0-9_%]*/,

    number: ($) => /[+-]?((([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][+-]?[0-9]+)?)/,

    string: ($) => /"([^"\\]|\\.)*"/,

    comment: ($) => token(seq(";", /.*/)),
  },
});
