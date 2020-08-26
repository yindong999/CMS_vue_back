<template>
  <div>
    <a-modal
      title
      :visible="visible"
      :footer="null"
      :mask="false"
      :width="500" 
      :closable="false"
      @cancel="cancel"
      style="position: relative;top: 50%!important;"
      :bodyStyle="bodyStyle"
      :zIndex="1200"
    >
      <a-alert style="width:500px;padding-right: 26px;" v-if="alertVisible" :message="message" :description="description" type="info" show-icon :closable="false">
        <a-row slot="icon" type="flex" align="middle">
          <a-icon type="check-circle" />
        </a-row> 
      </a-alert>
      <a-icon type="close" style="position:absolute;right:16px;top:13px;" @click="cancel"/>
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
      alertVisible: false,
      message:"操作成功！",
      description:"请您耐心等待下载，无需重复操作"
    }
  },
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