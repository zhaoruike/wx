module.exports={
    appSecret:"2fb852ad563a4c56f72618888a6adf8b",
    appID:"wx7edc102d70649008",
    menu:{
        "button":[
        {   
         "type":"view",  //view表示跳转
         "name":"**商城",
         "url":"http://www.baidu.com"
        },
        {
             "type":"click",   //表示事件
             "name":"戳一下",
             "key":"clickEvent"   //事件的key可自定义,微信服务器会发送到指定的服务器用于识别事件做出相应回应
        },
        {
          "name":"菜单",
          "sub_button":[  //二级菜单
          { 
              "type":"view",
              "name":"搜索",
              "url":"http://www.baidu.com"
           },
           {
              "type":"click",
              "name":"赞一下我们",
              "key":"V1001_GOOD"
           }]
        }]
    }
}