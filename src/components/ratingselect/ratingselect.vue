






<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span class="block all" :class="{'active': selectType === 2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span class="block positive" :class="{'active': selectType === 0}" @click="select(0,$event)">{{desc.positive}}<span class="count">
			{{positives.length}}</span></span>
			<span class="block negative" :class="{'active': selectType === 1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" :class="{'on': onlyContent === true}" @click="toggleContent">
			<i class="icon-check_circle"></i>
			<span class="content">只看有内容的评价</span>
		</div>
	</div>
</template>





<script>

const ALL = 2;   		//所有评价
const POSITIVE = 0;    //正面评价
const NEGATIVE = 1;    //负面评价


export default {
	props: {
		ratings: {       //评价信息
			type: Array,
			default(){
				return [];
			}
		},
		selectType: {      //评价类型：0,1,2
			type: Number,
			default: ALL
		},
		onlyContent: {     //是否显示评价内容
			type: Boolean,
			default: false
		},
		desc: {
			type: Object,
			default(){
				return {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		}
	},
	methods: {
		select(type,e){
			if(!e._constructed){
				return;
			}
			this.selectType = type;
			this.$dispatch('ratingtype.select',type);  //派发一个事件，将参数传给父组件，这样父组件就可以时时监听参数的变化
		},
		toggleContent(event){
			if(!event._constructed){
				return;
			}
			this.onlyContent = !this.onlyContent;
			this.$dispatch('content.toggle',this.onlyContent);  
		}
	},
	computed: {
		positives(){
			return this.ratings.filter((rating) => {    //过滤这个数组
				return rating.rateType = POSITIVE;
			});
		},
		negatives(){
			return this.ratings.filter((rating) => {    //过滤这个数组
				return rating.rateType = NEGATIVE;
			});
		}
	}
}

</script>





<style lang="stylus" rel="stylesheet/stylus">
	
	.ratingselect{
		.rating-type{
			padding: 18px 0;
			margin-left: 18px;
			margin-right: 18px;
			border-bottom: 1px solid rgba(7,17,27,0.1);
			font-size: 0;
			.block{
				display: inline-block;
				padding: 8px 12px;
				line-height: 16px;
				font-size: 12px;
				margin-right: 8px;
				border-radius: 2px;
				color: rgb(77,85,93);
				.count{
					font-size: 8px;
					margin-left: 2px;
				}
				&.active{
					color: #fff;
				}
			}
			.all{
				background: rgba(0,160,220,0.2);
				&.active{
					background: rgb(0,160,220);
				}
			}
			.positive{
				background: rgba(0,160,220,0.2);
				&.active{
					background: rgb(0,160,220);
				}
			}
			.negative{
				background: rgba(77,85,93,0.2);
				&.active{
					background: rgb(77,85,93);
				}
			}
		}
		.switch{
			padding: 12px 18px;
			border-bottom: 1px solid rgba(7,17,27,0.1);
			line-height: 24px;
			color: rgb(147,153,159);
			font-size: 0px;
			&.on{
				color: #00c850;
			}
			.icon-check_circle{
				display: inline-block;
				vertical-align: top;
				font-size: 24px;
				margin-right: 4px;
			}
			.content{
				display: inline-block;
				vertical-align: top;
				font-size: 12px;
			}
		}
	}
	



</style>






















































































