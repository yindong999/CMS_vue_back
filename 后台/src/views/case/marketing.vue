<template>
	<div class="navBox">
		<!-- <div class="navSearch"> -->
			<a-card>
			 <!-- <a-input-search
			 v-model="findBy"
			 placeholder="请输入关键字搜索"
			 :maxLength="50"
			 enter-button @search="onSearch" /> -->
			   <a-row :gutter="24" style="display:flex;align-items:center;">
				   <!-- 审核状态 -->
					   <a-col>部门</a-col>
					   <a-col :md="4" :sm="6">
						 <a-select  style="width:100%"  @change="changeBran" placeholder="请选择部门">
							 <a-select-option value>
								全部
							 </a-select-option>
							 <a-select-option :value="item.id" v-for="(item,index) in branchS" :key="index">{{item.dataName}}</a-select-option>
						 </a-select>
					   </a-col>
				   <!-- 发布渠道 -->
				   <a-col>案例类型</a-col>
					<a-col :md="4" :sm="6">
				   <a-select  style="width:100%"  @change="changeOne"  allowClear  placeholder="请选择案例类型" >
				     <a-select-option value >
				     	全部
				      </a-select-option>
				     <a-select-option :value="item.id" v-for="(item,index) in domeTypeS" :key="index">{{item.dataName}}</a-select-option>
				   </a-select>
				   </a-col>
				   <!-- 发布平台 -->
				 <a-col>案例名称</a-col>
				 <a-col :md="4" :sm="6">
				   <a-input  style="width:100%" @keydown="enter" v-model="domeName" placeholder="请输入案例名称"></a-input>
				 </a-col>
					 <a-col class="col" style="position:absolute;right:13px;padding: 0;">
						<a-button @click="onSearch" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					  </a-col>
			   </a-row>
			 </a-card>
		<!-- </div> -->
		<div class="contS" style="margin-top: 12px;">
			<a-card title="案例明细表"  :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
				 <a-button type="primary"
				 @click="openModel"
				 style="font-size: 14px;background:#3264D5 ;
						position: absolute;
						width: 82px;
						height: 34px;
						top: 15px;
						right: 23px;

				 "
				 >
				 <a-icon type="plus" />
				      新增
				    </a-button>
			  <div style="background:#fff;">
			    <a-table
				 style="margin-top: 8px;"
			      ref="table"
			      size="small"
			      :bordered="false"
			      rowKey="tabIndexByTable"
			      :columns="columns"
			      :dataSource="dataSource"
			      :pagination="ipagination"
			      :loading="loading"
			      @change="handleTableChange"
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

					<a-popconfirm v-if="authButton.hasOwnProperty('Delete')&&authButton.Delete"
					 title="确定删除吗?" @confirm="() => handleRemove(record)">
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

		<a-modal
			  class="ModelMan"
		      title="新增案例"
		      :visible="visible"
		      @ok="handleOk"
		      @cancel="handleCancel"
			  :footer="null"
			  width="800px"
			 :bodyStyle="{'height':'430px'}"
		    >
			<p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
		      <span class="spanTitle"> 部门: </span>
				  <a-select  style="width: 200px;" v-model="branch" :style="{'border-radius':'5px', border:branchAr?'1px solid red':''} " allowClear>
						 <a-select-option value>
						   <span style="color:#A6A8B4">请选择部门</span>
						 </a-select-option>
						<a-select-option :value="item.id" v-for="(item,index) in branchS" :key="index">{{item.dataName}}</a-select-option>

				  </a-select>
				  <span v-show="branchAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择部门</span>
			</p>
			<p class="Pbox" style="margin-top: 7px;">
			  <span class="spanTitle">品牌:</span>
			  	 <a-select  style="width: 200px;" v-model="trademark"  allowClear :style="{'border-radius':'5px', border:trademarkAr?'1px solid red':''} ">
			  	 	<a-select-option value >
			  	 	 <span style="color:#A6A8B4">请选择品牌</span>
			  	 	 </a-select-option>
			  	 	<a-select-option v-for="(item,index) in trademarkS" :key="index" :value="item.id">{{ item.dataName }}</a-select-option>
			  	 </a-select>
				  <span v-show="trademarkAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择品牌</span>
			 </p>
			 <p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
			   <span class="spanTitle">发布日期:</span>
			   	<a-date-picker v-model="edMytime" placeholder="请选择日期" @change="onChangeA" style="margin-right: 15px;width: 200px;"
				:style="{'border-radius':'5px', border:publishTimeAr?'1px solid red':''} "
				>
			   	</a-date-picker>
				 <span v-show="publishTimeAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择发布日期</span>
			  </p>
			  <p class="Pbox" style="margin-top: 7px;">
			  <span class="spanTitle">  <span style="color: #FF6A6A;">*</span>案例类型:</span>
			    	 <a-select  style="width: 200px;" v-model="domeType"  allowClear
					 :style="{'border-radius':'5px', border:domeTypeAr?'1px solid red':''} "
					 >
			    	 	<a-select-option value >
			    	 	 <span style="color:#A6A8B4">请选择案例类型</span>
			    	 	 </a-select-option>
			    	 	<a-select-option v-for="(item,index) in domeTypeS" :key="index" :value="item.id">{{ item.dataName }}</a-select-option>
			    	 </a-select>
					  <span v-show="domeTypeAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择案例类型</span>
			   </p>
			   <p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
				   <span class="spanTitle"><span style="color: #FF6A6A;">*</span>案例名称</span>
				   	<a-input :maxLength="50" style="width: 544px;" v-model="domeName" @keydown="enter" placeholder="案例名称"
					  :style="{'border-radius':'5px', border:domeNameAr?'1px solid red':''} "
					 />
					<span v-show="domeNameAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请填写案例名称</span>
			   </p>

			   <p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
				   <span v-show="pdfUrlAr" style="position: absolute;left: 85px;top: 100px;font-size: 14px;color: #FF6A6A;">请上传PDF文件</span>
				    <span class="spanTitle" style="float: left;" >上传PDF</span>
					<span style="display: block;float: left;position: relative;">
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
						 >
												<div v-if="pdfUrl" style="position: absolute;left: 0;top:0;width:106px;height:106px;background: white;border:1px dotted #DFE0EB;" >
													<span style="display: inline-block;position: absolute;right: 4px;top: 2px;" @click="confirmC" >
														<a-popconfirm title="确定删除吗?" @confirm="confirmS" >
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
			   </p>
			   <p style="position: absolute; bottom: 32px;width: 100%;text-align: center;">
				  <button
				  @click="handleOk"
				   style="cursor:pointer;border: none;width: 108px;height: 36px;color: white;background: #3264D5;font-size: 14px;">
					保存
				  </button>
				  <button
				   @click="handleCancel"
				   style="cursor:pointer;border: 1px solid #DFE0EB;margin-left: 16px;width: 108px;height: 36px;color: #767885;font-size: 14px;background: white;">
				  	取消
				  </button>
			   </p>
		</a-modal>
		<a-modal
			  class="ModelMan"
		      title="编辑案例"
		      :visible="Avisible"
		      @ok="editOk"
		      @cancel="editCancel"
			  :footer="null"
			  width="800px"
			 :bodyStyle="{'height':'430px'}"
		    >
			<p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
		      <span class="spanTitle"> 部门: </span>
				  <a-select  style="width: 200px;" v-model="branch"  allowClear>
					 <a-select-option value>
						<span style="color:#A6A8B4">请选择部门</span>
					</a-select-option>
					<a-select-option :value="item.id" v-for="(item,index) in branchS" :key="index">{{item.dataName}}</a-select-option>
				   </a-select>
				   <span v-show="branchAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择部门</span>
			</p>
			<p class="Pbox" style="margin-top: 7px;">
			  <span class="spanTitle">品牌:</span>
			  	 <a-select  style="width: 200px;" v-model="trademark"  allowClear>
			  	 	<a-select-option value >
			  	 	 <span style="color:#A6A8B4">请选择品牌</span>
			  	 	 </a-select-option>
			  	 	<a-select-option v-for="(item,index) in trademarkS" :key="index" :value="item.id">{{ item.dataName }}</a-select-option>
			  	 </a-select>
				 <span v-show="trademarkAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择品牌</span>
			 </p>
			 <p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
			   <span class="spanTitle">发布日期:</span>
			   	<a-date-picker v-model="myTime" placeholder="请选择日期" @change="onChangeA" style="margin-right: 15px;width: 200px;">
			   	</a-date-picker>
			  </p>
			  <p class="Pbox" style="margin-top: 7px;">
			  <span class="spanTitle">  <span style="color: #FF6A6A;">*</span>案例类型:</span>
			    	 <a-select  style="width: 200px;" v-model="domeType"  allowClear>
			    	 	<a-select-option value >
			    	 	 <span style="color:#A6A8B4">请选择案例类型</span>
			    	 	 </a-select-option>
			    	 	<a-select-option v-for="(item,index) in domeTypeS" :key="index" :value="item.id">{{ item.dataName }}</a-select-option>
			    	 </a-select>
					 <span v-show="domeTypeAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请选择案例类型</span>
			   </p>
			   <p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
				   <span class="spanTitle"><span style="color: #FF6A6A;">*</span>案例名称</span>
				   	<a-input :maxLength="30" style="width: 544px;" v-model="domeName" @keydown="enter" placeholder="请填写案例名称" />
					<span v-show="domeNameAr" style="position: absolute;left: 85px;top: 28px;font-size: 14px;color: #FF6A6A;">请填写案例名称</span>
			   </p>
			   <p class="Pbox" style="margin-top: 7px;margin-left: 55px;">
				   <span v-show="pdfUrlAr" style="position: absolute;left: 85px;top: 100px;font-size: 14px;color: #FF6A6A;">请上传PDF文件</span>
				    <span class="spanTitle"style="float: left;" >上传PDF</span>
					<span style="display: block;float: left;position: relative;">
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
						 >
												<div v-if="pdfUrl" style="position: absolute;left: 0;top:0;width:106px;height:106px;background: white;border:1px dotted #DFE0EB;" >
													<span style="display: inline-block;position: absolute;right: 4px;top: 2px;" @click="confirmC" >
														<a-popconfirm title="确定删除吗?" @confirm="confirmS" >
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
					 
			   </p>
			   <p style="position: absolute; bottom: 32px;width: 100%;text-align: center;left: 0;">
				  <button
				  @click="editOk"
				   style="cursor:pointer;border: none;width: 108px;height: 36px;color: white;background: #3264D5;font-size: 14px;">
					保存
				  </button>
				  <button
				   @click="editCancel"
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
			  message:'',//提示文本
			  type:'',//提示格式
			  idS:'',
			  edMytime:null,
			  uploddIng:false,
			  pdfUrlAr:false,
			  cost:{},
			  myTime:null,//编辑时间
			  Avisible:false,
			  findBy:'',//搜索条件
			  domeType:'',//案例类型
			  domeTypeAr:false,
			  domeTypeS:[],
			  domeName:'',//案例名称
			  domeNameAr:false,
			  branch:'',//部门
			  branchAr:false,
			  branchS:[],
			  trademark:'',//品牌
			  trademarkAr:false,
			  trademarkS:[],
			  publishTime:'',//时间
			  publishTimeAr:false,
			  visible:false,
			  authButton: {
				reviewBtn: true
			  },
			  headStyle: {

			    'text-align': 'center',
			    'border-bottom': 'none'
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
		   }
	  },
	  watch:{
		  domeType(newType,oldType){
			 this.domeTypeAr = false
		  },
		  domeName(newName,oldName){
			  this.domeNameAr=false
		  },
		  branch(newbranch,oldbranch){
			  this.branchAr=false
		  },
		  publishTime(newpublishTime,oldpublishTime){
			  this.publishTimeAr = false
		  },
		  trademark(newtrademark,oldtrademark){
			  this.trademarkAr = false
		  },
		  pdfUrl(newpdfUrl,oldpdfUrl){
			  this.pdfUrlAr=false
		  }
	  },
	  mounted(){
		  const token = Vue.ls.get(ACCESS_TOKEN);

		  const id = Vue.ls.get(USER_INFO).id;

		  this.headers = {
		  	"authorization": token,
		  	"uuss": id
		  }
		  console.log(this.headers,"this.headers")
		  console.log(this.headers)
		  //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
		  let auth = Vue.ls.get(USER_AUTH)
		  //如果按钮权限数据里有当前页面的权限
		  if (auth.hasOwnProperty(this.$route.name)) {
		    this.authButton = auth[this.$route.name]
			console.log(this.authButton,"配置权限")
		  }
		  this.getAll()
		  console.log()
	  },
	  methods:{
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
		  },
		  changeOne(val){
		  	console.log(val,'val')
		  	this.domeType = val
		  },
		  deletePic(){//删除图片链接
			this.pdfUrl = '';
		  },
		  getAll(){
			  departmentAll({'dataType':"materialDepartment"}).then(res=>{
				  if(res.code===200){
					this.branchS = res.data
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

			  departmentAll({'dataType':"brand"}).then(res=>{
				  if(res.code===200){
					  this.trademarkS = res.data
					  console.log(this.trademarkS)
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
			  departmentAll({'dataType':"caseType"}).then(res=>{
				  if(res.code===200){
					  this.domeTypeS = res.data
					  console.log(this.domeTypeS)
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
		  enter(e){//回车
			  if(e.keyCode == 13){
				this.onSearch();
			  }
		  },
		 //限制上传类型
		  beforeUpload(info){
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
		  changeBran(val){
			  this.branch = val?val:''

		  },
		  handleChange(info){//上传

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

					  const status = info.file.status;
					  if (status === 'done') {
						  pg.value=100;
						  this.message='上传成功'
						  this.type='success'
						  this.$refs.tooltip.visible = true
						  this.$refs.tooltip.alertVisible = true
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

		  handleTableChange(){//上传图片

		  },
		  onChangeA(date, dateString){//选择时间
				
				if (dateString != null) {
					//选中的时间不能小于当前时间
					let now = new Date().getTime()
					let select = new Date(dateString).getTime()
					if ((now - select) > 0) {
						this.publishTime=null
						this.myTime = null
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						this.type='error'
						this.edMytime=null
						this.message = "选择时间应大于当前时间!"
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
					}else{
						this.publishTime = dateString ? dateString : null;
					}
				}
		  },
		  openModel(){//打开对话框
			  this.visible = true;
			  this.branch='';
			  this.trademark='';
			  this.publishTime="";
			  this.domeType="";
			  this.domeName="";
			  this.pdfUrl="";
		  },
		handleOk(record){//新增案例
			if(this.domeType){
				this.domeTypeAr=false
			}else{
				this.domeTypeAr = true
			}
			if(this.domeName){
				this.domeNameAr = false
			}else{
				this.domeNameAr = true
			}
			if(this.branch){
				this.branchAr=false
			}else{
				this.branchAr=true
			}
			if(this.publishTime){
				this.publishTimeAr=false
			}else{
				this.publishTimeAr=true
			}
			if(this.trademark){
				this.trademarkAr=false
			}else{
				this.trademarkAr=true
			}
			if(this.pdfUrl){
				this.pdfUrlAr =false
			}else{
				this.pdfUrlAr =true
			}
			if(this.pdfUrlAr===false&&this.domeTypeAr===false&&this.trademarkAr===false&&this.publishTimeAr===false&&this.branchAr===false&&this.domeNameAr === false){
				let accsee = this.containSpecial(this.domeName)
				let accseeV= this.isNull(this.domeName)
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
						'departmentId' : this.branch,
						'brand' : this.trademark,
						'publishDate':this.publishTime,
						'caseType':this.domeType,
						'caseName':this.domeName,
						'pdfUrl':this.pdfUrl
						}

					addCenter(params).then(res=>{
						if(res.code === 200) {
							this.message='添加案例成功'
							this.type='success'
							this.$refs.tooltip.visible = true
							this.$refs.tooltip.alertVisible = true
							setTimeout(()=>{
							  this.$refs.tooltip.cancel() 
							},3000)
							this.visible = false;
							this.branch='';
							this.trademark='';
							this.publishTime="";
							this.domeType="";
							this.domeName="";
							this.pdfUrl="";
							this.searchQuery();
						}else{
							this.message='添加案例失败'
							this.type='error'
							this.$refs.tooltip.visible = true
							this.$refs.tooltip.alertVisible = true
							setTimeout(()=>{
								this.$refs.tooltip.cancel() 
							},3000)
						}
					})
					console.log(this.branch,this.trademark)
				}
			}
		},
		  handleCancel(){//关闭新增案例
			 this.visible = false;
			 this.branch='';
			 this.trademark='';
			 this.publishTime="";
			 this.domeType="";
			 this.domeName="";
			 this.pdfUrl="";
			 this.branchAr=false;
			 this.trademarkAr=false;
			 this.pdfUrlAr=false;
			 this.domeNameAr=false;
			 this.publishTimeAr = false;
			 this.domeType=false;
			 this.edMytime= null;
		  },
		  onSearch(){
			 this.queryParam.classicsCaseName = this.domeName; // 标题
			 this.queryParam.departmentId = this.branch; // 标题
			 this.queryParam.classicsCaseType = this.domeType; // 标题
			 this.queryParam.page= 1;//发布人部门
			 this.queryParam.size = 15;//渠道
			 this.searchQuery();
		  },
		  handleCreat(record){//编辑
				this.Avisible = true;
				console.log(record);
				this.branch= record.departmentName;
				this.trademark= record.brandName;
				this.myTime= record.publishDate?moment(record.publishDate):null;
				this.domeType= record.caseTypeName;
				this.domeName= record.caseName;
				this.pdfUrl= record.pdfUrl;
				this.cost = record;
				this.idS = record.id;

		  },
		  editOk(){//编辑
			   if(this.domeType){
			   	this.domeTypeAr=false
			   }else{
			   	this.domeTypeAr = true
			   }
			   if(this.domeName){
			   	this.domeNameAr = false
			   }else{
			   	this.domeNameAr = true
			   }
			   if(this.branch){
			   	this.branchAr=false
			   }else{
			   	this.branchAr=true
			   }
			   if(this.trademark){
			   	this.trademarkAr=false
			   }else{
			   	this.trademarkAr=true
			   }
			   if(this.pdfUrl){
			   	this.pdfUrlAr =false
			   }else{
			   	this.pdfUrlAr =true
			   }
			   if(this.pdfUrlAr===false&&this.domeTypeAr===false&&this.trademarkAr===false&&this.publishTimeAr===false&&this.branchAr===false&&this.domeNameAr === false){
					let accsee = this.containSpecial(this.domeName)
					let accseeV= this.isNull(this.domeName)
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
								 'departmentId' : this.branch===this.cost.departmentName?this.cost.departmentId:this.branch,
								  'brand' : this.trademark===this.cost.brandName?this.cost.brand:this.trademark,
								  'caseType':this.domeType===this.cost.caseTypeName?this.cost.caseType:this.domeType,
								  'id':this.idS,
								  'publishDate':this.publishTime?this.publishTime:this.myTime,
								  'caseName':this.domeName,
								  'pdfUrl':this.pdfUrl
							 }
							 console.log(params)
							 updateCent(params).then(res=>{
								 if(res.code === 200) {
									 this.message='案例修改成功'
									 this.type='success'
									 this.$refs.tooltip.visible = true
									 this.$refs.tooltip.alertVisible = true
									 setTimeout(()=>{
									   this.$refs.tooltip.cancel() 
									 },3000)
									 this.Avisible = false;
									 this.visible = false;
									 this.branch='';
									 this.trademark='';
									 this.publishTime="";
									 this.domeType="";
									 this.domeName="";
									 this.pdfUrl="";
									  this.searchQuery();
								 }else{
									 this.message='案例修改失败'
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
		  },
		  editCancel(){//编辑删除
			  this.Avisible = false;
			  this.branchAr=false;
			  this.trademarkAr=false;
			  this.pdfUrlAr=false;
			  this.domeNameAr=false;
			  this.publishTimeAr = false;
			  this.domeType=false;
			  this.branch='';
			  this.trademark='';
			  this.publishTime="";
			  this.domeType="";
			  this.domeName="";
			  this.pdfUrl="";
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
						  this.type='success'
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
					  this.type='success'
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
	.contS{

	}


	.ant-btn-primary{
		background: #3264D5 !important;
	}
}
.ModelMan{
	height: 1000px !important;
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
</style>
