<template>
<!-- 物料下载明细页面 -->
  <div>
    <a-card title="">
      <a-row>
        <a-form :labelCol="{span:7}" :wrapperCol="{span:17}" @keyup.enter.native="searchQuery">
          <a-row type="flex" :gutter="24" style="display:flex;align-items:center;">
            <a-col>活动节点</a-col>
            <a-col :md="4" :sm="6">
              <!-- <a-select allowClear placeholder="请选择活动节点" v-model="queryParam.activeNode" @change="selectNode"> -->
              <a-select allowClear placeholder="请选择活动节点" v-model="activeNodeId" @change="selectNode">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="value.id" v-for="(value,index) in activeNode" :key="index">
                     {{value.dataName}}
                  </a-select-option>
                </a-select>
            </a-col>
            <a-col>物料类型</a-col>
            <a-col :md="4" :sm="6">
               <!-- <a-select allowClear placeholder="请选择物料类型" v-model="queryParam.materialType" @change="selectType"> -->
               <a-select allowClear placeholder="请选择物料类型" v-model="materialTypeId" @change="selectType">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="value.id" v-for="(value,index) in materialType" :key="index">
                     {{value.dataName}}
                  </a-select-option>
                </a-select>
            </a-col>
            <a-col>物料名称</a-col>
            <a-col :md="4" :sm="6">
              <a-input allowClear placeholder="请输入物料名称" v-model="materialNameId"></a-input>
            </a-col>
            <a-col>下载工贸</a-col>
            <a-col :md="4" :sm="6">
              <a-select v-model="queryParam.downloadIndustryAndTradeId" allowClear placeholder="请选择下载工贸" style="width:100%;">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="value.value" v-for="(value,index) in departmentData" :key="index">
                      {{value.label}}
                  </a-select-option>
                </a-select>
            </a-col>
          </a-row>
        </a-form>
      </a-row>
      <a-row style="margin-top:16px;display:flex;align-items:center;" :gutter="24">
        <a-col>下载日期</a-col>
            <a-col :md="4" :sm="6">
                <a-date-picker  style="width:100%;min-width: 100%;"
                    v-model="queryParam.downloadDateStart"
                    :disabled-date="disabledStartDate"
                    show-time
                    format="YYYY-MM-DD"
                    placeholder="请选择开始时间"
                    @openChange="handleStartOpenChange"
                  />
            </a-col>
            <!-- <a-col></a-col> -->
            <a-col :md="4" :sm="6" style="padding-right:0;">
               <!-- <a-range-picker @change="downloadDate"></a-range-picker> -->
                  <a-date-picker style="width:100%;min-width: 100%;"
                    v-model="queryParam.downloadDateEnd"
                    :disabled-date="disabledEndDate"
                    show-time
                    format="YYYY-MM-DD"
                    placeholder="请选择结束时间"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                  />
            </a-col>
        <!-- <a-col  style="position: absolute;right:0;">
          <a-button type="primary" icon="search" @click="searchBtn">查询</a-button>
        </a-col> -->
          <a-col class="col" style="position:absolute;right:0;">
						   <a-button @click="searchBtn" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					</a-col>
      </a-row>
    </a-card>
    <a-card title="物料下载明细表" :headStyle="{textAlign:'center','border-bottom':'none'}" :bodyStyle="{'padding-top':'0'}" style="margin-top:15px;">
      <a-table
          ref="table"
          size="small"
          :bordered="false"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">
          <span slot="download_link" slot-scope="text, record">
            <a-popover title trigger="hover">
              <template slot="content">
                <p style="maxWidth:300px;word-break:break-all;">{{record.download_link}}</p>
              </template>
              <a
                class="mouseHover"
                onmouseover="this.style.color='#3264D5';"
                onmouseout="this.style.color='#595959';"
              >{{record.download_link}}</a>
            </a-popover>
           </span>
           <!-- <span slot="download_link" slot-scope="text, record"
           style="display:inline-block;max-width:200px;word-break:break-all;word-wrap:break-word">
            {{record.download_link}} <br>
           </span> -->
      </a-table>
      <!-- <a-row type="flex" justify="end">
        <a-pagination size="small" show-quick-jumper :default-current="2" :total="500" />
      </a-row> -->
    </a-card> 
   <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </div>
</template>

<script>
import Vue from "vue"
import { dataDictionary,departmentAll,addMaterial,updateMaterial,departmentList } from '@/api/api'
import { USER_AUTH } from "@/store/mutation-types"
import { JeecgListMixin } from '@/mixins/JeecgListMixin' 
import tooltip from "@/components/tooltip/tooltip.vue"
export default {
  mixins: [JeecgListMixin],
  components:{ tooltip },
  data() {
    return {
      message:'操作成功',
      type:'info', 
      activeNodeId:undefined,
      materialTypeId:undefined,
      materialNameId:'',
      startValue: null,
      endValue: null,
      endOpen: false,
      titles:'新增物料',
      dataSource: [],
       //按钮权限
      authButton:{
        reviewBtn:true,
        editBtn: true,
        deleteBtn: true,
        createBtn: true,
        downloadBtn: true
      },
      columns: [
        // {
        //   title: '序号',
        //   align:"center",
        //   className:'table_title',
        //   width:100,
        //   customRender:(text,record,index)=> {
        //   return(
        //   `${(this.ipagination.current-1)*(this.ipagination.pageSize)+(index+1)}`//当前页数减1乘以每一页页数再加当前页序号+1
        //   )
        //   }
        // },
        {
          title: '部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
          ellipsis: true,
          align: 'center',
          className: 'table_title',
          width:150
        },
        {
          title: '活动节点',
          dataIndex: 'activeNode',
          key: 'activeNode',
          ellipsis: true,
          align: 'center',
          className: 'table_title',
          width:150
        },
        {
          title: '物料类型',
          dataIndex: 'materialType',
          key: 'materialType',
          ellipsis: true,
          align: 'center',
          className: 'table_title',
          width:100
        },
        {
          title: '物料名称',
          dataIndex: 'material_name',
          key: 'material_name',
          ellipsis: true,
          align: 'center',
          className: 'table_title',
          width:150
        },
        {
          title: '下载地址',
          dataIndex: 'download_link',
          key: 'download_link',
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'download_link' },
          className: 'table_title',
          width:150
        },
        {
          title: '下载工贸',
          dataIndex: 'downloadIndustryAndTradeName',
          key: 'downloadIndustryAndTradeName',
          ellipsis: true,
          align: 'center',
          width:150,
          className: 'table_title'
        },
        {
          title: '下载用户',
          dataIndex: 'user_name',
          key: 'user_name',
          ellipsis: true,
          align: 'center',
          width:150,
          scopedSlots: { customRender: 'material_description' },
          className: 'table_title'
        },
        {
          title: '下载日期',
          dataIndex: 'download_date',
          key: 'download_date',
          ellipsis: true,
          align: 'center',
          width:150,
          scopedSlots: { customRender: 'material_description' },
          className: 'table_title'
        }
      ],
      url: {
        list: '/cms/material/download/info/list'
      },
      isShowModal: false, //是否显示弹窗
      isShowModal2: false, //是否显示弹窗
      queryParam:{
        activeNode:'',
        materialType:'',
        materialName:'',
        downloadIndustryAndTradeId:'',
        downloadDateStart:null,
        downloadDateEnd:null
      },
      downloadDateStart:'',
      downloadDateEnd:'',
      departmentData:[],// 部门
      activeNode:[],// 活动节点
      materialType:[],// 活动类型
      departmentName:'',
      activeNodeName:'',
      materialTypeName:''
    }
  },
  created(){

    // 获取部门数据
    this.getDepartmentData();
    // 获取物料类型
    this.getMaterialType();
     // 获取活动节点
    this.getActiveNode();

  },
  mounted() {

     var curr = this.$route.query.currentParam
    console.log('curr',curr)
    if(curr){
      this.activeNodeId= curr.activeNode
      this.materialTypeId = curr.materialType
      this.materialNameId = curr.materialName

      this.queryParam.activeNode = curr.activeNode
      this.queryParam.materialType = curr.materialType
      this.queryParam.materialName = curr.materialName
      this.searchQuery()
    }
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if(auth.hasOwnProperty(this.$route.name)){
      this.authButton = auth[this.$route.name]
    }
    setTimeout(() => {
       setTimeout(()=>{
        var dom = document.getElementsByClassName('ant-table-small')[0]
        dom.style.border = 'none'
      },200)
    })
  },
  methods:{ 
     warnMethod(){
      this.$refs.tooltip.visible = true
      this.$refs.tooltip.alertVisible = true
      setTimeout(()=>{
        this.$refs.tooltip.cancel() 
      },3000)
    },  
    searchBtn(){
      this.queryParam.activeNode = this.activeNodeId
      this.queryParam.materialType = this.materialTypeId
      this.queryParam.materialName = this.materialNameId
      this.searchQuery()
    },
    selectType(e){
      this.queryParam.materialType = e?e:''
    },
    selectNode(e){
      console.log(e)
      this.queryParam.activeNode = e?e:''
    },
    disabledStartDate(startValue) {
      const endValue = this.queryParam.downloadDateEnd;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.queryParam.downloadDateStart;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
       //获取活动节点
    getActiveNode() {
      departmentAll({dataType:'activeNode'}).then(res => {
        if(res.code===200){
          this.activeNode = res.data
        }else if(res.code!==400){
        // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    // 日期改变时触发
    downloadDate(e,time){
       this.queryParam.downloadDateStart = time[0]
       this.downloadDateStart = time[0]
       this.queryParam.downloadDateEnd = time[1]
       this.downloadDateEnd = time[1]
    },
       //获取全部部门数据
    getDepartmentData() {
      this.departmentData = []
      departmentList({ page: 1, size: 1000 }).then(res => {
        if(res.code===200){
          let data = res.data.list
          data.forEach(value => {
            let option = {}
            option['value'] = value.id
            option['label'] = value.departmentName
            this.departmentData.push(option)
          })
           console.log(" this.departmentData", this.departmentData)
        }else if(res.code!==400){
        // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethod();
        }
      })
    },
    //获取物料类型
    getMaterialType() {
      departmentAll({dataType:'materialType'}).then(res => {
        if(res.code===200){
           this.materialType = res.data
        }else if(res.code!==400){
        this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.margin{
  margin:0 3px;
}
.col-6{
  width:100%;
}
.add_row{
  margin-bottom:16px;
  display: flex;
  align-items: center;
  .add_col1{
    color:#55565D;
    font-size:14px;
  }
  .add_col2{
    margin-left:16px;
  }
}
.input_color{
  color:#55565D;
}
.conditon{
  width:200px;
  padding:0!important;
}
.text{
   margin:0 16px 0 24px;
   padding:0!important;
}
</style>