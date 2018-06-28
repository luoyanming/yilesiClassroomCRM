<template>
    <nav class="nav">
        <ul>
            <li v-for="item in menu">
                <a href="javascript:void(0);" class="navitem"
                    v-bind:class="{ 'current': (item.leftnav == status) }" 
                    v-show="item.show"
                    @click="linkTo(item.url)"
                    v-if="item.url">{{ item.title }}</a>
                <a href="javascript:void(0);" class="navitem"
                    v-bind:class="{ 'current': (item.leftnav == status) }" 
                    v-show="item.show"
                    @click="linkTo(item.url)"
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
                        'name': '智慧教学卡综述',
                        'title': '智慧教学卡综述',
                        'url': '/card',
                        'leftnav': 'card',
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
                        'name': '智慧卡管理',
                        'title': '智慧卡管理',
                        'url': '/control',
                        'leftnav': 'control',
                        'show': true
                    },
                    {
                        'name': 'OU总览',
                        'title': 'OU总览',
                        'url': '/schoolmanage',
                        'leftnav': 'schoolmanage',
                        'show': true
                    },
                    {
                        'name': '学制管理',
                        'title': '学制管理',
                        'url': '/schoolSystem',
                        'leftnav': 'schoolSystem',
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
                        'name': '班级管理',
                        'title': '班级管理',
                        'url': '/schoolClass',
                        'leftnav': 'schoolClass',
                        'show': true
                    },
                    {
                        'name': '结构树',
                        'title': '结构树',
                        'url': '/schoolTree',
                        'leftnav': 'schoolTree',
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
                this.status = this.$route.meta.nav;
            },
            linkTo: function(url) {
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