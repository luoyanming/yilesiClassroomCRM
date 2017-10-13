import login from './views/login.vue'
import index from './views/index.vue'


import cuser from './views/c-user.vue'
import closed from './views/c-closed.vue'
import feedback from './views/c-feedback.vue'
import card from './views/c-card.vue'
import channel from './views/c-channel.vue'
import control from './views/c-control.vue'
import log from './views/c-log.vue'


import user from './views/user.vue'
import userUsual from './views/userUsual.vue'
import userAdd from './views/userAdd.vue'
import userDetail from './views/userDetail.vue'
import userHot from './views/userHot.vue'
import dynamic from './views/dynamic.vue'
import dynamicAdd from './views/dynamicAdd.vue'
import dynamicDetail from './views/dynamicDetail.vue'
import dynamicHot from './views/dynamicHot.vue'
import dynamicUsual from './views/dynamicUsual.vue'

import topicManagement from './views/topicManagement.vue'
import topicDetails from './views/topicDetails.vue'
import topicModify from './views/topicModify.vue'
import carService from './views/carService.vue'
import carSerDetails from './views/carSerDetails.vue'
import carEdit from './views/carEdit.vue'
import LicensePlate from './views/LicensePlate.vue'
import LicensePlateDetail from './views/LicensePlateDetail.vue'

import permissionAccount from './views/permissionAccount.vue'
import permissionAccountDetail from './views/permissionAccountDetail.vue'
import permissionAccountAdd from './views/permissionAccountAdd.vue'
import permissionRole from './views/permissionRole.vue'
import permissionRoleDetail from './views/permissionRoleDetail.vue'
import permissionRoleAdd from './views/permissionRoleAdd.vue'

import sensitive from './views/sensitive.vue'
import systemLog from './views/systemLog.vue'

import banner from './views/banner.vue'
import bannerAdd from "./views/bannerAdd.vue";
import order from "./views/order.vue";
import orderDetail from "./views/orderDetail.vue";

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
        name: "用户",
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
        path: "/user",
        component: user,
        name: "用户管理",
        meta: {
            nav: "user",
            requiresAuth: true
        }
    },
    {
        path: "/userUsual",
        component: userUsual,
        name: "常用作者",
        meta: {
            nav: "userUsual",
            requiresAuth: true
        }
    },
    {
        path: "/userAdd",
        component: userAdd,
        name: "新增用户",
        meta: {
            nav: "user",
            requiresAuth: true
        }
    },
    {
        path: "/userDetail",
        component: userDetail,
        name: "用户详情",
        meta: {
            nav: "user",
            requiresAuth: true
        }
    },
    {
        path: "/userHot",
        component: userHot,
        name: "热门用户",
        meta: {
            nav: "user",
            requiresAuth: true
        }
    },
    {
        path: "/dynamic",
        component: dynamic,
        name: "动态管理",
        meta: {
            nav: "dynamic",
            requiresAuth: true
        }
    },
    {
        path: "/dynamicAdd",
        component: dynamicAdd,
        name: "动态新增",
        meta: {
            nav: "dynamic",
            requiresAuth: true
        }
    },
    {
        path: "/dynamicDetail",
        component: dynamicDetail,
        name: "动态详情",
        meta: {
            nav: "dynamic",
            requiresAuth: true
        }
    },
    {
        path: "/dynamicHot",
        component: dynamicHot,
        name: "热门动态",
        meta: {
            nav: "dynamic",
            requiresAuth: true
        }
    },
    {
        path: "/dynamicUsual",
        component: dynamicUsual,
        name: "热门动态",
        meta: {
            nav: "dynamic",
            requiresAuth: true
        }
    },
    {
        path: "/topicManagement",
        component: topicManagement,
        name: "专题管理",
        meta: {
            nav: "theme",
            requiresAuth: true
        }
    },
    {
        path: "/topicDetails",
        component: topicDetails,
        name: "专题详情",
        meta: {
            nav: "theme",
            requiresAuth: true
        }
    },
    {
        path: "/topicModify",
        component: topicModify,
        name: "修改专题",
        meta: {
            nav: "theme",
            requiresAuth: true
        }
    },
    {
        path: "/carSerDetails",
        component: carSerDetails,
        name: "服务详情",
        meta: {
            nav: "car",
            requiresAuth: true
        }
    },
    {
        path: "/carEdit",
        component: carEdit,
        name: "编辑服务详情",
        meta: {
            nav: "car",
            requiresAuth: true
        }
    },
    {
        path: "/carService",
        component: carService,
        name: "车服务",
        meta: {
            nav: "car",
            requiresAuth: true
        }
    },
    {
        path: "/permissionAccount",
        component: permissionAccount,
        name: "账号列表",
        meta: {
            nav: "permissionAccount",
            requiresAuth: true
        }
    },
    {
        path: "/permissionAccountDetail",
        component: permissionAccountDetail,
        name: "账号列表详情",
        meta: {
            nav: "permissionAccount",
            requiresAuth: true
        }
    },
    {
        path: "/permissionAccountAdd",
        component: permissionAccountAdd,
        name: "账号列表新增账号",
        meta: {
            nav: "permissionAccount",
            requiresAuth: true
        }
    },
    {
        path: "/permissionRole",
        component: permissionRole,
        name: "角色列表",
        meta: {
            nav: "permissionRole",
            requiresAuth: true
        }
    },
    {
        path: "/permissionRoleDetail",
        component: permissionRoleDetail,
        name: "角色列表详情",
        meta: {
            nav: "permissionRole",
            requiresAuth: true
        }
    },
    {
        path: "/permissionRoleAdd",
        component: permissionRoleAdd,
        name: "角色列表新增角色",
        meta: {
            nav: "permissionRole",
            requiresAuth: true
        }
    },
    {
        path: "/sensitive",
        component: sensitive,
        name: "敏感信息词库",
        meta: {
            nav: "sensitive",
            requiresAuth: true
        }
    },
    {
        path: "/systemLog",
        component: systemLog,
        name: "系统日志",
        meta: {
            nav: "systemLog",
            requiresAuth: true
        }
    },
    {
        path: "/LicensePlate",
        component: LicensePlate,
        name: "车牌库",
        meta: {
            nav: "LicensePlate",
            requiresAuth: true
        }
    },
    {
        path: "/LicensePlateDetail",
        component: LicensePlateDetail,
        name: "查看品牌详情",
        meta: {
            nav: "LicensePlateDetail",
            requiresAuth: true
        }
    },
    {
        path: "/banner",
        component: banner,
        name: "banner管理",
        meta: {
            nav: "banner",
            requiresAuth: true
        }
    },
    {
        path: "/bannerAdd",
        component: bannerAdd,
        name: "新增banner",
        meta: {
            nav: "banner",
            requiresAuth: true
        }
    },
    {
        path: "/order",
        component: order,
        name: "订单管理",
        meta: {
            nav: "order",
            requiresAuth: true
        }
    },
    {
        path: "/orderDetail",
        component: orderDetail,
        name: "订单详情",
        meta: {
            nav: "order",
            requiresAuth: true
        }
    }

    //{
    //    path: '/',
    //    component: layout,
    //    name: '课程上传',
    //    children: [
    //        {
    //            path: '/course',
    //            component: courseList,
    //            name: '课程列表',
    //            meta: {
    //                requiresAuth: true
    //            }
    //        }
    //    ]
    //}
];

export default routes;