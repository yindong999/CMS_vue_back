<template>
	<div>
	<!-- 顶部查询条件模块 -->
		<div style="background:#ECECEC; margin-bottom:12px" :bodyStyle="{'padding-top':'16px','padding-bottom':'17px'}">
			<a-card title="" :bordered="false" style="width: 100%;" class="statementQuery">
				<a-row class="formStyle" type="flex" justify="space-between">
				<a-row class="leftDiv">
				<!-- 审核状态 -->
					<a-col style="display:flex;align-items:center;" :span="8">
						<span class="textWidth4">内容标题</span>
						<a-input style="width:calc(100% - 97px);margin-left: 16px;" defaultValue allowClear v-model="ContTile" placeholder="输入标题关键字搜索"/>
					</a-col>
				<!-- 媒体平台 -->
					<a-col style="display:flex;align-items:center;" :span="8">
						<span class="textWidth4">发布部门</span>
						<a-select style="width:calc(100% - 97px);margin-left: 16px;" @change="mediaChange" placeholder="请选择发布部门" :showSearch="true" :filter-option="filterOption" allowClear >
							<a-select-option value>全部</a-select-option>
							<a-select-option  v-for="(item,index) in media" :value="item.id" :key="index" >{{item.departmentName||'空'}}</a-select-option>
						</a-select>
					</a-col>
				<!-- 账号 -->
					<a-col style="display:flex;align-items:center;" :span="8">
						<span class="textWidth4">媒体平台</span>
						<a-select  style="width:calc(100% - 97px);margin-left: 16px;" @change="plateformChange" placeholder="请选择媒体平台" :showSearch="true" :filter-option="filterOption" allowClear>
							<a-select-option value>全部</a-select-option>
							<a-select-option  v-for="(item,index) in plateform" :value="item.mediaPlatformCode" :key="index">{{item.mediaPlatformName||'空'}}</a-select-option>
						</a-select>
					</a-col>
				<!-- 内容标题 -->
					<!-- <a-col>评论状态</a-col>
					<a-col :md="4" :sm="6">
						<a-select defaultValue style="width:100%" @change="aduitChange">
							<a-select-option value><span style="color:#A6A8B4">请选择状态</span></a-select-option>
							<a-select-option :value="index+1" v-for="(item,index) in status" :key="index">{{item}}</a-select-option>
						</a-select>
					</a-col> -->
				</a-row>
					<div class="btnCol"  style="width:90px;">
					<a-button @click="search" type="primary" class="queryBtn">
						<img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
						查询</a-button>
					</div>
					</a-row>
				<a-row v-if="isSpread" class="leftDiv"
           			 style="margin-top: 16px;display:flex;align-items:center;">
					<!-- 账号 -->
					<a-col style="display:flex;align-items:center;" :span="8">
						<span class="textWidth4" style="text-align:right;">账号</span>
						<a-select  style="width:calc(100% - 97px);margin-left: 16px;" v-model="channelChangeC" @change="channelChange" placeholder="请选择账号" :showSearch="true" :filter-option="filterOption" allowClear>
							<a-select-option value>全部</a-select-option>
							<a-select-option  v-for="(item,index) in channel" :value="item.id" :key="index">{{item.channelName}}</a-select-option>
						</a-select>
					</a-col>
					<!-- 评论内容先注释 2020-08-05 start -->
					<!-- <a-col style="display:flex;align-items:center;" :span="8">
						<span class="textWidth4">评论内容</span>
						<a-input style="width:calc(100% - 97px);margin-left: 16px;" defaultValue allowClear v-model="content " placeholder="输入内容关键字搜索"/>
					</a-col> -->
					<!-- 评论内容先注释 2020-08-05 end -->
				</a-row>
				<a-row>
					<div class="outerText"  :style="{'display': 'flex','justify-content': 'center','margin': '0 auto','margin-top':'16px'}">
						<span @click="toggle" style="cursor:pointer;">
						<span class="spreadText">{{isSpread?'收起':'展开'}}</span>
						<a-icon :type="!isSpread?'down':'up'" class="downUp" style="color:#3264D5;"/>
						</span>
					</div>
				</a-row>
				<!-- 展开/收起按钮 -->
			
				<!-- <a-row type="flex" justify="end" style="margin-top: 8px;">
					<a-button type="primary" style="background:#3264D5" icon="search" @click="search">查询</a-button>
				</a-row> -->
			</a-card>
		</div>
	<!-- 页面中的表格 -->
		<a-card title="评论列表" :headStyle="headStyle" :bodyStyle="{'padding-top':'0'}">
			<div style="background:#fff;">
				<a-table
				ref="table"
				size="small"
				:bordered="bordered"
				rowKey="ccId"
				:columns="columns"
				:dataSource="dataSource"
				:pagination="ipagination"
				:loading="loading"
				@change="handleTableChange"
				:scroll="{scrollToFirstRowOnChange:true,y:tabHeight}"
				>
				<span slot="template_name" slot-scope="text, record">
					<a-popover title trigger="hover" style="cursor:pointer">
						<template slot="content">
							<p style="maxWidth:300px;word-break:break-all;">{{record.template_name}}</p>
						</template>
						{{record.template_name}}
					</a-popover>
				</span>

					<span slot="content" slot-scope="text, record">
						<a style="color:#595959" onmouseover="this.style.color='#3264D5';" onmouseout="this.style.color='#595959';">{{record.title}}</a>
					</span>
					<span slot="content" slot-scope="text, record">
						<a-popover title trigger="hover"  style="cursor:pointer">
							<template slot="content">
								<p style="maxWidth:300px;word-break:break-all;">{{record.content}}</p>
							</template>
							{{record.content}}
						</a-popover>
					</span>
					<span slot="shareCount" slot-scope="text, record">{{record.shareCount?record.shareCount:0}}</span>
					<span
					slot="commentCount"
					slot-scope="text, record"
					>{{record.commentCount?record.commentCount:0}}</span>
					<span slot="giveCount" slot-scope="text, record">{{record.giveCount?record.giveCount:0}}</span>
					<span slot="action" slot-scope="text, record">
						<a  @click="handleLook(record)" style="margin:0 4px;color:#3264D5;">详情</a>
						<a  @click="handleTop(record)" v-show="(record.send_channel_platform_code==='douyin' || record.send_channel_platform_code==='wechat')&&record.parentId=='0'" style="margin:0 4px;color:#3264D5;">置顶</a>
						<a-popconfirm
						title="确定删除吗?" @confirm="() => handleDelete(record)">
							<a style="color:#3264D5;margin:0 4px;" v-show="(record.send_channel_platform_code==='sinaBlog' || record.send_channel_platform_code==='wechat')">删除</a>
						</a-popconfirm>
					</span>
				</a-table>
			</div>
		</a-card>
	<!-- 点击查看或者标题时显示的弹窗 -->
		<a-modal :centered="true" title="评论详情" v-model="visible" :cancel="cancel" width="800px" height="564px" >
			 <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="commit" 
					:disabled="disabled"
					:class="disabled== true ? 'buttonGray' : 'buttonBlue' "
					>
					确认
					</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="cancel" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>
			<a-row style="margin-bottom:30px;">
				<a-col :span="24">
					<a-row>
						<a-col :span="2" style="margin-left:28px;text-align: right; margin-right: 24px;width: 80px;color: #767885;">内容标题:</a-col>
						<a-col :span="18" style="color: #55565D;">{{content}}</a-col><br/><p></p>
						<a-col :span="2" style="margin-left:28px;text-align: right; margin-right: 24px;width: 80px;color: #767885;">内容发布人:</a-col>
						<a-col :span="4" style="color: #55565D;">{{athur}}</a-col><br/><p></p>
						<a-col :span="2" style="margin-left:28px;text-align: right; margin-right: 24px;width: 80px;color: #767885;">账号:</a-col>
						<a-col :span="4" style="color: #55565D;">{{contentB}}</a-col><br/><p></p>
						<a-col :span="2" style="margin-left:28px;text-align: right; margin-right: 24px;width: 80px;color: #767885;">发布部门:</a-col>
						<a-col :span="4" style="color: #55565D;">{{contentF}}</a-col><br/><p></p>
						<a-col :span="2" style="color: #55565D;;margin-left:28px;text-align: right; margin-right: 24px;width: 80px;color: #767885;">评论内容:</a-col>
						<a-col style="display: inline-block; width: 500px;margin-right: 24px;overflow: hidden;" >
							<p
							style="
							color: #55565D;
							resize: none;padding-left: 0;border: none;min-height:20px ;"
							>{{contentA}}</p>
							<a style="color:#3264D5 ;font-size: 14px;cursor: pointer;" @click="revert">回复</a>
							<a-textarea
							style="outline:none;overflow: auto;color: #55565D;resize: none;"
							v-model="Back"
							v-if="isOpen"
							placeholder=""
							:maxLength="140"
							:auto-size="{ minRows: 3, maxRows: 5 }"
							@change="changeText"
							/>
							<p style="text-align: right;color: #767885;height:20px;margin:0;"><span v-show="TextFlod" style="margin-right:20px;">最多输入140个字符</span><a style="color:#3264D5 ;font-size: 14px;cursor: pointer;" v-if="isOpen" @click="packUp">收起评论</a></p>
						</a-col><br/><p></p>
						<a-col :span="2" style="margin-left:28px;text-align: right;margin-right: 24px;width: 80px;color: #767885;">被评论数:</a-col>
						<a-col :span="4" style="color: #55565D;">{{'无'}}</a-col><br/><p></p>
						<a-col :span="2" style="margin-left:28px;text-align: right;margin-right: 24px;width: 80px;color: #767885;">被点赞数:</a-col>
						<a-col :span="4" style="color: #55565D;">{{'无'}}</a-col><br/><p></p>
						<!-- <a-col :span="2" style="margin-left:28px;text-align: right;margin-right: 24px;width: 80px;">是否启用:</a-col>
						<a-col :span="4">
						<a-switch default-checked @change="onChange" />
						</a-col><br/> -->
					</a-row>
				</a-col>
			</a-row>
			<!-- <p style="padding: 0;margin: 0;">
				<a-row style="padding-top: 24px; border-top: 1px solid #E7E8E9;">
							<a-col :span="24" style="width: 100%;text-align: center;">
								<a-button type="primary" class="button" @click="commit">确定</a-button>
								<a-button class="button" @click="cancel">取消</a-button>
							</a-col>
				</a-row>
			</p> -->
		</a-modal>
		<tooltip ref="tooltip" :message="message" :type="type"></tooltip>
	</div>
</template>
<script>
	import Vue from "vue"
	import { USER_AUTH,USER_INFO } from "@/store/mutation-types"
	import { JeecgListMixin } from '@/mixins/JeecgListMixin'
	import { dataDictionary, contentManage , postAlist ,channelList , postByAlist,getdepartment,thirdPublishChannelList,backContent,deleteAlist,contentTop} from '@/api/api'
	import tooltip from "@/components/tooltip/tooltip.vue"
	import { filterMediaPlatform } from '@/utils/util.js';
	export default {
		mixins: [JeecgListMixin],
		components:{ tooltip }  ,
		data() {
			return {
				content:'',// 评论内容
				isSpread:false,
				disabled:false,
				bordered:false,
				message:'操作成功',
      			type:'info',
				TextFlod:false,
				headStyle:{
				    "text-align":"center",
					"border-bottom":"none" 
				},
				newstemplateId:'',
				content:'', // 标题
				athur:'', // 作者
				contentB:'', // 渠道
				contentF:'', // 部门
				contentA:'', // 内容
				media:[],
				status:["禁用","正常"],
				channel:[],
				ContTile:"",
				isOpen:false,
				Back:'',
				Index:1,
				//按钮权限，默认拥有全部权限
				authButton:{
					reviewBtn: true
				},
				visible: false, // 弹窗显示与否的标志
				category: null, // 记录所有分类下的内容框的高度
				oneData: {},
				queryParam: {},
				// 表头
				columns: [
					{
						title: '内容标题',
						align: 'center',
						width:170,
						dataIndex: 'template_name',
						scopedSlots: { customRender: 'template_name' },
						ellipsis:true,
						className:'table_title'

					},
					{
						title: '发布部门',
						align: 'center',
						width:150,
						dataIndex: 'department_name',
						className:'table_title',
						ellipsis: true,
					},
					{
						title: '媒体平台',
						align: 'center',
						width:100,
						dataIndex: 'sendChannelPlatformCode',
						ellipsis:true,
						className:'table_title'
					},
					{
						title: '账号',
						align: 'center',
						width:150,
						dataIndex: 'send_channel_name',
						className:'table_title',
						ellipsis: true,

					},
					{
						title: '评论内容',
						align: 'center',
						width:200,
						ellipsis:true,
						dataIndex: 'content',
						scopedSlots: { customRender: 'content' },
						className:'table_title',
					},
					// {
					// 	title: '评论倾向',
					// 	align: 'center',
					// 	dataIndex: '',
					// 	className:'table_title',
					// 	ellipsis: true,

					// },
					{
						title: '评论时间',
						width:150,
						className:'table_title',
						align: 'center',
						dataIndex: 'ccCreatetime',
						ellipsis: true,

					},
					{
						className:'table_title',
						title: '操作',
						width: 150,
						dataIndex: 'action',
						align: 'center',
						scopedSlots: { customRender: 'action' },
						ellipsis: true,
					}
				],
				dataSource: [],
				url: {
				list: '/cms/content/comment/listSendDetail'
				},
				postList:[],
				mediaChangeC:'', //选择品牌
				channelChangeC:'', //选择渠道
				aduitChangeC:'', //选择评论
				plateform:[]
			}
		},
		mounted() {
			let user = Vue.ls.get(USER_INFO)
			let params = {
				type:1,
				usercode:user.userAccount
			}
			channelList(params).then(res=>{
				let p = []
				if(res.code ===200){
						console.log('res.data====',res.data)
					//  res.data.forEach((item,index)=>{
					// 	 console.log(item)
					// 	 item.channelInfoList.forEach((itd)=>{
					// 		 this.channel.push(itd)
					// 	 })
					// })
					// 调用util中的方法过滤数据，只筛选出微信，微博，抖音的数据
					this.plateform = filterMediaPlatform(res.data) 
					var allMedia2 = []
					this.plateform.forEach(item=>{
						allMedia2 =  allMedia2.concat(item.channelInfoList)
					})
					console.log('allMedia2',allMedia2)
					this.channel = allMedia2
				}else{
					// this.$message.error(res.message)
					this.message = res.message
					this.type = "error"
					this.warnMethod()
				}
			})
			this.getAll()
			document.onkeydown = this.keydown;
			
		},
		methods: {
			plateformChange(val){
			  if(val===''||val==undefined){
				this.queryParam.sendChannelPlatformCode = ''
				this.queryParam.channelId = ''
				var allMedia2 = []
				this.plateform.forEach(item=>{
					allMedia2 =  allMedia2.concat(item.channelInfoList)
				})
				this.channel = []
				this.channel = allMedia2
			}else{
				this.channel = []
				var newArr = this.plateform.filter(item=>{
				return item.mediaPlatformCode === val
				})
				this.channel = newArr[0].channelInfoList 
				console.log('newArr',newArr)
				this.queryParam.sendChannelPlatformCode = newArr[0]['mediaPlatformCode']
			}
			this.queryParam.channelId = ''
			this.channelChangeC = ''
			},
			packUp(){
				this.isOpen = false;
				this.TextFlod = false;
				this.Back = ""
			},
			keydown(e){//全局搜索
				   var currKey=0,e=e||event; 
				   currKey=e.keyCode||e.which||e.charCode;//支持IE、FF 
				   if (currKey == 13){
					  this.search();
					  }
			},
			handleTop(recd){//定置

				let params= {
					"newstemplateId": recd.template_id,
						"channelId": recd.send_channel_id,
						"code": "",
						"index": '',
						"itemId": recd.return_msg_data_id,
						"orderNo": '',
						"page": '',
						"size": '',
						"videoCommentTopBody": {
							"commentId": recd.comment_id,
							"itemId": recd.return_msg_data_id,
							'top':true
						}
				}
				contentTop(params).then(res=>{
					if(res.code===200){
						this.message = res.message
						this.type='info'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
					}else{
						this.message = res.message
						this.type='error'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
					}
				})
			},
			handleDelete(recd){//删除评论
				console.log(recd)
				let params= {
					"newstemplateId": recd.template_id,
						"channelId": recd.send_channel_id,
						"code": "",
						"index": '',
						"itemId": recd.return_msg_data_id,
						"orderNo": '',
						"page": '',
						"size": '',
						"videoCommentReplyBody": {
							"commentId": recd.comment_id,
							"itemId": recd.return_msg_data_id
						}
				}
				deleteAlist(params).then(res=>{
					if(res.code ===200){
						this.message = res.message
						this.type='info'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
						this.searchQuery();
					}else{
						this.message = res.message
						this.type='error'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
					}
				})
			},
			changeText(e){//限制输入框数字提示
				if(this.Back.length>=140){
					this.TextFlod=true
				}else{
					this.TextFlod=false
				}
			},
			getAll(){
				let params = {
					page:1,
					size:1000
				}
				console.log("getALL执行了")
				getdepartment(params).then(res=>{
					if(res.code===200){
						this.media = res.data.list
					}else{
						this.message = res.message
						this.type='error'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
					}
				})
				// thirdPublishChannelList(params).then(res=>{
				// 	if(res.code===200){
				// 		this.channel = res.data.list
				// 	}else{
				// 		this.message = res.message
				// 		this.type='error'
				// 		this.$refs.tooltip.visible = true
				// 		this.$refs.tooltip.alertVisible = true
				// 		setTimeout(()=>{
				// 		  this.$refs.tooltip.cancel()
				// 		},3000)
				// 	}
				// })
			},
			mediaChange(e){ // 选择 部门
			console.log(e)
				this.mediaChangeC = e?e:'';
			},
			channelChange(e){ // 选择渠道
				this.channelChangeC=e?e:"";
			},
			aduitChange(e){// 选择评论状态
				this.aduitChangeC=e?e:""
			},
			search(e){ // 搜索
				//搜索
				this.queryParam.templateName = this.ContTile; // 标题
				this.queryParam.sendChannelId= this.channelChangeC;//发布人部门
				this.queryParam.departmentId = this.mediaChangeC;//渠道
				this.queryParam.content = this.content;//渠道
				// this.queryParam.
				console.log('this.queryParam',this.queryParam)
				this.searchQuery();
				// let params={
				// 	"templateName":this.ContTile,
				// 	"sendChannelId":this.channelChangeC,
				// 	"departmentId":this.mediaChangeC,
				// 	"page":1,
				// 	"size":15
				// };
				// postByAlist(params).then(res=>{
				// 	if(res.code===200){
				// 		console.log(res.data.list,"dataSource")
				// 		this.dataSource = res.data.list;
				// 		this.dataSource.forEach((val,index)=>{
				// 			val.tabIndexByTable = index+1;
				// 		})
				// 	}
				// })
			},
			warnMethod(){
				this.$refs.tooltip.visible = true
				this.$refs.tooltip.alertVisible = true
				setTimeout(()=>{
				this.$refs.tooltip.cancel()
				},3000)
			},
			//确定
			commit(){
				if(this.Back){
					this.disabled=true;
					let params={
						"newstemplateId": this.newstemplateId,
						"channelId": this.oneData.send_channel_id,
						"code": "",
						"index": '',
						"itemId": this.oneData.weibo_mid?this.oneData.weibo_mid:this.oneData.return_msg_data_id,
						"orderNo": '',
						"page": '',
						"size": '',
						"videoCommentReplyBody": {
							"commentId": this.oneData.comment_id,
							"content":this.Back ,
							"itemId": this.oneData.weibo_mid?this.oneData.weibo_mid:this.oneData.return_msg_data_id
						}
					}
					backContent(params).then(res=>{
						if(res.code ===200){
							this.disabled=false;
							this.message = res.message
							this.type='info'
							this.$refs.tooltip.visible = true
							this.$refs.tooltip.alertVisible = true
							setTimeout(()=>{
							  this.$refs.tooltip.cancel()
							},3000)
							this.Back = "";
							//将数据 归纳在 一块 提交到 后台
							this.visible=false;
							this.isOpen=false;
							this.searchQuery();
						}else{
							this.message = res.message
							this.type='error'
							this.$refs.tooltip.visible = true
							this.$refs.tooltip.alertVisible = true
							setTimeout(()=>{
							  this.$refs.tooltip.cancel()
							},3000)
							this.Back = "";
						}
					})
				}else{
					this.visible=false;
					this.isOpen=false;
				}


			},
			//取消
			cancel(){
				this.visible=false;
				this.isOpen=false;
				this.TextFlod=false;
				this.Back = "";
			},
			//回复
			revert(e){
				this.isOpen = true;
				console.log(this.isOpen);
			},
			//评论详情中的是否启用
			onChange(checked) {
				console.log(`a-switch to ${checked}`);
			},
			// 点击查看按钮触发
			handleLook(e) {
				this.newstemplateId = e.template_id;
				this.isOpen = false;
				this.oneData = e;
				this.visible = true;
				this.content = e.template_name;
				this.contentF= e.department_name;
				this.contentB= e.send_channel_name;
				this.contentA= e.content;
				this.athur=e.creator ;
				postAlist({"id":e.ccId}).then(res=>{
					if(res.code === 200){
						this.postList = res.data
					}else{
						this.message = res.message
						this.type='error'
						this.$refs.tooltip.visible = true
						this.$refs.tooltip.alertVisible = true
						setTimeout(()=>{
						  this.$refs.tooltip.cancel()
						},3000)
					}
					})
				},
		},
		beforeDestroy(){
			document.onkeydown=null;
		}		
	}

</script>
<style lang="scss" scoped>
	.top_row {
		margin: 15px 0;
		border-bottom: 1px dashed #dfe0eb;
	}
	.col-12 {
		position: absolute;
		top: 8px;
		right: 0;
		width: 50%;
	}
	.col-24 {
		display: flex;
		justify-content: space-between;
	}
	.show {
		height: 223px;
		transition: height 0.5s;
		overflow: hidden;
	}
	.hidden {
		height: 0;
		transition: height 0.5s;
		overflow: hidden;
	}
	.tag {
		padding: 0 15px;
		cursor: pointer;
		user-select: none;
		margin-bottom: 15px;
		display: inline-block;
	}
	.txt {
		color: #378ae4;
	}
	.ant-modal {
		width: 80% !important;
	}
	.detail_title {
		text-align: center;
		font-size: 22px;
		font-weight: 600;
	}
	.button{
		width: 108px;
		height: 36px;
		margin-right: 24px;
	}
	.mouseHover {
		color: #595959;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		width: 150px;
		display: inline-block;
	}
	.a-card{
		.title{
			color: red;
		}
	}
	.buttonGray{
			background: rgb(245,245,245);
			color: #55565D;;
			width: 115px;
			height: 36px;
		}
	.buttonBlue{
			background: #3264D5;
			color: white;
			width: 115px;
			height: 36px;
		}
</style>