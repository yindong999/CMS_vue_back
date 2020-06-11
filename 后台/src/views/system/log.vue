<template>
  <div>
    <!-- 顶部查询条件模块 -->
    <div style="background:#ECECEC; margin-bottom:12px">
      <a-card title="">
        <a-form layout="inline">
          <a-row>
            <!--发布时间-->
            <a-col :md="22" style="display:flex;align-items:center;"> 
              <a-row :gutter="24" style="width:100%;display:flex;align-items:center;">
                <a-col>操作时间</a-col>
                <a-col :md="4" :sm="6">
                    <a-date-picker  style="width:100%"
                     v-model="queryParam.startTime"
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
                      <a-date-picker style="width:100%"
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
            </a-col>
            <!-- 查询按钮 --> 
            <a-col class="col" style="position:absolute;right:0;">
              <a-button @click="queryLog" type="primary" class="queryBtn">
                <img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
                <span>查询</span>
                </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
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
</style>