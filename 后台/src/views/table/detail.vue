<template>
  <div>
    <!-- 顶部查询条件模块 -->
    <a-card title="" :bordered="false" :hoverable="true" style="margin-bottom: 12px;">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="queryBtn">
          <a-row :gutter="24" style="display:flex;align-items:center;">
                  <a-col>报备日期</a-col>
                  <a-col :md="4" :sm="6">
                    <!-- 开始时间选择框 -->
                      <a-date-picker v-model="startValue" placeholder="请选择开始日期" :disabledDate="disabledStartDate" style="width: 100%;" @change="stime" @ok="ok1"/>
                  </a-col>
                  <a-col :md="4" :sm="6" style="padding-left: 2px;">
                    <!-- 结束时间选择框 -->
                      <a-date-picker v-model="endValue" placeholder="请选择结束日期" :disabledDate="disabledEndDate" style="width: 100%;" @change="etime" @ok="ok2"/>
                  </a-col>
                  <a-col>发布形式</a-col>
                <a-col :md="4" :sm="6">
                  <a-select style="width:100%!important;" placeholder="请选择发布形式" @change="selectPublishForm" allowClear>
                      <a-select-option value="">全部</a-select-option>
                      <a-select-option :value="value" v-for="(value,keys,index) in allPublicType" :key="index">{{value}}</a-select-option>
                  </a-select>
                </a-col>
                  <a-col>品牌</a-col>
                  <a-col :md="4" :sm="6">
                   <a-select placeholder="请选择品牌" style="width:100%!important;" @change="selectBrand" allowClear>
                     <a-select-option value="">全部</a-select-option>
                     <a-select-option :value="value" v-for="(value,keys,index) in allBrand" :key="index">{{value}}</a-select-option>
                  </a-select>
                  </a-col>
          </a-row>
          <a-row :gutter="24" style="margin-top:15px;display:flex;align-items:center;" >
                <a-col style="margin-right: 11px;width: 69px;text-align:right;">部门</a-col>
                <a-col :md="4" :sm="6">
                  <a-select style="width:100%!important;" placeholder="请选择部门" allowClear @change="changeDepartment">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="items.id" v-for="(items,indexs) in allDepartment" :key="indexs">{{items.dataName}}</a-select-option>
                  </a-select>
                </a-col>
                 <a-col :md="4" :sm="6" style="padding-left: 2px;">
                  <a-select style="width:100%!important;" placeholder="请选择子部门" v-model="levelTwoDept" allowClear @change="changeDepartment2">
                    <a-select-option :value="items.dataName" v-for="(items,indexs) in allDepartment2" :key="indexs">{{items.dataName}}</a-select-option>
                </a-select>
            </a-col>
            <a-col>媒体平台</a-col>
            <a-col :md="4" :sm="6">
              <a-select placeholder="请选择媒体平台"
                style="width: 100%;" allowClear
                @change="changeChannel"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  :value="value.mediaPlatformName"
                  v-for="(value, key, index) in mediaPlate"
                  :key="index"
                >{{value.mediaPlatformName}}</a-select-option>
              </a-select>
             </a-col>
            <a-col :style="{visibility:showInput?'visible':'hidden'}" :md="4" :sm="6">
              <a-input style="width: 100%;" v-model="queryParam.otherChannelPlatform" allowClear/>
            </a-col>
             <!-- <a-col style="position: absolute;right: 0;">
              <a-button type="primary" icon="search" @click="queryBtn">查询</a-button>
            </a-col> -->
            <a-col class="col" style="position:absolute;right:0;">
						   <a-button @click="queryBtn" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					  </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <!-- 报备列表 -->
    <a-card :bordered="false" :hoverable="true" title="报备列表" :bodyStyle="{'padding-top':'0'}" :headStyle="headStyle">
          <a-button
            slot="extra"
            v-if="authButton.hasOwnProperty('exportBtn')&&authButton.exportBtn"
            type="primary"
            icon="download"
            @click="handleExportXls('报备统计明细表')"
          >导出</a-button>
      <a-row>
        <a-col :md="24">
          <a-table
            style="height:500px;"
            ref="table"
            size="small"
            :bordered="false"
            rowKey="id"
            :scroll="{x:1300,y:500,scrollToFirstRowOnChange:true}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="completeTitle" slot-scope="text, record">
              <a-popover title trigger="hover">
                <template slot="content">
                  <p style="maxWidth:300px;word-break:break-all;">{{record.completeTitle?record.completeTitle:record.titles}}</p>
                </template>
                <a
                  class="mouseHover"
                  onmouseover="this.style.color='#3264D5';"
                  onmouseout="this.style.color='#595959';"
                >{{record.completeTitle?record.completeTitle:record.titles}}</a>
              </a-popover>
            </span>
            <span slot="action" slot-scope="text, record">
              <a v-if="authButton.hasOwnProperty('reviewBtn')&&authButton.reviewBtn" @click="review(record)" style="color:#3264D5;margin-right:14px;">详情</a>
              <!-- <a-divider v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" type="vertical" /> -->
              <a v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" @click="edit(record)" style="color:#3264D5">编辑</a>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
    <!-- 点击查看显示的弹窗 -->
    <a-modal title="详情" v-model="visible" :footer="null" width="800px" @cancel="closeEdit">
      <a-row style="margin-bottom:15px;">
        <a-col :span="24">
          <a-row class="row">
                <a-col :span="24" class="bb_title">基本信息</a-col>
          </a-row>
          <a-row class="row">
            <!-- 发布渠道： -->
            <a-col :span="4" class="col-3">媒体平台：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder
                v-model="reviewData.channelPlatform"
              ></a-input>
            </a-col>
            <!-- 发布账号： -->
            <a-col :span="4" class="col-3" v-if="showChannelName">账号名称：</a-col>
            <a-col :span="5" v-if="showChannelName">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder
                v-model="reviewData.channelName"
              ></a-input>
            </a-col>
          </a-row>
           <a-row class="row" v-if="hasOther">
              <!-- 其他平台 -->
              <a-col :span="4" class="col-3">平台名称：</a-col>
              <a-col :span="5">
                <a-input :disabled="true" style="width:100%!important;color:#55565D;" placeholder="" v-model="otherPlateformName"></a-input>
              </a-col>
              <!-- 其他渠道名称： -->
              <a-col :span="4" class="col-3">账号名称：</a-col>
              <a-col :span="5">
                <a-input :disabled="true" style="width:100%!important;color:#55565D;" placeholder="" v-model="otherChilnelName"></a-input>
              </a-col>
            </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-3">发布时间：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder="发布时间"
                v-model="reviewData.publishDate"
              ></a-input>
            </a-col>
            <a-col :span="4" class="col-3">品牌：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder="品牌"
                v-model="reviewData.brand"
              ></a-input>
            </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-3">发布形式：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder="发布形式"
                v-model="reviewData.publishForm"
              ></a-input>
            </a-col>
            <a-col :span="4" class="col-3">姓名：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder="姓名"
                v-model="reviewData.responsible"
              ></a-input>
            </a-col>
          </a-row>
          <a-row class="row">
              <!-- 一级部门 -->
              <a-col :span="4" class="col-3">部门：</a-col>
              <a-col :span="5">
                 <a-input :disabled="true" style="width:100%!important;color:#55565D;" placeholder="" v-model="selectDept"></a-input>
              </a-col>
              <!-- 二级部门 -->
              <a-col :span="5" style="margin-left:8px;">
                 <a-input :disabled="true" style="width:100%!important;color:#55565D;" placeholder="" v-model="selectDept2"></a-input>
              </a-col>
            </a-row>
          <!-- 其他 -->
          <a-row class="row">
            <a-col :span="4" class="col-3">是否涉及版权：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                v-model="lookBq"
              ></a-input>
            </a-col>
            <a-col :span="4" class="col-3">是否kol：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                v-model="lookQol"
              ></a-input>
            </a-col>
            </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-3">报备时间：</a-col>
            <a-col :span="5">
              <a-input
                :disabled="true"
                style="width:100%!important;color:#55565D;"
                placeholder="报备时间"
                v-model="reviewData.reportDate"
              ></a-input>
            </a-col>
          </a-row>
          <a-row class="row">
                <a-col :span="24" class="bb_title">内容信息</a-col>
          </a-row>
          <a-row class="row" v-if="titleShow">
            <!-- 视频标题： -->
            <a-col :span="4" class="col-3">标题：</a-col>
            <a-col :span="15">
              <a-input
                :disabled="true"
                style="width:97%!important;color:#55565D;"
                placeholder="内容标题"
                v-model="reviewData.titles"
              ></a-input>
              <!--<span class="red">*</span>-->
            </a-col>
          </a-row>
          <a-row style="position:relative;" class="row" v-if="contentShow">
            <!-- 视频描述： -->
            <a-col :span="4" class="col-3">文字内容：</a-col>
            <a-col :span="15">
              <a-input
                :disabled="true"
                style="width:97%!important;color:#55565D;"
                type="textarea"
                placeholder="文本内容"
                v-model="reviewData.contentProfile"
                :autosize="autoSize"
              />
            </a-col>
          </a-row>
          <a-row class="row" v-if="imageShow">
            <a-col :span="24">
              <a-row>
                <!-- 上传图片： -->
                <a-col :span="4" class="col-3">上传图片：</a-col>
                <a-col :span="16" style="display: flex;flex-wrap: wrap;">
                  <span
                    v-for="(item,index) in reviewData.imagePath"
                    :key="index"
                    class="img_vedio" @mouseover="mouseoverImg(index)" @mouseleave="showWhichImg=-99"
                  >
                    <img style="width: 88px;height: 88px;border-radius:4px;" :src="item" alt />
                    <div v-if="showWhichImg===index" style="width:88px;height:88px;background:rgba(0,0,0,0.6);border-radius:4px;position:absolute;display:flex;align-items:center;justify-content:center;">
                        <img style="width: 16px;height: 12px;cursor:pointer;" src="@/assets/lookDetails.png" @click="lookDetailImg(index)" alt="">
                      </div>
                    <a class="down" :href="item" download>
                      <a-icon
                        type="cloud-download"
                        style="position: absolute;right: -8px;top: -8px;cursor: pointer"
                        :style="{ fontSize: '18px'}"
                      />
                    </a>
                  </span>
                  <!--<img style="width: 100px;height: 100px;margin: 10px 10px 0 0" v-for="(item,index) in imageSrc" :key="index" :src="item"  alt="">-->
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row class="row" v-if="videoShow">
            <a-col :span="24">
              <a-row>
                <!-- 上传视频： -->
                <a-col :span="4" class="col-3">上传视频：</a-col>
                <a-col :span="16" style="display: flex;flex-wrap: wrap;">
                  <span
                    v-for="(item,index) in reviewData.mediaPath"
                    :key="index"
                    class="img_vedio"
                  >
                    <video style="width: 88px;height: 88px;border-radius:4px;" :src="item" controls="true"></video>
                    <!--<a class="down" :href="item" download="">-->
                    <!--<a-icon type="cloud-download" style="position: absolute;right: -8px;top: -8px;cursor: pointer" :style="{ fontSize: '18px'}"/>-->
                    <!--</a>-->
                    <a-icon
                      type="cloud-download"
                      @click="download(item)"
                      style="position: absolute;right: -8px;top: -8px;cursor: pointer"
                      :style="{ fontSize: '18px'}"
                    />
                  </span>
                  <!--<video style="width: 100px;height: 100px;margin: 10px 10px 0 0" v-for="(item,index) in videoSrc" :src="item" :key="index" controls = "true"></video>-->
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row class="row">
            <!-- 视频标题： -->
            <a-col :span="4" class="col-3">原文链接：</a-col>
            <a-col :span="15">
              <a-input
                :disabled="true"
                style="width:97%!important;color:#55565D;"
                placeholder="原文链接"
                v-model="reviewData.sourceUrl"
              ></a-input>
              <!--<span class="red">*</span>-->
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
    <report-edit-modal :allDepartment="allDepartment" :allBrand="allBrand" :allPublicType="allPublicType" ref="reportEditModal" @ok="modalFormOk"></report-edit-modal>
     <!-- 图片预览弹窗 -->
  <a-modal
      width="800px"
      title="图片预览"
      :keyboard="true"
      v-model="visibleImg"
      :footer="null"
      :zIndex="1200"
    >
       <img :src="preImgUrl" alt="" style="width:100%">
    </a-modal>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </div>
</template>
<script>
import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
import { USER_AUTH } from "@/store/mutation-types"
import ReportEditModal from './modules/ReportEdit'
import { baseUrl } from '@/api/manage'
import tooltip from "@/components/tooltip/tooltip.vue"
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {
  channelList,
  departmentAll,
  dataDictionary,
  departmentList, //部门列表
  reportList //条件查询
} from '@/api/api'
import moment from 'moment'
export default {
  name: 'Detail',
  mixins: [JeecgListMixin],
  components: { ReportEditModal,tooltip },
  data() {
    return {
      message:'操作成功',
      type:'info',
      headStyle:{
        "text-align":"center",
        "border-bottom":"none"
      },
      //按钮权限，默认拥有全部权限
      authButton:{
        editBtn: true,
        reviewBtn: true,
        exportBtn: true,
      },
      selectDept2:'',
      selectDept:'',
      showChannelName:true,
      showInput:false,
      mediaPlate:[],
      hasOther:false,//其他媒体平台，渠道名称是否显示的标志
      otherPlateformName:'',//其他媒体平台
      otherChilnelName:'', // 其他渠道名称
      lookBq:false,
      lookQol:false,
      st: '',
      et: '',
      dp:'',
      startValue: null,
      endValue: null,
      endOpen: false,
      allDepartment:[], // 所有部门
      allDepartment2:[], // 所有部门2
      allBrand:null, // 品牌
      allPublicType:null, // 发布形式
      departmentName:'',
      visible: false,
      autoSize: { minRows: 3 }, // 内容文本输入框的最小行数
      //查看的数据
      reviewData: {},
      //编辑的数据
      editData: {},
      //根据不同的媒体类型判断是否显示
      titleShow: false,
      contentShow: false,
      imageShow: false,
      videoShow: false,
      // 部门列表
      departList: [
        {
          departmentName: '全部',
          id: ''
        }
      ],
      levelOneDept:'',
      levelTwoDept:undefined,
      queryParam: {
        chanelId:'',
        beginDate: '', //报备开始时间
        endDate: '', //报备结束时间
        levelOneDept: '', // 一级部门
        levelTwoDept: '', // 二级部门
        channelPlatform: '', //   媒体平台
        otherChannelPlatform: '', //  其他媒体，微信朋友圈
        publishForm: '', //
        brand: '', //
      },
      channelPlatform:'',
      publishForm:'',
      brand:'',
      //表头
       columns: [
//          {
//           title: '序号', 
//           align:"center",
//           className:'table_title',
//           width:80,
//           customRender:(text,record,index)=> {
//           return(
//           `${(this.ipagination.current-1)*(this.ipagination.pageSize)+(index+1)}`//当前页数减1乘以每一页页数再加当前页序号+1
//           )
//           }
//         },
        {
          title: '发布日期',
          align: 'center',
          width:100,
          dataIndex: 'publishDate',
          className:'table_title'
        },
        {
          title: '部门',
          align: 'center',
          width:120,
          dataIndex: 'deptName',
          className:'table_title'
        },
        {
          title: '责任人',
          align: 'center',
          width:100,
          dataIndex: 'responsible',
          className:'table_title'
        },
        {
          title: '平台',
          align: 'center',
          width:120,
          dataIndex: 'channelPlatform',
          className:'table_title'
        },
        {
          title: '账号',
          align: 'center',
          width:140,
          dataIndex: 'channelName',
          className:'table_title'
        },
        {
          title: '品牌',
          align: 'center',
          width:100,
          dataIndex: 'brand',
          className:'table_title'
        },
        {
          title: '发布形式',
          align: 'center',
          width:100,
          dataIndex: 'publishForm',
          className:'table_title'
        },
        {
          title: '版权',
          dataIndex: 'hasCopyRight',
          align: 'center',
          width: 50,
          className:'table_title'
        },
        {
          title: 'kol',
          dataIndex: 'isQol',
          align: 'center',
          width: 50,
          className:'table_title'
        },
        {
          title: '标题',
          align: 'center',
          dataIndex: 'completeTitle',
          minWidth:100,
          scopedSlots: { customRender: 'completeTitle' },
          className:'table_title'
        },
        {
          title: '报备日期',
          align: 'center',
          width:100,
          dataIndex: 'reportDate',
          className:'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
          // fixed:'right',
          scopedSlots: { customRender: 'action' },
          className:'table_title'
        }
      ],
      dataSource: [],
      url: {
        list: '/cms/content/report/list', //查询列表接口
        exportXlsUrl: '/cms/content/report/exportExcel' //导出列表接口
      },
      downloadUrl: baseUrl + '/cms/content/report/exportExcel',
      visibleImg:false,
      preImgUrl:'',
      showWhichImg:-99
    }
  },
  created() {
    this.getDepartmentAll();
    this.getBrand();
    this.getReportType();
    this.getPublishChinnel();
  },
  mounted(){
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if(auth.hasOwnProperty(this.$route.name)){
      this.authButton = auth[this.$route.name]
    }
    setTimeout(()=>{
      var dom = document.getElementsByClassName("ant-table-small")[0]
      dom.style.border= "none"
    },200)
  },
  methods: {
        // 鼠标移入图片触发
    mouseoverImg(e){
      this.showWhichImg = e
    },
         // 点击图片查看触发
    lookDetailImg(e){
      this.preImgUrl = this.reviewData.imagePath[e]
      this.visibleImg = true;
    },
    selectBrand(e){
      this.queryParam.brand = e?e:''
    },
    selectPublishForm(e){
       this.queryParam.publishForm = e?e:''
    },
    // 点击重置按钮触发
    resetBtn(){
      this.queryParam.chanelId = ''
      this.queryParam.beginDate = ''
      this.queryParam.endDate = ''
      this.queryParam.levelOneDept = ''
      this.queryParam.levelTwoDept = ''
      this.queryParam.channelPlatform = ''
      this.queryParam.publishForm = ''
      this.queryParam.brand = ''

      this.startValue = null
      this.st = null
      this.endValue = null
      this.et = null
      this.publishForm = ''
      this.brand = ''
      this.levelOneDept = ''
      this.levelTwoDept = ''
      this.channelPlatform = ''
      this.queryParam.otherChannelPlatform = ''
      this.showInput = false
      this.allDepartment2 = []

      console.log( this.queryParam)
    },
      // 媒体平台改变的时候触发
    changeChannel(e){
       if(e==='微信朋友圈'){
         this.showInput = true
         this.queryParam.chanelId = '-2'
         this.queryParam.channelPlatform = ''
       }else if(e==='其它媒体平台'){
         this.showInput = true
         this.queryParam.chanelId = '-1'
         this.queryParam.channelPlatform = ''
       }else if(e===undefined){
         this.channelPlatform=''
         this.showInput = false
         this.queryParam.chanelId = ''
         this.queryParam.otherChannelPlatform = ''
       }else{
         this.showInput = false
         this.queryParam.chanelId = ''
         this.queryParam.channelPlatform = e
       }
       console.log(" this.queryParam", e)
    },
    // 获取媒体平台下拉选数据
    getPublishChinnel() {
      // type:1 编辑者；type:2 审核者
      channelList({userCode:Vue.ls.get(USER_INFO)['userAccount'],type:'1'}).then(res => {
        if (res.code === 200) {
          this.mediaPlate = res.data
          // 在本地向媒体平台数组中添加一条数据-->  '其它媒体平台'
          let obj2 = {mediaPlatformName: "微信朋友圈",mediaPlatformCode:'wxfriend'}
          let obj = {mediaPlatformName: "其它媒体平台",mediaPlatformCode:'other'}
          this.mediaPlate.push(obj2)
          this.mediaPlate.push(obj)
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    closeEdit(){
      this.hasOther =false
    },
    changeDepartment2(e){
      // 解决下拉选中的选项选中之后不显示的问题
      this.$forceUpdate();
    },
    changeDepartment(e){
      if(e===undefined){
         this.allDepartment2 = []
         this.levelTwoDept = ''
         this.levelOneDept=''
         this.queryParam.levelOneDept=''
      }else if(e===''){
        this.queryParam.levelOneDept=''
         this.allDepartment2 = []
        let allDep = this.allDepartment
        for(let i = 0,leng=allDep.length; i < leng; i++) {
          for(let j = 0,len=allDep[i]['sonListData'].length; j < len; j++) {
              this.allDepartment2.push(allDep[i]['sonListData'][j])
          }
        }
      }else{
        this.levelTwoDept = ''
        this.allDepartment.forEach(item=>{
          if(item.id===e){
            this.allDepartment2 = item.sonListData
            this.queryParam.levelOneDept = item.dataName
          }
        })
      }
    },
    // 点击 开始时间框 的确定按钮时触发
    ok1(e) {
      var time = new Date(new Date(e._d).getTime())
      var startTime =
        time.getFullYear() +
        '-' +
        Number(time.getMonth() + 1) +
        '-' +
        time.getDate() +
        ' ' +
        time.getHours() +
        ':' +
        time.getMinutes() +
        ':' +
        time.getSeconds()
      this.queryParam.beginDate = startTime
    },
    //  点击 结束时间框 的确定按钮时触发
    ok2(e) {
      var time = new Date(new Date(e._d).getTime())
      var endTime =
        time.getFullYear() +
        '-' +
        Number(time.getMonth() + 1) +
        '-' +
        time.getDate() +
        ' ' +
        time.getHours() +
        ':' +
        time.getMinutes() +
        ':' +
        time.getSeconds()
      this.queryParam.endDate = endTime
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    stime(e1, e2) {
      if (!e2) {
        this.queryParam.beginDate = ''
        this.st = ''
      } else {
        this.queryParam.beginDate = e2
        this.st = e2
      }
    },
    etime(e1, e2) {
      if (!e2) {
        this.queryParam.endDate = ''
        this.et = ''
      } else {
        this.queryParam.endDate = e2
        this.et = e2
      }
    },
        // 获取所有部门
    getDepartmentAll(){
      departmentAll({"dataType":"reportDepartment"}).then(res=>{
        if(res.code === 200){
          res.data.forEach(item=>{
            if(item.sonListData){
              this.allDepartment.push(item)
            }else{
               this.allDepartment2.push(item)
            }
          })
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
     // 获取品牌数据
    getBrand(){
      dataDictionary({"dataType": "brand"}).then(res=>{
        console.log('brand',res)
        if(res.code === 200){
          this.allBrand = res.data
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    // 获取发布形式数据
    getReportType(){
      dataDictionary({"dataType":'reportType'}).then(res=>{
         console.log('reportType',res)
         if(res.code === 200){
           this.allPublicType = res.data
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    // 选择开始时间
    selectStartTime(date, dateString) {
      this.queryParam.beginDate = dateString // 需要对字段
    },
    // 选择结束时间
    selectEndTime(date, dateString) {
      this.queryParam.endDate = dateString // 需要对字段
    },
    //选择查询部门
    departChange(val) {
      console.info(val)
      this.queryParam.deptId = val
      console.info(this.queryParam)
    },
    // 查询按钮
    queryBtn() {

      this.queryParam.levelTwoDept = this.levelTwoDept
      // this.queryParam.publishForm = this.publishForm  // 发布形式

      // this.queryParam.brand = this.brand ? this.brand : '' // 品牌
      this.queryParam.beginDate = this.queryParam.beginDate ? this.queryParam.beginDate : '' // 报备日期开始时间
      this.queryParam.endDate = this.queryParam.endDate ? this.queryParam.endDate : '' // 报备日期结束时间
      if(this.queryParam.channelPlatform === '微信朋友圈' || this.queryParam.channelPlatform ==='其他媒体平台'){
        this.queryParam.channelPlatform = ''
      }
      console.log('wwww',this.queryParam)
      // this.loadData();
      this.searchQuery();
      // return
      // reportList(this.queryParam).then(res => {
      //   if (res.code === 200) {
      //     this.dataSource = res.data.list
      //     this.ipagination.total = res.data.total
      //   }else{
      //     this.$message.error(res.message)
      //   }
      // })
    },
    //查看
    review(record) {
      console.log(record)
      // 判断其他平台名称是否有值
      if(record.channelId === '-1' || record.channelId === '-2'){
        this.hasOther = true
        this.otherPlateformName = record.channelPlatform
        this.otherChilnelName = record.channelName
      }
        if(record.deptName){
        var departArr = record.deptName.split('_')
        this.selectDept = departArr[0]
        this.selectDept2 = departArr[1]
      }

      this.lookBq = record.isQol==="是" ? '是' : record.isQol==="否" ? "否" : ''
      this.lookQol = record.hasCopyRight==="是" ? '是' : record.hasCopyRight==="否" ? "否" : ''

      this.visible = true
      this.reviewData = { ...record }
      this.reviewData['publishDate'] = moment(new Date(this.reviewData['publishDate'])).format('YYYY-MM-DD')
      this.reviewData['completeTitle'] = record.completeTitle?record.completeTitle:record.titles
      this.reviewData['sourceUrl'] = record.sourceUrl?record.sourceUrl:' '
      this.contentShow = false
      this.videoShow = false
      this.titleShow = false
      this.imageShow = false
      // if(!record.hasOwnProperty('channelPlatform')){
      //   record.channelPlatform='媒体平台-知乎'
      // }
      // if(!record.hasOwnProperty('imagePath')){
      //   record.imagePath='http//ci.xiaohongshu.com/797ee7d0-aaed-31da-bf53-5cec28ab35f0?imageView2/2/w/1080/format/jpg'
      // }
      // if(!record.hasOwnProperty('mediaPath')){
      //   record.mediaPath=''
      // }
        if(record.channelId === '-2'){
        this.reviewData.channelPlatform = '微信朋友圈'
        this.showChannelName = false
      }else if(record.channelId === '-1'){
        this.showChannelName = false
         this.reviewData.channelPlatform = '其它媒体平台'
      }else{
        this.showChannelName = true
      }

      if (record.channelPlatform.indexOf('抖音') !== -1 || record.channelPlatform.indexOf('快手') !== -1) {
        this.contentShow = true
        this.videoShow = true
        this.titleShow = false
        this.imageShow = false
      } else if (record.channelPlatform.indexOf('官网') !== -1) {
        this.contentShow = true
        this.imageShow = true
        this.titleShow = true
        this.videoShow = false
      } else if (
        record.channelPlatform.indexOf('头条') !== -1 ||
        record.channelPlatform.indexOf('垂直媒体') !== -1 ||
        record.channelPlatform.indexOf('新闻媒体') !== -1
      ) {
        this.contentShow = true
        this.titleShow = true
        this.imageShow = true
        this.videoShow = false
      } else {
        this.contentShow = true
        this.videoShow = true
        this.titleShow = true
        this.imageShow = true
      }
      if (this.reviewData['imagePath'] !== '' && this.reviewData['imagePath'] !== null) {
        this.reviewData['imagePath'] = this.reviewData['imagePath'].split(',')
      } else {
        this.reviewData['imagePath'] = []
      }
      if (this.reviewData['mediaPath'] !== '' && this.reviewData['mediaPath'] !== null) {
        this.reviewData['mediaPath'] = this.reviewData['mediaPath'].split(',')
      } else {
        this.reviewData['mediaPath'] = []
      }
    },
    //编辑
    edit(record) {
      console.log("item",record)
      this.$refs.reportEditModal.edit(record)
    },
    //下载视频图片
    download(item) {
      console.log(item)
      const a = document.createElement('a') // 创建a标签
      a.setAttribute('download', '') // download属性
      a.setAttribute('href', item) // href链接
      a.setAttribute('target', '_blank') //
      document.body.appendChild(a)
      a.click() // 自执行点击事件
      document.body.removeChild(a)
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.down {
  color: #333;
}
.ant-card-hoverable{
  cursor:default;
}
.title_tag{
  display:flex;align-items:center;height:32px;
}
.center{
  display:flex;
  align-items: center;
}
  .col-3{
    margin-right:16px;
    text-align:right;
  }
  .img_vedio{
  display:flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 104px;
  height: 104px;
  margin: 0 14px 16px 0px;
  border: 1px dashed #DFE0EB;
  position: relative;
}

</style>
