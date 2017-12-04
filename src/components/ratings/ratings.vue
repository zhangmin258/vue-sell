



<template>
	<div class="ratings" v-el:ratings>
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="comprehensiveScore">综合评分</div>
					<div class="above">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" alt="" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送到</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="item in rating.recommend" class="recommend-item">{{item}}</span>
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
						</div>
					</li>
				</ul>

			</div>
		</div>
	</div>


</template>




<script>

import Vue from 'vue'
import Bscroll from 'better-scroll'
import star from '../star/star.vue'
import split from '../split/split.vue'
import ratingselect from '../ratingselect/ratingselect.vue'
import {formatDate} from '../../common/js/date.js'    //时间过滤器

const ALL = 2;
const ERR_OK = 0;

export default {
	data(){
		return {
			ratings: [],
			selectType: ALL,
			onlyContent: true,
			desc: {
				all: '全部',
				positive: '满意',
				negative: '不满意'
			}
		}
	},
	props: {
		seller: {
			type: Object
		}
	},
	created(){
		this.$http.get('/api/ratings').then((response) => {
			var response = response.data;
			if(response.errno === ERR_OK){
				this.ratings = response.data;
				this.$nextTick(() => {
					this.scroll = new Bscroll(this.$els.ratings,{
						click: true
					});
				});
			}
		});
	},
	methods: {
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
	components: {
		'star': star,
		'split': split,
		'ratingselect': ratingselect
	},
	filters: {
		formatDate(time){
			let date = new Date(time);
			return formatDate(date,'yyyy-MM-dd hh:mm');
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
}



</script>




<style lang="stylus" rel="stylesheet/stylus">

	.ratings{
		position: absolute;
		top: 174px;
		bottom: 0;
		left: 0;
		overflow: hidden;
		width: 100%;
		.overview{
			padding: 18px 0;
			display: flex;
			.overview-left{
				flex: 0 0 137px;
				width: 137px;
				border-right: 1px solid rgba(7,17,27,0.1);
				text-align: center;
				padding: 6px 0;
				@media only screen and (max-width: 320px) {
					flex: 0 0 120px;
					width: 120px;
				}
				.score{
					font-size: 24px;
					line-height: 28px;
					color: rgb(255,150,0);
					margin-bottom: 6px;
				}
				.comprehensiveScore{
					font-size: 12px;
					line-height: 12px;
					color: rgb(7,17,27);
					margin-bottom: 8px;
				}
				.above{
					font-size: 10px;
					line-height: 10px;
					color: rgb(147,153,159);
				}
			}
			.overview-right{
				flex: 1;
				padding: 6px 0px 6px 24px;
				@media only screen and (max-width: 320px) {
					padding-left: 6px;
				}
				.score-wrapper{
					margin-bottom: 8px;
					font-size: 0;
					.title{
						display: inline-block;
						font-size: 12px;
						color: rgb(7,17,27);
						line-height: 18px;
					}
					.star{
						display: inline-block;
						margin: 0 12px;
						line-height: 18px;
					}
					.score{
						font-size: 12px;
						color: rgb(255,153,0);
						line-height: 18px;
					}
				}
				.delivery-wrapper{
					font-size: 0;
					.title{
						display: inline-block;
						font-size: 12px;
						color: rgb(7,17,27);
					}
					.delivery{
						font-size: 12px;
						margin-left: 12px;
						color: rgb(147,153,159);
					}
				}
			}
		}
		.rating-wrapper{
			padding: 0 18px;
			.rating-item{
				display: flex;
				padding: 18px 0;
				border-bottom: 1px solid rgba(7,17,27,0.1);
				.avatar{
					flex: 0 0 28px;
					width: 28px;
					margin-right: 12px;
					img{
						border-radius: 50%;
					}
				}
				.content{
					position: relative;
					flex: 1;
					.name{
						font-size: 10px;
						line-height: 12px;
						color: rgb(7,17,27);
						margin-bottom: 4px;
					}
					.star-wrapper{
						font-size: 0;
						margin-bottom: 6px;
						.star{
							display: inline-block;
						}
						.delivery{
							display: inline-block;
							font-size: 10px;
							line-height: 12px;
							color: rgb(147,153,159);
							margin-left: 6px;
						}
					}
					.text{
						margin-bottom: 8px;
						font-size: 12px;
						line-height: 18px;
						color: rgb(7,17,27);
					}
					.recommend{
						font-size: 0;
						line-height: 16px;
						.icon-thumb_up{
							display: inline-block;
							font-size: 12px;
							color: rgb(0,160,220);
							margin: 0 8px 4px 0;
						}
						.recommend-item{
							display: inline-block;
							font-size: 9px;
							color: rgb(147,153,159);
							border: 1px solid rgba(7,17,27,0.1);
							border-radius: 2px;
							padding: 0 6px;
							line-height: 16px;
							margin: 0 8px 4px 0;
							background: #fff;
						}
					}
					.time{
						position: absolute;
						right: 0;
						top: 0;
						font-size: 10px;
						line-height: 12px;
						color: rgb(147,153,159);
					}
				}
			}
		}
	}



</style>

























