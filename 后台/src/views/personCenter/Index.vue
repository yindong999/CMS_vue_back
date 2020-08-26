<template>
  <div>
    <div class="top">
      <img src="../../assets/personImg.png" class="personBg" alt />
      <img :src="avatar()?avatar():src" alt class="tx" />
      <span class="name">{{username()?username():'--'}}</span>
    </div>
    <div class="bott" :style="{paddingBottom:'10px',height:tabHeight + 'px'}">
      <a-row type="flex" style="width:100%;">
        <a-col :span="12">
          <p>基本信息</p>
          <ul>
            <li>
              <span>用户账号：</span>
              <span>{{userInfo()['userAccount']?userInfo()['userAccount']:'--'}}</span>
            </li>
            <li>
              <span>用户名称：</span>
              <span>{{userInfo()['userName']?userInfo()['userName']:'--'}}</span>
            </li>
            <li>
              <span>所在部门：</span>
              <span>{{userInfo()['userDepartmentName']?userInfo()['userDepartmentName']:'--'}}</span>
            </li>
            <li>
              <span>电子邮箱：</span>
              <span>{{userInfo()['userEmail']?userInfo()['userEmail']:'--'}}</span>
            </li>
          </ul>
        </a-col>
        <a-col :span="12">
          <a-row type="flex" justify="center">
            <img :src="codeImage" alt style="width:180px;height:180px;" />
          </a-row>
          <a-row
            style="color:#767885;font-size:14px;margin:10px 0;"
            type="flex"
            justify="center"
          >扫描二维码可在手机上审核发布</a-row>
        </a-col>
      </a-row>
    </div>
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
    <hint ref="hint" :message="message" :description="description" :type="type"></hint>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import tooltip from '@/components/tooltip/tooltip.vue'
import hint from '@/components/tooltip/hint.vue'
export default {
  data() {
    return {
      //   codeImage:require('@/assets/gongzhonghao_prod.jpg'), // 生产环境公众号二维码
      codeImage: require('@/assets/gongzhonghao_test.jpg'), // 测试环境公众号二维码
      message: '提示信息',
      type: 'success',
      description: '操作成功',
      src: '../../assets/tx.png', // 头像默认地址
      tabHeight:0
    }
  },
  components: { tooltip, hint },
  /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  mounted() {
    this.setHeight()
  },
  computed: {},
  methods: {
    ...mapGetters(['username', 'avatar', 'userInfo']),
    dbclick() {
      // this.$refs.tooltip.visible = true
      // this.$refs.tooltip.alertVisible = true
      //  setTimeout(()=>{
      //    this.$refs.tooltip.cancel()
      //  },3000)

      this.$refs.hint.visible = true
      this.$refs.hint.alertVisible = true
      setTimeout(() => {
        this.$refs.hint.cancel()
      }, 3000)
    },
    setHeight(){
      var cliHeight = document.body.clientHeight;
      this.tabHeight = cliHeight - 285;
    },
  },
}
</script>
<style lang="scss" scoped>
.personBg {
  // position: relative;
  width: 100%;
  height: 180px;
}
.tx {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  width: 7em;
  height: 7em;
  border-radius: 2em;
  position: absolute;
}

.name {
  position: absolute;
  left: 7.2em;
}
.ant-menu-submenu-active div span {
  color: #fff;
}
.top {
  height: 180px;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  align-items: center;
  position: relative;
  span {
    color: #fff;
    margin-left: 20px;
    font-size: 18px;
  }
}
.bott {
  background: #fff;
  margin: 10px auto;
  p {
    font-size: 16px;
    padding: 30px 0 0 40px;
  }
  ul {
    list-style: none;
    li {
      line-height: 30px;
      span {
        color: #767885;
        &:nth-of-type(2) {
          margin-left: 30px;
        }
      }
    }
  }
}
</style>