<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>卡定位日志</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="MAC号">
                    <el-input v-model="searchForm.code" size="small"></el-input>
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

    export default {
        data() {
            return {
                searchForm: {
                    code: ''
                }
            };
        },
        methods: {
            handleFeedbackExport: function() {
                if(!this.searchForm.code) {
                    this.$message({ message: '请输入MAC号！', type: 'error'});
                    return false;
                }

                location.href = uploadPath + '/ajax/log/export/attendance?code=' + this.searchForm.code;
            }
        },
        mounted() {
        
        }
    }
</script>