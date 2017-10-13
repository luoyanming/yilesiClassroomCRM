<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/dynamic' }">动态管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动态详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" v-loading.fullscreen.lock="ready">
                        <el-form-item label="序号">
                            <div class="form-content">
                                <p class="text">{{ id }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="文字内容">
                            <div class="form-content">
                                <p class="text">{{ form.content }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="图片">
                            <div class="form-content">
                                <div class="photo-item clearfix" v-for="item in form.photos">
                                    <div class="imgbox"><img :src="item.photoUrl"></div>
                                    <div class="desc">{{ item.desc }}</div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="作者昵称">
                            <div class="form-content">
                                <p class="text">{{ form.authorName }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="点赞数">
                            <div class="form-content">
                                <p class="text">{{ form.likeNumber }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="点赞人列表">
                            <div class="form-content">
                                <p class="text">
                                    <span v-for="item in form.likePeopleList"><span class="color-blue cursor-pointer" @click="linkTo(item.id)">{{ item.name }}</span>，</span>
                                </p>
                            </div>
                        </el-form-item>
                        <el-form-item label="评论数">
                            <div class="form-content">
                                <p class="text">{{ form.commentNumber }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="评论列表">
                            <div class="form-content">
                                <div class="table">
                                    <el-table :data="form.commentList" style="width: 100%">
                                        <el-table-column label="评论时间" width="160">
                                            <template scope="scope"><p>{{ scope.row.created_date }}</p></template>
                                        </el-table-column>
                                        <el-table-column label="评论人" width="120">
                                            <template scope="scope"><p><span class="color-blue cursor-pointer" @click="linkTo(scope.row.id)">{{ scope.row.authorName }}</span></p></template>
                                        </el-table-column>
                                        <el-table-column label="内容">
                                            <!-- <template scope="scope"><p>回复<span class="color-blue">飞翔的汽车门</span>：对没错！开车一定要注意安全！！开车一定要注意安全！</p></template> -->
                                            <template scope="scope">
                                                <p v-if="scope.row.replyId == 0">{{ scope.row.content }}</p>
                                                <p v-if="scope.row.replyId != 0">回复 <span class="color-blue cursor-pointer" @click="linkTo(scope.row.replyId)">{{ scope.row.replyName }}</span>：{{ scope.row.content }}</p>
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
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="阅读数">
                            <div class="form-content">
                                <p class="text">{{ form.readNumber }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="发布日期">
                            <div class="form-content">
                                <p class="text">{{ form.created_date }}</p>
                            </div>
                        </el-form-item>
                        <!-- <el-form-item label="状态">
                            <div class="form-content">
                                <p class="text" v-if="form.status == '正常'">正常</p>
                                <p class="text color-red" v-if="form.status == '已隐藏'">已隐藏</p>
                            </div>
                        </el-form-item> -->
                        <el-form-item label="所属专题">
                            <div class="form-content">
                                <p class="text">{{ form.theme }}</p>
                            </div>
                        </el-form-item>
                        <el-form-item label="Tag">
                            <div class="form-content">
                                <p class="text">{{ form.tags }}</p>
                            </div>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click="historyBack">返回</el-button>
                        </div>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { dynamicDetail } from '../api/api';

    export default {
        data() {
            return {
                ready: true,
                labelPosition: 'right',
                id: this.$route.query.id,
                form: {},
                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0,
                    total: 0
                }
            };
        },
        methods: {
            historyBack: function() {
                this.$router.go(-1);
            },
            linkTo: function(id) {
                this.$router.push({ path: '/userDetail', query: { 'id': id } });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getDynamicDetail();
            },
            getDynamicDetail: function() {
                let param = { 'objectId': this.id, 'pageNo': this.pagi.currentPage, 'pageSize': this.pagi.pageSize };

                dynamicDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        if(data.detail.length == 0) {
                            this.noPagi = true;
                            this.form = [];
                            return false;
                        }

                        this.form = data.detail;
                        this.pagi.pageTotal = data.page.pageTotal;
                        this.pagi.total = data.page.dataTotal;
                        this.ready = false;
                        this.noPagi = false;
                    }
                });
            }
        },
        mounted() {
            this.getDynamicDetail();
        }
    }
</script>

<style lang="scss">
    .photo-item{
        margin-bottom: 20px;

        .imgbox{
            float: left;
            margin-right: 20px;

            img{
                display: block !important;
            }
        }

        .desc{
            font-size: 12px;
            color: #333333;
            line-height: 18px;
        }
    }
</style>
