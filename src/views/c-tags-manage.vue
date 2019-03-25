<template>
    <div class="main-wrapper light-overscroll luoym tags-manage">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>标签管理</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="标签">
                    <el-input v-model="searchForm.name" size="small" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="标签分类">
                    <el-select v-model="searchForm.typeId" placeholder="请选择">
                        <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>

            <div class="button-blank">
                <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleEdit('', '')">新增标签</el-button>
            </div>
        </section>

        <section class="table">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="标签">
                    <template scope="scope"><p>{{ scope.row.name }}</p></template>
                </el-table-column>
                <el-table-column label="标签分类">
                    <template scope="scope"><p>{{ scope.row.typeName }}</p></template>
                </el-table-column>
                <el-table-column label="说明">
                    <template scope="scope"><p>{{ scope.row.describe }}</p></template>
                </el-table-column>
                <el-table-column label="来源">
                    <template scope="scope"><p>{{ scope.row.account }}</p></template>
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

        
        <el-dialog :title="dialogInfo.id ? '编辑标签' : '新增标签'" :visible.sync="dialogInfo.show" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                    <el-form-item label="标签" prop="name">
                        <el-input v-model="dialogInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="标签分类" prop="typeId">
                        <el-select v-model="dialogInfo.typeId" placeholder="请选择">
                            <el-option v-for="item in classifyOptions" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="说明" prop="describe">
                        <el-input type="textarea" v-model="dialogInfo.describe"></el-input>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogInfo.loading" @click.native="submitForm('ruleForm')">保存</el-button>
            </span>
        </el-dialog>            

    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { tagsClassifyList, tagsList, tagsSave, tagsDelete } from '../api/api';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    name: '',
                    typeId: ''
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
                        value:'',
                        label:'请选择'
                    }
                ],
                dialogInfo:{
                    id: '',
                    index: '',
                    name: '',
                    typeId: '',
                    show: false,
                    loading: false
                },
                rules: {
                    name: [
                        { required: true, message: '*请输入标签', trigger: 'blur' }
                    ],
                    typeId: [
                        { required: true, message: '*请选择标签分类', trigger: 'change' }
                    ],
                    describe: [
                        { required: true, message: '*请输入说明', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            // 列表搜索
            onSearchSubmit() {
                this.pagi.currentPage = 1;

                this.getList();
            },
            // 列表分页
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取用户列表
            getList() {
                this.tableloading = true;

                let param = {
                    'name': this.searchForm.name,
                    'typeId': this.searchForm.typeId,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                tagsList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取标签列表失败！', type: 'error'});
                });
            },
            // 获取标签分类列表
            getClassifyList: function() {
                let param = {
                    'name': '',
                    'pageNo': 1,
                    'pageSize': 1000
                };

                tagsClassifyList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        for(let i = 0; i < data.list.length; i++ ) {
                            this.classifyOptions.push({
                                value: '' + data.list[i].id,
                                label: data.list[i].name                              
                            })
                        }
                    }
                }).catch(error => {
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
                        that.dialogInfo.name = row.name;
                        that.dialogInfo.typeId = '' + row.typeId;
                        that.dialogInfo.describe = row.describe;
                        that.dialogInfo.loading = false;
                    } else {
                        that.dialogInfo.id = '';
                        that.dialogInfo.index = '';
                        that.dialogInfo.name = '';
                        that.dialogInfo.typeId = '';
                        that.dialogInfo.describe = '';   
                        that.dialogInfo.loading = false;                     
                    }
                }, 1);
            },
            //删除按钮
            handleDelete: function(index, row) {
                this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id
                    }
                    
                    tagsDelete(param).then(res => {
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
                if(this.dialogInfo.loading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid)=>{
                     if(valid){
                        this.dialogInfo.loading = true;

                        let param = {
                            'id': this.dialogInfo.id,
                            'name': this.dialogInfo.name,
                            'typeId': this.dialogInfo.typeId,
                            'depict': this.dialogInfo.describe
                        };

                        tagsSave(param).then(res=>{
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.dialogInfo.loading = false;

                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存标签成功！', type: 'success' });
                                this.dialogInfo.show = false;
                                this.getList();
                            }
                        }).catch(error => {
                            this.dialogInfo.loading = false;
                            this.$message({ message: '网络异常！保存标签失败！', type: 'error'});
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
            this.getClassifyList();
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

    .luoym.tags-manage .formation .el-form .el-form-item .el-form-item__content .el-textarea{
        width: 300px;
    }
    .luoym.tags-manage .el-dialog--small{
        width: 700px;
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

