<template>
    <nav class="nav no-overscroll">

        <div class="menu">
            <div class="menu-item"
                v-for="(menuItem, index) in routes"
                :key="index"
                v-if="menuItem.meta && menuItem.meta.alias && menuItem.meta.show.indexOf(role) > -1">
                <div :class="menuItem.path == activeRoute ? 'menu-item-header current' : 'menu-item-header'" @click="pageNavigateTo(menuItem)">
                    <i :class="'icon icon-' + menuItem.meta.alias + ' current'" v-if="menuItem.path == activeRoute"></i>
                    <i :class="'icon icon-' + menuItem.meta.alias" v-else></i>
                    <span class="name">{{ menuItem.name }}</span>
                    <i class="arrow el-icon-arrow-right" v-if="menuItem.children"></i>
                </div>

                <div class="menu-item-body">
                    <div
                        v-for="(subMenuItem, subIndex) in menuItem.children"
                        :key="subIndex"
                        v-if="subMenuItem.path != menuItem.path && subMenuItem.meta.show.indexOf(role) > -1"
                        :class="subMenuItem.path == activeRoute ? 'sub-menu-item current' : 'sub-menu-item'"
                        @click="pageNavigateTo(subMenuItem)">
                        <span class="name">{{ subMenuItem.name }}</span>
                    </div>
                </div>
            </div>
        </div>

    </nav>
</template>

<script>
    export default {
        data() {
            return {
                role: localStorage.getItem('role') ? parseInt(localStorage.getItem('role')) : '',
                routes: [],
                activeRoute: ''
            };
        },
        watch: {
            '$route': function() {
                this.routes = this.$router.options.routes;
                this.activeRoute = this.$route.path;
                console.log(localStorage.getItem('role'))
                localStorage.getItem('role') ? this.role = parseInt(localStorage.getItem('role')) : this.role = '';
            }
        },
        methods: {
            pageNavigateTo: function(route) {
                if(route.meta.route.indexOf(this.role) > -1) {
                    this.$router.push({ path: route.path });
                }
            }
        },
        mounted() {
        }
    }
</script>