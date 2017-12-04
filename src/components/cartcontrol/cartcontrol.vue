



<template>
	<div class="cartcontrol">
		<div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart" transition="move">
			<span class="inner icon-remove_circle_outline"></span>
		</div>
		<div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart">
			
		</div>
	</div>
</template>





<script>

import Vue from 'vue';

export default {

	props: {
		food: {
			type: Object
		}
	},
	methods: {
		addCart(event){
			if(!event._constructed){    //在pc端执行的时候,解决重复执行事件处理函数
				return;
			}
			if(!this.food.count){
				Vue.set(this.food,'count',1);  //添加自定义字段的时候，用Vue.set()这个方法
			}else{
				this.food.count ++;
			}
			this.$dispatch('cart.add',event.target);   //派发一个事件，将对象本身作为参数传入给父组件
		},
		decreaseCart(event){
			if(!event._constructed){
				return;
			}
			if(this.food.count){
				this.food.count --;
			}
		}
	}
}

</script>




<style lang="stylus" rel="stylesheet/stylus">
	
	.cartcontrol{
		font-size: 0;
		.cart-decrease{
			display: inline-block;
			padding: 6px;
			transition: all 0.5s linear;
			&.move-transition{
				opacity: 1;
				transform: translate3d(0,0,0);
				.inner{
					display: inline-block;
					line-height: 24px;
					font-size: 24px;
					color: rgb(0,160,220);
					transition: all 0.5s linear;
					transform: rotate(0deg);
				}
			}
			&.move-enter, &.move-leave{
				opacity: 0;
				transform: translate3d(24px,0,0);
				.inner{
					transform: rotate(180deg);
				}
			}
		}
		.cart-count{
			display: inline-block;
			vertical-align: top;
			width: 16px;
			padding-top: 6px;
			line-height: 24px;
			text-align: center;
			font-size: 12px;
			color: rgb(147,153,159);
		}
		.cart-add{
			display: inline-block;
			padding: 6px;
			line-height: 24px;
			font-size: 24px;
			color: rgb(0,160,220);
		}
	}



</style>


















