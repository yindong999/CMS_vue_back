<template>
  <!-- 中国区整合营销线下物料明细表页面 -->
  <div>
    <a-card title="" class="statementQuery">
      <a-row>
        <a-form :labelCol="{span:7}" :wrapperCol="{span:17}" @keyup.enter.native="searchQuery" class="formStyle" type="flex" justify="space-between">
          <a-row class="leftDiv">
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4" style="text-align:right;">部门</span>
              <!-- <a-select style="width:calc(100% - 97px);margin-left: 16px;" placeholder="请选择部门" @change="selectDept" :showSearch="true" :filter-option="filterOption" allowClear v-model="dept">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  :value="value.id"
                  v-for="(value,index) in departmentData"
                  :key="index"
                >{{value.dataName}}</a-select-option>
              </a-select> -->
              <!-- 部门只有一个，暂时换成div -->
              	<div style="color:#55565D;width:calc(100% - 97px);margin-left: 16px;border-radius: 4px; line-height:30px;
					        background:#F5F5F5;height:32px;border: 1px solid #d9d9d9;padding-left:11px;">
				        	中国区整合营销</div>
            </a-col>
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">活动节点</span>
              <a-select style="width:calc(100% - 97px);margin-left: 16px;" placeholder="请选择活动节点" @change="selectNode" :showSearch="true" :filter-option="filterOption" allowClear>
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  :value="value.id"
                  v-for="(value,index) in activeNode"
                  :key="index"
                >{{value.dataName}}</a-select-option>
              </a-select>
            </a-col>
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">物料类型</span>
              <a-select style="width:calc(100% - 97px);margin-left: 16px;" placeholder="请选择物料类型" @change="selectType" :showSearch="true" :filter-option="filterOption" allowClear>
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  :value="value.id"
                  v-for="(value,index) in materialType"
                  :key="index"
                >{{value.dataName}}</a-select-option>
              </a-select>
            </a-col>
     
          </a-row>
            <div class="btnCol"  style="width:90px;">
						   <a-button @click="searchQuery" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					  </div>
        </a-form>
      </a-row>
      <!-- <a-row style="margin-top:8px;">
        <a-col :span="24">
          <a-button type="primary" icon="search" style="float:right;" @click="searchQuery">查询</a-button>
        </a-col>
      </a-row> -->
    </a-card>
    <a-card
      title="中国区整合营销线下物料明细表"
      :headStyle="{textAlign:'center','border-bottom':'none'}"
      :bodyStyle="{'padding-top':'0'}"
      style="margin-top:12px;"
    >
      <a-button
        v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn"
        slot="extra"
        type="primary"
        icon="plus"
        style="padding:0 16px;position:absolute!important;right:0!important;"
        @click="addModelShow"
      >新增</a-button>
      <a-table
        :columns="columns"
        size="small"
        :bordered="bordered"
        ref="table"
        rowKey="id"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{scrollToFirstRowOnChange:true,y:tabHeight}"
      >
        <!-- 物料名称 -->
        <span slot="materialName" slot-scope="text, record">
          <a-popover title trigger="hover">
            <template slot="content">
              <p style="maxWidth:300px;">{{record.materialName}}</p>
            </template>
            <a
              class="mouseHover"
              onmouseover="this.style.color='#3264D5';"
              onmouseout="this.style.color='#595959';"
            >{{record.materialName}}</a>
          </a-popover>
        </span>
        <!-- 物料描述 -->
        <span slot="materialDescription" slot-scope="text, record">
          <a-popover title trigger="hover">
            <template slot="content">
              <p style="maxWidth:300px;">{{record.materialDescription}}</p>
            </template>
            <a
              class="mouseHover"
              onmouseover="this.style.color='#3264D5';"
              onmouseout="this.style.color='#595959';"
            >{{record.materialDescription}}</a>
          </a-popover>
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            v-if="authButton.hasOwnProperty('reviewBtn')&&authButton.reviewBtn"
            @click="lookDetail(record)"
            class="margin" style="color:#3264D5"
          >详情</a>
          <a
            v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn"
            @click="editDetail(record)"
            class="margin" style="color:#3264D5"
          >编辑</a>
          <!-- <a @click="editDetail(record)" class="margin">编辑</a> -->
          <a-popconfirm
            v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
            class="margin"
          >
            <a style="color:#3264D5">删除</a>
          </a-popconfirm>
          <a
            v-if="authButton.hasOwnProperty('downloadBtn')&&authButton.downloadBtn"
            target="_blank"
            :href="record.downloadLink"
            @click="load(record)"
            class="margin" style="color:#3264D5"
          >下载</a>
          <!-- <a v-if="authButton.hasOwnProperty('downloadBtn')&&authButton.downloadBtn" target="_blank" :src="record.downloadLink" download="" @click="load(record)" class="margin">下载</a> -->
        </span>
      </a-table>
      <!-- <a-row type="flex" justify="end">
        <a-pagination size="small" show-quick-jumper :default-current="2" :total="500" />
      </a-row>-->
    </a-card>
      <!-- 物料新增或者编辑窗口 -->
    <a-modal :centered="true"
      :title="titles"
      :width="800"
      v-model="isShowModal"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      cancelText="关闭"
      wrapClassName="ant-modal-cust-warp"
      style="overflow-y: hidden"
    >
     <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="submitForm" 

					:disabled="disabled"
					:class="disabled== true ? 'buttonGray' : 'buttonBlue' "
					>确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="handleCancel" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门">
            <!-- 目前部门就一个，使用输入框 -->
            <!-- <a-input :disabled="true" v-model="deptName" style="color:#55565D;"></a-input> -->
            	<div style="color:#55565D;width:100%;border-radius: 4px; line-height:30px;
					background:#F5F5F5;height:32px;border: 1px solid #d9d9d9;padding-left:11px;margin: 4px 0;">
					中国区整合营销</div>
            <!-- 后期有多个部门的话，使用下拉选 -->
            <!-- <a-select
               :disabled="true"
              :showSearch="true"
              :showArrow="true"
              placeholder="请输入部门"
              v-decorator="['departmentId', validatorRules.departmentId]"
            >
              <a-select-option
                v-for="(item,key) in departmentData"
                :value="item.id"
                :key="key"
              >{{item.dataName}}</a-select-option>
            </a-select> -->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动节点">
            <a-select
              :showArrow="true"
              placeholder="请选择活动节点"
              :showSearch="true" :filter-option="filterOption" allowClear
              v-decorator="['activeNode', validatorRules.activeNode]"
            >
              <a-select-option
                v-for="(item,key) in activeNode"
                :value="item.id"
                :key="key"
              >{{item.dataName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物料类型">
            <a-select
              :showSearch="true" :filter-option="filterOption" allowClear
              :showArrow="true"
              placeholder="请选择物料类型"
              v-decorator="['materialType', validatorRules.materialType]"
            >
              <a-select-option
                v-for="(item,key) in materialType"
                :value="item.id"
                :key="key"
              >{{item.dataName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="物料名称"
            style="line-height:26px;"
          >
            <a-input
              placeholder="请输入物料名称"
              v-decorator="[ 'materialName', validatorRules.materialName]"
            />
            <p v-if="showStand" style="color:#A6A8B4;margin:0;height:12px;line-height:12px;">名称标准：活动主题-涉及产品-其他</p>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物料描述">
            <!-- 将a-input改成了a-textarea -->
            <a-textarea
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入物料描述"
              v-decorator="[ 'materialDescription', validatorRules.materialDescription]"
            />
            <!-- <a-input
              type="textarea" 
              placeholder="请输入物料描述"
              v-decorator="[ 'materialDescription', validatorRules.materialDescription]"
            /> -->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="下载链接">
            <a-input
              placeholder="请输入下载链接"
              v-decorator="[ 'downloadLink', validatorRules.downloadLink]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!-- 查看 -->
    <a-modal :centered="true"
      v-model="isShowModal2"
      title="物料详情"
      :footer="null"
      width="800px"
      :bodyStyle="{paddingTop:'12px',paddingLeft:'0',paddingRight:'0'}"
      @cancel="hidden"
    >
      <a-row class="add_row">
        <a-col :span="3" style="text-align:right;">部门:</a-col>
        <a-col :span="16" class="add_col2">
          <a-input :readOnly="true" :value="departmentName" class="input_color"></a-input>
        </a-col>
      </a-row>
      <a-row class="add_row">
        <a-col :span="3" style="text-align:right;">活动节点:</a-col>
        <a-col :span="16" class="add_col2">
          <a-input :readOnly="true" :value="activeNodeName" class="input_color"></a-input>
        </a-col>
      </a-row>
      <a-row class="add_row">
        <a-col :span="3" style="text-align:right;" class="add_col1">物料类型:</a-col>
        <a-col :span="16" class="add_col2">
          <a-input :readOnly="true" :value="materialTypeName" class="input_color"></a-input>
        </a-col>
      </a-row>
      <a-row style="display:flex;align-items:center;" class="add_row">
        <a-col :span="3" style="text-align:right;" class="add_col1">物料名称:</a-col>
        <a-col :span="16" style="margin-left:16px;">
          <a-input
            placeholder="请输入物料名称"
            :readOnly="true"
            v-model="add.materialName"
            class="input_color"
          ></a-input>
        </a-col>
      </a-row>
      <a-row class="add_row">
        <a-col :span="3" style="text-align:right;" class="add_col1">物料描述:</a-col>
        <a-col :span="16" class="add_col2">
          <a-textarea
            style="width:100%;"
            :readOnly="true"
            placeholder="请输入描述"
            v-model="add.materialDescription"
            :autosize="true"
            class="input_color"
          />
        </a-col>
      </a-row>
      <a-row class="add_row">
        <a-col :span="3" style="text-align:right;" class="add_col1">下载链接:</a-col>
        <a-col :span="16" style="margin-left:16px;">
          <a-input
            placeholder="请输入物料下载链接"
            :readOnly="true"
            type="textarea"
            :autosize="true"
            v-model="add.downloadLink"
            class="input_color"
            style="color:#3264D5;"
          ></a-input>
        </a-col>
      </a-row>
      <a-row style="color:#3264D5;font-size:14px;border-top:1px solid #E7E8E9;padding:24px 0 0 24px;">
        <a-col style="cursor:pointer;" @click="gotoDownload">
           点击查看下载情况
        </a-col>
      </a-row>
    </a-modal>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>

<script>
import Vue from 'vue'
import pick from 'lodash.pick'
import { dataDictionary, departmentAll, addMaterial, updateMaterial, downloadMaterial } from '@/api/api'
import { USER_AUTH,MENU_DATA } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import tooltip from "@/components/tooltip/tooltip.vue"
export default {
  mixins: [JeecgListMixin],
  components:{ tooltip },
  data() {
    return {
	  disabled:false,
      bordered:false,
      message:'操作成功',
      type:'info',
      deptName:'',
      dept:'',
      showStand:true,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        // departmentId: {
        //   rules: [
        //     { required: true, message: '请输入部门' },
        //     { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' }
        //   ]
        // },
        activeNode: {
          rules: [{ required: true, message: '请选择活动节点' }]
        },
        materialType: {
          rules: [{ required: true, message: '请选择物料类型' }]
        },
        materialName: {
          rules: [
            { required: true, message: '请输入物料名称' },
            { min: 1, max: 20, message: '长度不超过 20 个字符', whitespace: true, trigger: 'blur'},
            { validator: this.validateName }
          ]
        },
        materialDescription: {
          rules: [{ min: 1, max: 200, message: '长度不超过 200 个字符', trigger: 'blur' }]
        },
        downloadLink: {
          rules: [
            { required: true, whitespace: true, message: '请输入下载链接' }
          ]
        }
      },
      form: this.$form.createForm(this),
      confirmLoading: false,
      showWarn: true,
      showWarn2: false,
      titles: '新增物料',
      add: {
        id: '',
        departmentId: undefined, // 部门id
        activeNode: undefined, // 活动节点id
        materialType: undefined, // 物料类型
        materialName: '', // 物料名称
        materialDescription: '', // 物料描述
        downloadLink: '' // 下载链接
      },
      autoSize: {
        minRows: 3
      },
      content: '',
      imageUrl: '',
      dataSource: [],
      //按钮权限
      authButton: {
        reviewBtn: true,
        editBtn: true,
        deleteBtn: true,
        createBtn: true,
        downloadBtn: true
      },
      columns: [
        // {
        //   title: '序号',
        //   align: 'center',
        //   className: 'table_title',
        //   width: 100,
        //   customRender: (text, record, index) => {
        //     return `${(this.ipagination.current - 1) * this.ipagination.pageSize + (index + 1)}` //当前页数减1乘以每一页页数再加当前页序号+1
        //   }
        // },
        {
          title: '部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
          align: 'center',
          className: 'table_title',
          width: 150
        },
        {
          title: '活动节点',
          dataIndex: 'activeNodeName',
          key: 'activeNodeName',
          ellipsis: true,
          align: 'center',
          className: 'table_title',
          width: 150
        },
        {
          title: '物料类型',
          dataIndex: 'materialTypeName',
          key: 'materialTypeName',
          ellipsis: true,
          align: 'center',
          className: 'table_title',
          width: 150
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          key: 'materialName',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'materialName' },
          className: 'table_title',
          width: 150
        },
        {
          title: '物料描述',
          dataIndex: 'materialDescription',
          key: 'materialDescription',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'materialDescription' },
          className: 'table_title',
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          ellipsis: true,
          className: 'table_title',
          align: 'center',
          width: 150,
          // fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/cms/material/list',
        delete: '/cms/material/delete'
      },
      isShowModal: false, //是否显示弹窗
      isShowModal2: false, //是否显示弹窗
      queryParam: {
        department: '',
        activeNode: '',
        materialType: ''
      },
      departmentData: [], // 部门
      activeNode: [], // 活动节点
      materialType: [], // 物料类型
      departmentName: '',
      activeNodeName: '',
      materialTypeName: '',
      activeNodeId:'',
      materialTypeId:''
    }
  },
  created() {
    // 获取部门数据
    this.getDepartmentData()
    // 获取活动节点
    this.getActiveNode()
    // 获取物料类型
    this.getMaterialType()
  },
  watch: {
    'add.materialName': function(newVal, oldVal) {
      var arr = newVal.split('-')
      this.showWarn = arr.length === 3 && arr[0] && arr[1] && arr[2] ? true : false
      this.showWarn2 = !(arr.length === 3 && arr[0] && arr[1] && arr[2]) ? true : false
    }
  },
  computed: {
    // 计算保存按钮是否可用
    saveBtn() {
      return this.add.departmentId && this.add.activeNode && !this.showWarn2 ? false : true
    }
  },
  mounted() {
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if (auth.hasOwnProperty(this.$route.name)) {
      this.authButton = auth[this.$route.name]
    }
    // setTimeout(() => {
    //   setTimeout(() => {
    //     var dom = document.getElementsByClassName('ant-table-small')[0]
    //     dom.style.border = 'none'
    //   }, 200)
    // })
  },
  methods: {
    // 点击   ‘点击查看下载情况’ 触发
    gotoDownload(){

      // const menu = Vue.ls.get(MENU_DATA)
      // console.log('menu:',menu)
      // if(menu){
      //   menu.forEach(item=>{
      //     if(item.meta.title.indexOf('物料管理')!=-1){
      //       item.children.forEach(one=>{
      //         if(one.meta.title.indexOf('物料下载明细')!=-1){
      //           this.$router.push("/" + one.component)
      //
      //         }
      //       })
      //     }
      //   })
      // }

      let newParam = Object.assign({},this.add)
      newParam.activeNode = this.activeNodeId
      newParam.materialType = this.materialTypeId
      console.log('menu:',newParam)

      this.$router.push({path:"/materiel/download",query:{currentParam:newParam}})
    },
    handleCancel() {
      this.isShowModal = false
    },
    validateName(rule, value, callback){
       if (!value) {
        callback()
         this.showStand = true
      } else {
        var str = value.split("-")
        if(str.length===3 && str[0] && str[1] && str[2]) {
          callback()
          this.showStand = true
        } else {
          this.showStand = false
          callback('请输入正确的格式，例：活动主题-涉及产品-其他')
        }
      }
    },
    // 验证输入的下载地址是否合法
    validateURL(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^http(s)?:\/\/[\w.]+[\w\/]*[\w.]*\??[\w=&\+\%]*$/
          ).test(value)
        ) {
          callback()
        } else {
          callback('请输入正确的下载地址!')
        }
      }
    },

    // 鼠标从物料名称输入框离焦时触发
    blurMaterilName() {
      if (!this.add.materialName) {
        this.showWarn = true
        this.showWarn2 = false
      }
    },
    selectType(e) {
      this.queryParam.materialType = e ? e : ''
    },
    selectNode(e) {
      this.queryParam.activeNode = e ? e : ''
    },
    selectDept(e) {
      this.queryParam.department = e ? e : ''
    },
    // 点击下载触发
    load(msg) {
      downloadMaterial({ id: Number(msg.id) }).then(res => {
        if (res.code === 200) {
        } else if (res.code !== 400) {
          // this.$message.warn(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    // 编辑
    editDetail(record) {
       this.titles = JSON.stringify(record) === '{}' ? '新增物料' : '编辑物料'
      this.form.resetFields()
      console.log(record)
      this.model = Object.assign({}, record)

      this.isShowModal = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'activeNode','materialType', 'materialName', 'materialDescription', 'downloadLink')
          // pick(this.model, 'departmentId', 'activeNode','materialType', 'materialName', 'materialDescription', 'downloadLink')
        )
      })
    },
    warnMethod(){
      this.$refs.tooltip.visible = true
      this.$refs.tooltip.alertVisible = true
      setTimeout(()=>{
        this.$refs.tooltip.cancel()
      },3000)
    },
    // 点击新增 或者编辑弹窗中的保存按钮触发
    submitForm() {
      console.log('err')
      this.form.validateFields((err, values) => {
        console.log('err123:',err)
          if (!err) {
			      this.disabled=true;
			      console.log(this.disabled)
            this.confirmLoading = true
            let formData = Object.assign(this.model, values)			
            formData.departmentId = this.dept
            let obj = this.model.id ? updateMaterial(formData) : addMaterial(formData)
            obj.then(res => {
              if (res.code === 200) {
                 if(this.model.id){
                  this.message = "修改成功"
                  }else{
                  this.message = "新增成功"
                }
                this.type = "info"
                this.warnMethod();

                this.isShowModal = false
                this.searchQuery()
              } else if (res.code !== 400) {
                // this.$message.warn(res.message)
                this.message = res.message
                this.type = "error"
                this.warnMethod();
              }
            }).finally(() => {
               this.confirmLoading = false
               this.disabled=false;
            })
          }
        })
    },
    // 点击查看 右上角叉号触发
    hidden() {
      // this.clearData()
      this.departmentName = ''
      this.activeNodeName = ''
      this.materialTypeName = ''
      console.log('dddfdfd', this.add)
    },
    addModelShow() {
      this.titles = '新增物料'
       this.editDetail({})
    },
    lookDetail(msg) {
      console.log('mmmmm',msg)
      this.materialTypeId = msg.materialType?msg.materialType:'';
      this.activeNodeId = msg.activeNode?msg.activeNode:'';

      this.isShowModal2 = true;
      this.add.materialName = msg.materialName ? msg.materialName : '';// 物料名称
      this.add.materialDescription = msg.materialDescription ? msg.materialDescription : ' '; // 物料描述
      this.add.downloadLink = msg.downloadLink ? msg.downloadLink : '' ;// 下载链接
      this.departmentName = msg.departmentName ? msg.departmentName : '';
      this.activeNodeName = msg.activeNodeName ? msg.activeNodeName : '';
      this.materialTypeName = msg.materialTypeName ? msg.materialTypeName : '';
    },
    //获取全部部门数据
    getDepartmentData() {
      departmentAll({ dataType: 'materialDepartment' }).then(res => {
        if (res.code === 200) {
          console.log('dddddd',res.data)
          this.departmentData = res.data
          this.dept = res.data[0]['id']
          this.queryParam.department = res.data[0]['id']
          this.deptName = res.data[0]['dataName']

        } else if (res.code !== 400) {
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //获取活动节点
    getActiveNode() {
      departmentAll({ dataType: 'activeNode' }).then(res => {
        if (res.code === 200) {
          this.activeNode = res.data
        } else if (res.code !== 400) {
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //获取物料类型
    getMaterialType() {
      departmentAll({ dataType: 'materialType' }).then(res => {
        if (res.code === 200) {
          this.materialType = res.data
        } else if (res.code !== 400) {
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.margin {
  margin: 0 3px;
}
.col-6 {
  width: 100%;
}
.add_row {
  padding-left:24px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  .add_col1 {
    color: #55565d;
    font-size: 14px; 
  }
  .add_col2 {
    margin-left: 16px;
  }
}
.input_color {
  color: #55565d;
  background:#F5F5F5;
  border: 1px solid #d9d9d9;box-shadow: none;
}
.conditon {
  width: 200px;
  padding: 0 !important;
}
.text {
  margin: 0 16px 0 24px;
  padding: 0 !important;
}
.ant-form-item {
  margin-bottom: 16px;
}
.buttonGray{
		background: rgb(245,245,245);
		color: #55565D;;
		width: 112px;
		height: 34px;
	}
.buttonBlue{
		background: #3264D5;
		color: white;
		width: 112px;
		height: 34px;
	}
</style>