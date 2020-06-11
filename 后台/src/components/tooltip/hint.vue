<template>
  <!-- 这是个大提示框组件 -->
  <!-- 使用方式：
1，在script内 中引入组件， import hint from "@/components/tooltip/hint.vue"
2，注册组件：  components:{ hint }  
3，使用组件：  <hint ref="hint" :message="message" :description="description" :type="type"></hint>  
4，设置data ： 
      message:'提示',
      description:'操作成功',
      type:'success', // success：成功,info：信息,warning：警告, error：错误
        [可以根据不同的操作更改 message,description,type]
5, 在方法中执行以下语句：
       this.$refs.hint.visible = true
       this.$refs.hint.alertVisible = true
       setTimeout(()=>{
         this.$refs.hint.cancel() 
       },3000)
  -->
  <div>
    <a-modal
      title
      :visible="visible"
      :footer="null"
      :mask="false"
      width="604px"
      :closable="false"
      @cancel="cancel"
      :bodyStyle="bodyStyle"
    >
      <!-- message: 要显示的信息概要；description:详细描述；type：提示框类型，success：成功,info：信息,warning：警告, error：错误 -->
      <a-alert
        :message="message"
        :description="description"
        :type="type"
        v-if="alertVisible"
        :banner="true"
        closable
        @close="cancel"
      />
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
  props: ['message', 'type', 'description'],
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
