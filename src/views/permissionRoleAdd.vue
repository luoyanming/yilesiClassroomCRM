<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs" v-if="!showAccountList">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/permissionRole' }">角色列表</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="!id">新增角色</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="id">编辑角色信息</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                <section class="crumbs" v-if="showAccountList">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/permissionRole' }">角色列表</el-breadcrumb-item>
                        <el-breadcrumb-item @click.native="showAccountList = !showAccountList" v-if="!id">新增角色</el-breadcrumb-item>
                        <el-breadcrumb-item @click.native="showAccountList = !showAccountList" v-if="id">编辑角色信息</el-breadcrumb-item>
                        <el-breadcrumb-item>添加作者</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation" v-if="!showAccountList">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form">
                        <el-form-item label="名称">
                            <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="form.memo" placeholder="请输入备注"></el-input>
                        </el-form-item>
                        <el-form-item label="包含人员列表">
                            <div class="form-content">
                                <div class="table">
                                    <el-table :data="form.members" stripe style="width: 100%">
                                        <el-table-column label="序号">
                                            <template scope="scope"><p>{{ scope.row.id }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="姓名">
                                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="手机号">
                                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="注册日期">
                                            <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                                        </el-table-column>
                                    </el-table>

                                    <div class="btn-table-add">
                                        <el-button size="small" class="button-link" icon="plus" @click.native="showAccountList = !showAccountList">添加人员</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="权限列表">
                            <el-checkbox-group v-model="form.privileges">
                                <el-checkbox v-for="item in privilegeOptions" :label="item.id">{{ item.name }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click.native="historyBack">取消</el-button>
                            <el-button type="primary" size="large" :loading="loading"  @click.native="onSubmit">确定</el-button>
                        </div>
                    </el-form>
                </section>

                <section style="margin-top: 20px;" v-if="showAccountList">
                    <section class="table">
                        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                            <el-table-column label="序号">
                                <template scope="scope"><p>{{ scope.row.id }}</p></template>
                            </el-table-column>
                            <el-table-column label="姓名">
                                <template scope="scope"><p>{{ scope.row.name }}</p></template>
                            </el-table-column>
                            <el-table-column label="手机号">
                                <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                            </el-table-column>
                            <el-table-column label="角色名称">
                                <template scope="scope"><p>{{ scope.row.roleName }}</p></template>
                            </el-table-column>
                            <el-table-column label="注册日期">
                                <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" class="button-link" @click="addAccount(scope.$index, scope.row)">修改为该角色</el-button>
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
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { permissionRoleDetail, permissionRoleAdd, permissionRoleModify, permissionAccountList, permissionRoleAddAccountList, permissionAccountPrivilegeList } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                labelPosition: 'right',
                id: this.$route.query.id,
                form: {
                    name: '',
                    memo: '',
                    members: [],
                    privileges: []
                },
                privilegeOptions: [],
                addMember: [],
                tableData: [],
                tableloading: true,
                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },
                showAccountList: false,
                loading: false
            };
        },
        methods: {
            getPrivilegeList: function() {
                permissionAccountPrivilegeList({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.privilegeOptions = data.list;
                    }
                });
            },
            getPermissionRoleDetail: function() {
                if(!this.id) {
                    return false;
                }

                let param = { 'id': this.id };

                permissionRoleDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.form.name = data.detail.name;
                        this.form.memo = data.detail.memo;
                        this.form.members = data.detail.members;
                        if(data.detail.privileges.length > 0) {
                            for(let i = 0; i < data.detail.privileges.length; i++) {
                                this.form.privileges.push(data.detail.privileges[i].id);
                            }
                        }
                    }
                });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getpermissionRoleAddAccountList();
            },
            getpermissionRoleAddAccountList: function() {
                if(!this.id) {
                    // add get account list
                    this.tableloading = true;

                    let param = {
                        'pageNo': this.pagi.currentPage,
                        'pageSize': this.pagi.pageSize
                    };

                    permissionAccountList(param).then(res => {
                        this.tableloading = false;

                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            if(data.list.length == 0) {
                                this.noPagi = true;
                                this.tableData = [];
                                return false;
                            }

                            this.tableData = data.list;
                            this.pagi.pageTotal = data.page.pageTotal;
                            this.pagi.total = data.page.dataTotal;
                            this.noPagi = false;
                        }
                    });
                } else {
                    // edit get account list
                    this.tableloading = true;

                    let param = {
                        'roleId': this.id,
                        'pageNo': this.pagi.currentPage,
                        'pageSize': this.pagi.pageSize
                    };

                    permissionRoleAddAccountList(param).then(res => {
                        this.tableloading = false;

                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            if(data.list.length == 0) {
                                this.noPagi = true;
                                this.tableData = [];
                                return false;
                            }

                            this.tableData = data.list;
                            this.pagi.pageTotal = data.page.pageTotal;
                            this.pagi.total = data.page.dataTotal;
                            this.noPagi = false;
                        }
                    });
                }
            },
            addAccount: function(index, row) {
                if(this.addMember.length > 0) {
                    for(let i = 0; i < this.addMember.length; i++) {
                        if(this.addMember[i].id == row.id) {
                            this.$message({ message: '该账号已添加', type: 'error'});
                            return false;
                        }
                    }
                }

                this.addMember.push(row);
                this.form.members.push(this.tableData[index]);
                
                this.showAccountList = false;
            },
            historyBack: function() {
                this.$router.go(-1);
            },
            onSubmit: function() {
                if(!COMMON.checkNull(this.form.name)) {
                    this.$message({ message: '请输入名称！', type: 'error'});
                    return false;
                }
                if(!COMMON.checkNull(this.form.memo)) {
                    this.$message({ message: '请输入备注！', type: 'error'});
                    return false;
                }
                if(this.form.privileges.length == 0) {
                    this.$message({ message: '请选择权限！', type: 'error'});
                    return false;
                }

                let addMemberIdsArr = [];
                if(this.addMember.length > 0) {
                    for(let i = 0; i < this.addMember.length; i++) {
                        addMemberIdsArr.push(this.addMember[i].id);
                    }
                }

                if(!this.id) {
                    // add role
                    this.loading = true;

                    let param = {
                        'name': this.form.name,
                        'addMemberIds': addMemberIdsArr.join(','),
                        'memo': this.form.memo,
                        'privilegeIds': this.form.privileges.join(',')
                    };

                    permissionRoleAdd(param).then(res => {
                        this.loading = false;

                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '角色编辑成功', type: 'success'});
                            this.$router.push({ path: '/permissionRole' });
                        }
                    });
                } else {
                    // edit role
                    this.loading = true;

                    let param = {
                        'id': this.id,
                        'name': this.form.name,
                        'addMemberIds': addMemberIdsArr.join(','),
                        'memo': this.form.memo,
                        'privilegeIds': this.form.privileges.join(',')
                    };

                    permissionRoleModify(param).then(res => {
                        this.loading = false;

                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '角色编辑成功', type: 'success'});
                            this.$router.push({ path: '/permissionRole' });
                        }
                    });
                }
            }
        },
        mounted() {
            this.getPrivilegeList();
            this.getPermissionRoleDetail();
            this.getpermissionRoleAddAccountList();
        }
    }
</script>

<style lang="scss" scoped>
    .luoym{
        .formation{
            .author{
                margin-right: 20px;
                font-size: 12px;
                color: #333;
                line-height: 40px;
            }
        }

        .btn-table-add{
            position: relative;
            z-index: 20;
            top: -2px;
            background: #FFFFFF;
            text-align: center;
            box-shadow: 0 1px 4px 0 rgba(65,86,105,0.20);
        }

        .el-checkbox-group{
            width: 350px;

            .el-checkbox{
                width: 170px;
                margin: 0 !important;
            }
        }
    }
</style>
