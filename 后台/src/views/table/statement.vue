<template>
  <div>
    <a-card :bordered="false" :hoverable="true" title="" style="margin-bottom: 12px;" class="statementQuery">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <!--第一行筛选-->
          <a-row class="formStyle" type="flex" justify="space-between">
            <a-row class="leftDiv" style="width: calc(100% - 150px);">
              <!-- 媒体平台 -->
              <a-col style="display:flex;align-items:center;" :span="8">
                <span class="textWidth4">媒体平台</span>
                <a-select v-model="queryParam.channelPlatform" @change="mediaPlatformChange" style="width:calc(100% - 97px);margin-left:16px;" allowClear placeholder="请选择媒体平台" :showSearch="true" :filter-option="filterOption">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option
                    :value="value.mediaPlatformName"
                    v-for="(value, index) in mediaPlate"
                    :key="index"
                  >{{value.mediaPlatformName}}</a-select-option>
                </a-select>
              </a-col>
              <!-- 账号 -->
              <a-col style="display:flex;align-items:center;" :span="8">
                <span class="textWidth4">账号</span>
                <a-select style="width:calc(100% - 97px);margin-left:16px;" v-model="queryParam.channelId" allowClear placeholder="请选择账号" :showSearch="true" :filter-option="filterOption">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option :value="item.id" v-for="(item,index) in channelData" :key="index">{{item.channelName}}</a-select-option>
                </a-select>
              </a-col>
              <!--是否报备-->
              <a-col style="display:flex;align-items:center;" :span="8">
                <span class="textWidth4">类型</span>
                <a-select v-model="queryParam.reportFlag" style="width:calc(100% - 97px);margin-left:16px;" allowClear placeholder="请选择类型" :showSearch="true" :filter-option="filterOption" @change="onChange">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="item.value" v-for="(item,index) in isReportData" :key="index">{{item.label}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <div class="btnCol" style="width:85px;">
              <a-button @click="searchQuery" type="primary" class="queryBtn">
                <img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
                <span>查询</span>
              </a-button>
            </div>
          </a-row>
          <!--第二行筛选-->
          <a-row v-if="isSpread" class="leftDiv"  type="flex" justify="space-between" style="margin-top:16px;width: calc(100% - 150px);">
            <!-- 编辑部门 -->
            <!-- <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">编辑部门</span>
              <a-select v-model="queryParam.editDepId" :disabled="queryParam.reportFlag === 1" @change="mediaPlatformChange" style="width:calc(100% - 97px);margin-left:16px;" allowClear placeholder="请选择编辑部门" :showSearch="true" :filter-option="filterOption">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  :value="value.id"
                  v-for="(value, index) in editDepartmentList"
                  :key="index"
                >{{value.departmentName}}</a-select-option>
              </a-select>
            </a-col> -->
            <!-- 审核部门 -->
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">审核部门</span>
              <a-select v-model="queryParam.reviewDepId" :disabled="queryParam.reportFlag === 1" @change="mediaPlatformChange" style="width:calc(100% - 97px);margin-left:16px;" allowClear placeholder="请选择审核部门" :showSearch="true" :filter-option="filterOption">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  :value="value.id"
                  v-for="(value, index) in editDepartmentList"
                  :key="index"
                >{{value.departmentName}}</a-select-option>
              </a-select>
            </a-col>
            <!--报备部门-->
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4" style="width:62px!important;">报备部门</span>
              <a-row style="width:calc(100% - 97px);margin-left:16px;">
                <a-col style="display:flex;justify-content:flex-start;" :span="12">
                  <a-select v-model="queryParam.levelOneDept" :disabled="queryParam.reportFlag === 0" style="width:calc(100% - 4px);min-width:calc(100% - 4px)!important;" placeholder="请选择部门" :showSearch="true" :filter-option="filterOption" allowClear @change="changeDepartment">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="items.id" v-for="(items,indexs) in allDepartment" :key="indexs">{{items.dataName}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col style="display:flex;justify-content:flex-end;" :span="12">
                  <a-select style="width:calc(100% - 4px);min-width:calc(100% - 4px)!important;" :disabled="queryParam.reportFlag === 0" placeholder="请选择子部门" v-model="queryParam.levelTwoDept" :showSearch="true" :filter-option="filterOption" allowClear>
                    <a-select-option :value="items.dataName" v-for="(items,indexs) in allDepartment2" :key="indexs">{{items.dataName}}</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-col>
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">发布日期</span>
              <a-row style="width:calc(100% - 97px);margin-left:16px;">
                <a-col style="display:flex;justify-content:flex-start;" :span="12">
                  <a-date-picker v-model="publishStartValue" placeholder="开始日期" :disabledDate="disabledPublishStartDate"
                                 style="width:calc(100% - 4px);min-width:calc(100% - 4px)!important;"
                                 @change="PublishStartDateChange"/>
                </a-col>
                <a-col style="display:flex;justify-content:flex-end;" :span="12">
                  <a-date-picker v-model="publishEndValue" placeholder="结束日期" :disabledDate="disabledPublishEndDate"
                                 style="width:calc(100% - 4px);min-width:calc(100% - 4px)!important;"
                                 @change="PublishEndDateChange"/>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <!--第三行筛选-->
          <!-- <a-row v-if="isSpread" class="leftDiv" style="margin-top:16px;display:flex;align-items:center;width: calc(100% - 150px);"> -->
            <!--发布日期-->
          <!-- </a-row> -->
          <!-- 展开/收起按钮 -->
          <div class="outerText" :style="{'display': 'flex','justify-content': 'center','margin': '0 auto','margin-top':'16px'}">
            <span @click="toggle" style="cursor: pointer;">
              <span class="spreadText">{{isSpread?'收起':'展开'}}</span>
              <a-icon :type="!isSpread?'down':'up'" class="downUp" style="color:#3264D5;"/>
            </span>
          </div>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" :hoverable="true" title="统计报表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
      <!-- 操作按钮区域 -->
      <a-button
        slot="extra"
        v-if="authButton.hasOwnProperty('exportBtn')&&authButton.exportBtn"
        type="primary"
        icon="download"
        style="padding:0 16px;position:absolute;right:0;"
        @click="handleExportXls('统计报表明细表')"
        :disabled="ExportXls"
      >导出</a-button>
      <!--表格区域-->
      <a-row>
        <a-col :md="24">
          <a-table
            style="margin:0;"
            ref="table"
            size="small"
            :bordered="bordered"
            rowKey="id"
            :scroll="{scrollToFirstRowOnChange:true,x:2300,y:tabHeight}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="titles" slot-scope="text, record">
              <a-popover title trigger="hover">
                <template slot="content">
                  <p style="maxWidth:300px;word-break:break-all;">{{record.titles?record.titles:record.title}}</p>
                </template>
                <a
                  class="mouseHover"
                  onmouseover="this.style.color='#3264D5';"
                  onmouseout="this.style.color='#595959';"
                >{{record.titles?record.titles:record.title}}</a>
              </a-popover>
            </span>
            <!--<span slot="reportFlag" slot-scope="text, record" >-->
									<!--<span>-->
										<!--{{record.reportFlag==='1'?'报备':'原创'}}-->
									<!--</span>-->
						<!--</span>-->
            <!--<span slot="publishStatus" slot-scope="text, record" >-->
									<!--<span :style="{color:(record.publishStatus==='0'||record.publishStatus==='9')?'#55565D':(record.publishStatus==='3' || record.publishStatus==='5'||record.publishStatus==='6')?'#F6C238':(record.publishStatus==='1')?'#52B4B2':(record.publishStatus==='4')?'#6A9EE7':(record.publishStatus==='2')?'#FF8461':'#55565D' }">-->
										<!--{{contentStatus[record.publishStatus]}}-->
									<!--</span>-->
						<!--</span>-->
            <!--<span slot="contentType" slot-scope="text, record" >-->
									<!--<span>-->
										<!--{{contentType[record.contentType]}}-->
									<!--</span>-->
						<!--</span>-->
            <span slot="action" slot-scope="text, record">
              <a @click="review(record)" style="color:#3264D5;margin-right:12px;">详情</a>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
    <!-- 报备详情的弹窗 -->
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
                :readOnly="true"
                class="inputBg"
                placeholder
                v-model="reviewData.channelPlatform"
              ></a-input>
            </a-col>
            <!-- 发布账号： -->
            <a-col :span="4" class="col-3" v-if="showChannelName">账号名称：</a-col>
            <a-col :span="5" v-if="showChannelName">
              <a-input
                :readOnly="true"
                class="inputBg"
                placeholder
                v-model="reviewData.channelName"
              ></a-input>
            </a-col>
          </a-row>
           <a-row class="row" v-if="hasOther">
              <!-- 其他平台 -->
              <a-col :span="4" class="col-3">平台名称：</a-col>
              <a-col :span="5">
                <a-input :readOnly="true" class="inputBg" placeholder="" v-model="otherPlateformName"></a-input>
              </a-col>
              <!-- 其他渠道名称： -->
              <a-col :span="4" class="col-3">账号名称：</a-col>
              <a-col :span="5">
                <a-input :readOnly="true" class="inputBg" placeholder="" v-model="otherChilnelName"></a-input>
              </a-col>
            </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-3">发布时间：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
                placeholder="发布时间"
                v-model="reviewData.publishTimeStr"
              ></a-input>
            </a-col>
            <a-col :span="4" class="col-3">品牌：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
                placeholder="品牌"
                v-model="reviewData.brand"
              ></a-input>
            </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-3">发布形式：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
                placeholder="发布形式"
                v-model="reviewData.publishForm"
              ></a-input>
            </a-col>
            <a-col :span="4" class="col-3">姓名：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
                placeholder="姓名"
                v-model="reviewData.responsible"
              ></a-input>
            </a-col>
          </a-row>
          <a-row class="row">
              <!-- 一级部门 -->
              <a-col :span="4" class="col-3">部门：</a-col>
              <a-col :span="5">
                 <a-input :readOnly="true" class="inputBg" placeholder="" v-model="selectDept"></a-input>
              </a-col>
              <!-- 二级部门 -->
              <a-col :span="5" style="margin-left:8px;">
                 <a-input :readOnly="true" class="inputBg" placeholder="" v-model="selectDept2"></a-input>
              </a-col>
            </a-row>
          <!-- 其他 -->
          <a-row class="row">
            <a-col :span="4" class="col-3">是否涉及版权：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
                v-model="lookBq"
              ></a-input>
            </a-col>
            <a-col :span="4" class="col-3">是否kol：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
                v-model="lookQol"
              ></a-input>
            </a-col>
            </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-3">报备时间：</a-col>
            <a-col :span="5">
              <a-input
                :readOnly="true"
                class="inputBg"
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
                :readOnly="true"
                type="textarea"
                style="width:97%!important;color:#55565D;background:#F5F5F5;border: 1px solid #d9d9d9;box-shadow: none;"
                placeholder="内容标题"
                v-model="reviewData.title"
                :autoSize="autoSize2"
              ></a-input>
              <!--<span class="red">*</span>-->
            </a-col>
          </a-row>
          <a-row style="position:relative;" class="row" v-if="contentShow">
            <!-- 视频描述： -->
            <a-col :span="4" class="col-3">文字内容：</a-col>
            <a-col :span="15">
              <a-input
                :readOnly="true"
                style="text-align: justify;width:97%!important;color:#55565D;background:#F5F5F5;border: 1px solid #d9d9d9;box-shadow: none;"
                type="textarea"
                placeholder="文本内容"
                v-model="reviewData.content"
                :autosize="autoSize"
              />
            </a-col>
          </a-row>
          <a-row class="row" v-if="imageShow">
            <a-col :span="24">
              <a-row>
                <!-- 上传图片： -->
                <a-col :span="4" class="col-3">上传图片：</a-col>
                <a-col :span="16">
                  <div v-if="reviewData.imagePath.length>0" style="display: flex;flex-wrap: wrap;">
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
                  </div>
                  <span v-else style="color:#55565D;font-size:14px;">无</span>
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
                <a-col :span="16">
                  <div v-if="reviewData.mediaPath.length>0" style="display: flex;flex-wrap: wrap;">
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
                  </div>
                  <span v-else style="color:#55565D;font-size:14px;">无</span>
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
                :readOnly="true"
                style="width:97%!important;color:#55565D;background:#F5F5F5;border: 1px solid #d9d9d9;box-shadow: none;"
                placeholder="原文链接"
                v-model="reviewData.sourceUrl"
              ></a-input>
              <!--<span class="red">*</span>-->
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
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
    <!-- 报备详情的弹窗结束 -->
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
    <exportTip ref="exportTip"></exportTip>
    <!-- 原创的详情弹窗 -->
    <OriginalDetail ref="OriginalDetail"></OriginalDetail>
  </div>
</template>
<script>
import Vue from "vue"
import { USER_AUTH,USER_INFO } from "@/store/mutation-types"
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import tooltip from "@/components/tooltip/tooltip.vue"
import exportTip from "@/components/tooltip/exportTip.vue"
import { ContentStatusData,ContentTypeData,channelList,contentDepartment,departmentAll } from "@/api/api"
import moment from 'moment'
import OriginalDetail from "./modules/OriginalDetail"
export default {
  name: 'User',
  mixins: [JeecgListMixin],
  components: { tooltip,OriginalDetail,exportTip },
  data() {
    return {
      contentStatus:{},
      contentType:{},
      isSpread:false,
      bordered:false,
      message:'操作成功',
      type:'info',
      headStyle:{
        "text-align":"center",
        "border-bottom":"none"
      },
      //按钮权限
      authButton:{
        exportBtn: true,
      },
      description: '统计报表',
      //是否报备数据
      isReportData:[
        {'label':'报备','value':1},
        {'label':'内容','value':0},
      ],
      // 表头
      columns: [
        {
          title: '发布日期',
          align: 'center',
          width:200,
          dataIndex: 'publishTimeStr',
          className:'table_title',
          fixed: 'left'
        },
        // {
        //   title: '编辑部门',
        //   align: 'center',
        //   width:120,
        //   dataIndex: 'editDep',
        //   className:'table_title',
        //   fixed: 'left'
        // },
        {
          title: '审核部门',
          align: 'center',
          width:120,
          dataIndex: 'reviewDep',
          className:'table_title',
          fixed: 'left'
        },
        {
          title: '报备部门',
          align: 'center',
          width:120,
          dataIndex: 'reprotDep',
          className:'table_title',
          fixed: 'left'
        },
        {
          title: '媒体平台',
          align: 'center',
          width:100,
          dataIndex: 'channelPlatform',
          className:'table_title',
          fixed: 'left'
        },
        {
          title: '账号',
          align: 'center',
          width:150,
          dataIndex: 'channelName',
          className:'table_title',
          fixed: 'left'
        },
        {
          title: '标题',
          align: 'center',
          dataIndex: 'titles',
          width:150,
          scopedSlots: { customRender: 'titles' },
          className:'table_title',
          // fixed: 'left'
        },


        {
          title: '类型',
          align: 'center',
          width:100,
          dataIndex: 'reportFlag',
          className:'table_title',
          // scopedSlots: {
          //   customRender: 'reportFlag'
          // },
        },
        {
          title: '阅读量',
          align: 'center',
          width:80,
          dataIndex: 'readCount',
          className:'table_title'
        },
        {
          title: '转发量',
          align: 'center',
          width:80,
          dataIndex: 'shareCount',
          className:'table_title'
        },
        {
          title: '评论数',
          align: 'center',
          width:80,
          dataIndex: 'commentCount',
          className:'table_title'
        },
        {
          title: '点赞数',
          align: 'center',
          width:80,
          dataIndex: 'giveCount',
          className:'table_title'
        },
        // {
        //   title: '状态',
        //   align: 'center',
        //   width:100,
        //   dataIndex: 'publishStatus',
        //   className:'table_title',
        //   scopedSlots: {
        //     customRender: 'publishStatus'
        //   },
        // },
        {
          title: '内容类型',
          align: 'center',
          width:100,
          dataIndex: 'contentType',
          className:'table_title',
          // scopedSlots: {
          //   customRender: 'contentType'
          // },
        },

        {
          title: '报备日期',
          align: 'center',
          width:90,
          dataIndex: 'reportDate',
          className:'table_title'
        },
        {
          title: '责任人',
          align: 'center',
          width:70,
          dataIndex: 'responsible',
          className:'table_title'
        },
        {
          title: '品牌',
          align: 'center',
          width:80,
          dataIndex: 'brand',
          className:'table_title'
        },
        {
          title: '发布形式',
          align: 'center',
          width:90,
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
          width: 40,
          className:'table_title'
        },
        {
          title: '编辑人员',
          align: 'center',
          width:120,
          dataIndex: 'createBy',
          className:'table_title'
        },
        {
          title: '提审时间',
          align: 'center',
          width:200,
          dataIndex: 'commitTime',
          className:'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
          fixed:'right',
          scopedSlots: { customRender: 'action' },
          className:'table_title'
        }
      ],
      dataSource: [],
      //媒体平台数据
      mediaPlate:[],
      //所有渠道数据
      channelAllData:[],
      //编辑部门
      editDepartmentList:[],
      //审核部门
      auditDepartmentList:[],
      //报备部门主部门
      allDepartment:[],
      //报备部门子部门
      allDepartment2:[],
      //下拉框展示的渠道数据
      //发布开始时间，发布结束时间
      publishStartValue:null,
      publishEndValue:null,
      channelData:[],
      url: {
        list: '/cms/content/report/listReportAndContent', //查询列表接口
        exportXlsUrl: '/cms/content/report/exportReportAndContentExcel' //导出列表接口
      },
      visible:false,//是否显示报备详情的弹窗
      //报备查看的数据
      reviewData: {},
      //报备根据不同的媒体类型判断是否显示
      titleShow: false,
      contentShow: false,
      imageShow: false,
      videoShow: false,
      hasOther:false,//其他媒体平台，渠道名称是否显示的标志
      otherPlateformName:'',//其他媒体平台
      otherChilnelName:'', // 其他渠道名称
      selectDept2:'',
      selectDept:'',
      lookBq:false,
      lookQol:false,
      showChannelName:true,
      autoSize: { minRows: 3 }, // 内容文本输入框的最小行数
      autoSize2: { minRows: 1 }, // 标题框的最小行数
      showWhichImg:-99,
      preImgUrl:'',
      visibleImg:false,
      ExportXls:false,//是否禁用导出按钮
    }
  },
  computed: {},
  mounted() {
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if(auth.hasOwnProperty(this.$route.name)){
      this.authButton = auth[this.$route.name]
    }
    //处理内容状态
    ContentStatusData.forEach(item=>{
      this.contentStatus[item.value] = item.label
    })
    //处理内容类型
    ContentTypeData.forEach(item=>{
      this.contentType[item.value] = item.label
    })
    console.log(this.contentStatus)
    console.log(this.contentType)

    //初始化时先加载数据用于下拉筛选
    this.getPublishChinnel()
    this.getEditList()
    this.getAuditList()
    this.getReportDepartment()
  },
  methods: {
    // 更改报备/原创
    onChange(e){
      if(e === 0){
        delete this.queryParam.levelTwoDept
        delete this.queryParam.levelOneDept
      }
      if(e === 1){
        delete this.queryParam.editDepId
        delete this.queryParam.reviewDepId
      }
    },
    //查看详情
    review(record){
      if(record.reportFlag == "报备"){
        this.baobeiReview(record);
      }else{
        console.log(record)
        this.$refs.OriginalDetail.listViewVisible = true;
        this.$refs.OriginalDetail.handleLook(record);
        this.$refs.OriginalDetail.getcommentList();
      }
    },
    // 报备详情
    baobeiReview(record) {
      console.log(record)
      // 判断其他平台名称是否有值
      if(record.channelId === '-1' || record.channelId === '-2'){
        this.hasOther = true
        this.otherPlateformName = record.channelPlatform
        this.otherChilnelName = record.channelName
      }
        if(record.reprotDep){
        var departArr = record.reprotDep.split('_')
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
    closeEdit(){
      this.hasOther =false
    },
    mouseoverImg(e){
      this.showWhichImg = e
    },
    lookDetailImg(e){
      this.preImgUrl = this.reviewData.imagePath[e]
      this.visibleImg = true;
    },
    // 获取媒体平台下拉选数据
    getPublishChinnel() {
      // type:1 编辑者；type:2 审核者
      channelList({userCode:Vue.ls.get(USER_INFO)['userAccount'],type:'2'}).then(res => {
        if (res.code === 200) {
          this.mediaPlate = res.data
          // 在本地向媒体平台数组中添加一条数据-->  '其它媒体平台'
          let obj2 = {mediaPlatformName: "微信朋友圈",mediaPlatformCode:'wxfriend'}
          let obj = {mediaPlatformName: "其它媒体平台",mediaPlatformCode:'other'}
          this.mediaPlate.push(obj2)
          this.mediaPlate.push(obj)
          console.log(this.mediaPlate)
          //全部渠道数据
          this.channelAllData = []
          this.mediaPlate.forEach(item=>{
            console.log(item)
            if(item.channelInfoList){
              this.channelAllData=[...this.channelAllData.concat(item.channelInfoList)]
            }
          })
          //列表展示的渠道数据
          console.log(this.channelAllData)
          this.channelData = [...this.channelAllData]
          console.log(this.channelData)
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //媒体平台数据变化
    mediaPlatformChange(val){
      delete this.queryParam.channelId
      if(!val){
        console.log('fei')
        this.channelData = [...this.channelAllData]
      }
      this.mediaPlate.forEach(item=>{
        console.log(val)
        if(item.mediaPlatformName === val){
          this.channelData = [...item.channelInfoList]
        }
      })
    },
    //获取编辑部门数据
    getEditList(){
      contentDepartment({departmentType:'1'}).then(res=>{
        if(res.code ===200){
          this.editDepartmentList=res.data
          console.log(this.editDepartmentList)
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
    //获取审核部门数据
    getAuditList(){
      contentDepartment({departmentType:'2'}).then(res=>{
        if(res.code ===200){
          this.auditDepartmentList=res.data
          console.log(this.auditDepartmentList)
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
    // 报备部门主部门change事件
    changeDepartment(e){
      console.log(e)
      if(!e){
        this.allDepartment2 = []
        delete this.queryParam.levelOneDept
        delete this.queryParam.levelTwoDept
        // let allDep = this.allDepartment
        // for(let i = 0,leng=allDep.length; i < leng; i++) {
        //   for(let j = 0,len=allDep[i]['sonListData'].length; j < len; j++) {
        //     this.allDepartment2.push(allDep[i]['sonListData'][j])
        //   }
        // }
      }else{
        this.allDepartment.forEach(item=>{
          if(item.id===e){
            this.allDepartment2 = item.sonListData
            this.queryParam.levelOneDept = item.dataName
          }
        })
      }
    },
    //获取报备部门
    getReportDepartment(){
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
    //发布时间禁用函数
    disabledPublishStartDate(startValue) {
      const endValue = this.publishEndValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledPublishEndDate(endValue) {
      const startValue = this.publishStartValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    PublishStartDateChange(e1, e2) {
      if (!e2) {
        this.queryParam.beginDate = ''
      } else {
        this.queryParam.beginDate = e2
      }
    },
    PublishEndDateChange(e1, e2) {
      if (!e2) {
        this.queryParam.endDate = ''
      } else {
        this.queryParam.endDate = e2
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .statementQuery{
    .conditon{
      width:200px;
      padding:0!important;
    }
    .text{
      margin:0 16px 0 24px;
      padding:0!important;
    }
    .textWidth4 {
      width:56px;
      text-align: right;
    }
  }
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
.inputBg{
 width:100%!important;
 color:#55565D;
 background:#F5F5F5;
 border: 1px solid #d9d9d9;box-shadow: none;
}
</style>