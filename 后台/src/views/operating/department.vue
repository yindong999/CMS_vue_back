<template>
  <div>
    <a-card :bordered="false" :hoverable="true" title="" style="margin-bottom: 12px;">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="searchQuery" class="formStyle">
          <a-row class="leftDiv">
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">部门类型</span>
              <a-select :showSearch="true" allowClear placeholder="请选择部门类型" style="width:calc(100% - 97px);margin-left: 16px;" @change="selectDepartment" :filter-option="filterOption">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="(item,key) in departmentTypeData" :value="item.value" :key="key" >{{item.label}}</a-select-option>
              </a-select>
            </a-col>
            <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">部门名称</span>
                <a-input style="width:calc(100% - 97px);margin-left: 16px;" allowClear v-model="queryParam.departmentName" placeholder="请填写部门名称"></a-input>
            </a-col>
          </a-row>
           <div class="btnCol"  style="width:170px;">
						<a-button @click="searchQuery" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					</div>
          <!-- <a-row type="flex" justify="end" style="margin-top: 8px;">
              <a-button type="primary" @click="searchQuery" icon="search" style="float:right;">查询</a-button>
          </a-row> -->
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" :hoverable="true" title="部门列表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
      <!-- 操作按钮区域 -->
        <a-button slot="extra" style="padding:0 16px;position:absolute;right:32px;" v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn" @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <div>
        <a-table
          style="height:500px"
          ref="table"
          size="small"
          :bordered="bordered"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
          <a v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" @click="handleEdit(record)" style="color:#3264D5;margin-right:14px;">编辑</a>
          <!-- <a-divider v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" type="vertical" /> -->
          <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a style="color:#3264D5">删除</a>
          </a-popconfirm>
        </span>
        </a-table>
      </div>
      <!-- 新增编辑部门信息 -->
      <department-modal ref="modalForm" @ok="modalFormOk"></department-modal>
    </a-card>
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>
<script>
  import Vue from "vue"
  import { USER_AUTH } from "@/store/mutation-types"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { DepartmentTypeData } from '@/api/api'
  import DepartmentModal from './modules/DepartmentModal'
  import tooltip from "@/components/tooltip/tooltip.vue"
  export default {
    name: "Department",
    mixins:[JeecgListMixin],
    components: { DepartmentModal,tooltip },
    data () {
      return {
        bordered:false,
        message:'操作成功',
        type:'info',
        headStyle:{
        "text-align":"center",
        "border-bottom":"none" 
      },

        //按钮权限，默认拥有全部权限
        authButton:{
          editBtn: true,
          createBtn: true,
          deleteBtn: true,
        },
        //部门类型
        departmentTypeData:DepartmentTypeData,
        description: '部门管理',
        queryParam: {
          departmentType:'',
          departmentName:''
        },
        // 表头
        columns: [
//           {
//           title: '序号', 
//           align:"center",
//           className:'table_title',
//           width:100,
//           customRender:(text,record,index)=> {
//           return(
//           `${(this.ipagination.current-1)*(this.ipagination.pageSize)+(index+1)}`//当前页数减1乘以每一页页数再加当前页序号+1
//           )
//           }
//         },
          {
            title: '部门名称',
            align: 'center',
            dataIndex: 'departmentName',
            className:'table_title',
            width:150
          },
          {
            title: '部门类型',
            align: 'center',
            dataIndex: 'departmentType',
            className:'table_title',
            width:150,
            customRender: (text) => {
              let name;
              for(let i=0;i<DepartmentTypeData.length;i++){
                if(text === DepartmentTypeData[i].value){
                  console.log('匹配')
                  name = DepartmentTypeData[i].label;
                  break
                }
              }
              return name
            }
          },
          {
            title: '联系人',
            align: 'center',
            dataIndex: 'contacter',
            className:'table_title',
            width:150
          },
          {
            title: '联系方式',
            align: 'center',
            dataIndex: 'contacterMobile',
            className:'table_title',
            width:150
          },
          {
            title: '创建时间',
            dataIndex: 'createDate',
            align:"center",
            className:'table_title',
            width:150
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            className:'table_title',
            width:150
          }
        ],
        dataSource:[],
        url: {
          list: '/cms/department/list',
          delete: '/cms/department/delete',
        },
        // startDate:'',
        // endDate:''
      }
    },
    mounted(){
      //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
      let auth = Vue.ls.get(USER_AUTH)
      //如果按钮权限数据里有当前页面的权限
      if(auth.hasOwnProperty(this.$route.name)){
        this.authButton = auth[this.$route.name]
      }
    //  setTimeout(()=>{
    //   var dom = document.getElementsByClassName("ant-table-small")[0]
    //   dom.style.border= "none"
    // },200)
    },
    methods: {
      selectDepartment(e){
        this.queryParam.departmentType = e!==""?e:""
      },
      // 选择日期时触发
      // onChangeDate(date, dateString){
      //   console.log(date, dateString)
      //   // 开始日期
      //   var startDate = dateString[0]
      //   // 结束日期
      //   var endDate = dateString[1]
      // }
    }
  }
</script>
<style lang="scss" scoped>


</style>