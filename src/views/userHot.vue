<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>热门用户</el-breadcrumb-item>                        
                    </el-breadcrumb>

                    <el-button type="primary" size="small" class="button-default" @click.native="historyBack">返回</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="姓名">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="昵称">
                            <template scope="scope"><p>{{ scope.row.nickName }}</p></template>
                        </el-table-column>
                        <el-table-column label="手机号">
                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                        </el-table-column>
                        <el-table-column label="性别" width="56">
                            <template scope="scope"><p>{{ scope.row.sex }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link color-orange" @click="handleCancleHot(scope.$index, scope.row)">取消热门</el-button>
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
    import { memberHotList, memberCancleHot } from '../api/api';
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
                this.getHotMemberList();
            },
            historyBack: function() {
                this.$router.go(-1);
            },
            getHotMemberList: function() {
                this.tableloading = true;

                let param = {
                    'nickName': '',
                    'name': '',
                    'mobile': '',
                    'createdDate': '',
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                memberHotList(param).then(res => {
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
            handleCancleHot: function(index, row) {
                this.$confirm('确定取消该热门用户？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'memberId': row.id };

                    memberCancleHot(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '您已成功取消该热门用户！', type: 'success'});
                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() => {
                       
                });
            }
        },
        mounted() {
            this.getHotMemberList();
        }
    }
</script>

<style lang="scss" scoped>

</style>
