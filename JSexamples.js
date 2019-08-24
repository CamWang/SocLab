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


// CallBack回调函数

//FOREACH

//forEach(arr, callback);
//function callback(currentElement, currentIndex, array)

var arr = [1,2,3,4,5,6];
forEach(arr, function(number) {
    console.log(number*2);
});

var arr = ["my", "forEach", "example"];
var result = "";
forEach(arr, function(str, index, array) {  //str接受元素的值，index接受元素的角标，array接受输入的对象。
    if (array.length - 1 !== index){
        result += str + " ";
    } else {
        result += str +"!!!";
    }
});      //result = "my forEach example!!!"

//findIndex

//findIndex(arr, callback)
//function callback(currentElement, currentIndex, array)
//当callback函数return为真则返回该次循环正在遍历的角标。

var arr = [5,11,13,8,6,7];
findIndex(arr, function(num, index, array) {
    return num%2 == 0;  //一定要return，无return或return值为假则返回-1
});
//findeIndex will only return 3;
//如果搜索不到就返回-1

function upperCaseFirst(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function upperCaseWords(sentence) {
    var words = sentence.split(" ");
    for (var i=0; i < words.length; i++) {
        words[i] = upperCaseFirst(words[i]);
    }
    return words.join(" ");
}

upperCaseWords("lowercase words");
//结果："Lowercase Words"

// setTimeout
// clearTimeout
// setInterval

// setTimeout(callback, delay[in ms]);  -  return a timerId
// clearTimeout(timerId);

function callback() {
    console.log("callback function");
}
var delay = 1000;
setTimeout(callback, delay);

setTimeout(function() {
    console,log("Runs in approx. 2000ms")
},2000);
// 取消setTimeout
var timerId = setTimeout(function() {
    console.log("runs in 30s");
},30000);

setTimeout(function() {
    console.log("Cancel the upper function", timerId);
    clearTimeoust(timerId);
},2000)

// setInterval(callback, repeatFrequency) - return a intervalId
// clearInterval(intervalId)
function callback() {
    console.log("callback is called continuously");
}
var repeat;
setTimeout(callback, repeat); // 重复

var num=0;
var intervalId = setInterval(function() {
    num++;
    if(num === 3) {
        clearInterval(intervalId);
    }
}, 1000);

function countDown(a) {
    var b = a;
    var intervalId = setInterval(function() {
        b--;
        if (b === 0){
            console.log("Ring Ring Ring!!!");
            clearInterval(intervalId);
        } else {
            console.log("Timer:" + b);
        }
    }, 1000);
}

// Stack执行函数堆[先进后出]，Queue为待执行函数队列[先进先出]，EventLoop负责轮询从Queue内取函数到stack里执行
// Main函数会先入栈并在所有main函数下函数与Queue中所有函数执行完后执行
// Stack一共就俩位置，其他按照主函数下扫描到的最外层函数先入stack
