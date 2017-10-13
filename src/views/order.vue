<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="订单号">
                            <el-input v-model="searchForm.orderTradeId" size="small" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称">
                            <el-select v-model="searchForm.commodityId" placeholder="全部">
                                <el-option v-for="item in product" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="searchForm.mobile" size="small" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="付款日期">
                            <el-date-picker
                                v-model="searchForm.payDate"
                                size="small"
                                type="date"
                                format="yyyy-MM-dd"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="全部">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
                        <el-table-column label="订单号">
                            <template scope="scope"><p>{{ scope.row.orderTradeId }}</p></template>
                        </el-table-column>
                        <el-table-column label="商品名称">
                            <template scope="scope"><p>{{ scope.row.commodityName }}</p></template>
                        </el-table-column>
                        <el-table-column label="单价">
                            <template scope="scope"><p>{{ scope.row.price }}</p></template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template scope="scope"><p>{{ scope.row.number }}</p></template>
                        </el-table-column>
                        <el-table-column label="订单总价">
                            <template scope="scope"><p>{{ scope.row.totalPrice }}</p></template>
                        </el-table-column>
                        <el-table-column label="下单时间">
                            <template scope="scope"><p>{{ scope.row.createdDateStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="付款时间">
                            <template scope="scope"><p>{{ scope.row.payDateTime }}</p></template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template scope="scope">
                                <p v-if="scope.row.status == 0">{{ scope.row.statusStr }}</p>
                                <p v-if="scope.row.status == 1" :class="{colorOrange: scope.row.statusStr === '已付款'}">{{ scope.row.statusStr }}</p>
                                <p v-if="scope.row.status == 2">{{ scope.row.statusStr }}</p>
                                <p v-if="scope.row.status == 3">{{ scope.row.statusStr }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="手机号">
                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" class="button-link" v-if="scope.row.status == 1" @click="sureShip(scope.$index, scope.row)">确认发货</el-button>
                                <el-button size="small" class="button-link" v-if="scope.row.status == 3" :disabled="true">已发货</el-button>
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

                
                <el-dialog title="填写快递信息" :visible.sync="orderDialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="80px" :model="expressMes">
                            <el-form-item label="快递公司" prop="company">
                                <el-input v-model="expressMes.company"></el-input>
                            </el-form-item>
                            <el-form-item label="快递单号" prop="singleNum">
                                <el-input v-model="expressMes.singleNum"></el-input>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" class="button-cancle" @click.native="orderDialogShow = !orderDialogShow">取 消</el-button>
                        <el-button type="primary" :loading="loading" :disabled="!expressMes.company || !expressMes.singleNum" @click.native="submitForm('ruleForm')">确 定</el-button>
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
                    orderTradeId: '',
                    commodityId: '',
                    mobile: '',
                    payDate: '',
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
                options:[
                    {
                        value:'0',
                        label:'未付款'
                    },
                    {
                        value:'1',
                        label:'已付款'
                    },
                    {
                        value:'2',
                        label:'付款失败'
                    },
                    {
                        value:'3',
                        label:'已发货'
                    }
                ],
                product:[
                    {
                        value:'1',
                        label:'悬挂式只能后视镜'
                    },
                    {
                        value:'2',
                        label:'通用型只能后视镜'
                    },
                    {
                        value:'3',
                        label:'流媒体智能后视镜'
                    },
                    {
                        value:'4',
                        label:'便捷式智能后视镜'
                    }
                ],
                expressMes:{
                    company: '',
                    singleNum: ''
                },
                orderDialogShow: false,
                loading: false,
                id: '',
                index: '',
                rules: {
                    company: [
                        { required: true, message: '*请输入快递公司名称', trigger: 'blur' }
                    ],
                    singleNum: [
                        { required: true, message: '*请输入快递单号', trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            onSearchSubmit() {
                this.searchForm.payDate = COMMON.formatDate(this.searchForm.payDate);

                if(this.searchForm.payDate == 'NaN-NaN-NaN') {
                    this.searchForm.payDate = '';
                }

                this.pagi.currentPage = 1;

                this.getOrderList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getOrderList();
            },
            getOrderList() {
                this.tableloading = true;

                let memberListParam = {
                    'orderTradeId': this.searchForm.orderTradeId,
                    'commodityId': this.searchForm.commodityId,
                    'mobile': this.searchForm.mobile,
                    'payDate': this.searchForm.payDate,
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
            handleDetail(index, row) {
                this.$router.push({ path: '/orderDetail', query: { id: row.id } });
            },
            // 确认发货
            sureShip(index,row) {
                this.orderDialogShow = true;
                this.id = row.id;
                this.index = index;
            },
            // 确认发货
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

