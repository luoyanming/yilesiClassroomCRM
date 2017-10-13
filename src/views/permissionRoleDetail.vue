<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/permissionRole' }">角色列表</el-breadcrumb-item>
                        <el-breadcrumb-item>查看角色</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" v-loading.fullscreen.lock="ready">
                        <el-form-item label="序号">
                            <div class="form-content">
                                <p class="text">{{ id }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="名称">
                            <div class="form-content">
                                <p class="text">{{ form.name }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="人数">
                            <div class="form-content">
                                <p class="text">{{ form.number }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="包含人员列表">
                            <div class="form-content">
                                <div class="table">
                                    <el-table :data="form.members" stripe style="width: 100%">
                                        <el-table-column label="序号">
                                            <template scope="scope"><p>{{ scope.row.id }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="名称">
                                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="手机号">
                                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="注册日期">
                                            <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注">
                            <div class="form-content">
                                <p class="text">{{ form.memo }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="权限列表">
                            <div class="form-content">
                                <p class="text privileges-box">
                                    <span v-for="item in form.privileges">{{ item.name }}</span>
                                </p>
                            </div>
                        </el-form-item>
                        
                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click="historyBack">返回</el-button>
                            <el-button type="primary" size="large" @click="handleEdit">编辑信息</el-button>
                        </div>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { permissionRoleDetail } from '../api/api';

    export default {
        data() {
            return {
                ready: true,
                labelPosition: 'right',
                id: this.$route.query.id,
                form: {}
            };
        },
        methods: {
            historyBack: function() {
                this.$router.go(-1);
            },
            handleEdit: function() {
                this.$router.push({ path: '/permissionRoleAdd', query: { 'id': this.id } });
            },
            getPermissionRoleDetail: function() {
                let param = { 'id': this.id };

                permissionRoleDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.form = data.detail;
                        this.ready = false;
                    }
                });
            }
        },
        mounted() {
            this.getPermissionRoleDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .luoym{
        .privileges-box{
            padding: 0 !important;
            width: 350px;

            span{
                display: inline-block;
                width: 170px;
                font-size: 12px;
                color: #333;
                line-height: 40px;
            }
        }
    }
</style>
