function InfixConverter(operators) {
    var expressionValidationRegex = /^([0-9]|\+|-|\(|\)|\*|\/|d)*$/;

    var symbolToOperatorMap = operators.reduce(function (map, obj) {
        map[obj.symbol] = obj;
        return map;
    }, {});

    this.toPostfix = function (expression) {

        if (!isExpressionValid(expression)) { throw "Expression is invalid."; }

        var operatorsStack = [], result = [];

        for (var i = 0; i < expression.length; i++) {

            var symbol = expression[i];

            if (isNumber(symbol)) {
                result.push(symbol);
                continue;
            }

            var operator = symbolToOperatorMap[symbol];
            var precedentOperator = peek(operatorsStack);

            if (precedentOperator === null) {
                operatorsStack.push(operator);
            } else if (operator.symbol === ')') {
                while (peek(operatorsStack).symbol !== '(') {
                    result.push(operatorsStack.pop().symbol);
                }

                //Remove the left parenthesis from the stack
                operatorsStack.pop();
            } else if (precedentOperator.symbol === '(' || operator.symbol === '(') {
                operatorsStack.push(operator);

            } else if (operator.priority > precedentOperator.priority) {
                operatorsStack.push(operator);

            } else if (operator.priority < precedentOperator.priority) {
                while (operatorsStack.length !== 0 && peek(operatorsStack).priority > operator.priority) {
                    result.push(operatorsStack.pop().symbol); }
                operatorsStack.push(operator);

            } else {
                if (operator.association === Associations.LeftToRight) {
                    result.push(operatorsStack.pop().symbol);
                    operatorsStack.push(operator);
                } else if (operator.association === Associations.RightToLeft) {
                    operatorsStack.push(operator);
                }
            }
        }

        while (operatorsStack.length !== 0) {
            result.push(operatorsStack.pop().symbol);
        }

        return result;
    };

    function isExpressionValid(expression) {
        return typeof (expression) === "string" && expressionValidationRegex.test(expression);
    }

    function peek(stack) {
        if (stack.length === 0) {
            return null;
        }

        return stack[stack.length - 1];
    }

    function isNumber(str) {
        return !isNaN(parseInt(str));
    }
}

var Associations = { None: '0', LeftToRight: '1', RightToLeft: '2' };

//Example of use

var operators = [
    { name: "PLUS", priority: 1, symbol: '+', association: Associations.LeftToRight },
    { name: "SUBSTRACT", priority: 1, symbol: '-', association: Associations.LeftToRight },
    { name: "MULT", priority: 2, symbol: '*', association: Associations.LeftToRight },
    { name: "DIV", priority: 2, symbol: '/', association: Associations.LeftToRight },
    { name: "DICE", priority: 3, symbol: 'd', association: Associations.LeftToRight },
    { name: "LEFT_PAR", priority: 0, symbol: '(', association: Associations.None },
    { name: "RIGHT_PAR", priority: 0, symbol: ')', association: Associations.None }
];

var infixConverter = new InfixConverter(operators);
//infixConverter.toPostfix("1*(2+3d2*2)");