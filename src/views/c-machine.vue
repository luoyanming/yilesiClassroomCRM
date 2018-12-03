<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>综述</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <section class="card-list clearfix" v-loading.body="loading">
            <article class="list-item">
                <h4>卖出卡总量</h4>
                <router-link to="/control"><el-button size="small" class="button-link">查看详情></el-button></router-link>
                <p>{{ cardNum }}<span>张</span></p>
            </article>
            <article class="list-item">
                <h4>持卡人数</h4>
                <router-link to="/control"><el-button size="small" class="button-link">查看详情></el-button></router-link>
                <p>{{ holdNum }}<span>人</span></p>
            </article>
            <article class="list-item">
                <h4>渠道数</h4>
                <router-link to="/channel"><el-button size="small" class="button-link">查看详情></el-button></router-link>
                <p>{{ channelNum }}<span>个</span></p>
            </article>
            <article class="list-item">
                <h4>盈利</h4>
                <p>{{ profitNum }}<span>元</span></p>
            </article>
        </section>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { cardStatistics } from '../api/api';

    export default {
        data() {
            return {
                loading: true,
                cardNum: '0',
                holdNum: '0',
                channelNum: '0',
                profitNum: '0'
            };
        },
        methods: {
            getCardStatistics() {
                cardStatistics({}).then(res => {
                    this.loading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.cardNum = data.saleCount;
                        this.holdNum = data.holdCount;
                        this.channelNum = data.channelCount;
                        this.profitNum = data.totalProfit;
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message({ message: '网络异常！获取综述信息失败！', type: 'error'});
                });
            }
        },
        mounted() {
            this.getCardStatistics();
        }
    }
</script>

<style lang="scss" scoped>
    .card-list{
        margin-top: 20px;

        .list-item{
            position: relative;
            float: left;
            margin-right: 25px;
            margin-bottom: 25px;
            width: calc(50% - 25px);
            height: 200px;
            background: #fff;
            border-radius: 4px;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);

            h4{
                position: absolute;
                z-index: 2;
                top: 20px;
                left: 20px;
                font-size: 16px;
                color: #666;
                line-height: 1;
                font-weight: normal;
            }

            p{
                font-size: 40px;
                color: #333;
                line-height: 200px;
                text-align: center;

                span{
                    font-size: 16px;
                    color: #999;
                }
            }

            .button-link{
                position: absolute;
                top: 22px;
                right: 20px;
            }
        }
    }
</style>