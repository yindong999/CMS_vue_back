 <template>
  <div>
    <div v-show="spinning" style="width:100%;height:100%;position:fixed;background:#fff;opacity:0.6;left:0;top:0;z-index:1010;">
        <a-spin :spinning="true" tip="上传中..." size="large" style="position:fixed;top:50%;left:50%;z-index:100;color:#3264D5;"/>
      </div>
    <!-- 查询条件 -->
    <div :class="[flag?'block':'none']">
      <a-card title="" :bordered="false" style="width: 100%;margin-bottom:12px;">
         <a-form layout="inline" @keyup.enter.native="queryThirdList">
          <a-row class="formStyle" style="width:100%;">
          <a-row class="leftDiv">
            <a-col style="display:flex;align-items:center;" :span="8">
            <span class="textWidth4">媒体平台</span>
            <a-select
                  placeholder="请选择媒体平台" allowClear
                  @change="mediaPlatformChange"
                    style="width:calc(100% - 97px);margin-left: 16px;"
                  :showSearch="true" :filter-option="filterOption"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in mediaPlate"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
              </a-col>
              <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">渠道名称</span>
                  <a-input
                  allowClear
                  placeholder="请填写渠道名称"
                  v-model="queryParam.channelName"
                  @change="channelNameChange"
                    style="width:calc(100% - 97px);margin-left: 16px;"
                />
              </a-col>
              <a-col style="display:flex;align-items:center;" :span="8">
                  <span class="textWidth4">渠道类别</span>
                    <a-select
                placeholder="请选择渠道类别" allowClear
                @change="channelLevelChange"
                style="width:calc(100% - 97px);margin-left: 16px;"
                :showSearch="true" :filter-option="filterOption"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option
                  :value="key"
                  v-for="(value, key, index) in channelLevel"
                  :key="index"
                >{{value}}</a-select-option>
              </a-select>
			  	</a-col>
			  	</a-row>
              <div class="btnCol"  style="width:170px;"> 
                <a-button @click="queryThirdList" type="primary" class="queryBtn">
                  <img src="@/assets/searchImg.png" class="queryBtnImg" alt="">
                  <span>查询</span>
                </a-button>
              </div> 
          </a-row>
          <a-row v-if="isSpread" class="leftDiv" style="display:flex;align-items:center;margin-top:16px;">
						 <a-col style="display:flex;align-items:center;" :span="8">
              <span class="textWidth4">渠道状态</span>
							<a-select
                placeholder="请选择渠道状态" 
                @change="changeUp"
                style="width:calc(100% - 97px);margin-left: 16px;"
                :showSearch="true" :filter-option="filterOption"
              >
                <a-select-option
                  :value="key"
                  v-for="(value, key, index) in StandUpAndDown"
                  :key="index"
                >{{value.status}}</a-select-option>
              </a-select>
						</a-col>
          </a-row> 
          <!-- 展开/收起按钮 -->
          <div class="outerText"  :style="{'display': 'flex','justify-content': 'center','margin': '0 auto','margin-top':!isSpread?'16px':'0'}">
            <span @click="isSpread = !isSpread" style="cursor:pointer;">
              <span class="spreadText">{{isSpread?'收起':'展开'}}</span>
              <a-icon :type="!isSpread?'down':'up'" class="downUp" style="color:#3264D5;"/>
            </span>
          </div> 
         </a-form>
        <!-- <a-row style="margin-top: 8px;" type="flex" justify="end">
                <a-button
                  type="primary"
                  style="float:right;"
                  icon="search"
                  @click="queryThirdList"
                >查询</a-button>
        </a-row> -->
      </a-card>
    </div>
    <!-- 第三方账号 -->
    <div :class="['self',flag?'block':'none']">
      <a-card title="账号" :headStyle="headStyle" :bodyStyle="bodyStyle" :bordered="false" style="width: 100%;">
        <a-button icon="plus" style="padding:0 16px;position: absolute;right: 32px;" slot="extra"
         v-if="authButton.hasOwnProperty('createBtn')&&authButton.createBtn" type="primary" @click="add">新增</a-button>
        <div>
          <a-table
            style="height:500px"
            ref="table"
            size="small"
            :bordered="bordered"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="action2" slot-scope="text, record">
              <img
                :src="record.imgUrl"
                style="width:50px;height:30px;cursor:pointer;"
                alt
                @click="lookImg(record)"
              />
            </span>
            <span slot="ownerDepartmentGroup" slot-scope="text, record">
               <span v-for="(item,index) in record.ownerDepartmentGroup" :key="index">{{item.departmentName}} {{record.ownerDepartmentGroup.length-1==index?'':', '}}</span>
            </span>
            <span slot="editDepartmentGroup" slot-scope="text, record" style="display:inline-block;">
               <!-- <span v-for="(item,index) in record.editDepartmentGroup" :key="index">{{item.departmentName}} | </span> -->
               <span v-for="(item,index) in record.editDepartmentGroup" :key="index">{{item.departmentName}}<br></span>
            </span>
            <span slot="action" slot-scope="text, record">
			        <a v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn" @click="changeDown(record)" style="color:#3264D5;margin-right:10px;">{{record.isChannelOn===false?'上架':'下架'}}</a>
              <a v-if="authButton.hasOwnProperty('editBtn')&&authButton.editBtn&&record.isChannelOn==true" @click="getThirdPublishChannelOne(record)" style="color:#3264D5;margin-right:10px;">编辑</a>
              <!-- <a-divider v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn" type="vertical" /> -->
              <a-popconfirm v-if="authButton.hasOwnProperty('deleteBtn')&&authButton.deleteBtn&&record.isChannelOn==true" title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a style="color:#3264D5">删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </div>
      </a-card>
    </div>
    <!-- 第三方账号新增弹窗 -->

    <a-modal
      style="top: 10px;"
      width="800px"
      title="新增"
      :bodyStyle="bodyStyle"
      :visible="visible"
      @cancel="() => cancle()"
    >
    <!-- 新增弹窗底部按钮 -->
     <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="saves" class="affirmBtn" :disabled="btnDisabled">确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="cancle" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>

      <!-- <a-spin :spinning="spinning" tip="上传中..."> -->
        <div :class="['self']">
          <!-- <a-tabs defaultActiveKey="1" @change="callback"> -->
          <!-- <a-tab-pane tab="微信公众号/微博账号" key="1"> -->
          <div class="add">
            <!-- 基本信息下面的输入框和下拉选框 -->
            <a-row>
              <a-col :span="24" style="margin-top:12px;">
                <p class="title1">基本信息</p>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 媒体平台 -->
                <span class="title2 title"><span class="must">*</span>媒体平台</span>
                <a-select
                  placeholder="请选择媒体平台"
                  v-model="addBasicMsg.channelPlatform"
                  style="width: 23%;"
                  @change="addMediaPlatform"
                  :showSearch="true" :filter-option="filterOption" allowClear
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in mediaPlate"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
                <!-- 运营部门 -->
                <span class="title3 title"><span class="must">*</span>管理部门</span>
                <a-select
                  placeholder="请选择管理部门"
                  v-model="ownerDepartmentGroup"
                  style="width: 23%;"
                  @change="addOperationDepartment"
                  :showSearch="true" :filter-option="filterOption" allowClear
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, index) in operationDepartment"
                    :key="index"
                  >{{item.departmentName}}</a-select-option>
                </a-select>

              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 渠道名称 -->
                <span class="title2 title"><span class="must">*</span>渠道名称</span>
                <a-input
                  style="width:23%;"
                  allowClear
                  v-model="addBasicMsg.channelName"
                  placeholder="请填写渠道名称"
                  @change="addChannelName"
                />
                      <!-- 联系人 -->
                <span class="title3 title">联系人</span>
                <a-input
                  style="width:23%;"
                  allowClear
                  v-model="addBasicMsg.contacter"
                  placeholder="请填写联系人"
                  @change="addContacter"
                />
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 渠道类别 -->
                <span class="title2 title"><span class="must">*</span>渠道类别</span>
                <a-select
                  placeholder="请选择渠道类别"
                  v-model="addBasicMsg.channelLevel"
                  style="width: 23%;"
                  @change="addChannelLevel"
                  :showSearch="true" :filter-option="filterOption" allowClear
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in channelLevel"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
                <!-- 联系方式 -->
                <span class="title3 title">联系方式</span>
                <a-input
                  style="width:23%;"
                  v-model="contacterMobile"
                  allowClear
                  placeholder="请填写联系方式"
                />
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 品牌 -->
                <span class="title2 title">品牌</span>
                <a-select
                  placeholder="请选择品牌"
                  v-model="addBasicMsg.brand"
                  style="width: 23%;"
                  @change="addBrand"
                  :showSearch="true" :filter-option="filterOption" allowClear
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in brand"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
                <!-- 产业 -->
                <span class="title3 title">产业</span>
                <a-select
                  placeholder="请选择产业"
                  v-model="addBasicMsg.industry"
                  style="width:23%;"
                  @change="addIndustry"
                  :showSearch="true" :filter-option="filterOption" allowClear
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in industry"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
                   <a-row>
              <a-col :span="24">
              <span class="title3 title" style="margin-right:20px;width:18%;"><span class="must">*</span>编辑部门</span>
                  <a-select
                  placeholder="请选择编辑部门"
                  v-model="editDepartmentGroup" :showArrow="true"
                  style="width: 23%;" allowClear mode="multiple"
                  :showSearch="true" :filter-option="filterOption"
                >
                  <a-select-option
                    placeholder="请选择编辑部门"
                    :value="item.id"
                    v-for="(item, index) in operationDepartment"
                    :key="index"
                  >{{item.departmentName}}</a-select-option>
                </a-select>

              </a-col>
            </a-row>
            <!-- 微信公众号类型 -->
            <a-row :class="[addBasicMsg['channelPlatform']=='微信公众号'?'':'none']">
              <a-col :span="24">
                <a-col :span="24">
                  <!-- 微信公众号类型 -->
                  <span :class="['title2','title']">微信公众号类型</span>
                  <a-select
                    placeholder="请选择微信公众号类型"
                    v-model="addBasicMsg.wechatType"
                    style="width: 23%;"
                    @change="addWechatType"
                    :showSearch="true" :filter-option="filterOption" allowClear
                  >
                    <a-select-option value="订阅号">订阅号</a-select-option>
                    <a-select-option value="服务号">服务号</a-select-option>
                  </a-select>
                </a-col>
              </a-col>
            </a-row>
            <!-- 头像 -->
            <a-row>
              <a-col :span="24" style="display:flex;align-items:flex-start;height:112px;">
                <!-- 渠道类别 -->
                <span class="title2 title"><span class="must">*</span>上传头像</span>
                <a-upload style="margin-bottom:0;position: relative!important;width:104px;height:104px;"
                  name="file"
                  listType="picture-card"
                  class="avatar-uploader"
                  :showUploadList="false"
                  :action="url2.fileUpload"
                  :data="{'ossModuleCode':'image'}"
                  :headers="headers"
                  @preview="handlePreview"
                  @change="handleChange"
                >
                  <div v-show="addBasicMsg['imgUrl']" @mouseover="showWhichImg=true" @click.stop="blackClick" @mouseleave="showWhichImg=false" class="outerDiv">
                  <img
                    class="uploadImg"
                    v-show="addBasicMsg['imgUrl']"
                    :src="addBasicMsg.imgUrl"
                    alt="avatar"
                  />
                  <div v-if="showWhichImg" style="width:88px;height:88px;background:rgba(0,0,0,0.6);border-radius:4px;position:absolute;display:flex;align-items:center;justify-content:center;">
                        <img style="width: 16px;height: 12px;cursor:pointer;margin-right:12px;" src="@/assets/lookDetails.png" @click.stop="lookDetailImg" alt="">
                        <img style="width: 14px;height: 15px;cursor:pointer;" src="@/assets/deleteOne.png" @click.stop="deleteImage" alt="">
                  </div>
                  </div>
                  <div class="uploadImg" v-show="!addBasicMsg['imgUrl']">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
              </a-col>
            </a-row>
            <!-- 账号对接信息 -->
            <a-row>
              <a-col :span="24">
                <p class="title1">账号对接信息</p>
              </a-col>
            </a-row>
            <!-- 账号对接信息下的输入框，可以进行输入框的增加，删除 -->
            <a-row>
              <!-- 账号 -->
              <a-col :span="2" style="text-align:right;height:36px;line-height:50px;margin-right: 14px;"></a-col>
              <a-col :span="20">
                <a-row>
                  <a-col :span="24">
                    <!-- key和value两个输入框 -->
                    <a-input style="width:33%;" placeholder="请输入秘钥名称" id="-1" @change="keyInput" v-model="firstKey" />
                    <a-input
                      style="width:33%;margin-left:2%;"
                      id="-1"
                      placeholder="请输入秘钥信息"
                      @change="valueInput"
                      v-model="firstVal"
                    />
                    <!-- 添加按钮 -->
                    <a-icon type="plus-circle" class="plus" @click="accountAdd" />
                  </a-col>
                </a-row>
                <a-row v-for="(i) in ele" :key="i">
                  <a-col :span="24">
                    <!-- key和value两个输入框 -->
                    <a-input style="width:33%;" :id="i" @change="keyInput" />
                    <a-input style="width:33%;margin-left:2%;" :id="i" @change="valueInput" />
                    <!-- 添加按钮 -->
                    <a-icon type="plus-circle" class="plus" @click="accountAdd" />
                    <a-icon type="minus-circle" class="plus" style="color:#767885;" @click="accountReduce(i)" />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <!-- 保存按钮 -->
            <!-- <a-row>
              <a-col :span="24">
                <a-button @click="reset" class="btn">重置</a-button>
              </a-col>
            </a-row> -->
          </div>
          <!-- </a-tab-pane> -->
          <!-- <a-tab-pane tab="微博账号" key="2" forceRender>Content of Tab Pane 2</a-tab-pane> -->
          <!-- <a-tab-pane tab="更多" key="3">Content of Tab Pane 3</a-tab-pane>   -->
          <!-- </a-tabs> -->
        </div>
      <!-- </a-spin> -->
    </a-modal>
    <!-- 第三方账号编辑弹窗 -->
    <a-modal
      style="top: 10px;"
      width="800px"
      :bodyStyle="bodyStyle"
      title="编辑"
      :visible="visible2"
      @cancel="() => cancle2()"
    >
     <!-- 编辑弹窗底部按钮 -->
     <template slot="footer">
				<div :style="{ textAlign: 'center',padding:'14px 16px'  }">
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button type="primary"  @click="update" class="affirmBtn" :disabled="btnDisabled">确认</a-button>
				</a-config-provider>
				<a-config-provider :auto-insert-space-in-button="false">
					<a-button @click="cancle2" class="abolishBtn">取消</a-button>
				</a-config-provider>
				</div>
			</template>
      <!-- <a-spin :spinning="spinning2" tip="上传中..."> -->
        <div :class="['self']">
          <!-- <a-tabs defaultActiveKey="1" @change="callback">
          <a-tab-pane tab="微信公众号/微博账号" key="1">-->
          <div class="add">
            <!-- 基本信息下面的输入框和下拉选框 -->
            <a-row>
              <a-col :span="24" style="margin-top:12px;">
                <p class="title1">基本信息</p>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 媒体平台 -->
                <span class="title2 title"><span class="must">*</span>媒体平台</span>
                <a-select
                  placeholder="请选择媒体平台"
                  v-model="addBasicMsg.channelPlatform"
                  style="width: 23%;"
                  @change="addMediaPlatform"
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in mediaPlate"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
                <!-- 运营部门 -->
                <span class="title3 title"><span class="must">*</span>管理部门</span>
                <a-select
                  placeholder="请选择管理部门"
                  v-model="ownerDepartmentGroup"
                  style="width: 23%;"
                  @change="addOperationDepartment"
                >
                  <a-select-option
                    placeholder="请选择管理部门"
                    :value="item.id"
                    v-for="(item, index) in operationDepartment"
                    :key="index"
                  >{{item.departmentName}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 渠道名称 -->
                <span class="title2 title"><span class="must">*</span>渠道名称</span>
                <a-input
                  style="width:23%;"
                  allowClear
                  v-model="addBasicMsg.channelName"
                  placeholder="请填写渠道名称"
                  @change="addChannelName"
                />
                <!-- 联系人 -->
                <span class="title3 title">联系人</span>
                <a-input
                  style="width:23%;"
                  allowClear
                  v-model="addBasicMsg.contacter"
                  placeholder="请填写联系人"
                  @change="addContacter"
                />
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 渠道类别 -->
                <span class="title2 title"><span class="must">*</span>渠道类别</span>
                <a-select
                  placeholder="请选择渠道类别"
                  v-model="addBasicMsg.channelLevel"
                  style="width: 23%;"
                  @change="addChannelLevel"
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in channelLevel"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
                <!-- 联系方式 -->
                <span class="title3 title">联系方式</span>
                <a-input
                  style="width:23%;"
                  v-model="addBasicMsg.contacterMobile"
                  allowClear
                  placeholder="请填写联系方式"
                />
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 品牌 -->
                <span class="title2 title">品牌</span>
                <a-select
                  placeholder="请选择品牌"
                  v-model="addBasicMsg.brand"
                  style="width: 23%;"
                  @change="addBrand"
                  allowClear
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in brand"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
                <!-- 产业 -->
                <span class="title3 title">产业</span>
                <a-select
                  placeholder="请选择产业"
                  v-model="addBasicMsg.industry"
                  style="width: 23%;"
                  @change="addIndustry"
                  allowClear
                >
                  <a-select-option
                    :value="key"
                    v-for="(value, key, index) in industry"
                    :key="index"
                  >{{value}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <!-- 编辑弹窗中的编辑部门下拉选 -->
                  <a-row>
              <a-col :span="24">
              <span class="title3 title" style="margin-right:20px;width:18%;"><span class="must">*</span>编辑部门</span>
                  <a-select
                  placeholder="请选择编辑部门"
                  v-model="editDepartmentGroup" :showArrow="true"
                  style="width: 23%;" allowClear mode="multiple"
                >
                  <a-select-option
                    placeholder="请选择编辑部门"
                    :value="item.id"
                    v-for="(item, index) in operationDepartment"
                    :key="index"
                  >{{item.departmentName}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-col :span="24" :class="[addBasicMsg['channelPlatform']=='微信公众号'?'':'none']">
                  <!-- 微信公众号类型 -->
                  <span :class="['title2','title']">微信公众号类型</span>
                  <a-select
                    placeholder="请选择微信公众号类型"
                    v-model="addBasicMsg.wechatType"
                    style="width: 23%;"
                    @change="addWechatType"
                  >
                    <a-select-option value="订阅号">订阅号</a-select-option>
                    <a-select-option value="服务号">服务号</a-select-option>
                  </a-select>
                </a-col>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24" style="display:flex;align-items:flex-start;height:112px;">
                <!-- 上传头像 -->
                <span class="title2 title"><span class="must">*</span>上传头像</span>
                <a-upload
                  style="margin-bottom:0;position: relative!important;width:104px;height:104px;"
                  name="file"
                  listType="picture-card"
                  class="avatar-uploader"
                  :showUploadList="false"
                  :action="url2.fileUpload"
                  :data="{'ossModuleCode':'image'}"
                  :headers="headers"
                  @change="handleChange"
                >
                <!-- #DFE0EB -->
                  <div  v-show="addBasicMsg['imgUrl']" @click.stop="blackClick"
                  @mouseover="showWhichImg=true"
                  @mouseleave="showWhichImg=false"
                  class="outerDiv">
                  <img
                    class="uploadImg"
                    :src="addBasicMsg.imgUrl"
                    alt="avatar"
                  />
                  <div v-if="showWhichImg" style="width:88px;height:88px;background:rgba(0,0,0,0.6);border-radius:4px;position:absolute;display:flex;align-items:center;justify-content:center;">
                        <img style="width: 16px;height: 12px;cursor:pointer;margin-right:12px;" src="@/assets/lookDetails.png" @click.stop="lookDetailImg" alt="">
                        <img style="width: 14px;height: 15px;cursor:pointer;" src="@/assets/deleteOne.png" @click.stop="deleteImage" alt="">
                  </div>
                  </div>
                  <div class="uploadImg" v-show="!addBasicMsg['imgUrl']">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">上传</div>
                  </div>
                </a-upload>
              </a-col>
            </a-row>

            <!-- 账号对接信息 -->
            <a-row>
              <a-col :span="24">
                <p class="title1">账号对接信息</p>
              </a-col>
            </a-row>
            <!-- 账号对接信息下的输入框，可以进行输入框的增加，删除 -->
            <a-row>
              <!-- 账号 -->
              <a-col :span="2" style="text-align:right;height:36px;line-height:50px;margin-right: 14px;"></a-col>
              <a-col :span="20">
                <a-row v-for="(i) in ele2" :key="i">
                  <a-col :span="24">
                    <!-- key和value两个输入框 -->
                    <a-input
                      style="width:33%;"
                      :id="i" placeholder="请输入秘钥名称"
                      v-model="accountList[i]['key']"
                      @change="keyInput2"
                    />
                    <a-input
                      style="width:33%;margin-left:2%;"
                      :id="i"
                      placeholder="请输入秘钥信息"
                      v-model="accountList[i]['val']"
                      @change="valueInput2"
                    />
                    <!-- 加号按钮 -->
                    <a-icon type="plus-circle" class="plus" @click="accountAdd2" />
                    <!-- 减号按钮 -->
                    <a-icon
                      type="minus-circle" style="color:#767885;"
                      :class="['plus',i==0?'none':'']"
                      @click="accountReduce2(i)"
                    />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <!-- 保存按钮 -->
            <!-- <a-row>
                <a-col :span="24">
                  <a-button @click="reset2" class="btn">重置</a-button>
                </a-col>
            </a-row>-->
          </div>
          <!-- </a-tab-pane> -->
          <!-- <a-tab-pane tab="微博账号" key="2" forceRender>Content of Tab Pane 2</a-tab-pane> -->
          <!-- <a-tab-pane tab="更多" key="3">Content of Tab Pane 3</a-tab-pane>   -->
          <!-- </a-tabs> -->
        </div>
      <!-- </a-spin> -->
    </a-modal>
    <a-modal width="800px" title="预览" :keyboard="true" v-model="visible3" :footer="null">
      <img style="height:400px;width:100%;" :src="imgSrc" />
    </a-modal>
     <!-- 图片预览弹窗 -->
  <a-modal
      width="800px"
      title="图片预览"
      :keyboard="true"
      v-model="visibleImg"
      :footer="null"
      :zIndex="1200"
    >
       <img :src="preImgUrl" alt="" style="width:100%">
    </a-modal>
    <!-- 信息提示框 -->
    <tooltip ref="tooltip" :message="message" :type="type"></tooltip>
  </div>
</template>
 <script>
import Qs from 'qs'
import Vue from 'vue'
import { baseUrl } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { USER_INFO, USER_AUTH } from '@/store/mutation-types'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import tooltip from "@/components/tooltip/tooltip.vue"
// 导入接口
import {
  changeDownToUp,
  departmentList,
  changeUpToDown,
  thirdPublishChannelList,
  thirdPublishChannelOne,
  dataDictionary,
  thirdPublishChannelDeleteOne,
  thirdPublishChannelAddOne,
  thirdPublishChannelUpdateOne
} from '@/api/api'

export default {
  mixins: [JeecgListMixin],
  components:{ tooltip },
  data() {
    return {
      isSpread:false,
      bordered:false,
      message:'操作成功',
      type:'info',
      showWhichImg:false,
      headStyle:{
        "text-align":"center",
        "border-bottom":"none" 
      },
      bodyStyle:{
        'padding-top':'0'
      },
      // searchBtn:true,// 查询按钮是否可用的标志
      //按钮权限，默认拥有全部权限
      authButton:{
        editBtn: true,
        createBtn: true,
        deleteBtn: true,
      },
      ownerDepartmentGroup:[],// 管理部门
      editDepartmentGroup:[],// 编辑部门
      visible: false, // 图片能否预览的标志
      spinning: false,
      spinning2: false,
      visible3: false,
      imgSrc: '', // 图片地址
      msg: '', // 操作提示语
      //上传图片url
      url2: {
        fileUpload: baseUrl + '/cms/upload/uploadImage'
      },
      headers: {},
      channelId: [], // 上传照片需要的参数
      visible2: false,
      firstKey: '',
      firstVal: '',
      firstKey2: '',
      firstVal2: '',
      wechart: false,
      mediaPlatform: '', // 媒体平台
      channelName: null, // 渠道名称
      contacterStyle: null, // 联系方式
      contacter: null, // 联系人
      addBasicMsg: {}, //新增基本信息
      contacterMobile:'',
      queryParam: {
        mediaPlatform:'',
        channelName:'',
        channelLevel:''
      }, // 点击查询按钮时需要的参数
      operationDepartment: null, // 运营部门下拉选数据
      mediaPlate: null, // 媒体平台下拉选数据
      channelLevel: null, // 渠道类别下拉选数据
      brand: null, // 品牌下拉选数据
      industry: null, // 企业下拉选数据
      ele: [],
      ele2: [],
      start: 0,
      accountList: [],
      accountList2: [],
	  StandUpAndDown:[
		  {status:'上架'},{status:'下架'}
	  ],
      accountStr: '', // 输入的所有账号组成的键值对字符串
      flag: true, // 控制新增款快是否显示的标志
      // 表头
      columns: [
        {
          title: '媒体平台',width: 100,
          align: 'center',
          dataIndex: 'channelPlatform',
          className:'table_title'
        },
        {
          title: '渠道名称',width: 120,
          align: 'center',
          dataIndex: 'channelName',
          className:'table_title'
        },
        // {
        //   title: '渠道类别',width: 80,
        //   align: 'center',
        //   dataIndex: 'channelLevel',
        //   className:'table_title'
        // },
        {
          title: '品牌',
          align: 'center',width: 70,
          dataIndex: 'brand',
          className:'table_title'
        },
        {
          title: '产业',
          align: 'center',width: 70,
          dataIndex: 'industry',
          className:'table_title'
        },
        {
          title: '管理部门',
          dataIndex: 'ownerDepartmentGroup',width: 130,
          align: 'center',
           scopedSlots: { customRender: 'ownerDepartmentGroup' },
           className:'table_title'
        },
        {
          title: '编辑部门',
          dataIndex: 'editDepartmentGroup',width: 130,
          align: 'center',
          scopedSlots: { customRender: 'editDepartmentGroup' },
          className:'table_title'
        },
        {
          title: '联系人',
          dataIndex: 'contacter',width: 70,
          align: 'center',
          className:'table_title'
        },
        {
          title: '联系方式',
          dataIndex: 'contacterMobile',
          width: 110,
          align: 'center',
          className:'table_title'
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          width: 100,
          align: 'center',
          className:'table_title'
        },
        {
          title: '头像',
          dataIndex: 'imgUrl',
          align: 'center',width: 70,
          scopedSlots: { customRender: 'action2' },
          className:'table_title'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          // fixed:'right',
          width: 150,
          scopedSlots: { customRender: 'action' },
          className:'table_title'
        }
      ],
      dataSource: [],
      param: {
        page: 1,
        size: 15
      },
      url: {
        list: '/cms/channel/info/list',
        delete: '/cms/channel/info/delete'
      },
      preImgUrl:'',
      visibleImg:false,
      //操作按钮禁用
      btnDisabled:false
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    const id = Vue.ls.get(USER_INFO).id
    this.headers = { authorization: token, uuss: id }
    // 获取第三方账号的数据列表
    // this.getTPCList()
    // 获取运营部门数据
    this.getOperationDepartment()
    // 获取媒体平台下拉选数据
    this.getMediaPlatform()
    // 获取渠道类别下拉选数据
    this.getChannelLevel()
    // 获取品牌下拉选数据
    this.getBrand()
    // 获取产业下拉选数据
    this.getIndustry()
  },
  mounted(){
    //根据当前页面路由的name去匹配按钮权限，取出当前页面的按钮权限并赋值给authButton
    let auth = Vue.ls.get(USER_AUTH)
    //如果按钮权限数据里有当前页面的权限
    if(auth.hasOwnProperty(this.$route.name)){
      this.authButton = auth[this.$route.name]
    }
    // setTimeout(()=>{
    //   var dom = document.getElementsByClassName("ant-table-small")[0]
    //   dom.style.border= "none"
    // },200)
  },
  watch:{
    contacterMobile(newTel, oldTel){
        if(newTel && newTel.length>11){
          this.contacterMobile = newTel.substr(0,11)
      }
    }
  },
  methods: {
    blackClick(){
      return
    },
    // 点击图片删除图标触发
    deleteImage(){
      this.imgSrc = ""
      this.addBasicMsg.imgUrl = ""
      this.message = "删除成功"
      this.type = 'info'
      this.warnMethod()
    },
    // 点击图片查看图标触发
    lookDetailImg(e){
      this.preImgUrl = this.addBasicMsg.imgUrl
      this.visibleImg = true;
    },
    async handlePreview(file) {
      //  return
      // if (!file.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj);
      // }
      // this.previewImage = file.url || file.preview;
      // this.previewVisible = true;
    },
    // 点击新增弹窗的编辑部门下拉选时触发
    addEditDepartment(e){
      //  console.log('eeee',e)
    },
    // 点击缩略图触发
    lookImg(e) {
      this.visible3 = true
      this.imgSrc = e.imgUrl
    },
    // 上传图片
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.spinning = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          console.log('info.file.response', info.file.response)
          this.spinning = false
          // this.listData[this.conIndex].imagePath = info.file.response.data.imgUrl
          this.addBasicMsg['imgUrl'] = info.file.response.data.imgUrl
          console.log('i this.addBasicMsg', this.addBasicMsg)
          this.imgSrc = info.file.response.data.imgUrl
          this.msg = '上传成功，请保存'
          // this.disabled = false

          // this.$message.success(`${info.file.name} 上传成功，请保存。`)
          this.message = '上传成功'
          this.type = 'info'
          this.warnMethod()
        } else {
          // this.$message.error(`${info.file.name} 上传失败.`)
          this.message = info.file.response.message
          this.type = 'error'
          this.warnMethod()
          console.info(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        // this.$message.error(`${info.file.name} 上传失败.`)
          this.message = info.file.response.message
          this.type = 'error'
          this.warnMethod()
      }
    },
    warnMethod(){
      this.$refs.tooltip.visible = true
      this.$refs.tooltip.alertVisible = true
      setTimeout(()=>{
        this.$refs.tooltip.cancel()
      },3000)
    },
	//上下架搜索
	changeUp(value){
		console.log(value,'value')
		if(value==0){
			this.queryParam['channelOn'] = true;
		}
		if(value==1){
			this.queryParam['channelOn'] = false;
		}
	},
	//上下架改变
	changeDown(record){
		let params={
			"channelName": record.channelName,
			"channelPlatformCode":record.channelPlatformCode ,
			"id": record.id
		}
		console.log(params)
		if(record.isChannelOn==false){//下架变上架
			changeDownToUp(params).then(res=>{
				if(res.code===200){
					this.message =  res.message
					this.type = 'success'
					this.warnMethod()
					this.searchQuery();
				}else{
					this.message =  res.message
					this.type = 'error'
					this.warnMethod()
				}
			})
		}else{
			changeUpToDown(params).then(res=>{
				if(res.code===200){
					this.message =  res.message
					this.type = 'success'
					this.warnMethod()
					 this.searchQuery();
				}else{
					this.message =  res.message
					this.type = 'error'
					this.warnMethod()
				}
			})
		}


	},
    // 获取管理部门数据
    getOperationDepartment() {
      departmentList({ page: 1, size: 10000 }).then(res => {
        if (res.code === 200) {
           console.info("info.file.response.message",res)
          this.operationDepartment = res.data.list
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message =  res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 获取媒体平台下拉选数据
    getMediaPlatform() {
      dataDictionary({ dataType: 'mediaPlatform' }).then(res => {
        if (res.code === 200) {
          this.mediaPlate = res.data
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message =  res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 获取渠道类别下拉选数据
    getChannelLevel() {
      dataDictionary({ dataType: 'channelLevel' }).then(res => {
        if (res.code === 200) {
          this.channelLevel = res.data
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message =  res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 获取品牌下拉选数据
    getBrand() {
      dataDictionary({ dataType: 'brand' }).then(res => {
        if (res.code === 200) {
          this.brand = res.data
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message =  res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 获取产业下拉选数据
    getIndustry() {
      dataDictionary({ dataType: 'industry' }).then(res => {
        if (res.code === 200) {
          this.industry = res.data
        }else if(res.code!==400){
          // this.$message.error(res.message)
          this.message =  res.message
          this.type = 'error'
          this.warnMethod()
        }
      })
    },
    // 根据主键获取单条数据
    getThirdPublishChannelOne(msg) {
      var ids = Object.assign({},msg)
      console.log('ddd',ids)
      // start1
      // 编辑部门
      if(ids.editDepartmentGroup && ids.editDepartmentGroup.length>0){
        ids.editDepartmentGroup.forEach(item=>{
          this.editDepartmentGroup.push(item.departmentId)
        })
      }
      // 管理部门
			// console.log(ids.ownerDepartmentGroup,"123321312")
      this.ownerDepartmentGroup = ids.ownerDepartmentGroup[0]['departmentId']
      // end1
    // 后台改完后，start1-end1 去掉注释；start2-end2加上注释
      // start2
      // this.ownerDepartmentGroup = '4'
      // this.editDepartmentGroup = ['2','3']
      // end2
      this.ele2 = []
      this.visible2 = true
      this.addBasicMsg = ids
      this.imgSrc = ids.imgUrl
      // 对 账号对接信息 数据进行解析
      ids.accountParms = ids.accountParms || '{"":""}'
      if (ids.accountParms) {
        var accountParmsObj = JSON.parse(ids.accountParms)
        var num = 0
        for (var ele in accountParmsObj) {
          const objs = {}
          objs['id'] = num
          objs['key'] = ele
          objs['val'] = accountParmsObj[ele]
          this.ele2.push(num)
          this.accountList.push(objs)
          num = 1 + num
        }
      }
    },
    //  账号的第一列输入框内容变化时触发
    keyInput(e) {
      var obj = {}
      //  如果this.accountList为空数组，则新建对象并放入该数组
      if (this.accountList.length <= 0) {
        obj.id = e.srcElement.id
        obj.key = e.target.value
        this.accountList.push(obj)
      } else {
        var flags2 = false
        // 否则判断是否已有id为e.srcElement.id的对象，有的话，修改；没有的话，添加；
        this.accountList.map(i => {
          if (i.id == e.srcElement.id) {
            i.key = e.target.value
            flags2 = true
          }
          return i
        })
        if (!flags2) {
          obj.id = e.srcElement.id
          obj.key = e.target.value
          this.accountList.push(obj)
        }
      }
    },
    //  编辑数据时第一列输入框内容变化时触发
    keyInput2(e) {
      var obj = {}
      //  如果this.accountList为空数组，则新建对象并放入该数组
      if (this.accountList.length <= 0) {
        obj.id = e.srcElement.id
        obj.key = e.target.value
        this.accountList.push(obj)
      } else {
        var flags2 = false
        // 否则判断是否已有id为e.srcElement.id的对象，有的话，修改；没有的话，添加；
        this.accountList.map(i => {
          if (i.id == e.srcElement.id) {
            i.key = e.target.value
            flags2 = true
          }
          return i
        })
        if (!flags2) {
          obj.id = e.srcElement.id
          obj.key = e.target.value
          this.accountList.push(obj)
        }
      }
    },
    //  账号的第二列输入框内容变化时触发
    valueInput(e) {
      var obj = {}
      //  如果this.accountList为空数组，则新建对象并放入该数组
      if (this.accountList.length <= 0) {
        obj.id = e.srcElement.id
        obj.val = e.target.value
        this.accountList.push(obj)
      } else {
        var flags = false
        //否则判断是否已有id为e.srcElement.id的对象，有的话，修改；没有的话，添加；
        this.accountList.map(i => {
          if (i.id == e.srcElement.id) {
            i.val = e.target.value
            flags = true
          }
          return i
        })
        if (!flags) {
          obj.id = e.srcElement.id
          obj.key = e.target.value
          this.accountList.push(obj)
        }
      }
    },
    //  编辑的第二列输入框内容变化时触发
    valueInput2(e) {
      var obj = {}
      //  如果this.accountList为空数组，则新建对象并放入该数组
      if (this.accountList.length <= 0) {
        obj.id = e.srcElement.id
        obj.val = e.target.value
        this.accountList.push(obj)
      } else {
        var flags = false
        //否则判断是否已有id为e.srcElement.id的对象，有的话，修改；没有的话，添加；
        this.accountList.map(i => {
          if (i.id == e.srcElement.id) {
            i.val = e.target.value
            flags = true
          }
          return i
        })
        if (!flags) {
          obj.id = e.srcElement.id
          obj.key = e.target.value
          this.accountList.push(obj)
        }
      }
    },
    // 点击查询按钮触发
    queryThirdList() {
      this.searchQuery();
      // thirdPublishChannelList(this.queryParam).then(res => {
      //   if (res.code === 200) {
      //     this.dataSource = res.data.list
      //   } else {
      //     this.$message.warning('请稍后再试')
      //   }
      // })
    },
    // 点击基本信息的产业下拉框触发
    addIndustry(e) {
      this.setBasicVal(e, this.industry, 'industry')
    },
    // 在基本信息的联系人文本框输入文字后触发
    addContacter(e) {
      this.addBasicMsg['contacter'] = e.srcElement.value
    },
    // 在基本信息的渠道名称文本框输入文字后触发
    addChannelName(e) {
      this.addBasicMsg['channelName'] = e.srcElement.value
    },
    // 在基本信息的联系方式文本框输入文字后触发
    addContactStyle(e) {
      this.addBasicMsg['contacterMobile'] = e.srcElement.value
    },
    // 点击基本信息的品牌下拉框触发
    addBrand(e) {
      this.setBasicVal(e, this.brand, 'brand')
    },
    // 点击基本信息的渠道类别下拉框触发
    addChannelLevel(e) {
      this.setBasicVal(e, this.channelLevel, 'channelLevel')
    },
    // 给添加的基本信息  参数赋值
    // 参数说明：e--> 下拉选选择后的英文值；obj---> 下拉选对应的data中的数据；str---> 需要设置的键
    setBasicVal(e, obj, str) {
      for (let key in obj) {
        if (key == e) {
          this.addBasicMsg[str] = obj[key]
        }
      }
    },
    // 点击基本信息的媒体平台下拉框触发
    addMediaPlatform(e) {
      this.addBasicMsg['channelPlatformCode'] = e
      this.setBasicVal(e, this.mediaPlate, 'channelPlatform')
    },
    // 点击基本信息的运营部门下拉框触发
    addOperationDepartment(e) {
      // this.operationDepartment.forEach(item => {
      //   if (item.id == e) {
      //     this.addBasicMsg['departmentId'] = e
      //     this.addBasicMsg['departmentName'] = item.departmentName
      //   }
      // })
    },
    // 点击查询条件下的媒体平台选择框触发
    mediaPlatformChange(e) {
      if(!e){
        this.queryParam['mediaPlatform'] = ''
      }else{
        for (let key in this.mediaPlate) {
          if (key == e) {
            this.queryParam['mediaPlatform'] = this.mediaPlate[key]
          }
        }
      }
    },
    // 点击查询条件下的渠道名称触发
    channelNameChange(e) {
      this.queryParam['channelName'] = e.srcElement.value
    },
    // 点击查询条件下的渠道类别触发
    channelLevelChange(e) {
      if(!e){
         this.queryParam['channelLevel'] = ''
      }else{
        for (let key in this.channelLevel) {
          if (key == e) {
            this.queryParam['channelLevel'] = this.channelLevel[key]
          }
        }
      }
    },
    // 点击新增弹窗中的减号触发
    accountReduce(i) {
      this.ele.map(item => {
        if (item == i) {
          this.ele.splice(this.ele.indexOf(i), 1)
        }
      })
      this.accountList.map(item => {
        if (item.id == i) {
          this.accountList.splice(this.accountList.indexOf(item), 1)
        }
      })
    },
    // 点击编辑弹窗中的减号触发
    accountReduce2(i) {
      this.ele2.map(item => {
        if (item == i) {
          this.ele2.splice(this.ele2.indexOf(i), 1)
        }
      })
      this.accountList.map(item => {
        if (item.id == i) {
          this.accountList.splice(this.accountList.indexOf(item), 1)
        }
      })
    },
    // 点击微信公众号类型下拉选时触发
    addWechatType(e) {
      this.addBasicMsg['wechatType'] = e
    },
    // 点击账号对接信息的第一行的输入框右侧的加号按钮触发
    accountAdd() {
      this.ele.push(this.start++)
    },
    // 点击编辑弹窗的加号按钮触发
    accountAdd2() {
      this.ele2.push(this.ele2[this.ele2.length - 1] + 1)
      const obj = { id: this.ele2[this.ele2.length - 1], key: '', val: '' }
      this.accountList.push(obj)
    },
    // 点击编辑弹窗的减按钮触发
    accountReduc2(i) {
      this.accountList.splice(i, 1)
      this.ele2.splice(i, 1)
    },
    //   点击新增按钮触发
    add() {
      this.addBasicMsg = {}
      this.accountList = []
      this.ele = []
      // this.flag = false
      this.visible = true
    },
    // 点击‘微信公众号’，‘微博账号’，‘更多’ 时触发
    callback(key) {
      console.log(key)
    },
    // 对输入的内容进行验证
    validate() {
      // var reg01 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
      // var reg02 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
      var pass = true
      if (!this.addBasicMsg['channelPlatform']) {
        pass = false
        this.message = '请选择媒体平台'
        this.type = 'error'
        this.warnMethod()
      } else if(this.ownerDepartmentGroup.length==0){
        this.message = '请选择管理部门'
        this.type = 'error'
        this.warnMethod()
        pass = false
      } else if (!this.addBasicMsg['channelName']) {
        this.message = '请填写渠道名称'
        this.type = 'error'
        this.warnMethod()
        pass = false
      } else if (!this.addBasicMsg['channelLevel']) {
        this.message = '请选择渠道类别'
        this.type = 'error'
        this.warnMethod()
        pass = false
      }
      // else if(!(reg01.test(this.addBasicMsg['contacterMobile']) || reg02.test(this.addBasicMsg['contacterMobile']))){
      //   this.$message.warning('请输入正确的联系方式')
      //   pass = false
      // }
       else if (this.addBasicMsg['channelPlatform'] === '微信公众号' && !this.addBasicMsg['channelPlatformCode']) {
        this.message = '请选择微信公众号类型'
        this.type = 'error'
        this.warnMethod()
        pass = false
      }else if(this.editDepartmentGroup.length==0){
        this.message = '请选择编辑部门'
        this.type = 'error'
        this.warnMethod()
        pass = false
      }else if(!this.imgSrc){
        this.message = '请上传头像'
        this.type = 'error'
        this.warnMethod()
        pass = false
      }
      return pass
    },
    // 重组需要传给后台的编辑部门的相关数据
    editDepartmentData(){
          var editDepartmentGroups = []
         this.editDepartmentGroup.forEach(item=>{
            this.operationDepartment.forEach(item2=>{
              if(item === item2.id){
                var obj = {}
                obj.departmentId = item2.id
                obj.departmentName = item2.departmentName
                editDepartmentGroups.push(obj)
              }
            })
         })
          this.addBasicMsg['editDepartmentGroup'] = editDepartmentGroups
    },
     // 重组需要传给后台的管理部门的相关数据
    ownerDepartmentData(){
             var ownerDepartmentGroups = []
            this.operationDepartment.forEach(item2=>{
              if(this.ownerDepartmentGroup == item2.id){
                var obj = {}
                obj.departmentId = item2.id
                obj.departmentName = item2.departmentName
                ownerDepartmentGroups.push(obj)
              }
            })
          this.addBasicMsg['ownerDepartmentGroup'] = ownerDepartmentGroups
    },
    // 编辑某一条数据时触发
    update() {
      if (this.validate()) {
        this.btnDisabled = true
        // return
        // 重组需要传给后台的编辑部门的相关数据
        this.editDepartmentData()
        this.ownerDepartmentData()
        // 账号对接信息添加到obj对象中
        var obj = {}
        this.accountList.forEach(item => {
          if (item.key && item.val) {
            obj[item.key] = item.val
          }
        })
        this.addBasicMsg['accountParms'] = JSON.stringify(obj) === '{}'?'':JSON.stringify(obj)
        this.addBasicMsg['channelType'] = '2'
        thirdPublishChannelUpdateOne(this.addBasicMsg).then(res => {
          this.btnDisabled = false
          if (res.code === 200) {
            this.editDepartmentGroup = []
            this.ownerDepartmentGroup = []
            // this.$message.success('修改成功')
            this.message = '修改成功'
            this.type = 'info'
            this.warnMethod()
            this.addBasicMsg = {}
            this.accountList = []
            this.ele2 = []
            this.visible2 = false
            this.imgSrc = ''
            this.loadData()
          }else if(res.code!==400){
            // this.$message.error(res.message)
            this.message = res.message
            this.type = 'error'
            this.warnMethod()
          }
        })
      }
    },
    // 新增一条数据时触发
    saves() {
      if (this.validate()) {
        this.btnDisabled = true
        this.ownerDepartmentData()
        this.editDepartmentData()
        this.addBasicMsg['contacterMobile'] = this.contacterMobile
        // 账号对接信息添加到obj对象中
        var obj = {}
        this.accountList.forEach(item => {
          if (item.key && item.val) {
            obj[item.key] = item.val
          }
        })
        this.addBasicMsg['accountParms'] = JSON.stringify(obj) === '{}'?'':JSON.stringify(obj)
        this.addBasicMsg['channelType'] = '2'
  console.log('this.addBasicMsg',this.addBasicMsg)
  // return
        thirdPublishChannelAddOne(this.addBasicMsg).then(res => {
          this.btnDisabled = false
          if (res.code === 200) {
            JSON.stringify(this.addBasicMsg)
            this.addBasicMsg = {}
            this.firstKey = ''
            this.firstVal = ''
            this.contacterMobile = ''
            this.visible = false
            this.accountList = []
            this.ele = []
            // 将编辑部门的变量设置为 空数组
            this.editDepartmentGroup = []
            // 将管理部门的变量设置为 空数组
            this.ownerDepartmentGroup = []
            // this.$message.success('保存成功')
            this.message = '新增成功'
            this.type = 'info'
            this.warnMethod()
            this.loadData()
          }else if(res.code!==400){
            // this.$message.error(res.message)
            this.message = res.message
            this.type = 'error'
            this.warnMethod()
          }
        })
      }
    },
    // 点击新增渠道弹窗下的取消按钮触发
    cancle() {
      this.visible = false
      this.accountList = []
      this.firstKey = ''
      this.firstVal = ''
      this.editDepartmentGroup = []
      this.ownerDepartmentGroup = []
      this.imgSrc = ""
      this.addBasicMsg.imgUrl = ""
    },
    cancle2() {
      this.visible2 = false
      this.accountList = []
      this.ele2 = []
      this.editDepartmentGroup = []
      this.ownerDepartmentGroup = []
      this.imgSrc = ""
      this.addBasicMsg.imgUrl = ""
    },

    // 点击重置按钮触发
    reset() {
      this.addBasicMsg = {}
      this.accountList = []
      this.firstKey = ''
      this.firstVal = ''
      this.editDepartmentGroup = []
      this.ownerDepartmentGroup = []
    },
    reset2() {
      this.addBasicMsg = {}
      this.accountList = []
      this.firstKey = ''
      this.firstVal = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.outerDiv{
  cursor:default;
  width:89px;
  height:89px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -45px;
    margin-left: -45px;
}
.uploadImg {
  width: 88px;
  height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius:4px;
}
.must {
  color: red;
}
.none {
  display: none;
}
.block {
  display: block;
}
.title {
  display: inline-block;
  text-align: right;
}
.title1 {
  font-weight: 500;
  font-size: 14px;
  color:#55565D;
  padding: 0px 0 0 20px;
  background:#F7F7FB;
  height:32px;
  border-radius:4px;
  line-height:32px;
}
.title2 {
  margin-right: 20px;
  width: 18%;
}
.title3 {
  margin: 0 23px 0 0;
  width: 17%;
}
.self {
  background: #fff;
}
.add {
  padding: 0 0 40px 0;
}
.add .ant-col-24 {
  margin: 10px 0;
}
.plus {
  font-size: 22px;
  color: #378ae4;
  margin-left: 3%;
}
.btn {
  padding: 0 30px;
  margin-left: 30px;
}
.ant-upload{
  padding:0!important;
}
.left{
 width:calc(100% - 170px);display:flex;
}
</style>