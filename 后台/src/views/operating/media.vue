<template>
  <div>
    <!-- 查询条件 -->
    <div>
      <a-card title="查询条件" :bordered="false" style="width: 100%;">
        <a-row>
          <a-col :span="24">
            <span style="margin-right:15px;">媒体类型</span>
            <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled">Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
            <span style="margin:0 15px;">媒体名称</span>
            <a-input style="width:10%;" />
            <a-button type="primary" style="margin-left:30px;">查询</a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div style="margin-top: 15px">
      <a-card :bordered="false" :hoverable="true" title="媒资数据源列表">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="margin: 5px 0 10px 2px">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        </div>
        <div style="margin-top: 15px">
          <!-- 表格 -->
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
            <!-- <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </span> -->
          </a-table>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      // 表头
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'index'
        },
        {
          title: '媒体名称',
          align: 'center',
          dataIndex: 'media_name'
        },
        {
          title: '媒体类型',
          align: 'center',
          dataIndex: 'media_type'
        },
        {
          title: '网址/账号',
          align: 'center',
          dataIndex: 'media_url'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'create_time'
        } 
      ],
      dataSource: [], 
    }
  }
}
</script>
<style lang="scss" scoped>
</style>