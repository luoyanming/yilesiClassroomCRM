<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/dynamic' }">动态管理</el-breadcrumb-item>
                        <el-breadcrumb-item>热门动态</el-breadcrumb-item>                        
                    </el-breadcrumb>

                    <el-button type="primary" size="small" class="button-default" @click.native="historyBack">返回</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="序号">
                            <template scope="scope"><p>{{ scope.row.objectId }}</p></template>
                        </el-table-column>
                        <el-table-column label="标题内容">
                            <template scope="scope"><p>{{ scope.row.content }}</p></template>
                        </el-table-column>
                        <el-table-column label="图片" width="120">
                            <template scope="scope"><p><img :src="scope.row.albumPhoto"></p></template>
                        </el-table-column>
                        <el-table-column label="作者昵称">
                            <template scope="scope"><p>{{ scope.row.authorName }}</p></template>
                        </el-table-column>
                        <el-table-column label="点赞数">
                            <template scope="scope"><p>{{ scope.row.likeNum }}</p></template>
                        </el-table-column>
                        <el-table-column label="评论数">
                            <template scope="scope"><p>{{ scope.row.commentNum }}</p></template>
                        </el-table-column>
                        <el-table-column label="阅读数">
                            <template scope="scope"><p>{{ scope.row.readNum }}</p></template>
                        </el-table-column>
                        <el-table-column label="发布日期">
                            <template scope="scope"><p>{{ scope.row.time }}</p></template>
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
    import { dynamicHotList, dynamicCancleHot } from '../api/api';
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
                this.getHotDynamicList();
            },
            historyBack: function() {
                this.$router.go(-1);
            },
            getHotDynamicList: function() {
                this.tableloading = true;

                let param = {
                    'content': '',
                    'date': '',
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                dynamicHotList(param).then(res => {
                    this.tableloading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        if(data.momentList.length == 0) {
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.momentList;
                        this.pagi.pageTotal = data.totalNum/this.pagi.pageSize + 1;
                        this.pagi.total = data.totalNum;
                        this.noPagi = false;
                    }
                });
            },
            handleCancleHot: function(index, row) {
                this.$confirm('确定取消该热门动态？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'objectId': row.objectId };

                    dynamicCancleHot(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '您已成功取消该热门用户！', type: 'success'});
                            this.tableData.splice(index, 1);
                            this.getHotDynamicList();
                        }
                    });
                }).catch(() => {
                       
                });
            }
        },
        mounted() {
            this.getHotDynamicList();
        }
    }
</script>

<style lang="scss" scoped>

</style>
