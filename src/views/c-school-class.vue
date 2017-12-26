<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym clearfix">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>班级管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <div class="pull-left">
                    <div class="search-box">
                        <el-input v-model="schoolname" @click="keyDownSubmit" size="small" placeholder="请输入学校名称" :icon="schoolSearchLoading ? 'loading' : 'search'"></el-input>
                    </div>
                    <div class="light-overscroll">
                        <el-tree
                          empty-text="暂无数据"
                          :data="schoolOptions"
                          :props="defaultProps"
                          accordion
                          highlight-current
                          @node-click="handleNodeClick">
                        </el-tree>
                    </div>
                </div>
                <div class="pull-right">
                    <div class="light-overscroll" v-if="showTable">
                        
                        <section class="search clearfix">
                            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                                <el-form-item label="班级编号">
                                    <el-input v-model="searchForm.code" size="small" placeholder="请输入班级编号"></el-input>
                                </el-form-item>
                                <el-form-item label="年级">
                                    <el-select v-model="searchForm.schoolSystemGradeId" placeholder="请选择">
                                        <el-option v-for="item in schoolGradeOptions" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                                </el-form-item>
                            </el-form>
                        
                            <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd(0)">新增班级</el-button>
                            <!-- <el-upload
                                class="upload-demo"
                                :action="uploadUrl"
                                :before-upload="handleBefore"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :file-list="fileList">
                                <el-button type="primary" size="small" class="btn-add" icon="upload" :loading="uploadLoading" style="margin-right: 15px;">导入班级</el-button>
                            </el-upload> -->
                        </section>

                        <section class="table">
                            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                                <el-table-column label="班级名称">
                                    <template scope="scope"><p>{{ scope.row.name }}</p></template>
                                </el-table-column>
                                <el-table-column label="班级编号">
                                    <template scope="scope"><p>{{ scope.row.code }}</p></template>
                                </el-table-column>
                                <el-table-column label="建班年份（学届）">
                                    <template scope="scope"><p>{{ scope.row.buildYear }}</p></template>
                                </el-table-column>
                                <el-table-column label="学段">
                                    <template scope="scope"><p>{{ scope.row.periodStr }}</p></template>
                                </el-table-column>
                                <el-table-column label="年级">
                                    <template scope="scope"><p>{{ scope.row.gradeName }}</p></template>
                                </el-table-column>
                                <el-table-column label="班号">
                                    <template scope="scope"><p>{{ scope.row.classNum }}</p></template>
                                </el-table-column>
                                <el-table-column label="班级状态">
                                    <template scope="scope"><p>{{ scope.row.statusStr }}</p></template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button size="small" class="button-link" @click="handleAdd(1, scope.$index, scope.row)" v-if="scope.row.statusStr == '在读'">编辑</el-button>
                                        <span class="button-separate" v-if="scope.row.statusStr == '在读'">|</span>
                                        <el-button size="small" class="button-link" @click="handleDetail(scope.row)">查看成员</el-button>
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

                        <el-dialog :title="dialogInfo.type == 0 ? '新增班级' : '编辑班级'" :visible.sync="dialogShow" :modal-append-to-body="false">
                            <section class="formation"> 
                               
                                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                                    <el-form-item label="班级编号">
                                        <el-input v-model="dialogInfo.code" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item label="班级名称">
                                        <el-input v-model="dialogInfo.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="建班年份" prop="buildYear">
                                        <el-select v-model="dialogInfo.buildYear" placeholder="请选择">
                                            <el-option v-for="item in buildYearOptions" :key="item.id" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="学段" prop="period">
                                        <el-select v-model="dialogInfo.period" placeholder="请选择" @change="handlePeriodChange">
                                            <el-option v-for="item in schoolPeriodOptions" :key="item.id" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="年级" prop="schoolSystemGradeId">
                                        <el-select v-model="dialogInfo.schoolSystemGradeId" placeholder="请选择" :disabled="dialogInfo.status == 1">
                                            <el-option v-for="item in schoolSystemGradeOptions" :key="item.id" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                        <el-checkbox v-model="dialogInfo.status" true-label="1" false-label="0" v-if="dialogInfo.schoolSystemGradeId">使此班级毕业</el-checkbox>
                                    </el-form-item>
                                    <el-form-item label="班号" prop="classNum">
                                        <el-input v-model="dialogInfo.classNum"></el-input>
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
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, schoolList, schoolGradeList, schoolClassCode, schoolClassSave, schoolClassList } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showTable: false,

                // 左侧学校列表
                schoolOptions: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                schoolname: '',
                schoolSearchLoading: false,

                searchForm: {
                    schoolId: '',
                    code: '',
                    period: '',
                    schoolSystemGradeId: ''
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

                schoolGradeOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ],
                schoolPeriodOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ],
                buildYearOptions: [],
                schoolSystemGradeOptions: [],

                dialogInfo: {
                    id: '',
                    index: '',
                    buildYear: '',
                    period: '',
                    code: '',
                    schoolSystemGradeId: '',
                    name: '',
                    classNum: '',
                    status: '0'
                },
                dialogShow: false,
                dialogLoading: false,
                rules: {
                    classNum: [
                        { required: true, message: '*请输入班号', trigger: 'blur' }
                    ],
                    buildYear: [
                        { required: true, message: '*请选择建班年份', trigger: 'change' }
                    ],
                    schoolSystemGradeId: [
                        { required: true, message: '*请选择年级', trigger: 'change' }
                    ],
                    period: [
                        { required: true, message: '*请选择学段', trigger: 'change' }
                    ]
                },

                uploadUrl: uploadPath + '/schoolClass/excel/import',
                fileList: [],
                uploadLoading: false
            };
        },
        methods: {
            // 建班年份
            setBuildYear: function() {
                this.buildYearOptions = [{
                    'id': '',
                    'name': '请选择'
                }];
                for(let i = 2000; i < 2101; i++) {
                    this.buildYearOptions.push({
                        'id': '' + i,
                        'name': '' + i
                    });
                }
            },
            // 获取学校列表
            getSchoolList: function() {
                this.schoolSearchLoading = true;

                let param = {
                    'name': this.schoolname,
                    'pageNo': 1,
                    'pageSize': 5000
                };

                schoolList(param).then(res => {
                    this.schoolSearchLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        that.schoolOptions = [];
                        if(data.list && data.list.length > 0) {
                            for(let i = 0; i < data.list.length; i++) {
                                let item = data.list[i],
                                    childrenArr = [];

                                for(let j = 0; j < item.periodVoList.length; j++) {
                                    childrenArr.push({
                                        'label': item.periodVoList[j].periodName,
                                        'id': item.periodVoList[j].periodValue,
                                        'schoolSystemId': item.periodVoList[j].schoolSystemId,
                                        'schoolId': item.id,
                                        'periodVoList': item.periodVoList
                                    });
                                }

                                this.schoolOptions.push({
                                    'label': item.fullName,
                                    'id': item.id,
                                    'schoolSystemId': item.schoolSystemId,
                                    'children': childrenArr,
                                    'periodVoList': item.periodVoList
                                });
                            }
                        }
                    }
                });
            },
            // 选择节点触发的事件
            handleNodeClick(data) {
                if(data.schoolId) {
                    // 选中学段
                    this.searchForm.schoolId = data.schoolId;
                    this.searchForm.period = data.id;
                    this.getSystemGradeList(data.id, data.schoolSystemId);
                } else {
                    // 选中学校
                    this.searchForm.schoolId = data.id;
                    this.searchForm.period = '';
                    this.schoolGradeOptions = [];
                }

                this.searchForm.schoolSystemId = data.schoolSystemId;
                this.searchForm.code = '';
                this.searchForm.schoolSystemGradeId = '';
                this.schoolPeriodOptions = [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ]
                for(let i = 0; i < data.periodVoList.length; i++) {
                    this.schoolPeriodOptions.push(
                        {
                            'id': '' + data.periodVoList[i].periodValue,
                            'name': data.periodVoList[i].periodName
                        }
                    );
                }

                this.showTable = true;

                this.getList();
            },
            // 根据学制id获取年级
            getSystemGradeList: function(period, schoolSystemId) {
                let param = {
                    'period': period,
                    'schoolSystemId': schoolSystemId
                };

                schoolGradeList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list && data.list.length > 0) {
                            this.schoolGradeOptions = [
                                {
                                    'id': '',
                                    'name': '请选择'
                                }
                            ];
                            for(let i = 0; i < data.list.length; i++) {
                                this.schoolGradeOptions.push({
                                    'id': '' + data.list[i].id,
                                    'name': '' + data.list[i].name
                                });
                            }
                        }
                    }
                });
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
            // 获取班级列表
            getList: function() {
                this.tableloading = true;

                let param = {
                    'schoolId': this.searchForm.schoolId,
                    'code': this.searchForm.code,
                    'period': this.searchForm.period,
                    'schoolSystemGradeId': this.searchForm.schoolSystemGradeId,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                schoolClassList(param).then(res => {
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

            // 添加、编辑内测用户
            handleAdd: function(type, index, row) {
                this.dialogShow = true;

                setTimeout(function() {
                    that.$refs['ruleForm'].resetFields();
                    if(type == 0) {
                        // add
                        that.getCode();
                    } else if(type == 1) {
                        // edit
                        that.dialogInfo.id = row.id;
                        that.dialogInfo.index = index;
                        that.dialogInfo.buildYear = '' + row.buildYear;
                        that.dialogInfo.period = '' + row.period;
                        setTimeout(function() {
                            that.dialogInfo.schoolSystemGradeId = '' + row.schoolSystemGradeId;
                        },1);
                        that.dialogInfo.code = row.code;
                        that.dialogInfo.name = row.name;
                        that.dialogInfo.classNum = row.classNum;
                        that.dialogInfo.status = '' + row.status;
                    }
                }, 1);
            },

            // 查看成员
            handleDetail: function(row) {
                this.$router.push({path : "schoolTree" , query : { 'school' : this.searchForm.schoolId, 'period': this.searchForm.period, 'grade': row.schoolSystemGradeId, 'class': row.id }});
            },

            // 获取班级编号
            getCode: function() {
                schoolClassCode({}).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.dialogInfo.code = data.code;
                    }
                });
            },

            // 学段改变触发事件 
            handlePeriodChange: function(val) {
                if(!val) {
                    return false;
                }

                let param = {
                    'period': val,
                    'schoolSystemId': this.searchForm.schoolSystemId
                };

                schoolGradeList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list && data.list.length > 0) {
                            this.schoolSystemGradeOptions = [
                                {
                                    'id': '',
                                    'name': '请选择'
                                }
                            ];
                            for(let i = 0; i < data.list.length; i++) {
                                this.schoolSystemGradeOptions.push({
                                    'id': '' + data.list[i].id,
                                    'name': '' + data.list[i].name
                                });
                            }
                        }
                    }
                });
            },

            // 提交用户信息
            submitForm: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dialogLoading = true;

                        let params = {
                            'id': this.dialogInfo.id,
                            'period': this.dialogInfo.period,
                            'schoolId': this.searchForm.schoolId,
                            'code': this.dialogInfo.code,
                            'name': this.dialogInfo.name,
                            'classNum': this.dialogInfo.classNum,
                            'buildYear': this.dialogInfo.buildYear,
                            'schoolSystemGradeId': this.dialogInfo.schoolSystemGradeId,
                            'status': this.dialogInfo.status
                        };

                        schoolClassSave(params).then(res=>{
                            this.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存班级信息成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getList();
                            }
                        });
                    }else{
                        return false;
                    }
                });
            },

            handleBefore: function(file) {
                let nameArr = (file.name).split('.'),
                    type = nameArr[nameArr.length - 1];

                if(type != 'xls' && type != 'xlsx') {
                    this.$message({ message: '文件格式不正确！支持.xls、.xlsx格式！', type: 'error'});
                    return false;
                }

                this.uploadLoading = true;
            },
            handleSuccess: function(response, file, fileList) {
                this.fileList = [];
                this.uploadLoading = false;
            },
            handleError: function(err, file, fileList) {
                this.uploadLoading = false;
                this.fileList = [];
                this.$message({ message: '班级上传失败，请重试！', type: 'error'});
            },

            keyDownSubmit: function() {
                that.getSchoolList();
            }
        },
        mounted() {
            that = this;

            this.setBuildYear();
            this.getSchoolList();
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
    .pull-left{
        .search-box{
            .el-input{
                width: 100%;
                font-size: 12px;
                
                .el-input__inner {
                    height: 36px;
                    background: #FFFFFF;
                    border: none;
                    border-bottom: 1px solid #E5E5E5;
                    border-radius: 0;
                    text-align: center;
                    &:hover {
                        background: transparent;
                    }
                    &:focus {
                        outline: 0;
                        background: transparent;
                    }
                    &::placeholder,
                    &::-webkit-input-placeholder {
                        color: rgba(51, 51, 51, .3);
                    }
                }

                .el-input__icon{
                    cursor: pointer;
                }
            }
        }
    }
    .pull-right{
        .el-checkbox{
            margin-left: 10px;

            .el-checkbox__label{
                font-size: 12px;
                color: #333;
            }
        }

        .upload-demo{
            float: right;

            .el-upload-list{
                display: none !important;
            }
        }
    }
</style>

<style lang="scss" scoped>
    .luoym{
        .button-add{
            margin-right: 15px;
        }

        .pull-left{
            position: relative;
            width: 200px;
            height: calc(100% - 29px);
            margin-top: 15px;
            overflow: hidden;
            box-shadow: 0 1px 4px 0 rgba(65, 86, 105, 0.2);

            .light-overscroll{
                margin-top: 36px;
                height: calc(100% - 36px);
            }

            .search-box{
                position: absolute;
                z-index: 3;
                top: 0;
                left: 0;
                right: 0;
            }
        }

        .pull-right{
            width: calc(100% - 215px);
            height: calc(100% - 14px);
            overflow: hidden;

            .light-overscroll{
                height: 100%;
            }

            .button-separate{
                margin-right: 10px;
                color: #999;
            }
        }
    }
</style>

