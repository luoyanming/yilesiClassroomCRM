<template>
    <section class="login-wrap">
        <div class="login-box">
            <div class="logo"></div>
            <h1 class="title">易乐思IoT管理平台</h1>
            <!-- <h1 class="title">IoT管理平台</h1> -->

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm" v-if="!checkInfo.url">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="">
                    <el-checkbox v-model="ruleForm.isChecked">记住账号</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" :disabled="!ruleForm.account || !ruleForm.password" @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>

            <div class="qr-code" v-if="checkInfo.url">
                <div class="text">为保障账号安全，请用轻课堂扫码验证身份</div>
                <div class="thumb-box">
                    <img :src="checkInfo.url" class="thumb">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { Message } from 'element-ui';
    import { doLoginCheck, doLogin } from '../api/api';

    export default {
        data() {
            return {
                ruleForm: {
                    account: localStorage.getItem('loginAccount') || '',
                    password: '',
                    isChecked: localStorage.getItem('loginAccount') ? true : false
                },
                rules: {
                    account: [
                        { required: true, message: '*请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '*请输入密码', trigger: 'blur' }
                    ]
                },
                loading: false,

                checkInfo: {
                    url: '',
                    loginCode: ''
                }
            };
        },
        methods: {
            submitForm(formName) {
                if(this.loading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.ruleForm.isChecked) {
                            localStorage.setItem('loginAccount', this.ruleForm.account);
                        } else {
                            localStorage.removeItem('loginAccount');
                        }

                        this.loading = true;

                        let param = {
                            'userName': this.ruleForm.account,
                            'password': this.ruleForm.password
                        };

                        doLoginCheck(param).then(res => {
                            this.loading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: errorInfo, type: 'error'});
                            } else {
                                this.checkInfo.url = data.url;
                                this.checkInfo.loginCode = data.loginCode;

                                this.doLogin();
                            }
                        }).catch(error => {
                            this.loading = false;
                            this.$message({ message: '网络异常！登录失败！', type: 'error'});
                        });
                    } else {
                        return false;
                    }
                });
            },

            doLogin: function() {
                let param = {
                    loginCode: this.checkInfo.loginCode
                };

                doLogin(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.resultCode == -1) { //二维码过期
                            this.$message({ message: '二维码已过期！请重新登录！', type: 'error'});
                            this.checkInfo.url = '';
                            this.checkInfo.loginCode = '';
                        } else if(data.resultCode == 0) { //尚未接收到扫描结果
                            setTimeout(() => {
                                this.doLogin();
                            }, 1500);
                        } else if(data.resultCode == 1) { //扫码登录功能
                            this.$message({ message: '登录成功', type: 'success'});
                            
                            // 0: 学校； 1: 渠道； 2: admin
                            localStorage.setItem('role', data.account.type);

                            localStorage.setItem('account', data.member.mobile);
                            this.$router.push({ path: '/' });
                        }
                    }
                }).catch(error => {
                    if(error.request && error.request.readyState == 4 && error.request.status == 0) {
                        setTimeout(() => {
                            this.doLogin();
                        }, 1500);
                    } else {
                        this.$message({ message: '网络异常，扫码失败！请重新登录！', type: 'error'});
                        this.checkInfo.url = '';
                        this.checkInfo.loginCode = '';
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .login-wrap{
        position: absolute;
        z-index: 999;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: -webkit-linear-gradient(#57596B, #2D3040);
        background:    -moz-linear-gradient(#57596B, #2D3040);
        background:      -o-linear-gradient(#57596B, #2D3040);
        background:         linear-gradient(#57596B, #2D3040);

        .login-box{
            position: absolute;
            z-index: 3; 
            top: 50%;
            left: 50%;
            width: 460px;
            margin-left: -230px;
            margin-top: -300px;

            .logo{
                margin: 0 auto;
                width: 200px;
                height: 200px;
                background-image: url('/static/c-icon-logo.png');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100% 100%;
            }

            .title{
                margin: 10px 0 40px 0;
                font-size: 18px;
                color: #FFFFFF;
                font-weight: normal;
                text-align: center;
            }

            .el-form-item{
                margin-bottom: 30px;

                .el-form-item__content{
                    background: transparent;

                    .el-input{
                        background: transparent;

                        .el-input__inner{
                            padding-left: 20px;
                            padding-right: 20px;
                            height: 60px;
                            font-size: 14px;
                            color: #FFF;
                            background: #4B4F64;
                            border: none;
                            box-shadow: inset 0 0 6px 0 rgba(0,0,0,0.38);

                            &:hover{
                                box-shadow: inset 0 0 6px 0 rgba(0,0,0,0.28);
                            }
                            &:focus{
                                box-shadow: inset 0 0 6px 0 rgba(0,0,0,0.68);
                            }

                            &::placeholder,
                            &::-webkit-input-placeholder {
                                color: #979AAD;
                            }
                        }
                    }

                    .el-checkbox{
                        .el-checkbox__label{
                            color: #FFF;
                        }
                    }

                    .el-form-item__error{
                        position: absolute;
                        top: 0;
                        left: 100%;
                        margin-left: 20px;
                        padding-top: 0;
                        color: #3FCB9A;
                        line-height: 60px;
                        white-space: nowrap;
                    }

                    .el-button{
                        display: block;
                        /*margin-top: 40px;*/
                        padding: 0;
                        width: 100%;
                        font-size: 16px;
                        line-height: 60px;
                        color: #7982B1;
                        border: 1px solid #7982B1;
                        border-radius: 4px;
                        background: transparent;

                        &:hover,
                        &:active{
                            opacity: .7;
                        }

                        &.is-loading{
                            &:before{
                                content: "";
                                background: transparent;
                            }
                        }
                    }
                }
            }

            .qr-code{
                .text{
                    font-size: 14px;
                    line-height: 2;
                    color: #FFF;
                    text-align: center;
                }

                .thumb-box{
                    margin-top: 20px;

                    .thumb{
                        display: block;
                        margin: 0 auto;
                        width: 200px;
                        height: 200px;
                    }
                }
            }
        }
    }
</style>
