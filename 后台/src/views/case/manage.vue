<template>
	<div class="navBox">
		<div class="navSearch">
			 <a-card title="" :bordered="false" style="width: 100%;"  :bodyStyle="{'display':'flex','justify-content':'space-between'}">
			   <a-row class="leftDiv">
			       <!-- 审核状态 -->
			       <a-col style="display:flex;align-items:center;" :span="8">
			       <span class="textWidth4">案例名称</span>
			         <a-input defaultValue style="width:calc(100% - 97px);margin-left:16px;" allowClear  v-model="domeName" placeholder="请输入案例名称"></a-input>
			       </a-col>
			       <!-- 账号 -->
			        <a-col style="display:flex;align-items:center;" :span="8">
			        <span class="textWidth4">案例类型</span>
			        <a-select  style="width:calc(100% - 97px);margin-left:16px;"  @change="changeOne"  allowClear  placeholder="请选择案例类型" :showSearch="true" :filter-option="filterOption">
			          <a-select-option value >
			          	全部
			           </a-select-option>
			          <a-select-option :value="item.id" v-for="(item,index) in domeTypeS" :key="index">{{item.dataName}}</a-select-option>
			        </a-select>
			       </a-col>
			       <!-- 发布平台 -->
			       <a-col style="display:flex;align-items:center;" :span="8">
			       <span class="textWidth4">下载部门</span>
			         <a-select style="width:calc(100% - 97px);margin-left:16px;"  @change="changeTwo"  allowClear  placeholder="请选择下载部门" :showSearch="true" :filter-option="filterOption">
			         <a-select-option value>
			           全部
			         </a-select-option>
			         <a-select-option :value="item.id" v-for="(item,index) in branchS" :key="index">{{item.departmentName}}</a-select-option>
			       </a-select>
			       </a-col>
			   </a-row>
				    <div class="btnCol" style="width:170px;">
						   <a-button @click="onSearch" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					</div>
			   <!-- <a-row style="position: absolute;bottom:16px;right: 23px;">
			        <a-button
			         type="primary"
			         icon="search"
			         @click="onSearch"
			 			  style="background: #3264D5;"
			       >查询</a-button>
			   </a-row> -->
			 </a-card>
		</div>
		<div class="contS" style="margin-top: 12px;">
			<a-card title="案例下载明细表"  :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
			  <div style="background:#fff;">
			    <a-table
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
			    </a-table>
			  </div>
			</a-card>
			
		</div>
		<tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
	</div>
</template>

<script>
	// import Vue from 'vue'
	import tooltip from "@/components/tooltip/tooltip.vue"
	import {
		baseUrl
	} from '@/api/manage'
	import { USER_AUTH } from '@/store/mutation-types'
	import { JeecgListMixin } from '@/mixins/JeecgListMixin'
	import {updateCent,DeleteCenter,addCenter,getdepartment,departmentAll,FindeBy} from '@/api/api'
	export default {
	  name: 'manage',
	  components:{ tooltip },  
	  mixins: [JeecgListMixin],
	  data(){
		  return{
			  message:'',//提示内容
			  type:'',// 提示格式
			  findBy:'',//搜索条件
			  domeType:'',//案例类型
			  domeTypeS:[],
			  domeName:'',//案例名称
			  branch:'',//部门
			  branchS:[],
			  trademark:'',//品牌
			  trademarkS:[],
			  publishTime:'',//时间
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
				  title: '案例类型',
				  align: 'center',
				  dataIndex: 'caseType',
				  width: 200,
				  ellipsis:true,
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
				  title: '下载部门',
				  align: 'center',
				  dataIndex: 'downloadDepartmentName',
				  width: 200,
				  ellipsis:true,
				  className: 'table_title'
				},
				{
				  title: '下载日期',
				  align: 'center',
				  dataIndex: 'downloadDate',
				  width: 200,
				  ellipsis:true,
				  className: 'table_title'
				},
				{
				  title: '下载用户',
				  align: 'center',
				  ellipsis:true,
				  dataIndex: 'downloadUserName',
				  width: 200,
				  className: 'table_title'
				},
			  ],
			  dataSource:[],
			  url: {
				 list: '/cms/classics/case/download/info/list'
			   },
			   imageUrl:'',
			  urlList: {
			  	fileUpload: baseUrl + "/cms/upload/uploadImage"
			  },
		   }
	  },
	  mounted(){
		  //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
		  // let auth = Vue.ls.get(USER_AUTH)
		  // //如果按钮权限数据里有当前页面的权限
		  // if (auth.hasOwnProperty(this.$route.name)) {
		  //   this.authButton = auth[this.$route.name]
		  // }
		  this.getAll()
		  console.log()
		  document.onkeydown = this.keydown;
	  },
	  methods:{
		 keydown(e){//全局搜索
		 	   var currKey=0,e=e||event; 
		 	   currKey=e.keyCode||e.which||e.charCode;//支持IE、FF 
		 	   if (currKey == 13){
		 		  this.onSearch();
		 		  }
		 },
		  changeTwo(val){
			  this.branch=val;
		  },
		  changeOne(val){
		  	console.log(val,'val')
		  	this.domeType = val
		  },
		  getAll(){
			  let params = {
			  	page:1,
			  	size:1000
			  }
			  console.log("getALL执行了")
			  getdepartment(params).then(res=>{//下载部门
			  	if(res.code===200){
			  		this.branchS = res.data.list

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
			  departmentAll({'dataType':"brand"}).then(res=>{//品牌
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
			  departmentAll({'dataType':"caseType"}).then(res=>{//案例类型
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
		  onSearch(){//搜索
			 this.queryParam.classicsCaseName = this.domeName; //
			 this.queryParam.departmentId = this.branch; //
			 this.queryParam.classicsCaseType = this.domeType; //
			 this.queryParam.page= 1;//发布人部门
			 this.queryParam.size = 15;//渠道
			 this.searchQuery();
		  },

	  },
	  beforeDestroy(){
	  	  document.onkeydown=null;
	  }
	  }
</script>

<style lang="scss" scoped>
.navBox{

	.navSearch{
		min-height: 72px;
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
</style>
