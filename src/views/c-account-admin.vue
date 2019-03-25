<template>
    <div class="main-wrapper light-overscroll luoym account-admin">
        <section class="crumbs clearfix">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>admin账户管理</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd">添加管理员</el-button>
        </section>
        
        <section class="table" style="height: auto;">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="手机账号">
                    <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                </el-table-column>
                <el-table-column label="学校账号">
                    <template scope="scope"><p>{{ scope.row.schoolAccount }}</p></template>
                </el-table-column>
                <el-table-column label="管理员">
                    <template scope="scope"><p>{{ scope.row.name }}</p></template>
                </el-table-column>
                <el-table-column label="操作" v-if="canEdit">
                    <template scope="scope">
                        <el-button size="small" class="button-link" @click="handleTransfer(scope.$index, scope.row)" v-if="scope.row.roleAdmin == 0">转让权限</el-button>
                        <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.roleAdmin == 0">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </section>

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
    import { adminUserList, adminUserAdd, adminUserRemove, adminUserChange, adminUserMemberList } from '../api/api';

    let that;

    export default {
        data() {
            return {
                canEdit: false,
                tableData: [],
                tableloading: true,

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
            // 获取admin账户列表
            getList() {
                this.tableloading = true;

                let param = {};

                adminUserList(param).then(res => {
                    this.tableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.tableData = data.list || [];
                        this.canEdit = data.canEdit;
                    }
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取admin账户列表失败！', type: 'error'});
                });
            },

            //转移权限
            handleTransfer: function(index, row) {
                this.$confirm('此操作将会把总管理员账户权限全部转移到该管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        targetMemberId: row.memberId
                    }
                    
                    adminUserChange(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.$message({ message: '转移成功', type: 'success'});

                            that.getList();
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！转移失败！', type: 'error'});
                    });
                }).catch(() => {
                            
                });
            },

            //删除按钮
            handleDelete: function(index, row) {
                this.$confirm('此操作将移除该管理员账户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        memberId: row.memberId
                    }
                    
                    adminUserRemove(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.$message({ message: '移除成功', type: 'success'});

                            that.getList();
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！移除失败！', type: 'error'});
                    });
                }).catch(() => {
                            
                });
            },

            //添加管理员
            handleAdd: function() {
                this.staffDialog.searchParam = '';
                this.staffDialog.selectedData = [];
                this.staffDialogShow = true;
                this.staffDialog.submitLoading = false;

                this.getStaffDialogList();  
            },

            // 获取所有教职工列表
            getStaffDialogList: function() {
                this.staffDialog.tableLoading = true;

                let notContainIds = [];
                if(this.tableData.length > 0) {
                    for(let i = 0; i < this.tableData.length; i++) {
                        notContainIds.push(this.tableData[i].memberId);
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
                if(this.staffDialog.submitLoading) {
                    return false;
                }
                
                if(this.staffDialog.selectedData.length == 0) {
                    this.$message({ message: '请选择需要添加的管理员', type: 'error'});
                    return false;
                }

                this.staffDialog.submitLoading = true;

                let ids = [];
                for(let i = 0; i < this.staffDialog.selectedData.length; i++) {
                    ids.push(this.staffDialog.selectedData[i].memberId);
                }

                let param = {
                    'memberIds': ids.join(',')
                };

                adminUserAdd(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.staffDialog.submitLoading = false;

                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '保存成功', type: 'success'});
                        this.staffDialogShow = false;
                        this.getList();
                    }
                }).catch(error => {
                    this.staffDialog.submitLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });
            },
        },
        mounted() {
            that = this;

            this.getList();
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
    }
</style>

