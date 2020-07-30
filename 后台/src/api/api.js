import { postAction, getAction } from '@/api/manage'

//角色管理
const addRole = (params) => postAction("/cms/role/add", params);
const editRole = (params) => postAction("/cms/role/update", params);
const roleList = (params) => postAction("/cms/role/list", params);

// 评论管理
const deleteAlist = (params) => postAction("/cms/content/comment/deleteComment",params);
const contentTop = (params)=> postAction("/cms/content/comment/commentTop",params)
const postAlist = (params) => getAction("/cms/content/comment/detail",params);
const postByAlist = (params) => postAction("/cms/content/comment/listSendDetail",params);


//用户管理
const addUser = (params) => postAction("/cms/user/add", params);
const editUser = (params) => postAction("/cms/user/update", params);
const userList = (params) => postAction("/sys/user/list", params);

//部门管理
const addDepartment = (params) => postAction("/cms/department/add", params);
const editDepartment = (params) => postAction("/cms/department/update", params);
const departmentList = (params) => postAction("/cms/department/list", params);
// 内容管理发布部门
const contentDepartment = (params) => postAction("/cms/department/listByDepartmentType", params);

//营销管理】

const downLoad = (params) => getAction("/cms/classics/case/download/info/add", params); 
const addCenter = (params) => postAction("/cms/classics/case/add", params);
const DeleteCenter = (params) => getAction("/cms/classics/case/delete", params);
const updateCent = (params) => postAction("/cms/classics/case/update", params);
const findCenter = (params) => postAction("/cms/classics/case/list", params);
//营销管理】 统计
const FindeBy = (params) => postAction("/cms/classics/case/download/info/list", params);

//渠道管理
const changeDownToUp = (params) => postAction("/cms/channel/info/channelOn", params);
const changeUpToDown = (params) => postAction("/cms/channel/info/channelOff", params);



//权限管理
const queryTreeListForRole = (params) => getAction("/cms/permission/queryTreeList", params);
const getPermissionList = (params) => getAction("/cms/permission/queryRolePermission", params);
const saveRolePermission = (params) => postAction("/cms/permission/saveRolePermission", params);

//内容审核
const channelList = (params) => postAction("/cms/channel/info/getChannelListByUserCode", params); //查询账号                                                 //查询账号
const auditList = (params) => postAction("/cms/process/manage/reviewcontentList", params); //内容审核列表查询
const auditIng = (params) => postAction("/cms/process/manage/review", params); //内容审核
const auditDetail = (params) => getAction("/cms/content/newstemplate/getContentInfo", params); //查询详情
// 首页总数统计
const totalCount = (params) => getAction("/cms/sys/content/statistics/totalCount", params);

// 首页趋势统计
const trend = (params) => getAction("/cms/sys/content/statistics/trend", params);

// 第三方账号管理
const thirdPublishChannelList = (params) => postAction("/cms/channel/info/list", params); // 获取全部数据
const thirdPublishChannelOne = (params) => postAction("/cms/channel/info/detail", params); // 根据主键获取单条数据
const thirdPublishChannelAddOne = (params) => postAction("/cms/channel/info/add", params); // 添加单条数据
const thirdPublishChannelDeleteOne = (params) => getAction("/cms/channel/info/delete", params); // 根据id删除单条数据
const thirdPublishChannelUpdateOne = (params) => postAction("/cms/channel/info/update", params); // 修改单条数据

// 获取数据字典
const dataDictionary = (params) => postAction("/cms/system/dic/getDataByDataType", params);

//报备新增保存
const saveContentReport = (params) => postAction("/cms/content/report/saveContentReport", params)

//获取渠道list
// const getChannelList  = (params)=>getAction("/cms/channel/info/list",params);

//根据渠道筛选前台用户和后台用户
const getEditorList = (params) => postAction("/cms/process/config/getAllEditorAndAuditor", params);

//新增保存流程配置
const saveProcessConfig = (params) => postAction("/cms/process/config/add", params);

//编辑保存流程配置
const updateProcessConfig = (params) => postAction("/cms/process/config/update", params);
// 消息列表
const noReadMsg = (params) => getAction("/cms/announcement/listByUser", params)
    // 更新用户系统消息阅读状态
const alertMsgState = (params) => postAction("/cms/announcement/send/editByAnntIdAndUserId", params)
    // 标记为已读
const readAll = (params) => postAction("/cms/announcement/send/readAll", params)
    // 内容管理页面列表
const contentManage = (params) => postAction("/cms/content/newsitem/queryListForAdmin", params)

// 报备列表明细
const reportList = (params) => postAction("/cms/content/report/list", params)
//菜单管理模块
const addMenu = (params) => postAction("/cms/permission/add", params)
const editMenu = (params) => postAction("/cms/permission/update", params)
// 获取带有层级关系的部门
const departmentAll = (params) => postAction("/cms/system/dic/getAllLevelData", params);
// 根据渠道ID查询审核者
const getAuditorByChannelId = (params) => postAction("/cms/process/config/getAuditorByChannelId", params)
// 一级审核者确定剩余审核节点
const fixupReviewer = (params) => postAction("/cms/process/manage/fixupReviewer", params)
// 物料新增
const addMaterial = (params) => postAction("/cms/material/add", params)
// 物料更新
const updateMaterial = (params) => postAction("/cms/material/update", params)
// 物料下载
const downloadMaterial = (params) => getAction("/cms/material/download/info/getImage", params)
// 标签名称查询
const tagQuery = (params) => getAction("/cms/tag/isExist", params)
// 标签新增
const tagAdd = (params) => postAction("/cms/tag/add", params)
// 标签编辑
const tagUpdate = (params) => postAction("/cms/tag/update", params)
// 更改标签状态
const tagUpdateState = (params) => getAction("/cms/tag/update_status", params)
// 查询标签是否和内容关联
const outline = (params) => getAction("/cms/tag/checkStatusByContent", params)
// 根据渠道id查找渠道列表
const findChannelList = (params) => postAction("/cms/xtfb/findChannelList", params)
// 查询标签分类
const listTags = (params) => postAction("/cms/tag/selectCategory", params)

//枚举映射关系
const getdepartment = (params)=> postAction("/cms/department/list", params) 
//评论回复
const backContent = (params)=> postAction("/cms/content/comment/createComment", params) 

//发布类型
const ContentStatusData = [
    { label: '草稿', value: '0' },
    { label: '待审核', value: '1' },
    { label: '待发布', value: '2' },
    { label: '驳回待修改', value: '3' },
    { label: '已发布', value: '4' },
    { label: '发布失败', value: '5' }
];
//部门类型枚举映射
const DepartmentTypeData = [
    { label: '海尔', value: '0' },
    { label: '供应商', value: '1' }
];
export {
	ContentStatusData,
	addCenter,
	DeleteCenter,
	updateCent,
	backContent,
	getdepartment,
    listTags,
    outline,
    downloadMaterial,
    tagUpdateState,
    tagUpdate,
    tagAdd,
    tagQuery,
    updateMaterial,
    addMaterial,
    noReadMsg,
    alertMsgState,
    readAll,
    addRole,
    editRole,
    roleList,
    addUser,
    editUser,
    userList,
    addDepartment,
    editDepartment,
    departmentList,
    queryTreeListForRole,
    getPermissionList,
    saveRolePermission,
    DepartmentTypeData,
    auditList,
    auditIng,
    auditDetail,
    totalCount,
    trend,
    thirdPublishChannelList,
    thirdPublishChannelOne,
    dataDictionary,
    thirdPublishChannelAddOne,
    thirdPublishChannelDeleteOne,
    thirdPublishChannelUpdateOne,
    getEditorList,
    saveProcessConfig,
    channelList,
    updateProcessConfig,
    contentManage,
    reportList,
    saveContentReport,
    addMenu,
    editMenu,
    departmentAll,
	postAlist,
    getAuditorByChannelId,
    fixupReviewer,
    postByAlist,
    findChannelList,
	deleteAlist,
	contentTop,
	findCenter,
	downLoad,
	FindeBy,
	changeDownToUp,
    changeUpToDown,
    contentDepartment
}