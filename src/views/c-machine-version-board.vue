<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>智慧班牌</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="版本号">
                    <el-input v-model="searchForm.account" size="small" placeholder="请输入账号"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>


            <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="">新增版本</el-button>
        </section>

        <section class="table">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="版本号">
                    <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                </el-table-column>
                <el-table-column label="版本说明">
                    <template scope="scope"><p>{{ scope.row.schoolNumber }}</p></template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        
        <el-dialog title="编辑用户" :visible.sync="editDialogShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="editInfo">
                    <el-form-item label="版本号" prop="account">
                        <el-input v-model="editInfo.account" :disabled="true"></el-input>
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
    import { uploadPath, memberList, memberEdit, markSix, tagsClassifyList, tagsList, } from '../api/api';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    account: '',
                    classify: '',
                    status: '',
                    character: ''
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
                    account: '',
                    school: '',
                    name: '',
                    classify: '',
                    memberRoleList: [],
                    tagList: []
                },
                editDialogShow: false,
                dialogLoading: false,
                rules: {
                    name: [
                        { required: true, message: '*请输入姓名', trigger: 'blur' }
                    ],
                    classify: [
                        { required: true, message: '*请选择分类', trigger: 'change' }
                    ]
                },

                uploadShow: false,
                uploadLoading: false,
                uploadUrl: uploadPath + '/ajax/member/excel/importUsers',
                uploadInfo: {
                    
                },
                fileList: [],
                fileChange: new Array(),
                rulesUpload: {
                    
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

                let memberListParam = {
                    'mobile': this.searchForm.account,
                    'type': this.searchForm.classify,
                    'activeStatus': this.searchForm.status,
                    'roleType': this.searchForm.character,
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
                    this.$message({ message: '网络异常！获取用户列表失败！', type: 'error'});
                });
            },
            // 编辑按钮
            handleEdit(index, row) {
                this.editDialogShow = true;

                setTimeout(function() {
                    that.$refs['ruleForm'].resetFields();

                    that.editInfo.id = row.id;
                    that.editInfo.index = index;
                    that.editInfo.account = row.mobile;
                    that.editInfo.school = row.schoolNumber;
                    that.editInfo.name = row.name;
                    that.editInfo.classify = ''+ row.type;
                    that.editInfo.memberRoleList = [];
                    that.editInfo.tagList = row.tagVoList;

                    if(row.memberRoleList.length > 0) {
                        for(let i = 0; i < row.memberRoleList.length; i++) {
                            that.editInfo.memberRoleList.push({
                                schoolCode: row.memberRoleList[i].schoolCode,
                                type: '' + row.memberRoleList[i].type
                            })
                        }
                    }
                    
                }, 1);
            },               
            // 保存编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid)=>{
                     if(valid){
                        this.dialogLoading = true;

                        let roleJson = [];
                        if(this.editInfo.memberRoleList.length > 0) {
                            for(let i = 0; i < this.editInfo.memberRoleList.length; i++) {
                                if(this.editInfo.memberRoleList[i].schoolCode) {
                                    roleJson.push({
                                        shoolCode: this.editInfo.memberRoleList[i].schoolCode,
                                        roleType: this.editInfo.memberRoleList[i].type,
                                        memberId: this.editInfo.id
                                    })
                                }
                            }
                        }

                        let tagIds = [];
                        if(this.editDialogInfo.tagList.length > 0) {
                            for(let i = 0; i < this.editDialogInfo.tagList.length; i++) {
                                tagIds.push(this.editDialogInfo.tagList[i].id);
                            }
                        }                        

                        let params = {
                            'id': this.editInfo.id,
                            'name': this.editInfo.name,
                            'type': this.editInfo.classify,
                            'roleJsonStr': JSON.stringify(roleJson),
                            'tagIds': tagIds.join(',')
                        };

                        memberEdit(params).then(res=>{
                            this.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存用户信息成功！', type: 'success' });
                                this.editDialogShow = false;
                                this.getUserList();
                            }
                        }).catch(error => {
                            this.dialogLoading = false;
                            this.$message({ message: '网络异常！保存用户信息失败！', type: 'error'});
                        });
                     }else{
                         return false;
                     }
                });
            }         
        },
        mounted() {
            that = this;

            this.getUserList();
            this.getClassifyList();
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

