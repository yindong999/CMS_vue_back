<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    :bodyStyle="bodyStyle"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;overflow-y: hidden"
  >
      <!-- 弹窗底部按钮菜单 -->
     <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="handleOk" class="affirmBtn">确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="handleCancel" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>
    <a-spin :spinning="confirmLoading">
      <a-row class="lin30" :gutter="16">
        <a-col :span="4" class="textRight">内容发布渠道</a-col>
        <a-col :span="20">
          <a-select
            style="width: 400px"
            :showSearch="true"
            :filter-option="filterOption"
            allowClear
            v-model="selectChannel.code"
            @change="changeChannel"
          >
            <!--<a-select-opt-group>-->
            <!--<span slot="label"><a-icon type="wechat" />微信</span>-->
            <!--<a-select-option v-for="(item,key) in wechatData" :value="item.id" :key="key">{{item.channelName}}</a-select-option>-->
            <!--</a-select-opt-group>-->
            <!--<a-select-opt-group >-->
            <!--<span slot="label"><a-icon type="weibo" />微博</span>-->
            <!--<a-select-option v-for="(item,key1) in weiboData" :value="item.id" :key="key1">{{item.channelName}}</a-select-option>-->
            <!--</a-select-opt-group>-->
            <a-select-option
              v-for="(item,key) in allData"
              :value="item.id"
              :key="key"
            >{{item.channelName}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row class="lin30" :gutter="16">
        <a-col :span="4" class="textRight">内容编辑者</a-col>
        <a-col :span="20">
          <a-select
            :showSearch="true"
            v-model="selectEditor"
            mode="multiple"
            :showArrow="true"
            allowClear
            style="width: 400px"
            @change="changeEditor"
          >
            <a-select-option
              v-for="(item,key) in editorData"
              :value="item.userId"
              :key="key"
            >{{item.userName}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row class="lin30" :gutter="16">
        <a-col :span="4" class="textRight">内容审核者</a-col>
        <a-col :span="20">
          <span v-for="(item,index) in auditorArray" :key="index" style="display:inline-block;margin-bottom: 10px">
            <a-icon type="swap-right" class="iconSwap" v-show="item.icon" />
            <a-select style="width: 150px" :showSearch="true" v-model="item.id">
              <a-select-option
                v-for="(value,key1) in auditorData"
                :value="value.userId"
                :key="key1"
              >{{value.userName}}</a-select-option>
            </a-select>
          </span>
          <a-button class="marginRight10" @click="deleteNum">删除</a-button>
          <a-button class @click="addNum" type="primary">添加</a-button>
        </a-col>
      </a-row>
    </a-spin>
     <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </a-modal>
</template>

<script>
import tooltip from "@/components/tooltip/tooltip.vue"
import { thirdPublishChannelList, getEditorList, saveProcessConfig, updateProcessConfig } from '@/api/api'
// import moment from "moment"
export default {
  name: 'CreateConfigModal',
  components:{ tooltip },
  data() {
    return {
      message:'操作成功',
      type:'info',
      bodyStyle:{
          height:'70vh!important'
      },
      id: '',
      title: '新增',
      visible: false,
      roleDisabled: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      //全部渠道数据
      allData: [],
      //微博渠道
      weiboData: [],
      //微信渠道
      wechatData: [],
      //编辑者数据
      editorData: ['11', '22'],
      //审核者数据
      auditorData: [],
      //审核者下拉框数组
      auditorArray: [{ id: '', icon: false }],
      //审核者数量
      // auditorNum:1
      //选中的发布渠道
      selectChannel: {
        code: '',
        name: ''
      },
      //选中的编辑者
      selectEditor1:'',
      // selectEditor1: {
      //   code: '',
      //   name: ''
      // }
      selectEditor:[]
    }
  },
  created() {
    this.id = ''
  },
  mounted() {},
  methods: {
     warnMethod(){
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel() 
        },3000)
      },
    //重置
    reset() {
      this.selectChannel = {
        code: '',
        name: ''
      }
      this.selectEditor =  []
      // this.selectEditor = {
      //   code: '',
      //   name: ''
      // }
      this.auditorArray = [{ id: '', icon: false }]
    },
    //渠道变化
    changeChannel(val) {
      //获取渠道名称
      let opt = {}
      opt = this.allData.find(item => {
        return item.id === val
      })
      this.selectChannel['name'] = opt['channelName']
      //联动获取编辑和审核用户
      this.getUser(val)
    },
    //编辑者变化
    changeEditor(val) {
      console.log("val:",val )
      this.selectEditor1 = val.join(',')
      //  console.log("selectEditor:", this.selectEditor )
      //获取编辑者名称
      // let opt = {}
      // opt = this.editorData.find(item => {
      //   return item.userId === val
      // })
      // this.selectEditor['name'] = opt['userName']
    },
    //获取内容编辑者和审核者
    getUser(value) {
      this.editorData = []
      this.auditorData = []
      // return
      getEditorList({ channelid: value }).then(res => {
        console.log('res', res)
        if (res.code === 200) {
          res.data.forEach(item => {
            if (item.role.indexOf('前台编辑') !== -1) {
              this.editorData.push(item)
            } else if (item.role.indexOf('后台审核') !== -1) {
              this.auditorData.push(item)
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
    //获取渠道名称
    getChannel() {
      this.wechatData = []
      this.weiboData = []
      this.allData = []
      thirdPublishChannelList({ page: 1, size: 1000 }).then(res => {
        if (res.code === 200) {
          // res.data.list.forEach(item=>{
          //   if(item.channelPlatformCode==='wechat'){
          //     //微信公众号数据
          //     this.wechatData.push(item)
          //   }else if(item.channelPlatformCode==='sinaBlog'){
          //     //微博号数据
          //     this.weiboData.push(item)
          //   }
          // })
          this.allData = res.data.list
          this.allData.map(item => {
            item['channelName'] = item['channelPlatform'] + '-' + item['channelName']
          })
          // //微信公众号数据
          // this.wechatData = res.data['1']
          // //微博号数据
          // this.weiboData = res.data['2']
          // //全部数据集合
          // this.allData = this.wechatData.concat(this.weiboData)
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //删除一个审核者
    deleteNum() {
      if (this.auditorArray.length >= 2) {
        this.$delete(this.auditorArray, this.auditorArray.length - 1)
      }
    },
    //添加一个审核者
    addNum() {
      if (this.auditorArray.length >= 1) {
        this.auditorArray.push({ id: '', name: '', icon: true })
      }
    },

    create() {
      this.visible = true
      this.id = ''
      this.getChannel()
    },
    edit(record) {
      console.log("record:",record)
      this.visible = true
      this.title = '编辑'
      this.getChannel()
      this.getUser(record.channelId)
      this.id = record.configId
      // setTimeout(() => {
        this.selectChannel['name'] = record.channelName
        this.selectChannel['code'] = record.channelId
        // this.selectEditor['name'] = record.editorname
        this.selectEditor = record.editorId.split(',')
        // this.selectEditor1.name = record.editorname.split(',')

        let reviewerCodeArray = record.reviewerid.split(',')
        if (reviewerCodeArray.length > 0) {
          this.auditorArray = []
        }
        reviewerCodeArray.forEach((value, index) => {
          var opt = {}
          opt['id'] = value
          opt['icon'] = index===0?false:true
          // if (index === 0) {
          //   opt['icon'] = false
          // } else {
          //   opt['icon'] = true
          // }
          this.auditorArray.push(opt)
        })
            console.log("  this.auditorArray:",  this.auditorArray)
      // }, 500)

    },
    close() {
      this.$emit('close')
      this.visible = false
      this.reset()
    },
    handleOk() {
      const that = this

      //获取审核者名称,将审核者名称和code分别拼接成字符串
      // let auditorNameArray=[]
      let auditorCodeArray = []
      // let auditorNameStr = ''
      let auditorCodeStr = ''
      this.auditorArray.forEach(item => {
        //没选择数据的审核者下拉框去掉
        if (item.id !== '') {
          auditorCodeArray.push(item.id)
          // let opt = this.auditorData.find(value=>{
          //   return value.id === item.id
          // })
          // auditorNameArray.push(opt.userName)
        }
      })

      // auditorNameStr = auditorNameArray.join()
      auditorCodeStr = auditorCodeArray.join()
      this.selectEditor1 = this.selectEditor.join()
      if (!this.selectChannel.code || !this.selectEditor1 || auditorCodeArray.length === 0) {
        // that.$message.warning('请正确填写信息')
        this.message = "请正确填写信息"
        this.type = "error"
        this.warnMethod();
        return
      }
      let obj
      let param = {
        channelId: this.selectChannel.code,
        // channelName: this.selectChannel.name,
        editorId: this.selectEditor1,
        // editorName: this.selectEditor.name,
        reviewerId: auditorCodeStr
        // reviewerName: auditorNameStr,
        // updateTime: moment(new Date())
      }
     console.log("选择渠道：",this.selectChannel.code)
      console.log('编辑者：',this.selectEditor)
      console.log("reviewerId:",auditorCodeStr)
          // return
      if (this.id !== '') {
        param['configId'] = this.id
        obj = updateProcessConfig(param)
      } else {
        obj = saveProcessConfig(param)
      }
         that.confirmLoading = true
      obj
        .then(res => {
          if (res.code === 200) {
            // that.$message.success(res.message)
            if(this.id){
                this.message = "修改成功"
              }else{
                this.message = "新增成功"
              }
              this.type = "info"
              this.warnMethod();

            this.selectEditor = []
            that.$emit('ok')
          } else if(res.code!==400){
            // that.$message.error(res.message) 
              this.message = res.message 
              this.type = "error"
              this.warnMethod();
          }
        })
        .finally(() => {
          that.confirmLoading = false
          that.close()
        })
    },
    handleCancel() {
      this.close()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.indexOf(input) >= 0
      );
    },
  }
}
</script>

<style scoped>
.lin30 {
  line-height: 30px;
  margin-bottom: 20px;
}
.textRight {
  text-align: right;
}
.marginRight20 {
  margin-right: 20px;
}
.marginRight10 {
  margin: 0 10px;
}
.iconSwap {
  font-size: 20px;
  margin: 0 10px;
}
</style>