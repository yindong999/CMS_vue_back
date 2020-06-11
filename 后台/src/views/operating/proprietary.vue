<template>
  <div>
    <!-- 查询条件 -->
    <div>
      <a-card title="查询条件" :bordered="false" style="width: 100%;">
        <!-- <a-row>
          <a-col :span="24">
            <span style="margin-right:15px;">渠道名称</span>
            <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled">Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
            <span style="margin:0 15px;">渠道级别</span>
            <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled">Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
            <a-button type="primary" style="margin-left:30px;">查询</a-button>
          </a-col>
        </a-row> -->
      </a-card>
    </div>
    <!-- 自有发布渠道 -->
    <div class="self">
      <a-card title="自有发布渠道" :bordered="false" style="width: 100%;">
        <!-- <a-row>
          <a-col :span="24">
            <a-button type="primary">+ 新增</a-button>
          </a-col>
        </a-row>
        <div style="margin-top: 15px">
          <a-table
            style="height:500px"
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a style="#FF6A6A">删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </div> -->
      </a-card>
    </div>
  </div>
</template>
 <script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  // mixins: [JeecgListMixin],
  data() {
    return {
      // 表头
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'department_code'
        },
        {
          title: '渠道名称',
          align: 'center',
          dataIndex: 'department_name'
        },
        {
          title: '渠道级别',
          align: 'center',
          dataIndex: 'department_type'
        },
        {
          title: '所属品牌',
          align: 'center',
          dataIndex: 'contacter'
        },
        {
          title: '所属产业',
          align: 'center',
          dataIndex: 'contacter_mobile'
        },
        {
          title: '运营部门',
          dataIndex: 'create_date',
          align: 'center'
        },
        {
          title: '接入联系人',
          dataIndex: 'create_date',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'create_date',
          align: 'center'
        },
        {
          title: '接入时间',
          dataIndex: 'create_date',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: []
    }
  }
}
</script> 
<style lang="scss" scoped>
.self {
  margin-top: 12px;
}
</style>