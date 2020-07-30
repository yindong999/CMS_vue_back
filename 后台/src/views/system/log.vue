<template>
  <div>
    <!-- 顶部查询条件模块 -->
    <div style="background:#ECECEC; margin-bottom:12px">
      <!-- <a-card title="">
        <a-form layout="inline">
          <a-row class="leftDiv">
            <a-col style="display:flex;align-items:center;" :span="6"> 
                <span>操作时间</span>
                    <a-date-picker  style="width:calc(100% - 85px)!important;min-width:calc(100% - 85px)!important;margin-left:16px;"
                     v-model="queryParam.startTime"
                        :disabled-date="disabledStartDate"
                        show-time
                        format="YYYY-MM-DD"
                        placeholder="请选择开始时间"
                        @openChange="handleStartOpenChange"
                      /> 
                </a-col>
                <a-col style="display:flex;align-items:center;" :span="6">
                      <a-date-picker style="width:calc(100% - 85px)!important;min-width:calc(100% - 85px)!important;"
                      v-model="queryParam.entTime"
                        :disabled-date="disabledEndDate"
                        show-time
                        format="YYYY-MM-DD"
                        placeholder="请选择结束时间"
                        :open="endOpen"
                        @openChange="handleEndOpenChange"
                      />
                </a-col> 
          </a-row>
            <div class="btnCol" style="width:170px;">
              <a-button @click="queryLog" type="primary" class="queryBtn">
                <img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
                <span>查询</span>
                </a-button>
            </div>
        </a-form>
      </a-card> -->
    </div>
    <div>
      <a-card title="系统日志">
        <!-- <a-table
          style="height:500px"
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        </a-table>-->
      </a-card>
    </div>
  </div>
</template>
<script>
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  name: 'log',
  // mixins:[JeecgListMixin],
  data() {
    return {
      // 表头
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'departmentCode'
        },
        {
          title: '日志标题',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '请求地址',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '日志类型',
          align: 'center',
          dataIndex: 'departmentCode'
        },
        {
          title: '操作用户',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '异常',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '业务类型',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '操作时间',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '客户端IP',
          align: 'center',
          dataIndex: 'departmentName'
        },
        {
          title: '响应时间',
          align: 'center',
          dataIndex: 'departmentName'
        }
      ],
      dataSource: [],
      startValue: null,
      endValue: null,
      endOpen: false,
      startTime:'',
      entTime:'',
      queryParam:{
        startTime:null,
        entTime:null
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.queryParam.entTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.queryParam.startTime;
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
    selectTime(e,t){
      console.log(e,t)
    },
    // disabledStartDate(startValue) {
    //   const endValue = this.endValue
    //   if (!startValue || !endValue) {
    //     return false
    //   }
    //   return startValue.valueOf() > endValue.valueOf()
    // },
    // 点击查询按钮触发
    queryLog(){ 
      
    },
  }
}
</script>
<style lang="scss" scoped>
.ant-calendar-picker{
  min-width:100%!important;
}
</style>