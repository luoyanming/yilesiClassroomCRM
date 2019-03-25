import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/theme/theme-green/index.css'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './routes'

import './styles/global.scss'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(ElementUI)
Vue.use(Vuex)


import { isLogin } from './api/api'
router.beforeEach((to, from, next) => {
    if (!to.matched.some(record => record.meta.noAuth)) {
        NProgress.start();

        isLogin({}).then(res =>{
            NProgress.done();

            let { code, msg, data } = res;

            if(code !== 0) {
                next({
                    path: '/login'
                })
            } else {
                // 0: 学校； 1: 渠道； 2: admin
                localStorage.setItem('role', data.account.type);
                // 0: 普通管理员 1: 超级管理员
                localStorage.setItem('admin', data.member.roleAdmin);

                localStorage.setItem('account', data.member.mobile);

                if(to.meta && to.meta.route) {
                    if(to.meta.route.indexOf(data.account.type) > -1) {
                        next()
                    } else {
                        Vue.prototype.$message.error('您没有权限访问页面: ' + to.name);
                    }
                } else {
                    next()
                }
            }
        }).catch(error => {
            Vue.prototype.$message.error('服务器异常');
            next({
                path: '/login'
            })
        });
    } else {
        next()
    }
});


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')