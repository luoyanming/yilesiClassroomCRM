<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>视频总览</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="card-list clearfix" v-loading.body="loading">
                    <article class="list-item">
                        <p>{{ allData.totalCount }}<span>个</span></p>
                        <h4>视频总数</h4>
                    </article>
                    <article class="list-item">
                        <p>{{ allData.courseCount }}<span>个</span></p>
                        <h4>课程记录视频</h4>
                        <el-button size="small" class="button-link" @click="handlePageLinkToVideoCourse">详情 ></el-button>
                    </article>                    
                    <article class="list-item">
                        <p>{{ allData.microCourseCount }}<span>个</span></p>
                        <h4>微课视频</h4>
                        <el-button size="small" class="button-link" @click="handlePageLinkToVideoWxlist">详情 ></el-button>
                    </article>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { courseRecordStatistics } from '../api/api';

    export default {
        data() {
            return {
                loading: false,
                allData: {
                    totalCount: 0,
                    courseCount: 0,
                    microCourseCount: 0
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;

                courseRecordStatistics({}).then(res => {
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
            },
            handlePageLinkToVideoCourse() {
                this.$router.push({ path: '/videoCourse' });
            },
            handlePageLinkToVideoWxlist() {
                this.$router.push({ path: '/videoWxlist' });
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

            .button-link{
                position: absolute;
                z-index: 3;
                top: 20px;
                right: 20px;
            }

        }
    }
</style>