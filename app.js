let express = require('express');
let path = require('path');
let ejs = require('ejs');
let app = express();
let http = require('http').Server(app)
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let crypto = require('crypto');


let port = process.env.PORT || 80;
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));


app.get("/wx", function (req, res) {
    var signature = req.body.signature,
        timestamp = req.body.timestamp,
        nonce = req.body.nonce,
        echostr = req.body.echostr,
        token,
        hashcode,
        md5 = crypto.createHash('md5');
    if (signature && timestamp && nonce && echostr) {
        token = "zhaoruike"
    } else {
        res.send("非法来源")
    }
    var list = [token, timestamp, nonce];
    list.sort();
    var listStr = list.join("")
    md5.update(content);
    hashcode = md5.digest('hex');
    if(hashcode == signature){
        return echostr
    }else{
        res.send("非法来源")
    }

})

http.listen(port, function () {
    console.log('listen port ' + port + ' success...')
});