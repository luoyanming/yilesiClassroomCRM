<template>
    <div class="main-wrapper light-overscroll luoym machine-version">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>智慧摄像头版本</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="版本号">
                    <el-input v-model="searchForm.version" size="small" placeholder="请输入账号"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>

            <div class="button-blank">
                <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="handleEdit(0)">新增版本</el-button>
            </div>
        </section>

        <section class="table">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="版本号">
                    <template scope="scope"><p>{{ scope.row.version }}</p></template>
                </el-table-column>
                <el-table-column label="版本说明">
                    <template scope="scope"><p>{{ scope.row.description }}</p></template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" class="button-link" @click="handleEdit(1, scope.$index, scope.row)">编辑</el-button>
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

        
        <el-dialog :title="editInfo.id ? '编辑智慧摄像头版本' : '新增智慧摄像头版本'" :visible.sync="editDialogShow" :modal-append-to-body="false" custom-class="w700">
            <section class="formation">
               
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="editInfo">
                    <el-form-item label="版本号" prop="version">
                        <el-input v-model="editInfo.version"></el-input>
                    </el-form-item>
                    <el-form-item label="视图">
                        <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :before-upload="handleBefore"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :file-list="editInfo.viewUrl"
                            list-type="picture">
                            <el-button size="small" type="primary" :disabled="editInfo.viewUrl.length != 0">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">上传尺寸300像素 X 300像素，支持jpg、jpeg、png</div>
                        </el-upload>                                
                    </el-form-item>
                    <el-form-item label="版本说明" prop="description">
                        <el-input type="textarea" v-model="editInfo.description"></el-input>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
            </span>
        </el-dialog>             
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, smartVersionList, smartVersionSave } from '../api/api';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    version: ''
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


                editInfo:{
                    id: '',
                    index: '',
                    version: '',
                    description: '',
                    viewUrl: []
                },
                uploadUrl: uploadPath + '/ajax/smartDeviceVersion/view/upload',
                editDialogShow: false,
                dialogLoading: false,
                rules: {
                    version: [
                        { required: true, message: '*请输入版本号', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            // 列表搜索
            onSearchSubmit() {
                this.pagi.currentPage = 1;

                this.getList();
            },
            // 列表分页
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取用户列表
            getList() {
                this.tableloading = true;

                let param = {
                    'version': this.searchForm.version,
                    'type': 4,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                smartVersionList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取列表失败！', type: 'error'});
                });
            },
            // 编辑按钮
            handleEdit(type, index, row) {
                this.editDialogShow = true;

                if(type == 0) {
                    // 新增
                    setTimeout(function() {
                        that.$refs['ruleForm'].resetFields();

                        that.editInfo.id = '';
                        that.editInfo.index = '';
                        that.editInfo.version = '';
                        that.editInfo.description = '';
                        that.editInfo.viewUrl = [];
                        that.dialogLoading = false;
                    }, 1);
                } else {
                    // 编辑
                    setTimeout(function() {
                        that.$refs['ruleForm'].resetFields();

                        that.editInfo.id = row.id;
                        that.editInfo.index = index;
                        that.editInfo.version = row.version;
                        that.editInfo.description = row.description;
                        that.dialogLoading = false;

                        if(row.viewUrl) {
                            that.editInfo.viewUrl = [
                                {
                                    'name': row.viewUrl,
                                    'url': row.viewUrl,
                                    'response': {
                                        'code': 0,
                                        'data': {
                                            'viewUrl': row.viewUrl,
                                            'viewPath': row.view
                                        },
                                        'errorInfo': ''
                                    }
                                }
                            ];
                        } else {
                            that.editInfo.viewUrl = [];
                        }                     
                    }, 1);
                }
                
            },               
            // 保存编辑
            submitForm(formName) {
                if(this.dialogLoading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid)=>{
                     if(valid){
                        this.dialogLoading = true;

                        let params = {
                            'id': this.editInfo.id,
                            'version': this.editInfo.version,
                            'description': this.editInfo.description,
                            'view': this.editInfo.viewUrl.length > 0 ? this.editInfo.viewUrl[0].response.data.viewPath : '',
                            'type': 4
                        };

                        smartVersionSave(params).then(res=>{
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.dialogLoading = false;

                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存成功！', type: 'success' });
                                this.editDialogShow = false;
                                this.getList();
                            }
                        }).catch(error => {
                            this.dialogLoading = false;
                            this.$message({ message: '网络异常！保存失败！', type: 'error'});
                        });
                     }else{
                         return false;
                     }
                });
            },

            handleBefore: function(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            handleSuccess: function(response, file, fileList) {
                this.editInfo.viewUrl = fileList;
            },
            handleError: function(err, file, fileList) {
                this.editInfo.viewUrl = [];
                this.$message({ message: '图片上传失败，请重试！', type: 'error'});
            },
            handleRemove: function(file, fileList) {
                this.editInfo.viewUrl = fileList;
            },        
        },
        mounted() {
            that = this;

            this.getList();
        }
    }
</script>

<style lang="scss">
    .character-item{
        .el-select{
            .el-input{
                width: 100px !important;
            }
        }

        .button-add{
            line-height: 30px !important;
        }
    }

    .luoym.machine-version .formation .el-form .el-form-item .el-form-item__content .el-textarea{
        width: 300px;
    }    
</style>

<style lang="scss" scoped>
    .character-item{
        margin-bottom: 10px;

        .el-input,
        .el-select{
            float: left;
            margin-right: 10px;
        }

        .button-remove{
            float: left;
            width: 26px;
            height: 26px;
            margin-top: 7px;
            padding: 0;
            border: 0;
            border-radius: 50%;
            min-width: auto;
            line-height: 26px !important;
        }
    }
    .tag-list{
        .tag-item{
            background: #fff;
            color: #18c79c;
            line-height: 30px !important;
            border-radius: 15px;

            &:hover,
            &:active{
                opacity: .8;
            }
        }

        .tag-add{
            line-height: 30px !important;
        }
    }   
</style>

