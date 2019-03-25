<template>
    <div class="main-wrapper light-overscroll luoym account-admin">
        <section class="crumbs clearfix">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>渠道账户管理</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleEdit('', '')">创建账户</el-button>
        </section>
        
        <section class="table" style="height: auto;">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="渠道商">
                    <template scope="scope"><p>{{ scope.row.channelName }}</p></template>
                </el-table-column>
                <el-table-column label="账号">
                    <template scope="scope"><p>{{ scope.row.account }}</p></template>
                </el-table-column>
                <el-table-column label="管理员">
                    <template scope="scope"><p>{{ scope.row.adminUsers }}</p></template>
                </el-table-column>
                <el-table-column label="账户状态">
                    <template scope="scope">
                        <p v-if="scope.row.status == 0">正常</p>
                        <p v-if="scope.row.status == -1">停用</p>
                        <p v-if="scope.row.status == -2">作废</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.status == -2">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="pagi.currentPage"
                :page-size="pagi.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagi.total"
                v-if="!noPagi">
            </el-pagination> -->
        </section>

        
        <el-dialog :title="editDialogInfo.id ? '编辑渠道账户' : '创建渠道账户'" :visible.sync="editDialogShow" :modal-append-to-body="false" custom-class="w800 height-auto" @close="handleEditDialogClose">
            <section class="formation">
               
                <el-form label-position="right" :rules="rules" ref="editDialogInfo" label-width="180px" :model="editDialogInfo">
                    <el-form-item label="渠道商" prop="channelId">
                        <el-select placeholder="请选择" v-model="editDialogInfo.channelId" :disabled="editDialogInfo.id ? true : false">
                            <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账号状态" prop="status">
                        <el-select placeholder="请选择" v-model="editDialogInfo.status">
                            <el-option label="正常" value="0"></el-option>
                            <el-option label="停用" value="-1"></el-option>
                            <el-option label="作废" value="-2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="登录账号" prop="account">
                        <el-input v-model="editDialogInfo.account"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="password">
                        <el-input :type="editDialogInfo.pwdShow ? 'text' : 'password'" v-model="editDialogInfo.password"></el-input>&nbsp;
                        <el-button type="text" size="small" v-if="editDialogInfo.pwdShow" @click="editDialogInfo.pwdShow = !editDialogInfo.pwdShow">隐藏</el-button>
                        <el-button type="text" size="small" v-if="!editDialogInfo.pwdShow" @click="editDialogInfo.pwdShow = !editDialogInfo.pwdShow">显示</el-button>
                    </el-form-item>
                    <el-form-item label="管理员" prop="adminList">
                        <div class="character-item clearfix" v-for="(item, index) in editDialogInfo.adminList" >
                            <el-input v-model="item.mobile" :disabled="true"></el-input>
                            <el-input v-model="item.name" :disabled="true"></el-input>
                            <el-button type="primary" size="small" class="button-remove" icon="minus" @click="handleRemoveOption(index)"></el-button>
                        </div>
                        <div class="character-item clearfix">
                            <el-button type="primary" size="small" class="button-add" icon="plus" @click="handleAddOption">增加管理员</el-button>
                        </div>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="editDialogInfo.submitLoading" @click.native="editDialogSubmit('editDialogInfo')">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加管理员" :visible.sync="staffDialogShow" :modal-append-to-body="false" custom-class="w80">
            <div class="dialog-table clearfix">
                <div class="dialog-left">
                    <section class="table-search">
                        <el-input v-model="staffDialog.searchParam" @click="staffDialogSearch" size="small" placeholder="搜索用户名/手机号/学校账号" :icon="staffDialog.tableLoading ? 'loading' : 'search'"></el-input>
                    </section>
                    <section class="table">
                        <el-table ref="multipleTable" :data="staffDialog.tableData" stripe style="width: 100%" @selection-change="staffDialogSelect" :loading="staffDialog.tableLoading">
                            <el-table-column type="selection" width="75"></el-table-column>
                            <el-table-column label="">
                                <template scope="scope">{{ scope.row.name }}</template>
                            </el-table-column>
                            <el-table-column label="">
                                <template scope="scope">{{ scope.row.mobile }}</template>
                            </el-table-column>
                            <el-table-column label="">
                                <template scope="scope">{{ scope.row.schoolAccount }}</template>
                            </el-table-column>
                        </el-table>

                        <el-pagination
                            @current-change="handleStaffDialogPageChange"
                            :current-page.sync="staffDialog.pagi.currentPage"
                            :page-size="staffDialog.pagi.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="staffDialog.pagi.total"
                            v-if="!staffDialog.noPagi">
                        </el-pagination>
                    </section>
                </div>

                <div class="dialog-right">
                    <section class="table-title">已选择管理员</section>
                    <section class="table">
                        <el-table :data="staffDialog.selectedData" stripe style="width: 100%">
                            <el-table-column>
                                <template scope="scope"><p>{{ scope.row.name }}</p></template>
                            </el-table-column>
                            <el-table-column>
                                <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                            </el-table-column>
                            <el-table-column label="">
                                <template scope="scope">{{ scope.row.schoolAccount }}</template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template scope="scope">
                                    <el-button size="small" class="button-link" @click="handleStaffDialogSelectedDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </section>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="staffDialog.submitLoading" @click.native="staffDialogSubmit">保存</el-button>
            </span>
        </el-dialog>   

    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { channelSchoolUserList, channelSchoolUserSave, channelSchoolUserDelete, adminUserMemberList, channelList } from '../api/api';

    let that;

    export default {
        data() {
            var checkAdminList = (rule, value, callback) => {
                if(value.length == 0) {
                    callback(new Error('*请添加管理员'));
                } else {
                    callback();
                }
            };

            return {
                role: localStorage.getItem('role'),

                tableData: [],
                tableloading: true,
                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },

                editDialogShow: false,
                editDialogInfo: {
                    id: '',
                    channelId: '',
                    status: '',
                    account: '',
                    password: '',
                    pwdShow: false,
                    adminList: [],
                    submitLoading: false
                },
                channelOptions: [],
                rules: {
                    channelId: [{ required: true, message: '*请选择渠道商', trigger: 'change' }],
                    status: [{ required: true, message: '*请选择状态', trigger: 'change' }],
                    account: [{ required: true, message: '*请输入账号', trigger: 'blur' }],
                    password: [{ required: true, message: '*请输入账号密码', trigger: 'blur' }],
                    adminList: [{ required: true, validator: checkAdminList, trigger: 'change' }]
                },

                staffDialogShow: false,
                staffDialog: {
                    searchParam: '',
                    notContainIds: [],
                    tableData: [],
                    tableLoading: true,
                    noPagi: true,
                    pagi: {
                        currentPage: 1,
                        pageSize: 10,
                        pageTotal: '',
                        total: ''
                    },
                    selectedData: [],
                    submitLoading: false                    
                },
            };
        },
        methods: {
            // 列表分页
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取列表
            getList() {
                this.tableloading = true;

                let param = {
                    type: 1,
                    pageNo: this.pagi.currentPage,
                    pageSize: this.pagi.pageSize
                };

                channelSchoolUserList(param).then(res => {
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

            // 获取渠道列表
            getChannelList: function() {
                let param = {
                    'pageNo': 1,
                    'pageSize': 1000
                };

                channelList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length > 0) {
                            for(let i = 0; i < data.list.length; i++) {
                                this.channelOptions.push({
                                    id: '' + data.list[i].id,
                                    name: data.list[i].name
                                })
                            }
                        }
                    }
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取渠道列表失败！', type: 'error'});
                });
            },

            //删除按钮
            handleDelete: function(index, row) {
                this.$confirm('此操作将永久删除该渠道账户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id
                    }
                    
                    channelSchoolUserDelete(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.$message({ message: '删除成功', type: 'success'});

                            that.getList();
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！删除失败！', type: 'error'});
                    });
                });
            },

            //新增、编辑
            handleEdit: function(index, row) {
                if(!row) { //add
                    this.editDialogInfo = {
                        id: '',
                        channelId: '',
                        status: '',
                        account: '',
                        password: '',
                        pwdShow: false,
                        adminList: [],
                        submitLoading: false
                    };
                    this.editDialogShow = true;
                } else { //edit
                    this.editDialogInfo.id = row.id;
                    this.editDialogInfo.channelId = '' + row.channelId;
                    this.editDialogInfo.status = '' + row.status;
                    this.editDialogInfo.account = row.account;
                    this.editDialogInfo.password = row.password;
                    this.editDialogInfo.pwdShow = false;
                    this.editDialogInfo.adminList = row.adminList;
                    this.editDialogInfo.submitLoading = false;
                    this.editDialogShow = true;
                }
            },

            handleEditDialogClose: function() {
                this.$refs['editDialogInfo'].resetFields();
            },

            // 添加管理员
            handleAddOption: function() {
                this.staffDialog.searchParam = '';
                this.staffDialog.selectedData = [];
                this.staffDialogShow = true;
                this.staffDialog.submitLoading = false;

                this.getStaffDialogList();  
            },

            // 移除管理员
            handleRemoveOption: function(index) {
                this.editDialogInfo.adminList.splice(index, 1);
            },

            // 获取所有教职工列表
            getStaffDialogList: function() {
                this.staffDialog.tableLoading = true;

                let notContainIds = [];
                if(this.editDialogInfo.adminList.length > 0) {
                    for(let i = 0; i < this.editDialogInfo.adminList.length; i++) {
                        notContainIds.push(this.editDialogInfo.adminList[i].memberId);
                    }
                }

                let param = {
                    'searchParam': this.staffDialog.searchParam,
                    'notContainIds': notContainIds.join(','),
                    'pageNo': this.staffDialog.pagi.currentPage,
                    'pageSize': this.staffDialog.pagi.pageSize
                };

                adminUserMemberList(param).then(res => {
                    this.staffDialog.tableLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.staffDialog.noPagi = true;
                            this.staffDialog.tableData = [];
                            return false;
                        }

                        this.staffDialog.tableData = data.list;
                        if(data.total % this.staffDialog.pagi.pageSize == 0) {
                            this.staffDialog.pagi.pageTotal = data.total/this.staffDialog.pagi.pageSize;
                        } else {
                            this.staffDialog.pagi.pageTotal = parseInt(data.total/this.staffDialog.pagi.pageSize) + 1;
                        }
                        this.staffDialog.pagi.total = data.total;
                        this.staffDialog.noPagi = false;
                    }
                }).catch(error => {
                    this.staffDialog.tableLoading = false;
                    this.$message({ message: '网络异常！获取管理员列表失败！', type: 'error'});
                });
            },
            // 所有教职工列表分页
            handleStaffDialogPageChange: function(val) {
                this.staffDialog.pagi.currentPage = parseInt(val);
                this.getStaffDialogList();
            },
            // 所有教职工列表搜索
            staffDialogSearch: function() {
                this.staffDialog.pagi.currentPage = 1;
                this.getStaffDialogList();
            },
            // 所有教职工列表选中checkbox触发事件
            staffDialogSelect: function(val) {
                this.staffDialog.selectedData = val;
            },
            // 所有教职工列表删除已选中
            handleStaffDialogSelectedDelete: function(index, row) {
                this.staffDialog.selectedData.splice(index, 1);
            },
            // 添加教职工保存
            staffDialogSubmit: function() {
                if(this.staffDialog.selectedData.length == 0) {
                    this.$message({ message: '请选择需要添加的管理员', type: 'error'});
                    return false;
                }

                for(let i = 0; i < this.staffDialog.selectedData.length; i++) {
                    let item = this.staffDialog.selectedData[i];

                    this.editDialogInfo.adminList.push({
                        mobile: item.mobile,
                        name: item.name,
                        memberId: item.memberId
                    });
                }

                this.editDialogShow = true;
                this.staffDialogShow = false;
            },                   
            // 保存编辑
            editDialogSubmit: function(formName) {
                if(this.editDialogInfo.submitLoading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid)=>{
                     if(valid){
                        this.editDialogInfo.submitLoading = true;

                        let content = {
                            id: this.editDialogInfo.id || 0,
                            type: 1,
                            channelId: this.editDialogInfo.channelId,
                            status: this.editDialogInfo.status,
                            account: this.editDialogInfo.account,
                            password: this.editDialogInfo.password,
                            adminList: this.editDialogInfo.adminList
                        }

                        let params = {
                            content: JSON.stringify(content)
                        };

                        channelSchoolUserSave(params).then(res=>{
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.editDialogInfo.submitLoading = false;

                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存成功！', type: 'success' });
                                this.editDialogShow = false;
                                this.getList();
                            }
                        }).catch(error => {
                            this.editDialogInfo.submitLoading = false;
                            this.$message({ message: '网络异常！保存失败！', type: 'error'});
                        });
                     }else{
                         return false;
                     }
                });
            }
        },
        mounted() {
            that = this;

            this.getList();
            this.getChannelList();
        }
    }
</script>

<style lang="scss">
    .account-admin{

        .table-left,
        .table-right{
            position: relative;

            .overflow{
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .crumbs{
                position: absolute;
                z-index: 3;
                top: -14px;
                left: 0;
            }

            .el-input{
                width: 200px;
                font-size: 12px;
                
                .el-input__inner {
                    height: 36px;
                    background: #FFFFFF;
                    border: none;
                    border: 1px solid #E5E5E5;
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

            .el-button--primary{
                padding: 2px 14px;
            }

            .el-pagination{
                padding: 20px 0;
            }
        }

        .table{
            height: 100%;

            .el-table{
                height: 100%;
            }

            thead{
                /*display: none;*/
            }
        } 

        .el-dialog__wrapper,
        .el-table__body-wrapper{
            height: calc(100% - 40px);
            overflow-x: hidden;
            overflow-y: auto;

            .el-dialog{
                height: 70%;

                .el-dialog__body{
                    padding-top: 15px;
                    height: calc(100% - 132px);

                    .dialog-table{
                        height: 100%;

                        .dialog-left{
                            position: relative;
                            float: left;
                            width: 50%;
                            height: 100%;
                            border: 1px solid #eee;

                            .table-search{
                                position: absolute;
                                z-index: 3;
                                top: 2px;
                                right: 15px;

                                .el-input{
                                    width: 250px;
                                }
                            }
                        }

                        .dialog-middle{
                            position: relative;
                            float: left;
                            width: 100px;
                            height: 100%;

                            .shift{
                                position: absolute;
                                z-index: 3;
                                top: 50%;
                                left: 50%;
                                -webkit-transform: translate3d(-50%, -50%, 0);
                                        transform: translate3d(-50%, -50%, 0);

                                .icon{
                                    display: block;
                                    width: 60px;
                                    height: 60px;
                                    font-size: 16px;
                                    color: #fff;
                                    line-height: 60px;
                                    text-align: center;
                                    border-radius: 4px;
                                    background: #18c79c;
                                }

                                .text{
                                    display: block;
                                    margin-top: 6px;
                                    font-size: 14px;
                                    line-height: 22px;
                                    color: #333;
                                    text-align: center;
                                }
                            }
                        }

                        .dialog-right{
                            position: relative;
                            float: right;
                            width: 50%;
                            height: 100%;
                            border: 1px solid #eee;
                            border-left: none;

                            .table-title{
                                position: absolute;
                                z-index: 3;
                                top: 0;
                                left: 0;
                                color: #000;
                                line-height: 40px;
                                padding-left: 15px;
                            }

                            .table .el-table .el-table__body-wrapper .el-table__body tbody tr{
                                padding-left: 20px;

                                td{
                                    padding-left: 20px;

                                    .cell {
                                        padding: 10px 0 10px 0;
                                    }
                                }
                            }

                        }

                        .table{
                            .el-table__header-wrapper{
                                .el-table__header{
                                    thead{
                                        display: block;
                                    }
                                }
                            }

                            .el-table__body-wrapper{
                                .el-table__body{
                                    .el-table__row{
                                        .el-table-column--selection{
                                            .cell{
                                                padding-right: 20px;
                                                text-overflow: initial;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }        

        .w80{
            width: 80%;
            margin-left: 5%;
        }

        .height-auto{
            height: auto !important;
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
</style>

