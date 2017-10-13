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
                            <template scope="scope"><p>{{ scope.row.orderTradeId }}</p></template>
                        </el-table-column>
                        <el-table-column label="学校账号">
                            <template scope="scope"><p>{{ scope.row.commodityName }}</p></template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template scope="scope"><p>{{ scope.row.price }}</p></template>
                        </el-table-column>
                        <el-table-column label="用户分类">
                            <template scope="scope"><p>{{ scope.row.number }}</p></template>
                        </el-table-column>
                        <el-table-column label="用户状态">
                            <template scope="scope"><p>{{ scope.row.totalPrice }}</p></template>
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
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="80px" :model="editInfo">
                            <el-form-item label="手机账号" prop="account">
                                <el-input v-model="editInfo.account"></el-input>
                            </el-form-item>
                            <el-form-item label="学校账号" prop="school">
                                <el-input v-model="editInfo.school"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="editInfo.name"></el-input>
                            </el-form-item>
                            <el-form-item label="用户分类">
                                <el-select v-model="editInfo.classify" placeholder="请选择">
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
    import { orderList, orderExpress } from '../api/api';
    import { COMMON } from '../common/js/common';

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
                statusOptions:[
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
                    account: '',
                    school: '',
                    name: '',
                    classify: ''
                },
                editDialogShow: false,
                dialogLoading: false,
                id: '',
                index: '',
                rules: {
                    account: [
                        { required: true, message: '*请输入手机账号', trigger: 'blur' }
                    ],
                    school: [
                        { required: true, message: '*请输入学校账号', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '*请输入姓名', trigger: 'blur' }
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
                    'account': this.searchForm.account,
                    'classify': this.searchForm.classify,
                    'status': this.searchForm.status,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                orderList(memberListParam).then(res => {
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
                        this.pagi.pageTotal = data.page.pageTotal;
                        this.pagi.total = data.page.dataTotal;
                        this.noPagi = false;
                    }
                });
            },
            // 编辑
            handleEdit(index,row) {
                this.editDialogShow = true;
                this.id = row.id;
                this.index = index;
            },
            // 保存
            submitForm(formName) {
                 this.$refs[formName].validate((valid)=>{
                     if(valid){

                        let params = {
                             'id': this.id,
                             'expressCompanyName': this.expressMes.company,
                             'expressNumber': this.expressMes.singleNum
                        };

                        orderExpress(params).then(res=>{
                            let { msg, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: msg, type: 'error' });
                            }else{
                                this.tableData[this.index].status = 3;
                                this.tableData[this.index].statusStr = '已发货';
                                this.orderDialogShow = false;
                            }
                        });
                     }else{
                         return false;
                     }
                 })
            }
           
        },
        mounted() {
            this.getOrderList();
        }
    }
</script>

<style lang="scss" scoped>

</style>

