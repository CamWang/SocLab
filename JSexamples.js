//Print all numbers between -10 and 19
var num = -10
while (num < 20) {
    console.log(num);
    num++;
}

//Print all numbers divisibal by 5 AND 5 between 5 and 50
var num = 5
while (num <= 50) {
    if (num % 3 == 0 || num % 5 == 0) {
        console.log(num);
    }
    num++;
}

//Print hello
var str = "ahceclwlxo";
for (var i = 1; i < str.length; i += 2) {
    console.log(str[i]);
}

//FUNCTION aka.函数
function doSomething() {
    console.log("Hello World"); //20 lines top
}
doSomething();

function area(length, width) {
    console.log(length * width);
}
area(9, 2);

  //两种声明函数的方式
      //function declaration
      function functionName(functionParameter){
          blablabla
      }
      //function expression
      var functionName = function(functionParameter){
          blablabla
      }

  //函数在有return语句时才会返回东西，否则返回undefined，%% return后函数停止执行下面的语句。
function myFunction(a,b)
{
    return a*b;
}
answer = myFunction(4,3);
