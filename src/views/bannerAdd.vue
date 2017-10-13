<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/" v-if="!id">
                        <el-breadcrumb-item :to="{ path: '/banner' }">banner管理</el-breadcrumb-item>
                        <el-breadcrumb-item>新增banner</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator="/" v-if="id">
                        <el-breadcrumb-item :to="{ path: '/banner' }">banner管理</el-breadcrumb-item>
                        <el-breadcrumb-item>修改banner</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :model="form" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="80px">
                        
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                        </el-form-item>
            
                        <el-form-item label="封面" prop="thumb">
                            <el-upload
                                :disabled="form.thumb.length != 0"
                                class="upload-demo"
                                :action="uploadUrl"
                                :file-list="form.thumb"
                                list-type="picture"
                                :before-upload="uploadBefore"
                                :on-success="uploadSucc"
                                :on-error="uploadError"
                                :on-remove="uploadRemove">
                                <el-button type="primary" :disabled="form.thumb.length != 0">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                            </el-upload>
                        </el-form-item>

                        <el-form-item label="内容url" prop="url" class="url">
                            <el-input v-model="form.url" placeholder="请输入url"></el-input>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click.native="historyBack">取消</el-button>
                            <el-button type="primary" size="large" :loading="loading" @click.native="submitForm('ruleForm')">保存信息</el-button>
                        </div>

                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { BASE, BannerDetail, addBanner , modifyBanner} from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                uploadUrl: BASE + '/banner/uploadPhoto',
                id: this.$route.query.id,
                labelPosition: 'right',
                form: {
                    title: '',
                    url: '',
                    thumb: []
                },
                thumbPic:'',
                rules: {
                    title: [
                        { required: true, message: '*请输入标题', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '*请输入url', trigger: 'blur' }
                    ],
                },
                loading: false
            };
        },
        methods: {
            historyBack: function() {
                this.$router.go(-1);
            },
            // 获取详情
            getDetail() {
                if(!this.id) {
                    return false;
                }

                let param = { 'id': this.id };

                BannerDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.form.title = data.title;
                        this.form.url = data.url;
                        let PIC = data.pic.split('cn');
                        this.form.thumb = [{
                            name: PIC[1],
                            url: data.pic,
                            response: {
                                data: {
                                    url: PIC[1],
                                    showUrl: data.pic
                                }
                            }
                        }]
                    }
                });
            },
            uploadBefore(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '封面格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadError(response, file, fileList) {
                this.form.thumb = [];
                this.$message({ message: '封面上传失败，请重试！', type: 'error'});
            },
            uploadSucc(response, file, fileList) {
                this.form.thumb = fileList;
            },
            uploadRemove(file, fileList) {
                this.form.thumb = fileList;
            },
            // 保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        this.loading = true;

                        if(!this.id) {
                            // add
                            if(this.form.thumb.length == 0) {
                                this.$message({ message: '请上传封面！', type: 'error'});
                                this.loading = false;
                                return false;
                            }

                            let param = {
                                'title': this.form.title,
                                'pic': this.form.thumb[0].response.data.url,
                                'url': this.form.url,
                            };

                            addBanner(param).then(res => {
                                this.loading = false;

                                let { msg, code, data } = res;

                                if(code !== 0) {
                                    this.$message({ message: msg, type: 'error'});
                                } else {
                                    console.log(data)
                                    this.$message({ message: '新增成功', type: 'success'});
                                    this.$router.push({ path: '/banner' });
                                }
                            });
                        } else {
                            // edit
                            let param = {
                                'id': this.id,
                                'title': this.form.title,
                                'pic': this.form.thumb[0].response.data.url,
                                'url': this.form.url
                            };

                            modifyBanner(param).then(res => {
                                this.loading = false;

                                let { msg, code, data } = res;

                                if(code !== 0) {
                                    this.$message({ message: msg, type: 'error'});
                                } else {
                                    this.$message({ message: '保存修改成功', type: 'success'});
                                    this.$router.push({ path: '/banner' });
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            this.getDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .url{
        .el-input{
            width: 420px!important;
        }
    }
</style>
