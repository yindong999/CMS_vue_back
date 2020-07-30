<template>
  <div>
    <a-card :bordered="false" :hoverable="true" title="" style="margin-bottom: 12px;">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="searchQuery" class="formStyle">
          <a-row class="leftDiv">
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">媒体平台</span>
               <a-select
                  style="width:calc(100% - 97px);margin-left: 16px;"
                  :showSearch="true"
                  v-model="queryParam.channelPlatform"
                  placeholder="请选择媒体平台" allowClear
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(item,key) in platformData"
                    :value="item.label"
                    :key="key"
                  >{{item.label}}</a-select-option>
                </a-select>
            </a-col>
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">渠道级别</span>
                <a-select
                  style="width:calc(100% - 97px);margin-left: 16px;"
                  :showSearch="true"
                  v-model="queryParam.channelLevel"
                  placeholder="请选择渠道级别" allowClear
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(item,key) in rankData"
                    :value="item.label"
                    :key="key"
                  >{{item.label}}</a-select-option>
                </a-select>
            </a-col>
              <a-col style="display:flex;align-items:center;" :span="8">
                <span class="textWidth4">渠道名称</span>
                  <a-input style="width:calc(100% - 97px);margin-left: 16px;" v-model="queryParam.channelName" placeholder="请输入渠道名称" allowClear></a-input>
              </a-col>
          </a-row>
              <div class="btnCol" style="width:170px;">
						   <a-button @click="searchQuery" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					  </div>
          <!-- <a-row style="margin-top:8px;" type="flex" justify="end">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
          </a-row> -->
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" :hoverable="true" title="流程列表" :headStyle="headStyle" :bodyStyle="bodyStyles">
      <!-- 操作按钮区域 -->
        <a-button
          slot="extra"
          v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn"
          @click="addConfig"
          type="primary"
          icon="plus"
          style="padding:0 16px;position:absolute;right:32px;"
        >新增</a-button>
      <div>
        <a-table
          style="height:500px;width:100%;"
          ref="table"
          size="small"
          :bordered="bordered"
          rowKey="configId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
          <span slot="editorname" slot-scope="text, record">
            <span v-if="!record.editorname"></span>
            <span v-else v-for="(item,index) in record.editorname.split(',')" :key="index">
              {{item}}
              <br />
            </span>
          </span>
          <span slot="reviewername" slot-scope="text, record">
            <span v-if="!record.reviewername"></span>
            <span v-else v-for="(item,index) in record.reviewername.split(',')" :key="index">
              {{item}}
              <br />
            </span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" @click="editConfig(record)" style="color:#3264D5;margin-right:14px;">编辑</a>
            <!-- <a-divider v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" type="vertical" /> -->
            <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" title="确定删除吗?" @confirm="() => handleDelete(record.configId)">
              <a style="color:#3264D5">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
      <!-- 新增配置信息 -->
      <create-config-modal ref="addConfigModal" @ok="modalFormOk"></create-config-modal>
    </a-card>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>
<script>
import Vue from "vue"
import { USER_AUTH } from "@/store/mutation-types"
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CreateConfigModal from './modules/CreateConfigModal'
import { dataDictionary } from '@/api/api'
import tooltip from "@/components/tooltip/tooltip.vue"
export default {
  name: 'Configuration',
  mixins: [JeecgListMixin],
  components: { CreateConfigModal,tooltip },
  data() {
    return {
      bordered:false,
      message:'操作成功',
      type:'info',
      headStyle:{
        "text-align":"center",
        "border-bottom":"none" 
      },
      bodyStyles:{
        paddingTop:'0'
      },
      //按钮权限，默认拥有全部权限
      authButton:{
        editBtn: true,
        createBtn: true,
        deleteBtn: true,
      },
      description: '流程配置',
      queryParam: {},
      //媒体平台
      platformData: [],
      //媒体级别
      rankData: [],
      // 表头
      columns: [
//         {
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
          title: '媒体平台',
          align: 'center',
          width: 150,
          dataIndex: 'channelPlatform',
          className:'table_title'
        },
        {
          title: '渠道名称',
          align: 'center',
          width: 200,
          dataIndex: 'channelName',
          className:'table_title'
        },
        {
          title: '渠道级别',
          align: 'center',
          width: 100,
          dataIndex: 'channelLevel',
          className:'table_title'
        },
        {
          title: '内容编辑者',
          align: 'center',
          width: 200,
          dataIndex: 'editorname',
          scopedSlots: { customRender: 'editorname' },
          className:'table_title'
        },
        {
          title: '内容审核者',
          align: 'center',
          width: 200,
          dataIndex: 'reviewername',
          scopedSlots: { customRender: 'reviewername' },
          className:'table_title'
        },
        {
          title: '更新时间',
          align: 'center',
          width: 150,
          dataIndex: 'updateTime',
          className:'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action' },
          className:'table_title'
        }
      ],
      dataSource: [],
      url: {
        list: '/cms/process/config/processConfigList',
        delete: '/cms/process/config/delete'
      }
    }
  },
  computed: {},
  mounted() {
    //初始化时先加载全部媒体平台和渠道等级用于下拉筛选
    this.getChannel()
    this.getPlatformData()
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if(auth.hasOwnProperty(this.$route.name)){
      this.authButton = auth[this.$route.name]
    }
    // setTimeout(()=>{
    //   var dom = document.getElementsByClassName("ant-table-small")[0]
    //   dom.style.border= "none"
    // },200)
  },
  methods: {
    //获取全部角色数据
    getChannel() {
      this.rankData = []
      dataDictionary({ dataType: 'commentLevel' }).then(res => {
        if(res.code===200){
          for (let label in res.data) {
            let opt = {}
            opt['label'] = res.data[label]
            opt['value'] = label
            this.rankData.push(opt)
          }
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethods();
        }
      })
    },
    //获取全部部门数据
    getPlatformData() {
      this.platformData = []
      dataDictionary({ dataType: 'mediaPlatform' }).then(res => {
        if(res.code===200){
        for (let label in res.data) {
          let opt = {}
          opt['label'] = res.data[label]
          opt['value'] = label
          this.platformData.push(opt)
        }
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethods();
        }
      })
    },
    //新增弹框
    addConfig() {
      this.$refs.addConfigModal.create()
    },
    //编辑弹框
    editConfig(record) {
      this.$refs.addConfigModal.edit(record)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>