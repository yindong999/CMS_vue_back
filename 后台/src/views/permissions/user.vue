<template>
  <div>
    <a-card :bordered="false" :hoverable="true" title="" style="margin-bottom: 12px;">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24" style="display:flex;align-items:center;">
            <a-col>
              用户账号
            </a-col>
            <a-col :md="4" :sm="6">
               <a-input v-model="queryParam.userAccount" placeholder="请输入用户账号" allowClear></a-input>
            </a-col>
            <a-col>
              用户名称
            </a-col>
            <a-col :md="4" :sm="6">
               <a-input placeholder="请输入用户名称" v-model="queryParam.userName" allowClear></a-input>
            </a-col>
            <a-col>
              用户部门
            </a-col>
            <a-col :md="4" :sm="6">
                 <a-select
                    :showSearch="true"
                    placeholder="请选择用户部门"
                    @change="selectUserDep" allowClear
                  >

                    <a-select-option value="">全部</a-select-option>
                    <a-select-option
                      v-for="(item,key) in departmentData"
                      :value="item.value"
                      :key="key"
                    >{{item.label}}</a-select-option>
                  </a-select>
            </a-col>
            <a-col>
              用户角色
            </a-col>
            <a-col :md="4" :sm="6">
                 <a-select
                    :showSearch="true"
                    placeholder="请选择用户角色"
                     @change="selectUserRole" allowClear
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option
                      v-for="(item,key) in roleData"
                      :value="item.value"
                      :key="key"
                    >{{item.label}}</a-select-option>
                  </a-select>
            </a-col>
          </a-row>
          <a-row style="margin-top:8px;" type="flex" justify="end">
                <!-- <a-button type="primary" @click="searchQuery" icon="search">查询</a-button> -->
                <a-col class="col">
                <a-button @click="searchQuery" type="primary" class="queryBtn">
                <img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
              查询</a-button>
              </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" :hoverable="true" title="用户列表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
      <!-- 操作按钮区域 -->
        <a-button
          slot="extra"
          v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn"
          @click="handleAdd"
          type="primary"
          icon="plus"
          style="position: absolute;top: 12px;right:32px;"
        >新增</a-button>
      <div >
        <a-table
          style="height:500px"
          ref="table"
          size="small"
          :bordered="false"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
          <span slot="userType" slot-scope="text,record">
             {{record.userType==="1"?"海尔用户":"外部用户"}}
          </span>
          <span slot="userRoleGroup" slot-scope="text, record">
            <span v-for="(item,index) in record.userRoleGroup" :key="index">{{item.userRoleName}}<br></span>
          </span>
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
      <user-modal :role="roleData" :department="departmentData" ref="modalForm" @ok="modalFormOk"></user-modal>
    </a-card>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </div>
</template>
<script>
import Vue from "vue"
import { USER_AUTH } from "@/store/mutation-types"
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import UserModal from './modules/UserModal'
import tooltip from "@/components/tooltip/tooltip.vue"
import { roleList, departmentList } from '@/api/api'
export default {
  name: 'User',
  mixins: [JeecgListMixin],
  components: { UserModal,tooltip },
  data() {
    return {
      message:'操作成功',
      type:'info',
      headStyle:{
        "text-align":"center",
        "border-bottom":"none"
      },
      //按钮权限
      authButton:{
        editBtn: true,
        deleteBtn: true,
        createBtn: true,
      },
      description: '用户管理',
      queryParam: {},
      //全部部门信息
      departmentData: [],
      //全部角色信息
      roleData: [],
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
          title: '用户账号',
          align: 'center',
          width: 100,
          dataIndex: 'userAccount',
          className:'table_title'
        },
        {
          title: '用户名称',
          align: 'center',
          width: 150,
          dataIndex: 'userName',
          className:'table_title'
        },
        {
          title: '用户类型',
          align: 'center',
          width: 150,
          dataIndex: 'userType',
          scopedSlots: { customRender: 'userType' },
          className:'table_title'
        },
        {
          title: '部门名称',
          align: 'center',
          width: 150,
          dataIndex: 'userDepartmentName',
          className:'table_title'
        },
        {
          title: '角色名称',
          align: 'center',
          width: 220,
          dataIndex: 'userRoleGroup',
          scopedSlots: { customRender: 'userRoleGroup' },
          className:'table_title'
        },
        {
          title: '联系方式',
          align: 'center',
          width: 120,
          dataIndex: 'userMobile',
          className:'table_title'
        },
        {
          title: '电子邮箱',
          align: 'center',
          width: 270,
          dataIndex: 'userEmail',
          className:'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'action' },
          className:'table_title'
        }
      ],
      dataSource: [],
      url: {
        list: '/cms/user/list',
        delete: '/cms/user/delete'
      }
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
    //初始化时先加载全部部门和角色数据用于下拉筛选
    this.getRoleData()
    this.getDepartmentData()
    setTimeout(()=>{
      var dom = document.getElementsByClassName("ant-table-small")[0]
      dom.style.border= "none"
    },200)
  },
  methods: {
    // 点击用户部门触发
    selectUserDep(e){
       console.log('xxx',e)
      this.queryParam.userDepartmentId = e!==""?e:''
    },
    // 点击用户角色下拉选触发
    selectUserRole(e){
      console.log('aaa',e)
      this.queryParam.userRoleId = e!==""?e:''
    },
    //获取全部角色数据
    getRoleData() {
      this.roleData = []
      roleList({ page: 1, size: 1000 }).then(res => {
        if(res.code===200){
          let data = res.data.list
          data.forEach(value => {
            let option = {}
            option['value'] = value.id
            option['label'] = value.roleName
            this.roleData.push(option)
          })
          console.log('this.roleData', this.roleData)
        }else if(res.code!==400){ 
          // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethods();
        }
      })
    },
    //获取全部部门数据
    getDepartmentData() {
      this.departmentData = []
      departmentList({ page: 1, size: 1000 }).then(res => {
        if(res.code===200){
          console.log(res.data.list)
          let data = res.data.list
          data.forEach(value => {
            let option = {}
            option['value'] = value.id
            option['label'] = value.departmentName
            this.departmentData.push(option)
          })
        }else if(res.code!==400){
        // this.$message.error(res.message)
          this.message = res.message
          this.type = "error"
          this.warnMethods();
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.conditon{
  width:200px;
  padding:0!important;
}
.text{
   margin:0 16px 0 24px;
   padding:0!important;
}
</style>