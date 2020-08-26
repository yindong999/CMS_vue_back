<template>
  <!-- 原创的详情 -->
  <a-modal
    class="list-view"
    :zIndex="1200"
    :footer="null"
    v-model="listViewVisible"
    @ok="listViewOk"
    @cancel="listViewCancel"
    width="1200px"
  >
    <p class="contentBy" style>内容详情</p>
    <a-row :gutter="50" type="flex" style=" min-height:500px;margin-top:50px">
      <!-- 内容预览模块 -->
      <a-col style="width:400px;">
        <a-row style="margin-left:5px;font-size:14px;font-weight:500;color:#3C3D43;">内容预览</a-row>
        <a-row class="box" style="margin-top: 24px;width:100%;">
          <a-col>
            <div>
              <p style="text-align:center;color:#3C3D43;font-size:18px;font-weight:500;">{{ record.title }}</p>
              <p style="display:flex;align-items:center;justify-content:center;">
                <img
                  v-if="record.channelPlatform == '微信公众号'"
                  :src="require('@/assets/pic/wechat_2x.png')"
                  style="width:24px;height:24px;margin-right:10px;"
                  alt
                />
                <img
                  v-if="record.channelPlatform == '抖音'"
                  :src="require('@/assets/pic/douyin_2x.png')"
                  style="width:24px;height:24px;margin-right:10px;"
                  alt
                />
                <img
                  v-if="record.channelPlatform == '新浪微博'"
                  :src="require('@/assets/pic/weibo_2x.png')"
                  style="width:24px;height:24px;margin-right:10px;"
                  alt
                />
                <span style="margin-right:15px;color:#767885;font-size:14px;">{{ record.channelName }}</span>
                <span style="color:#767885;font-size:14px;">{{ record.publishTime }}</span>
              </p>
              <a-divider></a-divider>
              <!-- 内容正文部分，抖音平台显示成纯视频 -->
              <a-row v-if="record.channelPlatform == '抖音'" type="flex" justify="center">
                <video
                  :src="record.mediaPath"
                  width="100%"
                  height="500px"
                  controls
                  id="video"
                  style="outline:none"
                ></video>
              </a-row>
              <div v-else v-html="record.content"></div>
              <!-- 转评赞部分 -->
              <a-row type="flex" justify="start" style="width:100%;margin:15px 0;">
                <!-- 微信能拿到阅读量和转发量，微博能拿到转评赞数量，抖音能拿到转评赞和播放量 -->
                <a-col
                  style="display:flex;justify-content:flex-start;align-items:center;"
                  class="icon"
                  :span="3"
                  v-if="record.channelPlatform == '微信公众号' || record.channelPlatform == '抖音'"
                >
                  <img src="@/assets/analysis/yuedu.png" alt />
                  <span
                    style="margin-left:5px;"
                    v-if="record.channelPlatform == '微信公众号'"
                  >{{record.wx_int_page_read_count || 0}}</span>
                  <span
                    style="margin-left:5px;"
                    v-if="record.channelPlatform == '抖音'"
                  >{{record.playCount || 0}}</span>
                </a-col>
                <a-col
                  style="display:flex;justify-content:flex-start;align-items:center;"
                  class="icon"
                  :span="3"
                >
                  <img src="@/assets/analysis/zhuanfa.png" alt />
                  <span style="margin-left:5px;">{{record.shareCount || 0}}</span>
                </a-col>
                <a-col
                  style="display:flex;justify-content:flex-start;align-items:center;"
                  class="icon"
                  :span="3"
                  v-if="record.channelPlatform == '新浪微博' || record.channelPlatform == '抖音'"
                >
                  <img src="@/assets/analysis/pinglun.png" alt />
                  <span style="margin-left:5px;">{{record.commentCount || 0}}</span>
                </a-col>
                <a-col
                  style="display:flex;justify-content:flex-start;align-items:center;"
                  class="icon"
                  :span="3"
                  v-if="record.channelPlatform == '新浪微博' || record.channelPlatform == '抖音'"
                >
                  <img src="@/assets/analysis/dianzan.png" alt />
                  <span style="margin-left:5px;">{{record.giveCount || 0}}</span>
                </a-col>
              </a-row>
              <!-- 评论部分 -->
              <a-row
                style="color:#3C3D43;font-size:16px;font-weight:500;margin:30px 0;width:100%;"
              >最新评论</a-row>
              <a-spin :spinning="commentSpinning" style="width:100%">
                <template v-if="commentList.length">
                  <a-row type="flex" v-for="(item,index) in commentList" :key="index">
                    <a-col :span="4">
                      <img
                        :src="item.commentUserPhoto"
                        style="width:48px;height:48px;border-radius:50%;"
                        alt
                        v-if="record.channelPlatform == '新浪微博'"
                      />
                      <img
                        style="width:48px;height:48px;border-radius:50%;"
                        src="@/assets/default.png"
                        alt
                        v-else
                      />
                    </a-col>
                    <a-col :span="20">
                      <a-col
                        v-if="record.channelPlatform == '新浪微博'"
                        style="font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
                      >{{item.commentUserName || "无"}}</a-col>
                      <a-col
                        v-else
                        style="font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
                      >{{item.commentUserId || "无"}}</a-col>
                      <a-col
                        style="margin:10px 0;font-size:12px;font-weight:400;color:rgba(85,86,93,1);"
                      >{{item.content}}</a-col>
                      <a-row type="flex" style="margin-bottom:15px;">
                        <a-col
                          :span="8"
                          style="font-size:12px;font-weight:400;color:rgba(166,168,180,1);"
                        >{{item.commentCreateTime.split(" ")[0]}}</a-col>
                        <a-col
                          class="icon"
                          :span="4"
                          push="8"
                          style="text-align:right;"
                        >
                          <img
                            v-if="!item.isShow && !item.isHoverReply"
                            src="@/assets/analysis/pinglun.png"
                            alt
                          />
                          <img v-else src="@/assets/analysis/pinglun_touch.png" alt />
                          <span
                            :style="{marginLeft:'5px',color:!item.isShow && !item.isHoverReply?'':'#3264D5'}"
                          >{{item.replyCommentTotal}}</span>
                        </a-col>
                        <a-col class="icon" :span="4" push="8" style="text-align:right;">
                          <img src="@/assets/analysis/dianzan.png" alt />
                          <span style="margin-left:5px;">{{item.likeAmount}}</span>
                        </a-col>
                        <!-- <a-col
                          class="icon"
                          :span="2"
                          push="8"
                          style="cursor:pointer;"
                          @click="deleteCom(item,index)"
                          @mouseenter="item.isHoverDel = true"
                          @mouseleave="item.isHoverDel = false"
                          v-if="record.channelPlatform != '抖音'"
                        >
                          <a-row type="flex" justify="end" align="middle" style="height:100%">
                            <img v-if="!item.isHoverDel" src="@/assets/analysis/shanchu.png" alt />
                            <img v-else src="@/assets/analysis/shanchu_touch.png" alt />
                          </a-row>
                        </a-col> -->
                      </a-row>
                      <a-row
                        style="background:#fff;width:100%;margin-top:10px;"
                        v-show="item.isShow"
                      >
                        <a-row style="margin:10px 0;">
                          <a-input
                            :placeholder="'回复'+ (record.channelPlatform == '新浪微博'? item.commentUserName : item.commentUserId)"
                            v-model.trim="item.reply"
                          />
                        </a-row>
                        <a-row type="flex" justify="end" style="margin-bottom:10px;">
                          <a-button
                            type="primary"
                            @click="reply(item,index)"
                            :loading="item.loading"
                          >回复</a-button>
                        </a-row>
                      </a-row>
                      <!-- 多级评论 -->
                      <a-row
                        style="background:#F7F7FB;border-radius:5px;padding-bottom:15px;"
                        v-if="item.twoContentComment.length"
                      >
                        <a-row
                          v-for="(contentItem,twoIndex) in item.twoContentComment"
                          :key="contentItem.commentId"
                          type="flex"
                          style="padding-top:15px;"
                        >
                          <a-col :span="24">
                            <a-col style="font-size:14px;font-weight:500;color:rgba(60,61,67,1);">
                              {{record.channelPlatform == '新浪微博' ? contentItem.commentUserName : contentItem.commentUserId}}:
                              <span
                                style="color:rgba(85,86,93,1);font-size:12px;font-weight:400;"
                              >{{contentItem.content}}</span>
                            </a-col>
                            <a-row type="flex" justify="space-between" style="margin-top:10px;">
                              <a-col
                                :span="12"
                                style="font-size:12px;font-weight:400;color:rgba(166,168,180,1);"
                              >{{contentItem.commentCreateTime}}</a-col>
                              <a-col :span="12">
                                <a-row type="flex" justify="end" style="width:100%;">
                                  <a-col
                                    style="display:flex;justify-content:flex-end;align-items:center;"
                                    class="icon"
                                    :span="12"
                                  >
                                    <img
                                      src="@/assets/analysis/pinglun.png"
                                      alt
                                      v-if="!contentItem.isShow && !contentItem.isHoverReply"
                                    />
                                    <img src="@/assets/analysis/pinglun_touch.png" alt v-else />
                                    <!-- <span
                                  :style="{marginLeft:'5px',color:!contentItem.isShow && !contentItem.isHoverReply ?'':'#3264D5'}"
                                    >{{contentItem.replyCommentTotal}}</span>-->
                                    <span
                                      :style="{marginLeft:'5px',color:!contentItem.isShow && !contentItem.isHoverReply ?'':'#3264D5'}"
                                    >{{contentItem.replyCommentTotal}}</span>
                                  </a-col>
                                  <a-col
                                    style="display:flex;justify-content:flex-end;align-items:center;"
                                    class="icon"
                                    :span="8"
                                  >
                                    <img src="@/assets/analysis/dianzan.png" alt />
                                    <span style="margin-left:5px;">{{contentItem.likeAmount}}</span>
                                  </a-col>
                                </a-row>
                              </a-col>
                            </a-row>
                          </a-col>
                          <a-row
                            v-show="contentItem.isShow"
                            style="background:#fff;width:100%;margin:0 auto;padding:15px;border-radius:5px;margin-top:12px;margin-bottom:5px;"
                          >
                            <a-row style="margin:10px 0;">
                              <a-input
                                :placeholder="'回复'+ (record.channelPlatform == '新浪微博'? contentItem.commentUserName : contentItem.commentUserId)"
                                v-model.trim="contentItem.reply"
                              />
                            </a-row>
                            <a-row type="flex" justify="end">
                              <a-button
                                type="primary"
                                @click="reply(contentItem,index)"
                                :loading="contentItem.loading"
                              >回复</a-button>
                            </a-row>
                          </a-row>
                          <a-divider
                            v-if="twoIndex != item.twoContentComment.length-1"
                            style="margin-bottom:0;margin-top:10px;"
                          ></a-divider>
                        </a-row>
                      </a-row>
                    </a-col>
                    <a-divider v-if="index != commentList.length-1"></a-divider>
                  </a-row>
                </template>
              </a-spin>
              <a-row
                v-if="isShow && !commentSpinning"
                type="flex"
                justify="center"
                align="middle"
                style="height:50px;color:#3264D5;font-size:14px;cursor:pointer"
                @click.native="lookMore"
              >查看更多回复</a-row>
              <a-empty v-if="!commentList.length && !commentSpinning" description="暂无评论" />
            </div>
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
            <span class="textName">{{listViewDetails.publishStatus | formatStatus}}</span>
          </a-col>
        </a-row>
        <a-row class="basic">
          <a-col class="textRight">
            <span class="textSpan" style="margin-left: -2px">内容类型：</span>
            <span
              class="textName"
              style="margin-left: 14px;"
            >{{listViewDetails.templateType==='news'?"图文":"视频"|| "无"}}</span>
          </a-col>
          <a-col class="textRight">
            <span class="textSpan">账号:</span>
            <span class="textName">{{listViewDetails.channelName}}</span>
          </a-col>
        </a-row>
        <a-row class="basic">
          <!-- 标签部分目前先隐藏 2020-07-28 备注 -->
          <!-- <a-col
            class="textRight"
            style="padding-righ:16px;width: 670px;margin-right: 24px;margin-bottom: 16px;min-height: 26px;"
          >
            <span class="textSpan" style="display: block;float: left;">标签:</span>
            <p style="width: 605px;float: right;margin-left: 5px;">
              <span
                class="textName"
                style="margin-left: 14px;
						border-radius:3px;
						margin-bottom:8px;padding-left: 8px;width: auto;padding-right: 8px;background: #F7F7FB;"
                v-for="(item,index) in listViewDetails.newsitemList[0].tagMap"
                :key="index"
              >{{item.tagName||"无"}}</span>
            </p>
          </a-col>-->
          <!-- 标签部分暂时隐藏，先用这个a-col,等标签设置显示后，注释该部分，打开上面部分 -->
          <a-col
            class="textRight"
            style="padding-righ:16px;width: 670px;margin-right: 24px;margin-bottom: 0px;min-height: 16px;"
          ></a-col>
        </a-row>
        <a-row class="bassc" style="min-height:58px">
          <a-timeline style="margin-top: 5px;">
            <a-timeline-item
              v-for="(item,index) in processNodeList"
              :key="index"
              style="height: 44px;"
            >
              <a-icon
                v-if="item.nodeStatus==='3'"
                slot="dot"
                type="check-circle"
                theme="filled"
                style="font-size: 16px;color: #3264D5;"
              />
              <a-icon
                v-if="item.nodeStatus==='4'"
                slot="dot"
                type="close-circle"
                theme="filled"
                style="font-size: 16px;color:#FF6A6A;"
              />
              <a-icon
                v-if="item.nodeStatus==='2'"
                slot="dot"
                type="clock-circle"
                theme="filled"
                style="font-size: 16px;color: #3264D5;"
              />
              <a-icon
                v-if="item.nodeStatus==='5'"
                slot="dot"
                type="info-circle"
                theme="filled"
                style="font-size: 16px;color: #EEB63F;"
              />
              <span
                style="display: inline-block;width: 135px;font-size: 14px;color: #55565D;"
              >{{item.operatorName}}</span>
              <span
                style="display: inline-block;width: 120px;font-size: 14px; margin-left: 24px;color: #767885;"
              >{{item.nodeStatusStr || '无'}}</span>
              <span
                style="display: inline-block;margin-left:17px; font-size: 12px;color: #A6A8B4;"
              >{{item.updateTime}}</span>
            </a-timeline-item>
          </a-timeline>
        </a-row>
        <div v-show="Reject" style="width: 704px;margin-top: -18px;">
          <div style="width: 704px;height: 104px;background: #F7F7FB ; padding:0 28px 0 16px">
            <p
              style="font-size: 14px;font-weight: 500;color: #3C3D43;padding-top: 16px;clear: both;"
            >{{curNodeStates?"驳回原因:":"发布失败原因:"}}</p>
            <p
              style="font-size: 12px;color: #767885;margin-top:-8px;"
            >{{curNodeStates?reason:publishReason}}</p>
          </div>
        </div>
        <div v-show="teamwork" style="margin-top: 16px;">
          <a-row
            style="margin-bottom:20px;min-height:54px;font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
          >
            协同发布情况
            <a-table
              v-show="tableA"
              ref="table"
              size="small"
              :bordered="false"
              rowKey="key"
              :pagination="false"
              :columns="columnsSmall"
              style="margin-top: 24px;width: 702px;color: #55565D;"
              :data-source="dataSourceSmall"
            >
              <span slot="processStatus" slot-scope="text, record">
                <a-popover title="审核结果" trigger="click" v-if="record.processStatus=='拒绝发布'">
                  <template slot="content">
                    <p>{{rejectReason}}</p>
                  </template>
                  <a
                    style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all;width:150px;display:inline-block;"
                    :style="{color:record.processStatus==='拒绝发布'?'#FF6A6A':'#55565D'}"
                  >{{record.processStatus}}</a>
                </a-popover>

                <span v-else>{{record.processStatus}}</span>
              </span>
            </a-table>
            <a-row v-show="tableB">
              <div style="margin:0 auto;margin-top: 50px;">
                <a-empty description="未发起协同发布" style="font-size: 14px;color: #55565D" />
              </div>
            </a-row>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { auditDetail,getVideoCommentMessage,ContentStatusData } from '@/api/api'
import tooltip from '@/components/tooltip/tooltip.vue'
export default {
  components: { tooltip },
  data() {
    return {
      // 右侧部分data**********************************************
      publishReason: '', // 发布失败原因
      curNodeStates: false,
      isSpread: false,
      ContentStatus: [],
      message: '', //提示信息
      type: '', //提示类型
      department: '',
      channePres: '', //搜索用的渠道
      title: '',
      record: [], //详情列表
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
        'border-bottom': 'none',
      },
      //按钮权限，默认拥有全部权限
      authButton: {
        reviewBtn: true,
      },
      mediaPlatform: [], // 媒体平台数据
      channel: [], //渠道存储列表
      media: [], //发布部门存储
      visible: false, // 弹窗显示与否的标志
      category: null, // 记录所有分类下的内容框的高度
      flag: true, //让所有分类是否收起的标志
      brand: null, // 品牌下拉选数据
      industry: null, // 企业下拉选数据
      oneData: {},
      contListSmall: [],
      reason: '',
      //查看页面表格
      columnsSmall: [
        {
          title: '部门',
          align: 'center',
          width: 175,
          ellipsis: true,
          dataIndex: 'channelLevel',
          className: 'table_title',
        },
        {
          title: '媒体平台',
          align: 'center',
          width: 175,
          ellipsis: true,
          dataIndex: 'channelPlatform',
          className: 'table_title',
        },
        {
          title: '渠道名称',
          className: 'table_title',
          align: 'center',
          minWidth: 175,
          ellipsis: true,
          dataIndex: 'channelName',
        },
        {
          title: '状态',
          align: 'center',
          width: 175,
          ellipsis: true,
          className: 'table_title',
          dataIndex: 'processStatus',
          scopedSlots: {
            customRender: 'processStatus',
          },
        },
      ],
      //流程状态
      processNodeList: [],
      //表格数据   模拟假数据
      dataSource: [],
      //列表查看详情
      listViewDetails: {},
      // 表头
      templateName: '',
      channelChangeC: '', //搜索中的渠道
      mediaChangeC: '', //搜索中的部门
      showIndustry: false, // 所有分类中的产业是否显示
      categoryHeight: null, //   分类分级右侧元素高度
      channelHeight: null, //   渠道品牌右侧元素高度
      brandHeight: null, //   品牌右侧元素高度
      industryHeight: null, //   产业右侧元素高度
      newsitemList: [], //newlist 存储
      lastList: [], //最后的渲染列表
      statusOfGit: '',
      trueOfFalse: null,
      mediaPlate: [], // 媒体平台下拉选数据
      channelParams: {
        type: 1,
        usercode: null,
        channel_platform: '',
      },
      // 右侧部分data结束*******************************************
      record: {}, //存放左侧预览数据
      message: '',
      type: '',
      modalVisible: false,
      commentList: [], //评论列表
      recommendList: [], //右侧推荐内容
      page: 1, //评论的页数
      startNum: 0, //微博分页的起始位置
      isShow: true,
      commentSpinning: false, //评论的加载状态
      recommendSpinning: false, //推荐内容的加载状态
      commonIndex: 0,
      recommendTabsData:[],
    }
  },
  methods: {
    // 右侧部分方法**********************************
    // 点击查看按钮触发
    handleLook(record) {
      this.record = Object.assign({}, record)
      this.dataSourceSmall = []
      //   查询右侧数据
      auditDetail({
        processid: record.processId,
        templateId: record.templateId,
      }).then((res) => {
        console.log('res:', res)
        if (res.code === 200) {
          this.trueOfFalse = res.data.isSingleChannelPublish
          this.statusOfGit = res.data.publishStatus / 1
          console.log(this.statusOfGit, 'this.statusOfGit')
          this.listViewDetails = res.data
          //详情发布状态
          this.ContentStatus.forEach((item) => {
            if (item['value'] == res.data.publishStatus) {
              this.listViewDetails['showStatus'] = item['label']
            }
          })
          this.templateName = res.data.templateName
          let last = res.data.contentXTFBDTOList //协同发布
          let list = res.data.newsitemList
          let lest = res.data.processNodeList //审核流程
          if (res.data.reason) {
            this.reason = res.data.reason
          } else {
            this.reason = ''
          }
          console.log('last------;', last)
          last.forEach((vat, index) => {
            let data = {
              key: index,
              channelLevel: vat.channelLevel ? vat.channelLevel : '',
              channelPlatform: vat.channelPlatform ? vat.channelPlatform : '',
              channelName: vat.channelName ? vat.channelName : '',
              processStatus: vat.processStatus ? vat.processStatus : '',
            }
            if (vat.reason) {
              this.rejectReason = vat.reason
            } else {
              this.rejectReason = null
            }
            this.dataSourceSmall.push(data)
          })
          if (res.data.publishStatus === '5' && res.data.publishReason) {
            this.Reject = true
            this.curNodeStates = false
            this.publishReason = res.data.publishReason
          } else if (lest) {
            this.publishReason = ''
            this.curNodeStates = true
            lest.forEach((val, index) => {
              if (val.nodeStatus == 4) {
                this.Reject = true
              } else {
                this.Reject = false
              }
            })
          }
          this.processNodeList = res.data.processNodeList
          if (last.length > 0) {
            this.teamwork = true
            this.tableA = true
            this.tableB = false
          } else {
            this.teamwork = true
            this.tableA = false
            this.tableB = true
          }

          this.listViewVisible = true
          this.contListI = list[0]
          for (let i = 1; i < list.length; i++) {
            this.contListSmall.push(list[i])
          }
          if (this.contListI.mediaPath === '' || this.contListI.mediaPath) {
            this.VIDEO = true
          } else {
            this.VIDEO = false
          }
          if (this.contListI.imagePath === '' || this.contListI.imagePath) {
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
    listViewOk(e) {
      this.listViewVisible = false
    },
    listViewCancel(e) {
      this.listViewVisible = false
      this.contListSmall = []
    },
    // 右侧部分方法结束**********************************
     // 查询评论列表
    getcommentList() {
      this.commentList = []
      this.commentSpinning = true
      getVideoCommentMessage({
        page: this.page,
        startNum: this.startNum,
        size: 5,
        newstemplateId: this.record.templateId,
        channelId: this.record.channelId,
        index: this.record.channelPlatform == '微信公众号' ? this.record.orderNo - 1 : 0
      }).then(res => {
        this.commentSpinning = false
        if (res.code === 200) {
          res.data.content.forEach(val => {
            val.reply = ''
            val.isHoverReply = false
            val.isHoverDel = false
            val.loading = false
            val.twoContentComment.forEach(value => {
              value.reply = ''
              value.isHoverReply = false
              value.isHoverDel = false
              value.loading = false
            })
          })
          this.commentList = this.commentList.concat(res.data.content)
          // 抖音和微信公众号按照页数查询，微博按照起始位置查询
          if (this.record.channelPlatform == '抖音' || this.record.channelPlatform == '微信公众号') {
            if (res.data.totalPage <= this.page) {
              this.isShow = false
            } else {
              this.isShow = true
            }
          }
          if (this.record.channelPlatform == '新浪微博') {
            if (res.data.total <= this.commentList.length) {
              this.isShow = false
            } else {
              this.isShow = true
            }
          }
        }else if(res.code!==400){
          this.message = res.message
          this.type = 'error'
          // this.warnMethod()
        }

      })
    },
    // 加载更多评论
    lookMore() {
      this.page++
      this.startNum = this.commentList.length
      this.getcommentList()
    },
    warnMethod() {
      this.$refs.tooltip.visible = true
      this.$refs.tooltip.alertVisible = true
      setTimeout(() => {
        this.$refs.tooltip.cancel()
      }, 3000)
    },
    // 关闭弹窗暂停抖音视频播放
    cancel() {
      this.recommendTabsData = []
      if (this.record.channelPlatform == '抖音') {
        document.getElementById('video').pause()
      }
    }
  },
  filters:{
    formatStatus:function(value){
      var status = ""
      ContentStatusData.forEach(val =>{
        if(val.value == value){
          status = val.label;
        }
      })
      return status
    }
  }
}
</script>

<style lang="scss" scoped>
th.table_title {
  background-color: #f7f7fb !important;
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
  .basic {
    color: #767885;
    display: block;
    width: 700px;
    .textRight {
      width: 346px;
      margin-top: 16px;
      float: left;
      font-size: 14px;
      .textSpan {
        display: inline-block;
        text-align: right;
        width: 70px;
        margin-left: -12px;
      }
      .textName {
        display: inline-block;
        color: #55565d;
        margin-left: 24px;
      }
    }
  }
  .bassc {
    margin-left: 2px;
  }
  .box {
    overflow-y: auto;
    width: 400px;
    height: 600px;
    background: #F7F7FB;
    padding: 20px;
    margin-left: 5px;
    &::-webkit-scrollbar {
      width: 2px;
    }
    .boxImg {
      width: 360px;
      height: 150px;
    }

    .contbox {
      width: 360px;
      height: 76px;
      background: #ffffff;
      padding: 10px;
      position: relative;

      .fontbox {
        height: 65px;
        width: 250px;
        padding: 5px;
        color: #3c3d43;
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
.ant-card-bordered {
  border: none;
}

.ant-popover {
  z-index: 1000000 !important;
}
</style>