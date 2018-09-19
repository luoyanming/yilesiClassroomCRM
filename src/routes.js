import login from './views/login.vue'
import index from './views/index.vue'


import cusermanage from './views/c-user-manage.vue'
import cuser from './views/c-user.vue'
import closed from './views/c-closed.vue'
import feedback from './views/c-feedback.vue'
import card from './views/c-card.vue'
import channel from './views/c-channel.vue'
import control from './views/c-control.vue'
import log from './views/c-log.vue'

import schoolmanage from './views/c-school-manage.vue'
import school from './views/c-school.vue'
import schoolClass from './views/c-school-class.vue'
import schoolSystem from './views/c-school-system.vue'
import schoolTree from './views/c-school-tree.vue'
import schoolStaff from './views/c-school-staff.vue'
import schoolMachine from './views/c-school-machine.vue'
import schoolArea from './views/c-school-area.vue'
import schoolAreaMap from './views/c-school-area-map.vue'

import tagsClassify from './views/c-tags-classify.vue'
import tagsManage from './views/c-tags-manage.vue'

import video from './views/c-video.vue'
import videoCourse from './views/c-video-course.vue'
import videoWxlist from './views/c-video-wxlist.vue'
import videoWxlistRank from './views/c-video-wxlist-rank.vue'




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
        path: "/cusermanage",
        component: cusermanage,
        name: "用户总览",
        meta: {
            nav: "cusermanage",
            requiresAuth: true
        }
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
        path: "/schoolmanage",
        component: schoolmanage,
        name: "OU总览",
        meta: {
            nav: "schoolmanage",
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
        path: "/schoolStaff",
        component: schoolStaff,
        name: "学校教职工管理",
        meta: {
            nav: "schoolStaff",
            requiresAuth: true
        }
    },
    {
        path: "/schoolMachine",
        component: schoolMachine,
        name: "学校接收器管理",
        meta: {
            nav: "schoolMachine",
            requiresAuth: true
        }
    },    
    {
        path: "/schoolArea",
        component: schoolArea,
        name: "学校区域管理",
        meta: {
            nav: "schoolArea",
            requiresAuth: true
        }
    },
    {
        path: "/schoolAreaMap",
        component: schoolAreaMap,
        name: "学校区域地图",
        meta: {
            nav: "schoolArea",
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
    },
    {
        path: "/tagsClassify",
        component: tagsClassify,
        name: "标签分类",
        meta: {
            nav: "tagsClassify",
            requiresAuth: true
        }
    },
    {
        path: "/tagsManage",
        component: tagsManage,
        name: "标签管理",
        meta: {
            nav: "tagsManage",
            requiresAuth: true
        }
    },
    {
        path: "/video",
        component: video,
        name: "视频总览",
        meta: {
            nav: "video",
            requiresAuth: true
        }
    },
    {
        path: "/videoCourse",
        component: videoCourse,
        name: "课程记录",
        meta: {
            nav: "videoCourse",
            requiresAuth: true
        }
    },
    {
        path: "/videoWxlist",
        component: videoWxlist,
        name: "微课",
        meta: {
            nav: "videoWxlist",
            requiresAuth: true
        }
    },
    {
        path: "/videoWxlistRank",
        component: videoWxlistRank,
        name: "微课排行榜",
        meta: {
            nav: "videoWxlistRank",
            requiresAuth: true
        }
    }
];

export default routes;