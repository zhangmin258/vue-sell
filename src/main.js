import Vue from 'vue'

import VueRouter from 'vue-router'

import VueResource from 'vue-resource'

import App from './App'

import 'common/stylus/index.styl'



import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'


Vue.use(VueRouter);
Vue.use(VueResource);

// 定义根组件
let app = Vue.extend(App);

//实例化一个路由对象
let router = new VueRouter({
	linkActiveClass: 'active'
});

//关联路由
router.map({
	'goods': {
		component: goods
	},
	'ratings': {
		component: ratings
	},
	'seller': {
		component: seller
	}
});

//路由重定向
router.redirect({
	'*': '/goods'
});


//开启路由
router.start(app,'#app');













