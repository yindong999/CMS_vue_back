<template>
  <div>
    <!-- 待审核内容列表 -->
    <div>
      <!-- 查询条件 -->
      <a-card title :bordered="false" style="width: 100%;">
        <a-row :gutter="24" style="display:flex;align-items:center;">
          <!-- 审核状态 -->
          <a-col>审核状态</a-col>
          <a-col :md="4" :sm="6">
            <a-select style="width:100%;" @change="aduitChange" allowClear placeholder="请选择审核状态">
              <a-select-option value>全部</a-select-option>
              <a-select-option :value="index" v-for="(item,index) in status" :key="index">{{item}}</a-select-option>
            </a-select>
          </a-col>
          <!-- 媒体平台 -->
          <a-col>媒体平台</a-col>
          <a-col :md="4" :sm="6">
            <a-select style="width:100%;" @change="mediaChange" allowClear placeholder="请选择媒体平台">
              <a-select-option value>全部</a-select-option>
              <a-select-option :value="item" v-for="(item,index) in media" :key="index">{{item}}</a-select-option>
            </a-select>
          </a-col>
          <!-- 发布渠道 -->
          <a-col>发布渠道</a-col>
          <a-col :md="4" :sm="6">
            <a-select style="width:100%;" @change="channelChange" allowClear placeholder="请选择发布渠道">
              <a-select-option value>全部</a-select-option>
              <a-select-option :value="item" v-for="(item,index) in channel" :key="index">{{item}}</a-select-option>
            </a-select>
          </a-col>
          <!-- 内容标题 -->
          <a-col>内容标题</a-col>
          <a-col :md="4" :sm="6">
            <a-input
              style="width:100%;"
              v-model="queryParam.contenttitle"
              allowClear
              placeholder="请输入内容标题"
            />
          </a-col>
        </a-row>
        <a-row type="flex" justify="end" style="margin-top: 8px;">
          <!-- <a-button type="primary" style="float:right;" icon="search" @click="search">查询</a-button> -->
          <a-col class="col">
            <a-button @click="search" type="primary" class="queryBtn">
              <img src="@/assets/searchImg.png" class="queryBtnImg" alt />
              查询
            </a-button>
          </a-col>
        </a-row>
      </a-card>
      <!-- 发布内容列表,每行数据的唯一表示变成nodeId，节点id -->
      <a-card
        title="发布内容列表"
        :headStyle="headStyle"
        :bodyStyle="{'padding-top':'0'}"
        :bordered="false"
        style="width: 100%;margin-top:12px;"
      >
        <div style="margin-top: 15px">
          <a-table
            style="height:500px"
            ref="table"
            size="small"
            :bordered="false"
            rowKey="nodeId"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="contenttitle" slot-scope="text, record">
              <a-popover title trigger="hover">
                <template slot="content">
                  <p style="maxWidth:300px;word-break:break-all;">{{record.contenttitle}}</p>
                </template>
                <a
                  class="mouseHover"
                  onmouseover="this.style.color='#3264D5';"
                  onmouseout="this.style.color='#595959';"
                >{{record.contenttitle}}</a>
              </a-popover>
            </span>
            <span slot="action" slot-scope="text, record">
              <a
                style="color:#3264D5;"
                v-if="authButton.hasOwnProperty('reviewBtn')&&authButton.reviewBtn"
                @click="audit(record)"
              >详情</a>
            </span>
          </a-table>
        </div>
      </a-card>
    </div>
    <!-- 内容详情和内容预览部分 -->
    <a-modal
      v-model="isShowDetail"
      title="内容详情"
      width="1200px"
      :footer="null"
      @cancel="yulanCancel"
    >
      <a-row :gutter="50" type="flex" style="min-height:500px">
        <!-- 内容预览模块 -->
        <a-col :span="9" style="height:100%;">
          <a-row
            style="margin-bottom:20px;font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
          >内容列表</a-row>
          <a-row v-if="detailData.channelPlatform == '抖音'" style="padding:20px;background:#F4F6FA;">
            <video
              :src="col[0].mediaPath"
              style="width:100%;height:550px;outline:none;"
              controls
              id="dyvideo"
              v-if="col[0].mediaPath"
            ></video>
            <img
              :src="require('@/assets/video.png')"
              alt
              style="width:100%;height:550px;outline:none;"
              v-else
            />
          </a-row>
          <template v-else>
            <a-row
              v-if="col[0]"
              :style="{padding:'20px',background:'#F4F6FA',paddingBottom:col.length == 1 ? '20px' : '0'}"
            >
              <a-col
                :span="24"
                class="content one"
                style="height:168px;cursor:pointer;"
                @click="lookMore(col[0])"
              >
                <img :src="col[0].imagePath" alt style="width:100%;height:168px;" />
                <div class="one_titleCon">
                  <span class="one_title">{{col[0].title}}</span>
                </div>
              </a-col>
            </a-row>
            <a-row
              v-for="(item,index) in col"
              v-show="index > 0"
              :key="index"
              type="flex"
              align="middle"
              :style="{padding:'0 20px',background:'#F4F6FA',paddingBottom:index == col.length-1 ? '20px' : '0'}"
            >
              <a-col
                :span="24"
                class="content"
                @click="lookMore(item)"
                style="background:#fff;padding:0 10px;"
              >
                <span
                  class="title"
                  :style="{border:index == col.length-1 ? 'none' : ''}"
                >{{item.title}}</span>
                <a-avatar
                  class="img"
                  style="margin-top:10px"
                  shape="square"
                  :size="64"
                  :src="item.imagePath"
                />
              </a-col>
            </a-row>
          </template>
        </a-col>
        <!-- 内容基本信息模块 -->
        <a-col :span="15">
          <a-row
            style="margin-bottom:20px;font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
          >基本信息</a-row>
          <a-row class="basic" :gutter="10">
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;">媒体平台：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.channelPlatform || "无"}}</span>
            </a-col>
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;">渠道名称：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.channelName || "无"}}</span>
            </a-col>
          </a-row>
          <a-row class="basic" :gutter="10">
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;">内容级别：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.templateRank || "无"}}</span>
            </a-col>
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;">发布时间：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.publishTime || "无"}}</span>
            </a-col>
          </a-row>
          <a-row class="basic" :gutter="10">
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;">内容标题：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.templateName || "无"}}</span>
            </a-col>
          </a-row>
          <a-row class="basic">
            <a-col>
              <div style="color:#767885;font-size:14px;display:flex;">
                <span style="flex-shrink:0;">内容标签：</span>
                <template
                  v-if="detailData.newsitemList && detailData.newsitemList[0].tagMap.length"
                >
                  <div
                    style="width:620px;font-size:14px;color:#55565D;display:flex;flex-wrap:wrap;align-content:flex-start;margin-top:-3px;"
                  >
                    <div
                      v-for="(item,index) in detailData.newsitemList[0].tagMap"
                      :key="index"
                      style="margin-right:5px;background:#F4F6FA;border-radius:3px;margin-bottom:5px;padding:3px 5px;"
                    >{{item && item.tagName}}</div>
                  </div>
                </template>
                <span v-else>无</span>
              </div>
            </a-col>
          </a-row>
          <a-row style="margin-top:30px;">
            <a-timeline>
              <a-timeline-item
                v-for="(item,index) in detailData.processNodeList"
                :key="index"
                color="gray"
              >
                <a-icon
                  slot="dot"
                  :type="item.type"
                  theme="filled"
                  :style="{fontSize: '16px',color:item.color}"
                  v-if="item.nodeStatusStr!='未激活' && !item.isNew"
                />
                <a-row type="flex">
                  <a-col :span="4" style="font-size:14px;color:#55565D">{{item.operatorName}}</a-col>
                  <a-col :span="3" style="font-size:14px;color:#767885">{{item.nodeStatusStr}}</a-col>
                  <a-col :span="10" style="font-size:12px;color:#A6A8B4">{{item.updateTime}}</a-col>
                </a-row>
              </a-timeline-item>
            </a-timeline>
          </a-row>
          <a-row
            v-if="isFirstReviewer && (nodestatus == '待审核')"
            type="flex"
            align="middle"
            style="margin-top:-20px;margin-bottom:50px;width:120px;position:relative;z-index:100;"
          >
            <a-col>
              <img
                :src="require('@/assets/add.png')"
                alt
                style="width:32px;height:32px;margin-right:10px;cursor:pointer;border-radius: 16px;"
                @click="confirmOK"
              />
            </a-col>
            <a-col style="font-size:14px;color:#767885;">添加审核人</a-col>
          </a-row>
          <a-row
            style="margin-bottom:20px;background:#F7F7FB;padding:15px;border-radius:5px;"
            v-if="nodestatus == '已驳回'"
          >
            <a-row style="color:#3C3D43;font-size:14px;margin-bottom:5px;font-weight:500;">驳回原因</a-row>
            <a-row style="color:#767885;font-size:12px;">{{detailData.reason}}</a-row>
          </a-row>
          <!-- 协同发布部分 -->
          <template v-if="!isXTFB">
            <a-row
              style="margin-bottom:20px;font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
            >发布操作</a-row>
            <a-row type="flex" style="width:90%;">
              <a-col :span="4">是否协同发布</a-col>
              <a-col>
                <a-switch
                  @change="onChange"
                  :disabled="!isFirstReviewer || (nodestatus == '已通过' || nodestatus == '已驳回' || nodestatus == '流程异常')"
                  :checked="checked"
                />
              </a-col>
            </a-row>
            <a-row
              type="flex"
              style="margin:20px 0 50px 0;width:80%;"
              align="middle"
              v-show="isShowChannel"
            >
              <a-col :span="2">渠道</a-col>
              <a-col :span="16">
                <div
                  style="width:360px;display:flex;flex-wrap:wrap;flex-shrink:0;border-radius:4px;border:1px solid #C2C3C5;min-height:32px;"
                  @click="selectClick"
                >
                  <p
                    v-for="(item,index) in xietongQudao"
                    :key="index"
                    style="padding:3px 10px;margin:3px 5px;display:flex;align-items:center;background:#F4F6FA;border-radius:3px;font-size:12px;color:#55565D"
                  >
                    <span>{{isFirstReviewer ? item.channelName : item}}</span>
                    <a-icon
                      v-if="isFirstReviewer"
                      type="close"
                      :style="{fontSize:'10px',marginLeft:'15px'}"
                      @click.stop="deleteChannel(item.id)"
                    />
                  </p>
                </div>
              </a-col>
            </a-row>
          </template>
          <!-- 内容预览，审核通过，驳回   按钮 -->
          <a-row class="basic" v-if="!isXTFB">
            <a-col :span="24">
              <a-button
                type="primary"
                @click="agree"
                style="font-size:14px;width:108px;"
                :disabled="(nodestatus == '已通过' || nodestatus == '已驳回' || nodestatus == '流程异常') ? true : false"
              >审核通过</a-button>
              <a-button
                style="padding:0 27px;font-size:14px;width:108px;"
                @click="reject"
                :disabled="(nodestatus == '已通过' || nodestatus == '已驳回' || nodestatus == '流程异常') ? true : false"
              >驳回</a-button>
              <a-button style="padding:0 27px;font-size:14px;width:108px;" @click="cancel">取消</a-button>
            </a-col>
          </a-row>
          <!-- 协同发布的部门审批 -->
          <a-row class="basic" v-if="isXTFB">
            <a-col :span="24">
              <a-button
                style="width:108px;font-size:14px;"
                type="primary"
                @click="agree"
                :disabled="(nodestatus == '已通过' || nodestatus == '已驳回' || nodestatus == '流程异常') ? true : false"
              >同意发布</a-button>
              <a-button
                style="width:108px;font-size:14px;"
                @click="reject"
                :disabled="(nodestatus == '已通过' || nodestatus == '已驳回' || nodestatus == '流程异常') ? true : false"
              >拒绝发布</a-button>
              <a-button style="padding:0 27px;width:108px;font-size:14px;" @click="cancel">取消</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 驳回对话框 -->
    <a-modal title="请填写驳回原因：" :visible="visible" @cancel="handleCancel">
      <template slot="footer">
        <div :style="{ textAlign: 'center',padding:'14px 16px'  }">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="primary" @click="handleOk" class="affirmBtn">确认</a-button>
          </a-config-provider>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button @click="handleCancel" class="abolishBtn">取消</a-button>
          </a-config-provider>
        </div>
      </template>
      <a-textarea v-model="reason"></a-textarea>
    </a-modal>
    <!-- 预览弹窗 -->
    <a-modal title="内容详情" v-model="visible10" :footer="null" width="400px">
      <div style="height:500px;overflow-y:auto;">
        <a-row style="font-size:20px;font-weight:500;color:rgba(50,50,51,1);">{{preview.title}}</a-row>
        <a-row type="flex" style="margin:15px 0;">
          <a-col
            style="font-size:14px;margin-right:15px;color:rgba(87,107,149,1);"
          >{{preview.channelName}}</a-col>
          <a-col
            style="font-size:14px;font-weight:400;color:rgba(200,201,204,1);"
          >{{preview.createTime && preview.createTime.split(" ")[0]}}</a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <div v-html="preview.htmlContent"></div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <!-- 选择审核人的弹窗 -->
    <a-modal
      v-model="isShowSteps"
      title="选择审核人"
      width="640px"
      @ok="submitAuditor"
      @cancel="cancelSubmitAuditor"
    >
      <a-row type="flex" :gutter="20">
        <a-col :span="10" style="background:#F4F6FA;height:300px;overflow-y:auto;">
          <a-row
            type="flex"
            align="middle"
            style="height:40px;"
            v-for="(item,index) in AuditorList"
            :key="index"
          >
            <a-col :span="3">
              <img style="width:24px;heigth:24px;" src="@/assets/tx.png" alt />
            </a-col>
            <a-col :span="18" style="font-size:14px;color:#55565D">{{item.userName}}</a-col>
            <a-col :span="1">
              <a-icon
                type="right-circle"
                @click="selectAuditor(index)"
                style="color:#3264D5;font-size:18px;"
              />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="13" :push="1">
          <a-timeline>
            <a-timeline-item v-for="(item,index) in AuditorSelect" :key="index" color="gray">
              <a-row type="flex">
                <a-col :span="7" style="color:#55565D;font-size:14px;">{{change[index+2]}}级审核人</a-col>
                <a-col :span="15" style="color:#767885;font-size:14px;">{{item.userName}}</a-col>
                <a-col>
                  <a-icon
                    type="close-circle"
                    @click="cancelAuditor(index)"
                    style="color:#FF6A6A;font-size:18px;"
                  />
                </a-col>
              </a-row>
            </a-timeline-item>
          </a-timeline>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 选择渠道的弹窗 -->
    <a-modal
      v-model="selectChannel"
      title="渠道选择"
      width="800px"
      @ok="xietongOk"
      @cancel="xietongCancel"
    >
      <div class="conEidt-tabs">
        <a-row type="flex" justify="space-between">
          <a-col :span="14">
            <a-row>
              <a-col
                :span="5"
                v-for="(item,channelName) in channelList"
                :key="channelName"
                @click="changeChannelName(channelName)"
              >
                <a-row
                  type="flex"
                  justify="center"
                  align="middle"
                  :style="{background:channelName == flagChannelName ? '#3264D5' : '#fff',color:channelName == flagChannelName ? '#fff':'#767885',height:'32px',borderRadius:'5px',cursor:'pointer',marginBottom:'15px'}"
                >{{channelName}}</a-row>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-input-search
              placeholder="请输入关键字搜索"
              style="width:100%"
              v-model="searchChannelName"
              @search="selectClick"
            />
          </a-col>
        </a-row>
        <a-row>
          <div class="con-channel">
            <a-row type="flex">
              <a-col :span="5" v-for="(secItem,index) in channelList[flagChannelName]" :key="index">
                <div class="channel-wrap">
                  <div class="channel-avatar" @click="changeChannel(secItem)">
                    <img
                      style="cursor:pointer;"
                      :src="secItem.imgUrl != null && secItem.imgUrl != '' ? secItem.imgUrl : defaultUrl"
                      alt
                    />
                    <div
                      :class="secItem.chosen ? 'channel-avatar-selected': 'channel-avatar-shadow'"
                    >
                      <a-icon
                        class="channel-icon"
                        type="check"
                        theme="outlined"
                        style="fontSize: 28px;"
                      />
                    </div>
                  </div>
                  <p class="channel-title" style="cursor:pointer;">
                    <span>{{ secItem.channelName }}</span>
                  </p>
                  <p class="approver" v-if="secItem.authorSelect">
                    <a-button type="primary" shape="round" @click="editAuditor(secItem)">
                      {{secItem.authorName}}
                      <a-icon type="edit" />
                    </a-button>
                  </p>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-row>
      </div>
    </a-modal>
    <!-- 协同发布选择审核人 -->
    <a-modal :width="480" title="请选择审核人" :maskClosable="false" v-model="chooseAuditorModal">
      <template slot="footer">
        <div :style="{ textAlign: 'center' }">
          <a-button type="primary" @click="shenheOk" :disabled="!chooseAuditorId">确定</a-button>
          <a-button @click="shenheCancel">取消</a-button>
        </div>
      </template>
      <a-radio-group
        name="radioGroup"
        :default-value="defaultAuditorId"
        v-model="chooseAuditorId"
        style="display: block;"
      >
        <a-row v-for="(item,key) in xietongAuditorList" :key="key" style="line-height: 36px;">
          <a-col :span="11" style="letter-spacing:1px;">{{item.userName}}</a-col>
          <a-col :span="11">{{item.account}}</a-col>
          <a-col :span="2">
            <a-radio name="author" :value="item.userId"></a-radio>
          </a-col>
        </a-row>
      </a-radio-group>
    </a-modal>
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>
<script>
import Vue from 'vue'
import tooltip from '@/components/tooltip/tooltip.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {
  auditList,
  auditIng,
  auditDetail,
  dataDictionary,
  channelList,
  fixupReviewer,
  getAuditorByChannelId,
  findChannelList
} from '@/api/api'
import { USER_INFO, USER_AUTH } from '@/store/mutation-types'

export default {
  name: 'Analysis',
  mixins: [JeecgListMixin],
  components: { tooltip },
  data() {
    return {
      message: '操作成功',
      type: 'info',
      headStyle: {
        'text-align': 'center',
        'border-bottom': 'none'
      },
      //按钮权限，默认拥有全部权限
      authButton: {
        reviewBtn: true
      },
      visible10: false,
      col: [],
      // 发布内容列表表头
      columns: [
        {
          title: '媒体平台',
          align: 'center',
          dataIndex: 'channelPlatform',
          width: 100,
          className: 'table_title'
        },
        {
          title: '发布渠道',
          align: 'center',
          dataIndex: 'channelname',
          width: 100,
          className: 'table_title'
        },
        {
          title: '内容标题',
          align: 'center',
          dataIndex: 'contenttitle',
          scopedSlots: { customRender: 'contenttitle' },
          width: 200,
          className: 'table_title'
        },
        {
          title: '提交人',
          dataIndex: 'editorname',
          align: 'center',
          width: 100,
          className: 'table_title'
        },
        {
          title: '更新时间',
          dataIndex: 'updatetime',
          align: 'center',
          width: 100,
          className: 'table_title'
        },
        {
          title: '状态',
          dataIndex: 'nodestatus',
          align: 'center',
          width: 100,
          className: 'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' },
          className: 'table_title'
        }
      ],
      // 审核状态
      status: {},
      // 媒体平台
      media: [],
      // 发布渠道
      channel: [],
      // 发布内容列表查询参数
      queryParam: {
        channelPlatform: '', //媒体平台
        channelname: '', //发布渠道
        contenttitle: '', //内容标题
        processsnodestatus: '',
        processstatus: '',
        userid: ''
      },
      url: {
        list: '/cms/process/manage/reviewcontentList'
      },
      // 详情信息
      detailData: {},
      contentid: '',
      processid: '',
      channelId: '',
      userId: '',
      reason: '',
      visible: false, //是否显示确认框
      isShowDetail: false, //是否显示内容详情弹窗
      isShowChannel: false,
      preview: {
        //移动端预览视图
        htmlContent: '',
        title: '',
        channelName: '',
        createTime: ''
      },
      AuditorList: [], //存放根据渠道ID查询审核者的数据
      AuditorSelect: [], //存放选中审核者的数据
      AuditorId: [],
      isShowSteps: false, //一级审核人选择下级审核人的弹窗
      isFirstReviewer: false, //是不是一级审核人
      isXTFB: false, //是不是协同发布
      change: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      nodestatus: '',
      selectChannel: false,
      checked: false, //是否打开协同发布开关
      channelList: {}, //存放根据渠道id查询的渠道列表
      chooseAuditorModal: false, //协同发布选择审核人
      xietongAuditorList: [], //协同发布的渠道的审核人
      chooseAuditorId: '', //绑定的审核人id
      defaultAuditorId: '', //协同发布默认审核人id
      xietongQudao: [], //选中的协同发布渠道
      tempItem: {}, //协同发布的时候暂时存放渠道信息，为的是在选择渠道审核人弹窗的时候把渠道审核人添加进来
      flagChannelName: '', //协同发布的渠道选择弹窗控制显示哪个分类
      searchChannelName: '', //协同发布的渠道选择弹窗的搜索框
      defaultUrl: 'http://haier-nryx-public.oss-cn-qingdao.aliyuncs.com/image/2020-03/2020030514594648219.png' //协同发布渠道的默认图标
    }
  },
  created() {
    this.userId = Vue.ls.get(USER_INFO).id
    this.queryParam.userid = Vue.ls.get(USER_INFO).id
    //从字典表查媒体平台
    dataDictionary({
      dataType: 'mediaPlatform'
    }).then(res => {
      if (res.code === 200) {
        this.media = Object.values(res.data).concat()
      } else {
        this.$message.error(res.message)
      }
    }),
      //从字典表查审核状态
      dataDictionary({
        dataType: 'processnodestatus'
      }).then(res => {
        if (res.code === 200) {
          for (let key in res.data) {
            if (res.data[key] == '未激活') {
              delete res.data[key]
            }
          }
          this.status = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    // 查询发布渠道
    channelList({
      userCode: Vue.ls.get(USER_INFO).userAccount,
      type: '2'
    }).then(res => {
      if (res.code === 200) {
        res.data.forEach(val => {
          val.channelInfoList.forEach(value => {
            this.channel.push(value.channelName)
          })
        })
      } else {
        this.$message.error(res.message)
      }
    })
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
  },
  methods: {
    lookMore(e) {
      this.visible10 = true
      this.preview.htmlContent = e.content
      this.preview.title = e.title
      this.preview.channelName = e.channelName
      this.preview.createTime = e.createTime
    },
    // 点击非弹窗中内容预览的图片触发
    show_content() {
      this.visible10 = true
    },
    // 点击查询按钮触发
    search() {
      this.loadData()
    },
    // 点击查看按钮触发,查看详情
    audit(data) {
      this.contentid = data.contentid
      this.processid = data.processid
      this.channelId = data.channelId
      this.isXTFB = data.isXTFB
      this.isFirstReviewer = data.isFirstReviewer
      this.nodestatus = data.nodestatus
      this.checked = false
      this.isShowChannel = false
      auditDetail({
        templateId: this.contentid,
        processid: this.processid
      }).then(res => {
        if (res.code === 200) {
          res.data.processNodeList.forEach(val => {
            switch (val.nodeStatusStr) {
              case '提交':
                ;(val.color = '#3264D5'), (val.type = 'check-circle')
                break
              case '已通过':
                ;(val.color = '#3264D5'), (val.type = 'check-circle')
                break
              case '审核中':
                ;(val.color = '#1DCCC9'), (val.type = 'clock-circle')
                break
              case '待审核':
                ;(val.color = '#1DCCC9'), (val.type = 'clock-circle')
                break
              case '已驳回':
                ;(val.color = '#FF6A6A'), (val.type = 'close-circle')
                break
              case '流程异常':
                ;(val.color = '#EEB63F'), (val.type = 'info-circle')
                break
              default:
                ;(val.color = '#EEB63F'), (val.type = 'info-circle')
                break
            }
          })
          this.detailData = Object.assign(res.data)
          this.col = res.data.newsitemList.concat()
          if (!this.isFirstReviewer && res.data.xTFBDeptList.length) {
            this.xietongQudao = res.data.xTFBDeptList.concat()
            this.checked = true
            this.isShowChannel = true
          }
          if (!res.data.xTFBDeptList.length) {
            this.xietongQudao = []
          }
          this.isShowDetail = true
        } else {
          // this.$message.error(res.message)
          this.message = res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 点击审核通过按钮触发,channelIdToFirstReviewerMap是协同发布部门的内容
    agree() {
      var temp = {}
      this.xietongQudao.forEach(val => {
        temp[val.id] = val.authorId
      })
      auditIng({
        operate: 1,
        processid: this.processid,
        reason: '',
        userid: this.userId,
        templateId: this.contentid,
        channelIdToFirstReviewerMap: JSON.stringify(temp) == '{}' ? null : temp,
        reviewerIdArray: this.AuditorId.concat() //下级审核人的Id
      }).then(res => {
        this.isShowDetail = false
        this.xietongQudao = []
        if (res.code == 200) {
          // this.$notification.open({
          //   message: res.message,
          //   icon: <a-icon type="smile" style="color: #108ee9" />
          // })
          if (this.isXTFB) {
            this.message = '已同意发布'
          } else {
            this.message = '审核已通过'
          }
          this.type = 'info'
          this.warnMethod()
          this.loadData()
        } else {
          this.message = res.message
          this.type = 'error'
          this.warnMethod()
          // this.$notification.open({
          //   message: res.message,
          //   icon: <a-icon type="frown" style="color: #f00" />
          // })
        }
      })
    },
    // 点击驳回按钮触发
    reject() {
      this.visible = true
    },
    warnMethod() {
      this.$refs.tooltip.visible = true
      this.$refs.tooltip.alertVisible = true
      setTimeout(() => {
        this.$refs.tooltip.cancel()
      }, 3000)
    },
    // 点击驳回对话框确认按钮
    handleOk() {
      if (!this.reason) {
        // this.$message.error('请填写驳回原因')
        this.message = '请填写驳回原因'
        this.type = 'error'
        this.warnMethod()
        return
      }
      auditIng({
        operate: 2,
        processid: this.processid,
        reason: this.reason,
        userid: this.userId
      }).then(res => {
        this.visible = false
        if (res.code == 200) {
          this.reason = ''
          // this.$notification.open({
          //   message: '操作成功',
          //   icon: <a-icon type="smile" style="color: #108ee9" />
          // })
          if (this.isXTFB) {
            this.message = '已拒绝发布'
          } else {
            this.message = '审核已驳回'
          }
          this.type = 'info'
          this.warnMethod()
          this.isShowDetail = false
          this.xietongQudao = []
          this.loadData()
        } else {
          this.reason = ''
          this.message = res.message
          this.type = 'error'
          this.warnMethod()
          // this.$notification.open({
          //   message: res.message,
          //   icon: <a-icon type="frown" style="color: #f00" />
          // })
        }
      })
    },
    // 点击驳回对话框取消按钮
    handleCancel() {
      this.visible = false
      this.reason = ''
    },
    //点击取消触发
    cancel() {
      this.isShowDetail = false
      this.xietongQudao = []
    },
    aduitChange(val) {
      this.queryParam.processsnodestatus = val ? val : ''
    },
    mediaChange(val) {
      this.queryParam.channelPlatform = val ? val : ''
    },
    channelChange(val) {
      this.queryParam.channelname = val ? val : ''
    },
    onChange(e) {
      this.isShowChannel = e
      this.checked = e
    },
    // 一级审核人添加下级审核人
    confirmOK() {
      getAuditorByChannelId({
        channelid: this.channelId
      }).then(res => {
        this.isShowConfirm = false
        this.isShowSteps = true
        this.AuditorList = res.data.filter(val => {
          return val.userId != Vue.ls.get(USER_INFO).id
        })
      })
    },
    // 选择取消审核人
    selectAuditor(index) {
      this.AuditorSelect.push(this.AuditorList[index])
      this.AuditorList.splice(index, 1)
    },
    cancelAuditor(index) {
      this.AuditorList.push(this.AuditorSelect[index])
      this.AuditorSelect.splice(index, 1)
    },
    // 一级审核人选择下级审核人
    submitAuditor() {
      var temp = []
      var processNode = []
      this.AuditorSelect.forEach(val => {
        val.operatorName = val.userName
        val.nodeStatusStr = ''
        val.updateTime = ''
        val.isNew = true
        processNode.push(val)
        temp.push(val.userId)
      })
      this.detailData.processNodeList = this.detailData.processNodeList.filter(val=>{
        return val.isNew !== true
      })
      this.detailData.processNodeList = this.detailData.processNodeList.concat(processNode)
      this.AuditorId = temp.concat()
      this.isShowSteps = false
      this.AuditorSelect = []
    },
    // 一级审核人取消选择下级审核人
    cancelSubmitAuditor() {
      this.AuditorSelect = []
    },
    // 以下为协同发布部分的方法**************************
    // 点击协同发布渠道，显示出选择发布渠道的弹窗，调接口查询发布渠道
    selectClick() {
      if (!this.isFirstReviewer) {
        return
      }
      this.selectChannel = true
      findChannelList({
        channelId: this.channelId,
        channelName: this.searchChannelName,
        operatorId: this.detailData.processNodeList[0].operatorId
      }).then(res => {
        for (var key in res.data) {
          res.data[key].forEach(val => {
            val.authorSelect = false
            val.authorName = ''
            val.authorId = ''
          })
        }
        this.xietongQudao.forEach(val => {
          for (var key in res.data) {
            res.data[key].forEach((value, index) => {
              if (val.id == value.id) {
                res.data[key].splice(index, 1, Object.assign({}, val))
              }
            })
          }
        })
        this.channelList = res.data
        this.flagChannelName = Object.keys(res.data)[0]
      })
    },
    // 点击某一个发布渠道弹出选择审核人的弹窗，调接口查询该渠道的所有审核人
    changeChannel(item) {
      this.chooseAuditorId = ''
      if (item.chosen) {
        item.chosen = false
        item.authorSelect = false
        return
      }
      this.chooseAuditorModal = true
      this.tempItem = item
      getAuditorByChannelId({
        channelId: item.id
      }).then(res => {
        this.xietongAuditorList = res.data.concat()
      })
    },
    // 把选中的渠道放入到协同发布列表，xietongQudao是存放选中的渠道
    xietongOk() {
      this.xietongQudao = []
      this.searchChannelName = ''
      for (var i in this.channelList) {
        this.channelList[i].forEach(val => {
          if (val.chosen) {
            this.xietongQudao.push(val)
          }
        })
      }
      this.selectChannel = false
    },
    //删除选中的某个渠道
    deleteChannel(id) {
      this.xietongQudao = this.xietongQudao.filter(val => {
        return val.id != id
      })
    },
    //协同发布选择审核人之后把审核人名字显示在渠道名称的下面，xietongAuditorList是协同发布部分某一个渠道的所有选择人，chooseAuditorId是该渠道所有选择人单选框绑定的审核人的id
    shenheOk() {
      this.tempItem.chosen = true
      this.xietongAuditorList.forEach(val => {
        if (val.userId == this.chooseAuditorId) {
          this.tempItem.authorName = val.userName
          this.tempItem.authorId = val.userId
          this.tempItem.authorSelect = true
        }
      })
      this.chooseAuditorModal = false
    },
    // 点击协同发布部分选择审核人弹窗的取消按钮，关闭选择审核人的弹窗
    shenheCancel() {
      this.chooseAuditorModal = false
    },
    editAuditor(secItem) {
      this.chooseAuditorModal = true
      this.chooseAuditorId = ''
      this.tempItem = secItem
      getAuditorByChannelId({
        channelId: secItem.id
      }).then(res => {
        this.xietongAuditorList = res.data.concat()
      })
    },
    changeChannelName(channelName) {
      this.flagChannelName = channelName
    },
    xietongCancel() {
      this.searchChannelName = ''
    },
    yulanCancel() {
      var oDom = document.getElementById('dyvideo')
      if (oDom) {
        oDom.pause()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.basic {
  margin: 10px 0;
}
.basic .ant-col-24 .ant-btn {
  margin-right: 20px;
}
.title {
  height: 84px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #f7f7fb;
  font-size: 16px;
  font-weight: 550;
  width: 90%;
}
.img {
  display: inline-block;
}
.content {
  display: flex;
  cursor: pointer;
}
.one {
  overflow: hidden;
}
.one_titleCon {
  width: 100%;
  height: 75px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.43) 100%) !important;
  display: flex;
  align-items: flex-end;
  .one_title {
    color: #fff;
    font-size: 16px;
    line-height: 30px;
    padding: 0 10px;
    width: 100%;
  }
}

// 以下为选择渠道样式
.ant-tabs-tab {
  margin-right: 8px !important;
}
.select {
  background: rgba(50, 100, 213, 1) !important;
  color: #fff !important;
  margin-bottom: 16px !important;
}
.anticon {
  vertical-align: -0.125em !important;
}
.module-line {
  margin-top: 24px;
  width: 1200px;
}
.con-channel {
  /*min-height: 250px;*/
  margin-bottom: 30px;
}
/* 选择发布渠道*/
.channel-wrap {
  text-align: center;
}
.channel-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #3264d5;
  // background-color: #fff;
  border: 1px solid #ccc;
  margin: 10px auto;
  position: relative;
  overflow: hidden;
}
.channel-avatar img {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.channel-avatar-shadow {
  position: absolute;
  top: 100%;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  line-height: 80px;
  background-color: #fff;
  opacity: 0.7;
}
/*.channel-avatar:hover .channel-avatar-shadow {
    top: 0%;
  }*/
.channel-avatar-selected {
  position: absolute;
  top: 0%;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  line-height: 80px;
  background-color: #c3dcf6;
  opacity: 0.7;
}
.channel-icon {
  color: rgb(4, 76, 243);
}
.approver {
  .ant-btn-primary {
    background-color: #1dccc9;
    border-color: #1dccc9;
  }
}
.hintContent {
  .rowContent {
    margin-bottom: 20px;
    .circle {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      background-color: #3264d5;
      color: white;
      margin-right: 20px;
    }
    .fontContent {
      letter-spacing: 0.15em;
      .blue {
        color: #3264d5;
      }
    }
  }
}
</style>
