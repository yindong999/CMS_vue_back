<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    wrapClassName="ant-modal-cust-warp"
    style="overflow-y: hidden">
    <!-- 底部按钮 -->
     <template slot="footer">
        <div :style="{ textAlign: 'center',padding:'14px 16px'  }">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="primary"  @click="handleOk" class="affirmBtn">确认</a-button>
          </a-config-provider>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button @click="handleCancel" class="abolishBtn">取消</a-button>
          </a-config-provider>
        </div>
      </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 部门名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="部门名称">
          <a-input placeholder="请输入部门名称" v-decorator="[ 'departmentName', validatorRules.departmentName]" />
        </a-form-item>
        <!-- 部门类型 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="部门类型">
          <!-- {hidden:roleDisabled?' #f5f5f5':'#fff'}" -->
          <a-select :style="{display:roleDisabled?'none':''}" :showSearch="true" placeholder="请选择部门类型" v-decorator="[ 'departmentType', validatorRules.departmentType]">
            <a-select-option v-for="(item,key) in departmentTypeData" :value="item.value" :key="key" >{{item.label}}</a-select-option>
          </a-select>
          <a-input :style="{display:!roleDisabled?'none':'',color:'#55565D'}" :disabled="true" :value="model.departmentType==='0'?'海尔':'供应商'"/>
        </a-form-item>
        <!-- 联系人 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="联系人">
          <a-input placeholder="请输入联系人"  v-decorator="[ 'contacter', validatorRules.contacter]" />
        </a-form-item>
        <!-- 联系方式 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="联系方式">
          <a-input placeholder="请输入联系方式" v-decorator="[ 'contacterMobile', validatorRules.contacterMobile]" />
        </a-form-item>
      </a-form>
    </a-spin>
     <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addDepartment,editDepartment,DepartmentTypeData} from '@/api/api'
  import tooltip from "@/components/tooltip/tooltip.vue"
  export default {
    name: "DepartmentModal",
    components:{ tooltip },  
    data () {
      return {
        message:'操作成功',
        type:'info',
        //部门类型
        departmentTypeData:DepartmentTypeData,
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
          departmentName:{
            rules: [
              { required: true, message: '请输入部门名称!'},
              { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' },
              {validator: this.validateDepName}
            ]},
          departmentType:{
            rules: [
              { required: true, message: '请选择部门类型!'},
            ]},
          contacter:{
            rules: [
              { required: false, message: '请输入联系人!'},
              { min: 1, max: 10, message: '长度不超过 10 个字符', trigger: 'blur' },
              {validator: this.validateContacts}
            ]},
          contacterMobile:{
            rules: [
              { required: false, message: '请输入联系方式!'},
              {validator: this.validatePhone}
            ]},
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        console.log(record)
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
  console.log('this.model ',this.model )
        //编辑页面禁止修改编码
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'departmentName','departmentType','contacter','contacterMobile'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        console.log(this.form)
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            let obj;
            console.log(formData)
            if(!this.model.id){
              obj=addDepartment(formData);
            }else{
              obj=editDepartment(formData);
            }
            obj.then((res)=>{
              if(res.code===200){
                // that.$message.success("操作成功");
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
              that.close();
            })
          }
        })
      },
      warnMethod(){
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel() 
        },3000)
      },
      handleCancel () {
        this.close()
      },
      validateContacts(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(value.indexOf(' ') === -1){
            callback()
          }else{
            callback("联系人不可输入空格");
          }
        }
      },
      validateDepName(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(value.indexOf(' ') === -1){
            callback()
          }else{
            callback("部门名称不可输入空格");
          }
        }
      },
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else{
          //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
          if(new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
            callback()
          }else{
            callback("请输入正确格式的手机号码!");
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>