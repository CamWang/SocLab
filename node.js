
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

kapp.get('/process_get', function (req, res) {
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

app.get('/:name',function(req,res){
    var name=req.params.name;
    res.render("index.ejs",{Yourname : name});  //express会去app.js目录下的views/里面去寻找页面。ejs就好像php版的js和html代码。记得install ejs --save
});
<h1>My name is <%= Yourname.toUpperCase() %></h1>

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


//EJS!!!!
//包裹方式与php相同
//<%= %> 用于直接打印内容到html里
//<% %>  用于执行语句不打印
//文档内部的各个js代码块之间参数变量可传递

    // HTML里插入js代码，安装ejs后
    app.get('/:name',function(req,res){
        var name=req.params.name;
        res.render("index.ejs",{Yourname : name});  // express会去app.js目录下的views/里面去寻找页面。ejs就好像php版的js和html代码。记得install ejs --save
    });
    <h1>My name is <%= Yourname.toUpperCase() %></h1> // html里使用传递进来的变量方法
    
    app.get("/",function(req,res){
        res.render("kkk.ejs");
    })

    app.use(express.static("public"));  // 这一个语句将会引入目录内public文件夹内的文件
    app.set("view engine","ejs");  // 将ejs设置为默认渲染器渲染格式
        // 使用后文档不需要加ejs了
        app.get("/",function(req,res){
            res.render("kkk");
        })

    //include
    <% include ***.ejs%> // 如果已设置了渲染格式那就去掉.ejs
    //路径问题/css.css会从app.js route根目录寻找css.css则会在页面相同位置寻找
    //用foreach会loop through数列内每一个元素，可直接引用数列名


    //表单
        //需要安装body-parser --save来接收信息，记得require它
        //并加上app.use(bodyParser.urlencoded({extended:true}));
        //body-parser会将post request转换为JavaScript代码供解析使用
    //在HTML的表单内匹配 action="/add" method="post"来进行route接收匹配
    // <form action="/add" method="POST">
    //     <input type="text" name="aName">
    //     <button type="submit">submit</button>
    // </form>
    app.post("/add",function(req,req){
        res.send("You have reached a post route!!");
    })
    //用name值来将用户输入的value传递给name变量，name值为名得变量存在于req.body里
    app.post("/add",function(req,req){e
        newName= req.body.aName;
        res.send("Your name is " + newName);
        res.redirect("/"); // 重定向到/ route上，并且传入刚才用户在表单中输入的数据
    })

//MAKE HTTP REQUEST BY NODE
    //request

    var request = require('request');
    request('http://google.com',function(error,response,body){
        if(error||response.statusCode == 200){
            console.log("Things went really wrong!!")
        }else{
            console.log(body)
        }
    });

    //Make JSON file to be js format
    request('blablabla.json',function(error,response,body){
        var parsedData = JSON.parse(body);
        console.log(parsedData);
    });
    
    //如果json数据储存在分支下例
    //{query:
    //    {count:1,
    //     created:'2016',
    //     results:{channel:[object]}}}
    request('blablabla.json',function(error,response,body){
        var parsedData = JSON.parse(body);
        console.log(parsedData["query"]["results"]["channel"]); //["results"][0]来请求result数列的第一个元素
    });
    // {
    //     search:
    //     {
    //         title:666,
    //     },
    //     {
    //         title:333,
    //     }
    // }
    //["search"][0]来访问数列的第一个元素["search"][0]["title"]的值为666
