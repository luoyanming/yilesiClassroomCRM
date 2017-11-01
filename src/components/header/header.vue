<template>
    <header class="header">
        <p class="logo">轻课堂</p>
        
        <div class="info">
            <p class="account">{{ mobile }}</p>
            <span class="line">|</span>
            <el-button type="primary" size="small" class="button-link link-grey" @click.native="showDialog">修改密码</el-button>
            <span class="line">|</span>
            <el-button type="primary" size="small" class="button-link link-grey" @click.native="doLogout">退出</el-button>
        </div>

        <el-dialog title="修改密码" :visible.sync="dialogShow" size="tiny" :modal-append-to-body="false">
            <el-form :model="forgetForm" :rules="rules" ref="forgetForm" label-width="0" class="demo-ruleForm">
                <el-form-item prop="password">
                    <el-input type="password" v-model="forgetForm.password" auto-complete="off" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <br />
                <el-form-item prop="passwordNew">
                    <el-input type="password" v-model="forgetForm.passwordNew" auto-complete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item prop="passwordNewConfirm">
                    <el-input type="password" v-model="forgetForm.passwordNewConfirm" auto-complete="off" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" :disabled="!forgetForm.password || !forgetForm.passwordNew || !forgetForm.passwordNewConfirm" @click.native="submitForm('forgetForm')">确 定</el-button>
            </span>
        </el-dialog>

    </header>
</template>

<script>
    import { Message } from 'element-ui';
    import { logout, passwordUpdate } from '../../api/api';

    let that;

    export default {
        data() {
            return {
                mobile: localStorage.getItem('account'),
                forgetForm: {
                    password: '',
                    passwordNew: '',
                    passwordNewConfirm: ''
                },
                rules: {
                    password: [
                        { required: true, message: '*请输入原密码', trigger: 'blur' }
                    ],
                    passwordNew: [
                        { required: true, message: '*请输入新密码', trigger: 'blur' }
                    ],
                    passwordNewConfirm: [
                        { required: true, message: '*请再次输入新密码', trigger: 'blur' }
                    ]
                },
                dialogShow: false,
                loading: false
            };
        },
        methods: {
            showDialog: function() {
                that = this;
                this.dialogShow = true;

                setTimeout(function() {
                    that.$refs['forgetForm'].resetFields();
                }, 1);
            },
            doLogout: function() {
                this.$confirm('确定退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    logout({}).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: errorInfo, type: 'error'});
                        } else {
                            this.$message({ message: '退出登录成功', type: 'success'});
                            localStorage.removeItem("account");
                            this.$router.push({ path: '/login' });
                        }
                    });
                }).catch(() => {
                            
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.forgetForm.passwordNew != this.forgetForm.passwordNewConfirm) {
                            this.$message({ message: '两次输入的新密码不一致！', type: 'error'});
                            return false;
                        }

                        this.loading = true;

                        let param = {
                            'oldPassword': this.forgetForm.password,
                            'newPassword': this.forgetForm.passwordNew
                        };

                        passwordUpdate(param).then(res => {
                            this.loading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: errorInfo, type: 'error'});
                            } else {
                                this.$message({ message: '密码修改成功', type: 'success'});
                                this.dialogShow = false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .header{
        .el-dialog{
            &.el-dialog--tiny{
                width: 560px;
            }

            .el-dialog__header{
                .el-dialog__title{
                    font-size: 18px;
                    font-weight: normal;
                    color: #333;
                }
            }

            .el-dialog__body{
                padding: 60px 80px 0 80px;

                .el-form{
                    .el-form-item{
                        margin-bottom: 20px;

                        .el-form-item__content{

                            .el-input{
                                .el-input__inner{
                                    padding-left: 20px;
                                    padding-right: 20px;
                                    font-size: 14px;
                                    height: 50px;
                                    line-height: 50px;
                                    color: #333;
                                    background: #FFFFFF;
                                    border: 1px solid #E5E5E5;
                                    border-radius: 2px;

                                    &:hover {
                                        border-color: rgb(131, 165, 162);
                                    }

                                    &:focus {
                                        outline: 0;
                                        border-color: #18c79c;
                                    }

                                    &::placeholder,
                                    &::-webkit-input-placeholder{
                                        color: rgba(51, 51, 51, .3);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .el-dialog__footer{
                padding: 20px 80px 30px 80px;

                .el-button{
                    padding: 0 25px;
                    line-height: 40px;
                    border-radius: 2px;
                    font-size: 16px;

                    &.button-cancle{
                        background: #FFFFFF;
                        border: 1px solid #E5E5E5;
                        border-radius: 2px;
                        color: #333;

                        &:hover{
                            opacity: .7;
                        }
                    }
                }
            }
        }
    }
</style>
