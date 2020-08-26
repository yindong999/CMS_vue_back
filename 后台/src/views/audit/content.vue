<template>
  <div>
    <!-- 待审核内容列表 -->
    <div>

      <!-- 查询条件 -->
      <a-card title :bordered="false" style="width: 100%;" class="statementQuery">
        <a-form @keyup.enter.native="search">
        <a-row class="formStyle" type="flex" justify="space-between">
        <a-row class="leftDiv">
          <!-- 审核状态 -->
          <a-col style="display:flex;align-items:center;" :span="8">
            <span class="textWidth4" style="text-align:right;">状态</span>
            <a-select style="width:calc(100% - 97px);margin-left:16px;" @change="aduitChange" allowClear placeholder="请选择状态" :showSearch="true" :filter-option="filterOption">
              <a-select-option value>全部</a-select-option>
              <a-select-option :value="index" v-for="(item,index) in status" :key="index">{{item}}</a-select-option>
            </a-select>
          </a-col>
          <!-- 媒体平台 -->
          <a-col style="display:flex;align-items:center;" :span="8">
            <span class="textWidth4">媒体平台</span>
            <a-select style="width:calc(100% - 97px);margin-left:16px;" @change="mediaChange" allowClear placeholder="请选择媒体平台" :showSearch="true" :filter-option="filterOption">
              <a-select-option value>全部</a-select-option>
              <a-select-option :value="item.mediaPlatformCode" v-for="(item,index) in media" :key="index">{{item.mediaPlatformName}}</a-select-option>
            </a-select>
          </a-col>
          <!-- 账号 -->
          <a-col style="display:flex;align-items:center;" :span="8">
            <span class="textWidth4" style="text-align:right;">账号</span>
            <a-select style="width:calc(100% - 97px);margin-left:16px;" v-model="channelChangeC" @change="channelChange" allowClear placeholder="请选择账号" :showSearch="true" :filter-option="filterOption">
              <a-select-option value>全部</a-select-option>
              <a-select-option :value="item.id" v-for="(item,index) in channel" :key="index">{{item.channelName}}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
          <div class="btnCol" style="width:90px;">
                <a-button @click="search" type="primary" class="queryBtn">
                  <img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
                  <span>查询</span>
                </a-button>
              </div>
          </a-row>
          <a-row
            v-if="isSpread"  class="leftDiv"
            style="margin-top: 16px;display:flex;align-items:center;"
          >
            <!-- <a-button type="primary" style="float:right;" icon="search" @click="search">查询</a-button> -->
            <!-- <a-col class="col">
            <a-button @click="search" type="primary" class="queryBtn" style="background:#3264D5">
              <img src="@/assets/searchImg.png" class="queryBtnImg" alt />
              查询
            </a-button>
          </a-col> -->
           <!-- 内容标题 -->
          <a-col style="display:flex;align-items:center;" :span="8">
            <span class="textWidth4">内容标题</span>
            <a-input
              style="width:calc(100% - 97px);margin-left:16px;"
              v-model="queryParam.contenttitle"
              allowClear
              placeholder="请输入内容标题"
            />
          </a-col>
        </a-row>
         <!-- 展开/收起按钮 -->
          <div class="outerText"  :style="{'display': 'flex','justify-content': 'center','margin': '0 auto','margin-top':!isSpread?'16px':'0'}">
            <span @click="toggle"  style="cursor:pointer;">
              <span class="spreadText">{{isSpread?'收起':'展开'}}</span>
              <a-icon :type="!isSpread?'down':'up'" class="downUp" style="color:#3264D5;"/>
            </span>
          </div>
        </a-form>
      </a-card>
      <!-- 发布内容列表,每行数据的唯一表示变成nodeId，节点id -->
      <a-card
        title="发布内容列表"
        :headStyle="headStyle"
        :bodyStyle="{'padding-top':'0'}"
        :bordered="false"
        style="width: 100%;margin-top:12px;"
      >
        <div>
          <a-table
            style=""
            ref="table"
            size="small"
            :bordered="bordered"
            rowKey="nodeId"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            :scroll="{scrollToFirstRowOnChange:true,y:tabHeight}"
          >
            <span slot="contenttitle" style="min-width: 150px;" slot-scope="text, record">
              <a-popover title trigger="hover">
                <template slot="content">
                  <p style="maxWidth:300px;word-break:break-all;">{{record.contenttitle}}</p>
                </template>
                <a
                  class="mouseHover"
				          style="min-width: 150px;"
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
              >审核</a>
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
          >内容预览</a-row>
          <div v-if="!isOtherPlatform">
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
          </div>
          <!--其他媒体平台类型的预览样式，直接预览-->
          <div v-if="isOtherPlatform" style="background: #F4F6FA;padding: 12px;overflow-y: auto;height: 100%;min-height: 400px;max-height: 500px">
            <!--文章类型-->
            <div v-if="otherContentType===1" style="overflow-x: hidden;padding: 0;">
              <p style="margin-right: 14px;font-weight: 500;font-size: 20px;color: #323233;">{{ itemDetail.title }}</p>
              <p>
                <span style="color:#576B95;margin-right:15px;">{{ itemDetail.channelName }}</span>

                <span>{{ itemDetail.createTime ? itemDetail.createTime.split(" ")[0] : "" }}</span>

                <!-- <span style="color: #7D7E80;font-size: 14px;">{{itemDetail.description}}</span> -->
              </p>
              <p style="" v-html="itemDetail.content" class="contentText">
                {{itemDetail.content}}
              </p>
            </div>
            <!--图文类型-->
            <div v-if="otherContentType===2">
              <a-carousel>
                <div v-for="(item,index) in itemDetail.picturePath.split(',')" :key="index">
                  <img style="width:100%;height: 200px" :src="item" alt="">
                </div>
              </a-carousel>
              <h2 style="font-size: 20px;font-weight: 500;">{{ itemDetail.title }}</h2>
              <div>
                {{itemDetail.content}}
              </div>
            </div>
            <!--视频类型-->
            <div v-if="otherContentType===3" style="overflow-y:auto;overflow-x:hidden">
              <video :src="itemDetail.mediaPath" v-show="itemDetail.mediaPath!==''" controls width="300" height="400"></video>
            </div>
          </div>

        </a-col>
        <!-- 内容基本信息模块 -->
        <a-col :span="15">
          <a-row
            style="margin-bottom:20px;font-size:14px;font-weight:500;color:rgba(60,61,67,1);"
          >基本信息</a-row>
          <a-row class="basic" :gutter="10">
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;margin-right:24px;">媒体平台：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.channelPlatform || "无"}}</span>
            </a-col>
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;margin-right:24px;padding-left: 28px;">账号：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.channelName || "无"}}</span>
            </a-col>
          </a-row>
          <a-row class="basic" :gutter="10">
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;margin-right:24px;">内容级别：</span>
              <span style="font-size:14px;color:#55565D;">{{detailData.templateRank || "无"}}</span>
            </a-col>
            <a-col :span="12">
              <span style="color:#767885;font-size:14px;margin-right:24px;">提交时间：</span>
              <span style="font-size:14px;color:#55565D;">{{submitTime || "无"}}</span>
            </a-col>
          </a-row>
          <a-row class="basic" :gutter="10">
            <a-col :span="24" style="display: flex;">
              <span style="color:#767885;font-size:14px;margin-right:24px;display:inline-block;width: 70px!important;">内容标题：</span>
              <span style="font-size:14px;color:#55565D;display:inline-block;">{{detailData.templateName || "无"}}</span>
            </a-col>
          </a-row>
          <a-row class="basic">
            <a-col>
              <div style="color:#767885;font-size:14px;display:flex;">
                <!-- 标签部分目前先隐藏 2020-07-28 备注 -->
                <!-- <span style="flex-shrink:0;margin-right:24px;">内容标签：</span>
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
                <span v-else>无</span> -->
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
                  <a-col :span="4" style="font-size:14px;color:#767885">{{item.nodeStatusStr}}</a-col>
                  <a-col :span="10" style="font-size:12px;color:#A6A8B4">{{item.updateTime}}</a-col>
                </a-row>
              </a-timeline-item>
            </a-timeline>
          </a-row>
          <a-row
            v-if="isFirstReviewer && nodestatus == '待审核'&&processNodeStatus==='2'"
            type="flex"
            align="middle"
            style="margin-top:-20px;margin-bottom:50px;width:120px;position:relative;z-index:100;margin-left:-10px;"
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
            style="margin-bottom:40px;margin-top:-30px;background:#F7F7FB;padding:15px;border-radius:5px;"
            v-if="nodestatus == '已退回'"
          >
            <a-row style="color:#3C3D43;font-size:14px;margin-bottom:5px;font-weight:500;">退回原因</a-row>
            <a-row style="color:#767885;font-size:12px;">{{detailData.reason}}</a-row>
          </a-row>
          <!-- 协同发布部分 -->
          <template v-if="!isXTFB">
            <a-row
              style="margin-bottom:20px;font-size:14px;font-weight:600;color:#3C3D43;">
            发布操作</a-row>
            <a-row type="flex" style="width:90%;">
              <a-col :span="4">是否协同发布</a-col>
              <a-col>
                <a-switch
                  @change="onChange"
                  :disabled="!(isFirstReviewer && (nodestatus == '待审核')&&processNodeStatus==='2')"
                  :checked="checked"
                />
              </a-col>
            </a-row>
            <a-row
              type="flex"
              style="margin:20px 0;width:80%;"
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
                    <span>{{item.channelName || item}}</span>
                    <a-icon
                      v-if="isFirstReviewer && (nodestatus == '待审核')"
                      type="close"
                      :style="{fontSize:'10px',marginLeft:'15px'}"
                      @click.stop="deleteChannel(item.id)"
                    />
                  </p>
                </div>
              </a-col>
                </a-row>
                <a-row v-if="isShowChannel" style="width:90%;">
                  <a-col :span="4">是否允许编辑</a-col>
                  <a-col>
                    <a-switch
                      :disabled="!(isFirstReviewer && (nodestatus == '待审核')&&processNodeStatus==='2')"
                      @change="editBtnChange"
                      :checked="isEditor"
                    />
                  </a-col>
              </a-row>

           </template>
          <!--操作按钮-->
          <!--普通审核按钮-->
          <!-- 内容预览，审核通过，驳回   按钮 -->
          <a-row class="basic" v-if="!isXTFB" style="margin-top:30px;">
            <a-col :span="24">
              <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="agree" :disabled="isRun || processNodeStatus!=='2'">
                <template slot="title">
                  <p>您确定要审核通过吗？审核通过后将不可更改</p>
                </template>
                <a-button
                  type="primary"
                  style="font-size:14px;width:108px;"
                  :disabled="isRun || processNodeStatus!=='2'"
                >审核通过</a-button>
              </a-popconfirm>
              <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="reject" :disabled="processNodeStatus!=='2'">
                <template slot="title">
                  <p>您确定要退回修改吗？退回修改后将不可更改</p>
                </template>
                <a-button
                  style="padding:0 27px;font-size:14px;width:108px;"
                  :disabled="processNodeStatus!=='2'"
                >退回修改</a-button>
              </a-popconfirm>
              <a-button style="padding:0 27px;font-size:14px;width:108px;" @click="cancel">关闭</a-button>
            </a-col>
          </a-row>
          <!--被协同发布的操作按钮-->
          <a-row class="basic" v-if="isXTFB">
            <a-col :span="24">
              <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="backToUpdate(true)" :disabled="isRun || processNodeStatus!=='2'">
                <template slot="title">
                  <p>您确定要同意发布吗？同意发布后将不可更改</p>
                </template>
                <a-button style="width:108px;font-size:14px;" type="primary" :disabled="isRun || processNodeStatus!=='2'">同意发布</a-button>
              </a-popconfirm>
              <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="reject" :disabled="processNodeStatus!=='2'">
                <template slot="title">
                  <p>您确定要拒绝发布吗？拒绝发布后将不可更改</p>
                </template>
                <a-button style="width:108px;font-size:14px;" :disabled="processNodeStatus!=='2'">拒绝发布</a-button>
              </a-popconfirm>
              <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="backToUpdate(false)" :disabled="processNodeStatus!=='2'">
                <template slot="title">
                  <p>您确定要退回修改吗？退回修改后将不可更改</p>
                </template>
                <a-button v-if="isEditor" style="width:108px;font-size:14px;" :disabled="processNodeStatus!=='2'">退回修改</a-button>
              </a-popconfirm>
              <a-button style="padding:0 27px;width:108px;font-size:14px;" @click="cancel">关闭</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 普通审核退回修改，协同审核拒绝发布 输入原因对话框 -->
    <a-modal :title="isXTFB?'拒绝发布原因':'退回修改原因'" :visible="visible" @cancel="handleCancel" :centered="true">
      <template slot="footer">
        <div :style="{ textAlign: 'center',padding:'14px 16px'  }">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="primary" @click="handleOk('XTFB')" class="affirmBtn" :disabled="isRun">确认</a-button>
          </a-config-provider>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button @click="handleCancel" class="abolishBtn">取消</a-button>
          </a-config-provider>
        </div>
      </template>
      <a-textarea v-model="reason" placeholder="请填写原因" :autosize="{ minRows: 2 }"></a-textarea>
      <a-row v-show="reasonLength">
        <a-col style="text-align:right;color: #f5222d;">最多可以输入30个字符。</a-col>
      </a-row>
    </a-modal>
    <!-- 预览弹窗 -->
    <a-modal :centered="true" title="内容详情" v-model="visible10" :footer="null" width="400px">
      <div style="height:460px;overflow-y:auto;">
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
            <div v-html="preview.htmlContent" class="contentDetail"></div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <!-- 选择审核人的弹窗 -->
    <a-modal :centered="true"
      v-model="isShowSteps"
      title="选择审核人"
      width="640px"
      @cancel="cancelSubmitAuditor"
    >
       <template slot="footer">
        <div :style="{ textAlign: 'center',padding:'14px 16px'  }">
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button type="primary" @click="submitAuditor" class="affirmBtn">确认</a-button>
          </a-config-provider>
          <a-config-provider :auto-insert-space-in-button="false">
            <a-button @click="cancelSubmitAuditor" class="abolishBtn">取消</a-button>
          </a-config-provider>
        </div>
      </template>
      <a-row type="flex" :gutter="20" v-if="(AuditorList.length || AuditorSelect.length)">
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
      <a-empty description="该渠道下暂无其他审核人" v-else />
    </a-modal>
    <!-- 选择渠道的弹窗 -->
    <a-modal
      v-model="selectChannel"
      title="渠道选择"
      width="800px"
      @cancel="xietongCancel"
    >
      <template slot="footer">
        <div :style="{ textAlign: 'center' }">
          <a-button type="primary" @click="xietongOk" :disabled="!chooseAuditorId">确定</a-button>
          <a-button @click="xietongCancel">取消</a-button>
        </div>
      </template>
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
    <!-- 协同发布 同意按钮  选择编辑人 -->
    <a-modal :width="480" title="请选择本渠道编辑人" @cancel="closeEditorModal"
    :maskClosable="false" v-model="EditorModal">
      <template slot="footer">
        <div :style="{ textAlign: 'center' }">
          <a-button type="primary" @click="sureEditorModal" :disabled="!chooseEditorId && isRun">确定</a-button>
          <a-button @click="closeEditorModal">取消</a-button>
        </div>
      </template>
    <!-- 协同发布，当同意发布时选择编辑人 -->
      <a-row style="font-weight: 500;">请选择编辑人：</a-row>
      <a-radio-group
        name="radioGroup"
        v-model="chooseEditorId"
        style="display: block;"
      >
        <a-row v-for="(item,key) in editerList" :key="key" style="line-height: 36px;">
          <a-col :span="11" style="letter-spacing:1px;">{{item.userName}}</a-col>
          <a-col :span="11">{{item.account}}</a-col>
          <a-col :span="2"  style="height: 36px;display: flex;align-items: center;justify-content: flex-end;">
            <a-radio  style="float: right;" name="author" :value="item.userId"></a-radio>
          </a-col>
        </a-row>
      </a-radio-group>
    </a-modal>
    <!-- 协同发布 退回修改  选择编辑人 -->
    <a-modal :width="480" :title="!createUserId?'请填写原因并选择编辑人':'退回修改原因'" @cancel="synergismCancel"
             :maskClosable="false" v-model="reasonAndEditorModal">
      <template slot="footer">
        <div :style="{ textAlign: 'center' }">
          <a-button type="primary" @click="synergismOk" :disabled="!chooseEditorId && !createUserId && isRun">确定</a-button>
          <a-button @click="synergismCancel">取消</a-button>
        </div>
      </template>
      <!-- 协同发布，退回修改原因 -->
      <a-row style="margin-bottom: 10px;font-weight: 500;">
        <a-col >退回修改原因：</a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-textarea v-model="reason" placeholder="请填写原因" :autosize="{ minRows: 2 }"></a-textarea>
        </a-col>
      </a-row>
      <a-row v-show="reasonLength">
        <a-col style="text-align:right;color: #f5222d;">最多可以输入30个字符。</a-col>
      </a-row>
      <!-- 协同发布，当退回修改时选择编辑人,选过编辑人的话就不需要再次选择 -->
      <div v-if="!createUserId">
        <a-row style="font-weight: 500;margin-top:20px;">请选择编辑人：</a-row>
        <a-radio-group
          name="radioGroup"
          v-model="chooseEditorId"
          style="display: block;"
        >
          <a-row v-for="(item,key) in editerList" :key="key" style="line-height: 36px;">
            <a-col :span="11" style="letter-spacing:1px;">{{item.userName}}</a-col>
            <a-col :span="11">{{item.account}}</a-col>
            <a-col :span="2"  style="height: 36px;display: flex;align-items: center;justify-content: flex-end;">
              <a-radio  style="float: right;" name="author" :value="item.userId"></a-radio>
            </a-col>
          </a-row>
        </a-radio-group>
      </div>
    </a-modal>
    <!-- 信息弹窗 -->
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
  findChannelList,
  getEditorByChannelId
} from '@/api/api'
import { USER_INFO, USER_AUTH } from '@/store/mutation-types'
import { filterMediaPlatform } from '@/utils/util.js';
export default {
  name: 'Analysis',
  mixins: [JeecgListMixin],
  components: { tooltip },
  data() {
    return {
      reasonLength:false,//控制 输入框字符长度提示语 是否显示的标志
      // isReviewUser:false,
      backReason:'', // 协同发布退回修改原因
      nodeList:0,
      editerList:[],//协同发布编辑人
      reasonAndEditorModal:false,//拒绝发布 编辑人弹窗是否显示的标志；
      EditorModal:false,//同意发布 编辑人弹窗是否显示的标志；
      isEditor:false,//是否允许编辑；true:是；false:否
      editBtnchecked:false,
      isInviteeEdit:1,// 是否可以修改；0：允许修改；1：不允许修改；
      isRun: false, //禁止重复点击审核通过驳回
      isSpread: false,
      bordered: false,
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
          title: '状态',
          dataIndex: 'nodestatus',
          align: 'center',
          width: 100,
          className: 'table_title'
        },
        {
          title: '媒体平台',
          align: 'center',
          dataIndex: 'channelPlatform',
          minWidth: 120,
          className: 'table_title'
        },
        {
          title: '账号',
          align: 'center',
          dataIndex: 'channelname',
          minWidth: 120,
          className: 'table_title'
        },
        {
          title: '内容标题',
          align: 'center',
          dataIndex: 'contenttitle',
          scopedSlots: { customRender: 'contenttitle' },
          minWidth: 300,
		      ellipsis:true,
          className: 'table_title'
        },
        {
          title: '提交人',
          dataIndex: 'editorname',
          align: 'center',
          minWidth: 120,
          className: 'table_title'
        },
        {
          title: '提交时间',
          dataIndex: 'updatetime',
          align: 'center',
          minWidth: 150,
          className: 'table_title'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'action' },
          className: 'table_title'
        }
      ],
      // 审核状态
      status: {},
      // 媒体平台
      media: [],
      // 账号
      channel: [],
      // 发布内容列表查询参数
      queryParam: {
        channelPlatform: '', //媒体平台
        channelname: '', //账号
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
      //详情页提交时间
      submitTime:'',
      change: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      nodestatus: '',
      selectChannel: false,
      checked: false, //是否打开协同发布开关
      channelList: {}, //存放根据渠道id查询的渠道列表
      chooseAuditorModal: false, //协同发布选择审核人
      xietongAuditorList: [], //协同发布的渠道的审核人
      chooseAuditorId: '', //绑定的审核人id
      chooseEditorId: '', //绑定的编辑人id
      defaultAuditorId: '', //协同发布默认审核人id
      xietongQudao: [], //选中的协同账号
      tempItem: {}, //协同发布的时候暂时存放渠道信息，为的是在选择渠道审核人弹窗的时候把渠道审核人添加进来
      flagChannelName: '', //协同发布的渠道选择弹窗控制显示哪个分类
      searchChannelName: '', //协同发布的渠道选择弹窗的搜索框
      defaultUrl: 'http://haier-nryx-public.oss-cn-qingdao.aliyuncs.com/image/2020-03/2020030514594648219.png', //协同账号的默认图标
      //  是否是其他媒体平台（智家）
      isOtherPlatform:false,
      //  其他媒体平台的内容类型，1是文章类型，2是图文类型，3是短视频类型
      otherContentType:1,
      //智家预览的数据
      itemDetail:{},
      // noUse:false,
      channelChangeC:'',
      // btnFlag:false,
      //协同发布同意发布或者驳回修改时 当选择过编辑人，此时编辑人的id
      createUserId:'',
      //当前审批节点状态，processNodeStatus = '2'的时候是当前用户可操作审批按钮，！=2的时候所有的审批操作按钮置灰
      processNodeStatus: null
    }
  },
  created() {
    this.userId = Vue.ls.get(USER_INFO).id
    this.queryParam.userid = Vue.ls.get(USER_INFO).id
    this.isRun = false
    //从字典表查媒体平台
    // dataDictionary({
    //   dataType: 'mediaPlatform'
    // }).then(res => {
    //   if (res.code === 200) {
    //     this.media = Object.values(res.data).concat()
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // }),
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
    // 查询账号
    channelList({
      userCode: Vue.ls.get(USER_INFO).userAccount,
      type: '2'
    }).then(res => {
      if (res.code === 200) {
        console.log('res:',res.data)
        // 调用util中的方法过滤数据，只筛选出微信，微博，抖音的数据
        this.media = filterMediaPlatform(res.data)
        // res.data.forEach(val => {
        //   val.channelInfoList.forEach(value => {
        //     this.channel.push(value.channelName)
        //   })
        // })
          var allMedia2 = []
          this.media.forEach(item=>{
            allMedia2 =  allMedia2.concat(item.channelInfoList)
          })
          this.channel = allMedia2
      } else {
        this.$message.error(res.message)
      }
    })
  },
  watch:{
    reason(newVal,oldVal){
      if(newVal.length>=30){
        this.reason = newVal.substr(0, 30)
        this.reasonLength = true
      }else{
        this.reasonLength = false
      }
    }
  },
  mounted() {
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if (auth.hasOwnProperty(this.$route.name)) {
      this.authButton = auth[this.$route.name]
    }
  },
  methods: {
    //同意发布弹框点击确定
    sureEditorModal(){
      this.EditorModal = false
      this.agree()
    },
    //同意发布弹框点击取消
    closeEditorModal(){
      this.chooseEditorId = ''
      this.EditorModal = false
    },
    //退回修改按钮点击确定
    synergismOk(){
      console.log(this.chooseEditorId)
      this.reasonAndEditorModal = false
      this.isRun = true
      this.handleOk()
      // if(this.btnFlag){
      //   this.agree()
      // }else{
      //   this.handleOk()
      // }
    },
    //退回修改按钮点击取消
    synergismCancel(){
      this.reason = ''
      this.chooseEditorId = ''
      this.reasonAndEditorModal = false
    },
    // 点击 同意发布 或者 退回修改 时触发
    backToUpdate(flag){
      // this.btnFlag = flag
      if(flag && !this.createUserId){
        //如果是同意发布并且没有选择过编辑人，打开同意发布的选择编辑人弹窗
        this.EditorModal = true
        //查询编辑人
        this.getEditers()
      }else if(flag && this.createUserId){
        //如果是同意发布并且有选择过编辑人，直接调用接口
        this.agree()
      }else if(!flag){
        //如果是退回修改，打开退回修改的选择编辑人和原因弹窗,有选择过编辑人的话只会显示原因
        this.reasonAndEditorModal = true
        if(!this.createUserId){
          //查询编辑人
          this.getEditers()
        }
      }

    },
    getEditers(){
      getEditorByChannelId({processInstanceId: Number(this.processid)}).then(res=>{
        if(res.code === 200){
          this.editerList = res.data
        }else{
          this.message = res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 能否编辑
    editBtnChange(e){
      // 0 是可编辑，1是不可编辑
      this.isInviteeEdit = e?0:1
      if(!this.isInviteeEdit){
        this.isEditor = true
      }else{
        this.isEditor = false
      }
    },
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
      this.searchQuery()
    },
    // 点击查看按钮触发,查看详情
    audit(data) {
      this.AuditorId = []
      console.log('data',data)
      this.contentid = data.contentid
      this.processid = data.processid
      this.channelId = data.channelId
      this.isXTFB = data.isXTFB
      this.isFirstReviewer = data.isFirstReviewer

      this.nodestatus = data.nodestatus
      this.checked = false
      this.isShowChannel = false
      this.submitTime = data.updatetime
      auditDetail({
        templateId: this.contentid,
        processid: this.processid
      }).then(res => {
        if (res.code === 200) {
          //智家平台的数据预览样式区别于抖音微信微博
          if (res.data.channelPlatformCode==='zhijia'){
            this.isOtherPlatform = true
            if(res.data.newsitemList[0].picturePath&&res.data.newsitemList[0].picturePath!==null&&res.data.newsitemList[0].picturePath!==''){
              this.otherContentType = 2
            }else if(res.data.newsitemList[0].mediaPath!==null&&res.data.newsitemList[0].mediaPath!==''){
              this.otherContentType = 3
            }else{
              this.otherContentType = 1
            }
            this.itemDetail = res.data.newsitemList[0]
          }else{
            this.isOtherPlatform = false
          }
          // this.isReviewUser = res.data.isReviewUser
          this.nodeList = res.data.processNodeList.length
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
              case '已退回':
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
          // 获取流程节点中最后一个人的id,并和当前登录人进行对比，是同一个人则审核通过按钮可以点击，否则不可点击
          // res.data.processNodeList.slice(-1)[0].operatorId
          //  if(Vue.ls.get(USER_INFO).id == res.data.processNodeList.slice(-1)[0].operatorId){
          //    this.noUse = false
          //  }else{
          //    this.noUse = true
          //  }
          //操作按钮是否可点击
          this.processNodeStatus = res.data.processNodeStatus
          //是否可编辑
          this.isEditor = res.data.isEditor
          //是否有选择过编辑人
          this.createUserId = res.data.createUserId
          this.detailData = Object.assign(res.data)
          this.col = res.data.newsitemList.concat()
          // 只要有协同账号就打开按钮，展示渠道
          if (res.data.xTFBDeptList.length) {
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
      this.isRun = true
      var temp = {}
      this.xietongQudao.forEach(val => {
        temp[val.id] = val.authorId
      })
      console.log('temp:',temp)
      // return
      auditIng({
        operate: 1, // 同意：1，退回：2；
        processid: this.processid, // 进程id
        reason: '', // 退回原因
        userid: this.userId, // 用户id
        templateId: this.contentid, // 模板id
        channelIdToFirstReviewerMap: JSON.stringify(temp) == '{}' ? null : temp,
        reviewerIdArray: this.AuditorId.concat(), //下级审核人的Id
        isEditor:this.isInviteeEdit, // 是否允许编辑
        editorId:this.chooseEditorId // 编辑者id
      })
        .then(res => {
          this.AuditorId = []
          this.isRun = false
          this.isShowDetail = false
          this.xietongQudao = []
          if (res.code == 200) {
            // if (this.isXTFB) {
            //   this.message = '已同意发布'
            // } else {
            //   this.message = '审核已通过'
            // }
            this.message = '操作成功'
            this.type = 'info'
            this.warnMethod()
            this.loadData()
          } else {
            this.message = res.message
            this.type = 'error'
            this.warnMethod()
          }
          this.chooseEditorId = ''
        })
        .catch(() => {
          this.AuditorId = []
          this.isRun = false
        })
    },
    // 点击驳回按钮触发
    reject() {
      this.visible = true
    },
    reject2(){
      this.reasonAndEditorModal = true
      this.getEditers()
    },
    warnMethod() {
      this.$refs.tooltip.visible = true
      this.$refs.tooltip.alertVisible = true
      setTimeout(() => {
        this.$refs.tooltip.cancel()
      }, 3000)
    },
    // 点击驳回对话框确认按钮
    handleOk(type) {
      // if (!this.reason) {
      //   // this.$message.error('请填写驳回原因')
      //   this.message = '请填写驳回原因'
      //   this.type = 'error'
      //   this.warnMethod()
      //   return
      // }
      this.isRun = true
      let param={
        operate: 2,
        processid: this.processid,
        reason: this.reason,
        userid: this.userId,
        // isEditor:this.isInviteeEdit, // 是否可编辑；0：可编辑；1：不允许编辑；
        // editorId:this.chooseEditorId
      }
      //协同发布并且有选择编辑人时,代表点击了退回修改按钮并且选择了编辑人
      if(this.isXTFB&&this.chooseEditorId){
        param['editorId'] = this.chooseEditorId
      }
      //协同发布 选择 拒绝发布，和退回修改的传参不一样，需要给后台一个标志位
      console.log(typeof type)
      if(this.isXTFB&&typeof type === 'string' && type==='XTFB'){
        param['isRefused'] = 1
      }
      auditIng(param)
        .then(res => {
          this.AuditorId = []
          this.isRun = false
          this.visible = false
          if (res.code == 200) {
            this.reason = ''
            // if (this.isXTFB) {
            //   this.message = '已拒绝发布'
            // } else {
            //   this.message = '审核已退回'
            // }
            this.message = '操作成功'
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
          }
          this.chooseEditorId = ''
        })
        .catch(() => {
          this.AuditorId = []
          this.isRun = false
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
      this.AuditorId = []
      this.xietongQudao = []
    },
    aduitChange(val) {
      this.queryParam.processsnodestatus = val ? val : ''
    },
    mediaChange(val) {
      // 	if(val===''){
      //     var allMedia = []
      //     this.media.forEach(item=>{
      //       allMedia =  allMedia.concat(item.channelInfoList)
      //     })
      //     this.channel = allMedia
      //     this.queryParam.channelPlatform = ''
      // }else
      if(val===''||val==undefined){
        this.queryParam.channelPlatform = ''
        this.queryParam.channelId = ''
        var allMedia2 = []
          this.media.forEach(item=>{
            allMedia2 =  allMedia2.concat(item.channelInfoList)
          })
        this.channel = []
        this.channel = allMedia2
      }else{
        this.channel = []
         var newArr = this.media.filter(item=>{
          return item.mediaPlatformCode === val
        })
        this.channel = newArr[0].channelInfoList
        this.queryParam.channelPlatform = newArr[0]['mediaPlatformName']
      }
      this.queryParam.channelId = ''
      this.channelChangeC = ''
    },
    channelChange(val) {
      this.queryParam.channelId = this.channelChangeC;//渠道
      // this.queryParam.channelname = val ? val : ''
    },
    editChange(e){

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
      this.detailData.processNodeList = this.detailData.processNodeList.filter(val => {
        return val.isNew !== true
      })
      this.detailData.processNodeList = this.detailData.processNodeList.concat(processNode)
      this.AuditorId = temp.concat()
      console.log('this.AuditorId；',this.AuditorId)
      this.isShowSteps = false
      this.AuditorSelect = []
    },
    // 一级审核人取消选择下级审核人
    cancelSubmitAuditor() {
      this.AuditorSelect = []
      this.isShowSteps = false
    },
    // 以下为协同发布部分的方法**************************
    // 点击协同账号，显示出选择账号的弹窗，调接口查询账号
    selectClick() {
      if (!(this.isFirstReviewer && this.nodestatus == '待审核')) {
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
    // 点击某一个账号弹出选择审核人的弹窗，调接口查询该渠道的所有审核人
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
      console.log('secItem',secItem)
      this.chooseAuditorModal = true
      this.chooseAuditorId = secItem.authorId
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
      this.selectChannel = false
    },
    yulanCancel() {
      this.AuditorId = []
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
  font-weight: 500;
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
  min-height: 32px;
  line-height: 26px;
  padding-top:13px;
  padding-bottom:14px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.43) 100%) !important;
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
/* 选择账号*/
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
// .contentDetail{
//   /deep/ img{
//     max-width:100%;
//   }
// }
</style>
