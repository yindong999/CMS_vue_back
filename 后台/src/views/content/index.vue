<template>
  <div>
    <!-- 顶部查询条件模块 -->
    <div style="background:#ECECEC; margin-bottom:12px">
      <!-- <a-card title="" :bordered="false" style="width: 100%;" :bodyStyle="{'display':'flex','justify-content':'space-between'}"> -->
      <a-card title="" :bordered="false" style="width: 100%;">
         <a-row class="formStyle">
		<a-row class="leftDiv">
            <!-- 媒体平台 -->
            <a-col style="display:flex;align-items:center;" :span="8">
			  <span class="textWidth4">媒体平台</span>
			    <a-select  style="width:calc(100% - 97px);margin-left:16px;" allowClear @change="mediaPlatformChange"
					placeholder="请选择媒体平台" :showSearch="true" :filter-option="filterOption">
              		<a-select-option value>全部</a-select-option>
             		<a-select-option :value="item.mediaPlatformCode" v-for="(item, index) in mediaPlate" :key="index">{{item.mediaPlatformName}}</a-select-option>
            	</a-select>
            </a-col>
            <!-- 账号 -->
             <a-col style="display:flex;align-items:center;" :span="8">
			  <span class="textWidth2">账号</span>
			  <!-- v-model="channelChangeC"  -->
              <a-select  style="width:calc(100% - 97px);margin-left:16px;" allowClear @change="channelChange"
			  	 v-model="channelChangeC" placeholder="请选择发布渠道" :showSearch="true" :filter-option="filterOption">
              		<a-select-option value>全部</a-select-option>
              		<a-select-option :value="item.id" v-for="(item,index) in channel" :key="index">{{item.channelName}}</a-select-option>
            </a-select>
            </a-col>
            <!-- 发布平台 -->
            <a-col style="display:flex;align-items:center;position:relative;left:-28px;" :span="8">
			  <span class="textWidth4">发布部门</span>
              <a-select  style="width:calc(100% - 97px);margin-left:16px;" @change="mediaChange" allowClear  placeholder="请选择发布人部门" :showSearch="true" :filter-option="filterOption">
              <a-select-option value>
               全部
              </a-select-option>
              <a-select-option  v-for="(item,index) in media" :key="index" :value="item.id">{{item.departmentName}}</a-select-option>
            </a-select>
            </a-col>
        </a-row>
			<div class="btnCol"  style="width:170px;">
				<a-button @click="search" type="primary" class="queryBtn">
					<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
					查询</a-button>
			</div>
			</a-row>
			<a-row class="leftDiv" style="display:flex;align-items:center;margin-top:16px;" v-if="isSpread">
              <a-col style="display:flex;align-items:center;padding-right:24px;" :span="8">
				  <span class="textWidth4">内容标题</span>
        	      <a-input defaultValue style="width:calc(100% - 73px);margin-left:16px;" allowClear  v-model="ContTile" placeholder="请输入内容标题"></a-input>
              </a-col>
			<a-col style="display:flex;align-items:center;" :span="8">
			  <span class="textWidth2">状态</span>
			    <a-select  style="width:calc(100% - 97px);margin-left:16px;"  defaultValue="4" @change="stateChange"
					placeholder="请选择状态" :showSearch="true" :filter-option="filterOption">
             		<a-select-option :value="item.value" v-for="(item,index) in ContentStatus" :key="index" v-show="item.value!='0'">{{item.label}}</a-select-option>
            	</a-select>
            </a-col>
            </a-row>
           <!-- 展开/收起按钮 -->
          <div class="outerText"  :style="{'display': 'flex','justify-content': 'center','margin': '0 auto','margin-top':'16px'}">
            <span @click="isSpread = !isSpread" style="cursor:pointer;">
              <span class="spreadText">{{isSpread?'收起':'展开'}}</span>
              <a-icon :type="!isSpread?'down':'up'" class="downUp" style="color:#3264D5;"/>
            </span>
          </div>
        <!-- <a-row style="position: absolute;bottom:16px;right: 23px;">
             <a-button
              type="primary"
              icon="search"
              @click="search"
			  style="background: #3264D5;"
            >查询</a-button>
        </a-row> -->
      </a-card>
    </div>
    <!-- 页面中的表格 -->
    <a-card title="内容列表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
		<a-button
		  slot="extra"
		  type="primary"
		  icon="download"
		  style="padding:0 16px;position:absolute;right:32px;"
		  @click="handleExportXls('内容统计明细表')"
		>导出</a-button>
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

          <!-- <span slot="publishTime" slot-scope="text, record">
            <a-popover title trigger="hover">
              <template slot="content">
                <p style="maxWidth:300px;word-break:break-all;">{{record.publishTime}}</p>
              </template>
              <a
                style="color:#595959;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all;width:150px;display:inline-block;"
                onmouseover="this.style.color='#3264D5';"
                onmouseout="this.style.color='#595959';"
              >{{record.publishTime}}</a>
            </a-popover>
          </span> -->
		  <span slot="title2" slot-scope="text, record">
		    <a-popover title trigger="hover">
		      <template slot="content">
		        <p style="maxWidth:300px;word-break:break-all;">{{record.title}}</p>
		      </template>
		      <a
		        style="color:#595959;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all;width:150px;display:inline-block;"
		        onmouseover="this.style.color='#3264D5';"
		        onmouseout="this.style.color='#595959';"
		      >{{record.title}}</a>
		    </a-popover>
		  </span>
		  <!-- 转发量 -->
          <span
            slot="wxIntPageReadCount"
            slot-scope="text, record"
          >{{record.publishStatus==='4'?record.wxIntPageReadCount:'/'}}</span>
          <span
            slot="shareCount"
            slot-scope="text, record"
          >{{record.publishStatus==='4'?record.shareCount:'/'}}</span>
		  <!-- 评论数 -->
          <span
            slot="commentCount"
            slot-scope="text, record"
          >{{record.publishStatus==='4'?record.commentCount:'/'}}</span>
		  <!-- 点赞数 -->
          <span slot="giveCount" slot-scope="text, record">{{record.publishStatus==='4'?record.giveCount:'/'}}</span>
          <span slot="action" slot-scope="text, record">
            <a
              v-if="authButton.hasOwnProperty('reviewBtn')&&authButton.reviewBtn" style="color:#3264D5;"
              @click="handleLook(record,record.newstemplateId,record.publishStatusStr,record.processId)"

            >详情</a>
          </span>
        </a-table>
      </div>
    </a-card>
    <!-- 点击查看或者标题时显示的弹窗 -->


    <a-modal  class="list-view"  :zIndex="1200"
      v-if="listViewVisible"
     :footer="null"
     :visible="listViewVisible"
     @ok="listViewOk"
     @cancel="listViewCancel"
     width="1200px">
    	<p class="contentBy" style="">内容详情</p>
    	<a-row :gutter="50" type="flex" style=" min-height:500px;margin-top:50px">
    		<!-- 内容预览模块 -->
    		<a-col  style="height:100%;">
    			<a-row style="margin-left:5px;font-size:14px;font-weight:500;color:#3C3D43;">内容预览</a-row>
    			<a-row class="box" style="margin-top: 24px;">
    				<a-col class="boxImg" @click="preview(contListI)" style="cursor:pointer;">
    					<div v-show="IMG" style="width: 100%;height: 100%;position: relative;" :style="{backgroundImage: 'url(' + (contListI.imagePath?contListI.imagePath:require('../../assets/placeholderB.png') )+ ')'}">
    						<div style="width: 100%;min-height:32px;line-height: 32px;padding-top:13px;padding-bottom: 14px; position:absolute;bottom:0px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.43) 100%);" >
    						<span v-show="IMG" style="display: inline-block;
    						font-size: 16px;color:white;margin-left:18px;width: 314px;">
    						{{templateName}}
    						</span>
    						</div>
    					</div>

    					<video v-show="VIDEO" v-if="contListI.mediaPath"  :src="contListI.mediaPath" style="position: absolute; cursor:pointer" controls width="360px" height="550px"></video>
    					<img   v-show="VIDEO" v-else :src="require('../../assets/videoMsg.png')" style="position: absolute; cursor:pointer" controls width="360px" height="550px" alt="">
    				</a-col>
    				<a-col class="contbox" style="cursor:pointer;"  v-for="(item,index) in contListSmall" :key="index" @click="preview(item)">
    					<span class="fontbox" :style="{border:index===contListSmall.length-1?'none':''}">{{item.title}}</span>
    					<span class="imgbox" >
    						<img :src="item.imagePath?item.imagePath:require('../../assets/placeholderS.png')" alt="" width="100%" height="100%">
    					</span>
    				</a-col>
    			</a-row>
    		</a-col>
    		<!-- 内容基本信息模块 -->
    		<a-col style="width:720px">
    			<a-row style="margin-bottom:20px;font-size:14px;font-weight:500;color:#3C3D43">基本信息</a-row>
    			<a-row class="basic">
    				<a-col class="textRight">
    					<span class="textSpan">媒体平台:</span>
    					<span class="textName">{{listViewDetails.channelPlatform|| "无"}}</span>
    				</a-col>
    				<a-col class="textRight">
    					<span class="textSpan">发布类型:</span>
    					<span class="textName">{{trueOfFalse==true?"单渠道发布":"多渠道发布"}}</span>
    				</a-col>
    			</a-row>
    			<a-row class="basic">
    				<a-col class="textRight">
    					<span class="textSpan">发布时间:</span>
    					<span class="textName">{{listViewDetails.publishTime|| "无"}}</span>
    				</a-col>
					<a-col class="textRight">
						<span class="textSpan">状态:</span>
						<span class="textName">{{listViewDetails.showStatus}}</span>
					</a-col>

    			</a-row>
    			<a-row class="basic">
    				<a-col class="textRight">
    					<span class="textSpan" style="margin-left: -2px">内容类型：</span>
    					<span class="textName" style="margin-left: 14px;">{{listViewDetails.templateType==='news'?"图文":"视频"|| "无"}}</span>
    				</a-col>
    				<a-col class="textRight">
						<span class="textSpan">账号:</span>
						<span class="textName">{{listViewDetails.channelName}}</span>
					</a-col>
    			</a-row>
				<a-row class="basic">
						<!-- 标签部分目前先隐藏 2020-07-28 备注 -->
					<!-- <a-col class="textRight" style="padding-righ:16px;width: 670px;margin-right: 24px;margin-bottom: 16px;min-height: 26px;">
						<span class="textSpan" style="display: block;float: left;">标签:</span>
						<p style="width: 605px;float: right;margin-left: 5px;">
						<span class="textName"
						style="margin-left: 14px;
						border-radius:3px;
						margin-bottom:8px;padding-left: 8px;width: auto;padding-right: 8px;background: #F4F6FA;"
						v-for="(item,index) in listViewDetails.newsitemList[0].tagMap" :key="index">{{item.tagName||"无"}}</span>
						</p>
					</a-col> -->
					<!-- 标签部分暂时隐藏，先用这个a-col,等标签设置显示后，注释该部分，打开上面部分 -->
					<a-col class="textRight" style="padding-righ:16px;width: 670px;margin-right: 24px;margin-bottom: 0px;min-height: 16px;">
					</a-col>
				</a-row>
    			<a-row class="bassc" style="min-height:58px" >
    			<a-timeline style="margin-top: 5px;">
    				<a-timeline-item v-for="(item,index) in processNodeList" :key="index" style="height: 44px;">
    					<a-icon v-if="item.nodeStatus==='3'" slot="dot" type="check-circle"  theme="filled" style="font-size: 16px;color: #3264D5;" />
    					<a-icon v-if="item.nodeStatus==='4'" slot="dot" type="close-circle" theme="filled" style="font-size: 16px;color:#FF6A6A;" />
    					<a-icon v-if="item.nodeStatus==='2'" slot="dot" type="clock-circle"  theme="filled" style="font-size: 16px;color: #3264D5;" />
    					<a-icon v-if="item.nodeStatus==='5'" slot="dot" type="info-circle"  theme="filled" style="font-size: 16px;color: #EEB63F;" />
    					<span style="display: inline-block;width: 135px;font-size: 14px;color: #55565D;">{{item.operatorName}}</span>
    					<span style="display: inline-block;width: 120px;font-size: 14px; margin-left: 24px;color: #767885;">{{item.nodeStatusStr || '无'}}</span>
    					<span style="display: inline-block;margin-left:17px; font-size: 12px;color: #A6A8B4;">{{item.updateTime}}</span>
    				</a-timeline-item>
    			</a-timeline>
    			</a-row>
				<div  v-show="Reject" style="width: 704px;margin-top: -18px;">
					<div style="width: 704px;height: 104px;background: #F7F7FB ; padding:0 28px 0 16px">
						<p style="font-size: 14px;font-weight: 500;color: #3C3D43;padding-top: 16px;clear: both;">{{curNodeStates?"驳回原因:":"发布失败原因:"}}</p>
						<p style="font-size: 12px;color: #767885;margin-top:-8px;">{{curNodeStates?reason:publishReason}}</p>
					</div>
				</div>
				<div  v-show="teamwork" style="margin-top: 16px;">
					<a-row style="margin-bottom:20px;min-height:54px;font-size:14px;font-weight:500;color:rgba(60,61,67,1);">协同发布情况
						<a-table
						v-show="tableA"
						ref="table"
						size="small"
						:bordered="false"
						rowKey="key"
						:pagination='false'
						:columns="columnsSmall"
						style="margin-top: 24px;width: 702px;color: #55565D;"
						:data-source="dataSourceSmall">
							 <span slot="processStatus" slot-scope="text, record" >
										<a-popover  title="审核结果"  trigger="click" v-if="record.processStatus=='拒绝发布'">
											<template slot="content">
												<p>{{rejectReason}}</p>
											</template>
										 <a
										 style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all;width:150px;display:inline-block;"
										 :style="{color:record.processStatus==='拒绝发布'?'#FF6A6A':'#55565D'}"
										>{{record.processStatus}}</a>
										</a-popover>

										<span v-else>
											{{record.processStatus}}
										</span>
							</span>

						</a-table>
						<a-row v-show="tableB" >
							<div style="margin:0 auto;margin-top: 50px;">
								<a-empty description="未发起协同发布"  style="font-size: 14px;color: #55565D" />
							</div>
						</a-row>
					</a-row>
				</div>
    		</a-col>
    	</a-row>
    </a-modal>
	<a-modal title="内容详情" v-model="modalVisible" :footer="null" :zIndex="1500" width="400px" height="640px">
		<div style="height:510px;overflow-y: auto;overflow-x: hidden;padding: 0;">
			<p style="margin-right: 14px;font-weight: 500;font-size: 20px;color: #323233;">{{ itemDetail.title }}</p>
			<p>
				<span style="color:rgb(87,107,149);margin-right:15px;">{{ itemDetail.channelName }}</span>
				<span>{{ itemDetail.createTime ? itemDetail.createTime.split(" ")[0] : "" }}</span>
				<span style="color: #7D7E80;font-size: 14px;">{{itemDetail.description}}</span>
			</p>
			<p style="" v-html="itemDetail.content">
				{{itemDetail.content}}
			</p>
		</div>
	</a-modal>
	<tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>
<script>
import Vue from 'vue'
import { USER_AUTH,USER_INFO } from '@/store/mutation-types'
import { filterMediaPlatform } from '@/utils/util.js';
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { dataDictionary, contentManage, auditDetail, postByAlist ,thirdPublishChannelList,departmentList,ContentStatusData,channelList,contentDepartment} from '@/api/api'
import tooltip from "@/components/tooltip/tooltip.vue"
export default {
  mixins: [JeecgListMixin],
   components:{ tooltip }  ,
  data() {
    return {
	  publishReason:'', // 发布失败原因
	  curNodeStates:false,
	  isSpread:false,
	  ContentStatus:[],
	  message:'',//提示信息
	  type:'',//提示类型
	  department:"",
	  channePres:'',//搜索用的渠道
      title: '',
      itemDetail: [], //详情列表
      modalVisible: false, //详情
      dataSourceSmall: [], //小边框
      ContTile: '', //内容标题
      //列表查看弹窗显示控制
      listViewVisible: false,
      //驳回
      Reject: false,
      //协同发布
      teamwork: false,
      tableA: false,
      tableB: false,
      //图片
      IMG: false,
      //视频
      VIDEO: false,
      headStyle: {
        'text-align': 'center',
        'border-bottom': 'none'
      },
      //按钮权限，默认拥有全部权限
      authButton: {
        reviewBtn: true
	  },
	  mediaPlatform:[],// 媒体平台数据
      channel: [], //渠道存储列表
    //   channel: null, //渠道存储列表
      media: [], //发布部门存储
      visible: false, // 弹窗显示与否的标志
      category: null, // 记录所有分类下的内容框的高度
      flag: true, //让所有分类是否收起的标志
      brand: null, // 品牌下拉选数据
      industry: null, // 企业下拉选数据
      oneData: {},
	  contListSmall:[],
	  reason:'',
      //查看页面表格
      columnsSmall: [
        // {
      	// 	title: '序号',
      	// 	align: 'center',
      	// 	className:'table_title',
      	// 	width:100,
      	// 	customRender:(text,record,index)=> {
      	// 		return(
      	// 		`${(this.ipagination.current-1)*(this.ipagination.pageSize)+(index+1)}`//当前页数减1乘以每一页页数再加当前页序号+1
      	// 		)
      	// 	}
      	// },
      	{
      		title: '部门',
      		align: 'center',
      		width:175,
			ellipsis:true,
      		dataIndex: 'channelLevel',
      		className:'table_title',
      	},
      	{
      		title: '媒体平台',
      		align: 'center',
      		width:175,
      		ellipsis:true,
      		dataIndex: 'channelPlatform',
      		className:'table_title',
      	},
      	{
      		title: '渠道名称',
      		className:'table_title',
      		align: 'center',
      		minWidth:175,
      		ellipsis:true,
      		dataIndex: 'channelName',
      	},
      	{
      		title: '状态',
      		align: 'center',
      		width:175,
      		ellipsis:true,
      		className:'table_title',
      		dataIndex: 'processStatus',
      		scopedSlots: {
      			customRender: 'processStatus'
      		},
      	}
      ],
      //流程状态
      processNodeList: [],
      //表格数据   模拟假数据
      dataSource: [],

      //列表查看详情
      listViewDetails: {},
      // 表头
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
          title: '媒体平台',
          align: 'center',
          dataIndex: 'channelPlatform',
		  width: 150,
		  ellipsis:true,
          className: 'table_title'
        },
        {
          title: '账号',
          align: 'center',
          dataIndex: 'channelName',
		  width: 150,
		  ellipsis:true,
          className: 'table_title'
        },
        {
          title: '发布部门',
          align: 'center',
          dataIndex: 'userDepartmentName',
          width: 150,
		  ellipsis:true,
          className: 'table_title'
        },
        {
          title: '内容标题',
          align: 'center',
          dataIndex: 'title',
		  scopedSlots: { customRender: 'title2' },
          width: 170,
          ellipsis:true,
          className: 'table_title'
        },
        {
          title: '发布时间',
          align: 'center',
		  ellipsis:true,
          dataIndex: 'publishTime',
		//   scopedSlots: { customRender: 'publishTime' },
          width: 150,
          className: 'table_title'
        },
        {
          title: '阅读量',
		  ellipsis:true,
          align: 'center',
          dataIndex: 'wxIntPageReadCount',
		  width: 60,
		  scopedSlots: { customRender: 'wxIntPageReadCount' },
          className: 'table_title'
        },
        {
          title: '转发量',
		  ellipsis:true,
          align: 'center',
          dataIndex: 'shareCount',
		  width: 60,
		  scopedSlots: { customRender: 'shareCount' },
          className: 'table_title'
        },
        {
          title: '评论数',
		  ellipsis:true,
          align: 'center',
          dataIndex: 'commentCount',
		  width: 60,
		  scopedSlots: { customRender: 'commentCount' },
          className: 'table_title'
        },
        {
          title: '点赞数',
		  ellipsis:true,
          align: 'center',
          dataIndex: 'giveCount',
		  width: 60,
		  scopedSlots: { customRender: 'giveCount' },
          className: 'table_title'
        },
    //     {
    //       title: '引用数',
		  // ellipsis:true,
    //       align: 'center',
    //       dataIndex: '',
    //       width: 100,
    //       className: 'table_title'
    //     },
        {
          title: '操作',
		  ellipsis:true,
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        //   fixed: 'right',
          width: 80,
          className: 'table_title'
        }
      ],
	  templateName:'',
      channelChangeC: '', //搜索中的渠道
      mediaChangeC: '', //搜索中的部门
      showIndustry: false, // 所有分类中的产业是否显示
      categoryHeight: null, //   分类分级右侧元素高度
      channelHeight: null, //   渠道品牌右侧元素高度
      brandHeight: null, //   品牌右侧元素高度
      industryHeight: null, //   产业右侧元素高度
      newsitemList: [], //newlist 存储
      lastList: [], //最后的渲染列表
      url: {
        list: '/cms/content/newsitem/queryListForAdmin',
		exportXlsUrl: '/cms/content/newsitem/exportExcel' //导出列表接口
      },
	  statusOfGit:'',
	  trueOfFalse:null,
	  mediaPlate: [], // 媒体平台下拉选数据
	  channelParams:{
		type:1,
		usercode:null,
		// channel_platform:'sinaBlog'  , wechat
		channel_platform:''
	}
    }
  },
  created() {
	  this.queryParam.publishStatus = "4"
	  console.log("queryParam",this.queryParam)
  },
  mounted() {
	  this.ContentStatus=ContentStatusData;
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if (auth.hasOwnProperty(this.$route.name)) {
      this.authButton = auth[this.$route.name]
    }
	let user = Vue.ls.get(USER_INFO)
	this.channelParams.usercode = user.userAccount
	// let params = {
	// 	type:1,
	// 	usercode:user.userAccount,
	// 	// channel_platform:'sinaBlog'
	// 	channel_platform:'wechat'
	// }
	this.getPublishChannel()
	this.getAll()
	document.onkeydown = this.keydown;
	   // 获取媒体平台下拉选数据
    // this.getMediaPlatform()
  },
  methods: {
	//  获取发布渠道
	getPublishChannel(){
		channelList(this.channelParams).then(res=>{
			// this.channel = []
		let p = []
		if(res.code ===200){
			//  res.data.forEach((item,index)=>{
			// 	 console.log(item)
			// 	 item.channelInfoList.forEach((itd)=>{
			// 		 this.channel.push(itd)
			// 	 })
			// })

			// filterMediaPlatform 筛选出微信，微博，抖音的数据
			var newObj = filterMediaPlatform(res.data)
			this.mediaPlate = newObj
			console.log('newObj',newObj)
			var allMedias = []
			this.mediaPlate.map(item=>{
				allMedias = allMedias.concat(item.channelInfoList)
			})
			this.channel = allMedias
		}else{
			this.message = res.message
			this.type = "error"
			this.warnMethod()
		}
	})
	},
	  stateChange(val){
		  this.queryParam.publishStatus = val
		  console.log("状态：",val,  this.queryParam)
	  },
	      // 获取媒体平台下拉选数据
    getMediaPlatform() {
      dataDictionary({ dataType: 'mediaPlatform' }).then(res => {
        if (res.code === 200) {
			// 目前媒体平台先显示，微博，微信，抖音
			var newObj = {}
			var obj = res.data
			 for(var i in obj){
				if(i=='wechat'||i=='sinaBlog'||i=='douyin'){
					newObj[i] = obj[i]
				}
			 }
          this.mediaPlate = newObj
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message =  res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
	  keydown(e){//全局搜索
	  	   var currKey=0,e=e||event;
	  	   currKey=e.keyCode||e.which||e.charCode;//支持IE、FF
	  	   if (currKey == 13){
	  		  this.search();
	  		  }
	  },
	  getAll(){
	  	let params = {
	  		// page:1,
			//   size:1000,
			departmentType:'2'
	  	}
	  	// thirdPublishChannelList(params).then(res=>{
	  	// 	if(res.code===200){
	  	// 		this.channel = res.data.list
	  	// 	}else{
				// this.message = res.message
				// this.type='error'
				// this.$refs.tooltip.visible = true
				// this.$refs.tooltip.alertVisible = true
				// setTimeout(()=>{
				//   this.$refs.tooltip.cancel()
				// },3000)
	  	// 	}
	  	// })
		contentDepartment(params).then(res=>{
			if(res.code ===200){
				this.media=res.data
			}else{
				this.message = res.message
				this.type='error'
				this.$refs.tooltip.visible = true
				this.$refs.tooltip.alertVisible = true
				setTimeout(()=>{
				  this.$refs.tooltip.cancel()
				},3000)
			}
		})
	  },
    search(e) {
      // 搜索
      //搜索
	  this.queryParam.title = this.ContTile; // 标题
	  this.queryParam.departmentId= this.mediaChangeC;//发布人部门
	  this.queryParam.channelId = this.channelChangeC;//渠道
	  // this.queryParam.
	  this.searchQuery();
	  // let params = {
		 //  channelId:this.channePres
	  // }
	  // contentManage(params).then(res=>{
		 //  console.log(res,"res")
	  // })
    },
    mediaChange(val) {
      // 选择 部门
      this.mediaChangeC = val ? val : ''
	},
	// 媒体平台下拉选改变后触发
	mediaPlatformChange(val){
		console.log('val:',val)
		if(val===''){
		var allMedia = []
		this.mediaPlate.map(item=>{
			allMedia = allMedia.concat(item.channelInfoList)
		})
		this.channel = allMedia
		this.queryParam.channelPlatformCode = ''
		}else if(val===undefined){
			this.queryParam.channelPlatformCode = ''
			this.channel = []
			var allMedia2 = []
			this.mediaPlate.map(item=>{
				allMedia2 = allMedia2.concat(item.channelInfoList)
			})
			this.channel = allMedia2
		}else{
			var newArr = this.mediaPlate.filter(item=>{
				return item.mediaPlatformCode === val
			})
			this.channel = newArr[0].channelInfoList
			this.queryParam.channelPlatformCode = val
		}
		this.channelChangeC = ''
	},
    channelChange(val) {
			console.log("发布渠道下拉:", val)
	  // 选择渠道
		this.channelChangeC = val ? val : ''
    },
    // 点击查看按钮触发
    handleLook(record,id, publishStatusStr,processId) {
		console.log(record,"record")
		if(record.reason){
			this.reason = record.reason
		}else{
			this.reason = ""
		}
		this.publishStatusStr = publishStatusStr;
		let params = {
			processid: processId,
			templateId: id
		}
		this.dataSourceSmall=[];
		auditDetail(params).then(res => {
			console.log("res:", res)
			if (res.code === 200) {
				this.trueOfFalse = res.data.isSingleChannelPublish;
				this.statusOfGit = res.data.auditStatus/1;
				console.log(this.statusOfGit,'this.statusOfGit')
				this.listViewDetails = res.data
        //详情发布状态
        this.ContentStatus.forEach(item=>{
          if(item['value'] == res.data.auditStatus){
            this.listViewDetails['showStatus'] = item['label']
          }
        })
				this.templateName = res.data.templateName
				let last = res.data.contentXTFBDTOList //协同发布
				let list = res.data.newsitemList;
				let lest = res.data.processNodeList; //审核流程
				if(res.data.reason){
					this.reason = res.data.reason
				}else{
					this.reason = ""
				}
				console.log('last------;',last)
				last.forEach((vat,index)=>{
					let data = {
					  key:index,
					  channelLevel:vat.channelLevel?vat.channelLevel:'',
					  channelPlatform:vat.channelPlatform?vat.channelPlatform:'',
					  channelName:vat.channelName?vat.channelName:'' ,
					  processStatus:vat.processStatus?vat.processStatus:'',
					}
					if(vat.reason){
						this.rejectReason = vat.reason
					}else{
						this.rejectReason=null
					}
					this.dataSourceSmall.push(data);
				})
				if(res.data.publishStatus==='5'&&res.data.publishReason){
					this.Reject=true
					this.curNodeStates=false
					this.publishReason = res.data.publishReason
				}else if(lest){
					this.publishReason = ''
					this.curNodeStates=true
					lest.forEach((val,index)=>{
						if(val.nodeStatus==4){
							this.Reject=true
						}else{
							this.Reject=false
						}
					})
				}
				this.processNodeList = res.data.processNodeList;
				if(last.length>0){
					this.teamwork = true
					this.tableA = true
					this.tableB = false
				}else{
					this.teamwork = true
					this.tableA = false
					this.tableB = true
				}

				this.listViewVisible = true
				this.contListI = list[0];
				for (let i = 1; i < list.length; i++) {
					this.contListSmall.push(list[i])
				}
				if (this.contListI.mediaPath===""||this.contListI.mediaPath) {
					this.VIDEO = true
				} else {
					this.VIDEO = false
				}
				if (this.contListI.imagePath===""||this.contListI.imagePath) {
					this.IMG = true
				} else {
					this.IMG = false
				}
			} else {
				// this.$message.error(res.message)
				this.listViewVisible = false
			}
		})
    },
    // 点击查询按钮的时候触发
    query() {
      // this.loadData()
      this.search()
    },
   listViewOk(e) {
   	this.listViewVisible = false
   },
   listViewCancel(e) {
   	this.listViewVisible = false
   	this.contListSmall = [];
   },
    preview(data) {
      if (this.listViewDetails.channelPlatformCode == 'douyin') {
        this.modalVisible = false
      } else {
        console.log(data, 'data')
        this.modalVisible = true
        let title = this.listViewDetails.title
        let list = this.listViewDetails.newsitemList
        //console.log(idd,this.listViewDetails.newsitemList)
        list.find(function(value, index) {
          return value.title == title
        })
      }

      this.itemDetail = data
    }
    // 获取媒体平台数据
  },
  beforeDestroy(){
	  document.onkeydown=null;
  }
}
</script>

<style lang="scss">
	th.table_title {
		background-color: #F7F7FB !important;
	}
	.ant-table-small {
		border: none;
	}
	.ant-table-body {
		margin: 0 !important;
	}
.list-view {
	// margin-top:15px;
	width: 1200px;
		.contentBy {
			width: 1200px;
			border-bottom: 1px solid #ccc;
			font-size: 16px;
			font-weight: 500;
			line-height: 48px;
			height: 48px;
			position: absolute;
			left: 0;
			top: 0;
			padding-left: 24px;
		}
		.basic{
			color: #767885;
			display: block;
			width: 700px;
			.textRight{
				width: 346px;
				margin-top: 16px;
				float: left;
				font-size: 14px;
				.textSpan{
					display: inline-block;
					text-align: right;
					width: 70px;
					margin-left: -12px;
				}
				.textName{
					display: inline-block;
					color: #55565D;
					margin-left: 24px;
				}
			}
		}
		.bassc{
			margin-left: 2px;
		}
		.box {
			overflow-y: auto;
			width: 400px;
			height: 590px;
			background: #F4F6FA;
			padding: 20px;
			margin-left:5px;
			.boxImg {
				width: 360px;
				height: 150px;
				}

			.contbox {
				width: 360px;
				height: 76px;
				background: #FFFFFF;
				padding: 10px;
				position: relative;

				.fontbox {
					height: 65px;
					width: 250px;
					padding: 5px;
					color: #3C3D43;
					font-size: 14px;
					border-bottom: 1px solid #ccc;
					display: inline-block;
					}

				.imgbox {
					top: 10px;
					left: 278px;
					height: 58px;
					width: 58px;
					position: absolute;
					display: inline-block;
				}
			}
		}

		.ant-modal-content {
		box-shadow: none;
		}

	}
	.ant-card-bordered{
		border:none;
	}

	.ant-popover{
		z-index: 1000000 !important;
	}
</style>


