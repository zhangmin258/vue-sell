




<template>
	<div class="seller" v-el:seller>
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2 class="title">起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2 class="title">商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2 class="title">平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite">
					<span class="icon-favorite" :class="{'active': favorite}" @click="toggleFavorite($event)"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="notice">
				<h1 class="title">公告与活动</h1>
				<p class="info">{{seller.bulletin}}</p>
				<ul class="supports" v-if="seller.supports">
					<li class="support" v-for="item in seller.supports">
						<span class="icon" :class="classMap[item.type]"></span>
						<span class="text">{{item.description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pics-wrapper" v-el:pics-wrapper>
					<ul class="pics-list" v-el:pics-list>
						<li class="pics-item" v-for="item in seller.pics"><img :src="item" alt="" width="120" height="90"></li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info in seller.infos">{{info}}</li>
				</ul>
			</div>
		</div>
	</div>


</template>




<script>

import Bscroll from 'better-scroll'
import star from '../star/star.vue'
import split from '../split/split.vue'
import {saveToLocal,loadFromLocal} from '../../common/js/store.js'

export default {
	data(){
		return{
			favorite: (() => {
				return loadFromLocal(this.seller.id,'favorite',false);    //点击收藏的时候读取该商家的ID
			})()   //立即执行函数
		}
	},
	computed: {
		favoriteText(){
			return this.favorite ? '已收藏' : '收藏';
		}
	},
	props: {
		seller: {
			type: Object
		}
	},
	components: {
		'star': star,
		'split': split
	},
	created(){
		this.classMap = ['decrease','discount','special','invoice','guarantee'];
	},
	methods: {
		toggleFavorite(evevt){
			if(!evevt._constructed){
				return;
			}
			this.favorite = !this.favorite;
			saveToLocal(this.seller.id,'favorite',this.favorite);   //点击收藏的时候存储该商家的ID
		},
		_initScroll(){   //初始化滚动
			if(!this.scroll){
				this.scroll = new Bscroll(this.$els.seller,{
					click: true
				});
			}else{
				this.scroll.refresh();
			}
		},
		_initPicScroll(){
			if(this.seller.pics){
				let picWidth = 120;
				let margin = 6;
				let width = (picWidth + margin) * this.seller.pics.length - margin;
				this.$els.picsList.style.width = width + 'px';
				this.$nextTick(() => {
					if(!this.picScroll){
						this.picScroll = new Bscroll(this.$els.picsWrapper,{
							scrollX: true,
							eventPassthrough: 'vertical'  //X轴滚动的时候禁止Y轴滚动
						});
					}else{
						this.picScroll.refresh();
					}
				});
			}
		}
	},
	watch: {    //监听数据的变化
		'seller'(){     //当seller数据加载成功之后
			this._initScroll();
			this._initPicScroll();
		}
	},
	ready(){
		this._initScroll();
		this._initPicScroll();
	}
}



</script>




<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl';
	.seller{
		position: absolute;
		top: 174px;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		.overview{
			padding: 18px;
			position: relative;
			.title{
				line-height: 14px;
				font-size: 14px;
				color: rgb(7,17,27);
				margin-bottom: 8px;
			}
			.desc{
				font-size: 0;
				padding-bottom: 18px;
				line-height: 18px;
				border-bottom: 1px solid rgba(7,17,27,0.1);
				.star{
					display: inline-block;
					margin-right: 8px;
					vertical-align: top;
				}
				.text{
					display: inline-block;
					margin-right: 12px;
					font-size: 10px;
					color: rgb(77,85,93);
					vertical-align: top;
				}
			}
			.remark{
				padding-top: 18px;
				display: flex;
				.block{
					flex: 1;
					text-align: center;
					border-right: 1px solid rgba(7,17,27,0.1);
					&:last-child{
						border-right: none;
					}
					.title{
						font-size: 10px;
						line-height: 10px;
						color: rgb(147,153,159);
						margin-bottom: 4px;
						font-weight: normal;
					}
					.content{
						font-size: 10px;
						color: rgb(7,17,27);
						line-height: 24px;
						.stress{
							font-size: 24px;
						}
					}
				}
			}
			.favorite{
				position: absolute;
				right: 11px;
				top: 18px;
				width: 50px;
				text-align: center;
				.icon-favorite{
					display: block;
					margin-bottom: 4px;
					font-size: 24px;
					color: #d4d6d9;
					&.active{
						color: red;
					}
				}
				.text{
					color: rgb(77,85,93);
					font-size: 10px;
				}
			}
		}
		.notice{
			padding: 18px 18px 0 18px;
			.title{
				font-size: 14px;
				line-height: 14px;
				color: rgb(7,17,27);
				margin-bottom: 8px;
			}
			.info{
				padding: 0 12px 16px 12px;
				font-size: 12px;
				line-height: 24px;
				color: rgb(240,20,20);
				border-bottom: 1px solid rgba(7,17,27,0.1);
			}
			.supports{
				.support{
					padding: 16px 12px;
					font-size: 0;
					border-bottom: 1px solid rgba(7,17,27,0.1);
					&:last-child{
						border-bottom: none;
					}
					.icon{
						display: inline-block;
						vertical-align: top;
						width: 16px;
						height: 16px;
						margin-right: 6px;
						background-size: 100%;
						background-repeat: no-repeat;
						&.decrease{
							bg-image('decrease_4');
						}
						&.discount{
							bg-image('discount_4');
						}
						&.guarantee{
							bg-image('guarantee_4');
						}
						&.invoice{
							bg-image('invoice_4');
						}
						&.special{
							bg-image('special_4');
						}
					}
					.text{
						line-height: 16px;
						font-size: 12px;
						color: rgb(7,17,27);
					}
				}
			}
		}
		.pics{
			padding: 18px;
			.title{
				font-size: 14px;
				line-height: 14px;
				color: rgb(7,17,27);
				margin-bottom: 12px;
			}
			.pics-wrapper{
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				.pics-list{
					font-size: 0;
					.pics-item{
						width: 120px;
						height: 90px;
						display: inline-block;
						margin-right: 6px;
						&:last-child{
							margin-right: 0;
						}
					}
				}
			}
		}
		.info{
			padding: 18px;
			.title{
				font-size: 14px;
				line-height: 14px;
				color: rgb(7,17,27);
				padding-bottom: 12px;
				border-bottom: 1px solid rgba(7,17,27,0.1);
			}
			.info-item{
				border-bottom: 1px solid rgba(7,17,27,0.1);
				padding: 16px 12px;
				font-size: 12px;
				line-height: 16px;
				color: rgb(7,17,27);
				&:last-child{
					border-bottom: none;
				}
			}
		}
	}

</style>
















