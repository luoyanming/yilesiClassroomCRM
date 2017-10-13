<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/permissionAccount' }">账号列表</el-breadcrumb-item>
                        <el-breadcrumb-item>账号详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" v-loading.fullscreen.lock="ready">
                        <el-form-item label="序号">
                            <div class="form-content">
                                <p class="text">{{ id }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <div class="form-content">
                                <p class="text">{{ form.name }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <div class="form-content">
                                <p class="text">{{ form.mobile }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="角色名称">
                            <div class="form-content">
                                <p class="text">{{ form.roleName }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="注册日期">
                            <div class="form-content">
                                <p class="text">{{ form.createdDate }}</p>
                            </div>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click="historyBack">返回</el-button>
                            <el-button type="primary" size="large" @click="handleResetPassword">重置密码</el-button>
                        </div>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { permissionAccountDetail, permissionAccountResetPwd } from '../api/api';

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
            getPermissionAccountDetail: function() {
                let param = { 'id': this.id };

                permissionAccountDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.form = data.detail;
                        this.ready = false;
                    }
                });
            },
            handleResetPassword: function() {
                this.$confirm('确定重置该账号密码？重置后密码将改为初始密码：123456', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': this.id };

                    permissionAccountResetPwd(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '密码重置成功！', type: 'success'});
                        }
                    });
                }).catch(() => {
                            
                });
            }
        },
        mounted() {
            this.getPermissionAccountDetail();
        }
    }
</script>

<style lang="scss">
    
</style>
