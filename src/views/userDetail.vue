<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" v-loading.fullscreen.lock="ready">
                        <el-form-item label="序号">
                            <div class="form-content">
                                <p class="text">{{ form.id }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <div class="form-content">
                                <p class="text">{{ form.nickName }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="真实姓名">
                            <div class="form-content">
                                <p class="text">{{ form.name }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <div class="form-content">
                                <p class="text">{{ form.mobile }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="性别">
                            <div class="form-content">
                                <p class="text">{{ form.sex }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="车牌号">
                            <div class="form-content">
                                <p class="text">{{ form.carNumber }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="品牌">
                            <div class="form-content">
                                <p class="text">{{ form.brand }}</p>
                            </div>
                        </el-form-item>
                        <!--<el-form-item label="型号">
                            <div class="form-content">
                                <p class="text">{{ form.model }}</p>
                            </div>
                        </el-form-item>-->
                        <el-form-item label="子品牌">
                            <div class="form-content">
                                <p class="text">{{ form.model }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="年款">
                            <div class="form-content">
                                <p class="text">{{ form.carYear }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="车配置">
                            <div class="form-content">
                                <p class="text">{{ form.carConfiguration }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="购买时间">
                            <div class="form-content">
                                <p class="text">{{ form.buyDate }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="行驶里程">
                            <div class="form-content">
                                <p class="text">{{ form.mileage }} 公里</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="保险到期日">
                            <div class="form-content">
                                <p class="text">{{ form.insuranceExpire }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="行驶证照片">
                            <div class="form-content">
                                <img :src="form.licenseUrl">
                            </div>
                        </el-form-item>
                        <el-form-item label="设备号">
                            <div class="form-content">
                                <p class="text">
                                    {{ form.imei }}
                                    <!-- QAF2U12411QQ
                                    <br />
                                    <br />
                                    QAF2U12411QQ
                                    <br />
                                    <br />
                                    QAF2U12411QQ -->
                                </p>
                            </div>
                        </el-form-item>
                        <el-form-item label="设备型号">
                            <div class="form-content">
                                <p class="text">{{ form.deviceModel }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="注册日期">
                            <div class="form-content">
                                <p class="text">{{ form.createdDate }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="状态">
                            <div class="form-content">
                                <p class="text" v-if="form.status == '正常'">正常</p>
                                <p class="text" v-if="form.status == '已冻结'"><span class="color-red">已冻结</span></p>
                            </div>
                        </el-form-item>
                        <el-form-item label="常用作者">
                            <div class="form-content">
                                <p class="text" v-if="form.usual == 0">否</p>
                                <p class="text" v-if="form.usual == 1">是</p>
                            </div>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click="historyBack">返回</el-button>
                            <el-button type="primary" size="large" @click="linkTo('/userAdd')">编辑信息</el-button>
                        </div>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { memberDetail } from '../api/api';

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
            linkTo: function(url) {
                this.$router.push({ path: url, query: { id: this.id } });
            },
            getMemberDetail: function() {
                let param = { 'id': this.id };

                memberDetail(param).then(res => {
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
            this.getMemberDetail();
        }
    }
</script>

<style lang="scss">
    
</style>
