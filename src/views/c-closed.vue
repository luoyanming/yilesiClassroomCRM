<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>内测用户</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="手机号">
                    <el-input v-model="searchForm.mobile" size="small" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.name" size="small" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
        
            <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="uploadShow = !uploadShow">批量导入</el-button>
            <el-button type="primary" size="small" class="btn-add button-add" icon="plus" @click.native="handleAdd(0)">添加</el-button>
        </section>

        <section class="table">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="手机账号">
                    <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                </el-table-column>
                <el-table-column label="姓名">
                    <template scope="scope"><p>{{ scope.row.name }}</p></template>
                </el-table-column>
                <el-table-column label="加入内测账户时间">
                    <template scope="scope"><p>{{ scope.row.createdDateStr }}</p></template>
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

        <el-dialog :title="dialogInfo.type == 0 ? '添加内测账号' : '编辑内测账号'" :visible.sync="dialogShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                    <el-form-item label="手机账号" prop="mobile">
                        <el-input v-model="dialogInfo.mobile" :disabled="dialogInfo.type == 0 ? false : true"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="dialogInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户分类" prop="classify">
                        <el-select v-model="dialogInfo.classify" placeholder="请选择">
                            <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="导入内测账号" :visible.sync="uploadShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="rulesUpload" ref="ruleUploadForm" label-width="180px" :model="uploadInfo">
                    <el-form-item label="导入" prop="excel">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :on-change="uploadChange"
                            :action="uploadUrl"
                            :data="{ 'type': uploadInfo.classify }"
                            :on-success="uploadSucc"
                            :on-error="uploadError"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">导入excel</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="用户分类" prop="classify">
                        <el-select v-model="uploadInfo.classify" placeholder="请选择">
                            <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="uploadLoading" @click.native="submitUpload('ruleUploadForm')">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, memberList, saveClosed, memberExcel } from '../api/api';

    let that;
    
    export default {
        data() {
            return {
                searchForm: {
                    mobile: '',
                    name: ''
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
                classifyOptions:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'2',
                        label:'内部'
                    },
                    {
                        value:'3',
                        label:'代理'
                    },
                    {
                        value:'4',
                        label:'内测'
                    },
                    {
                        value:'1',
                        label:'一般'
                    },
                    {
                        value:'5',
                        label:'特殊'
                    }
                ],
                dialogInfo: {
                    type: '',
                    id: '',
                    index: '',
                    mobile: '',
                    name: '',
                    classify: '4'
                },
                dialogShow: false,
                dialogLoading: false,
                rules: {
                    mobile: [
                        { required: true, message: '*请输入手机账号', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '*请输入姓名', trigger: 'blur' }
                    ],
                    classify: [
                        { required: true, message: '*请选择分类', trigger: 'change' }
                    ]
                },

                uploadShow: false,
                uploadLoading: false,
                uploadUrl: uploadPath + '/ajax/member/excel/import',
                uploadInfo: {
                    classify: '4'
                },
                fileList: [],
                fileChange: new Array(),
                rulesUpload: {
                    classify: [
                        { required: true, message: '*请选择分类', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getClosedList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getClosedList();
            },
            getClosedList: function() {
                this.tableloading = true;

                let memberListParam = {
                    'mobile': this.searchForm.mobile,
                    'name': this.searchForm.name,
                    'type': 4,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                memberList(memberListParam).then(res => {
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
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取内测用户列表失败！', type: 'error'});
                });
            },

            // 添加、编辑内测用户
            handleAdd: function(type, index, row) {
                this.dialogShow = true;
                this.dialogInfo.type = type;

                setTimeout(function() {
                    that.$refs['ruleForm'].resetFields();

                    if(type == 0) {
                        // add
                        that.dialogInfo.id = '';
                        that.dialogInfo.index = '';
                        that.dialogInfo.mobile = '';
                        that.dialogInfo.name = '';
                        that.dialogLoading = false;
                    } else {
                        // edit
                        that.dialogInfo.id = row.id;
                        that.dialogInfo.index = index;
                        that.dialogInfo.mobile = row.mobile;
                        that.dialogInfo.name = row.name;
                        that.dialogLoading = false;
                    }
                }, 1);
            },

            // 提交用户信息
            submitForm: function(formName) {
                if(this.dialogLoading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dialogLoading = true;

                        let params = {
                            'id': this.dialogInfo.id,
                            'mobile': this.dialogInfo.mobile,
                            'name': this.dialogInfo.name,
                            'type': this.dialogInfo.classify
                        };

                        saveClosed(params).then(res=>{
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.dialogLoading = false;
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存用户信息成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getClosedList();
                            }
                        }).catch(error => {
                            this.dialogLoading = false;
                            this.$message({ message: '网络异常！保存用户信息失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });
            },

            handleRemove(file, fileList) {
                
            },
            uploadError(response, file, fileList) {
                this.$message({ message: '导入excel失败！请重试！', type: 'error' });
                this.uploadLoading = false;
                this.fileList = [];
            },
            uploadSucc(response, file, fileList) {
                if(response.code != 0) {
                    this.$message({ message: response.errorInfo, type: 'error' });
                    this.uploadLoading = false;
                    this.fileList = [];
                } else {
                    this.$message({ message: '导入excel成功！', type: 'success' });
                    this.uploadLoading = false;
                    this.uploadShow = false;
                    this.fileList = [];
                    this.getClosedList();
                }
            },
            uploadChange: function(file, fileList) {
                this.fileChange = fileList;
            },

            // 提交excel
            submitUpload: function() {
                if(this.fileChange.length == 0) {
                    this.$message({ message: '请上传excel文件！', type: 'error' });
                    return false;
                }

                this.uploadLoading = true;
                this.$refs.upload.submit();
            }
        },
        mounted() {
            that = this;
            this.getClosedList();
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
</style>

<style lang="scss" scoped="">
    .button-add{
        margin-right: 15px;
    }
</style>

