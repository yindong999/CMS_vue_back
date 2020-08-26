<template>
  <a-modal :centered="true"
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    wrapClassName="ant-modal-cust-warp"
    :bodyStyle="bodyStyle"
    style="top:5%;overflow-y: auto">
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
    <a-card :bordered="false" :hoverable="true" title="" style="width: 100%;margin-bottom: 20px">
      <p>角色名称：{{role.roleName}}</p>
      <p>创建时间：{{role.createDate}}</p>
    </a-card>
    <a-row>
      <a-col :span="24" style="display:flex;justify-content:space-around;">
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
      <!-- <a-col :span="12">
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
      </a-col> -->
    </a-row>
    <!-- 提示弹窗 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip> 
  </a-modal>
</template>

<script>
  import {queryTreeListForRole,getPermissionList,saveRolePermission} from '@/api/api'
  import tooltip from "@/components/tooltip/tooltip.vue"
  export default {
    name: "RolePermissionModal",
    components:{ tooltip },
    data(){
      return {
        message:'操作成功',
        type:'info',
        bodyStyle:{
          height:'70vh!important'
        },
        confirmLoading: false,
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
        // rankOptions:[
        //   { label: '集团', value: '1' },
        //   { label: '品牌', value: '2' },
        //   { label: '产业', value: '3' },
        //   { label: '小微', value: '4' }
        // ],
        //分类分级已有数据
        // rankValue:['1','2'],
        //媒体平台全部数据
        // mediaOptions:[
        //   { label: '集团', value: '1' },
        //   { label: '品牌', value: '2' },
        //   { label: '产业', value: '3' },
        //   { label: '小微', value: '4' }
        // ],
        //媒体平台已有数据
        // mediaValue:['1','2'],
        //品牌全部数据
        // brandOptions:[
        //   { label: '集团', value: '1' },
        //   { label: '品牌', value: '2' },
        //   { label: '产业', value: '3' },
        //   { label: '小微', value: '4' }
        // ],
        //品牌已有数据
        // brandValue:['1','2'],
        //产业全部数据
        // industryOptions:[
        //   { label: '集团', value: '1' },
        //   { label: '品牌', value: '2' },
        //   { label: '产业', value: '3' },
        //   { label: '小微', value: '4' },
        // ],
        //产业已有数据
        // industryValue:['1','2'],
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
      warnMethod(){
        this.$refs.tooltip.visible = true
        this.$refs.tooltip.alertVisible = true
        setTimeout(()=>{
          this.$refs.tooltip.cancel() 
        },3000)
      },
      handleOk(){
        let that = this;
        let params =  {
          roleId:that.roleId,
          lastpermissionIds:that.defaultCheckedKeys1.concat(that.defaultCheckedKeys2).join(),
          permissionIds:that.checkedKeys1.concat(that.checkedKeys2).join(),
          // rank:that.rankValue,
          // brand:that.brandValue,
          // media:that.mediaValue,
          // industry:that.industryValue,
        };
        that.loading = true;
        console.log("请求参数：",params);
        saveRolePermission(params).then((res)=>{
          if(res.code === 200){
            // that.$message.success(res.message);
            this.message = "操作成功"
            this.type = "info"
            this.warnMethod();
            that.loading = false;
            that.close();
          }else if(res.code!==400){
            // that.$message.error(res.message);
            this.message = res.message
            this.type = "error"
            this.warnMethod();
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
              // this.rankOptions = res.data.rank
              // this.mediaOptions = res.data.media
              // this.brandOptions = res.data.brand
              // this.industryOptions = res.data.industry
              getPermissionList({roleId:this.roleId}).then((res)=>{
                if(res.code === 200){
                  //前台权限
                  this.checkedKeys1 = [...res.data.permissionList_front];
                  this.defaultCheckedKeys1 = [...res.data.permissionList_front];
                  this.expandedKeysss1 = this.allTreeKeys1;

                  //后台权限
                  this.checkedKeys2 = [...res.data.permissionList_back];
                  this.defaultCheckedKeys2 = [...res.data.permissionList_back];
                  this.expandedKeysss2 = this.allTreeKeys2;
                  //console.log(this.defaultCheckedKeys)
                  //数据权限
                  // this.rankValue = res.data.rank;
                  // this.brandValue = res.data.brand;
                  // this.mediaValue = res.data.media;
                  // this.industryValue = res.data.industry;
                }else if(res.code!==400){
                  // this.$message.error(res.message)
                  this.message = res.message
                  this.type = "error"
                  this.warnMethod();
                }
              })
            }else if(res.code!==400){
              // this.$message.error(res.message)
              this.message = res.message
              this.type = "error"
              this.warnMethod();
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
.ant-modal-content{
  height: 100%!important;
}
  .lin30{
    line-height: 30px;
    margin-bottom: 20px;
  }
  .textRight{
    text-align: right;
  }
  .marginRight20{
    margin-right: 20px;
  }
  .marginRight10{
    margin:0 10px;
  }
  .iconSwap{
    font-size: 20px;
    margin: 0 10px;
  }
</style>