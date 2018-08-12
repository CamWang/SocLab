
//EXPRESS ROUTING!!

var express = require("express");
var app = express();

app.use(express.static('public')); //添加对public文件夹的域名访问

//"/" hi there
app.get("/",function(req,res){ //request, response
    res.send("Hi there");
});

app.get("/dog",function(req,res){
    res.send("WOW");
});

app.get('/ab*cd', function(req, res) {   
    console.log("/ab*cd GET 请求");
    res.send('可以匹配正则表达式');
});

app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" ); //转发到页面
 });

app.get("*",function(req,res){  // This will triggered whenever we enter an unknown get request besides the defined one ORDER MATTERS
    res.send("What did you type in the domain input?");
});

app.get("/discuss/:aDiscussTitle",function(req,res){  //会捕获所有为/discuss/***的请求并且把**赋值于aDiscussTitle变量
    res.send("welcome to a discuss post");            //req.params储存着aDiscussTitle变量(你定义更多当然也在这里面)req.params={aDiscussTitle='***'}
    console.log(req);   //req里存着所有用户请求相关的所有数据,通过.来访问其中的东西req.params.aDiscussTitle会返回该变量的值
});

app.get('/process_get', function (req, res) {
    // 输出 JSON 格式
    var response = {
        "first_name":req.query.first_name,
        "last_name":req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
});

app.get('/speak/:animal/:times',function(req,res){
    var animal=req.params.animal.toLowerCase(); //转换为小写来匹配大小写的动物名
    var times=Number(req.params.times); //将字符串times变换为数字类型
    var sounds={
        pig:"oink",
        cow:"moo",
        dog:"Woof Woof!",
        cat:"Kneel before me"
    }
    var sound = sounds[animal];     //To visit a JSON variable
    function say(sound,time){
        for (var i=0;i<time;i++){
            var all="";
            all+=sound;
        }
        return all;
    }
    res.send(animal + " says " + say(sound,times));
});

//Tell Express to listen for requests(start server)
app.listen(process.env.PORT,process.env.IP,function(){ //port and ip here will change due to the environment
    console.log("SERVER IS STARTED!!");
});
//另一个监听端口的方法
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    //应用实例，访问地址为 http://%s:%s", host, port
});
//"npm install somepackage --save" to install a package like express and write it into the package.json file
//"npm init" to create a package.json file to decribe your package

