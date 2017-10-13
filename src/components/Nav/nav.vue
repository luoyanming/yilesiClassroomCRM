<template>
    <nav class="nav">
        <ul>
            <li v-for="item in menu">
                <a href="javascript:void(0);" class="navitem"
                    v-bind:class="{ 'current': (item.leftnav == status) }" 
                    v-show="item.show"
                    @click="linkTo(item.url)">{{ item.title }}</a>
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
                        'name': '用户',
                        'title': '用户',
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
                        'name': '系统日志',
                        'title': '系统日志',
                        'url': '/log',
                        'leftnav': 'log',
                        'show': true
                    },
                    {
                        'name': '用户管理',
                        'title': '用户管理',
                        'url': '/user',
                        'leftnav': 'user',
                        'show': true
                    },
                    {
                        'name': '用户管理',
                        'title': '常用作者',
                        'url': '/userUsual',
                        'leftnav': 'userUsual',
                        'show': true
                    },
                    {
                        'name': '动态管理',
                        'title': '动态管理',
                        'url': '/dynamic',
                        'leftnav': 'dynamic',
                        'show': true
                    },
                    {
                        'name': '动态管理',
                        'title': 'banner管理',
                        'url': '/banner',
                        'leftnav': 'banner',
                        'show': true
                    },
                    {
                        'name': '专题管理',
                        'title': '专题管理',
                        'url': '/topicManagement',
                        'leftnav': 'theme',
                        'show': true
                    },
                    {
                        'name': '车服务',
                        'title': '车服务',
                        'url': '/carService',
                        'leftnav': 'car',
                        'show': true
                    },
                    {
                        'name': '订单管理',
                        'title': '订单管理',
                        'url': '/order',
                        'leftnav': 'order',
                        'show': true
                    },
                    {
                        'name': '敏感信息词库',
                        'title': '敏感信息词库',
                        'url': '/sensitive',
                        'leftnav': 'sensitive',
                        'show': true
                    },
                    {
                        'name': '账号权限',
                        'title': '账号权限',
                        'url': '',
                        'leftnav': '',
                        'show': true
                    },
                    {
                        'name': '账号权限',
                        'title': '账号列表',
                        'url': '/permissionAccount',
                        'leftnav': 'permissionAccount',
                        'show': true
                    },
                    {
                        'name': '账号权限',
                        'title': '角色列表',
                        'url': '/permissionRole',
                        'leftnav': 'permissionRole',
                        'show': true
                    },
                    {
                        'name': '车牌库',
                        'title': '车牌库',
                        'url': '/LicensePlate',
                        'leftnav': 'LicensePlate',
                        'show': true
                    },
                    {
                        'name': '系统日志',
                        'title': '系统日志',
                        'url': '/systemLog',
                        'leftnav': 'systemLog',
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
                });
            }
        },
        mounted() {
            // this.getPermission();
            this.getNavType();
        }
    }
</script>

<style lang="scss" scoped>
    .nav ul li:nth-of-type(6) a{
        cursor: default;
    }
</style>