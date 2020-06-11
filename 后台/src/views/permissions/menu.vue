<template>
  <div>
    <a-card :bordered="false" :hoverable="true" title="" style="margin-bottom: 12px;">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <!-- 搜索区域 -->
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24" style="display:flex;align-items:center;">
            <a-col>登录类型</a-col>
            <a-col :md="4" :sm="6">
                <a-select
                  :showSearch="true" 
                  placeholder="请选择登录类型"
                  @change="selectLogin" allowClear
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="1">前台</a-select-option>
                  <a-select-option :value="2">后台</a-select-option>
                </a-select>
            </a-col>
            <a-col>菜单类型</a-col>
            <a-col :md="4" :sm="6">
                <a-select
                  :showSearch="true" 
                  placeholder="请选择菜单类型"
                  @change="selectMenu" allowClear
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="0">一级菜单</a-select-option>
                  <a-select-option :value="1">子菜单</a-select-option>
                  <a-select-option :value="2">按钮</a-select-option>
                </a-select>
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
    <a-card :bordered="false" :hoverable="true" title="菜单列表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
      <!-- 操作按钮区域 -->
      <a-button slot="extra" v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn" @click="handleAdd" type="primary" icon="plus" style="position: absolute;top: 12px;right:32px;">新增</a-button>
      <div>
        <a-table
          style="height:500px"
          :scroll="{ x: 2000}"
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
        <!-- <a-divider v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" type="vertical" /> -->
      <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
      <a style="color:#3264D5">删除</a>
      </a-popconfirm>
      </span>
        </a-table>
      </div>
      <!-- 新增 -->
      <menu-modal ref="modalForm" @ok="modalFormOk"></menu-modal>
    </a-card>
  </div>


</template>
<script>
  import Vue from "vue"
  import { USER_AUTH } from "@/store/mutation-types"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MenuModal from './modules/MenuModal'
  export default {
    name: "Menu",
    mixins:[JeecgListMixin],
    components: { MenuModal },
    data () {
      return {
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
        description: '角色管理',
        queryParam: {},
        // 表头
        columns: [ 
//           {
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
            title: 'id',
            dataIndex: 'id',
            align:"center",
            className:'table_title'
          },
          {
            title: '名称',
            dataIndex: 'name',
            align:"center",
            width: 150,
            className:'table_title'
          },
          {
            title: '路由链接',
            dataIndex: 'url',
            align:"center",
            className:'table_title'
          },
          {
            title: '组件',
            dataIndex: 'component',
            align:"center",
            className:'table_title'
          },
          {
            title: '菜单类型',
            dataIndex: 'menuType',
            align:"center",
            className:'table_title',
            customRender: (text) => {
              let name;
              if(text===0){
                name='一级菜单'
              }else if(text===1){
                name='子菜单'
              }else{
                name='按钮'
              }
              return name
            }
          },
          {
            title: '排序',
            dataIndex: 'sortNo',
            align:"center",
            className:'table_title'
          },
          {
            title: '登录类型',
            dataIndex: 'alwaysShow',
            align:"center",
            className:'table_title',
            customRender: (text) => {
              let name;
              if(text===1){
                name='前台'
              }else{
                name='后台'
              }
              return name
            }
          },
          {
            title: '是否路由菜单',
            dataIndex: 'route',
            align:"center",
            className:'table_title',
            customRender: (text) => {
              let name;
              if(text){
                name='是'
              }else{
                name='否'
              }
              return name
            }
          },
          {
            title: '是否叶子节点',
            dataIndex: 'leaf',
            align:"center",
            className:'table_title',
            customRender: (text) => {
              let name;
              if(text){
                name='是'
              }else{
                name='否'
              }
              return name
            }
          },
          {
            title: '是否隐藏路由',
            dataIndex: 'hidden',
            align:"center",
            className:'table_title',
            customRender: (text) => {
              let name;
              if(text){
                name='是'
              }else{
                name='否'
              }
              return name
            }
          },
          {
            title: '父节点',
            align: 'center',
            dataIndex: 'parentId',
            width: 250,
            className:'table_title'
          },
          {
            title: '重定向',
            dataIndex: 'redirect',
            align:"center",
            className:'table_title'
          },
          {
            title: '图标',
            dataIndex: 'icon',
            align:"center",
            className:'table_title'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            width: 100,
            className:'table_title'
          }
        ],
        dataSource: [],
        url: {
          list: '/cms/permission/list',
          delete: '/cms/permission/delete',
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
      selectLogin(e){
        this.queryParam.alwaysShow = e!==""?e:''
      },
      selectMenu(e){
        this.queryParam.menuType = e!==""?e:''
      },
      //打开编辑菜单抽屉
      handlePerssion(role){
        this.$refs.modalRoleMenu.show(role);
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>