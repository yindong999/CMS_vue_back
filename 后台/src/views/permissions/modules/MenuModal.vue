<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    :bodyStyle="bodyStyle"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;overflow-y: hidden">
    <!-- 弹窗底部按钮 -->
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
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="名称">
          <a-input v-decorator="[ 'name', {}]" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图标">
          <a-input v-decorator="[ 'icon', {}]" placeholder="请输入图标" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="父节点id">
          <a-input v-decorator="[ 'parentId', {}]" placeholder="请输入父节点id" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="重定向">
          <a-input v-decorator="[ 'redirect', {}]" placeholder="请输入重定向" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="路由链接(按钮名称)">
          <a-input v-decorator="[ 'url', {}]" placeholder="例：/peimissions" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="组件">
          <a-input v-decorator="[ 'component', {}]" placeholder="例：dashboard/Analysis" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="菜单类型">
          <a-select
            :showSearch="true"
            v-decorator="[ 'menuType', {}]"
            placeholder="请选择菜单类型"
          >
            <a-select-option :value='0'>一级菜单</a-select-option>
            <a-select-option :value='1'>子菜单</a-select-option>
            <a-select-option :value='2'>按钮</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="登录类型">
          <a-select
            :showSearch="true"
            v-decorator="[ 'alwaysShow', {}]"
            placeholder="请选择登录类型"
          >
            <a-select-option :value="1">前台</a-select-option>
            <a-select-option :value="2">后台</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input v-decorator="[ 'sortNo', {}]" placeholder="请输入排序号" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否路由菜单">
          <a-select
            :showSearch="true"
            v-decorator="[ 'isRoute', {}]"
            placeholder=""
          >
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否叶子节点">
          <a-select
            :showSearch="true"
            v-decorator="[ 'isLeaf', {}]"
            placeholder=""
          >
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否隐藏路由">
          <a-select
            :showSearch="true"
            v-decorator="[ 'hidden', {}]"
            placeholder=""
          >
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addMenu,editMenu } from '@/api/api'

  export default {
    name: "MenuModal",
    data () {
      return {
        bodyStyle:{
          height:'70vh!important'
        },
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
        console.log(this.model)
        this.model['isLeaf'] = this.model['leaf']?1:0
        this.model['hidden'] = this.model['hidden']?1:0
        this.model['isRoute'] = this.model['route']?1:0
        this.visible = true;

        //编辑页面禁止修改角色编码
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'name','icon','parentId','redirect','url','component','menuType','alwaysShow','sortNo','isRoute','isLeaf','hidden'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            let obj;
            console.log(formData)
            if(!this.model.id){
              //后台接口有4个字段为必传，前端需要加上
              let param = {...formData};
              param['keepAlive'] = 0;
              param['ruleFlag'] = 0;
              obj=addMenu(param);
            }else{
              obj=editMenu(formData);
            }
            obj.then((res)=>{
              if(res.code===200){
                that.$message.success(res.message);
                that.$emit('ok');
              }else if(res.code!==400){
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
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