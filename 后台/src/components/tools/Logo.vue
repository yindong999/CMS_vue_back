<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!-- <img src="@/assets/logo-white.png" alt :class="[changeStyle?'big':'small']" /> -->
      <img src="@/assets/logo_title3.png" style="cursor:default;height:36px;"/>
      <!-- <span v-if="showTitle">{{ title }}</span> -->
    </router-link>
  </div>
</template>

<script>
import { mixin } from '@/utils/mixin.js'

export default {
  name: 'Logo',
  mixins: [mixin],
  props: {
    title: {
      type: String,
      default: '内容营销系统平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data() {
    return {
      changeStyle: true
    }
  },
  mounted() {
    this.$bus.$on('change', () => {
      this.changeStyle = !this.changeStyle
    })
  }
}
</script>
<style lang="less" scoped>
/*缩小首页布 局顶部的高度*/
@height: 59px;

.sider {
  box-shadow: none !important;
  .logo {
    height: @height !important;
    line-height: @height !important;
    box-shadow: none !important;
    transition: background 300ms;
    background:#3264D5!important;
    a {
      color: white;
      // display: flex;
      align-items: center;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
      .title {
        font-size: 28px;
      }
    }
  }
  &.light .logo {
    background:#3264D5!important;
  }
}
.big {
  width: 96px;
  height: 29px !important;
  margin-top: 15px;
  transition: all 0.5s;
}
.small {
  width: 44px;
  height: 15px!important;
  margin-top: 22px;
  transition: all 0.5s;
}
</style>