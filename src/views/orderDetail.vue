<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/order' }">订单管理</el-breadcrumb-item>
                        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" v-loading.fullscreen.lock="ready">
                        <el-form-item label="订单号">
                            <div class="form-content">
                                <p class="text">{{ form.orderTradeId }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="商品名称">
                            <div class="form-content">
                                <p class="text">{{ proName }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="商品图片">
                            <div class="form-content">
                                <img :src="pic">
                            </div>
                        </el-form-item>
                        <el-form-item label="单价">
                            <div class="form-content">
                                <p class="text">￥{{ form.price }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="数量">
                            <div class="form-content">
                                <p class="text">{{ form.number }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="订单总价" class="priceButton">
                            <div class="form-content">
                                <p class="text">￥{{ form.totalPrice }}</p>
                                <el-button v-if="false" type="primary" size="small" @click.native="changeTotalPrice">修改总价</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="下单时间">
                            <div class="form-content">
                                <p class="text">{{ form.createdDate }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="付款时间">
                            <div class="form-content">
                                <p class="text">{{ form.payDate }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="付款方式">
                            <div class="form-content">
                                <p class="text">{{ form.payType }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="状态">
                            <div class="form-content">
                                <p class="text">{{ form.statusStr }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item class="line">
                            <div class="lineBox"></div>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <div class="form-content">
                                <p class="text">{{ form.mobile }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="收货人姓名">
                            <div class="form-content">
                                <p class="text">{{ form.memberName }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <div class="form-content">
                                <p class="text">{{ form.memberAddress }} 公里</p>
                            </div>
                        </el-form-item>
                        <el-form-item class="line">
                            <div class="lineBox"></div>
                        </el-form-item>
                        <el-form-item label="快递公司">
                            <div class="form-content">
                                <p class="text">{{ form.expressCompany }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="快递单号">
                            <div class="form-content">
                                <p class="text">{{ form.expressNumber }}</p>
                            </div>
                        </el-form-item>
                    </el-form>
                </section>

                
                <el-dialog title="修改总价" :visible.sync="priceDialogShow" :modal-append-to-body="false">
                    <section class="formation">

                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="80px" :model="price">
                            <el-form-item label="原价格">
                                <P>￥{{form.totalPrice}}</P>
                            </el-form-item>
                            <el-form-item label="修改后的价格" prop="changedPrice">
                                <el-input v-model="price.changedPrice"></el-input>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" class="button-cancle" @click.native="priceDialogShow = !priceDialogShow">取 消</el-button>
                        <el-button type="primary" :loading="loading" :disabled="!price.changedPrice" @click.native="submitForm('ruleForm')">确 定</el-button>
                    </span>
                </el-dialog>


            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { orderDetail, changeTotalPrice } from '../api/api';

    export default {
        data() {
            return {
                ready: true,
                labelPosition: 'right',
                id: this.$route.query.id,
                form: {},
                proName: '',
                pic: '',
                price: {
                    changedPrice: ''
                },
                rules: {
                    changedPrice: [
                        { required: true, message: '*请输入快递单号', trigger: 'blur' }
                    ],
                },
                priceDialogShow: false,
                loading: false,
            };
        },
        methods: {
            getMemberDetail: function() {
                let param = { 'id': this.id };

                orderDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {

                        if(data.detail.commodityId == 1 ){
                            this.proName = '悬挂式智能后视镜';
                            this.pic = '../../static/EH330_index.png'
                        }else if(data.detail.commodityId == 2){
                            this.proName = '通用型智能后视镜'
                            this.pic = '../../static/M6P_index.png'
                        }else if(data.detail.commodityId == 3){
                            this.proName = '流媒体智能后视镜'
                            this.pic = '../../static/V92_index.png'
                        }else if(data.detail.commodityId == 4){
                            this.proName = '便携式智能后视镜'
                            this.pic = '../../static/JY801_index.png'
                        }

                        this.form = data.detail;
                        this.ready = false;
                    }
                });
            },
            changeTotalPrice() {
                this.priceDialogShow = true;
            }
        },
        mounted() {
            this.getMemberDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .line{
        background-color: #E5E5E5;
    }
    .lineBox{
        height: 1px;
    }
    .priceButton{
        .el-form-item__content{
            .form-content{
                .text{
                    float: left;
                }
                .el-button{
                    float: left;
                    margin-left: 20px;
                }
            }
        }
    }
</style>
