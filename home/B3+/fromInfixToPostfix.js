function separateNumbersFromOperations (expression) {
    let charsArray = expression.split(''); //разделили наше выражение на элементы
    let expressionArray = [];
    let index = 0; 
    expressionArray [index] = '';
    let lastOperation =true;
        
    for (let i = 0; i < charsArray.length; i++) { //разделяем цифры и операторы
        if (charsArray[i] === ")" || charsArray[i] === "(") {
            index++;
            expressionArray[index] = charsArray[i];
            index++;
            expressionArray[index] ='';
            lastOperation=false;
        }
        else if (isNaN(parseInt(charsArray[i])) && charsArray[i] !== "." && !lastOperation) {
            index++;
            expressionArray[index] = charsArray[i];
            index++;
            expressionArray[index] ='';
            lastOperation =true;
        } else {
            expressionArray[index] += charsArray[i];
            lastOperation=false;
        }
    }

    let expressionArrayFiltered = [];
    expressionArrayFiltered = expressionArray.filter(element => element !== '');
    return expressionArrayFiltered;
}


function fromInfixToPostfix (infixExpr) {
    let stack = [];
    let postfix = [];
    let enter = true; 
    //let infixExpr =  ["(", "13", "+", "3.4", ")", "*", "-12", "+", "1.2"]; 

    for(let i = 0; i<infixExpr.length ;i++){
        if (!isNaN(parseFloat(infixExpr[i]))){
            postfix.push(infixExpr[i]);
        }
        else if (infixExpr[i] == '('){
            stack.push(infixExpr[i]);
        }
        else if (infixExpr[i] == ')'){
            stack.push(infixExpr[i]);
        }

        else if (infixExpr[i] == '+' || infixExpr[i] == '-') {
            if (stack.length == 0) {
                stack.push(infixExpr[i]);
            }
            else {
                if (stack[stack.length-1]=='*' ||stack[stack.length-1]=='/' || stack[stack.length-1]=='+' || stack[stack.length-1]=='-'){
                    postfix.push(stack.pop());
                    stack.push(infixExpr[i]);
                }
                else {
                    stack.push(infixExpr[i]);
                }
            }
        }
        else if (infixExpr[i] == '*' || infixExpr[i] == '/'){
            if (stack.length == 0) {
                stack.push(infixExpr[i]);
            }
            else if (stack[stack.length-1] == '('){
                stack.push(infixExpr[i]); 
            }
            else if (stack[stack.length-1]  == ')'){
                stack.pop();
                while(enter){
                    if(stack[stack.length-1] == '('){
                        stack.pop();
                        enter = false;
                    }
                    else {
                        postfix.push(stack.pop());
                    }
                }
                stack.push(infixExpr[i]);
            }
            else {
                if (stack[stack.length-1]=='+' ||stack[stack.length-1]=='-' || stack[stack.length-1]=='('){
                    stack.push(infixExpr[i]); 
                }
                else if (stack[stack.length-1]=='*' ||stack[stack.length-1]=='/') {
                    while (stack.length == 0){
                        postfix.push(stack.pop());
                    }
                    stack.push(infixExpr[i]);
                }
            }  
        }
    }
    if (stack.length != 0) {
        postfix.push(stack.pop());
    }
    return postfix;
}