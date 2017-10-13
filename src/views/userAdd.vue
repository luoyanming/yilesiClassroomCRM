<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/" v-if="!id">
                        <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>新增用户</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator="/" v-if="id">
                        <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>编辑用户</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :model="form" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="80px">
                        <el-form-item label="序号" v-if="id">
                            <div class="form-content">
                                <p class="text">{{ id }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名" prop="name">
                            <el-input v-model="form.name" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="form.sex">
                                <el-radio-button label="0">男</el-radio-button>
                                <el-radio-button label="1">女</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="车牌号">
                            <el-input v-model="form.carNumber" placeholder="请输入车牌号"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌" prop="brand">
                            <el-cascader :options="options" :show-all-levels="false" v-model="form.brand" @change="handleBrandChange"></el-cascader>
                        </el-form-item>
                        <!--<el-form-item label="型号" prop="model" v-if="id">
                            <el-radio-group>
                                <el-select v-model="form.model" placeholder="请选择">
                                    <el-option
                                        v-for="item in modelOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-radio-group>
                        </el-form-item>-->

                        <el-form-item label="子品牌" prop="model">
                            <el-radio-group>
                                <el-select v-model="form.model" placeholder="请选择" @change="handleModelChange">
                                    <el-option
                                        v-for="item in modelOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="年款" prop="carYear">
                            <el-radio-group>
                                <el-select v-model="form.carYear" placeholder="请选择" @change="handleYearChange">
                                    <el-option
                                        v-for="item in yearOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="车配置" prop="carConfiguration">
                            <el-radio-group>
                                <el-select v-model="form.carConfiguration" placeholder="请选择">
                                    <el-option
                                        v-for="item in configurationOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="购买时间" prop="buyTime">
                            <el-date-picker
                                v-model="form.buyTime"
                                size="small"
                                type="month"
                                format="yyyy年MM月"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="行驶里程" prop="mileage">
                            <el-input v-model="form.mileage" placeholder="请输入行驶里程"></el-input>
                            <span class="tip">公里</span>
                        </el-form-item>
                        <el-form-item label="保险到期日" prop="deadline">
                            <el-date-picker
                                v-model="form.deadline"
                                size="small"
                                type="month"
                                format="yyyy年MM月"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="行驶证照片" prop="thumb" v-if="!id">
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
                        <el-form-item label="状态" prop="state">
                            <el-radio-group v-model="form.state">
                                <el-radio-button label="0">正常</el-radio-button>
                                <el-radio-button label="1">已冻结</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="常用作者" prop="usual">
                            <el-radio-group v-model="form.usual">
                                <el-radio-button label="1">是</el-radio-button>
                                <el-radio-button label="0">否</el-radio-button>
                            </el-radio-group>
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
    import { BASE, carBrand, carModel, carYear, carConfiguration, uploadLicence, memberDetail, memberAdd, memberModify } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                uploadUrl: BASE + '/member/carinfo/vehicleLicense',
                id: this.$route.query.id,
                labelPosition: 'right',
                form: {
                    nickname: '',
                    name: '',
                    mobile: '',
                    sex: 0,
                    usual: 0,
                    carNumber: '',
                    brand: [],
                    model: '',
                    carYear: '',
                    carConfiguration: '',
                    buyTime: '',
                    mileage: '',
                    deadline: '',
                    thumb: [],
                    state: 0
                },
                rules: {
                    nickname: [
                        { required: true, message: '*请输入昵称', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '*请输入真实姓名', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '*请输入手机号', trigger: 'blur' }
                    ],
                    brand: [
                        { type: 'array', required: true, message: '*请选择品牌', trigger: 'change' }
                    ],
                    model: [
                        { type: 'number', required: true, message: '*请选择子品牌', trigger: 'change' }
                    ],
                    carYear: [
                        { type: 'number', required: true, message: '*请选择年款', trigger: 'change' }
                    ],
                    carConfiguration: [
                        { type: 'number', required: true, message: '*请选择车配置', trigger: 'change' }
                    ],
                    buyTime: [
                        { type: 'date', required: true, message: '*请选择购买时间', trigger: 'change' }
                    ],
                    mileage: [
                        { required: true, message: '*请输入行驶里程', trigger: 'blur' }
                    ],
                    deadline: [
                        { type: 'date', required: true, message: '*请选择保险到期日', trigger: 'change' }
                    ]
                },
                carOptions: {
                    brand: '',
                    model: '',
                    year: '',
                    configuration: ''
                },
                modelOptions: [],
                yearOptions: [],
                configurationOptions: [],
                options: [],
                loading: false
            };
        },
        methods: {
            historyBack: function() {
                this.$router.go(-1);
            },
            getCarBrand: function() {
                let param = { 'pageSize': 1000, 'pageNo': 1 };

                carBrand(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        let brandOptions = [];
                        for(let i = 0; i < data.list.length; i++) {
                            brandOptions.push({
                                'value': data.list[i].initial,
                                'label': data.list[i].initial,
                                'children': []
                            });

                            for(let j = 0; j < data.list[i].carVos.length; j++) {
                                brandOptions[i].children.push({
                                    'value': data.list[i].carVos[j].id,
                                    'label': data.list[i].carVos[j].name
                                });
                            }
                        }
                        this.options = brandOptions;

                        this.getDetail();
                    }
                });
            },
            getDetail: function() {
                if(!this.id) {
                    return false;
                }

                let param = { 'id': this.id };

                memberDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.form.nickname = data.detail.nickName;
                        this.form.name = data.detail.name;
                        this.form.mobile = data.detail.mobile;
                        if(data.detail.sex == '男') {
                            this.form.sex = 0;
                        } else if(data.detail.sex == '女') {
                            this.form.sex = 1;
                        }
                        this.form.usual = data.detail.usual;
                        this.form.carNumber = data.detail.carNumber;
                        if(data.detail.buyDate != '') {
                            this.form.buyTime = new Date(data.detail.buyDate);
                        }
                        this.form.mileage = data.detail.mileage;
                        if(data.detail.insuranceExpire != '') {
                            this.form.deadline = new Date(data.detail.insuranceExpire);
                        }
                        if(data.detail.status == '正常') {
                            this.form.state = 0;
                        } else if(data.detail.status == '已冻结') {
                            this.form.state = 1;
                        }

                        // 品牌
                        if(data.detail.brandId != 0) {
                            this.form.brand = [data.detail.initial, data.detail.brandId];
                            this.carOptions.brand = data.detail.brandId;
                        }
                        if(data.detail.modelId != 0) {
                            this.form.model = data.detail.modelId;
                            this.carOptions.model = data.detail.modelId;
                            this.getModelOptions();
                        }
                        if(data.detail.carYearId != 0) {
                            this.form.carYear = data.detail.carYearId;
                            this.carOptions.year = data.detail.carYearId;
                            this.getYearOptions();
                        }
                        if(data.detail.carConfigurationId != 0) {
                            this.form.carConfiguration = data.detail.carConfigurationId;
                            this.carOptions.configuration = data.detail.carConfigurationId;
                            this.getConfigurationOptions();
                        }
                    }
                });
            },
            getModelOptions(brandID) {
                let id = '';
                if(brandID) {
                    id = brandID;
                } else {
                    id = this.form.brand[1];
                }

                let param = { 'brandId': id, 'pageSize': 1000, 'pageNo': 1 };

                carModel(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.modelOptions = data.list;

                        if(brandID) {
                            this.form.model = '';
                            this.form.carYear = '';
                            this.form.carConfiguration = '';

                            this.yearOptions = [];
                            this.configurationOptions = [];
                        }
                    }
                });
            },
            getYearOptions(modelID) {
                let id = '';
                if(modelID) {
                    id = modelID;
                } else {
                    id = this.form.model;
                }

                let param = { 'modelId': id, 'pageSize': 1000, 'pageNo': 1 }

                carYear(param).then(res => {
                    let { msg, code, data } = res;

                    if( code !== 0 ){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        this.yearOptions = data.list;

                        if(modelID) {
                            this.form.carYear = '';
                            this.form.carConfiguration = '';

                            this.configurationOptions = [];
                        }
                    }
                });
            },
            getConfigurationOptions(yearID) {
                let id = '';
                if(yearID) {
                    id = yearID;
                } else {
                    id = this.form.carYear;
                }

                let param = { 'yearId': id, 'pageSize': 1000, 'pageNo': 1 }

                carConfiguration(param).then(res => {
                    let { msg, code, data } = res;

                    if( code !== 0 ){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        this.configurationOptions = data.list;

                        if(yearID) {
                            this.form.carConfiguration = '';
                        }
                    }
                });
            },
            handleBrandChange(val) {
                this.getModelOptions(val[1]);
            },
            handleModelChange(val) {
                if(this.carOptions.model == val || '' == val) {
                    return false;
                }

                this.getYearOptions(val);
            },
            handleYearChange(val) {
                if(this.carOptions.year == val || '' == val) {
                    return false;
                }

                this.getConfigurationOptions(val);
            },
            uploadBefore(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '行驶证照片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadError(response, file, fileList) {
                this.form.thumb = [];
                this.$message({ message: '行驶证照片上传失败，请重试！', type: 'error'});
            },
            uploadSucc(response, file, fileList) {
                this.form.thumb = fileList;
            },
            uploadRemove(file, fileList) {
                this.form.thumb = fileList;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!COMMON.checkMobile(this.form.mobile)) {
                            this.$message({ message: '手机号码格式不正确！', type: 'error'});
                            return false;
                        }

                        this.loading = true;

                        if(!this.id) {
                            // add
                            // if(this.form.thumb.length == 0) {
                            //     this.$message({ message: '请上传行驶证照片！', type: 'error'});
                            //     this.loading = false;
                            //     return false;
                            // }

                            let param = {
                                'nickName': this.form.nickname,
                                'name': this.form.name,
                                'mobile': this.form.mobile,
                                'sex': this.form.sex,
                                'usual': this.form.usual,
                                'carNumber': this.form.carNumber,
                                'brandId': this.form.brand[1],
                                'modelId': this.form.model,
                                'carYearId': this.form.carYear,
                                'carConfigurationId': this.form.carConfiguration,
                                'buyDate': COMMON.formatMonth(this.form.buyTime),
                                'mileage': this.form.mileage,
                                'insuranceExpire': COMMON.formatMonth(this.form.deadline),
                                'licenseUrl': this.form.thumb.length > 0 ? this.form.thumb[0].response.data.url : '',
                                'status': this.form.state
                            };

                            memberAdd(param).then(res => {
                                this.loading = false;

                                let { msg, code, data } = res;

                                if(code !== 0) {
                                    this.$message({ message: msg, type: 'error'});
                                } else {
                                    console.log(data)
                                    this.$message({ message: '保存成功', type: 'success'});
                                    this.$router.push({ path: '/user' });
                                }
                            });
                        } else {
                            // edit
                            let param = {
                                'id': this.id,
                                'nickName': this.form.nickname,
                                'name': this.form.name,
                                'mobile': this.form.mobile,
                                'sex': this.form.sex,
                                'usual': this.form.usual,
                                'carNumber': this.form.carNumber,
                                'brandId': this.form.brand[1],
                                'modelId': this.form.model,
                                'carYearId': this.form.carYear,
                                'carConfigurationId': this.form.carConfiguration,
                                'buyDate': COMMON.formatMonth(this.form.buyTime),
                                'mileage': this.form.mileage,
                                'insuranceExpire': COMMON.formatMonth(this.form.deadline),
                                'status': this.form.state
                            };

                            memberModify(param).then(res => {
                                this.loading = false;

                                let { msg, code, data } = res;

                                if(code !== 0) {
                                    this.$message({ message: msg, type: 'error'});
                                } else {
                                    this.$message({ message: '保存编辑成功', type: 'success'});
                                    this.$router.push({ path: '/user' });
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
            this.getCarBrand();
        }
    }
</script>

<style lang="scss">
    
</style>
