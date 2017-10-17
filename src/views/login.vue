<template>
    <div class="app-container">
        <div class="container-wrapper">
            
            <section class="login-wrap">
                <div class="login-box">
                    <div class="logo"></div>
                    <h1 class="title">轻课堂CRM管理后台</h1>

                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
                        <el-form-item prop="account">
                            <el-input v-model="ruleForm.account" auto-complete="off" placeholder="请输入账号"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :loading="loading" :disabled="!ruleForm.account || !ruleForm.password" @click="submitForm('ruleForm')">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </section>

        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { doLogin } from '../api/api';

    export default {
        data() {
            return {
                ruleForm: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [
                        { required: true, message: '*请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '*请输入密码', trigger: 'blur' }
                    ]
                },
                loading: false
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;

                        let loginParam = { 'userName': this.ruleForm.account, 'password': this.ruleForm.password };

                        doLogin(loginParam).then(res => {
                            this.loading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: errorInfo, type: 'error'});
                            } else {
                                this.$message({ message: '登录成功', type: 'success'});
                                localStorage.setItem('account', this.ruleForm.account);
                                this.$router.push({ path: '/' });
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
    .login-wrap{
        position: relative;
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
                        margin-top: 40px;
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
        }
    }
</style>
