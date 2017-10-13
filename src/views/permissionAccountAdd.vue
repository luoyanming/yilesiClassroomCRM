<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/permissionAccount' }">账号列表</el-breadcrumb-item>
                        <el-breadcrumb-item>新增账号</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :model="form" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="80px">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="角色名称" prop="role">
                            <el-select v-model="form.role" placeholder="请选择">
                                <el-option v-for="item in roleOptions" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click.native="historyBack">取消</el-button>
                            <el-button type="primary" size="large" :loading="loading" @click.native="submitForm('ruleForm')">确定</el-button>
                        </div>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { permissionRoleNameList, permissionAccountAdd } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                labelPosition: 'right',
                form: {
                    name: '',
                    mobile: '',
                    role: ''
                },
                roleOptions: [],
                rules: {
                    name: [
                        { required: true, message: '*请输入真实姓名', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '*请输入手机号', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, type: 'number', message: '*请选择角色名称', trigger: 'change' }
                    ]
                },
                loading: false
            };
        },
        methods: {
            historyBack: function() {
                this.$router.go(-1);
            },
            getRoleOptions: function(brandid) {
                permissionRoleNameList({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.roleOptions = data.list;
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!COMMON.checkMobile(this.form.mobile)) {
                            this.$message({ message: '手机号码格式不正确！', type: 'error'});
                            return false;
                        }

                        this.loading = true;

                        let param = {
                            'roleId': this.form.role,
                            'name': this.form.name,
                            'mobile': this.form.mobile
                        };

                        permissionAccountAdd(param).then(res => {
                            this.loading = false;

                            let { msg, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: msg, type: 'error'});
                            } else {
                                this.$message({ message: '新增账号成功', type: 'success'});
                                this.$router.push({ path: '/permissionAccount' });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            this.getRoleOptions();
        }
    }
</script>

<style lang="scss">
    
</style>
