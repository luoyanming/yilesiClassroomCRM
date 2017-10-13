<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
                    </el-breadcrumb>

                    <el-button type="primary" size="small" class="" @click.native="linkTo('/permissionRoleAdd')">新增角色</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="序号">
                            <template scope="scope"><p>{{ scope.row.id }}</p></template>
                        </el-table-column>
                        <el-table-column label="名称">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="人数">
                            <template scope="scope"><p>{{ scope.row.number }}</p></template>
                        </el-table-column>
                        <el-table-column label="备注">
                            <template scope="scope"><p>{{ scope.row.memo }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    import { permissionRoleList, permissionRoleDelete } from '../api/api';
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
                this.getPermissionRoleList();
            },
            getPermissionRoleList: function() {
                this.tableloading = true;

                let param = {
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                permissionRoleList(param).then(res => {
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
                this.$router.push({ path: '/permissionRoleDetail', query: { id: row.id } });
            },
            handleEdit: function(index, row) {
                this.$router.push({ path: 'permissionRoleAdd', query: { 'id': row.id } });
            },
            handleDelete: function(index, row) {
                this.$confirm('确定删除该角色？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': row.id };

                    permissionRoleDelete(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '角色删除成功', type: 'success'});
                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() => {
                            
                });
            }
        },
        mounted() {
            this.getPermissionRoleList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

