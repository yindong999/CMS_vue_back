<template>
  <div>
    <!-- 触点渠道数，已发内容总数，现有素材总数 -->
    <div class="gutter-example">
      <div class="gutter-box bg" v-for="(item,index) in topData" :key="index">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="12">
            <div class="gutter-box1">{{item.name}}</div>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <div class="gutter-box2">
             
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="24">
            <div class="gutter-box3">
              <span @click="show_detail">
                <countTo class="cursor" :startVal="startVal" :endVal="Number(item.num)" :duration="2000"></countTo>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
	<div class="center">
		<p style="height: 48px;border-bottom: 1px solid #E7E8E9;line-height: 48px;padding-left: 24px;color: #3C3D43;font-size: 16px;font-weight: 500;">
			平台发布统计
			<span @click="handLook" style="display: inline-block;float: right;font-size: 14px;color: #767885;margin-right: 24px;cursor: pointer;">详情<a-icon style="margin-left: 6px;" type="right" /></span>
		</p>
		<div style="width:100%;height:303px" ref="chart">
			
		</div>
	</div>
	<a-modal
	      title="平台发布统计"
	      :visible="visible"
	      @cancel="handleCancel"
		  width="1200px"
		  :footer="null"
	    >
		<a-row :gutter="24" style="display:flex;align-items:center;margin-bottom: 12px;">
		    <!-- 审核状态 -->
		   <a-col>媒体平台</a-col>
		    <a-col :md="4" :sm="6">
		     <a-select  style="width:100%" @change="mediaPlatformChange" v-model='bannlId' allowClear placeholder="请选择媒体平台">
		     <a-select-option value>
		       全部
		     </a-select-option>
		      <a-select-option :value="key"  v-for="(value, key, index) in meidiaS"  :key="index">{{value}}</a-select-option>
		   </a-select>
		   </a-col>
		    <!-- 发布渠道 -->
		    <a-col>发布渠道</a-col>
		     <a-col :md="4" :sm="6">
		      <a-select style="width:100%"  @change="channelChange" v-model='channelChangeC' allowClear placeholder="请选择发布渠道">
		      <a-select-option value>
		        全部
		      </a-select-option>
		       <a-select-option v-for="(item,index) in channel" :key="index" :value="item.id" >{{item.channelName}}</a-select-option>
		    </a-select>
		    </a-col>
		    <a-col>选择日期</a-col>
		    <a-col :md="4" :sm="6">
		    	<a-date-picker placeholder="请选择开始日期" v-model="mytime" @change="onChangeA" style="width: 100%;">
		    		      
		    		</a-date-picker>
		    </a-col>
		    <a-col :md="4" :sm="6">
		    	<!-- <span class="spanName">时间</span> -->
		    		<!--<a-date-picker placeholder="请选择开始时间" />-->
		    		
		    		<a-date-picker placeholder="请选择结束日期" v-model="mytime" @change="onChangeO" style="width: 100%;">
		    		      
		    		</a-date-picker>
		    </a-col>
				
			<a-col style="position: absolute;right: 0px;">
			     <a-button
			      type="primary"
			      icon="search"
			      @click="onSearch"
						 			  style="background: #3264D5;"
			    >查询</a-button>
			</a-col>
		</a-row>
		
	      <a-table
	       style="margin-top: 16px;"
	        ref="table"
	        size="small"
	        :bordered="false"
	        rowKey="tabIndexByTable"
	        :columns="columns"
	        :dataSource="dataSource"
	        :pagination="ipagination"
	       
	      >
	      </a-table>
	    </a-modal>
	
    <div class="gutter-example">
      <a-row :gutter="16">
        <!-- 内容发布趋势 -->
        <a-col class="gutter-row" :span="12">
          <a-card title="内容发布趋势" :bordered="false" style="width: 100%;">
            <line-chart-multid :fields="visitFields" :dataSource="Vatis"></line-chart-multid>
          </a-card>
        </a-col>
        <!-- 内容热词云 -->
        <a-col class="gutter-row" :span="12">
          <a-card title="内容热词云" :bordered="false" style="width: 100%;">
            <word-cloud-chart
              id="echarts05"
              :finsh="finsh"
              :data="echarts05Data"
              width="89%"
              height="280px"
            />
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!-- 转发量趋势，评论量趋势，点赞量趋势 图表-->
    
    <a-modal v-model="isShow" :footer="null" width="360px">
      <a-row type="flex" justify="center">
        <img src="@/assets/gongzhonghao.jpg" alt="" style="width:180px;height:180px;">
      </a-row>
      <a-row style="color:#3C3D43;font-size:14px;margin:10px 0;" type="flex" justify="center">请扫描二维码</a-row>
      <a-row style="color:#767885;font-size:12px;" type="flex" justify="center">关注审核服务号并绑定账号，移动端审核更便捷</a-row>
    </a-modal>
  </div>
</template>

<script>
import vue from "vue"
import bar from '@/components/chart/Bar'
import { totalCount, trend,thirdPublishChannelList ,dataDictionary } from '@/api/api'
import { USER_INFO } from "@/store/mutation-types"
import LineChartMultid from '@/components/chart/LineChartMultid'
import WordCloudChart from './modules/WordCloudChart'
import countTo from 'vue-count-to'
import moment from 'moment';
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'Analysis',
  mixins: [JeecgListMixin],
  data() {
    return {
		channel:[],
		mytime:'',
		columns: [
			// {
			//   title: '序号',
			//   align: 'center',
			//   className: 'table_title',
			//   width: 100,
			//   customRender: (text, record, index) => {
			//     return `${(this.ipagination.current - 1) * this.ipagination.pageSize + (index + 1)}` //当前页数减1乘以每一页页数再加当前页序号+1
			//   }
			// },
			{
			  title: '媒体平台',
			  align: 'center',
			 
			  dataIndex: 'channelPlatform',
			  width: 250,
			  className: 'table_title'
			},
			{
			  title: '发布渠道',
			  align: 'center',
			  dataIndex: 'channelName',
			  width: 240,
			  className: 'table_title'
			},
			{
			  title: '发布日期',
			  align: 'center',
			  dataIndex: 'publishTime',
			  width: 245,
			  className: 'table_title'
			},
			
			{
			  title: '发布内容数',
			  align: 'center',
			  dataIndex: 'amount',
			  width: 240,
			  className: 'table_title'
			},
			
		],
		dataSource:[],
		url: {
			 list: '/cms/sys/content/statistics/getChannelSun'
		 },
	  visible:false,//更多对话框
      finsh: false, // 词云数据是否请求完成的标志
      startVal: 0,
      topData: [
        { id: 1, name: '接入渠道数', num: 0 },
        { id: 2, name: '发布内容总数', num: 0 },
        { id: 3, name: '报备内容总数', num: 0 }
      ],
      bottomData: [
        { id: 1, name: '转发量趋势', val: [] },
        { id: 2, name: '评论量趋势', val: [] },
        { id: 3, name: '点赞量趋势', val: [] }
      ],
      barData: [],
	  meidiaS:[],
      // 内容发布趋势折线图的图例legend
      visitFields: [],
      // 内容发布趋势折线图的数据
      visitInfo: [],
      echarts05Data: [],
      isShow:false,
	  channelChangeC:'',
	  nub:[1,2,3,4,5],
	  mediaPlate:'',
	  Vatis:[],
	  bannlId:''
    }
  },
  created() {
    var userInfo = vue.ls.get(USER_INFO)
    // if(!userInfo.userWxOpenId && userInfo.roleName.indexOf("后台审核人员") !== -1){
    //   this.isShow = true;
    // }
  },
  mounted() {
	  this.getAll()
	  
    // 总数统计接口
    totalCount('').then(res => {
      if (res.code === 200) {
        this.topData[2].num = res.data.totalMaterialCount
        this.topData[0].num = res.data.totalChannelCount
        this.topData[1].num = res.data.totalSendCount
      }else if(res.code!==400){
        this.$message.error(res.message)
      }
    })
    //  趋势分析接口
    trend('').then(res => {
      if (res.code === 200) {
        var rd = res.data
        // 获取内容热词云
        this.echarts05Data = rd.hotTerms
        this.finsh = true
		
        this.visitInfo = rd.contentTrend
		this.visitInfo.forEach((item,index)=>{
			for (var k in item){
				if(k=='垂直媒体'){
					delete item[k];
				}
				if(k=='小红书'){
					delete item[k];
				}
				if(k=='头条'){
					delete item[k];
				}
				if(k=='知乎'){
					delete item[k];
				}
				if(k=='其它'){
					delete item[k];
				}
				if(k=='快手'){
					delete item[k];
				}
				if(k=='官网'){
					delete item[k];
				}
				if(k=='社区'){
					delete item[k];
				}
				if(k=='新闻媒体'){
					delete item[k];
				}
				
				// console.log(k)
			} 
			this.Vatis.push(item) 
		})
		console.log(this.Vatis,'this.Vatis')
		this.initCharts(rd.commentTrend);
        var keys = Object.keys(rd.contentTrend[0])
        var resu = keys.filter(function(item, index, array) {
          if (item != 'tian' && item != 'type') {
            return item
          }
        })
        this.visitFields = resu
        // 获取转发量趋势数据
        this.pushData(rd.relayTrend, 0)
        // 获取评论趋势数据
        this.pushData(rd.commentTrend, 1)
        // 获取点赞量数据
        this.pushData(rd.giveupTrend, 2)
      }else if(res.code!==400){
        this.$message.error(res.message)
      }
    })
  },
  methods: {
	 mediaPlatformChange(e) {
	   console.log(e)
	   this.bannlId=e;
	    this.queryParam.mediaPlatform = e
	 },
	 channelChange(val) {
	   // 选择渠道
	   console.log(val,'channelChangeC')
	   this.channelChangeC =val ? val : ''
	 },
	  onChangeA(date, dateString){//开始日期
	  	console.log(dateString,"开始时间")
	  	this.publishTimeS = dateString
	  	this.queryParam.publishTimeS = dateString
	  	
	  },
	  onChangeO(date, dateString){//结束日期
	  	console.log(date,"结束日期")
	  	this.publishTimeE = dateString
	  	this.queryParam.publishTimeE = dateString
	  },
	  onSearch(){
		  console.log(this.channePres,'this.channePres');
		  this.queryParam.channelId = this.channelChangeC;//渠道
		  
		  // this.queryParam.
		  this.searchQuery();
	  },
	  getAll(){
		  let params = {
		  	page:1,
		  	size:1000
		  }
		dataDictionary({ dataType: 'mediaPlatform' }).then(res => {
		  if (res.code === 200) {
		    this.meidiaS = res.data
		  }else if(res.code!==400){
		    this.$message.error(res.message)
		  }
		})
		thirdPublishChannelList(params).then(res=>{
			if(res.code===200){
				this.channel = res.data.list
				console.log(this.channel,'this.channel')
			}else{
				this.$message.error(res.message)
			}
		})  
	  },
	 
	  initCharts (red) {
	  　　let myChart = this.$echarts.init(this.$refs.chart);
	  　　console.log(this.$refs.chart)
	  　　// 绘制图表
	  
	  　　myChart.setOption({
		  　
				legend: {type: 'plain'},
				tooltip: {},
				
				dataset: {
					
					source: [
						['product','新浪微博',  '微信公众号', '抖音','小红书','知乎', '头条号', '官网','社区','其他'],
						[red[0].trendDate, this.visitInfo[0].新浪微博/1,this.visitInfo[0].微信公众号/1,this.visitInfo[0].抖音/1],
						[red[1].trendDate, this.visitInfo[1].新浪微博/1,this.visitInfo[1].微信公众号/1,this.visitInfo[1].抖音/1],
						[red[2].trendDate, this.visitInfo[2].新浪微博/1,this.visitInfo[2].微信公众号/1,this.visitInfo[2].抖音/1],
						[red[3].trendDate, this.visitInfo[3].新浪微博/1,this.visitInfo[3].微信公众号/1,this.visitInfo[3].抖音/1],
						[red[4].trendDate, this.visitInfo[4].新浪微博/1,this.visitInfo[4].微信公众号/1,this.visitInfo[4].抖音/1],
						[red[5].trendDate, this.visitInfo[5].新浪微博/1,this.visitInfo[5].微信公众号/1,this.visitInfo[5].抖音/1],
						[red[6].trendDate, this.visitInfo[6].新浪微博/1,this.visitInfo[6].微信公众号/1,this.visitInfo[6].抖音/1],
						
						// [red[0].trendDate, this.visitInfo[0].新浪微博/1,this.visitInfo[0].微信公众号/1,this.visitInfo[0].抖音/1,
						// this.visitInfo[0].小红书/1,this.visitInfo[0].知乎/1,this.visitInfo[0].头条号/1,this.visitInfo[0].官网/1,
						// this.visitInfo[0].社区/1,this.visitInfo[0].其他/1,], // 此为 渠道全部存在的 样式
					]
				},
				
				xAxis: {type: 'category',
					axisLine: {
						lineStyle: {
							type: 'solid',
							color: '#55565D',//左边线的颜色
							
						}
					},
					},
				yAxis: {
					axisLine: {
						lineStyle: {
							type: 'solid',
							color: '#55565D',//左边线的颜色
							
						}
					},
					splitLine:{
							show:true,
							lineStyle:{
								type:'dashed'
							},
						}	
				},
				// Declare several bar series, each will be mapped
				// to a column of dataset.source by default.
				series: [
					{type: 'bar',color:'#85A5FF', },
					{type: 'bar',color:'#5CDBD3', },
					{type: 'bar',color:'#FFC069', },
					// {type: 'bar',color:'#69C0FF', barWidth:8}, // 此为 全部的样式
					// {type: 'bar',color:'#85A5FF', barWidth:8},
					// {type: 'bar',color:'#B37FEB', barWidth:8},
					// {type: 'bar',color:'#FF85C0', barWidth:8},
					// {type: 'bar',color:'#FFC069', barWidth:8},
					// {type: 'bar',color:'#FFE58F', barWidth:8},
				]
		})
	},
    // 点击首页顶部的触点渠道数，已发内容总数，现有素材总数对应的数字时触发
    show_detail() {
      console.log('数字')
    },
    // 将获取的趋势数据整理
    pushData(data, index) {
      data.forEach(item => {
        var obj = {}
        obj.x = item.trendDate.substring(5)
        obj.y = item.count
        this.bottomData[index].val.push(obj)
      })
    },
	handLook(){
		this.publishTimeE=''
		this.publishTimeS=''
		this.channelChangeC=''
		this.bannlId=''
		this.mytime=''
		console.log("123")
		this.queryParam.publishTimeE=''
		this.queryParam.publishTimeS=''
		this.queryParam.mediaPlatform=''
		this.queryParam.channelId=''
		this.searchQuery();
		this.visible = true
	},
	handleCancel(){
		
		this.visible = false
	}
	
  },
  components: {
    bar,
    LineChartMultid,
    WordCloudChart,
    countTo
  }
}
</script>
<style lang="scss" scoped>
.gutter-example {
  margin-bottom: 8px;
}
.gutter-example >>> .ant-row > div {
  background: transparent;
  border: 0;
}
.center{
	width: 100%;
	height: 352px;
	background: white;
	margin-bottom: 12px;
}
.bg {
  // background:url('../../assets/bg.png') 100% 100% no-repeat!important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  background-image: url('../../assets/bg.png') !important;
  width: 32.6%;
  display: inline-block;
}
.bg:nth-of-type(2) {
  margin: 0 1%;
}
.gutter-box {
  background: #fff;
  padding: 15px 20px;
  .gutter-box2 {
    text-align: right;
  }
  .gutter-box1,
  .gutter-box2 {
    color: #fff;
    user-select: none;
  }
  .gutter-box3 {
    font-size: 2.5rem;
    font-weight: 600;
    color: #fff;
    height: 100%;
    user-select: none;
  }
}
.middle {
  height: 18rem;
  .title {
    font-size: 16px;
    font-weight: 550;
  }
}

.bott {
  height: 13rem;
}
#container {
  width: 100%;
  height: 100%;
}
.cursor {
  cursor: pointer;
}
</style>