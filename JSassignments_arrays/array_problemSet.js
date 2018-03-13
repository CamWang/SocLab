//printReverse()
function printReverse(a = []) {                  //只用array名就行啊
    for (var i = (a.length - 1); i >= 0; i--) {
        console.log(a[i]);
    }
}

//isUniform()
function isUniform(a = []) {
    var num
    for(var i=0;i<a.length;i++){
        num=a[i];
        if(a[i+1]!==a[i]){
            return false;
        }
    }
    return true;
}

//sunArray()
function sumArray(a=[]){
    var result=0;
    for(var i=0;i<a.length;i++){
        result+=a[i];
    }
    return result;
}

//max()
function max(a=[]){
    var max=0;
    a.forEach(function maxForEach(ele){
        if(ele>=max){
            max=ele;
        }
    })
    return max;
}