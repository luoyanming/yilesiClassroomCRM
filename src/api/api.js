/**
 * Created by UI150730 on 2017/4/17.
 */
import axios from 'axios/dist/axios.min';
var qs = require('qs');

// let base = 'http://classroomcrm.yls.com/privateapi';
// export const uploadPath = '/privateapi';
let base = 'http://crmctest.yilesi.cn';
export const uploadPath = '';
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




































