import login from './views/login.vue'
import index from './views/index.vue'


import cuser from './views/c-user.vue'
import closed from './views/c-closed.vue'
import feedback from './views/c-feedback.vue'
import card from './views/c-card.vue'
import channel from './views/c-channel.vue'
import control from './views/c-control.vue'
import log from './views/c-log.vue'

import school from './views/c-school.vue'
import schoolClass from './views/c-school-class.vue'
import schoolSystem from './views/c-school-system.vue'
import schoolTree from './views/c-school-tree.vue'


let routes = [{
        path: "/",
        component: index,
        name: "首页",
        meta: {
            nav: "index",
            requiresAuth: true
        }
    },
    {
        path: "/login",
        component: login,
        name: "登录"
    },
    {
        path: "/cuser",
        component: cuser,
        name: "用户管理",
        meta: {
            nav: "cuser",
            requiresAuth: true
        }
    },
    {
        path: "/closed",
        component: closed,
        name: "内测用户",
        meta: {
            nav: "closed",
            requiresAuth: true
        }
    },
    {
        path: "/feedback",
        component: feedback,
        name: "用户反馈",
        meta: {
            nav: "feedback",
            requiresAuth: true
        }
    },
    {
        path: "/card",
        component: card,
        name: "智慧教学卡综述",
        meta: {
            nav: "card",
            requiresAuth: true
        }
    },
    {
        path: "/channel",
        component: channel,
        name: "渠道管理",
        meta: {
            nav: "channel",
            requiresAuth: true
        }
    },
    {
        path: "/control",
        component: control,
        name: "智慧卡管理",
        meta: {
            nav: "control",
            requiresAuth: true
        }
    },
    {
        path: "/log",
        component: log,
        name: "系统日志",
        meta: {
            nav: "log",
            requiresAuth: true
        }
    },
    {
        path: "/school",
        component: school,
        name: "学制管理",
        meta: {
            nav: "school",
            requiresAuth: true
        }
    },
    {
        path: "/schoolSystem",
        component: schoolSystem,
        name: "学校管理",
        meta: {
            nav: "schoolSystem",
            requiresAuth: true
        }
    },
    {
        path: "/schoolClass",
        component: schoolClass,
        name: "班级管理",
        meta: {
            nav: "schoolClass",
            requiresAuth: true
        }
    },
    {
        path: "/schoolTree",
        component: schoolTree,
        name: "结构树",
        meta: {
            nav: "schoolTree",
            requiresAuth: true
        }
    }
];

export default routes;