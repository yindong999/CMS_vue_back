<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :hoverable="true" title="" style="margin-bottom: 12px;">
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="searchQuery"> 
          <a-row style="display:flex;align-items:center;" :gutter="24">
            <a-col>角色名称</a-col>
            <a-col :md="4" :sm="6">
              <a-input placeholder="请输入角色名称" v-model="queryParam.roleName" allowClear></a-input>
            </a-col>
             <a-col class="col" style="position:absolute;right:0;">
						   <a-button @click="searchQuery" type="primary" class="queryBtn">
							<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
							查询</a-button>
					  </a-col>
          </a-row>
          <!-- <a-row style="margin-top:8px;" type="flex" justify="end">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
          </a-row> -->
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" :hoverable="true" title="角色列表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
      <!-- 操作按钮区域 -->
      <a-button slot="extra" v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn" @click="handleAdd" type="primary" icon="plus" style="position: absolute;top: 12px;right:32px;">新增</a-button>
      <div>
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
    <span slot="action" slot-scope="text, record">
        <a v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" @click="handleEdit(record)" style="color:#3264D5;margin-right:14px;">编辑</a>
        <!-- <a-divider v-if="authButton.hasOwnProperty('permissionBtn')&&authButton.permissionBtn" type="vertical" /> -->
        <a v-if="authButton.hasOwnProperty('permissionBtn')&&authButton.permissionBtn" @click="handlePerssion(record)" style="color:#3264D5;margin-right:14px;">配置权限</a>
        <!-- <a-divider v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" type="vertical" /> -->
      <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
      <a style="color:#3264D5">删除</a>
      </a-popconfirm>
      </span>
        </a-table>
      </div>
      <!-- 新增编辑部门信息 -->
      <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
      <!--编辑菜单权限-->
      <!--<role-menu-modal ref="modalRoleMenu"></role-menu-modal>-->
      <role-permission-modal ref="modalRoleMenu"></role-permission-modal>
    </a-card>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </div>


</template>
<script>
  import Vue from "vue"
  import { USER_AUTH } from "@/store/mutation-types"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import RoleModal from './modules/RoleModal'
  import RoleMenuModal from './modules/RoleMenuModal'
  import RolePermissionModal from './modules/RolePermissionModal'
  import tooltip from "@/components/tooltip/tooltip.vue"
  export default {
    name: "Role",
    mixins:[JeecgListMixin],
    components: { RolePermissionModal, RoleModal,RoleMenuModal,tooltip },
    data () {
      return {
        message:'操作成功',
        type:'info',
        headStyle:{
        "text-align":"center",
        "border-bottom":"none",
        "font-size":"16px",
        "color":"#3C3D43"
      },
        //按钮权限
        authButton:{
          editBtn: true,
          deleteBtn: true,
          createBtn: true,
          permissionBtn: true
        },
        description: '角色管理',
        queryParam: {},
        // 表头
        columns: [
        //   {
        //   title: '序号', 
        //   align:"center",
        //   className:'table_title',
        //   width:80,
        //   customRender:(text,record,index)=> {
        //   return(
        //   `${(this.ipagination.current-1)*(this.ipagination.pageSize)+(index+1)}`//当前页数减1乘以每一页页数再加当前页序号+1
        //   )
        //   }
        // },
          {
            title: '角色名称',
            align: 'center',
            dataIndex: 'roleName',
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
            title: '创建人',
            dataIndex: 'createByName',
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
        dataSource: [],
        url: {
          list: '/cms/role/list',
          delete: '/cms/role/delete',
        },
      }
    },
    computed: {
    },
    mounted(){
      //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
      let auth = Vue.ls.get(USER_AUTH)
      //如果按钮权限数据里有当前页面的权限
      if(auth.hasOwnProperty(this.$route.name)){
        this.authButton = auth[this.$route.name]
      }
      setTimeout(()=>{
      var dom = document.getElementsByClassName("ant-table-small")[0]
      dom.style.border= "none"
    },200)
    },
    methods: {
      //打开编辑菜单抽屉
      handlePerssion(role){
        this.$refs.modalRoleMenu.show(role);
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>