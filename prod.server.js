     

var express = require('express');

var config = require('./config/index.js');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/',function(req,res,next){
	req.url = '/index.html';
	next();
});

app.use(router);



var appData = require('./data.json');

//商家数据
var seller = appData.seller;

//商品数据
var goods = appData.goods;

//评论数据
var ratings = appData.ratings;

//配置路由
var apiRoutes = express.Router();

//商家数据接口
apiRoutes.get('/seller',function(require,response){
  response.json({
    errno: 0,
    data: seller
  });
});

//商品数据接口
apiRoutes.get('/goods',function(require,response){
  response.json({
    errno: 0,
    data: goods
  });
});


//评论数据接口
apiRoutes.get('/ratings',function(require,response){
  response.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api',apiRoutes);

app.use(express.static('./dist'));



module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})



















