<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统日志</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <section class="table" style="margin-top: 20px;">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="序号" width="65px">
                    <template scope="scope"><p>{{ scope.row.id }}</p></template>
                </el-table-column>
                <el-table-column label="操作时间" width="150px">
                    <template scope="scope"><p>{{ scope.row.createdDateStr }}</p></template>
                </el-table-column>
                <el-table-column label="操作者" width="100px">
                    <template scope="scope"><p>{{ scope.row.account }}</p></template>
                </el-table-column>
                <el-table-column label="操作内容">
                    <template scope="scope"><p>{{ scope.row.content }}</p></template>
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
</template>

<script>
    import { Message } from 'element-ui';
    import { logList } from '../api/api';

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
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getSystemLogList();
            },
            getSystemLogList: function() {
                this.tableloading = true;

                let param = {
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                logList(param).then(res => {
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
                        if(data.total % this.pagi.pageSize == 0) {
                            this.pagi.pageTotal = data.total/this.pagi.pageSize;
                        } else {
                            this.pagi.pageTotal = parseInt(data.total/this.pagi.pageSize) + 1;
                        }
                        this.pagi.total = data.total;
                        this.noPagi = false;
                    }
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取系统日志列表失败！', type: 'error'});
                });
            }
        },
        mounted() {
            this.getSystemLogList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

