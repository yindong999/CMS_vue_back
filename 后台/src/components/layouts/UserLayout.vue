<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container" :style="{background:'url(' + require('@/assets/login_bg.png') + ') no-repeat',backgroundSize:'100% 100vh'}">
      <!-- <div class="title"> -->
        <!-- <span>Haier</span> -->
         <a-row class="title">
          <a-col style="display:flex;width:1200px;margin:0 auto;"> 
            <img src="@/assets/logo_title3.png" style="height:50px;" alt="">
            <!-- <span class="p">内容营销中心</span> -->
          </a-col> 
         </a-row>
      <!-- </div> -->
      <div class="content">
        <!-- 让运营更便捷 -->

        <a-row style="width: 55%;">
          <a-col>
        <a-row>
          <a-col class="col1">让运营更便捷</a-col>
        </a-row>
        <a-row>
          <a-col class="col2">一站式多平台发布</a-col>
        </a-row>
        <a-row>
          <a-col style="" class="listImg">
            <img src="@/assets/login_wx.png" alt="">
            <img src="@/assets/login_xl.png" alt="">
            <img src="@/assets/login_tt.png" alt="">
            <img src="@/assets/login_dy.png" alt="">
            <img src="@/assets/login_zj.png" alt="">
            <img src="@/assets/login_haier.png" alt="">
          </a-col>
        </a-row>
        </a-col>
        </a-row>

        <route-view></route-view>
      </div>
    </div>
  </div>
</template>

<script>
  import RouteView from "@/components/layouts/RouteView"
  import { mixinDevice } from '@/utils/mixin.js'

  export default {
    name: "UserLayout",
    components: { RouteView },
    mixins: [mixinDevice],
    data () {
      return {}
    },
    mounted () {
      document.body.classList.add('userLayout')
    },
    beforeDestroy () {
      document.body.classList.remove('userLayout')
    },
  }
</script>

<style lang="scss" scoped>
.col1{
   color:#fff;font-size:36px;line-height:36px;font-weight:400;margin-bottom:24px;letter-spacing:8px;font-family:SourceHanSansCN-Regular,SourceHanSansCN;
}
.col2{
  color:#fff;font-size:56px;line-height:56px;font-weight:bold;margin-bottom:56px;font-family:SourceHanSansCN-Bold,SourceHanSansCN;
}
.listImg{
  img{
   margin-right:24px;
   width:60px;
   height:60px;
  }
}
  #userLayout.user-layout-wrapper {
    height: 100%;
    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }
    .container {
      width: 100%;
      min-height: 100%;
      position: relative;
      overflow: hidden;
      .title{
        // display:flex;
        // width:500px;
        // align-items: center;
        padding-top: 22px;
        // margin-left:200px;
        span{
          color:#fff;
          font-size:34px;
        }
        .p{
          margin:0;
          padding:0;
          font-size:20px;
          // line-height: 20px;
          color:#fff;
          font-weight:600;
          margin-left:16px;
          font-family:PingFangSC-Semibold,PingFang SC;
        }
      }
      .content{
        display:flex;
        align-items: center;
        justify-content: space-between;
        // justify-content: space-around;
        height:85vh;
        // margin-top:30px;
        width:1200px;
        margin:0 auto;
      }
      .main {
        min-width: 260px;
        width: 368px;
      }
      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>