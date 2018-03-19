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

//2D(nested) array
var a2Darray = [[1,9,6],
                [2,6,4],
                [4,6,1]];
console.log(a2Darray[row,column]);

//FUNCTION aka.函数
function doSomething() {
    console.log("Hello World"); //20 lines top
}
doSomething();

function area(length, width) {
    console.log(length * width);
}
area(9, 2);

function isEven(num) {
    if (num % 2 == 0) {
        return true;
    } else if (num % 2 == 1) {
        return false;
    }
}

function factorial(num) {
    var result = 1;
    var a = num;
    for (var i = 0; i < num; i++) {
        result = result * a;
        a--;
    }
    return result;
}

function runFuncNUMtimes(num,func){           //此处function作为一个变量来操作
    for(var i=0;i<num;i++){
        func();
    }
}
runFuncNUMtimes(3,function(){alert("Hi")})

    //立即执行某个函数的一种途径
    (function(){console.log("i am a function")}) ()

//两种声明函数的方式
//function declaration
function functionName(functionParameter) {
    blablabla
}
//function expression
var functionName = function (functionParameter) {
    blablabla
}

//函数在有return语句时才会返回东西，否则返回undefined，%% return后函数停止执行下面的语句。
function myFunction(a, b) {
    return a * b;
}
answer = myFunction(4, 3);


//METHOD

//string replace method
var str = "Visit Microsoft!";
var res = str.replace("Microsoft", "W3Schools");

//array add to the end / head method (return the length of the array)
array.push(element);
array.unshift(element);
//array delete the end / head method (return the element which has been deleted)
array.pop();
array.shift();
//array find the index of an element method (If the search failed it will return -1)
array.indexOf(element);
//array copy parts of an array (if the parentheses is empty then copy the whole thing)
var partOftheArray = array.slice(indexBegingstheCopy_included,indexEndtheCopy_notincluded);

//When Arrays corroborate with Objects
var posts = [
    {
        title:"First Article",
        author:"camwang",
        comments:["good","nice"]
    },
    {
        title:"Second Article",
        author:"camwang",
        comments:["smart ass","nonesense"]
    }
]

//Add event listener
var paragraph = document.querySelector("p");

paragraph.addEventListener("click",changeColor)

function changeColor(){
    paragraph.style.color="#6A1B9A";
    paragraph.textContent="You Clicked"
}

paragraph.addEventListener("mouseover",changeSize)

function changeSize(){
    paragraph.style.fontSize="50px";
    paragraph.textContent="You Hovered"
}