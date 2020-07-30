<template>
  <a-modal
    :title="titles"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="overflow-y: hidden"
  >
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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户账号">
          <a-input
            placeholder="请输入用户账号"
            :disabled="roleDisabled"
            v-decorator="[ 'userAccount', validatorRules.userAccount]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户类型">
          <a-radio-group name="radioGroup" v-model="userType">
            <a-radio :value="1">海尔用户</a-radio>
            <a-radio :value="2">外部用户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名称">
          <a-input placeholder="请输入用户名称" v-decorator="[ 'userName', validatorRules.userName]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户部门">
          <a-select
            allowClear
            :filter-option="filterOption"
            :showSearch="true"
            placeholder="请选择用户部门"
            v-decorator="[ 'userDepartmentId', validatorRules.userDepartmentId]"
          >
            <a-select-option
              v-for="(item,key) in department"
              :value="item.value"
              :key="key"
            >{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户角色">
          <a-select
            allowClear
            :filter-option="filterOption"
            :showSearch="true"
            :showArrow="true"
            placeholder="请选择用户角色"
            mode="multiple"
            v-decorator="['userRoleGroup', validatorRules.userRoleGroup]"
          >
            <a-select-option
              v-for="(item,key) in role"
              :value="item.value"
              :key="key"
            >{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系方式">
          <a-input placeholder="请输入联系方式" v-decorator="[ 'userMobile', validatorRules.userMobile]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电子邮箱">
          <a-input placeholder="请输入电子邮箱" v-decorator="[ 'userEmail', validatorRules.userEmail]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { addUser, editUser } from '@/api/api'
import tooltip from "@/components/tooltip/tooltip.vue"
export default {
  name: 'UserModal',
  props: ['role', 'department'],
  components:{ tooltip },
  data() {
    return {
      message:'操作成功',
      type:'info',
      userType: 1,
      titles: '新增',
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
      form: this.$form.createForm(this),
      validatorRules: {
        userAccount: {
          rules: [
            { required: true, message: '请输入用户账户!' },
            { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' },
            { validator: this.validateAccount }
          ]
        },
        userName: {
          rules: [
            { required: true, message: '请输入用户名称!' },
            { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' },
            { validator: this.validateAccName }
          ]
        },
        userDepartmentId: {
          rules: [{ required: true, message: '请选择用户部门!' }]
        },
        userRoleGroup: {
          rules: [{ required: true, message: '请选择用户角色!' }]
        },
        userMobile: {
          rules: [{ required: true, message: '请输入联系方式!' }, { validator: this.validatePhone }]
        },
        userEmail: {
          rules: [{ required: true, message: '请输入电子邮箱!' }, { validator: this.validateEmail }]
        }
      },
      //操作按钮禁用
      btnDisabled:false
    }
  },
  created() {},
  mounted() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      // 设置模态框的标题
      this.titles = JSON.stringify(record) === '{}' ? '新增' : '编辑'

      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      //编辑页面禁止修改角色编码
      if (this.model && this.model.userType) {
        this.userType = Number(this.model.userType)
      }
      let arr = []
      if(this.model && this.model.userRoleGroup && this.model.userRoleGroup.length > 0){
        this.model.userRoleGroup.forEach(res => {
          arr.push(res.userRoleId)
        })
      }
      this.model.userRoleGroup = arr
      if (this.model.id) {
        this.roleDisabled = true
      } else {
        this.roleDisabled = false
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'userAccount', 'userName', 'userDepartmentId', 'userRoleGroup', 'userMobile', 'userEmail')
        )
      })
    },
    close() {
      this.$emit('close')
      this.roleDisabled = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.btnDisabled = true
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          let param = { ...formData }
          let paramMsg = []
          console.log('param.userRoleGroup',param.userRoleGroup)
          param.userRoleGroup.forEach(i => {
          console.log('this.role', this.role)
            this.role.forEach(item => {
              if (item.value == i) {
                var objs = {}
                objs.userRoleId = item.value
                objs.userRoleName = item.label
                paramMsg.push(objs)
              }
            })
          })
          param.userRoleGroup = paramMsg
          // 设置用户类型
          param.userType = this.userType + ''
          // let arr = []
          // for (let i = 0; i < this.role.length; i++) {
          //   for (let j = 0, length = param.userRoleId.length; j < length; j++) {
          //     if (this.role[i].value === param.userRoleId[j]) {
          //       arr.push(this.role[i].label)
          //       let obj = {}
          //       obj.userRoleId = this.role[i].value
          //       obj.userRoleName = this.role[i].label
          //     }
          //   }
          // }

          // param['userRoleGroup'] = arr

          //   "userRoleGroup": [{
          //   "userRoleId": "111",
          //   "userRoleName": "测试角色"
          //  }, {
          //   "userRoleId": "222",
          //   "userRoleName": "生产角色"
          //  }],

          // for (let i = 0; i < this.role.length; i++) {
          //   if (this.role[i].value === param.userRoleId) {
          //     param['userRoleName'] = this.role[i].label
          //     break
          //   }
          // }
          for (let i = 0; i < this.department.length; i++) {
            if (this.department[i].value === param.userDepartmentId) {
              param['userDepartmentName'] = this.department[i].label
              break
            }
          }
          // if (!this.model.id) {
          //   obj = addUser(param)
          // } else {
          //   obj = editUser(param)
          // }
          let obj = !this.model.id ? addUser(param) : editUser(param)
          obj
            .then(res => {
              if (res.code === 200) {
                // that.$message.success(res.message)
                if(this.model.id){
                  this.message = "修改成功"
                  }else{
                  this.message = "新增成功"
                }
                this.type = "info"
                this.warnMethod();
                that.$emit('ok')
                this.userType = 1
                this.visible = false
              } else if(res.code!==400){
                // that.$message.warning(res.message)
                this.message = res.message
                this.type = "error"
                this.warnMethod();
              }
            })
            .finally(() => {
              that.confirmLoading = false
              this.$emit('close')
              // this.userType = 1
              this.roleDisabled = false
              this.btnDisabled = false
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
    handleCancel() {
      this.$emit('close')
      this.userType = 1
      this.visible = false
      this.roleDisabled = false
    },
    validateAccName(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
        if (value.indexOf(' ') === -1) {
          callback()
        } else {
          callback('用户名称不可输入空格!')
        }
      }
    },
    validateAccount(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
        if (value.indexOf(' ') === -1) {
          callback()
        } else {
          callback('用户账号不可输入空格!')
        }
      }
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          callback()
        } else {
          callback('请输入正确格式的手机号码!')
        }
      }
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          callback()
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    },
    //下拉框过滤
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.indexOf(input) >= 0
      );
    },
  }
}
</script>

<style scoped>
.ant-form-item{
  margin-bottom:16px;
}
</style>