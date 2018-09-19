<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>标签分类</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleEdit('', '')">新增标签分类</el-button>
                </section>
                
                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="标签分类">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

                
                <el-dialog :title="dialogInfo.id ? '编辑标签分类' : '新增标签分类'" :visible.sync="dialogInfo.show" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                            <el-form-item label="标签分类" prop="classify">
                                <el-input v-model="dialogInfo.classify"></el-input>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="dialogInfo.loading" @click.native="submitForm('ruleForm')">保存</el-button>
                    </span>
                </el-dialog>

            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { tagsClassifyList, tagsClassifySave, tagsClassifyDelete } from '../api/api';

    let that;

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
                },
                dialogInfo:{
                    id: '',
                    index: '',
                    classify: '',
                    show: false,
                    loading: false
                },
                rules: {
                    classify: [
                        { required: true, message: '*请填写标签分类', trigger: 'blur' }
                    ]
                }          
            };
        },
        methods: {
            // 列表分页
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取用户列表
            getList() {
                this.tableloading = true;

                let param = {
                    'name': '',
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                tagsClassifyList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取标签分类列表失败！', type: 'error'});
                });
            },
            // 编辑按钮
            handleEdit(index, row) {
                this.dialogInfo.show = true;

                setTimeout(function() {
                    if(row) {
                        that.dialogInfo.id = row.id;
                        that.dialogInfo.index = index;
                        that.dialogInfo.classify = row.name;
                    } else {
                        that.dialogInfo.id = '';
                        that.dialogInfo.index = '';
                        that.dialogInfo.classify = '';                        
                    }
                }, 1);
            },

            //删除按钮
            handleDelete: function(index, row) {
                this.$confirm('此操作将永久删除该标签分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id
                    }
                    
                    tagsClassifyDelete(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.$message({ message: '删除成功', type: 'success'});

                            that.getList();
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！删除失败！', type: 'error'});
                    });
                }).catch(() => {
                            
                });                
            },
        
            // 保存编辑
            submitForm(formName) {
                this.$refs[formName].validate((valid)=>{
                     if(valid){
                        this.dialogInfo.loading = true;

                        let param = {
                             'id': this.dialogInfo.id,
                             'name': this.dialogInfo.classify
                        };

                        tagsClassifySave(param).then(res=>{
                            this.dialogInfo.loading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存标签分类成功！', type: 'success' });
                                this.dialogInfo.show = false;
                                this.getList();
                            }
                        }).catch(error => {
                            this.dialogInfo.loading = false;
                            this.$message({ message: '网络异常！保存标签分类失败！', type: 'error'});
                        });
                     }else{
                         return false;
                     }
                });
            }          
        },
        mounted() {
            that = this;

            this.getList();
        }
    }
</script>

<style lang="scss">
    .character-item{
        .el-select{
            .el-input{
                width: 100px !important;
            }
        }

        .button-add{
            line-height: 30px !important;
        }
    }
</style>

<style lang="scss" scoped>
    .character-item{
        margin-bottom: 10px;

        .el-input,
        .el-select{
            float: left;
            margin-right: 10px;
        }

        .button-remove{
            float: left;
            width: 26px;
            height: 26px;
            margin-top: 7px;
            padding: 0;
            border: 0;
            border-radius: 50%;
            min-width: auto;
            line-height: 26px !important;
        }
    }
</style>

