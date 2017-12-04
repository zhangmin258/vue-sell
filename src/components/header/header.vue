

<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar" alt="商品logo" width="64" height="64">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}} / {{seller.deliveryTime}}分钟送达
				</div>
				<div class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div class="support-count" v-if="seller.supports" @click="showDetail()">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail()">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" alt="" width="100%" height="100%">
		</div>
		<div class="detail" v-show="detailShow" transition="fade">
			<div class="detail-wrapper clearfix">
				<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
					<div class="star-wrapper">
						<star :size="48" :score="seller.score"></star>
					</div>
					<div class="title">
						<div class="line"></div>
						<div class="text">优惠信息</div>
						<div class="line"></div>
					</div>
					<ul v-if="seller.supports" class="supports">
						<li v-for="item in seller.supports" class="support">
							<span class="icon" :class="classMap[seller.supports[$index].type]"></span>
							<span class="text">{{seller.supports[$index].description}}</span>
						</li>
					</ul>
					<div class="title">
						<div class="line"></div>
						<div class="text">商家公告</div>
						<div class="line"></div>
					</div>
					<div class="bulletin">
						<p class="content">{{seller.bulletin}}</p>
					</div>
				</div>
			</div>
			<div class="detail-close" @click="hideDetail()">
				<i class="icon-close"></i>
			</div>
		</div>
	</div>

</template>






<script>

import star from '../star/star.vue';     //评分组件

export default {


	data(){
		return{
			detailShow: false
		}
	},
	props: {
		seller: {
			type: Object
		}
	},
	created(){
		this.classMap = ['decrease','discount','special','invoice','guarantee'];
	},
	methods: {
		showDetail(){
			this.detailShow = true;
		},
		hideDetail(){
			this.detailShow = false;
		}
	},
	components: {
		'star': star
	}
}




</script>







<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl';
	.header{
		color: #fff;
		position: relative;
		background: rgba(7,17,27,0.5);
		overflow: hidden;
		.content-wrapper{
			padding: 24px 12px 18px 24px;
			font-size: 0;
			position: relative;
			.avatar{
				display: inline-block;
				vertical-align: top;
				img{
					border-radius: 2px;
					-webkit-border-radius: 2px;
				}
			}
			.content{
				display: inline-block;
				margin-left: 16px;
				.title{
					margin: 2px 0 8px 0;
					.brand{
						width: 30px;
						height: 18px;
						display: inline-block;
						bg-image('brand');
						background-size: 100%;
						background-repeat: no-repeat;
						vertical-align: top;
					}
					.name{
						font-size: 16px;
						color: rgb(255,255,255);
						font-weight: bold;
						line-height: 18px;
						margin-left: 6px;
					}
				}
				.description{
					margin-bottom: 10px;
					line-height: 12px;
					font-size: 12px;
				}
				.support{
					font-size: 12px;
					.icon{
						width: 12px;
						height: 12px;
						background-size: 100%;
						background-repeat: no-repeat;
						display: inline-block;
						vertical-align: top;
						&.decrease{
							bg-image('decrease_1');
						}
						&.discount{
							bg-image('discount_1');
						}
						&.guarantee{
							bg-image('guarantee_1');
						}
						&.invoice{
							bg-image('invoice_1');
						}
						&.special{
							bg-image('special_1');
						}
					}
					.text{
						line-height: 12px;
						font-size: 10px;
					}
				}
			}
			.support-count{
				position: absolute;
				bottom: 18px;
				right: 12px;
				padding: 0 8px;
				height: 24px;
				line-height: 24px;
				background: rgba(0,0,0,0.2);
				text-align: center;
				border-radius: 14px;
				-webkit-border-radius: 14px;
				.count{
					font-size: 10px;
					vertical-align: top;
				}
				.icon-keyboard_arrow_right{
					font-size: 10px;
					line-height: 24px;
					margin-left: 2px;
				}
			}
		}
		.bulletin-wrapper{
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			background: rgba(7,17,27,0.2);
			position: relative;
			/*font-size: 0;*/
			.bulletin-title{
				width: 22px;
				height: 12px;
				display: inline-block;
				bg-image('bulletin');
				background-size: 100%;
				background-repeat: no-repeat;
				vertical-align: top;
				margin-top: 8px;
			}
			.bulletin-text{
				margin: 0 4px;
				font-size: 12px;
				vertical-align: top;
			}
			.icon-keyboard_arrow_right{
				position: absolute;
				right: 10px;
				bottom: 7px;
				font-size: 12px;
				
			}
		}
		.background{
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			filter: blur(10px);
		}
		.detail{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 100;
			width: 100%;
			height: 100%;
			transition: all 1s ease;
			backdrop-filter: blur(10px);
			&.fade-transition{
				opacity: 1;
				background: rgba(7,17,27,0.8);
			}
			&.fade-enter,&.fade-leave{
				opacity: 0;
				background: rgba(7,17,27,0);
			}
			.detail-wrapper{
				min-height: 100%;
				width: 100%;
				.detail-main{
					margin-top: 64px;
					padding-bottom: 64px;
					.name{
						font-size: 16px;
						line-height: 16px;
						text-align: center;
						font-weight: 700;
					}
					.star-wrapper{
						text-align: center;
						margin-top: 18px;
						padding: 2px 0;
					}
					.title{
						width: 80%;
						display: flex;
						margin: 30px auto;
						.line{
							flex: 1;
							position: relative;
							top: -6px;
							border-bottom: rgba(255,255,255,0.4) solid 1px;
						}
						.text{
							font-size: 14px;
							padding: 0 12px;
							font-weight: 700;
						}
					}
					.supports{
						width: 80%;
						margin: 0 auto;
						.support{
							margin: 12px 0 12px 12px;
							.icon{
								width: 18px;
								height: 18px;
								background-size: 100%;
								background-repeat: no-repeat;
								display: inline-block;
								vertical-align: top;
								&.decrease{
									bg-image('decrease_2');
								}
								&.discount{
									bg-image('discount_2');
								}
								&.guarantee{
									bg-image('guarantee_2');
								}
								&.invoice{
									bg-image('invoice_2');
								}
								&.special{
									bg-image('special_2');
								}
							}
							.text{
								line-height: 12px;
								font-size: 12px;
								margin-left: 6px;
							}
						}
					}
					.bulletin{
						width: 80%;
						margin:  0 auto;
						.content{
							line-height: 24px;
							font-size: 12px;
							margin: 0 12px;
							letter-spacing: 1px;
						}
					}
				}
			}
			.detail-close{
				position: relative;
				width: 32px;
				height: 32px;
				margin: -64px auto 0 auto;
				font-size: 32px;
				clear: both;
			}
		}
	}



</style>



