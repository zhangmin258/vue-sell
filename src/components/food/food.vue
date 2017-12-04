


<template>
	<div class="food" v-show="showFlag" transition="move" v-el:food>
		<div class="food-content">
			<div class="image-header">
				<img :src="food.image" alt="">
				<div class="back" @click="back">
					<i class="icon-arrow_lift"></i>
				</div>
			</div>
			<div class="content">
				<h1 class="title">{{food.name}}</h1>
				<div class="detail">
					<span class="sell-count">月售{{food.sellCount}}份</span>
					<span class="rating">好评率{{food.rating}}%</span>
				</div>
				<div class="price">
					<span class="new-price">￥{{food.price}}</span>
					<del class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</del>
				</div>
				<div class="cartcontrol-wrapper">
					<cartcontrol :food="food"></cartcontrol>
				</div>
				<div class="buy" v-show="!food.count || food.count == 0" transition="fade" @click="addFirst">加入购物车</div>
			</div>
			<split v-show="food.info"></split>
			<div class="introduction" v-show="food.info">
				<h1 class="title">商品介绍</h1>
				<p class="info">{{food.info}}</p>
			</div>
			<split></split>
			<div class="rating">
				<h1 class="title">商品评价</h1>
				<ratingselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
				<div class="rating-wrapper">
					<ul v-show="food.ratings && food.ratings.length">
						<li v-for="rating in food.ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
							<div class="user">
								<span class="name">{{rating.username}}</span>
								<img class="avatar" width="12" height="12" :src="rating.avatar">
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
							<p class="text">
								<span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></span>
								{{rating.text}}
							</p>
						</li>
					</ul>
					<div class="no-rating" v-show="!food.ratings || food.ratings.length === 0">暂无评价</div>
				</div>
			</div>
		</div>
	</div>
</template>




<script>

import Vue from 'vue'
import Bscroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import split from '../split/split.vue'
import ratingselect from '../ratingselect/ratingselect.vue'
import {formatDate} from '../../common/js/date.js'    //时间过滤器

const ALL = 2;   //所有评价
// const POSITIVE = 0;    //正面评价
// const NEGATIVE = 1;    //负面评价

export default {
	data(){
		return{
			showFlag: false,
			selectType: ALL,
			onlyContent: true,
			desc: {
				all: '全部',
				positive: '推荐',
				negative: '吐槽'
			}
		}
	},
	props: {
		food: {
			type: Object
		}
	},
	methods: {
		show(){    //该方法用来被父组件调用
			this.showFlag = true;
			this.selectType = ALL;
			this.onlyContent = false;
			this.desc = {
				all: '全部',
				positive: '推荐',
				negative: '吐槽'
			};
			this.$nextTick(() => {   //等待数据渲染完毕，然后再加载DOM
				if(!this.scroll){
					this.scroll = new Bscroll(this.$els.food,{
						click: true
					});
				}else{
					this.scroll.refresh();
				}
			});
		},
		back(){
			this.showFlag = false
		},
		addFirst(e){
			if(!e._constructed){
				return;
			}
			Vue.set(this.food,'count',1);
			this.$dispatch('cart.add',event.target);   //派发一个事件，将对象本身作为参数传入给父组件
		},
		needShow(type,text){
			if(this.onlyContent && !text){
				return false;
			}
			if(this.selectType === ALL){
				return true;
			}else{
				return type === this.selectType;
			}
		}
	},
	events: {
		'ratingtype.select'(type){
			this.selectType = type;
			this.$nextTick(() => {
				this.scroll.refresh();
			});
		},
		'content.toggle'(onlyContent){
			this.onlyContent = onlyContent;
			this.$nextTick(() => {
				this.scroll.refresh();
			});
		}
	},
	components: {
		'cartcontrol': cartcontrol,
		'split': split,
		'ratingselect': ratingselect
	},
	filters: {
		formatDate(time){
			let date = new Date(time);
			return formatDate(date,'yyyy-MM-dd hh:mm');
		}
	}
}

</script>





<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '../../common/stylus/mixin.styl';
	.food{
		position: fixed;
		z-index: 30;
		left: 0;
		top: 0;
		bottom: 48px;
		width: 100%;
		height: 100%;
		background: #fff;
		&.move-transition{
			transition: all 1s ease;
			transform: translate3d(0,0,0);
		}
		&.move-enter,&.move-leave{
			transform: translate3d(100%,0,0);
		}
		.food-content{
			.image-header{
				position: relative;
				width: 100%;
				height: 0;
				padding-top: 100%;
				img{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
				.back{
					position: absolute;
					top: 0;
					left: 0;
					.icon-arrow_lift{
						display: block;
						padding: 10px;
						color: #fff;
						font-size: 20px;
					}
				}
			}
			.content{
				position: relative;
				padding: 18px;
				.title{
					font-size: 14px;
					font-weight: bold;
					line-height: 14px;
					color: rgb(7,17,27);
					margin-bottom: 8px;
				}
				.detail{
					margin-bottom: 18px;
					font-size: 0;
					span{
						display: inline-block;
						font-size: 10px;
						line-height: 10px;
						color: rgb(147,153,159);
						margin-right: 12px;
					}
				}
				.price{
					font-weight: bold;
					line-height: 24px;
					.new-price{
						font-size: 20px/28px;
						color: rgb(240,20,20);
					}
					.old-price{
						font-size: 10px;
						color: rgb(147,153,159);
					}
				}
				.cartcontrol-wrapper{
					position: absolute;
					right: 12px;
					bottom: 12px;
				}
				.buy{
					position: absolute;
					z-index: 10;
					right: 18px;
					bottom: 18px;
					height: 24px;
					line-height: 24px;
					padding: 0 12px;
					box-sizing: border-box;
					font-size: 10px;
					color: #fff;
					background: rgb(0,160,220);
					border-radius: 12px;
					-webkit-border-radius: 12px;
					&.fade-transition{
						transition: all 0.2s;
						opacity: 1;
					}
					&.fade-enter,&.fade-leave{
						opacity: 0;
					}
				}
			}
			.introduction{
				padding: 18px;
				.title{
					font-size: 14px;
					line-height: 14px;
					color: rgb(7,17,27);
					margin-bottom: 8px;
				}
				.info{
					font-size: 12px;
					line-height: 24px;
					color: rgb(77,85,93);
					padding: 0 8px;
				}
			}
			.rating{
				padding-top: 18px;
				.title{
					font-size: 14px;
					line-height: 14px;
					color: rgb(7,17,27);
					margin-left: 18px;
				}
				.rating-wrapper{
					padding: 0 18px;
					.rating-item{
						position: relative;
						padding: 16px 0;
						border-1px(rgba(7,17,27,0.1));
						.user{
							position: absolute;
							right: 0;
							top: 16px;
							line-height: 12px;
							font-size: 0;
							.name{
								display: inline-block;
								margin-right: 6px;
								font-size: 10px;
								color: rgb(147,153,159);
							}
							.avatar{
								display: inline-block;
								border-radius: 50%;
							}
						}
						.time{
							font-size: 10px;
							color: rgb(147,153,159);
							line-height: 12px;
							margin-bottom: 6px;
						}
						.text{
							font-size: 12px;
							line-height: 16px;
							color: rgb(7,17,27);
							.icon-thumb_up,.icon-thumb_down{
								line-height: 24px;
								font-size: 12px;
								margin-right: 4px;
							}
							.icon-thumb_up{
								color: rgb(0,160,220);
							}
							.icon-thumb_down{
								color: rgb(147,153,159);
							}
						}
					}
					.no-rating{
						padding: 16px 0;
						font-size: 12px;
						color: rgb(147,153,159);
						text-align: center;
					}
				}
			}
		}
	}



</style>























































