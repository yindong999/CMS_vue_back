<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enquireScreen from '@/utils/device'
  import { generateIndexRouter } from "@/utils/util"
  import Vue from 'vue'
  export default {
    data () {
      return {
        locale: zhCN,
      }
    },
    created () {
			$ejl.initFrameWork({
				appid:"2949",//一级菜单里的按钮请勿修改！固定值，业务系统ID
				token:"a058d38ed9b34684a9e40c29b25a3db4",//请勿修改！固定值，应用系统token，
				ucode:'19014919', // 获取当前登陆评价人的工号或ID，并填入此参数中
				objId:'',//订单号，若有请写在此处，若无则不填
				modId:'',//若配置流程及节点评价，请填写流程节点标识、被评价人ID或工号、页面URL等，
				modname:'',//若配置流程及节点评价，请填写流程节点标识名称、被评价人ID或工号名称、页面URL名称等
				pCode:'S01856',//流程编码，可根据以下对流程编码应编码：内容中心:S01856;填写跳转相应评价模块
				sysDefined:'',//用户自定义字段，导出数据默认带出
				devmodel:'pro',//请勿刪除
			});
      let that = this
      window.onload = function() {
        /*1366代表设计师给的设计稿的宽度，你的设计稿是多少，就写多少;10代表换算比例，这里写10是
    为了以后好算,比如，你测量的一个宽度是20px,就可以写为1rem,以及2px=0.1rem等等*/
        that.getRem(1600, 20);
      };
      that.getRem(1600, 20);
      window.onresize = function() {
        that.getRem(1600, 20);
      };

      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }
      })
    },
    methods:{
      getRem(pwidth, prem) {
        let html = document.documentElement;
        let body = document.body;
        let oWidth = window.outerWidth ? window.outerWidth : screen.width;
        console.log(oWidth,pwidth)
        if(oWidth<1360){
          html.style.width = '1360px'
          // html.style.fontSize = (1366 / pwidth) * prem + "px";
          // body.style.fontSize = (1366 / pwidth) * prem + "px";
        }else{
          html.style.width = '100%'
          // html.style.fontSize = (oWidth / pwidth) * prem + "px";
          // body.style.fontSize = (oWidth / pwidth) * prem + "px";
        }

      }
    }
  }
</script>
<style>
  #app,body,html {
	width: 100%;
    height: 100%;
  }
   .ant-message-notice-content{
  padding:13px 30px!important;
}
.ant-message-custom-content .anticon-check-circle{
  font-size:20px!important;
}
.ant-message-custom-content .anticon-exclamation-circle{
  font-size:20px!important;
}
.ant-message-custom-content .anticon-close-circle{
  font-size:20px!important;
}
.ant-message-custom-content span{
    font-size:20px!important;
}
.ant-spin-nested-loading{
  z-index:0!important;
}
th.table_title{
    background-color: #F7F7FB !important;
  }
th.ant-table-selection-column{
    background-color: #F7F7FB !important;
  }
  /* 鼠标悬浮到表格中有点点点文字上时的样式 */
  .mouseHover {
  color: #595959;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  width: 100px;
  display: inline-block;
}
.ant-card-hoverable{
  cursor:default!important;
}
.bb_title{
  color:#55565D;font-size:14px;font-weight:500;background:#F7F7FB;height:32px;line-height:32px;border-radius:4px;padding-left:24px!important;
}
  /* 确认按钮样式 */
  .affirmBtn{
    padding:0 40px!important;
    height:36px!important;
  }
  /* 取消按钮样式 */
  .abolishBtn{
    padding:0 40px!important;
    height:36px!important;
    margin-left:16px!important;
  }
  /* 按钮高度 */
  .btnHeight{
    height:36px!important;
  }
  /* 查询按钮样式 */
  .queryBtn{
    width: 84px;
    font-weight: 400;
    display: flex!important;
    justify-content: space-between!important;
    align-items: center!important;
    padding: 0 16px!important;
  }
   /* 查询按钮中的icon样式 */
  .queryBtnImg{
    width:12px;
    height:13px;
    position: relative;
    top: 1px;
  }
  .ant-select-dropdown{

  }
  .btnCol{
  display:flex!important;align-items:center;justify-content:flex-end;right: 32px;
    top: 24px;
}
.outerText{
  display:flex;align-items:center;height:14px;line-height:14px;margin-right:14px;
}
.spreadText{
  font-size:14px;color:#3264D5;margin-right:2px;cursor:pointer;user-select:none;
}
.formStyle{
   display:flex!important;
   justify-content:space-between;
}
.ant-card-extra{
  height: 56px!important;
  padding: 13px 0!important;
}
.downUp{
  font-size:12px;
  color:#3264D5;
  cursor:pointer;
}
.leftDiv{
 width:calc(100% - 170px);display:flex;
}
.inputWidth{
  width:70%;margin-left: 16px;
}
.selectCol{
  display:flex;align-items:center;
}
.textWidth4{
  width:56px;
}
.textWidth2{
  width:28px;
}
  /*按钮点击滑过之后的效果更改*/
  /*.ant-btn-primary:hover, .ant-btn-primary:focus{*/
    /*background-color: #3264d5!important;*/
    /*border-color: #3264d5!important;*/
  /*}*/
</style>