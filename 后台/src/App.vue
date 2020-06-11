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
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }
      })
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
    height:12px;
    position: relative;
    top: 1px;
  }
</style>