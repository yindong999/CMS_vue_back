<template>
  <!-- 标签管理页面 -->
  <div>
    <!-- 上部筛选区域 -->
    <a-card title="">
      <a-form layout="inline">
        <a-row :gutter="24" style="display:flex;align-items:center;">
          <a-col>标签名称</a-col>
          <a-col :md="4" :sm="6">
            <a-input
              style="width: 100%"
              allowClear
              placeholder="请输入标签"
              v-model="queryParam.tagName"
            ></a-input>
          </a-col>
          <a-col>部门</a-col>
          <a-col :md="4" :sm="6">
            <a-select
              style="width: 100%"
              :showSearch="true"
              allowClear
              placeholder="请选择部门"
              @change="selectDepartment"
            >
              <a-select-option
                v-for="(item,key) in departmentData"
                :value="item.value"
                :key="key"
              >{{item.label}}</a-select-option>
            </a-select>
          </a-col>
          <a-col>标签状态</a-col>
          <a-col :md="4" :sm="6">
            <a-select style="width: 100%" allowClear placeholder="请选择状态" @change="selectTagStatus">
              <a-select-option
                :value="item.value"
                v-for="(item,index) in selectStatus"
                :key="index"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-col>
           <a-col class="col" style="position:absolute;right:0;">
						<a-button @click="searchQuery" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					</a-col>
        </a-row>
      </a-form>
      <!-- 查询按钮 -->
      <!-- <a-row type="flex" justify="end" style="margin-top:8px;">
        <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
      </a-row> -->
    </a-card>
    <!-- 表格区域 -->
    <a-card
      title="标签列表"
      :style="{ marginTop: '12px' }"
      :headStyle="headStyle"
      :bodyStyle="{'padding-top':'0'}"
    >
      <a-button
        slot="extra"
        v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn"
        type="primary"
        icon="plus"
        @click="addTags"
      >新增</a-button>
      <a-table
        :columns="columns"
        size="small"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <span slot="remarks" slot-scope="text, record">
          <a-popover title trigger="hover">
            <template slot="content">
              <p style="maxWidth:300px;">{{record.remarks}}</p>
            </template>
            <a
              class="mouseHover"
              onmouseover="this.style.color='#3264D5';"
              onmouseout="this.style.color='#595959';"
            >{{record.remarks}}</a>
          </a-popover>
        </span>
        <span slot="tagStatus" slot-scope="text, record">
          <span v-if="record.tagStatus==='1'" style="color:#55565D;">下线</span>
          <span v-else style="color:#1DCCC9;">启用</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <a style="color:#3264D5;">
            <a v-if="record.tagStatus==='0'">
              <a
                style="color:#3264D5;"
                @click="outline(record)"
                v-if="authButton.hasOwnProperty('forbiddenBtn')&&authButton.forbiddenBtn"
              >下线</a>
            </a>
            <a-popconfirm v-else title="确定启用吗?" @confirm="() => updateTagState(record)">
              <a
                style="color:#3264D5;"
                v-if="authButton.hasOwnProperty('startBtn')&&authButton.startBtn"
              >启用</a>
            </a-popconfirm>
          </a>
          <a
            v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn"
            @click="editTag(record)"
            style="color:#3264D5;margin:0 8px;"
          >编辑</a>
          <a-popconfirm
            v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a style="color:#3264D5">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <!-- 新增标签弹窗 -->
    <a-modal
      :title="addOrEdit?'新增标签':'编辑标签'"
      v-model="isShow"
      okText="保存"
      :width="800"

      @cancel="cancleForm"
    >
      <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary" @click="submitForm" class="affirmBtn">确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="cancleForm" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>
       <a-form :form="form" >
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签分类" style="margin-bottom:16px;">
            <!-- 标签分类 -->
            <a-input placeholder="请输入标签分类" style="color:#55565D;"
             v-decorator="['categoryName', validatorRules.categoryName]"></a-input>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签名称" style="margin-bottom:16px;">
            <!-- 标签名称 -->
            <a-input placeholder="请输入标签名称" style="color:#55565D;"
             v-decorator="['tagName', validatorRules.tagName]"></a-input>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签说明" style="margin-bottom:16px;">
            <!-- 标签说明 -->
            <a-textarea placeholder="请输入标签说明" :autosize="autosize" allowClear
             v-decorator="['remarks', validatorRules.remarks]" />
          </a-form-item>
        </a-form>
    </a-modal>
    <!-- 提示弹窗 -->
    <a-modal v-model="warnVisible" title="提示" @cancle="cancleModal">
      <template slot="footer">
        <div :style="{ textAlign: 'center',padding:'14px 16px'  }">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="primary"  @click="sureModal" class="affirmBtn">确认</a-button>
          </a-config-provider>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button @click="cancleModal" class="abolishBtn">取消</a-button>
          </a-config-provider>
        </div>
      </template>
      <p style="text-align:center;color:#55565D;fon-size:14px;">{{warnText}}</p>
    </a-modal>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>
<script>
import Vue from 'vue'
import pick from 'lodash.pick'
import { USER_AUTH } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import tooltip from "@/components/tooltip/tooltip.vue"
import { mapGetters } from 'vuex'
import { departmentList, tagQuery, tagAdd, tagUpdate, tagUpdateState, outline, listTags } from '@/api/api'
export default {
  mixins: [JeecgListMixin],
  components:{ tooltip },
  data() {
    return { 
      message:'操作成功',
      type:'info',
      records:null,
      editOrUse:false,// false: 启用，下线；true: 编辑
      updateMsg:null,
      warnText:'您确定要下线吗?',
      warnVisible:false,
      namess:'',
      use:true,
      autosize:{
        minRows:3
      },
      headStyle: {
        'text-align': 'center',
        'border-bottom': 'none'
      },
      //按钮权限，默认拥有全部权限
      authButton: {
        createBtn: true,
        editBtn: true,
        deleteBtn: true,
        startBtn: true, //启用按钮
        forbiddenBtnBtn: true //下线按钮
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        categoryName: {
          rules: [
            { required: true, message: '请输入标签分类' },
            { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur'},
            { message: '请不要输入空格', whitespace: true, trigger: 'blur'},
          ]
        },
        tagName: {
          rules: [{ required: true, message: '请输入标签名称'},
            { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' },
            { message: '请不要输入空格',whitespace: true, trigger: 'blur' },
            { validator:this.tagNameChange}
            ]
        },
        remarks: {
          rules: [
            { whitespace: true, message: '请输入标签说明' },
             { min: 1, max: 200, message: '长度不超过 200 个字符', trigger: 'blur' },
          ]
        }
      },
      selectStatus: [
        { name: '全部', value: '' },
        { name: '启用', value: '0' },
        { name: '下线', value: '1' }
      ],
      textNum:200, // 标签说明可以输入的文字数量
      tagsNames: [], // 标签分类
      tagCate: false, // 标签分类输入框显示特殊字符，后面的提示语显示的标志
      tagNames: false, // 标签名称输入框显示特殊字符，后面的提示语显示的标志
      showWarn: false,
      add: {
        categoryName: '',
        tagName: '',
        remarks: ''
      },
      columns: [
        {
          title: '标签分类',
          dataIndex: 'categoryName',
          key: 'categoryName',
          align: 'center',
          width: 150,
          className: 'table_title'
        },
        {
          title: '标签名称',
          dataIndex: 'tagName',
          key: 'tagName',
          ellipsis: true,
          align: 'center',
          width: 150,
          className: 'table_title'
        },
        {
          title: '创建部门',
          dataIndex: 'createDepartmentName',
          key: 'createDepartmentName',
          ellipsis: true,
          align: 'center',
          width: 150,
          className: 'table_title'
        },
        {
          title: '创建人',
          dataIndex: 'createUser',
          key: 'createUser',
          ellipsis: true,
          align: 'center',
          width: 150,
          className: 'table_title'
        },
        // {
        //   title: '标签说明',
        //   dataIndex: 'remarks',
        //   key: 'remarks',
        //   ellipsis: true,
        //   align: 'center',
        //   minWidth: 200,
        //   scopedSlots: { customRender: 'remarks' },
        //   className: 'table_title'
        // },
        {
          title: '标签状态',
          dataIndex: 'tagStatus',
          key: 'tagStatus',
          ellipsis: true,
          align: 'center',
          width: 100,
          className: 'table_title',
          scopedSlots: { customRender: 'tagStatus' }
        },
        {
          title: '时间',
          dataIndex: 'createDate',
          key: 'createDate',
          ellipsis: true,
          align: 'center',
          width: 150,
          className: 'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          ellipsis: true,
          align: 'center',
          width: 150,
          // fixed: 'right',
          className: 'table_title',
          scopedSlots: { customRender: 'action' }
        }
      ],
      isShow: false, //控制是否显示弹出框
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 }
      },
      dataSource: [],
      url: {
        list: '/cms/tag/listTag',
        delete: '/cms/tag/delete'
      },
      patrn:/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im,//标签吧名称和标签分了的校验规则
      departmentData: [], // 部门
      showDepSel: true,
      addOrEdit: true, // 点击的是新增还是编辑；true:新增，false:编辑
      form: this.$form.createForm(this, { name: 'addLabel' })
    }
  },
  watch: {
    'add.categoryName': function(val1, val2) {
      this.tagCate = !this.patrn.test(val1) ? false : true
    },
    'add.tagName': function(val1, val2) {
      // this.tagNames = !this.patrn.test(val1) ? false : true
      if(!this.patrn.test(val1)){
         this.tagNames = false
      }else{
         this.tagNames = true
      }
    },
    'add.remarks':function(newVal,oldVal){
      var leng = Array.from(newVal).length
      if(leng<=200){
        this.textNum = 200 - leng
      }else{
        this.add.remarks = newVal.substr(0,200)
        this.textNum = 0
      }
    }
  },
  created() {
    this.getDepartmentList()
  },
  mounted() {
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if (auth.hasOwnProperty(this.$route.name)) {
      this.authButton = auth[this.$route.name]
    }
    setTimeout(() => {
      var dom = document.getElementsByClassName('ant-table-small')[0]
      dom.style.border = 'none'
    }, 200)
    // 获取用户信息，判断当前用户是否有系统管理员角色，有的话，查询条件中显示部门，否则不显示；
    var userInfo = this.userInfo()
    if (userInfo.roleName.search('系统管理员') != -1) {
      this.showDepSel = true
    } else {
      this.showDepSel = false
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    // 获取部门数据
    getDepartmentList() {
      this.departmentData = []
      this.departmentData.push({ value: '', label: '全部' })
      departmentList({ page: 1, size: 1000 }).then(res => {
        if (res.code === 200) {
          let data = res.data.list
          data.forEach(value => {
            let option = {}
            option['value'] = value.id
            option['label'] = value.departmentName
            this.departmentData.push(option)
          })
        } else if (res.code !== 400) {
          // this.$message.error(res.message)
          this.message = res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    selectDepartment(e) {
      this.queryParam.createDepartmentId = e ? e : ''
    },
    selectTagStatus(e) {
      this.queryParam.tagStatus = e ? e : ''
    },
    // 更改标签状态触发
    updateTagState(msg) {
      console.log("msg.tagStatus ",msg.tagStatus )
      tagUpdateState({ id: msg.id, tagStatus: msg.tagStatus }).then(res => {
        if (res.code === 200) {
          if(msg.tagStatus==='1'){
            this.message = '启用成功'
          }else{
            this.message = '下线成功'
          }
          this.type = 'info'
          this.warnMethod()
          this.searchQuery()
          this.updateMsg = null
        }else if(res.code !== 400){
          this.message = res.message
          this.type = 'error'
          this.warnMethod()
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
    handleSearch(e) {
      console.log("搜索")
      listTags({ categoryName: e, page: 1, size: 10 }).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.tagsNames = res.data
        }else{
           this.add.categoryName = e
        }
      })
    },
    //  点击提示框确认按钮触发
    sureModal(){

      this.warnVisible = false
      console.log('this.editOrUse',this.editOrUse)
      if(this.editOrUse){

         this.addOrEdit = JSON.stringify(this.records) === '{}' ? true : false
            this.form.resetFields()
            this.model = Object.assign({}, this.records)

            this.isShow = true
            this.$nextTick(() => {
              this.form.setFieldsValue(
                pick(this.model, 'categoryName','tagName', 'remarks')
              )
            })
      }else{
        this.updateTagState(this.updateMsg)
      }
    },
    // 点击提示框取消按钮触发
    cancleModal(){
      this.warnVisible = false
      this.updateMsg = null
    },
    // 点击下线的时候触发
    outline(msg) {
      var _this = this
      this.updateMsg = msg
      this.warnVisible = true
      this.editOrUse = false
      outline({ id: msg.id }).then(res => {
        // res:false  ; 标签和内容关联；res:true; 标签和内容不关联；
        var titles = ''
        if (res) {
          this.warnText = '您确定要下线吗?'
        } else {
          this.warnText = '该标签已经和内容关联，您确定要下线吗?'
        }
      })
    },
    // 点击新增按钮触发
    addTags() {
      this.isShow = true
      this.addOrEdit = true
    },
    //  点击编辑按钮触发
    editTag(record) {
      this.warnVisible = true
      this.editOrUse = true
      this.records = record
       outline({ id: record.id }).then(res => {
        // res:false  ; 标签和内容关联；res:true; 标签和内容不关联；
        if (res) {
          this.warnText = '您确定要编辑吗?'
        } else {
          this.warnText = '该标签已经和内容关联，您确定要编辑吗?'
        }
      })
    },
    // 标签名称输入框内容改变时触发
    tagNameChange(rule, value, callback) {
      console.log(this.model.tagName,'---',value)
      if(value){
        if(this.model.tagName !== value){
          tagQuery({ name: value }).then(res => {
            if(!res){
              callback()
            }else{
              if(value){
              callback('标签名称已存在')
              }else{
              callback()
              }
            }
          })
        }else{
          callback()
        }
      }else{
          callback()
      }

    },
    cancleForm() {
      this.clearData()
      this.isShow = false
      this.showWarn = false
    },
    // 点击新增或者编辑取消按钮触发
    clearData() {
      this.add.categoryName = ''
      this.add.tagName = ''
      this.add.remarks = ''
      this.add.id = ''
      this.form.resetFields()
      this.model={}
    },
    // 点击新增或者编辑弹窗中确定按钮触发
    submitForm() {
          this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            let formData = Object.assign(this.model, values)
            let obj = this.model.id ? tagUpdate(formData) : tagAdd(formData)
            obj.then(res => {
              if (res.code === 200) {
                console.log('this.model.id',this.model.id)
                if(this.model.id){
                  this.message = '修改成功'
                }else{
                  this.message = '新增成功'
                }
                this.type = 'info'
                this.warnMethod()
                this.isShow = false
                this.searchQuery()
              } else if (res.code !== 400) {
                // this.$message.warn(res.message)
                this.message = res.message
                this.type = 'error'
                this.warnMethod()
              }
            }).finally(() => {
               this.confirmLoading = false
               this.form.resetFields()
               this.model = {}
               this.editOrUse = false
            })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.text {
  text-align: center;
}
.add_row {
  margin-bottom: 20px;
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
.warn {
  margin: 0;
  position: absolute;
  font-size: 12px;
  top: 32px;
  color: #e4586a;
}
</style>