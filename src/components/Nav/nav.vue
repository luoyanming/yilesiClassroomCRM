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
                });
            }
        },
        mounted() {
            // this.getPermission();
            this.getNavType();
        }
    }
</script>