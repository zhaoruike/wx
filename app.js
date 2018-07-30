let express = require('express');
let path = require('path');
let ejs = require('ejs');
let app = express();
let http = require('http').Server(app)
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let crypto = require('crypto');
let config = require("./config.js")
let request = require("request")
let xml2js=require('xml2js')


let port = process.env.PORT || 80;
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));

let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.appID + "&secret=" + config.appSecret
    request(url, function (error, response, data) {
        if(data){
           var newData = JSON.parse(data);
           var url =  `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${newData.access_token}`
           request.post({url:url,form:config.menu},function(error1, response1, data1){
               console.log(data1)
           })
        }
    })

 var rui = 'http://140.143.144.215/wx/response'
 var code = 'code'
 var SCOPE = 'snsapi_userinfo'  // 需要用户授权
 // location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appID}&redirect_uri=${rui}&response_type=${code}&scope=${SCOPE}&state=STATE#wechat_redirect`

app.get("/wx", function (req, res) {
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr,
        token,
        hashcode,
        md5 = crypto.createHash('sha1');
    if (signature && timestamp && nonce && echostr) {
        token = "zhaoruike"
    } else {
        res.send("非法来源");
        return;
    }
    var list = [token, timestamp, nonce];
    list.sort();
    var listStr = list.join("")
    md5.update(listStr, "utf8");
    hashcode = md5.digest('hex');
    if (hashcode == signature) {
        res.send(echostr + "")
    } else {
        res.send("非法来源!")
    }

})

app.get("/wx/token", function (req, res) {
    let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.appID + "&secret=" + config.appSecret
    request(url, function (error, response, data) {
        if(data){
           var newData = JSON.parse(data);
           var url =  `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${newData.access_token}`
           request.post({url:url,form:config.menu},function(error1, response1, data1){
               console.log(data1)
           })
        }
    })
})

app.post('/wx',(req, res)=>{
    var xml = ''
    var json = null
    req.on('data',(chunk)=>{
        xml += chunk
    })
    req.on('end',()=>{
        //将接受到的xml数据转化为json
        xml2js.parseString(xml,  {explicitArray : false}, function(err, json) {  

            var backTime = new Date().getTime();  //创建发送时间，整数

            if( json.xml.MsgType == 'event' ){  //消息为事件类型

                if( json.xml.EventKey == 'clickEvent' ){
                    res.send( getXml( json , backTime , '你戳我干啥...' ) )  //回复用户的消息
                }
            }else if( json.xml.MsgType == 'text' ){  //消息为文字类型

                res.send( getXml( json , backTime , `你发"${json.xml.Content}"过来干啥？` ) )  //回复用户的消息
            }


        }); 
    })

    function getXml( json , backTime , word ){
        var backXML = `
                <xml>
                    <ToUserName><![CDATA[${json.xml.FromUserName}]]></ToUserName>
                    <FromUserName><![CDATA[${json.xml.ToUserName}]]></FromUserName>
                    <CreateTime>${backTime}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[${word}]]></Content>
                </xml>
            `
        return backXML;
    };

})

http.listen(port, function () {
    console.log('listen port ' + port + ' success...')
});