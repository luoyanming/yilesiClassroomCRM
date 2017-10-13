<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>常用作者</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="昵称">
                            <el-input v-model="searchForm.nickname" size="small" placeholder="请输入昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="searchForm.name" size="small" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="searchForm.mobile" size="small" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="注册日期">
                            <el-date-picker
                                v-model="searchForm.date"
                                size="small"
                                type="date"
                                format="yyyy-MM-dd"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="序号">
                            <template scope="scope"><p>{{ scope.row.id }}</p></template>
                        </el-table-column>
                        <el-table-column label="昵称">
                            <template scope="scope"><p>{{ scope.row.nickName }}</p></template>
                        </el-table-column>
                        <el-table-column label="真实姓名">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="手机号">
                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                        </el-table-column>
                        <el-table-column label="性别" width="56">
                            <template scope="scope"><p>{{ scope.row.sex }}</p></template>
                        </el-table-column>
                        <el-table-column label="品牌">
                            <template scope="scope"><p>{{ scope.row.brand }}</p></template>
                        </el-table-column>
                        <el-table-column label="型号">
                            <template scope="scope"><p>{{ scope.row.model }}</p></template>
                        </el-table-column>
                        <el-table-column label="设备型号">
                            <template scope="scope"><p>{{ scope.row.deviceModel }}</p></template>
                        </el-table-column>
                        <el-table-column label="注册日期">
                            <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                        </el-table-column>
                        <el-table-column label="状态" width="70">
                            <template scope="scope">
                                <p v-if="scope.row.status == '正常'">正常</p>
                                <p class="color-red" v-if="scope.row.status == '已冻结'">已冻结</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" class="button-link" @click="handleFreeze(scope.$index, scope.row)" v-if="scope.row.status == '正常'">冻结</el-button>
                                <el-button size="small" class="button-link color-orange" @click="handleUnFreeze(scope.$index, scope.row)" v-if="scope.row.status == '已冻结'">解除冻结</el-button>
                                <el-button size="small" class="button-link" @click="handleSetHot(scope.$index, scope.row)">设为热门</el-button>
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
    import { memberList, memberChangeStatus, memberCancleHot, memberSetHot } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                searchForm: {
                    nickname: '',
                    name: '',
                    mobile: '',
                    date: ''
                },
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
            onSearchSubmit: function() {
                this.searchForm.date = COMMON.formatDate(this.searchForm.date);

                if(this.searchForm.date == 'NaN-NaN-NaN') {
                    this.searchForm.date = '';
                }

                this.pagi.currentPage = 1;

                this.getMemberList();
            },
            linkTo: function(url) {
                this.$router.push({ path: url });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getMemberList();
            },
            getMemberList: function() {
                this.tableloading = true;

                let memberListParam = {
                    'nickName': this.searchForm.nickname,
                    'name': this.searchForm.name,
                    'mobile': this.searchForm.mobile,
                    'createdDate': this.searchForm.date,
                    'usual': 1,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                memberList(memberListParam).then(res => {
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
                this.$router.push({ path: '/userDetail', query: { id: row.id } });
            },
            handleEdit: function(index, row) {
                this.$router.push({ path: '/userAdd', query: { id: row.id } });
            },
            handleFreeze: function(index, row) {
                this.changeFreeze(row.id, 1, index);
            },
            handleUnFreeze: function(index, row) {
                this.changeFreeze(row.id, 0, index);
            },
            changeFreeze: function(id, status, index) {
                let confirmStr = '';
                if(status == 1) {
                    confirmStr = '确定冻结用户账号？';
                } else if(status == 0) {
                    confirmStr = '确定解除冻结用户账号？';
                }

                this.$confirm(confirmStr, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': id, 'status': status };

                    memberChangeStatus(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            if(status == 0) {
                                this.tableData[index].status = '正常';
                            } else if(status == 1) {
                                this.tableData[index].status = '已冻结';
                            }
                        }
                    });
                }).catch(() => {
                       
                });
            },
            handleSetHot: function(index, row) {
                this.$confirm('确定设为热门用户？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'memberId': row.id };

                    memberSetHot(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '您已成功将该用户设为热门用户！', type: 'success'});
                        }
                    });
                }).catch(() => {
                       
                });
            }
        },
        mounted() {
            this.getMemberList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

