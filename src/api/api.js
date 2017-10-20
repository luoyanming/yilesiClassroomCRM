/**
 * Created by UI150730 on 2017/4/17.
 */
import axios from 'axios/dist/axios.min';
var qs = require('qs');

// let base = 'http://crmc.yilesi.cn';
let base = 'http://classroomcrm.yls.com/privateapi';
export const uploadPath = '/privateapi';

let header = { 'content-type': 'application/x-www-form-urlencoded' };

// 判断是否登陆
export const isLogin = params => { return axios.post(`${base}/ajax/isLogin`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 登录
export const doLogin = params => { return axios.post(`${base}/ajax/doLogin`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 退出登录
export const logout = params => { return axios.post(`${base}/ajax/logout`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 更新用户密码
export const passwordUpdate = params => { return axios.post(`${base}/ajax/password/update`, qs.stringify(params), { headers: header }).then(res => res.data); };




// 用户列表
export const memberList = params => { return axios.post(`${base}/ajax/member/list`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 编辑用户信息
export const memberEdit = params => { return axios.post(`${base}/ajax/member/edit`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 保存内测用户信息
export const saveClosed = params => { return axios.post(`${base}/ajax/interiorTest/member/save`, qs.stringify(params), { headers: header }).then(res => res.data); };

// excel导入用户
export const memberExcel = params => { return axios.post(`${base}/ajax/member/excel/import`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 用户反馈列表
export const feedbackList = params => { return axios.post(`${base}/ajax/member/feedback/list`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 用户反馈excel导出
export const feedbackExport = params => { return axios.post(`${base}/ajax/member/feedback/export`, qs.stringify(params), { headers: header }).then(res => res.data); };



// 教学卡统计
export const cardStatistics = params => { return axios.post(`${base}/ajax/smartCard/statistics`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 渠道列表
export const channelList = params => { return axios.post(`${base}/ajax/channel/list`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 渠道信息保存
export const channelSave = params => { return axios.post(`${base}/ajax/channel/save`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 智慧卡列表
export const smartCardList = params => { return axios.post(`${base}/ajax/smartCard/list`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 智慧卡信息保存
export const smartCardSave = params => { return axios.post(`${base}/ajax/smartCard/save`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 智慧卡excel导出
export const smartCardExport = params => { return axios.post(`${base}/ajax/smartCard/export`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 智慧卡excel导入
export const smartCardImport = params => { return axios.post(`${base}/ajax/smartCard/excel/import`, qs.stringify(params), { headers: header }).then(res => res.data); };



// 操作日志
export const logList = params => { return axios.post(`${base}/ajax/tableLog/list`, qs.stringify(params), { headers: header }).then(res => res.data); };
