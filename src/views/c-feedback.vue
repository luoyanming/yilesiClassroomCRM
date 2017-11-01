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

                    <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleFeedbackExport">导出</el-button>
                </section>

                <section class="table">
                    <el-table ref="multipleTable" :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="账号">
                            <template scope="scope">{{ scope.row.mobile }}</template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column label="意见时间">
                            <template scope="scope">{{ scope.row.createdDateStr }}</template>
                        </el-table-column>
                        <el-table-column label="反馈内容">
                            <template scope="scope">{{ scope.row.contents }}</template>
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
    import { uploadPath, feedbackList, feedbackExport } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                searchForm: {
                    startDate: '',
                    endDate: ''
                },
                tableData: [],
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
            onSearchSubmit: function() {
                this.searchForm.startDate = COMMON.formatDate(this.searchForm.startDate, '-');
                this.searchForm.endDate = COMMON.formatDate(this.searchForm.endDate, '-');

                if(this.searchForm.startDate == 'NaN-NaN-NaN') {
                    this.searchForm.startDate = '';
                }

                if(this.searchForm.endDate == 'NaN-NaN-NaN') {
                    this.searchForm.endDate = '';
                }

                this.pagi.currentPage = 1;
                this.getFeedbackList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getFeedbackList();
            },
            getFeedbackList: function() {
                this.tableloading = true;

                let param = {
                    'startTime': this.searchForm.startDate,
                    'endTime': this.searchForm.endDate,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                feedbackList(param).then(res => {
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
                });
            },
            handleFeedbackExport: function() {
                let idsArr = [];
                if(this.multipleSelection && this.multipleSelection.length > 0) {
                    for(let i = 0; i < this.multipleSelection.length; i++) {
                        idsArr.push(this.multipleSelection[i].id);
                    }
                }

                location.href = uploadPath + '/ajax/member/feedback/export?startTime=' + this.searchForm.startDate + '&endTime=' + this.searchForm.endDate + '&ids=' + idsArr.join(',');
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        mounted() {
            this.getFeedbackList();
        }
    }
</script>

<style lang="scss" scoped>

</style>