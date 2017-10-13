/**
 * Created by UI150730 on 2017/4/17.
 */
import axios from 'axios/dist/axios.min';
var qs = require('qs');

// let base = 'http://crmdev.ohmycar.com/privateapi';
// export const BASE = '/privateapi';
let base = '';
export const BASE = '';

let header = { 'content-type': 'application/x-www-form-urlencoded' };

// 判断是否登陆
export const isLogin = params => { return axios.post(`${base}/isLogin`, qs.stringify(params), { headers: header }).then(res => res.data); };
