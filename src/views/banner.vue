<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>banner管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="标题">
                            <el-input v-model="searchForm.title" size="small" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" @click.native="linkTo('/bannerAdd')">新增banner</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="标题">
                            <template scope="scope"><p>{{ scope.row.title }}</p></template>
                        </el-table-column>
                        <el-table-column label="封面">
                            <template scope="scope"><p><img class="pic" :src="scope.row.pic"></p></template>
                        </el-table-column>
                        <el-table-column label="上传日期">
                            <template scope="scope"><p>{{ scope.row.createdDateStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="排序">
                            <template scope="scope"><p>{{ scope.row.sortOrder }}</p></template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template scope="scope">
                                <p v-if="scope.row.status == 1" :class="{colorOrange: scope.row.statusStr === '进行中'}">{{ scope.row.statusStr }}</p>
                                <p v-if="scope.row.status == 0" >{{ scope.row.statusStr }}</p>
                                <p v-if="scope.row.status ==-1" >{{ scope.row.statusStr }}</p>
                            </template>
                        </el-table-column> 
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">修改</el-button>
                                <el-button size="small" class="button-link" v-if="scope.row.status == 1" @click.native="offShelves(scope.$index, scope.row)">下架</el-button>
                                <el-button size="small" class="button-link" v-if="scope.row.status == 0" @click.native="onShelves(scope.$index, scope.row)">上架</el-button>
                                <el-button size="small" class="button-link" v-if="scope.row.status == -1" @click.native="onShelves(scope.$index, scope.row)">上架</el-button>
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

                <el-dialog title="上架" :visible.sync="bannerDialogShow" :modal-append-to-body="false">
                    <h4 class="dialog-title">请选择排序</h4>
                    <section class="formation">
                        <el-form label-width="0" class="demo-ruleForm">
                            <el-form-item>
                                <el-select v-model="bannerOrder" placeholder="请选择">
                                    <el-option
                                    v-for="item in onShelvesNumber"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" class="button-cancle" @click.native="bannerDialogShow = !bannerDialogShow">取 消</el-button>
                        <el-button type="primary" :loading="bannerLoading" @click.native="submitBanner()">确 定</el-button>
                    </span>
                </el-dialog>

            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { BannerList, offShelvesBanner, deleteBanner, onShelvesBanner } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                searchForm: {
                    title: ''
                },
                tableData: [],
                tableloading: true,

                id:'',
                index:'',
                bannerOrder: '',
                bannerDialogShow: false,
                bannerLoading: false,

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    total: '',
                    pageTotal: ''
                },
                onShelvesNumber: ''
            };
        },
        methods: {
            onSearchSubmit() {
                this.pagi.currentPage = 1;
                this.getBannerList();
            },
            linkTo(url) {
                this.$router.push({ path: url });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getBannerList();
            },
            getBannerList() {
                this.tableloading = true;

                let param = {
                    'title': this.searchForm.title,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                BannerList(param).then(res => {
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
                        if(data.onShelvesNumber == 0){
                            this.onShelvesNumber = 1;
                        }else{
                            this.onShelvesNumber = data.onShelvesNumber + 1;
                        }
                        this.pagi.total = data.dataTotal;
                        this.pagi.pageTotal = data.pageTotal/this.pagi.pageSize + 1;
                        this.noPagi = false;
                    }
                });
            },
            // 查看详情
            handleDetail(index, row) {
                this.$router.push({ path: '/bannerAdd', query: { id: row.id } });
            },
            // 下架banner
            offShelves(index, row) {
                this.$confirm('确定下架该banner？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 
                        'id': row.id
                    };

                    offShelvesBanner(param).then(res => {
                        let { msg, code, data } = res;

                        if (code !== 0) {
                            this.$message({ message: msg, type: 'error' });
                        } else {
                            this.$message({ message: '下架成功', type: 'success' });
                            this.tableData[index].status = -1;
                            this.tableData[index].statusStr = '已下架';
                            this.onShelvesNumber -= 1;
                            this.bannerOrder = 1;
                        }
                    });
                }).catch(() => {

                });
            },
            // 上架banner
            onShelves(index, row) {
                this.bannerDialogShow = true;
                this.id = row.id;
                this.index = index;
            },
            // 上架banner排序
            submitBanner() {
                this.bannerLoading = true;

                let param = {
                    'id': this.id,
                    'order': this.bannerOrder
                };

                onShelvesBanner(param).then(res => {
                    this.bannerLoading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.bannerDialogShow = false;
                        this.$message({ message: '上架成功！', type: 'success'});
                        this.onShelvesNumber += 1;
                        this.bannerOrder = 1;
                        this.tableData[this.index].status = 1;
                        this.tableData[this.index].statusStr = '进行中';
                        this.tableData[this.index].sortOrder = this.bannerOrder;
                    }
                });
            },
            // 删除
            handleDelete(index, row) {
                this.$confirm('确定删除该banner？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   let param = {
                        'id': row.id
                    };

                    deleteBanner(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '删除成功', type: 'success'});
                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() => {

                });
            },
        },
        mounted() {
            this.getBannerList();
        }
    }
</script>

<style lang="scss">
    .el-message-box{
        height: auto !important;
    }
    .el-dialog .formation .el-form .el-form-item .el-form-item__content{
        padding-left: 0 !important;
    }
    .pic{
        display: inline-block;
        width: 120px;
    }
</style>

