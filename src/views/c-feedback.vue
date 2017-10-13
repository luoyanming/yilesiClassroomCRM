<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="起始日期">
                            <el-date-picker
                                v-model="searchForm.startDate"
                                size="small"
                                type="date"
                                format="yyyy-MM-dd"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期">
                            <el-date-picker
                                v-model="searchForm.endDate"
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

                    <el-button type="primary" size="small" class="btn-add" icon="upload2">导出</el-button>
                </section>

                <section class="table">
                    <el-table ref="multipleTable" :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="账号">
                            <template scope="scope">{{ scope.row.date }}</template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column label="意见时间">
                            <template scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column label="反馈内容" show-overflow-tooltip>
                            <template scope="scope">{{ scope.row.address }}</template>
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
                    startDate: '',
                    endDate: ''
                },
                tableData: [{
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-08',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-06',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-07',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }],
                multipleSelection: [],
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
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getFeedbackList();
            },
            getFeedbackList: function() {

            }
        },
        mounted() {
            this.getFeedbackList();
        }
    }
</script>

<style lang="scss" scoped>

</style>