<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>学校管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="学校">
                            <el-input v-model="searchForm.name" size="small" placeholder="请输入学校名称"></el-input>
                        </el-form-item>
                        <el-form-item label="学校学制">
                            <el-select v-model="searchForm.schoolSystemId" placeholder="请选择">
                                <el-option v-for="item in schoolSystemOptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学校性质">
                            <el-select v-model="searchForm.type" placeholder="请选择">
                                <el-option v-for="item in schoolTypeOptions" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd(0)">新增学校</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="学校全称">
                            <template scope="scope"><p>{{ scope.row.fullName }}</p></template>
                        </el-table-column>
                        <el-table-column label="学校简称">
                            <template scope="scope"><p>{{ scope.row.shortName }}</p></template>
                        </el-table-column>
                        <el-table-column label="校所在地区">
                            <template scope="scope"><p>{{ scope.row.regionsCityName }}-{{ scope.row.regionsTownName }}</p></template>
                        </el-table-column>
                        <el-table-column label="学校学制">
                            <template scope="scope"><p>{{ scope.row.schoolSystemName }}</p></template>
                        </el-table-column>
                        <el-table-column label="学校性质">
                            <template scope="scope"><p>{{ scope.row.typeStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleAdd(1, scope.$index, scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="pagi.currentPage"
                        :page-size="pagi.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="pagi.total"
                        v-if="!noPagi">
                    </el-pagination>
                </section>

                <el-dialog :title="dialogInfo.type == 0 ? '新增学校信息' : '编辑学校信息'" :visible.sync="dialogShow" :modal-append-to-body="false" custom-class="w70">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                            <el-form-item label="学校LOGO" prop="logoUrl">
                                <el-upload
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    :before-upload="handleBefore"
                                    :on-remove="handleRemove"
                                    :on-success="handleSuccess"
                                    :on-error="handleError"
                                    :file-list="dialogInfo.logoUrl"
                                    list-type="picture">
                                    <el-button size="small" type="primary" :disabled="dialogInfo.logoUrl.length != 0">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">上传尺寸300像素 X 300像素，支持jpg、jpeg、png</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="学校全称" prop="fullName">
                                <el-input v-model="dialogInfo.fullName" style="width: 285px !important;"></el-input>
                            </el-form-item>
                            <el-form-item label="学校简称">
                                <el-input v-model="dialogInfo.shortName" style="width: 285px !important;"></el-input>
                            </el-form-item>
                            <el-form-item label="校所在地区">
                                <div class="inline-box">
                                    <el-select v-model="dialogInfo.regionsProv" placeholder="请选择省" @change="regionsProvChange">
                                        <el-option v-for="item in regionsProvOptions" :key="item.v" :label="item.n" :value="item.v">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="dialogInfo.regionsCity" placeholder="请选择市" @change="regionsCityChange">
                                        <el-option v-for="item in regionsCityOptions" :key="item.v" :label="item.n" :value="item.v">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="dialogInfo.regionsTown" placeholder="请选择区">
                                        <el-option v-for="item in regionsTownOptions" :key="item.v" :label="item.n" :value="item.v">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="具体地址">
                                <el-input v-model="dialogInfo.address" style="width: 430px !important;"></el-input>
                            </el-form-item>

                            <el-form-item label="学校学制" prop="schoolSystemId">
                                <el-select v-model="dialogInfo.schoolSystemId" placeholder="请选择">
                                    <el-option v-for="item in schoolSystemOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学校性质" prop="type">
                                <el-select v-model="dialogInfo.type" placeholder="请选择">
                                    <el-option v-for="item in schoolTypeOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学年时间" prop="time">
                                <p class="tip">一个自然年</p>
                                <el-date-picker
                                    v-model="dialogInfo.startYear"
                                    size="small"
                                    type="date"
                                    format="MM-dd"
                                    placeholder="请选择"
                                    :picker-options="pickerOptions"
                                    popper-class="pickerMonth">
                                </el-date-picker>
                                <p class="tip">到 下一个自然年</p>
                                <el-date-picker
                                    v-model="dialogInfo.endYear"
                                    size="small"
                                    type="date"
                                    format="MM-dd"
                                    placeholder="请选择"
                                    :picker-options="pickerOptions"
                                    popper-class="pickerMonth">
                                </el-date-picker>
                                <br />
                                <p class="tip">此选项影响每个学校中的班级自动升年级的具体时间</p>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, schoolSystemList, schoolList, schoolSave } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            let checkTime = (rule, value, callback) => {
                setTimeout(() => {
                    if(!that.dialogInfo.startYear || !that.dialogInfo.endYear) {
                        callback(new Error('请选择学年时间'));
                    } else {
                        callback();
                    }
                }, 0);
            };

            return {
                regionsProvOptions: require('../common/js/regions.json'),
                regionsCityOptions: [],
                regionsTownOptions: [],

                searchForm: {
                    name: '',
                    schoolSystemId: '',
                    type: ''
                },
                tableData: [],
                tableloading: true,

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },

                schoolSystemOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ],
                schoolTypeOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    },
                    {
                        'id': '0',
                        'name': '公办'
                    },
                    {
                        'id': '1',
                        'name': '民办'
                    },
                    {
                        'id': '2',
                        'name': '中外联合'
                    },
                    {
                        'id': '3',
                        'name': '公私联合'
                    },
                    {
                        'id': '4',
                        'name': '独资'
                    },
                    {
                        'id': '5',
                        'name': 'NGO'
                    }
                ],

                dialogInfo: {
                    id: '',
                    index: '',
                    logoUrl: [],
                    fullName: '',
                    shortName: '',
                    regionsProv: '',
                    regionsCity: '',
                    regionsTown: '',
                    address: '',
                    schoolSystemId: '',
                    type: '',
                    startYear: '',
                    endYear: ''
                },
                dialogShow: false,
                dialogLoading: false,
                rules: {
                    fullName: [
                        { required: true, message: '*请输入学校全称', trigger: 'blur' }
                    ],
                    schoolSystemId: [
                        { required: true, message: '*请选择学校学制', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '*请选择学校性质', trigger: 'change' }
                    ],
                    time: [
                        { required: true, validator: checkTime, trigger: 'change' }
                    ]
                },
                pickerOptions: {
                    disabledDate(time) {
                        let y = (new Date()).getFullYear();
                        return time.getTime() < (new Date(y + '-01-01')).getTime() || time.getTime() > (new Date(y + '-12-31')).getTime();
                    }
                },

                uploadUrl: uploadPath + '/ajax/school/logo/upload'
            };
        },
        methods: {
            // 获取学校学制列表
            getSchoolSystemList: function() {
                let param = {
                    'name': '',
                    'pageNo': 1,
                    'pageSize': 1000
                };

                schoolSystemList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list && data.list.length > 0) {
                            for(let i = 0; i < data.list.length; i++) {
                                this.schoolSystemOptions.push({
                                    'id': '' + data.list[i].id,
                                    'name': data.list[i].name
                                });
                            }
                        }
                    }
                });
            },
            // 选择省触发事件
            regionsProvChange: function(val) {
                this.dialogInfo.regionsCity = '';
                this.regionsCityOptions = [];
                this.dialogInfo.regionsTown = '';
                this.regionsTownOptions = [];
                for(let i = 0; i < this.regionsProvOptions.length; i++) {
                    if(this.regionsProvOptions[i].v == val) {
                        this.regionsCityOptions = this.regionsProvOptions[i].s;
                        break;
                    }
                }
            },
            // 选择市触发事件
            regionsCityChange: function(val) {
                this.dialogInfo.regionsTown = '';
                this.regionsTownOptions = [];
                for(let i = 0; i < this.regionsCityOptions.length; i++) {
                    if(this.regionsCityOptions[i].v == val) {
                        this.regionsTownOptions = this.regionsCityOptions[i].s;
                        break;
                    }
                }
            },
            // 搜索按钮
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取学校列表
            getList: function() {
                this.tableloading = true;

                let param = {
                    'name': this.searchForm.name,
                    'schoolSystemId': this.searchForm.schoolSystemId,
                    'type': this.searchForm.type,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                schoolList(param).then(res => {
                    this.tableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.list;
                        if(data.total % this.pagi.pageSize == 0) {
                            this.pagi.pageTotal = data.total/this.pagi.pageSize;
                        } else {
                            this.pagi.pageTotal = parseInt(data.total/this.pagi.pageSize) + 1;
                        }
                        this.pagi.total = data.total;
                        this.noPagi = false;
                    }
                });
            },

            handleBefore: function(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: 'LOGO格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            handleSuccess: function(response, file, fileList) {
                this.dialogInfo.logoUrl = fileList;
            },
            handleError: function(err, file, fileList) {
                this.dialogInfo.logoUrl = [];
                this.$message({ message: 'LOGO上传失败，请重试！', type: 'error'});
            },
            handleRemove: function(file, fileList) {
                this.dialogInfo.logoUrl = fileList;
            },

            // 添加、编辑内测用户
            handleAdd: function(type, index, row) {
                this.dialogShow = true;

                setTimeout(function() {
                    that.dialogInfo = {
                        id: '',
                        index: '',
                        logoUrl: [],
                        fullName: '',
                        shortName: '',
                        regionsProv: '',
                        regionsCity: '',
                        regionsTown: '',
                        address: '',
                        schoolSystemId: '',
                        type: '',
                        startYear: '',
                        endYear: ''
                    }
                    that.$refs['ruleForm'].resetFields();

                    if(type == 1) {
                        // edit
                        that.dialogInfo.id = row.id;
                        that.dialogInfo.index = index;
                        that.dialogInfo.logoUrl = [
                            {
                                'name': row.logoUrl,
                                'url': row.logoUrl,
                                'response': {
                                    'code': 0,
                                    'data': {
                                        'logoUrl': row.logoUrl
                                    },
                                    'errorInfo': ''
                                }
                            }
                        ],
                        that.dialogInfo.fullName = row.fullName;
                        that.dialogInfo.shortName = row.shortName;
                        that.dialogInfo.regionsProv = row.regionsProv;
                        
                        setTimeout(function() {
                            that.dialogInfo.regionsCity = row.regionsCity;
                            for(let i = 0; i < that.regionsProvOptions.length; i++) {
                                if(that.regionsProvOptions[i].v == row.regionsProv) {
                                    that.regionsCityOptions = that.regionsProvOptions[i].s;
                                    break;
                                }
                            }

                            setTimeout(function() {
                                for(let i = 0; i < that.regionsCityOptions.length; i++) {
                                    if(that.regionsCityOptions[i].v == row.regionsCity) {
                                        that.regionsTownOptions = that.regionsCityOptions[i].s;
                                        break;
                                    }
                                }
                                that.dialogInfo.regionsTown = row.regionsTown;
                            },1);
                        },1);
                        
                        that.dialogInfo.address = row.address;
                        that.dialogInfo.schoolSystemId = '' + row.schoolSystemId;
                        that.dialogInfo.type = '' + row.type;
                        that.dialogInfo.startYear = (new Date()).getFullYear() + '-' + row.startYear;
                        that.dialogInfo.endYear = (new Date()).getFullYear() + '-' + row.endYear;
                    }
                }, 1);
            },

            // 提交用户信息
            submitForm: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dialogLoading = true;

                        let params = {
                            'id': this.dialogInfo.id,
                            'fullName': this.dialogInfo.fullName,
                            'shortName': this.dialogInfo.shortName,
                            'logoUrl': this.dialogInfo.logoUrl[0].response.data.logoUrl,
                            'startYear': COMMON.formatMonthDay(this.dialogInfo.startYear, '-'),
                            'endYear': COMMON.formatMonthDay(this.dialogInfo.endYear, '-'),
                            'type': this.dialogInfo.type,
                            'schoolSystemId': this.dialogInfo.schoolSystemId,
                            'regionsProv': this.dialogInfo.regionsProv,
                            'regionsCity': this.dialogInfo.regionsCity,
                            'regionsTown': this.dialogInfo.regionsTown,
                            'address': this.dialogInfo.address
                        };

                        schoolSave(params).then(res=>{
                            this.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存学校信息成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getList();
                            }
                        });
                    }else{
                        return false;
                    }
                });
            }
        },
        mounted() {
            that = this;
            this.getSchoolSystemList();
            this.getList();
        }
    }
</script>

<style lang="scss">
    .el-message-box{
        height: auto !important;
    }
    .el-dialog .formation .el-form .el-form-item .el-form-item__content{
        padding-left: 0 !important;
    }
    .pickerMonth{
        .el-date-picker__header{
            > button{
                display: none !important;
            }

            > span{
                &:nth-of-type(1) {
                    display: none !important;
                }
            }
        }
    }
    
</style>

<style lang="scss" scoped>
    .luoym{
        .button-add{
            margin-right: 15px;
        }
        .inline-box{
            padding-left: 0;
        }
        .tip{
            display: inline-block;
        }
        .formation .el-form .el-form-item .el-form-item__content .el-input {
            width: 130px !important;
        }

    }
</style>

