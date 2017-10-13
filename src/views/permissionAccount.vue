<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>账号列表</el-breadcrumb-item>
                    </el-breadcrumb>

                    <el-button type="primary" size="small" class="" @click.native="linkTo('/permissionAccountAdd')">新增账号</el-button>
                </section>

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
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" class="button-link" @click="handleResetPassword(scope.$index, scope.row)">重置密码</el-button>
                                <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { permissionAccountList, permissionAccountResetPwd, permissionAccountDelete } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                tableData: [],
                tableloading: true,
                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                }
            };
        },
        methods: {
            linkTo: function(url) {
                this.$router.push({ path: url });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getPermissionAccountList();
            },
            getPermissionAccountList: function() {
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
            },
            handleDetail: function(index, row) {
                this.$router.push({ path: '/permissionAccountDetail', query: { id: row.id } });
            },
            handleResetPassword: function(index, row) {
                this.$confirm('确定重置该账号密码？重置后密码将改为初始密码：123456', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': row.id };

                    permissionAccountResetPwd(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '密码重置成功！', type: 'success'});
                        }
                    });
                }).catch(() => {
                            
                });
            },
            handleDelete: function(index, row) {
                this.$confirm('确定删除该账号？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': row.id };

                    permissionAccountDelete(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '账号删除成功', type: 'success'});
                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() => {
                            
                });
            }
        },
        mounted() {
            this.getPermissionAccountList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

