



<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight': totalCount > 0}">
						<i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
					</div>
					<div class="num" v-show="totalCount > 0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{delivery}}</div>
			</div>
			<div class="content-right" :class="{'settlement': totalPrice >= min}" @click.stop.prevent="pay">{{payDesc}}</div>
		</div>
		<div class="ball-container">
			<div v-for="ball in balls" v-show="ball.show" transition="drop" class="ball">
				<div class="inner inner-hook"></div>
			</div>
		</div>
		<div class="shopcart-list" v-show="listShow" transition="fold">
			<div class="list-header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<div class="list-content" v-el:list-content>
				<ul>
					<li v-for="food in selectFoods" class="food">
						<span class="name">{{food.name}}</span>
						<div class="price">
							<span>￥{{food.price * food.count}}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<cartcontrol :food="food"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="list-mask" v-show="listShow" transition="fade" @click="toggleList"></div>

</template>





<script>

import Bscroll from 'better-scroll'   //滚动
import cartcontrol from '../cartcontrol/cartcontrol.vue';    //购买组件

export default {
	data(){
		return{
			balls: [
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				}
			],
			dropBalls: [],
			fold: true    //折叠状态。默认为折叠
		}
	},
	props: {
		delivery: {
			type: Number,
			default: 0
		},
		min: {
			type: Number,
			default: 0
		},
		selectFoods: {
			type: Array,
			default(){
				return [
					{
						price: 0,
						count: 0
					}
				];
			}
		}
	},
	computed: {
		totalPrice(){
			let total = 0;
			this.selectFoods.forEach((food) => {
				total += food.price * food.count;
			});
			return total;
		},
		totalCount(){
			let count = 0;
			this.selectFoods.forEach((food) => {
				count += food.count;
			});
			return count;
		},
		payDesc(){
			if(this.totalPrice === 0){
				return `￥${this.min}元起送`;
			}else if(this.totalPrice < this.min){
				let diff = this.min - this.totalPrice;
				return `还差￥${diff}元起送`;
			}else{
				return `去结算`;
			}
		},
		listShow(){
			if(!this.totalCount){
				this.fold = true;
				return false;
			}
			let show = !this.fold;
			if(show){
				this.$nextTick(() => {
					if(!this.scroll){
						this.scroll = new Bscroll(this.$els.listContent,{
							click: true
						});
					}else{
						this.scroll.refresh();
					}
				});
			}
			return show;
		}
	},
	methods: {
		drop(el){
			for(let i=0;i<this.balls.length;i++){
				let ball = this.balls[i];
				if(!ball.show){
					ball.show = true;
					ball.el = el;
					this.dropBalls.push(ball);
					return;
				}
			}
		},
		toggleList(){
			if(!this.totalCount){
				return;
			}
			this.fold = !this.fold;
		},
		empty(){
			this.selectFoods.forEach((food) => {
				food.count = 0;
			});
		},
		pay(){
			if(this.totalPrice < this.min){
				return;
			}
			alert(`需要支付${this.totalPrice}元！`);
		}
	},
	transitions: {     //过渡动画的钩子函数 
		drop: {
			beforeEnter(el){
				let count = this.balls.length;
				while(count--){
					let ball = this.balls[count];
					if(ball.show){
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left -32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`; 
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el){
				let rf = el.offsetHeight;
				this.$nextTick(() => {     //数据跟新完毕之后，等待DOM跟新
					el.style.webkitTransform = 'translate3d(0,0,0)'; 
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				});
			},
			afterEnter(el){
				let ball = this.dropBalls.shift();
				if(ball){
					ball.show = false;
					el.style.display = 'none';
				}
			}
		}
	},
	components: {
		'cartcontrol': cartcontrol
	}
}





</script>






<style lang="stylus" rel="stylesheet/stylus">
	
	@import '../../common/stylus/mixin.styl';

	.shopcart{
		width: 100%;
		height: 48px;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		.content{
			display: flex;
			background: #141d27;
			height: 48px;
			font-size: 0;
			.content-left{
				flex: 1;
				.logo-wrapper{
					display: inline-block;
					vertical-align: top;
					width: 56px;
					height: 56px;
					background: #141d27;
					border-radius: 50%;
					position: relative;
					top: -10px;
					margin: 0 12px;
					padding: 6px;
					box-sizing: border-box;
					.logo{
						width: 100%;
						height: 100%;
						border-radius: 50%;
						background: #2b343c;
						text-align: center;
						&.highlight{
							background: rgb(0,160,220);
						}
						.icon-shopping_cart{
							font-size: 24px;
							color: rgba(255,255,255,0.4);
							line-height: 44px;
							&.highlight{
								color: #fff;
							}
						}
					}
					.num{
						position: absolute;
						right: 0;
						top: 0;
						width: 24px;
						height: 16px;
						line-height: 16px;
						background: red;
						color: #fff;
						font-size: 9px;
						text-align: center;
						border-radius: 16px;
						font-weight: 700;
						box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
					}
				}
				.price{
					display: inline-block;
					vertical-align: top;
					color: rgba(255,255,255,0.4);
					font-size: 16px;
					font-weight: 700;
					border-right: 1px solid rgba(255,255,255,0.2); 
					margin-top: 12px;
					line-height: 24px;
					padding-right: 12px;
					box-sizing: border-box;
					&.highlight{
						color: #fff;
					}
				}
				.desc{
					display: inline-block;
					vertical-align: top;
					margin: 12px 0 0 12px;
					line-height: 24px;
					font-size: 12px;
					color: rgba(255,255,255,0.4);
				}
			}
			.content-right{
				flex: 0 0 105px;
				width: 105px;
				line-height: 48px;
				text-align: center;
				background: #2B333B;
				color: rgba(255,255,255,0.4);
				font-size: 14px;
				&.settlement{
					background: #00b43c;
					color: #fff;
				}
			}
		}
		.ball-container{
			.ball{
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				&.drop-transition{
					transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);
					.inner{
						width: 16px;
						height: 16px;
						border-radius: 50%;
						background: rgb(0,160,220);
						transition: all 0.5s linear;
					}
				}
			}
		}
		.shopcart-list{
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 100%;
			&.fold-transition{
				transition: all 1s ease;
				transform: translate3d(0,-100%,0);
			}
			&.fold-enter,&.fold-leave{
				transform: translate3d(0,0,0);
			}
			.list-header{
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background: #f3f5f7;
				border-bottom: 1px solid rgba(7,17,27,0.1);
				.title{
					font-style: 14px;
					color: rgb(7,17,27);
					font-weight: normal;
					float: left;
				}
				.empty{
					display: block;
					font-size: 12px;
					color: rgb(0,160,220);
					float: right;
				}
			}
			.list-content{
				max-height: 217px;
				overflow: hidden;
				padding: 0 18px;
				background: #fff;
				.food{
					position: relative;
					padding: 12px 0;
					box-sizing: border-box;
					border-1px(rgba(7,17,27,0.1));
					.name{
						line-height: 24px;
						font-size: 14px;
						color: rgb(7,17,27);
					}
					.price{
						position: absolute;
						right: 100px;
						bottom: 12px;
						line-height: 24px;
						font-size: 14px;
						font-weight: bold;
						color: rgb(240,20,20);
					}
					.cartcontrol-wrapper{
						position: absolute;
						right: 0;
						bottom: 6px;
					}
				}
			}
		}
	}
	.list-mask{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(10px);
		transition: all 1s ease;
		&.fade-transition{
			opacity: 1;
			-webkit-opacity: 1;
			background: rgba(7,17,27,0.6);
		}
		&.fade-enter,&.fade-leave{
			opacity: 0;
			-webkit-opacity: 0;
			background: rgba(7,17,27,0);
		}
	}






</style>




































