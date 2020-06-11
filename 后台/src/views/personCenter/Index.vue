<template>
  <div>
    <div class="top">
      <img src="../../assets/personImg.png" class="personBg" alt />
      <img :src="avatar()?avatar():src" alt class="tx" />
      <span class="name">{{username()?username():'--'}}</span>
    </div>
    <div class="bott">
      <!-- <a-button type="primary" @click="dbclick">弹窗</a-button> -->
      <p>基本信息</p>
      <ul>
        <li>
          <span>海尔账号：</span>
          <span>{{userInfo()['userAccount']?userInfo()['userAccount']:'--'}}</span>
        </li>
        <li>
          <span>用户名称：</span>
          <span>{{userInfo()['userName']?userInfo()['userName']:'--'}}</span>
        </li>
        <li>
          <span>电子邮箱：</span>
          <span>{{userInfo()['userEmail']?userInfo()['userEmail']:'--'}}</span>
        </li>
        <li>
          <span>所在部门：</span>
          <span>{{userInfo()['userDepartmentName']?userInfo()['userDepartmentName']:'--'}}</span>
        </li>
      </ul>
    </div>
     <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
   <hint ref="hint" :message="message" :description="description" :type="type"></hint>  
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import tooltip from "@/components/tooltip/tooltip.vue"
import hint from "@/components/tooltip/hint.vue"
export default {
  data() {
    return {
      message:'提示信息',
      type:'success', 
      description:'操作成功',
      src:'../../assets/tx.png' // 头像默认地址
    }
  },
  components:{ tooltip,hint },   
  /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  created() {},
  computed: {},
  methods: {
    ...mapGetters(['username', 'avatar', 'userInfo']),
    dbclick(){
      // this.$refs.tooltip.visible = true
      // this.$refs.tooltip.alertVisible = true
      //  setTimeout(()=>{
      //    this.$refs.tooltip.cancel() 
      //  },3000)

      this.$refs.hint.visible = true
      this.$refs.hint.alertVisible = true
       setTimeout(()=>{
         this.$refs.hint.cancel() 
       },3000)
    }
  }
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
  height: 500px;
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
        &:nth-of-type(2) {
          margin-left: 30px;
        }
      }
    }
  }
}
</style>