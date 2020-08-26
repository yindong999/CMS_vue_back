<template>
	<div class="navBox">
		<!-- <div class="navSearch"> -->
			<a-card :bodyStyle="{'display':'flex','justify-content':'space-between'}" class="statementQuery">
			 <!-- <a-input-search
			 v-model="findBy"
			 placeholder="请输入关键字搜索"
			 :maxLength="50"
			 enter-button @search="onSearch" /> -->
			  <a-row class="formStyle" style="width: 100%;" type="flex" justify="space-between">
			   <a-row class="leftDiv"> 
				  <a-col style="display:flex;align-items:center;" :span="8">
					<span class="textWidth4" style="text-align:right;">部门</span>
					<!-- 目前部门就一个，使用输入框 -->
					<!-- <a-input :disabled="true" v-model="branchA"  style="color:#55565D;width:calc(100% - 97px);margin-left: 16px;"></a-input> -->
					<div style="color:#55565D;width:calc(100% - 97px);margin-left: 16px;border-radius: 4px; line-height:30px;
					background:#F5F5F5;height:32px;border: 1px solid #d9d9d9;padding-left:11px;">
					中国区整合营销</div>
					<!-- <a-select  style="width:calc(100% - 97px);margin-left:16px;"  @change="changeBran" placeholder="请选择部门" :showSearch="true" :filter-option="filterOption">
						<a-select-option value>
						全部
						</a-select-option>
						<a-select-option :value="item.id" v-for="(item,index) in branchS" :key="index">{{item.dataName}}</a-select-option>
					</a-select> -->
					</a-col>
				   <!-- 账号 -->
					<a-col style="display:flex;align-items:center;" :span="8">
						<span class="textWidth4">案例类型</span>
				   <a-select  style="width:calc(100% - 97px);margin-left:16px;"  @change="changeOne"  allowClear  placeholder="请选择案例类型" :showSearch="true" :filter-option="filterOption" >
				     <a-select-option value >
				     	全部
				      </a-select-option>
				     <a-select-option :value="item.id" v-for="(item,index) in caseTypeS" :key="index">{{item.dataName}}</a-select-option>
				   </a-select>
				   </a-col>
				   <!-- 发布平台 -->
				 <a-col style="display:flex;align-items:center;" :span="8">
				   <span class="textWidth4">案例名称</span>
				   <a-input  style="width:calc(100% - 97px);margin-left:16px;" allowClear  v-model="caseName" placeholder="请输入案例名称"></a-input>
				 </a-col>
			   </a-row>
				<div class="btnCol" style="width:90px;">
				<a-button @click="onSearch" type="primary" class="queryBtn">
					<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
					查询</a-button>
				</div>
			    </a-row>
			 </a-card>
		<!-- </div> -->
		<div class="contS" style="margin-top: 12px;">
			<a-card title="案例明细表"  :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
				 <a-button type="primary" @click="openModel" slot="extra" style="padding:0 16px;position:absolute!important;right:0!important;">
				 	<a-icon type="plus" />新增
				 </a-button>
			  <div style="background:#fff;">
			    <a-table
				 style="margin-top: 0px;"
			      ref="table"
			      size="small"
			      :bordered="false"
			      rowKey="tabIndexByTable"
			      :columns="columns"
			      :dataSource="dataSource"
			      :pagination="ipagination"
			      :loading="loading"
			      @change="handleTableChange"
				  :scroll="{scrollToFirstRowOnChange:true,y:tabHeight}"
			    >

			      <span slot="title2" slot-scope="text, record">
			        <a-popover title trigger="hover">
			          <template slot="content">
			            <p style="maxWidth:300px;word-break:break-all;">{{record.title}}</p>
			          </template>
			          <a
			            @click="handleLook(record)"
			            style="color:#595959;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all;width:150px;display:inline-block;"
			            onmouseover="this.style.color='#18AEFF';"
			            onmouseout="this.style.color='#595959';"
			          >{{record.title}}</a>
			        </a-popover>
			      </span>
			      <span
			        slot="shareCount"
			        slot-scope="text, record"
			      >{{record.shareCount?record.shareCount:0}}</span>
			      <span
			        slot="commentCount"
			        slot-scope="text, record"
			      >{{record.commentCount?record.commentCount:0}}</span>
			      <span slot="giveCount" slot-scope="text, record">{{record.giveCount?record.giveCount:0}}</span>
			      <span slot="action" slot-scope="text, record">
			        <a
					style="margin-right: 12px;color:#3264D5"
			          v-if="authButton.hasOwnProperty('detailCenter')&&authButton.detailCenter"
					  :href="record.pdfUrl"
					  target="_blank"
			        >详情</a>
					<a
					@click="handleCreat(record)"
					style="margin-right: 12px;color:#3264D5"
					>编辑</a>

					<a-popconfirm v-if="authButton.hasOwnProperty('Delete')&&authButton.Delete" okText="确认" cancelText="取消"
					 title="确认删除吗?" @confirm="() => handleRemove(record)">
						<a style="color:#3264D5;margin-right: 12px;">删除</a>
					</a-popconfirm>
					<!-- <a
					@click="handleGit(record)"
					v-if="authButton.hasOwnProperty('downloadBtn')&&authButton.downloadBtn&&record.pdfUrl"
					style="margin-right: 12px;color:#3264D5"
					>下载</a> -->
			      </span>
			    </a-table>
			  </div>
			</a-card>

		</div>

		<a-modal :centered="true"
			  class="ModelMan"
		      :title="addOrEdit==2?'新增案例':'编辑案例'"
		      :visible="visible"
		      @ok="addOrEdit==2?handleOk():editOk()"
		      @cancel="addOrEdit==2?handleCancel():editCancel()"
			  :footer="null"
			  width="800px"
			 :bodyStyle="{'height':'430px'}"
		    >
			<a-form :form="form" >
			  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门" 
			  style=" width:   320px;float: left;margin-left: 85px;">
			    <!-- 目前部门就一个，使用输入框 -->
			    <!-- <a-input :disabled="true" v-model="branchA"  style="color:#55565D;width: 200px;margin-left: 10px;"></a-input> -->
					<div style="color:#55565D;width:200px;border-radius: 4px; line-height:30px;
					background:#F5F5F5;height:32px;border: 1px solid #d9d9d9;padding-left:11px;margin:4px 0 4px 10px;">
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
			  
			  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="品牌" style=" width:   320px;float: left;">
			    <a-select
				style="width: 200px;margin-left: 10px;"
			      :showArrow="true"
			      placeholder="请选择品牌"
			      :showSearch="true" :filter-option="filterOption" allowClear
			      v-decorator="['brand', validatorRules.brand]"
			    >
			      <a-select-option
			        v-for="(item,key) in brandS"
			        :value="item.id"
			        :key="key"
			      >{{item.dataName}}</a-select-option>
			    </a-select>
			  </a-form-item>
			  
			 <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发布时间" 
			   style="margin-top:-6px; width:   320px;float: left;margin-left: 85px;">
			  	<a-date-picker 
				v-decorator="['publishDate', validatorRules.publishDate]" 
				placeholder="请选择日期" @change="onChangeA" style="margin-right: 15px;width: 200px;margin-left: 10px;"	>
			  	</a-date-picker>
			 </a-form-item>
			 
			  <a-form-item 
			  :labelCol="labelCol" 
			  :wrapperCol="wrapperCol" 
			  label="案例类型" style=" width:320px;float: left;margin-top:-6px;">
			    <a-select
				style="width: 200px;margin-left: 10px;"
			      :showSearch="true" :filter-option="filterOption" allowClear
			      :showArrow="true"
			      placeholder="请选择案例类型"
			      v-decorator="['caseType', validatorRules.caseType]"
				  
			    >
			      <a-select-option
			        v-for="(item,key) in caseTypeS"
			        :value="item.id"
			        :key="key"
			      >{{item.dataName}}</a-select-option>
			    </a-select>
			  </a-form-item>
			  
			  <a-form-item
			    style="margin-left: -30px;"
			    :labelCol="labelCol"
			    :wrapperCol="wrapperCol"
			    label="案例名称"
			  >
			    <a-input
				style="width: 528px;margin-left: 8px;"
				  :maxLength='20'
			      placeholder="请输入案例名称"
			      v-decorator="[ 'caseName', validatorRules.caseName]"
			    />
			  </a-form-item>
				<a-form-item
				  style="margin-left: -30px;"
				  :labelCol="labelCol"
				  :wrapperCol="wrapperCol"
				  label="上传PDF"
				>
					<span style="display: block;float: left;position: relative;margin-left: 8px;">
						<a-upload
						  :headers="headers"
						   name="file"
						   list-type="picture-card"
						   class="avatar-uploader "
						   :data="{'ossModuleCode':'pdf'}"
						   :show-upload-list="false"
						   :action="urlList.fileUpload"
						   :before-upload="editbeforeUpload"
						   @change="editChange"
						   :bordered="false"
						    v-decorator="['pdfUrl', validatorRules.pdfUrl]"
						 >
							<div v-if="pdfUrl" style="position: absolute;left: 0;top:0;width:106px;height:106px;background: white;border:1px dotted #DFE0EB;" >
								<span style="display: inline-block;position: absolute;right: 4px;top: 2px;" @click="confirmC" >
									<a-popconfirm title="确认删除吗?" @confirm="confirmS" okText="确认" cancelText="取消">
										<a-icon type="close" />
									</a-popconfirm>
								</span>
								<img  src="@/assets/pdF.png" width="55px" height="55px" style="border: none;margin-top: 21px;"/>
							</div>
						   <div v-else>
							 <a-icon :type="loading ? 'loading' : 'plus'" />
							 <div class="ant-upload-text" style="marign-top:5px;">
							   PDF
							 </div>
						   </div>
							<progress v-show="uploddIng" id="pg" :value="0" max="100" style="width: 76px;"></progress>
						 </a-upload>
					</span>
				 </a-form-item>
			</a-form>
			   <p style="position: absolute; bottom: 32px;width: 100%;text-align: center;">
				  <button
				  @click="addOrEdit==2?handleOk():editOk()"
					:disabled="disabled"
					:class="disabled== true ? 'buttonGray' : 'buttonBlue' "
				   style="cursor:pointer;border: none;width: 108px;height: 36px;font-size: 14px;">
					保存
				  </button>
				  <button
				   @click="addOrEdit==2?handleCancel():editCancel()"
				   style="cursor:pointer;border: 1px solid #DFE0EB;margin-left: 16px;width: 108px;height: 36px;color: #767885;font-size: 14px;background: white;">
				  	取消
				  </button>
			   </p>
		</a-modal>
		<tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
	</div>
</template>

<script>
    import tooltip from "@/components/tooltip/tooltip.vue";
	import moment from 'moment';
	import Vue from 'vue'
	import {
		baseUrl
	} from '@/api/manage'
	import pick from 'lodash.pick'
	import { USER_AUTH } from '@/store/mutation-types'
	import {
		ACCESS_TOKEN
	} from '@/store/mutation-types'
	import {
		USER_INFO
	} from '@/store/mutation-types'
	import { JeecgListMixin } from '@/mixins/JeecgListMixin'

	import {updateCent,DeleteCenter,addCenter,getdepartment,departmentAll,findCenter,downLoad} from '@/api/api'
	export default {
	  name: 'marketing',
	  mixins: [JeecgListMixin],
	  components:{ tooltip }  ,
	  data(){
		  return{
			  model: {},//数据存储
			  labelCol: {
			    xs: { span: 3 },
			    sm: { span: 6 }
			  },
			  wrapperCol: {
			    xs: { span: 4 },
			    sm: { span: 18 }
			  },
			  validatorRules: {
			    // departmentId: {
			    //   rules: [
			    //     { required: true, message: '请输入部门' },
			    //     { min: 1, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' }
			    //   ]
			    // },
			    brand: { //品牌
			      rules: [{ required: true, message: '请选择品牌' }]
			    },
			    caseType: {//类型
			      rules: [{ required: true, message: '请选择案例类型' }]
			    },
				publishDate:{//时间
					rules: [{ required: true, message: '请选择发布时间' }]
				},
				pdfUrl:{//pdf
					rules: [{ required: true, message: '请上传PDF文件' }]
				},
			    caseName: {
			      rules: [// 案例名称
			        { required: true, message: '请输入案例名称' },
			        { min: 1, max: 20, message: '长度不超过 20 个字符', whitespace: true, trigger: 'blur'},
			      ]
			    },
			  },
			  form: this.$form.createForm(this),
			  addOrEdit:2,// 2 新增 1 编辑
			  message:'',//提示文本
			  type:'',//提示格式
			  idS:'',
			  disabled:false,//禁用还是启用
			  uploddIng:false,
			  publishDate:null,//编辑时间
			  Avisible:false,
			  findBy:'',//搜索条件
			  domeType:null,//案例类型
			  caseTypeS:[],
			  caseName:'',//案例名称
			  branch:'',//部门
			  branchA:'中国区整合营销',
			  branchS:[], //部门集合
			  brandS:[], //品牌集合
			  visible:false,
			  authButton: {
				reviewBtn: true
			  },
			  headStyle: {

			    'text-align': 'center',
			    'border-bottom': 'none'
			  },
			  columns: [
				{
				  title: '部门',
				  align: 'center',
				  dataIndex: 'departmentName',
				 
				  width: 200,
				  className: 'table_title'
				},
				{
				  title: '案例类型',
				  align: 'center',
				  dataIndex: 'caseTypeName',
				  width: 200,
				  className: 'table_title'
				},
				{
				  title: '案例名称',
				  align: 'center',
				  dataIndex: 'caseName',
				  width: 200,
				  ellipsis:true,
				  className: 'table_title'
				},
				{
				  title: '上传日期',
				  align: 'center',

				  dataIndex: 'uploadDate',
				  width: 200,
				  className: 'table_title'
				},
				{
				  title: '操作',
				  dataIndex: 'action',
				  align: 'center',
				  scopedSlots: { customRender: 'action' },
				  width: 200,
				  className: 'table_title'
				}
			  ],
			  dataSource:[],
			  url: {
					list: '/cms/classics/case/list'
			   },
			  headers:{},
			  imageUrl:'',
			  pdfUrl:'',
			  downUrl:'',
			  addIM:false,
			  urlList: {
			  	fileUpload: baseUrl + "/cms/upload/uploadImage"
			  },
			  dept:'' // 部门id
		   }
	  },
	  mounted(){
		  const token = Vue.ls.get(ACCESS_TOKEN);
		  const id = Vue.ls.get(USER_INFO).id;
		  this.headers = {
		  	"authorization": token,
		  	"uuss": id
		  }
		  //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
		  let auth = Vue.ls.get(USER_AUTH)
		  //如果按钮权限数据里有当前页面的权限
		  if (auth.hasOwnProperty(this.$route.name)) {
		    this.authButton = auth[this.$route.name]
		  }
		  this.getAll()
		  document.onkeydown = this.keydown;
	  },
	  methods:{
		 disabledDate(current){
		 // Can not select days before today and today
		 return current && current < moment().endOf('day');//！！！！！当天之前的不可选，包括当天
		 // return current < moment().subtract(1, 'day') 
		 },
		  keydown(e){//全局搜索
		  	   var currKey=0,e=e||event; 
		  	   currKey=e.keyCode||e.which||e.charCode;//支持IE、FF 
		  	   if (currKey == 13){
		  		  this.onSearch();
		  		  }
		  },
		  containSpecial( s ) {
		  　var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
			return ( containSpecial.test(s) );
		  },
		  isNull( str ){
			if ( str == "" ) return true;
			var regu = "^[ ]+$";
			var re = new RegExp(regu);
			return re.test(str);
		  },
		  confirmC(e){
			  e.stopPropagation()
		  },
		  confirmS(e){
			  e.stopPropagation()
			  this.deletePic(e)
			  this.form.setFieldsValue({
				pdfUrl: "",
			});
		  },
		  changeOne(val){
		  	console.log(val,'val')
		  	this.domeType = val?val:''
		  },
		  deletePic(){//删除图片链接
			this.pdfUrl = '';
		  },
		  changeBran(val){//选择部门
			  this.branch = val?val:''
		  },
		  getAll(){//获取信息
			  departmentAll({'dataType':"materialDepartment"}).then(res=>{//部门下拉框
				  if(res.code===200){
					this.branchS = res.data
					this.dept = res.data[0].id
				  }else{
					this.message=res.message
					this.type='error'
					this.$refs.tooltip.visible = true
					this.$refs.tooltip.alertVisible = true
					setTimeout(()=>{
					  this.$refs.tooltip.cancel() 
					},3000)
				  }
			  })

			  departmentAll({'dataType':"brand"}).then(res=>{//品牌下拉框
				  if(res.code===200){
					  this.brandS = res.data
				  }else{
					 this.message=res.message
					 this.type='error'
					 this.$refs.tooltip.visible = true
					 this.$refs.tooltip.alertVisible = true
					 setTimeout(()=>{
					   this.$refs.tooltip.cancel() 
					 },3000)
				  }
			  })
			  departmentAll({'dataType':"caseType"}).then(res=>{//类型下拉框
				  if(res.code===200){
					  this.caseTypeS = res.data
					  this.searchQuery();
				  }else{
					  this.message=res.message
					  this.type='error'
					  this.$refs.tooltip.visible = true
					  this.$refs.tooltip.alertVisible = true
					  setTimeout(()=>{
					    this.$refs.tooltip.cancel() 
					  },3000)
				  }
			  })

		  },
		  onChangeA(date, dateString){//选择时间
				// if (dateString != null) {
				// 	//选中的时间不能小于当前时间
				// 	let now = new Date().getTime()
				// 	let select = new Date(dateString).getTime()
				// 	if ((now - select) > 0) {
				// 		this.$refs.tooltip.visible = true
				// 		this.$refs.tooltip.alertVisible = true
				// 		this.type='error'
				// 		this.message = "选择时间应大于当前时间!"
				// 		let a = document.getElementById(pick)
				// 		console.log(a)
				// 		// this.form.resetFields()
				// 		// this.$nextTick(() => { //form 表单 数据回显
				// 		// 	this.form.setFieldsValue(
				// 		// 		pick({}, 'brand','caseType', 'publishDate', 'caseName', 'pdfUrl')
				// 		// 	)
				// 		// })
				// 		setTimeout(()=>{
				// 		  this.$refs.tooltip.cancel()
				// 		},3000)
				// 	}else{
				// 		this.publishDate = dateString ? dateString : null;
				// 	}
				// }
				this.publishDate = dateString ? dateString : null;
		  },
		  openModel(){//打开对话框
			  this.visible=true;
			  this.addOrEdit=2; //2新增
			  this.pdfUrl="";
			  this.form.resetFields()
			  this.model = Object.assign({})
			  this.visible = true;
			  this.$nextTick(() => { //form 表单 数据回显
				  this.form.setFieldsValue(
					pick({}, 'brand','caseType', 'publishDate', 'caseName', 'pdfUrl')
				  )
			  })
			  console.log("执行了新增")
			 
		  },
		handleOk(record){//新增案例
				this.form.validateFields((err, values) => {
				    console.log('err123:',err)
					   if(err){
							this.disabled = false;
						}else{
							this.disabled = false;
						   let formData = Object.assign(this.model, values)//form 对象
						   let accsee = this.containSpecial(formData.caseName) //正则
						   let accseeV= this.isNull(formData.caseName)//正则
						   if(accseeV||accsee){
							this.$refs.tooltip.visible = true
							this.$refs.tooltip.alertVisible = true
							this.type='error'
							this.message = "请填写正确的案例名称"
							setTimeout(()=>{
							   this.$refs.tooltip.cancel()
							},3000)
						   }else{
							let params = {
								'departmentId' : this.dept,
								'brand' : formData.brand,
								'publishDate':this.publishDate,
								'caseType':formData.caseType,
								'caseName':formData.caseName,
								'pdfUrl':this.pdfUrl,
								}
						   console.log(params)
							addCenter(params).then(res=>{ //添加案例
								if(res.code === 200) {
									this.message='添加案例成功'
									this.type='info'
									this.$refs.tooltip.visible = true
									this.$refs.tooltip.alertVisible = true
									this.disabled = false;
									setTimeout(()=>{
									  this.$refs.tooltip.cancel() 
									},3000)
									this.visible = false;
									this.searchQuery();
								}else{
									this.message=res.message
									this.type='error'
									this.$refs.tooltip.visible = true
									this.$refs.tooltip.alertVisible = true
									setTimeout(()=>{
										this.$refs.tooltip.cancel() 
									},3000)
								}
							})
						  } 
						}
				    })
					
		},
		  handleCancel(){//关闭新增案例
			 this.visible = false;
		  },
		  onSearch(){// 搜索功能
			 this.queryParam.classicsCaseName = this.caseName; // 标题
			//  this.queryParam.departmentId = this.branch;//this.brand // 标题
			 this.queryParam.departmentId = this.dept;// 
			 this.queryParam.classicsCaseType = this.domeType; // 标题
			 this.queryParam.page= 1;//发布人部门
			 this.queryParam.size = 15;//渠道
			 this.searchQuery();
		  },
		  handleCreat(record){//编辑
				this.form.resetFields()
				console.log(record)
				this.model = Object.assign({}, record)
				record.publishDate=moment(record.publishDate);
				console.log(this.model,'this.model')
				this.visible = true;
				this.$nextTick(() => {
				this.form.setFieldsValue(
					pick(record, 'brand','caseType', 'publishDate', 'caseName', 'pdfUrl')
					
					// pick(this.model, 'departmentId', 'activeNode','materialType', 'materialName', 'materialDescription', 'downloadLink')
				)
				})
				this.addOrEdit=1;
				this.pdfUrl= record.pdfUrl;
				this.idS = record.id;

		  },
		  editOk(){//确定编辑
				this.form.validateFields((err, values) => {
				    console.log('err123:',err)
				       let formData = Object.assign(this.model, values)
					   console.log(formData,'formData')
					   let accsee = this.containSpecial(formData.caseName)
					   let accseeV= this.isNull(formData.caseName)
					   if(err){
							this.disabled = false;
						}else{
							this.disabled = false;
							 if(accseeV||accsee){
					   	this.$refs.tooltip.visible = true
					   	this.$refs.tooltip.alertVisible = true
					   	this.type='error'
					   	this.message = "请填写正确的案例名称"
					   	setTimeout(()=>{
					   	   this.$refs.tooltip.cancel()
					   	},3000)
					   }else{
						   this.disabled = true;
						   console.log('没有执行')
					   	let params = {
							'id':this.idS,
					   		'departmentId' : this.dept,
					   		'brand' : formData.brand,
					   		'publishDate':this.publishDate?this.publishDate:formData.publishDate,
					   		'caseType':formData.caseType,
					   		'caseName':formData.caseName,
					   		'pdfUrl':this.pdfUrl?this.pdfUrl:formData.pdfUrl,
					   		}
							console.log(params,'params')
					   	updateCent(params).then(res=>{
					   		if(res.code === 200) {
					   			this.message='案例修改成功'
					   			this.type='info'
					   			this.$refs.tooltip.visible = true
					   			this.$refs.tooltip.alertVisible = true
								this.disabled = false;
					   			setTimeout(()=>{
					   			  this.$refs.tooltip.cancel() 
					   			},3000)
					   			this.visible = false;
					   			this.searchQuery();
					   		}else{
					   			this.message=res.message
					   			this.type='error'
					   			this.$refs.tooltip.visible = true
					   			this.$refs.tooltip.alertVisible = true
					   			setTimeout(()=>{
					   				this.$refs.tooltip.cancel() 
					   			},3000)
					   		}
					   	})
					   }
						}
				    })
				
			
		  },
		  editCancel(){//关闭编辑
			  this.visible = false;
		  },
		  editChange(info){//编辑上传
			if(this.pdfUrl){
				this.pdfUrl=''
			}else{
				this.pdfUrl=''
			}
			if(this.addIM===false){
				this.uploddIng = true
				let pg=document.getElementById('pg');
				pg.value=0;
				var timer = setInterval(()=>{
					   pg.value+=2;
					   if(pg.value>=90){
						   clearTimeout(timer);
						   console.log("停止定时器")
						   pg.value=90;
					   }
				},50);
				if(pg.value<100){
					console.log(info)
					  const status = info.file.status;
					  if (status === 'done') {
						  pg.value=100;
						  this.message='上传成功'
						  this.type='info'
						  this.$refs.tooltip.visible = true
						  this.$refs.tooltip.alertVisible = true
						  setTimeout(()=>{
						    this.$refs.tooltip.cancel() 
						  },3000)
						  setTimeout(()=>{
						    this.$refs.tooltip.cancel() 
						  },3000)
						   if (info.file.response.code===200) {
							this.pdfUrl = info.file.response.data.imgUrl
							this.uploddIng = false
							pg.value=0;
						}
					  }else if (status === 'error') {
						this.videoLoad = false;
						this.uploddIng = false
						pg.value=0;
						this.message='上传失败'
						this.type='error'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel() 
						},3000)
					}
				}

			}
		  },
		  editbeforeUpload(info){//编辑上传的问题
			  console.log(info.type)
			  if(info.size>(1024*1024*1024*50)){
				this.message='pdf文件不能超过50MB'
				this.type='warning'
				this.$refs.tooltip.visible = true
				this.$refs.tooltip.alertVisible = true
				setTimeout(()=>{
				  this.$refs.tooltip.cancel() 
				},3000)
			  	return false
			  }
			  var vt = [
			    'application/pdf'
			  ]
			  var result = vt.find(element => element === info.type)
			  if (!result) {
			    this.message='请上传pdf格式的文件'
			    this.type='warning'
			    this.$refs.tooltip.visible = true
			    this.$refs.tooltip.alertVisible = true
			    setTimeout(()=>{
			      this.$refs.tooltip.cancel() 
			    },3000)
			    this.addIM = true;
			    return false
			  }else{
			  	this.addIM = false;
			  }
		  },
		  handleRemove(record){//删除
			  let params ={
				  id:record.id
			  }
			  DeleteCenter(params).then(res=>{
				  if(res.code===200){
					  this.message='案例删除成功'
					  this.type='info'
					  this.$refs.tooltip.visible = true
					  this.$refs.tooltip.alertVisible = true
					  setTimeout(()=>{
					    this.$refs.tooltip.cancel() 
					  },3000)
					 
					  this.searchQuery();
				  }else{
					this.message='案例删除失败'
					this.type='error'
					this.$refs.tooltip.visible = true
					this.$refs.tooltip.alertVisible = true
					setTimeout(()=>{
					  this.$refs.tooltip.cancel() 
					},3000)
				  }
			  })
		  },
		  // handleGit(record){//下载
				// let params = {
				// 	classicsCaseId:record.id/1
				// }
				// downLoad(params).then(res=>{
				// 	if(res.code ===200){

				// 	}
				// })
		  // },

	  }
	  }
</script>

<style lang="scss" scoped>
.navBox{

	.navSearch{
		height: 72px;
		background: white;
		width: 100%;
		color: red;
		.a-input-search{
			width: 552px;
			height: 36px;
		}
	} 
	

	.ant-btn-primary{
		background: #3264D5 !important;
	}
	
}
.ModelMan{
	height: 1000px !important;
	.ant-row{
		position:static !important;
	}
	
		.Pbox{
			position: relative;
			margin-left: 38px;
			margin-top: 16px;
			height: 32px;
			line-height: 32px;
			min-width: 304px !important;
			float: left;
			.spanTitle{
				font-size: 14px;
				margin-right: 16px;
				display: inline-block;
				min-width: 70px;
				text-align: right;
				color: #55565D;
			}

		}
	}
	
	.upLOadES{
		position: relative !important;
		left: 86px;
		top: -32px;

	}
	.searchBtn {
	  background: #3264d5;
	  color: #fff;
	  height: 32px;
	  border-radius: 0 4px 4px 0;
	  font-size: 20px;
	  line-height: 26px;
	  text-align: center;
	  cursor: pointer;
	  position: relative;
	  left: -4px;
}
.buttonGray{
		background: rgb(245,245,245);
		color: #55565D;;
	}
.buttonBlue{
		background: #3264D5;
		color: white;
	}
</style>
<style>
	
</style>