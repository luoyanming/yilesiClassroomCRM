import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'

import './styles/global.scss'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)


import Header from './components/header/header'
Vue.use(Header);
import Nav from './components/nav/nav'
Vue.use(Nav);


//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    // mode: 'history',
    routes
})

// import { isLogin } from './api/api'
// router.beforeEach((to, from, next) => {
//    if (to.matched.some(record => record.meta.requiresAuth)) {
//        NProgress.start();

//        isLogin({}).then(res =>{
//            NProgress.done();

//            let { code, msg, data } = res;

//            if(code !== 0) {
//                next({
//                    path: '/login'
//                })
//            } else {
//                next()
//            }
//        });
//    } else {
//        next()
//    }
// });


new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')