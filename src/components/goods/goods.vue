	

<template>
	<div class="goods">
		<div class="menu-wrapper" v-el:menu-wrapper>
			<ul>
				<li v-for="item in goods" class="menu-item" :class="{'current': currentIndex === $index}" @click="selectMenu($index,$event)">
					<span class="text border-1px">
						<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" v-el:foods-wrapper>
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
							<div class="icon">
								<img :src="food.icon" alt="" width="57" height="57">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="description">{{food.description}}</p>
								<div class="extra">
									<span>月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="new-price">￥{{food.price}}</span>
									<del class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</del>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :delivery="seller.deliveryPrice" :min="seller.minPrice" :select-foods="selectFoods" v-ref:shopcart></shopcart>
	</div>
	<food :food="selectedFood" v-ref:food></food>

</template>




<script>

import Bscroll from 'better-scroll'   //滚动
import shopcart from '../shopcart/shopcart.vue'     //购物车组件
import cartcontrol from '../cartcontrol/cartcontrol.vue'     //购买组件
import food from '../food/food.vue'     //商品详情组件

const ERR_OK = 0;

export default {
	data(){
		return{
			goods: {},
			listHeight: [],
			scrollY: 0,
			selectedFood: {}
		}
	},
	props: {
		seller: {
			type: Object
		}
	},
	computed: {
		currentIndex(){
			for(let i=0;i<this.listHeight.length;i++){
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i+1];
				if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
					return i;
				}
			}
			return 0;
		},
		selectFoods(){
			let foods = [];
			this.goods.forEach((good) => {
				good.foods.forEach((food) => {
					if(food.count){
						foods.push(food);
					}
				});
			});
			return foods;
		}
	},
	created(){
		this.classMap = ['decrease','discount','special','invoice','guarantee'];
		this.$http.get('/api/goods').then((response) => {
			var response = response.data;
			if(response.errno === ERR_OK){
				this.goods = response.data;
				this.$nextTick(() => {    //数据跟新完毕之后，等待DOM跟新
					this._initScroll();
					this._calculateHeight();
				});

			}
		});
	},
	methods: {
		_initScroll(){
			this.menuScroll = new Bscroll(this.$els.menuWrapper,{
				click: true    //better-scroll在初始化的时候，禁止掉了默认行为
			});
			this.foodsScroll = new Bscroll(this.$els.foodsWrapper,{
				click: true,
				probeType: 3
			});
			this.foodsScroll.on('scroll',(pos) => {
				this.scrollY = Math.abs(Math.round(pos.y));
			});
		},
		_calculateHeight(){
			let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for(let i=0;i<foodList.length;i++){
				let item = foodList[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}

		},
		selectMenu(index,e){
			if(!e._constructed){    //在pc端执行的时候
				return;
			}
			let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el,1000);
		},
		_drop(target){   
			this.$nextTick(() => {     //数据跟新完毕之后，等待DOM跟新，对代码性能的优化
				this.$refs.shopcart.drop(target);  //父组件调用子组件的方法
			});
		},
		selectFood(food,e){
			if(!e._constructed){    //在pc端执行的时候
				return;
			}
			this.selectedFood = food;
			this.$refs.food.show();    //调用子组件的show()方法
		}
	},
	components: {
		'shopcart': shopcart,
		'cartcontrol': cartcontrol,
		'food': food
	},
	events: {
		'cart.add'(target){   //接收子组件传过来的参数
			this._drop(target);
		}
	}
}





</script>



<style lang="stylus" rel="stylesheet/stylus">

	@import '../../common/stylus/mixin.styl';

	.goods{
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrapper{
			flex: 0 0 80px;
			width: 80px;
			background: #f3f5f7;
			.menu-item{
				display: table;
				width: 56px;
				height: 54px;
				line-height: 14px;
				padding: 0 12px;
				&.current{
					position: relative;
					z-index: 10;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					.text{
						border-none();
					}
				}
				.text{
					display: table-cell;
					vertical-align: middle;
					width: 56px;
					font-size: 12px;
					border-1px(rgba(7,17,27,0.2));
					.icon{
						width: 12px;
						height: 12px;
						margin-right: 2px;
						background-size: 100%;
						background-repeat: no-repeat;
						display: inline-block;
						vertical-align: top;
						&.decrease{
							bg-image('decrease_3');
						}
						&.discount{
							bg-image('discount_3');
						}
						&.guarantee{
							bg-image('guarantee_3');
						}
						&.invoice{
							bg-image('invoice_3');
						}
						&.special{
							bg-image('special_3');
						}
					}
				}
			}
		}
		.foods-wrapper{
			flex: 1;
			/*background: #ccc;*/
			.title{
				height: 26px;
				line-height: 26px;
				padding-left: 14px;
				border-left: #d9dde1 solid 2px;
				color: rgb(147,153,159);
				background: #f3f5f7;
				font-size: 12px;
			}
			.food-item{
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				border-1px(rgba(7,17,27,0.1));
				&:last-child{
					border-none();
					margin-bottom: 0;
				}
				.icon{
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content{
					flex: 1;
					.name{
						margin: 2px 0 8px 0;
						font-size: 14px;
						line-height: 14px;
						color: rgb(7,17,27);
					}
					.description{
						margin-bottom: 8px;
						font-size: 10px;
						line-height: 12px;
						color: rgb(147,153,159);
					}
					.extra{
						font-size: 10px;
						line-height: 10px;
						color: rgb(147,153,159);
						margin-bottom: 8px;
						span{
							margin-right: 12px;
						}
					}
					.price{
						font-weight: 700;
						line-height: 24px;
						.new-price{
							font-size: 14px;
							margin-right: 8px;
							color: rgb(240,20,20);
						}
						.old-price{
							font-size: 10px;
							color: rgb(147,153,159);
						}
					}
					.cartcontrol-wrapper{
						position: absolute;
						right: 0;
						bottom: 22px;
					}
				}
			}
		}
	}










</style>







