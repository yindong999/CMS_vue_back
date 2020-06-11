<template>
 <div>
  <a-modal title="编辑" v-model="visibleEdit" width="800px"  @cancel="closeEdit">
      <!-- 弹窗底部按钮菜单 -->
     <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="editSave" class="affirmBtn">确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="closeEdit" class="abolishBtn">取消</a-button>
				</a-config-provider>  
				</div>
			</template>
      <div v-show="spinning" style="width:100%;height:100%;position:fixed;background:#fff;opacity:0.6;left:0;top:0;z-index:99;">
        <a-spin :spinning="true" tip="上传中..." size="large" style="position:fixed;top:50%;left:50%;z-index:100;color:#3264D5;"/>
      </div>
    <!-- <a-spin :spinning="spinning" tip="上传中..."> -->
      <a-row style="margin-top:10px;">
        <a-col :span="24">
          <!-- <a-card title :bordered="false" style> -->
            <a-row class="row">
                <a-col :span="24" class="bb_title">基本信息</a-col>
            </a-row>
            <a-row class="row">
              <!-- 发布渠道： -->
              <a-col :span="4" class="col-3"><span class="red">*</span>媒体平台：</a-col>
              <a-col :span="5"> 
                <a-input disabled style="width:100%!important;color:#55565D;" placeholder="" :value="publicChannel"></a-input>
              </a-col>
              <!-- 发布账号： -->
              <a-col :span="4" v-if="showChannelName" class="col-3"><span class="red">*</span>账号名称：</a-col>
              <a-col :span="5" v-if="showChannelName"> 
                <a-input disabled style="width:100%!important;color:#55565D;" placeholder="" :value="publicAccount"></a-input>
              </a-col>
            </a-row>
            <a-row class="row" v-if="hasOther">
              <!-- 其他平台 -->
              <a-col :span="4" class="col-3"><span class="red">*</span>平台名称：</a-col>
              <a-col :span="5">
                <a-input disabled style="width:100%!important;color:#55565D;" placeholder="" v-model="otherPlateformName"></a-input>
              </a-col>
              <!-- 其他渠道名称： -->
              <a-col :span="4" class="col-3">账号名称：</a-col>
              <a-col :span="5">
                <a-input disabled style="width:100%!important;color:#55565D;" placeholder="" v-model="otherChilnelName"></a-input>
              </a-col>
            </a-row>
            <a-row class="row">
              <a-col :span="4" class="col-3"><span class="red">*</span>发布时间：</a-col>
              <a-col :span="5">
                <a-date-picker style="width:100%!important;" @change="changeData" v-model="publishTime"></a-date-picker>
              </a-col>
               <a-col :span="4" class="col-3"><span class="red">*</span>品牌：</a-col>
              <a-col :span="5">
                <a-select  style="width:100%!important;" v-model="brand">
                  <a-select-option :value="value" v-for="(value,keys,index) in allBrand" :key="index">{{value}}</a-select-option>
                </a-select>
              </a-col>
            </a-row> 
            <a-row class="row">
              <a-col :span="4" class="col-3"><span class="red">*</span>发布形式：</a-col>
              <a-col :span="5">
                <a-select  style="width:100%!important;" v-model="contentType">
                  <a-select-option :value="value" v-for="(value,keys,index) in allPublicType" :key="index">{{value}}</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="4" class="col-3"><span class="red">*</span>姓名：</a-col>
              <a-col :span="5">
                <a-input style="width:100%!important;" placeholder="姓名" v-model="creator" allowClear></a-input>
                <div v-if="showCreator" style="color:#FF6A6A;font-size:12px;position: absolute;">姓名字数不超过10</div>
              </a-col>
            </a-row>
             <a-row class="row">
              <!-- 一级部门 -->
              <a-col :span="4" class="col-3"><span class="red">*</span>部门：</a-col>
              <a-col :span="5">
                <a-select style="width:100%!important;" v-model="selectDept" @change="changeDepartment">
                  <a-select-option :value="items.id" v-for="(items,indexs) in allDepartment" :key="indexs">{{items.dataName}}</a-select-option>
                </a-select>
              </a-col>
              <!-- 二级部门 -->
              <a-col :span="5" style="margin-left:8px;">
                <a-select style="width:100%!important;" v-model="selectDept2" @change="changeDepartment2">
                  <a-select-option :value="items.dataName" v-for="(items,indexs) in allDepartment2" :key="indexs">{{items.dataName}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row class="row">
              <a-col :span="4" class="col-3"><span class="red">*</span>是否涉及版权：</a-col>
              <a-col :span="5">
                   <a-select v-model="hasCopyRight" style="width:100%!important;">
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
              </a-col>
              <a-col :span="4" class="col-3">是否kol：</a-col>
              <a-col :span="5">
                  <a-select v-model="isQol" style="width:100%!important;" defaultValue="1" >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
                  </a-select>
              </a-col>
            </a-row>
            <a-row class="row">
                <a-col :span="24" class="bb_title">内容信息</a-col>
            </a-row>
            <a-row class="row" v-if="titleShow" style="margin-bottom:23px;">
              <!-- 视频标题： -->
              <a-col :span="4" class="col-3">标题：</a-col>
              <a-col :span="15">
                <a-input style="width:97%!important;" placeholder="内容标题" v-model="completeTitle"></a-input>
                 <div v-if="showTitle" style="color:#FF6A6A;font-size:12px;position: absolute;">提示：最多输入50字</div>
              </a-col>
            </a-row>
            <a-row style="position:relative;" class="row" v-if="contentShow">
              <!-- 视频描述： -->
              <a-col :span="4" class="col-3"><span class="red">*</span>文字内容：</a-col>
              <a-col :span="15">
                <a-input
                  style="width:97%!important;"
                  type="textarea"
                  placeholder="文字内容"
                  v-model="content"
                  :autosize="autoSize"
                />
              </a-col>
            </a-row>
            <a-row class="row">
              <!-- 视频标题： -->
              <a-col :span="3"></a-col>
              <!--<a-col :span="11">-->
              <!--注：带有-->
              <!--<span class="red2">*</span> 的为必填-->
              <!--</a-col>-->
            </a-row>
            <a-row class="row" v-if="imageShow">
              <a-col :span="24">
                <a-row>
                  <!-- 上传图片： -->
                  <a-col :span="4" class="col-3">上传图片：</a-col>
                  <a-col :span="16" style="display: flex;flex-wrap: wrap;">
                    <a-upload style="width:auto;margin-right:6px;"
                      name="file"
                      listType="picture-card"
                      class="avatar-uploader"
                      :showUploadList="false"
                      :action="url.fileUpload"
                      :beforeUpload="beforeUploadImg"
                      :headers="headers"
                      :data="{'ossModuleCode':'image','channelId':selectChannelId}"
                      @change="handleChangeImg"
                    >
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                    <span v-for="(item,index) in imageSrc" :key="index" class="img_vedio" @mouseover="mouseoverImg(index)" @mouseleave="showWhichImg=-99">
                      <img style="width: 88px;height: 88px;border-radius:4px;" :src="item"  alt="">
                       <div v-if="showWhichImg===index" style="width:88px;height:88px;background:rgba(0,0,0,0.6);border-radius:4px;position:absolute;display:flex;align-items:center;justify-content:center;">
                        <img style="width: 16px;height: 12px;margin-right:12px;cursor:pointer;" src="@/assets/lookDetails.png" @click="lookDetailImg(index)" alt="">
                        <img style="width: 14px;height: 15px;cursor:pointer;" src="@/assets/deleteOne.png" @click="deleteImage(index)" alt="">
                      </div>
                      <!-- <a-icon type="close-circle" @click="deleteImage(index)" style="position: absolute;right: -8px;top: -8px;cursor: pointer" :style="{ fontSize: '18px'}"/> -->
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
                    <a-upload style="width:auto;margin-right:6px;"
                      name="file"
                      listType="picture-card"
                      class="avatar-uploader"
                      :showUploadList="false"
                      :action="url.fileUpload"
                      :beforeUpload="beforeUpload"
                      :headers="headers"
                      :data="{'ossModuleCode':'video','channelId':selectChannelId}"
                      @change="handleChange"
                    >
                      <!--<img src="@/assets/uploadVideo.png" alt srcset />-->
                      <div>
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传视频</div>
                      </div>
                    </a-upload>
                    <span v-for="(item,index) in videoSrc" :key="index" class="img_vedio">
                      <video style="width: 88px;height: 88px;border-radius:4px;" :src="item" controls = "true"></video>
                      <a-icon type="close-circle" @click="deleteVidoe(index)" style="position: absolute;right: -8px;top: -8px;cursor: pointer" :style="{ fontSize: '18px'}"/>
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
                <a-input style="width:97%!important;" placeholder="原文链接" v-model="sourceUrl"></a-input>
                <!--<span class="red">*</span>-->
              </a-col>
            </a-row>
          <!-- </a-card> -->
        </a-col>
      </a-row>
    <!-- </a-spin> -->
  </a-modal>
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
  import { baseUrl } from '@/api/manage'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { USER_INFO } from '@/store/mutation-types'
  import tooltip from "@/components/tooltip/tooltip.vue"
  import { dataDictionary, uploadVideo,channelList,saveContentReport } from '@/api/api'
  import moment from "moment"

  export default {
    name: "ReportEditModal",
    components: { tooltip },
    data () {
      return {
        message:'操作成功',
        type:'info',
        showTitle:false,
        showCreator:false,
        preImgUrl:'',
        visibleImg:false,
        showWhichImg:-99,
        selectDept2:'',
        selectDept:'',
        showChannelName:true,
        hasOther:false,//其他媒体平台，渠道名称是否显示的标志
        otherPlateformName:'',//其他媒体平台
        otherChilnelName:'', // 其他渠道名称
        isQol:"1", // 是否qol  是:0  否:1
        hasCopyRight:"1", // 是否涉及版权 hasCopyRight  是:0  否:1
        showOtherDepartmentInput:false,
        departmentName:'',
        visibleEdit: false,
        spinning: false,
        recordData:{},
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        //要编辑的模板id
        templateId:'',
        //不可编辑的渠道id
        channelId:'',
        publicChannel: null, //发布渠道的value值
        publicAccount: null, //发布账号的value值
        msg: '', // 上传视频后 或者保存成功后的消息提示
        content: '', // 文本内容
        completeTitle:'', //标题
        sourceUrl:'',//原文链接
        autoSize: {minRows: 3}, // 视频描述文本输入框的最小行数
        videoSrc: [], // 视频连接
        imageSrc: [], // 视频连接
        mediaPlate: null, // 媒体平台下拉选数据
        selectChannelId: 0,
        headers: {},
        account: null, // 账号数据
        loading: false,
        titleShow: false,
        contentShow: false,
        imageShow: false,
        videoShow: false,
        //上传视频url
        url: {
          fileUpload: baseUrl + '/cms/upload/uploadImage'
        },
        department:'',//部门
        creator:'',//姓名
        publishTime:null,//发布时间
        publishTimeStr:null,//字符串发布时间
        brand:'',//品牌
        contentType:'',//图文类型
        allDepartment2:[]
      }
    },
    props:['allDepartment','allBrand','allPublicType'],
    created () {

    },
    watch:{
      completeTitle(newVal,oldVal){
        console.log('newVal',newVal)
        if(newVal){
           var str =  newVal.indexOf(' ') === 0 ? newVal.slice(1) : newVal
            if(Array.from(str).length >50){
              this.showTitle = true
            }else{
              this.showTitle = false
            }
        }
      },
      creator(newVal,oldVal){
        this.creator = newVal?newVal.trim():''
        if(Array.from(newVal).length >10){
          this.showCreator = true
        }else{
          this.showCreator = false
        }
        }
    },
    mounted(){
      console.log('mounted')
    },
    methods: {
          // 点击图片查看触发
    lookDetailImg(e){
      this.preImgUrl = this.imageSrc[e]
      this.visibleImg = true;
    },
         // 鼠标移入图片触发
    mouseoverImg(e){
      this.showWhichImg = e
    },
       // 点击 是否涉及版权 多选按钮触发
    onChange(e){
        if(e.target.value === 'cb1'){
          this.hasCopyRight = e.target.checked?"0":"1"
        } else if(e.target.value === 'cb2'){
          this.isQol = e.target.checked?"0":"1"
        }
      },
    changeDepartment2(e){
      // 解决下拉选中的选项选中之后不显示的问题
      this.$forceUpdate();
    },
    changeDepartment(e){
        this.selectDept2 = ''
        this.allDepartment.forEach(item=>{
          if(item.id===e){
            this.allDepartment2 = item.sonListData
          }
      })
      },
      // 日期选择框
      changeData(data,dateString){
       e = data;
        this.publishTimeStr = dateString;
      },
      // 获取媒体平台下拉选数据
      getPublishChinnel() {
        channelList({userCode:Vue.ls.get(USER_INFO)['userAccount'],type:'2'}).then(res => {
          if (res.code === 200) {
            res.data.forEach(item=>{
              // if(item.mediaPlatformCode!=='wechat'&&item.mediaPlatformCode!=='sinaBlog'){
              //   this.mediaPlate.push(item)
              // }
              this.mediaPlate.push(item)
            })
          }else if(res.code!==400){
            // this.$message.error(res.message)
            this.message = res.message
            this.type = "error"
            this.warnMethod();
          }
        })
      },
      // 点击发布渠道下拉选触发
      changeChannel(e) {
        this.mediaPlate.forEach(res=>{
          if(res.mediaPlatformCode === e){
            this.account = res.channelInfoList
          }
        })
        this.publicAccount = null
        this.content = ''
        this.title = ''
        this.sourceUrl = ''
        this.videoSrc = []
        this.imageSrc = []
        console.log(e)
        if(e==='douyin'||e==='kuaishou'){
          this.contentShow = true;
          this.videoShow = true;
          this.titleShow = true;
          this.imageShow = false;
        }else if(e==='guanwang'){
          this.contentShow = true;
          this.imageShow = true;
          this.titleShow = true;
          this.videoShow = false;
        }else if(e==='toutiao'||e==='chuizhimeiti'||e==='xinwenmeiti'){
          this.contentShow = true;
          this.titleShow = true;
          this.imageShow = true;
          this.videoShow = false;
        }else{
          this.contentShow = true;
          this.videoShow = true;
          this.titleShow = true;
          this.imageShow = true;
        }
      },
      //视频上传限制
      beforeUpload(file) {
        // 限制视频大小
        // const isLt100M = file.size / 1024 / 1024 < 100
        // if (!isLt100M) {
        //   this.$message.error('上传视频大小不能超过100MB哦!')
        //   return false
        // }
        // 限制视频格式
        var vt = [
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb',
          'video/mp4',
          'video/mpg',
          'video/mpeg',
          'video/mov',
          'video/ram',
          'video/x-ms-wmv',
          'audio/ogg',
        ]
        console.log(file.type)
        var result = vt.find(element => element === file.type)
        if (!result) {
          // this.$message.error('请上传正确的视频格式')
          this.message = "请上传正确的视频格式"
          this.type = "error"
          this.warnMethod();
          return false
        }
      },
      beforeUploadImg(file){
        // 限制图片格式
        var vt = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/tif',
          'image/pcx',
          'image/svg',
          'image/psd',
          'image/cdr',
          'image/ai'
        ]
        var result = vt.find(element => element === file.type)
        if (!result) {
          // this.$message.error('请上传正确的图片格式')
          this.message = "请上传正确的图片格式"
          this.type = "error"
          this.warnMethod();
          return false
        }
      },
      // 上传视频
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.spinning = true
          return
        }
        if (info.file.status === 'done') {
          if (info.file.response.code === 200) {
            this.spinning = false
            this.videoSrc.push(info.file.response.data.imgUrl)
            this.msg = '上传成功，请保存'
            this.disabled = false
            // this.$message.success(`${info.file.name} 上传成功，请保存。`)
            this.message = "上传成功"
            this.type = "info"
            this.warnMethod();
          } else {
            this.spinning = false
            // this.$message.error(`${info.file.name} 上传失败.`)
            this.message = info.file.response.message
            this.type = "error"
            this.warnMethod();
          }
        } else if (info.file.status === 'error') {
          this.spinning = false
          // this.$message.error(`${info.file.name} 上传失败.`)
          this.message = info.file.response.message
          this.type = "error"
          this.warnMethod();
        }
      },
      handleChangeImg(info){
        if (info.file.status === 'uploading') {
          this.spinning = true
          return
        }
        if (info.file.status === 'done') {
          if (info.file.response.code === 200) {
            this.spinning = false
            this.imageSrc.push(info.file.response.data.imgUrl)
            this.msg = '上传成功，请保存'
            this.disabled = false
            // this.$message.success(`${info.file.name} 上传成功，请保存。`)
            this.message = "上传成功"
            this.type = "info"
            this.warnMethod();
          } else {
            this.spinning = false
            // this.$message.error(`${info.file.name} 上传失败.`)
            this.message = info.file.response.message
            this.type = "error"
            this.warnMethod();
          }
        } else if (info.file.status === 'error') {
          this.spinning = false
          // this.$message.error(`${info.file.name} 上传失败.`)
          this.message = info.file.response.message
          this.type = "error"
          this.warnMethod();
        }
      },
      // 删除图片触发
      deleteImage(index){
        this.imageSrc.splice(index,1)
        if(this.imageSrc.length === 0){
         this.showWhichImg = -99
        }
        this.message = "删除成功"
        this.type = "info"
        this.warnMethod();
      },
      // 删除视频触发
      deleteVidoe(index){
        this.videoSrc.splice(index,1)
        this.message = "删除成功"
        this.type = "info"
        this.warnMethod();
      },
      edit (record) {
       if(record.deptName){
          var departArr = record.deptName.split('_')
            this.allDepartment.forEach(item=>{
              if(item.dataName===departArr[0]){
                 this.selectDept = item.id
                 this.allDepartment2 = item.sonListData
              }
            })
          this.selectDept2 = departArr[1]

      }

        this.hasCopyRight =  record.hasCopyRight === '是' ? '0' : '1';
        this.isQol = record.isQol === '是' ? '0' : '1';
        this.departmentName = record.deptName

        this.visibleEdit = true;
        const token = Vue.ls.get(ACCESS_TOKEN)
        const id = Vue.ls.get(USER_INFO).id
        this.headers = { authorization: token, uuss: id }
        this.videoSrc = [];
        this.imageSrc = [];
        this.mediaPlate = []
        //给各个字段赋值回显
        this.templateId= record.templateId
        this.channelId= record.channelId
        this.publicChannel= record.channelPlatform
        this.publicAccount= record.channelName
        this.content= record.contentProfile
        // this.completeTitle=record.completeTitle?record.completeTitle:Array.from(record.contentProfile).length>10?record.contentProfile.substr(0,10):record.contentProfile
        this.completeTitle=record.completeTitle?record.completeTitle:record.titles
        this.sourceUrl=record.sourceUrl
        // this.department=record.deptName
        this.creator=record.responsible
        this.publishTimeStr=record.publishDate
        this.publishTime=(record.publishDate!==null&&record.publishDate!=='')?moment(record.publishDate, 'YYYY-MM-DD'):null
        this.brand=record.brand
        this.contentType=record.publishForm
        this.imageSrc = (record.imagePath!==''&&record.imagePath!==null)?record.imagePath.split(','):[]
        this.videoSrc = (record.mediaPath!==''&&record.mediaPath!==null)?record.mediaPath.split(','):[]
        //判断媒体平台显示不同的字段
        this.contentShow = false;
        this.videoShow = false;
        this.titleShow = false;
        this.imageShow = false;
        if(record.channelPlatform.indexOf('抖音')!==-1 ||record.channelPlatform.indexOf('快手')!==-1){
          this.contentShow = true;
          this.videoShow = true;
          this.titleShow = false;
          this.imageShow = false;
        }else if(record.channelPlatform.indexOf('官网')!==-1){
          this.contentShow = true;
          this.imageShow = true;
          this.titleShow = true;
          this.videoShow = false;
        }else if(record.channelPlatform.indexOf('头条')!==-1||record.channelPlatform.indexOf('垂直媒体')!==-1||record.channelPlatform.indexOf('新闻媒体')!==-1){
          this.contentShow = true;
          this.titleShow = true;
          this.imageShow = true;
          this.videoShow = false;
        }else{
          this.contentShow = true;
          this.videoShow = true;
          this.titleShow = true;
          this.imageShow = true;
        }
        //暂定媒体平台和渠道不可编辑
        // 获取媒体平台下拉选数据
        // this.getPublishChinnel()
     if(record.channelId === '-2'){
        this.publicChannel = '微信朋友圈'
        this.showChannelName = false
        this.hasOther = true
      }else if(record.channelId === '-1'){
        this.showChannelName = false
        this.publicChannel = '其它媒体平台'
        this.hasOther = true
      }else{
        this.hasOther = false
        this.showChannelName = true
      }
        this.otherPlateformName = record.channelPlatform
        this.otherChilnelName = record.channelName
      },
      close () {
        this.$emit('close');
        this.visibleEdit = false;
        this.hasOther = false
        this.showOtherDepartmentInput = false;
      },
      //编辑关闭
      closeEdit(){
        this.hasCopyRight = '1'
        this.isQol = '1'
        this.close();
      },
      // 校验必填项
      validateData(){
        var result = true;
        if(!this.publishTime){
          result = false
          // this.$message.warning('请选择发布时间');
          this.message = "请选择发布时间"
          this.type = "error"
          this.warnMethod();
        }else if(!this.brand){
          result = false
          // this.$message.warning('请选择品牌');
          this.message = "请选择品牌"
          this.type = "error"
          this.warnMethod();
        }else if(!this.contentType){
          result = false
          // this.$message.warning('请选择发布形式');
          this.message = "请选择发布形式"
          this.type = "error"
          this.warnMethod();
        }else if(!this.creator){
          result = false
          // this.$message.warning('请填写姓名');
          this.message = "请填写姓名"
          this.type = "error"
          this.warnMethod();
        }else if(!this.selectDept){
          result = false
          // this.$message.warning('请选择部门');
          this.message = "请选择部门"
          this.type = "error"
          this.warnMethod();
        }else if(!this.selectDept2){
          result = false
          // this.$message.warning('请选择部门');
          this.message = "请选择部门"
          this.type = "error"
          this.warnMethod();
        }else if(!this.content){
          result = false
          // this.$message.warning('请填写文字内容');
          this.message = "请填写文字内容"
          this.type = "error"
          this.warnMethod();
        }
        return result
      },
      warnMethod(){
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel() 
        },3000)
      },
      //编辑保存
      editSave(){
        if(this.validateData()&&!this.showTitle&&!this.showCreator){
          var oneDep = ''
        this.allDepartment.forEach(item=>{
          if(item.id===this.selectDept){
            oneDep = item.dataName
          }
        })
        let param={
          "articleVoList": [
            {
              "author": "",
              "bindText": "",
              "content": this.content,
              "digest": "",
              "imagePath": this.imageSrc.length>0?this.imageSrc.join():'',
              "mediaPath": this.videoSrc.length>0?this.videoSrc.join():'',
              "title": this.completeTitle?this.completeTitle:'',
              "url": this.sourceUrl
            }
          ],
          "channelId": [this.channelId],
          "openFlag": 0,
          "templateId": [this.templateId],
          "templateName": "",
          "templateRankCode": "",
          "templateType": "news",
          "publishTime":this.publishTimeStr,
          "departmentName": oneDep + '_' + this.selectDept2,
          "reportName": this.creator,
          "brand": this.brand,
          "publishTimeReport": this.publishTimeStr,
          "publishForm": this.contentType,
          "hasCopyRight": this.hasCopyRight,
          "isQol": this.isQol,
          "isContentReport":true
        }
        console.log(param)
        saveContentReport(param).then(res=>{
          console.log(res)
          if(res.code===200){
            // this.$message.success('操作成功')
            this.message = "修改成功"
            this.type = "info"
            this.warnMethod();
            this.$emit('ok');
          }else if(res.code!==400){
            // this.$message.error(res.message)
            this.message = res.message
            this.type = "error"
            this.warnMethod();
          }
        }).finally(() => {
          this.close();
        })
        }
      },
    }
  }
</script>

<style lang='scss' scoped>
  .hidden {
    display: none;
  }
  .red {
    color: red;
    margin-left: 10px;
  }
  .red2 {
    color: red;
  }
  .row {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
  }
  .upload-list-inline >>> .ant-upload-list-item {
    float: left;
    width: 200px !important;
    margin-right: 8px;
  }
  .ant-upload-list-item {
    width: 200px !important;
  }
  .upload-list-inline >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  .upload-list-inline >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
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
  margin: 0 14px 8px 0px;
  border: 1px dashed #DFE0EB;
  position: relative;
} 
</style>