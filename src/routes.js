import Vue from 'vue'
import Router from 'vue-router'


import layout from './views/layout.vue'

import login from './views/login.vue'
import index from './views/index.vue'


import cusermanage from './views/c-user-manage.vue'
import cuser from './views/c-user.vue'
import closed from './views/c-closed.vue'
import feedback from './views/c-feedback.vue'
import machine from './views/c-machine.vue'
import channel from './views/c-channel.vue'
import log from './views/c-log.vue'

import schoolmanage from './views/c-school-manage.vue'
import school from './views/c-school.vue'
import schoolClass from './views/c-school-class.vue'
import schoolSystem from './views/c-school-system.vue'
import schoolTree from './views/c-school-tree.vue'
import schoolStaff from './views/c-school-staff.vue'
import schoolArea from './views/c-school-area.vue'
import schoolAreaMap from './views/c-school-area-map.vue'

import tagsClassify from './views/c-tags-classify.vue'
import tagsManage from './views/c-tags-manage.vue'

import video from './views/c-video.vue'
import videoCourse from './views/c-video-course.vue'
import videoWxlist from './views/c-video-wxlist.vue'
import videoWxlistRank from './views/c-video-wxlist-rank.vue'


import machineVersionCard from './views/c-machine-version-card.vue'
import machineVersionBoard from './views/c-machine-version-board.vue'
import machineVersionBookrack from './views/c-machine-version-bookrack.vue'
import machineVersionAcceptor from './views/c-machine-version-acceptor.vue'
import machineVersionCamera from './views/c-machine-version-camera.vue'
import machineVersionCabinet from './views/c-machine-version-cabinet.vue'

import machineCard from './views/c-machine-card.vue'
import machineBoard from './views/c-machine-board.vue'
import machineBookrack from './views/c-machine-bookrack.vue'
import machineAcceptor from './views/c-machine-acceptor.vue'
import machineCamera from './views/c-machine-camera.vue'
import machineCabinet from './views/c-machine-cabinet.vue'

import schoolAttendance from './views/c-school-attendance.vue'
import schoolKexun from './views/c-school-kexun.vue'

import settingFunction from './views/c-setting-function.vue'
import settingTrace from './views/c-setting-trace.vue'

import optionClassRelation from './views/c-option-class-relation.vue'

import accountAdmin from './views/c-account-admin.vue'
import accountChannel from './views/c-account-channel.vue'
import accountSchool from './views/c-account-school.vue'

Vue.use(Router)

export default new Router({
    routes: [
        /* ===================================================================================================
        ** login
        ** =================================================================================================== */
        {
            path: "/login",
            component: login,
            name: "登录",
            meta: {
                noAuth: true
            }
        },

        /* ===================================================================================================
        ** /
        ** =================================================================================================== */
        {
            path: "/",
            component: index,
            name: "首页"
        },

        /* ===================================================================================================
        ** cuser
        ** =================================================================================================== */
        {
            path: "/user",
            component: layout,
            name: "用户总览",
            meta: {
                alias: "user",
                show: [2],
                route: [2]
            },
            children: [
                {
                    path: "/user",
                    component: cusermanage,
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/user/manage",
                    component: cuser,
                    name: "用户管理",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/user/closed",
                    component: closed,
                    name: "内测用户",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/user/feedback",
                    component: feedback,
                    name: "用户反馈",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** channel
        ** =================================================================================================== */
        {
            path: "/channel",
            component: channel,
            name: "渠道管理",
            meta: {
                alias: "channel",
                show: [2],
                route: [2]
            }
        },

        /* ===================================================================================================
        ** version
        ** =================================================================================================== */
        {
            path: "",
            component: layout,
            name: "智慧设备版本",
            meta: {
                alias: "version",
                show: [2],
                route: [2]
            },
            children: [
                {
                    path: "/version/card",
                    component: machineVersionCard,
                    name: "智慧卡及手环版本",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/version/board",
                    component: machineVersionBoard,
                    name: "智慧班牌版本",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/version/bookrack",
                    component: machineVersionBookrack,
                    name: "智慧书架版本",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/version/acceptor",
                    component: machineVersionAcceptor,
                    name: "智慧接收器版本",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/version/camera",
                    component: machineVersionCamera,
                    name: "智慧摄像头版本",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/version/cabinet",
                    component: machineVersionCabinet,
                    name: "智慧文教柜版本",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
            ]
        },

        /* ===================================================================================================
        ** machine
        ** =================================================================================================== */
        {
            path: "/machine",
            component: layout,
            name: "智慧设备总览",
            meta: {
                alias: "machine",
                show: [0, 1, 2],
                route: [2]
            },
            children: [
                {
                    path: "/machine",
                    component: machine,
                    name: "智慧设备总览",
                    meta: {
                        show: [0, 1, 2],
                        route: [2]
                    }
                },
                {
                    path: "/machine/card",
                    component: machineCard,
                    name: "智慧卡及手环",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/machine/board",
                    component: machineBoard,
                    name: "智慧班牌",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/machine/bookrack",
                    component: machineBookrack,
                    name: "智慧书架",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/machine/acceptor",
                    component: machineAcceptor,
                    name: "智慧接收器",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/machine/camera",
                    component: machineCamera,
                    name: "智慧摄像头",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/machine/cabinet",
                    component: machineCabinet,
                    name: "智慧文教柜",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** schoolSystem
        ** =================================================================================================== */
        {
            path: "/schoolSystem",
            component: schoolSystem,
            name: "学制管理",
            meta: {
                alias: "schoolSystem",
                show: [2],
                route: [2]
            }
        },

        /* ===================================================================================================
        ** school
        ** =================================================================================================== */
        {
            path: "/school",
            component: layout,
            name: "OU总览",
            meta: {
                alias: "school",
                show: [0, 1, 2],
                route: [2]
            },
            children: [
                {
                    path: "/school",
                    component: schoolmanage,
                    name: "OU总览",
                    meta: {
                        show: [0, 1, 2],
                        route: [2]
                    }
                },
                {
                    path: "/school/manage",
                    component: school,
                    name: "学校管理",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/school/staff",
                    component: schoolStaff,
                    name: "学校教职工管理",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/school/class",
                    component: schoolClass,
                    name: "班级管理",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/school/tree",
                    component: schoolTree,
                    name: "学校结构树",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/school/attendance",
                    component: schoolAttendance,
                    name: "学校考勤时间表",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/school/kexun",
                    component: schoolKexun,
                    name: "学校可寻汇总表",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/school/area",
                    component: schoolArea,
                    name: "学校区域管理",
                    meta: {
                        show: [1, 2],
                        route: [1, 2]
                    }
                }
            ]
        },

        {
            path: "/school/area/map",
            component: schoolAreaMap,
            name: "学校区域地图"
        },

        /* ===================================================================================================
        ** tag
        ** =================================================================================================== */
        {
            path: "",
            component: layout,
            name: "标签库",
            meta: {
                alias: "tags",
                show: [2],
                route: [2]
            },
            children: [
                {
                    path: "/tags/classify",
                    component: tagsClassify,
                    name: "标签分类",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/tags/manage",
                    component: tagsManage,
                    name: "标签管理",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** video
        ** =================================================================================================== */
        {
            path: "/video",
            component: layout,
            name: "视频总览",
            meta: {
                alias: "video",
                show: [0, 1, 2],
                route: [2]
            },
            children: [
                {
                    path: "/video",
                    component: video,
                    name: "视频总览",
                    meta: {
                        show: [0, 1, 2],
                        route: [2]
                    }
                },
                {
                    path: "/video/course",
                    component: videoCourse,
                    name: "课程记录",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/video/wxlist",
                    component: videoWxlist,
                    name: "微课",
                    meta: {
                        show: [0, 1, 2],
                        route: [0, 1, 2]
                    }
                },
                {
                    path: "/video/wxlistRank",
                    component: videoWxlistRank,
                    name: "微课排行榜",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** 对接设置
        ** =================================================================================================== */
        {
            path: "",
            component: layout,
            name: "对接设置",
            meta: {
                alias: "setting",
                show: [2],
                route: [2]
            },
            children: [
                {
                    path: "/optionClass/relation",
                    component: optionClassRelation,
                    name: "排班走班",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** 账户管理
        ** =================================================================================================== */
        {
            path: "",
            component: layout,
            name: "账户管理",
            meta: {
                alias: "setting",
                show: [2],
                route: [2]
            },
            children: [
                {
                    path: "/account/admin",
                    component: accountAdmin,
                    name: "admin账户",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/account/channel",
                    component: accountChannel,
                    name: "渠道账户",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/account/school",
                    component: accountSchool,
                    name: "学校账户",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** 学校个性化设置
        ** =================================================================================================== */
        {
            path: "",
            component: layout,
            name: "学校个性化设置",
            meta: {
                alias: "setting",
                show: [2],
                route: [2]
            },
            children: [
                {
                    path: "/setting/function",
                    component: settingFunction,
                    name: "功能设置",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                },
                {
                    path: "/setting/trace",
                    component: settingTrace,
                    name: "行为轨迹显示",
                    meta: {
                        show: [2],
                        route: [2]
                    }
                }
            ]
        },

        /* ===================================================================================================
        ** 日志
        ** =================================================================================================== */
        {
            path: "/log",
            component: log,
            name: "系统日志",
            meta: {
                alias: "log",
                show: [2],
                route: [2]
            }
        }
    ]
});
