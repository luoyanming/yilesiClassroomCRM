<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>OU总览</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <section class="card-list clearfix" v-loading.body="loading">
            <article class="list-item">
                <p>{{ allData.schoolAccount }}<span>所</span></p>
                <h4>入驻学校</h4>
            </article>
            <article class="list-item">
                <p>{{ allData.classAccount }}<span>个</span></p>
                <h4>共创建班级</h4>
            </article>                    
            <article class="list-item">
                <p>{{ allData.studentAccount }}<span>人</span></p>
                <h4>在籍学生</h4>
            </article>
        </section>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { ouAllData } from '../api/api';

    export default {
        data() {
            return {
                loading: false,
                allData: {
                    schoolAccount: 0,
                    classAccount: 0,
                    studentAccount: 0
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;

                ouAllData({}).then(res => {
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