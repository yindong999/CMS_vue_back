<template>
  <div class="user-wrapper" :class="theme">
    <!-- 通知按钮 -->
    <!-- <header-notice class="action"/> -->
    <!--友情链接-->
    <a-popover placement="bottom">
      <template slot="content">
        <p style="cursor: pointer;margin-bottom: 0!important;" @click="toLink">海尔集团数字媒体平台</p>
      </template>
      <span style="margin-right:32px ">
        <img src="@/assets/link.png" alt=""  style="width: 24px;height: 24px;">
        <span style="margin-left:5px;color: #fff;position: relative;top:1px;">资源链接</span>
      </span>
    </a-popover>
    <router-link
      v-if="isHaveNotice"
      tag="span"
      class="action action-full ant-dropdown-link user-dropdown-menu person-msg"
       style="line-height:none;display:flex!important;align-items:center;"
      :to="{ name: 'messageList-Index' }"
    >
      <!-- <a-badge :count="counts" style="top:8px;position: relative;">
        <img src="@/assets/message.png" style="width:20px;height:19px;cursor: pointer!important;" alt="">
        <a href="#" class="head-example"></a>
      </a-badge>  -->
        <div style="position:relative;line-height:20px!important;">
        <img src="@/assets/message.png" style="width:20px;height:19px;cursor: pointer!important;" alt="">
        <div :class="['default',large?'largeSize':'defaultSize']" v-show="counts!==0">
          <span  :style="{transform:'scale('+ (counts<10?1:counts<99?0.9:0.8)+')',position:'relative','font-size':'12px'}">{{!(counts>99)?counts:'99+'}}</span>
        </div>
      </div>
    </router-link>
    <!-- 用户名、头像以及下拉框 -->
    <a-dropdown>
      <!-- 用户名和头像 -->
      <router-link :to="{ name: 'personCenter-Index' }" class="action action-full ant-dropdown-link user-dropdown-menu person-msg" style="padding:0!important;margin:0 24px;cursor:default;display: flex;align-items: center;text-decoration:none;">
         <img :src="avatar()" alt="" style="width:27px;height:27px;border-radius:50%;position: relative;right: 6px;cursor:pointer;">
        <span v-if="isDesktop()" style="color:#fff;text-decoration:none;cursor:pointer;height:16px;line-height:18px;">{{ username() }}</span>
      </router-link>
        <!-- <router-link style="padding:0 24px 0 34px!important;" :to="{ name: 'personCenter-Index' }" class="action action-full ant-dropdown-link user-dropdown-menu person-msg">
        <img :src="avatar()" alt="" style="width:27px;height:27px;border-radius:50%;position: relative;top: -4px;right: 6px;">
        <span style="cursor:pointer;line-height:20px;color:#fff!important;" v-if="isDesktop()">{{ username() }}</span>
      </router-link> -->
      <!-- 用户名头像的下拉框 -->
      <!-- <a-menu slot="overlay" class="user-dropdown-menu-wrapper" v-if="isHavePerson">
        <a-menu-item key="0">
          <router-link :to="{ name: 'personCenter-Index' }">
            <a-icon type="user" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
      </a-menu> -->
    </a-dropdown>
    <!-- 退出按钮 -->
    <span class="action person-msg" style="height: 74%;padding:0;margin-right:16px;color:#fff;">
      <a
        class="logout_title"
        href="javascript:;"
        style="display:flex;align-items:center;"
        @click="handleLogout"
      >
        <!-- <a-icon type="export" style="font-size: 18px;"/> -->
        <img src="@/assets/logout.png" alt="" style="width:13px;height:14px;">
        <span v-if="isDesktop()" style="margin-left:5px;">退出</span>
      </a>
    </span>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置"></setting-drawer>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice' //消息通知
import UserPassword from './UserPassword'
import SettingDrawer from '@/components/setting/SettingDrawer'
import DepartSelect from './DepartSelect'
import { mapActions, mapGetters, mapState } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'
import { noReadMsg } from '@/api/api.js'
export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  data() {
    return {
      large:false,
      counts: 0, // 未读消息数量
      //菜单搜索
      search: [],
      shows: false,
      isHaveNotice:false,   //是否显示消息通知
      isHavePerson:false    //是否显示个人中心
    }
  },
  components: {
    HeaderNotice,
    UserPassword,
    DepartSelect,
    SettingDrawer
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  created() {
    let lists = []
    this.searchMenus(lists, this.permissionMenuList)
    this.search = [...lists]
    this.noReadMsgCount()
    setInterval(() => {
      this.noReadMsgCount()
    }, 30000)
    this.isHaveNotice = this.permissionMenuList.some(val =>{
      return val.name == "messageList-Index";
    })
    this.isHavePerson = this.permissionMenuList.some(val =>{
      return val.name == "personCenter-Index";
    })
  },
  computed: {
    ...mapState({
      // 后台菜单
      permissionMenuList: state => state.user.permissionList
    })
  },
  /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  methods: {
    // 获取未读消息数量
    noReadMsgCount() {
      noReadMsg({readFlag:'0'}).then(res => {
        if (res.message === 'SUCCESS') {
          this.counts = res.data
        } else {
          this.counts = 0
        }
      })
    },
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    showClick() {
      this.shows = !this.shows
    },
    hiddenClick() {
      this.shows = false
    },
    /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    ...mapActions(['Logout']),
    ...mapGetters(['username', 'avatar', 'userInfo']),
    //  登出
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.href = '/'
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    searchMenus(arr, menus) {
      for (let i of menus) {
        if (!i.hidden && 'layouts/RouteView' !== i.component) {
          arr.push(i)
        }
        if (i.children && i.children.length > 0) {
          this.searchMenus(arr, i.children)
        }
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    searchMethods(value) {
      let jump = this.search.filter(item => item.id == value)
      this.$router.push({ path: jump[0].path })
    },
    systemSetting(){
      this.$refs.settingDrawer.showDrawer()
    },
    //跳转链接
    toLink(){
      window.open('https://news.haier.net')
    }
    /*update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
  }
}
</script>

<style lang="scss" scoped>
/* update_begin author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
/* update-begin author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
.largeSize{
  height:24px;width:24px;
}
.default{
  position:absolute;
  top:-7px;
  left:10px;
  background:#FF6A6A;
  border:1px solid #fff;
  border-radius:50%;
  cursor: pointer!important;
  color:#fff;
  text-align:center;
  display: flex;
  justify-content: center;
}
.defaultSize{
  height:20px;width:20px;
  line-height: 18px;
}
.logout_title {
  color: inherit;
  text-decoration: none;
}
.user-wrapper{
      display: flex;
    align-items: center;
}
.user-wrapper .search-input {
  width: 180px;
  color: white;

  /deep/ {
    .ant-select-selection {
      background-color: inherit;
      border: 0;
      border-bottom: 1px solid white;
    }

    .ant-select-selection__placeholder,
    .ant-select-search__field__placeholder {
      color: inherit;
    }
  }
}
.person-msg{
  user-select:none;
}
.person-msg:hover{
  background-color: #3264D5!important;
}
.light{
  display:flex;
  align-items: center;
}
/* update-end author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
/* update_end author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
</style>
