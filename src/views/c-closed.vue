<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>内测用户</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="手机号">
                            <el-input v-model="searchForm.mobile" size="small" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="searchForm.name" size="small" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="handleUpload()">批量导入</el-button>
                    <el-button type="primary" size="small" class="btn-add button-add" icon="plus" @click.native="handleAdd(1)">添加</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="手机账号">
                            <template scope="scope"><p>{{ scope.row.objectId }}</p></template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template scope="scope"><p>{{ scope.row.content }}</p></template>
                        </el-table-column>
                        <el-table-column label="加入内测账户时间">
                            <template scope="scope"><p>{{ scope.row.authorName }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleAdd(1, scope.$index, scope.row)">编辑</el-button>
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

                <el-dialog title="编辑内测账号" :visible.sync="dialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="80px" :model="dialogInfo">
                            <el-form-item label="手机账号" prop="account">
                                <el-input v-model="dialogInfo.account"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="dialogInfo.name"></el-input>
                            </el-form-item>
                            <el-form-item label="用户分类">
                                <el-select v-model="dialogInfo.classify" placeholder="请选择">
                                    <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { dynamicList, dynamicSetTags, dynamicSetThemes, dynamicDelete, dynamicSetHot } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                searchForm: {
                    mobile: '',
                    name: ''
                },
                tableData: [],
                tableloading: true,

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },
                classifyOptions:[
                    {
                        value:'0',
                        label:'内部'
                    },
                    {
                        value:'1',
                        label:'代理'
                    },
                    {
                        value:'2',
                        label:'内测'
                    },
                    {
                        value:'3',
                        label:'一般'
                    },
                    {
                        value:'4',
                        label:'特殊'
                    }
                ],
                dialogInfo:{
                    account: '',
                    school: '',
                    name: '',
                    classify: '2'
                },
                dialogShow: false,
                dialogLoading: false,
                id: '',
                index: '',
                rules: {
                    mobile: [
                        { required: true, message: '*请输入手机账号', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '*请输入姓名', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getClosedList();
            },
            linkTo: function(url) {
                this.$router.push({ path: url });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getClosedList();
            },
            getClosedList: function() {
                this.tableloading = true;

                let param = {
                    'mobile': this.searchForm.mobile,
                    'name': this.searchForm.name,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                dynamicList(param).then(res => {
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

                        this.themeOptions = data.themeList;
                    }
                });
            },

            // 批量导入
            handleUpload: function() {

            },

            // 添加内测用户
            handleAdd: function(type, inde, row) {
                this.dialogShow = true;

                if(type == 0) {
                    // edit
                } else {
                    // add
                }
            },

            
        },
        mounted() {
            this.getClosedList();
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
</style>

<style lang="scss" scoped="">
    .button-add{
        margin-right: 15px;
    }
</style>

