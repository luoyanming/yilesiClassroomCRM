<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="渠道商">
                    <el-input v-model="searchForm.name" size="small" placeholder="请输入渠道商"></el-input>
                </el-form-item>
                <el-form-item label="渠道状态">
                    <el-select v-model="searchForm.status" placeholder="请选择">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
        
            <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd(0)">新增渠道</el-button>
        </section>

        <section class="table">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="渠道商">
                    <template scope="scope"><p>{{ scope.row.name }}</p></template>
                </el-table-column>
                <el-table-column label="渠道建立时间">
                    <template scope="scope"><p>{{ scope.row.createdDateStr }}</p></template>
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        <p v-if="scope.row.status == 0">解除</p>
                        <p v-if="scope.row.status == 1">正常</p>
                    </template>
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

        <el-dialog :title="dialogInfo.type == 0 ? '新增渠道' : '渠道编辑'" :visible.sync="dialogShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                    <el-form-item label="渠道商" prop="name">
                        <el-input v-model="dialogInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialogInfo.status" placeholder="请选择">
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
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
</template>

<script>
    import { Message } from 'element-ui';
    import { channelList, channelSave } from '../api/api';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    name: '',
                    status: ''
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
                statusOptions:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'解除'
                    },
                    {
                        value:'1',
                        label:'正常'
                    }
                ],
                dialogInfo: {
                    type: '',
                    id: '',
                    index: '',
                    name: '',
                    status: ''
                },
                dialogShow: false,
                dialogLoading: false,
                rules: {
                    name: [
                        { required: true, message: '*请输入渠道商', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '*请选择状态', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getChannelList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getChannelList();
            },
            getChannelList: function() {
                this.tableloading = true;

                let param = {
                    'name': this.searchForm.name,
                    'status': this.searchForm.status,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                channelList(param).then(res => {
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
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取渠道列表失败！', type: 'error'});
                });
            },

            // 添加、编辑内测用户
            handleAdd: function(type, index, row) {
                this.dialogShow = true;
                this.dialogInfo.type = type;

                setTimeout(function() {
                    that.$refs['ruleForm'].resetFields();

                    if(type == 0) {
                        // add
                        that.dialogInfo.id = '';
                        that.dialogInfo.index = '';
                        that.dialogInfo.name = '';
                        that.dialogInfo.status = '1';
                    } else {
                        // edit
                        that.dialogInfo.id = row.id;
                        that.dialogInfo.index = index;
                        that.dialogInfo.name = row.name;
                        that.dialogInfo.status = ''+ row.status +'';
                    }
                }, 1);
            },

            // 提交用户信息
            submitForm: function(formName) {
                if(this.dialogLoading) {
                    return false;
                }
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dialogLoading = true;

                        let params = {
                            'id': this.dialogInfo.id,
                            'name': this.dialogInfo.name,
                            'status': this.dialogInfo.status
                        };

                        channelSave(params).then(res=>{
                            this.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存渠道信息成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getChannelList();
                            }
                        }).catch(error => {
                            this.dialogLoading = false;
                            this.$message({ message: '网络异常！保存渠道信息失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });
            }
        },
        mounted() {
            that = this;
            this.getChannelList();
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

