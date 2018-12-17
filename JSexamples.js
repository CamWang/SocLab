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

//FINDIndex

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