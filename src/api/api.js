/**
 * Created by UI150730 on 2017/4/17.
 */
import axios from 'axios/dist/axios.min';
var qs = require('qs');

let base = 'http://classroomcrm.yls.com/privateapi';
export const uploadPath = '/privateapi';
// let base = 'http://crmctest.yilesi.cn';
// export const uploadPath = '';
// let base = 'http://crmc.yilesi.cn';
// export const uploadPath = '';

let header = {
    'content-type': 'application/x-www-form-urlencoded'
};

// 判断是否登陆
export const isLogin = params => {
    return axios.post(`${base}/ajax/isLogin`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 登录
export const doLogin = params => {
    return axios.post(`${base}/ajax/doLogin`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 退出登录
export const logout = params => {
    return axios.post(`${base}/ajax/logout`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 更新用户密码
export const passwordUpdate = params => {
    return axios.post(`${base}/ajax/password/update`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};




// 用户列表
export const memberList = params => {
    return axios.post(`${base}/ajax/member/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 编辑用户信息
export const memberEdit = params => {
    return axios.post(`${base}/ajax/member/edit`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 保存内测用户信息
export const saveClosed = params => {
    return axios.post(`${base}/ajax/interiorTest/member/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// excel导入用户
export const memberExcel = params => {
    return axios.post(`${base}/ajax/member/excel/import`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 用户反馈列表
export const feedbackList = params => {
    return axios.post(`${base}/ajax/member/feedback/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 用户反馈excel导出
export const feedbackExport = params => {
    return axios.post(`${base}/ajax/member/feedback/export`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};



// 教学卡统计
export const cardStatistics = params => {
    return axios.post(`${base}/ajax/smartCard/statistics`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 渠道列表
export const channelList = params => {
    return axios.post(`${base}/ajax/channel/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 渠道信息保存
export const channelSave = params => {
    return axios.post(`${base}/ajax/channel/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 智慧卡列表
export const smartCardList = params => {
    return axios.post(`${base}/ajax/smartCard/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 智慧卡信息保存
export const smartCardSave = params => {
    return axios.post(`${base}/ajax/smartCard/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 智慧卡excel导出
export const smartCardExport = params => {
    return axios.post(`${base}/ajax/smartCard/export`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 智慧卡excel导入
export const smartCardImport = params => {
    return axios.post(`${base}/ajax/smartCard/excel/import`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 单卡转移
export const transferCard = params => {
    return axios.post(`${base}/ajax/smartCard/change`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 获取所有的版本
export const getAllSmartDeviceVersion = params => {
    return axios.post(`${base}/ajax/allSmartDeviceVersion`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 渠道id 搜索学校
export const getSchoolListByChannel = params => {
    return axios.post(`${base}/ajax/smartCard/export/condition/schoolList`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};



// 操作日志
export const logList = params => {
    return axios.post(`${base}/ajax/tableLog/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};



// 学制新增或编辑
export const schoolSystemSave = params => {
    return axios.post(`${base}/ajax/schoolSystem/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 学制列表
export const schoolSystemList = params => {
    return axios.post(`${base}/ajax/schoolSystem/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 年级编号列表
export const schoolSystemGradeNumList = params => {
    return axios.post(`${base}/ajax/gradeNum/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 年级编号列表
export const schoolSystemGradeNumVoList = params => {
    return axios.post(`${base}/ajax/gradeNumVo/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 上传学校logo
export const schoolLogoUpload = params => {
    return axios.post(`${base}/ajax/school/logo/upload`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 学校新增或编辑保存
export const schoolSave = params => {
    return axios.post(`${base}/ajax/school/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 学校列表
export const schoolList = params => {
    return axios.post(`${base}/ajax/school/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 学制年级列表
export const schoolGradeList = params => {
    return axios.post(`${base}/ajax/schoolSystem/grade/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 获取学校编号
export const schoolCode = params => {
    return axios.post(`${base}/ajax/generate/schoolCode`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 获取班级编号
export const schoolClassCode = params => {
    return axios.post(`${base}/ajax/schoolClass/code`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 班级新增或编辑
export const schoolClassSave = params => {
    return axios.post(`${base}/ajax/schoolClass/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 班级列表
export const schoolClassList = params => {
    return axios.post(`${base}/ajax/schoolClass/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 添加学生
export const schoolStudentAdd = params => {
    return axios.post(`${base}/ajax/schoolStudent/add`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 转移学生
export const schoolStudentShift = params => {
    return axios.post(`${base}/ajax/schoolStudent/shift`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 删除学生
export const schoolStudentDelete = params => {
    return axios.post(`${base}/ajax/schoolStudent/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 添加教师
export const schoolTeacherAdd = params => {
    return axios.post(`${base}/ajax/schoolTeacher/add`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 删除教师
export const schoolTeacherDelete = params => {
    return axios.post(`${base}/ajax/schoolTeacher/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 编辑教师
export const schoolTeacherEdit = params => {
    return axios.post(`${base}/ajax/schoolTeacher/edit`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 班级教师列表
export const schoolClassTeacherList = params => {
    return axios.post(`${base}/ajax/schoolClass/teacher/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 班级学生列表
export const schoolClassStudentList = params => {
    return axios.post(`${base}/ajax/schoolClass/student/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 添加教职工
export const schoolStaffAdd = params => {
    return axios.post(`${base}/ajax/school/teachStaff/add`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 删除教职工
export const schoolStaffDelete = params => {
    return axios.post(`${base}/ajax/school/teachStaff/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 学校教职工列表
export const schoolStaffList = params => {
    return axios.post(`${base}/ajax/school/teachStaffList`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 未添加的学校教职工列表
export const notContainsSchoolStaffList = params => {
    return axios.post(`${base}/ajax/notContains/teachStaff/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 用户管理总览
export const userAllData = params => {
    return axios.post(`${base}/ajax/member/getUserManageData`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// OU总览
export const ouAllData = params => {
    return axios.post(`${base}/ajax/school/getOUdata`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// mac接收器列表查询
export const macList = params => {
    return axios.post(`${base}/ajax/school/getSchoolAcceptors`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 增加和更新接收器
export const macOperate = params => {
    return axios.post(`${base}/ajax/school/saveSchoolAcceptor`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 删除接收器
export const macDelete = params => {
    return axios.post(`${base}/ajax/school/deleteSchoolAcceptor`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 学校区域列表
export const areaList = params => {
    return axios.post(`${base}/ajax/school/region/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 生成学校区域编号
export const areaCode = params => {
    return axios.post(`${base}/ajax/generate/regionCode`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 新增或编辑学校区域
export const areaSave = params => {
    return axios.post(`${base}/ajax/school/region/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 删除学校区域
export const areaDelete = params => {
    return axios.post(`${base}/ajax/school/region/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 未添加的接收器列表
export const areaMachineList = params => {
    return axios.post(`${base}/ajax/school/notContains/acceptorList`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 上传学校区域地图
export const uploadSchoolArea = params => {
    return axios.post(`${base}/ajax/school/regionMap/upload`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 保存学校区域坐标
export const saveSchoolAreaPoints = params => {
    return axios.post(`${base}/ajax/school/regionMapPoint/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 保存单个区域地图坐标
export const saveSchoolRegionMapPoint = params => {
    return axios.post(`${base}/ajax/schoolRegion/mapPoint/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};

// 获取学校详情
export const getSchoolAreaDetail = params => {
    return axios.post(`${base}/ajax/school/regionMap`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};


// 标签分类列表
export const tagsClassifyList = params => {
    return axios.post(`${base}/ajax/tagType/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 标签分类新增或编辑
export const tagsClassifySave = params => {
    return axios.post(`${base}/ajax/tagType/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 删除标签分类
export const tagsClassifyDelete = params => {
    return axios.post(`${base}/ajax/tagType/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 标签列表
export const tagsList = params => {
    return axios.post(`${base}/ajax/tag/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 标签新增或编辑
export const tagsSave = params => {
    return axios.post(`${base}/ajax/tag/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 删除标签
export const tagsDelete = params => {
    return axios.post(`${base}/ajax/tag/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};




// 视频总览
export const courseRecordStatistics = params => {
    return axios.post(`${base}/ajax/courseRecord/statistics`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 视频记录列表 /微课视频列表
export const courseRecordList = params => {
    return axios.post(`${base}/ajax/courseRecord/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 更新课程视频标签
export const courseRecordTagUpdate = params => {
    return axios.post(`${base}/ajax/courseRecord/tag/update`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 增加播放次数
export const courseRecordPlayNumAdd = params => {
    return axios.post(`${base}/ajax/courseRecord/playNum/add`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 刷赞
export const courseRecordLikeNumAdd = params => {
    return axios.post(`${base}/ajax/courseRecord/likeNum/add`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 微课信息更新
export const courseRecordMicroUpdate = params => {
    return axios.post(`${base}/ajax/courseRecord/micro/update`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 屏蔽视频
export const courseRecordStop = params => {
    return axios.post(`${base}/ajax/courseRecord/stop`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 微课排行榜
export const courseRecordRankingList = params => {
    return axios.post(`${base}/ajax/courseRecordRanking/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 微课排行榜信息更新
export const courseRecordRankingUpdate = params => {
    return axios.post(`${base}/ajax/courseRecordRanking/update`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 发布微课排行榜
export const courseRecordRankingPublish = params => {
    return axios.post(`${base}/ajax/courseRecordRanking/publish`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};



// 学校个性化设置 - 获取功能设置
export const schoolPersonalFunctionSet = params => {
    return axios.post(`${base}/ajax/schoolPersonalSet/getFunctionSet`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 学校个性化设置 - 修改功能设置
export const schoolPersonalFunctionSetUpdate = params => {
    return axios.post(`${base}/ajax/schoolPersonalSet/updateFunctionSet`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 学校个性化设置 - 获取轨迹显示设置
export const schoolPersonalTraceSet = params => {
    return axios.post(`${base}/ajax/schoolPersonalSet/getTrajectorySet`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 学校个性化设置 - 修改轨迹显示设置
export const schoolPersonalTraceSetUpdate = params => {
    return axios.post(`${base}/ajax/schoolPersonalSet/updateTrajectorySet`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};



// 考勤时间表 - 获取年级
export const schoolAttendanceGradeList = params => {
    return axios.post(`${base}/ajax/attendanceTime/schoolSystemGradeList`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 新增课时
export const schoolAttendanceAdd = params => {
    return axios.post(`${base}/ajax/attendanceTime/insert`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 获取学校的某年级考勤时间表
export const schoolAttendanceList = params => {
    return axios.post(`${base}/ajax/attendanceTime/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 编辑课时
export const schoolAttendanceEdit = params => {
    return axios.post(`${base}/ajax/attendanceTime/update`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 课时复用
export const schoolAttendanceReUsed = params => {
    return axios.post(`${base}/ajax/attendanceTime/reused`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 删除课时
export const schoolAttendanceDelete = params => {
    return axios.post(`${base}/ajax/attendanceTime/delete`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 获取学校可复用课时的学段列表
export const schoolAttendanceCanUsePeriodList = params => {
    return axios.post(`${base}/ajax/attendanceTime/canReusedPeriod`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 考勤时间表 - 获取学校可复用课时的年纪列表
export const schoolAttendanceCanUseGradeList = params => {
    return axios.post(`${base}/ajax/attendanceTime/canReusedGrades`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};



// 智慧卡和手环版本列表 - 版本列表
export const smartVersionList = params => {
    return axios.post(`${base}/ajax/smartDeviceVersion/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 智慧卡和手环版本列表 - 储存版本
export const smartVersionSave = params => {
    return axios.post(`${base}/ajax/smartDeviceVersion/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};


// 根据班级统计考勤
export const attendanceSystemStatistics = params => {
    return axios.post(`${base}/attendance/systemStatistics`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 老师发起的考勤统计
export const attendanceTeacherStatistics = params => {
    return axios.post(`${base}/attendance/teacherStatistics`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 根据学校查询老师
export const schoolTeacherList = params => {
    return axios.post(`${base}/ajax/school/teacherList`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};




// 智慧班牌 - 获取列表
export const smartClassBrandList = params => {
    return axios.post(`${base}/ajax/smartClassBrand/list`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// 智慧班牌 - 修改
export const smartClassBrandSave = params => {
    return axios.post(`${base}/ajax/smartClassBrand/save`, qs.stringify(params), {
        headers: header
    }).then(res => res.data);
};
// // 智慧班牌 - 导入基本信息
// export const smartClassBrandImportActivate = params => {
//     return axios.post(`${base}/ajax/smartClassBrand/import/activate`, qs.stringify(params), {
//         headers: header
//     }).then(res => res.data);
// };
// // 智慧班牌 - 导入应用信息
// export const  = params => {
//     return axios.post(`${base}/schoolPersonalSet/applicationInfo`, qs.stringify(params), {
//         headers: header
//     }).then(res => res.data);
// };




























