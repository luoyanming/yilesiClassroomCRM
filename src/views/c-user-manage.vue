<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>用户总览</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="card-list clearfix" v-loading.body="loading">
                    <article class="list-item">
                        <p>{{ allData.userTotal }}<span>人</span></p>
                        <h4>用户总人数</h4>
                    </article>
                    <article class="list-item">
                        <p>{{ allData.activeWeek }}<span>人</span></p>
                        <h4>七天内活跃用户人数</h4>
                    </article>                    
                    <article class="list-item">
                        <p>{{ allData.noActive }}<span>人</span></p>
                        <h4>不活跃用户人数</h4>
                    </article>
                    <article class="list-item">
                        <p>{{ allData.leaderAccount }}<span>人</span></p>
                        <h4>校领导</h4>
                    </article>
                    <article class="list-item">
                        <p>{{ allData.teacherAccount }}<span>人</span></p>
                        <h4>教师</h4>
                    </article>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { userAllData } from '../api/api';

    export default {
        data() {
            return {
                loading: false,
                allData: {
                    userTotal: 0,
                    activeWeek: 0,
                    noActive: 0,
                    leaderAccount: 0,
                    teacherAccount: 0
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;

                userAllData({}).then(res => {
                    this.loading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.allData = data;
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message({ message: '网络异常！获取数据失败！', type: 'error'});
                });
            }
        },
        mounted() {
            this.getData();
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
                top: 120px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 16px;
                color: #999;
                line-height: 1;
                font-weight: normal;
            }

            p{
                font-size: 40px;
                color: #333;
                line-height: 160px;
                text-align: center;

                span{
                    font-size: 16px;
                    color: #999;
                }
            }

            &:first-child{
                width: calc(100% - 25px);
            }

        }
    }
</style>