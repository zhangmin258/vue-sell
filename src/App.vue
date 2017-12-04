<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
            <div class="tab-item">
                <a v-link="{path: '/goods'}">商品</a>
            </div>
            <div class="tab-item">
                <a v-link="{path: '/ratings'}">评论</a>
            </div>
            <div class="tab-item">
                <a v-link="{path: '/seller'}">商家</a>
            </div>
        </div>
        <div class="content">
            <router-view :seller="seller" keep-alive></router-view>
        </div>
    </div>
</template>




<script>

import Header from './components/header/header.vue'
import {urlParse} from 'common/js/utill.js'

const ERR_OK = 0;

export default {
    data(){
        return{
            seller: {
                id: (() => {
                    let queryParam = urlParse();
                    return queryParam.id;
                })()
            }
        }
    },
    created(){
        this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
            var response = response.data;
            if(response.errno === ERR_OK){
                // this.seller = response.data;
                this.seller = Object.assign({},this.seller,response.data);
                // console.log(this.seller.id);
            }
        });
    },
    components: {
        'v-header': Header
    }
}


</script>




<style lang="stylus" rel="stylesheet/stylus">

    @import './common/stylus/mixin.styl';

    .tab{
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
       /* border-bottom: 1px solid rgba(7,17,27,0.1);*/
       border-1px(rgba(7,17,27,0.1));
        .tab-item{
            flex: 1;
            text-align: center;
            a{
                display: block;
                color: rgb(77,85,93);
                font-size: 14px;
            }
            a.active{
                color: rgb(240,20,20);
            }
        }
    }
    
    
</style>
