<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="70%"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-card :bordered="false" :hoverable="true" title="" style="width: 100%;margin-bottom: 20px">
      <p>角色编号：{{role.roleCode}}</p>
      <p>角色名称：{{role.roleName}}</p>
      <p>创建时间：{{role.createDate}}</p>
    </a-card>
    <a-row>
      <a-col :span="12">
        <!--前台权限树-->
        <a-form>
          <a-form-item label='前台菜单权限'>
            <a-tree
              checkable
              @check="onCheck1"
              :checkedKeys="checkedKeys1"
              :treeData="treeData1"
              @expand="onExpand1"
              @select="onTreeNodeSelect1"
              :selectedKeys="selectedKeys1"
              :expandedKeys="expandedKeysss1"
              :checkStrictly="checkStrictly">
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}<a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;"></a-icon>
          </span>
            </a-tree>
          </a-form-item>
        </a-form>
        <!--后台权限树-->
        <a-form>
          <a-form-item label='后台菜单权限'>
            <a-tree
              checkable
              @check="onCheck2"
              :checkedKeys="checkedKeys2"
              :treeData="treeData2"
              @expand="onExpand2"
              @select="onTreeNodeSelect2"
              :selectedKeys="selectedKeys2"
              :expandedKeys="expandedKeysss2"
              :checkStrictly="checkStrictly">
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}<a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;"></a-icon>
          </span>
            </a-tree>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="12">
        <a-row style="min-height: 50px;">
          <a-col :span="6">分类分级：</a-col>
          <a-col :span="18">
            <a-checkbox-group :options="rankOptions" v-model="rankValue" />
          </a-col>
        </a-row>
        <a-row style="min-height: 50px;">
          <a-col :span="6">媒体平台：</a-col>
          <a-col :span="18">
            <a-checkbox-group :options="mediaOptions" v-model="mediaValue" />
          </a-col>
        </a-row>
        <a-row style="min-height: 50px;">
          <a-col :span="6">品牌：</a-col>
          <a-col :span="18">
            <a-checkbox-group :options="brandOptions" v-model="brandValue" />
          </a-col>
        </a-row>
        <a-row style="min-height: 50px;">
          <a-col :span="6">产业：</a-col>
          <a-col :span="18">
            <a-checkbox-group :options="industryOptions" v-model="industryValue" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <div class="drawer-bootom-button">
      <!--<a-dropdown style="float: left" :trigger="['click']" placement="topCenter">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>-->
          <!--<a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>-->
          <!--<a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>-->
          <!--<a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>-->
          <!--<a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>-->
          <!--<a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button>-->
          <!--树操作 <a-icon type="up" />-->
        <!--</a-button>-->
      <!--</a-dropdown>-->
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">保存</a-button>
    </div>
  </a-drawer>

</template>
<script>
  import {queryTreeListForRole,getPermissionList,saveRolePermission} from '@/api/api'

  export default {
    name: "RoleMenuModal",
    components:{

    },
    data(){
      return {
        //角色对象
        role:{},
        //角色id
        roleId:"",
        //菜单权限
        //树的数据
        treeData1: [],
        treeData2: [],
        //默认选中的节点
        defaultCheckedKeys1:[],
        defaultCheckedKeys2:[],
        //选中的节点
        checkedKeys1:[],
        checkedKeys2:[],
        //展开的节点
        expandedKeysss1:[],
        expandedKeysss2:[],
        //所有树的id
        allTreeKeys1:[],
        allTreeKeys2:[],
        autoExpandParent: true,
        checkStrictly: true,
        title:"配置权限",
        visible: false,
        loading: false,
        selectedKeys1:[],
        selectedKeys2:[],
        //数据权限
        //分类分级全部数据
        rankOptions:[
          { label: '集团', value: '1' },
          { label: '品牌', value: '2' },
          { label: '产业', value: '3' },
          { label: '小微', value: '4' }
        ],
        //分类分级已有数据
        rankValue:['1','2'],
        //媒体平台全部数据
        mediaOptions:[
          { label: '集团', value: '1' },
          { label: '品牌', value: '2' },
          { label: '产业', value: '3' },
          { label: '小微', value: '4' }
        ],
        //媒体平台已有数据
        mediaValue:['1','2'],
        //品牌全部数据
        brandOptions:[
          { label: '集团', value: '1' },
          { label: '品牌', value: '2' },
          { label: '产业', value: '3' },
          { label: '小微', value: '4' }
        ],
        //品牌已有数据
        brandValue:['1','2'],
        //产业全部数据
        industryOptions:[
          { label: '集团', value: '1' },
          { label: '品牌', value: '2' },
          { label: '产业', value: '3' },
          { label: '小微', value: '4' },
        ],
        //产业已有数据
        industryValue:['1','2'],
      }
    },
    methods: {
      onTreeNodeSelect1(id){
        if(id && id.length>0){
          this.selectedKeys1 = id
        }
      },
      onTreeNodeSelect2(id){
        if(id && id.length>0){
          this.selectedKeys2 = id
        }
      },
      onCheck1 (o) {
        if(this.checkStrictly){
          this.checkedKeys1 = o.checked;
        }else{
          this.checkedKeys1 = o
        }
      },
      onCheck2 (o) {
        if(this.checkStrictly){
          this.checkedKeys2 = o.checked;
        }else{
          this.checkedKeys2 = o
        }
      },
      show(role){
        this.role=role
        this.roleId=role.id
        this.visible = true;
      },
      close () {
        this.reset()
        this.$emit('close');
        this.visible = false;
      },
      onExpand1(expandedKeys){
        this.expandedKeysss1 = expandedKeys;
        this.autoExpandParent = false
      },
      onExpand2(expandedKeys){
        this.expandedKeysss2 = expandedKeys;
        this.autoExpandParent = false
      },
      reset () {
        this.expandedKeysss1 = []
        this.expandedKeysss2 = []
        this.checkedKeys1 = []
        this.checkedKeys2 = []
        this.defaultCheckedKeys1 = []
        this.defaultCheckedKeys2 = []
        this.loading = false
      },
      expandAll () {
        this.expandedKeysss1 = this.allTreeKeys1
        this.expandedKeysss2 = this.allTreeKeys2
      },
      closeAll () {
        this.expandedKeysss1 = []
        this.expandedKeysss2 = []
      },
      checkALL () {
        this.checkedKeys1 = this.allTreeKeys1
        this.checkedKeys2 = this.allTreeKeys2
      },
      cancelCheckALL () {
        //this.checkedKeys = this.defaultCheckedKeys
        this.checkedKeys1 = []
        this.checkedKeys2 = []
      },
      switchCheckStrictly (v) {
        if(v==1){
          this.checkStrictly = false
        }else if(v==2){
          this.checkStrictly = true
        }
      },
      handleCancel () {
        this.close()
      },
      handleSubmit(){
        let that = this;
        let params =  {
          roleId:that.roleId,
          navigation1:that.checkedKeys1,
          navigation2:that.checkedKeys2,
          rank:that.rankValue,
          brand:that.brandValue,
          media:that.mediaValue,
          industry:that.industryValue,
        };
        that.loading = true;
        console.log("请求参数：",params);
        saveRolePermission(params).then((res)=>{
          if(res.code===200&&res.success){
            that.$message.success(res.message);
            that.loading = false;
            that.close();
          }else if(res.code!==400){
            that.$message.error(res.message);
            that.loading = false;
            that.close();
          }
        })
      },
    },
    watch: {
    visible () {
      if (this.visible) {
        queryTreeListForRole().then((res) => {
          if(res.code === 200){
            //前台数据
            this.treeData1 = res.data.treeList_front
            this.allTreeKeys1 = res.data.ids_front
            //后台数据
            this.treeData2 = res.data.treeList_back
            this.allTreeKeys2 = res.data.ids_back
            //数据源数据
            this.rankOptions = res.data.rank
            this.mediaOptions = res.data.media
            this.brandOptions = res.data.brand
            this.industryOptions = res.data.industry
            getPermissionList({roleId:this.roleId}).then((res)=>{
              if(res.code === 200){
                //前台权限
                this.checkedKeys1 = [...res.data.navigation1];
                this.defaultCheckedKeys1 = [...res.data.navigation1];
                this.expandedKeysss1 = this.allTreeKeys1;

                //后台权限
                this.checkedKeys2 = [...res.data.navigation2];
                this.defaultCheckedKeys2 = [...res.data.navigation2];
                this.expandedKeysss2 = this.allTreeKeys2;
                //console.log(this.defaultCheckedKeys)
                //数据权限
                this.rankValue = res.data.rank;
                this.brandValue = res.data.brand;
                this.mediaValue = res.data.media;
                this.industryValue = res.data.industry;
              }else if(res.code!==400){
                this.$message.error(res.message)
              }
            })
          }else if(res.code!==400){
             this.$message.error(res.message)
          }
        })
      }
    }
  }
  }

</script>
<style lang="scss" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }

</style>