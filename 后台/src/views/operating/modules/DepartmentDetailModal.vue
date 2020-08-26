<template>
  <a-modal :centered="true"
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
    wrapClassName="ant-modal-cust-warp"
    style="overflow-y: hidden">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 部门名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="部门名称">
          <a-input class="detailInput" :disabled="true" placeholder="请输入部门名称" v-decorator="[ 'departmentName']" />
        </a-form-item>
        <!-- 部门类型 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="部门类型">
          <a-input class="detailInput" :disabled="true" v-decorator="['departmentType']"/>
          <!-- <a-input class="detailInput" :disabled="true" :value="model.departmentType==='0'?'海尔':'供应商'" /> -->
        </a-form-item>
        <!-- 联系人 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="联系人">
          <a-input class="detailInput" :disabled="true" placeholder="请输入联系人"  v-decorator="[ 'contacter']" />
        </a-form-item>
        <!-- 联系方式 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol" style="margin-bottom:16px;"
          label="联系方式">
          <a-input class="detailInput" :disabled="true" placeholder="请输入联系方式" v-decorator="[ 'contacterMobile']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {DepartmentTypeData} from '@/api/api'
  export default {
    name: "DepartmentModal",
    data () {
      return {
        message:'操作成功',
        type:'info',
        //部门类型
        departmentTypeData:DepartmentTypeData,
        title:"操作",
        visible: false,
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
        //操作按钮禁用
        btnDisabled:false,
        allDisabled:false
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
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'departmentName','departmentType','contacter','contacterMobile'))
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
      handleCancel () {
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

<style lang="scss" scoped>
  .detailInput{
    color:#55565D;
  }
</style>