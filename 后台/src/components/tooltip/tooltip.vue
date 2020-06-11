<template>
  <!-- 这是个小提示框组件 -->
  <!-- 使用方式：
1，在script内 中引入组件， import tooltip from "@/components/tooltip/tooltip.vue"
2，注册组件：  components:{ tooltip }  
3，使用组件：  <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
4，设置data ： 
      message:'操作成功',
      type:'info',  // success：成功；info：信息；warning：警告；error：错误
        [可以根据不同的操作更改 message,type]
5, 在方法中执行以下语句：
       this.$refs.tooltip.visible = true
       this.$refs.tooltip.alertVisible = true
       setTimeout(()=>{
         this.$refs.tooltip.cancel() 
       },3000)
       -->
  <div>
    <a-modal
      title
      :visible="visible"
      :footer="null"
      :mask="false"
      :width="320" 
      :closable="false"
      @cancel="cancel"
      style="position: relative;top: 50%!important;"
      :bodyStyle="bodyStyle"
      :zIndex="1200"
    >
      <!-- message: 要显示的文字信息，type：提示框类型，success：成功；info：信息；warning：警告；error：错误 -->
      <a-alert style="width:320px;" v-if="alertVisible" :message="message" :type="type" show-icon :closable="true" @close="cancel" />
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bodyStyle: {
        padding: '0'
      },
      visible: false,
      alertVisible: false
    }
  },
  props: ['message', 'type'],
  methods: { 
    cancel() {
      this.visible = false
      this.alertVisible = false
    }
  }
}
</script>
<style lang='scss' scoped>
</style>