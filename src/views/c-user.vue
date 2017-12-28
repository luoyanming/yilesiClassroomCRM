<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="账号">
                            <el-input v-model="searchForm.account" size="small" placeholder="请输入账号"></el-input>
                        </el-form-item>
                        <el-form-item label="用户分类">
                            <el-select v-model="searchForm.classify" placeholder="请选择">
                                <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用户状态">
                            <el-select v-model="searchForm.status" placeholder="请选择">
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>

                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="手机账号">
                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                        </el-table-column>
                        <el-table-column label="学校账号">
                            <template scope="scope"><p>{{ scope.row.schoolNumber }}</p></template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="用户分类">
                            <template scope="scope">
                                <p v-if="scope.row.type == 1">一般</p>
                                <p v-else-if="scope.row.type == 2">内部</p>
                                <p v-else-if="scope.row.type == 3">代理</p>
                                <p v-else-if="scope.row.type == 4">内测</p>
                                <p v-else-if="scope.row.type == 5">特殊</p>
                                <p v-else></p>
                            </template>
                        </el-table-column>
                        <el-table-column label="用户状态">
                            <template scope="scope"><p>{{ scope.row.activeStatusStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

                
                <el-dialog title="编辑用户" :visible.sync="editDialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="editInfo">
                            <el-form-item label="手机账号" prop="account">
                                <el-input v-model="editInfo.account" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="学校账号" prop="school">
                                <el-input v-model="editInfo.school" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="editInfo.name"></el-input>
                            </el-form-item>
                            <el-form-item label="用户分类" prop="classify">
                                <el-select v-model="editInfo.classify" placeholder="请选择">
                                    <el-option v-for="item in classifyOptions" :label="item.label" :value="item.value"></el-option>
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
    import { memberList, memberEdit } from '../api/api';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    account: '',
                    classify: '',
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
                classifyOptions:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'2',
                        label:'内部'
                    },
                    {
                        value:'3',
                        label:'代理'
                    },
                    {
                        value:'4',
                        label:'内测'
                    },
                    {
                        value:'1',
                        label:'一般'
                    },
                    {
                        value:'5',
                        label:'特殊'
                    }
                ],
                statusOptions:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'1',
                        label:'活跃'
                    },
                    {
                        value:'2',
                        label:'不活跃'
                    }
                ],
                editInfo:{
                    id: '',
                    index: '',
                    account: '',
                    school: '',
                    name: '',
                    classify: ''
                },
                editDialogShow: false,
                dialogLoading: false,
                rules: {
                    name: [
                        { required: true, message: '*请输入姓名', trigger: 'blur' }
                    ],
                    classify: [
                        { required: true, message: '*请选择分类', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            onSearchSubmit() {
                this.pagi.currentPage = 1;

                this.getUserList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getUserList();
            },
            getUserList() {
                this.tableloading = true;

                let memberListParam = {
                    'mobile': this.searchForm.account,
                    'type': this.searchForm.classify,
                    'activeStatus': this.searchForm.status,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                memberList(memberListParam).then(res => {
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
                    this.$message({ message: '网络异常！获取用户列表失败！', type: 'error'});
                });
            },
            // 编辑
            handleEdit(index, row) {
                this.editDialogShow = true;

                setTimeout(function() {
                    that.$refs['ruleForm'].resetFields();

                    that.editInfo.id = row.id;
                    that.editInfo.index = index;
                    that.editInfo.account = row.mobile;
                    that.editInfo.school = row.schoolNumber;
                    that.editInfo.name = row.name;
                    that.editInfo.classify = ''+ row.type +'';
                }, 1);
            },
            // 保存
            submitForm(formName) {
                 this.$refs[formName].validate((valid)=>{
                     if(valid){
                        this.dialogLoading = true;

                        let params = {
                             'id': this.editInfo.id,
                             'name': this.editInfo.name,
                             'type': this.editInfo.classify
                        };

                        memberEdit(params).then(res=>{
                            this.dialogLoading = false;
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存用户信息成功！', type: 'success' });
                                this.tableData[this.editInfo.index].name = this.editInfo.name;
                                this.tableData[this.editInfo.index].type = this.editInfo.classify;
                                this.editDialogShow = false;
                            }
                        });
                     }else{
                         return false;
                     }
                 }).catch(error => {
                    this.dialogLoading = false;
                    this.$message({ message: '网络异常！保存用户信息失败！', type: 'error'});
                });
            }
           
        },
        mounted() {
            that = this;
            this.getUserList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

