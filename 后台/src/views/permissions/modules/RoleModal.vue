<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
     style="overflow-y: hidden;top:20px;">
 <!-- 弹窗底部按钮 -->
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
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称">
          <a-input :disabled="roleDisabled" placeholder="请输入角色名称" v-decorator="[ 'roleName', validatorRules.roleName]" />
        </a-form-item>
      </a-form>
    </a-spin>
     <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addRole,editRole } from '@/api/api'
  import tooltip from "@/components/tooltip/tooltip.vue"
  export default {
    name: "RoleModal",
    components:{ tooltip },
    data () {
      return {
        message:'操作成功',
        type:'info',
        title:"操作",
        visible: false,
        roleDisabled: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          roleName:{
            rules: [
              { required: true, message: '请输入角色名称!' },
              { min: 1, max: 50, message: '长度不超过 50 个字符', trigger: 'blur' }
            ]}
        },
        //操作按钮禁用
        btnDisabled:false
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;

        //编辑页面禁止修改角色编码
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'roleName'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      warnMethod(){
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel()
        },3000)
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.btnDisabled = true
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            let obj;
            console.log(formData)
            if(!this.model.id){
              //后台接口有4个字段为必传，前端需要加上
              let param = {...formData};
              param['dataNameList'] = '';
              param['dataNoList'] = '';
              param['pageNameList'] = '';
              param['pageNoList'] = '';
              obj=addRole(param);
            }else{
              obj=editRole(formData);
            }
            obj.then((res)=>{
              if(res.code===200){
                // that.$message.success(res.message);
                 if(this.model.id){
                  this.message = "修改成功"
                  }else{
                  this.message = "新增成功"
                }
                this.type = "info"
                this.warnMethod();

                that.$emit('ok');
              }else if(res.code!==400){
                // that.$message.warning(res.message);
                this.message = res.message
                this.type = "error"
                this.warnMethod();
              }
            }).finally(() => {
              that.confirmLoading = false;
              this.btnDisabled = false
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
    }
  }
</script>

<style scoped>

</style>