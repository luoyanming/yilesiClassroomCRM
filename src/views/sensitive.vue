<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>敏感信息词库</el-breadcrumb-item>
                    </el-breadcrumb>

                    <el-button type="primary" size="small" class="" @click.native="sensitiveDialogShow = !sensitiveDialogShow">新增敏感词</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="序号">
                            <template scope="scope"><p>{{ scope.row.id }}</p></template>
                        </el-table-column>
                        <el-table-column label="敏感词名称">
                            <template scope="scope"><p>{{ scope.row.keyWord }}</p></template>
                        </el-table-column>
                        <el-table-column label="过滤次数">
                            <template scope="scope"><p>{{ scope.row.filteredTime }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </section>

                <el-dialog title="新增敏感词" :visible.sync="sensitiveDialogShow" :modal-append-to-body="false">
                    <h4 class="dialog-title">请输入敏感词</h4>
                    <section class="formation">
                        <el-form label-width="0" class="demo-ruleForm">
                            <el-form-item>
                                <el-input v-model="newSensitive" placeholder="请输入敏感词"></el-input>
                            </el-form-item>
                        </el-form>
                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" class="button-cancle" @click.native="sensitiveDialogShow = !sensitiveDialogShow">取 消</el-button>
                        <el-button type="primary" :loading="submitLoading" @click.native="submitAdd()">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { sensitiveList, sensitiveAdd, sensitiveDelete } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                newSensitive: '',
                sensitiveDialogShow: false,
                tableData: [],
                tableloading: true,
                submitLoading: false
            };
        },
        methods: {
            getSensitiveList: function() {
                this.tableloading = true;

                sensitiveList({}).then(res => {
                    this.tableloading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.list;
                    }
                });
            },
            handleDelete: function(index, row) {
                this.$confirm('确定删除该敏感词？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': row.id };

                    sensitiveDelete(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '该敏感词已删除', type: 'success'});

                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() => {
                       
                });
            },
            submitAdd: function() {
                if(!COMMON.checkNull(this.newSensitive)) {
                    this.$message({ message: '请输入敏感词', type: 'error'});
                    return false;
                }

                this.submitLoading = true;

                let param = { 'keyWord': this.newSensitive };

                sensitiveAdd(param).then(res => {
                    this.submitLoading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.$message({ message: '您已成功添加敏感词！', type: 'success'});

                        this.getSensitiveList();

                        this.sensitiveDialogShow = false;
                    }
                });
            }
        },
        mounted() {
            this.getSensitiveList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

