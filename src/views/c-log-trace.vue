<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>行为轨迹日志</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="MAC号">
                    <el-input v-model="searchForm.code" size="small"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                        v-model="searchForm.startDate"
                        size="small"
                        type="date"
                        format="yyyy-MM-dd"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                        v-model="searchForm.endDate"
                        size="small"
                        type="date"
                        format="yyyy-MM-dd"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <div class="button-blank">
                <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleFeedbackExport">导出Excel</el-button>
            </div>
        </section>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                searchForm: {
                    code: '',
                    startDate: new Date(),
                    endDate: new Date()
                }
            };
        },
        methods: {
            handleFeedbackExport: function() {
                if(!this.searchForm.code) {
                    this.$message({ message: '请输入MAC号！', type: 'error'});
                    return false;
                }

                this.searchForm.startDate = COMMON.formatDate(this.searchForm.startDate, '-');
                this.searchForm.endDate = COMMON.formatDate(this.searchForm.endDate, '-');

                if(this.searchForm.startDate == 'NaN-NaN-NaN') {
                    this.searchForm.startDate = '';
                }

                if(this.searchForm.endDate == 'NaN-NaN-NaN') {
                    this.searchForm.endDate = '';
                }


                if(!this.searchForm.startDate) {
                    this.$message({ message: '请选择开始时间！', type: 'error'});
                    return false;
                }
                if(!this.searchForm.endDate) {
                    this.$message({ message: '请选择结束时间！', type: 'error'});
                    return false;
                }
                if(new Date(this.searchForm.startDate).getTime() > new Date(this.searchForm.endDate).getTime()) {
                    this.$message({ message: '开始时间不能大于结束时间！', type: 'error'});
                    return false;
                }

                let startArr = this.searchForm.startDate.split('-'),
                    endArr = this.searchForm.endDate.split('-');

                if(endArr[endArr.length - 1] - startArr[startArr.length - 1] > 6) {
                    this.$message({ message: '开始时间和结束时间不能超过7天！', type: 'error'});
                    return false;
                }

                location.href = uploadPath + '/ajax/log/export/location?code=' + this.searchForm.code + '&startTime=' + this.searchForm.startDate + '&endTime=' + this.searchForm.endDate;
            }
        },
        mounted() {
        
        }
    }
</script>