<template>
    <nav class="nav">
        <ul>
            <li v-for="item in menu">
                <a href="javascript:void(0);" class="navitem"
                    v-bind:class="{ 'current': (item.leftnav == status) }" 
                    v-show="item.show"
                    @click="linkTo(item.url, item.leftnav)"
                    v-if="item.url">{{ item.title }}</a>
                <a href="javascript:void(0);" class="navitem navitem-nourl"
                    v-bind:class="{ 'current': (item.leftnav == status) }" 
                    v-show="item.show"
                    v-if="!item.url">{{ item.title }}</a>
            </li>
        </ul>
    </nav>
</template>

<script>
    import { privilegeLeftmenu } from '../../api/api';

    export default {
        data() {
            return {
                status: 'user',
                menu: [
                    {
                        'name': '用户总览',
                        'title': '用户总览',
                        'url': '/cusermanage',
                        'leftnav': 'cusermanage',
                        'show': true
                    },
                    {
                        'name': '用户管理',
                        'title': '用户管理',
                        'url': '/cuser',
                        'leftnav': 'cuser',
                        'show': true
                    },                    
                    {
                        'name': '内测用户',
                        'title': '内测用户',
                        'url': '/closed',
                        'leftnav': 'closed',
                        'show': true
                    },
                    {
                        'name': '用户反馈',
                        'title': '用户反馈',
                        'url': '/feedback',
                        'leftnav': 'feedback',
                        'show': true
                    },
                    {
                        'name': '渠道管理',
                        'title': '渠道管理',
                        'url': '/channel',
                        'leftnav': 'channel',
                        'show': true
                    },
                    {
                        'name': '智慧设备版本',
                        'title': '智慧设备版本',
                        'url': '',
                        'leftnav': 'version',
                        'show': true
                    },
                    {
                        'name': '智慧卡及手环版本',
                        'title': '智慧卡及手环版本',
                        'url': '/machineVersionCard',
                        'leftnav': 'machineVersionCard',
                        'show': true
                    },
                    {
                        'name': '智慧班牌版本',
                        'title': '智慧班牌版本',
                        'url': '/machineVersionBoard',
                        'leftnav': 'machineVersionBoard',
                        'show': true
                    },
                    {
                        'name': '智慧设备总览',
                        'title': '智慧设备总览',
                        'url': '/machine',
                        'leftnav': 'machine',
                        'show': true
                    },
                    {
                        'name': '智慧卡及手环',
                        'title': '智慧卡及手环',
                        'url': '/machineCard',
                        'leftnav': 'machineCard',
                        'show': true
                    },
                    {
                        'name': '智慧班牌',
                        'title': '智慧班牌',
                        'url': '/machineBoard',
                        'leftnav': 'machineBoard',
                        'show': true
                    },
                    {
                        'name': '学校学制管理',
                        'title': '学校学制管理',
                        'url': '/schoolSystem',
                        'leftnav': 'schoolSystem',
                        'show': true
                    },
                    {
                        'name': '学校OU总览',
                        'title': '学校OU总览',
                        'url': '/schoolmanage',
                        'leftnav': 'schoolmanage',
                        'show': true
                    },
                    {
                        'name': '学校管理',
                        'title': '学校管理',
                        'url': '/school',
                        'leftnav': 'school',
                        'show': true
                    },
                    {
                        'name': '学校教职工管理',
                        'title': '学校教职工管理',
                        'url': '/schoolStaff',
                        'leftnav': 'schoolStaff',
                        'show': true
                    },             
                    {
                        'name': '学校班级管理',
                        'title': '学校班级管理',
                        'url': '/schoolClass',
                        'leftnav': 'schoolClass',
                        'show': true
                    },      
                    {
                        'name': '学校结构树',
                        'title': '学校结构树',
                        'url': '/schoolTree',
                        'leftnav': 'schoolTree',
                        'show': true
                    }, 
                    {
                        'name': '学校考勤时间表',
                        'title': '学校考勤时间表',
                        'url': '/schoolAttendance',
                        'leftnav': 'schoolAttendance',
                        'show': true
                    }, 
                    {
                        'name': '学校可寻汇总表',
                        'title': '学校可寻汇总表',
                        'url': '/schoolKexun',
                        'leftnav': 'schoolKexun',
                        'show': true
                    }, 
                    {
                        'name': '学校接收器管理',
                        'title': '学校接收器管理',
                        'url': '/schoolMachine',
                        'leftnav': 'schoolMachine',
                        'show': true
                    },
                    {
                        'name': '学校区域管理',
                        'title': '学校区域管理',
                        'url': '/schoolArea',
                        'leftnav': 'schoolArea',
                        'show': true
                    },
                    {
                        'name': '学校个性化设置',
                        'title': '学校个性化设置',
                        'url': '',
                        'leftnav': 'setting',
                        'show': true
                    },
                    {
                        'name': '功能设置',
                        'title': '功能设置',
                        'url': '/settingFunction',
                        'leftnav': 'settingFunction',
                        'show': true
                    },
                    {
                        'name': '行为轨迹设置',
                        'title': '行为轨迹设置',
                        'url': '/settingTrace',
                        'leftnav': 'settingTrace',
                        'show': true
                    },
                    {
                        'name': '标签库',
                        'title': '标签库',
                        'url': '',
                        'leftnav': 'tags',
                        'show': true
                    },
                    {
                        'name': '标签分类',
                        'title': '标签分类',
                        'url': '/tagsClassify',
                        'leftnav': 'tagsClassify',
                        'show': true
                    },
                    {
                        'name': '标签管理',
                        'title': '标签管理',
                        'url': '/tagsManage',
                        'leftnav': 'tagsManage',
                        'show': true
                    },
                    {
                        'name': '视频总览',
                        'title': '视频总览',
                        'url': '/video',
                        'leftnav': 'video',
                        'show': true
                    },
                    {
                        'name': '课程记录',
                        'title': '课程记录',
                        'url': '/videoCourse',
                        'leftnav': 'videoCourse',
                        'show': true
                    },
                    {
                        'name': '微课',
                        'title': '微课',
                        'url': '/videoWxlist',
                        'leftnav': 'videoWxlist',
                        'show': true
                    },
                    {
                        'name': '微课排行榜',
                        'title': '微课排行榜',
                        'url': '/videoWxlistRank',
                        'leftnav': 'videoWxlistRank',
                        'show': true
                    },
                    {
                        'name': '对接设置',
                        'title': '对接设置',
                        'url': '',
                        'leftnav': 'optionClass',
                        'show': true
                    },
                    {
                        'name': '排班走班',
                        'title': '排班走班',
                        'url': '/optionClassRelation',
                        'leftnav': 'optionClassRelation',
                        'show': true
                    },
                    {
                        'name': '系统日志',
                        'title': '系统日志',
                        'url': '/log',
                        'leftnav': 'log',
                        'show': true
                    }
                ],
                permission: []
            };
        },
        methods: {
            getNavType() {
                let that = this;
                setTimeout(function() {
                    that.status = that.$route.meta.nav;
                }, 1)
            },
            linkTo: function(url, nav) {
                this.status = nav;
                this.$router.push({ path: url });
            },
            getPermission: function() {
                privilegeLeftmenu({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        for(let i = 0; i < this.menu.length; i++) {
                            for(let j = 0; j < data.list.length; j++) {
                                if(this.menu[i].name == data.list[j].name) {
                                    this.menu[i].show = true;
                                }
                            }
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取导航列表失败！', type: 'error'});
                });
            }
        },
        mounted() {
            // this.getPermission();
            this.getNavType();
        }
    }
</script>