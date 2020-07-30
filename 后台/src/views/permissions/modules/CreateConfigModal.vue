<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    :bodyStyle="bodyStyle"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;overflow-y: hidden"
  >
      <!-- 弹窗底部按钮菜单 -->
     <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="handleOk" class="affirmBtn" :disabled="btnDisabled">确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="handleCancel" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="内容账号" >
          <a-select
            style="width: 400px"
            :showSearch="true"
            :filter-option="filterOption"
            allowClear
            @change="changeChannel"
            v-decorator="['channelId', validatorRules.channelId]"
          >
            <a-select-option
              v-for="(item,key) in allData"
              :value="item.id"
              :key="key"
            >{{item.channelName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="内容编辑者">
          <a-select
            style="width: 400px"
            :showSearch="true"
            :filter-option="filterOption"
            allowClear
            mode="multiple"
            v-decorator="['editorId', validatorRules.editorId]"
          >
            <a-select-option
              v-for="(item,key) in editorData"
              :value="item.userId"
              :key="key"
            >{{item.userName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="内容审核者">
          <a-select
            style="width: 400px"
            :showSearch="true"
            :filter-option="filterOption"
            allowClear
            mode="multiple"
            v-decorator="['reviewerid', validatorRules.reviewerid]"
          >
            <a-select-option
              v-for="(item,key) in auditorData"
              :value="item.userId"
              :key="key"
            >{{item.userName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
     <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import tooltip from "@/components/tooltip/tooltip.vue"
import { thirdPublishChannelList, getEditorList, saveProcessConfig, updateProcessConfig } from '@/api/api'
// import moment from "moment"
export default {
  name: 'CreateConfigModal',
  components:{ tooltip },
  data() {
    return {
      message:'操作成功',
      type:'info',
      bodyStyle:{
          height:'70vh!important'
      },
      id: '',
      title: '新增',
      visible: false,
      roleDisabled: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      //全部渠道数据
      allData: [],
      //微博渠道
      weiboData: [],
      //微信渠道
      wechatData: [],
      //编辑者数据
      editorData: [],
      //审核者数据
      auditorData: [],
      form: this.$form.createForm(this),
      validatorRules: {
        channelId: {
          rules: [
            { required: true, message: '请选择内容账号!' }
          ]
        },
        editorId: {
          rules: [
            { required: true, message: '请选择编辑者!' }
          ]
        },
        reviewerid: {
          rules: [
            { required: true, message: '请选择审核者!' }
          ]
        },
      },
      //操作按钮禁用
      btnDisabled:false
    }
  },
  mounted() {},
  methods: {
     warnMethod(){
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel()
        },3000)
      },
    //重置
    reset() {

    },
    //获取内容编辑者和审核者
    getUser(value) {
      this.editorData = []
      this.auditorData = []
      // return
      getEditorList({ channelid: value }).then(res => {
        console.log('res', res)
        if (res.code === 200) {
          res.data.forEach(item => {
            if (item.role.indexOf('前台编辑') !== -1) {
              this.editorData.push(item)
            } else if (item.role.indexOf('后台审核') !== -1) {
              this.auditorData.push(item)
            }
          })
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //获取渠道名称
    getChannel() {
      this.wechatData = []
      this.weiboData = []
      this.allData = []
      thirdPublishChannelList({ page: 1, size: 1000 }).then(res => {
        if (res.code === 200) {
          // res.data.list.forEach(item=>{
          //   if(item.channelPlatformCode==='wechat'){
          //     //微信公众号数据
          //     this.wechatData.push(item)
          //   }else if(item.channelPlatformCode==='sinaBlog'){
          //     //微博号数据
          //     this.weiboData.push(item)
          //   }
          // })
          this.allData = res.data.list
          this.allData.map(item => {
            item['channelName'] = item['channelPlatform'] + '-' + item['channelName']
          })
          // //微信公众号数据
          // this.wechatData = res.data['1']
          // //微博号数据
          // this.weiboData = res.data['2']
          // //全部数据集合
          // this.allData = this.wechatData.concat(this.weiboData)
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //渠道变化
    changeChannel(val) {
      //联动获取编辑和审核用户
      this.getUser(val)
    },
    create() {
      this.edit({});
    },
    edit(record) {
      // 设置模态框的标题
      this.titles = JSON.stringify(record) === '{}' ? '新增' : '编辑'

      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      //编辑者
      if(this.model && this.model.editorId ){
        this.model.editorId=this.model.editorId.split(',')
      }
      //审核者
      if(this.model && this.model.reviewerid ){
        this.model.reviewerid=this.model.reviewerid.split(',')
      }
      if(this.model && this.model.configId){
        console.log(this.model)
        this.getUser(this.model.channelId)
      }
      this.getChannel()
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'channelId', 'editorId', 'reviewerid')
        )
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.reset()
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnDisabled = true
          this.confirmLoading = true
          let formData = Object.assign(this.model, values)
          // let param = { ...formData }
          let params = {
            channelId: formData.channelId,
            editorId: formData.editorId.join(),
            reviewerId: formData.reviewerid.join()
          }
          if(this.model.configId){
            params['configId'] = formData.configId
          }
          console.log(params);
          let obj = !this.model.configId ? saveProcessConfig(params) : updateProcessConfig(params)
          obj
            .then(res => {
              if (res.code === 200) {
                if(this.model.id){
                  this.message = "修改成功"
                }else{
                  this.message = "新增成功"
                }
                this.type = "info"
                this.warnMethod();
                this.$emit('ok')
                this.userType = 1
                this.visible = false
              } else if(res.code!==400){
                this.message = res.message
                this.type = "error"
                this.warnMethod();
              }
            })
            .finally(() => {
              this.confirmLoading = false
              this.btnDisabled = false
              this.$emit('close')
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.indexOf(input) >= 0
      );
    },
  }
}
</script>

<style scoped>
.lin30 {
  line-height: 30px;
  margin-bottom: 20px;
}
.textRight {
  text-align: right;
}
.marginRight20 {
  margin-right: 20px;
}
.marginRight10 {
  margin: 0 10px;
}
.iconSwap {
  font-size: 20px;
  margin: 0 10px;
}
</style>