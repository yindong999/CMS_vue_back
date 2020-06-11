<template>
  <div class="main">
    <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
          <a-form-item>
            <h3 style="text-align:center;font-weight:600;color:rgba(60, 61, 67, 1)!important;">后台管理系统</h3>
          </a-form-item>
          <!-- 员工编号输入框 -->
          <a-form-item>
            <a-input allowClear
              size="large"
              type="text"
              v-model="username"
              placeholder="请输入员工编号">
              <!-- <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/> -->
            </a-input>
          </a-form-item>
          <!-- 密码输入框 -->
          <a-form-item>
            <a-input allowClear
              size="large"
              type="password"
              v-model="password"
              autocomplete="false"
              placeholder="请输入密码"
              style="font-family: auto;"
            >
              <!-- <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/> -->
            </a-input>
          </a-form-item>
          <a-form-item>
            <!-- <a-checkbox :checked="checkedPwd" style="user-select:none;" @change="changeSelect">记住密码</a-checkbox> -->
            <!-- <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">
              忘记密码
            </router-link> -->
            <label>
            <input type="checkbox" :checked="checkedPwd" @change="changeSelect" style="position:relative;top:2px;color:rgba(118, 120, 133, 1)!important;"/>
            记住密码
            <div class="show-box" />
          </label>
          </a-form-item>
          <!-- 登录按钮 -->
          <a-form-item style="margin-top:24px">
            <a-button
            :class='[loginBtn?"use":"unuse"]'
              size="large"
              type="primary"
              htmlType="submit"
              class="login-button"
              :loading="loading"
              @click.stop.prevent="handleSubmit"
              :disabled="loginBtn">登录
            </a-button>
          </a-form-item>
    </a-form>
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </div>
</template>

<script>
  import Vue from 'vue'
  import tooltip from "@/components/tooltip/tooltip.vue"
  import { mapActions } from "vuex"
  import { timeFix } from "@/utils/util"
  import {
    ACCESS_TOKEN,
    USER_INFO,
    MENU_DATA,
    DEFAULT_COLOR,
    DEFAULT_THEME,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR_WEAK,
    SIDEBAR_TYPE,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_CONTENT_WIDTH_TYPE,
    DEFAULT_MULTI_PAGE  } from "@/store/mutation-types"
  import { generateIndexRouter } from "@/utils/util"
  export default {
    components:{ tooltip }, 
    data () {
      return {
        message:'',
        type:'info', 
        loading:false,
        checkedPwd:false,
        password:'',
        username:'',
        // loginBtn: false,
        form: this.$form.createForm(this),
        validatorRules:{
          username:{rules: [{ required: true, message: '请输入用户名!',validator: 'click'}]},
          password:{rules: [{ required: true, message: '请输入密码!',validator: 'click'}]},
        },
      }
    },
    watch:{
      username(val1,val2){
        console.log(val1,val2)
        let userInfor = localStorage.getItem('user')
        if(userInfor){
          let parse_userInfor = JSON.parse(userInfor)
          parse_userInfor.username = val1
          localStorage.setItem('user',JSON.stringify(parse_userInfor))
        }
      },
      password(val1,val2){
        console.log(val1,val2)
        let userInfor = localStorage.getItem('user')
        if(userInfor){
          let parse_userInfor = JSON.parse(userInfor)
          parse_userInfor.password = val1
          localStorage.setItem('user',JSON.stringify(parse_userInfor))
        }
      }
    },
    computed:{
      loginBtn(){
        return this.username && this.password ? false : true
      }
    },
    created () {
      Vue.ls.remove(ACCESS_TOKEN)
      Vue.ls.remove(MENU_DATA)
      Vue.ls.remove(SIDEBAR_TYPE)
      Vue.ls.remove(DEFAULT_THEME)
      Vue.ls.remove(DEFAULT_LAYOUT_MODE)
      Vue.ls.remove(DEFAULT_FIXED_HEADER)
      Vue.ls.remove(DEFAULT_FIXED_SIDEMENU)
      Vue.ls.remove(DEFAULT_CONTENT_WIDTH_TYPE)
      Vue.ls.remove(DEFAULT_CONTENT_WIDTH_TYPE)
      Vue.ls.remove(DEFAULT_COLOR_WEAK)
      Vue.ls.remove(DEFAULT_FIXED_HEADER_HIDDEN)
      Vue.ls.remove(DEFAULT_MULTI_PAGE)
       var userInfor = localStorage.getItem('user')
      if(userInfor){
        var parse_userInfor = JSON.parse(userInfor)
        this.username = parse_userInfor.username
        this.password = parse_userInfor.password
        this.checkedPwd = parse_userInfor.checked
      }
    },
    methods: {
      ...mapActions([ "Login", "Logout" ]),
      // handler
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      changeSelect(e){
        console.log(e)
        var userInfor = {username:this.username,password:this.password}
        JSON.stringify(userInfor)
        if(e.target.checked){
          userInfor.checked = true
        } else {
          userInfor.checked = false
        }
         e.target.checked ? localStorage.setItem('user',JSON.stringify(userInfor)) : localStorage.removeItem('user');

        this.checkedPwd = e.target.checked
      },
      // 点击登录按钮
      handleSubmit () {
        this.loading = true
        let loginParams = {};
        // this.loginBtn = true;
        // 使用账户密码登陆
        // this.form.validateFields([ 'username', 'password', 'rememberMe' ], { force: true }, (err, values) => {
          // if (!err) {
            loginParams.account = this.username
            loginParams.password = this.password
            loginParams.loginType = 2            //loginType标注是前台登录还是后台登陆
            this.Login(loginParams).then((res) => {
              this.loginSuccess();
            }).catch((err) => {
              // if(err.code!==400){
                this.requestFailed(err);
              // }
            });
          // }else {
          //   this.loginBtn = false;
          // }
        // })
      },
      //登陆成功跳转到首页
      loginSuccess () {
        const menuData = this.$store.getters.permissionList;
        let constRoutes = [];
        constRoutes = generateIndexRouter(menuData);
        // 添加主界面路由
        this.$store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          this.$router.addRoutes(this.$store.getters.addRouters)
          // 跳转到首页
          this.$router.push({ name: "dashboard" })
          // this.$notification.success({
          //   message: '欢迎',
          //   description: `${timeFix()},欢迎回来`,
          // });
         this.loading = false
        })
      },
      // 登陆失败
      requestFailed (err) {
        // this.$notification[ 'error' ]({
        //   message: '登录失败',
        //   description: ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试",
        //   duration: 4,
        // });
          this.message = ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试"
          this.type = 'error'
          this.$refs.tooltip.visible = true
          this.$refs.tooltip.alertVisible = true
          setTimeout(()=>{
            this.$refs.tooltip.cancel() 
          },3000)

        // this.loginBtn = false;
         this.loading = false
      },
    }
  }
</script>

<style lang="scss" scoped>
label {
  position: relative;
  cursor: pointer;
  user-select:none;
  input {
    cursor: pointer;
  }

  input:checked + .show-box {
    background: #1E5E93;
  }

  .show-box {
    position: absolute;
    top: 2px;
    left: 0;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    background: white; // 这里取个巧，与下面颜色一样而已

    &:before { // 使用了 absolute 所以无所谓是 before 还是 after
      content: ''; // 空白内容占位，当做盒模型处理，见下面
      position: absolute;
      top: 2px;
      left: 5px;
      width: 5px; // 勾的短边
      height: 8px; // 勾的长边
      border: solid white; // 勾的颜色
      border-width: 0 2px 2px 0; // 勾的宽度
      transform: rotate(45deg); // 定制宽高加上旋转可以伪装内部的白色勾
    }
    }
  }
.unuse{
  background:#1E5E93;
}
.use{
  background:#EBEDF0;
  border-color:#EBEDF0;
}
  .ant-checkbox-checked .ant-checkbox-inner{
    background-color:#1E5E93!important;
  }
  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }
  .image{
    width:15px;
    height:15px;
  }
  .main{
    padding:20px;
    background:#fff;
    border-radius:5px;
  }
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
  .ant-form-item{
    margin-bottom:16px!important;
  }

</style>