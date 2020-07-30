<template>
  <!-- 这是消息列表页 -->
  <div>
    <a-card :bordered="false" title="" style="margin:0 auto;margin-top:0px;" :bodyStyle="bodyStyle" :headStyle="headStyle2">
      <!-- 输入框，查询按钮 -->
      <a-row style="display:flex;align-items:center;" :gutter="16">
        <a-col>标题</a-col>
        <a-col>
          <a-input placeholder="请输入内容标题" style="200px" allowClear v-model="queryParams" />
        </a-col>
        <a-col class="col" style="position:absolute;right:0;">
          <a-button type="primary" @click="query">
            <img src="@/assets/searchImg.png" style="width:14px;height:14px;position: relative;top: -1px;right: 6px;" alt="">
             查询
          </a-button>
        </a-col>
      </a-row> 
      </a-card>
     <a-card title="消息明细表" :bordered="false" style="margin:0 auto;margin-top:16px;" :headStyle="headStyle" :bodyStyle="bodyStyle2">
      <!-- 全部，已读，未读，标记为已读按钮 -->
        <a-button v-if="authButton.hasOwnProperty('markHasReadBtn')&&authButton.markHasReadBtn&&which!==2" slot="extra" type="primary" @click="markRead">标记为已读</a-button>
        <a-row style="margin-bottom:16px;">
          <a-col :span="21">
            <a-button :class="['btn',which===1?'current':'noSelect']" @click="msgState(1,'')">全部({{totalAnnouncement}})</a-button>
            <a-button :class="['btn',which===2?'current':'noSelect']" @click="msgState(2,'1')">已读({{countAlreadyRead}})</a-button>
            <a-button :class="['btn',which===3?'current':'noSelect']" @click="msgState(3,'0')">未读({{unRead}})</a-button>
          </a-col> 
      </a-row>
      <a-row class="row">
        <a-col :span="24">
           <!-- 表格 -->
          <a-table
            style="height:500px;"
            ref="table"
            size="small"
            :bordered="bordered"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
          > 
            <span slot="titile" slot-scope="text, record">
              <a-popover title trigger="hover">
                <template slot="content">
                  <p style="maxWidth:300px;word-break:break-all;">{{record.titile}}</p>
                </template>
                <a
                  class="mouseHover" style="width:150px;"
                  onmouseover="this.style.color='#3264D5';"
                  onmouseout="this.style.color='#595959';"
                >{{record.titile}}</a>
              </a-popover>
            </span>
            <span slot="msgContent" slot-scope="text, record">
              <a-popover title trigger="hover">
                <template slot="content">
                  <p style="maxWidth:300px;word-break:break-all;">{{record.msgContent}}</p>
                </template>
                <a
                  class="mouseHover"   style="min-width:200px"
                  onmouseover="this.style.color='#3264D5';"
                  onmouseout="this.style.color='#595959';"
                >{{record.msgContent}}</a>
              </a-popover>
            </span>
            <span slot="readFlag" slot-scope="text, record">
              {{record.readFlag==='0'?'未读':'已读'}}
            </span>
            <span slot="action" slot-scope="text, record">
              <a v-if="authButton.hasOwnProperty('reviewBtn')&&authButton.reviewBtn" @click="lookMore(record)">查看</a>
              <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <!-- <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" title="确定删除吗?" @confirm="() => deleteOneMsg(record.id)"> -->
                <a style="margin-left:10px;">删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-card>
   
    <!--消息详情页 -->
    <a-modal title="消息详情" :footer="null" v-model="visible" okText="确认" cancelText="取消">
      <p>
        <span>发布人：{{msg.sender?msg.sender:'--'}}</span>
        <span style="margin-left:20px;">发布时间：{{msg.sendTime?msg.sendTime:'--'}}</span>
      </p>
      <p v-html="msg.msgContent" style="white-space:pre-line;"></p>
    </a-modal> 
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </div>
</template>
<script>
  import Vue from "vue"
  import { USER_AUTH } from "@/store/mutation-types"
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { alertMsgState, readAll } from '@/api/api' 
import tooltip from "@/components/tooltip/tooltip.vue"
export default {
  mixins: [JeecgListMixin],
  data() {
    return { 
      bordered:false,
      message:'操作成功',
      type:'info', 
      unRead:0,
      totalAnnouncement:0,
      countAlreadyRead:0,
      which:3,
      headStyle:{
        borderBottom:'none',
        textAlign:'center',
      },
      headStyle2:{
        height:'46px',
        display:'flex'
      },
      bodyStyle:{
        paddingTop:'20px',
        paddingBottom:'23px',
      },
      bodyStyle2:{
        paddingTop:'0px',
      },
      //按钮权限，默认拥有全部权限
      authButton:{
        readBtn: true,
        reviewBtn: true,
        markHasReadBtn: true,
        deleteBtn: true
      },
      queryParams: '', //输入框的内容
      msg: {}, // 某一条消息的数据
      anntIds: '', // 所有选中的消息的anntid
      visible: false,
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      selectedRowKeys: [], // 添加这个属性, 也就是他管理着选中行
      selectedRows: [],
      columns: [
        {
          title: '标题',
          align: 'center',
          dataIndex: 'titile',
          scopedSlots: { customRender: 'titile' },
          className: 'table_title',
          width:100
        },
        {
          title: '消息类型',
          align: 'center',
          dataIndex: 'message_type',
          className: 'table_title',
          width:100
        },
        {
          title: '内容',
          align: 'center',
          dataIndex: 'msgContent',
          className: 'table_title',
          width:100,
          scopedSlots: { customRender: 'msgContent' }
        },
        {
          title: '发布人',
          align: 'center',
          dataIndex: 'sender',
          className: 'table_title',
          width:120
        },
        {
          title: '发布时间',
          align: 'center',
          dataIndex: 'sendTime',
          className: 'table_title',
          width:150
        },
        {
          title: '阅读状态',
          align: 'center',
          dataIndex: 'readFlag',
          className: 'table_title',
          scopedSlots: { customRender: 'readFlag' },
          width:100
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operate',
          className: 'table_title',
          width:100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      url: {
        list: '/cms/announcement/send/getMyAnnouncementSend',
        delete:'/cms/announcement/send/deleteFlag'
      }
    }
  }, 
  components:{ tooltip }, 
  created() {
    // readFlag: '1' 已读； '0' 未读； ''  全部
    this.queryParam['readFlag'] = '0'
  },
  mounted(){
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if(auth.hasOwnProperty(this.$route.name)){
      this.authButton = auth[this.$route.name]
    }
    //   setTimeout(() => {
    //       var dom = document.getElementsByClassName("ant-table-small")[0]
    //       var dom2 = document.getElementsByClassName("ant-table-selection-column")[0]
    //       dom.style.border= "none"
    //       dom2.style.background= "#F7F7FB"
    // }, 200);

  },
  methods: { 
    // 点击全部，已读，未读  触发
    msgState(flag,readFlag){
      this.which = flag
      this.queryParam['readFlag'] = readFlag
      this.searchQuery()
    }, 
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.options = {
        rowSelection: {
          selectedRowKeys: selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
      var str = ''
      selectedRows.forEach(element => {
        str += element.anntId + ','
      })
      var str2 = str.substring(0, str.length - 1)
      this.anntIds = str2
    },
    // 点击标记为已读按钮触发
     markRead() { 
      if(!this.anntIds){
        this.message = "请先选择需要标记的消息"
        this.type = "error"
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel()
        },3000)
        return 
      }
      readAll({ anntIds: this.anntIds }).then(res => {
        this.selectedRowKeys = []
        // 请求成功
        if(res.code===200){
          if (res.message === '全部已读') {
            // this.$message.success('标记已读成功')
            this.message = "操作成功"
            this.$refs.tooltip.visible = true
            this.$refs.tooltip.alertVisible = true
            setTimeout(()=>{
              this.$refs.tooltip.cancel() 
            },3000)
            this.searchQuery()
          }
        }else if(res.code!==400){
          // 请求失败
            // this.$message.error(res.message)
            this.message = "操作失败"
            this.type = "error"
            this.$refs.tooltip.visible = true
            this.$refs.tooltip.alertVisible = true
            setTimeout(()=>{
              this.$refs.tooltip.cancel() 
            },3000)
        }
      })
    },
    // 点击查询按钮触发
    query() { 
      if (this.queryParams) {
        this.queryParam['titile'] = this.queryParams
        this.loadData()
      } else {
        this.queryParam = {
          page: 1,
          size: 15
        }
        this.loadData()
      }
    },
    // 点击查看触发
    lookMore(e) {
      if (e.readFlag === '未读') {
        let s = JSON.stringify({ anntIds: e.anntId })
        readAll(s).then(res => {
          if (res.code === 200 && res.message === '全部已读') {
            this.loadData()
          }else if(res.code!==400){
            this.$message.error(res.message)
          }
        })
      }
      this.msg = e
      this.visible = true
    }
  }
}
</script>
<style lang='scss' scoped>
.top {
  background: #fff;
}
.row {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.col {
  text-align: right;
}
.btn {
  margin-right: 10px; 
}
.current{
    background:#3264D5;
    color:#fff;
}
.noSelect{
  border:none;
  box-shadow:0px 1px 6px 0px rgba(0,0,0,0.15);
}
</style>