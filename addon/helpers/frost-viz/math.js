import Ember from 'ember'
const { assert } = Ember

/**
 * Built in operators.
 *
 * Each element of the array corresponds to the number of parameters expected
 * for that built-in. There is e.g. operators[1]['-'] that negates a value, and
 * operators[2]['-'] that performs subtraction.
 *
 * @type {Array}
 */
const operators = [
  {}, // arity zero
  {   // arity one: prefix operators. (math operator operand-1)
    '!' (a) {
      return !a
    },
    '-' (a) {
      return -a
    }
  },
  {   // arity two: infix operators. (math operand-1 operator operand-2)
    '+' (a, b) {
      return a + b
    },
    '-' (a, b) {
      return a - b
    },
    '*' (a, b) {
      return a * b
    },
    '/' (a, b) {
      return a / b
    },
    '%' (a, b) {
      return a % b
    },
    '&&' (a, b) {
      return a && b
    },
    '||' (a, b) {
      return a || b
    },
    '^^' (a, b) {
      return a ? !b : b
    },
    '&' (a, b) {
      return a & b
    },
    '|' (a, b) {
      return a | b
    },
    '^' (a, b) {
      return a ^ b
    }
  },
  {   // arity three: (math operand-1 operator operand-2 operand-3)
    '?' (a, b, c) {
      return a ? b : c
    }
  }
]

/**
 * Evaluate the given parameters as a prefix or infix expression
 * @param  {Array} params The parameter array to evaluate
 * @returns {Number}       The result of the evaluation
 */
const evaluate = function (params) {
  // One operand per expression.
  const arity = params.length - 1
  let operatorName = null
  let operands = null
  if (arity === 1) {
      // Assume prefix, e.g. '!' false
    operatorName = params.shift()
    operands = [...params]
  } else {
      // Assume infix, e.g. (math 6 '+' 3), (true '?' 'yes' 'no')
    operands = [params.shift()]
    operatorName = params.shift()
    operands = [...operands, ...params]
  }
  let operator = operators[arity][operatorName] || Math[operatorName]
  if (!operator) {
    const builtins = Object.keys(operators[arity])
    const mathLib = Object.getOwnPropertyNames(Math).filter(k => Math[k].length === arity)
    assert(`Operator not found. Operators for arity (${arity}): [${builtins.concat(mathLib).join(',')}]`, false)
  }
  return operator.apply(null, operands)
}

/**
 * Math helper. Evaluates the expression supplied using positional parameters.
 *
 * An expression generally consists of one or more operands and one operator.
 * If only one token is supplied, it is assumed to be an operand and returned.
 *
 * Since an expression can contain a maximum of one operator, and every expression is
 * parenthesized (as a helper expression), this helper is not aware and does not need
 * to be aware of operator precedence.
 *
 * If one token is present, that token is returned.
 *
 * If two tokens are present, the expression is evaluated as though it has a prefix operator
 * and one operand, e.g.
 *    (math '!' false) => true
 *
 * If three or more tokens are present, the expression is evaluated as though it contains
 * an infix operator in the second position, e.g.
 *    (math 6 '*' 7) => 42
 *    (nickname '?' 'Bobby' 'Robert') => nickname && 'Bobby' || 'Robert'
 *
 * All functions in Math are available, as well as the builtin operators defined above.
 *
 * @param  {Array} params The tokens to evaluate
 * @returns {Number}       The result of the evaluation
 */
export function math (params/*, hash*/) {
  if (!Array.isArray(params)) {
    return params
  }
  if (params.length === 1) {
    return params[0]
  }
  assert('Expected value, prefix-operator or first infix-operand', params.length > 0)
  return evaluate(params)
}

export default Ember.Helper.helper(math)
