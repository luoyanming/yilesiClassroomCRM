<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper yzb topicDetails light-overscroll">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/topicManagement' }">专题管理</el-breadcrumb-item>
                        <el-breadcrumb-item>专题详情</el-breadcrumb-item>                        
                    </el-breadcrumb>
                </section>  

                <section class="box" v-loading.fullscreen.lock="ready">
                    <div class="serialNum">
                        <p class="left">序号</p>
                        <p>0{{form.id}}</p>
                    </div>
                    <div class="name">
                        <p class="left">专题名称</p>
                        <p>{{form.name}}</p>
                    </div>
                    <div class="picture">
                        <p class="left">专题图片</p>
                        <div class="pic"><img :src="form.picUrl"></div>
                    </div>
                    <div class="num">
                        <p class="left">动态数</p>
                        <p>{{form.momentNumber}}</p>
                    </div>
                    <div class="table">
                        <p class="left">动态列表</p>
                        <el-table :data="tableData" style="width:60%">
                            <el-table-column label="序号">
                                <template scope="scope"><p>{{ scope.row.objectId }}</p></template>
                            </el-table-column>
                            <el-table-column label="文字内容">
                                <template scope="scope"><p>{{ scope.row.content }}</p></template>
                            </el-table-column>
                            <el-table-column label="作者昵称" width="150">
                                <template scope="scope"><p>{{ scope.row.authorName }}</p></template>
                            </el-table-column>
                            <el-table-column label="点赞数" width="70">
                                <template scope="scope"><p>{{ scope.row.likeNum }}</p></template>
                            </el-table-column>
                            <el-table-column label="评论数" width="70">
                                <template scope="scope"><p>{{ scope.row.commentNum }}</p></template>
                            </el-table-column>
                            <el-table-column label="阅读数" width="70">
                                <template scope="scope"><p>{{ scope.row.readNum }}</p></template>
                            </el-table-column>
                            <el-table-column label="发布日期">
                                <template scope="scope"><p>{{ scope.row.time }}</p></template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagiNum">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="pagi.currentPage"
                            :page-size="pagi.pageSize"
                            layout="total, prev, pager, next, jumper"
                            v-if="!noPagi"
                            :total="pagi.total">
                        </el-pagination>
                    </div>
                    <div class="clickNum">
                        <p class="left">点击数</p>
                        <p>{{form.readNumber}}</p>
                    </div>
                    <div class="date">
                        <p class="left">发布日期</p>
                        <p>{{form.createdDate}}</p>
                    </div>
                    <div class="button">
                        <el-button type="primary" size="large" class="button-cancle" @click="historyBack">返回</el-button>
                        <el-button type="primary" size="large" @click="topicModify">编辑信息</el-button>
                    </div>
                </section>              
            </div>
        </div>
    </div>
</template>

<script>
    import { Message , Loading } from 'element-ui';
    import { topicDetail } from '../api/api';

    export default {
        data() {
            return {
                id:this.$route.query.id,
                ready:false,
                form:{
                    createdDate:'',
                    id:'',
                    momentList:[],
                    momentNumber:'',
                    name:'',
                    picUrl:'',
                    readNumber:''
                },
                noPagi:true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    total: '' ,
                    pageTotal:''
                },
                tableData: []
            };
        },
        methods: {
            getTopicDetails(){
                if(!this.id){
                    return false;
                }
                let param = { 
                    'themeId': this.id,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                topicDetail(param).then(res =>{
                    let { msg,code,data } = res;
                    
                    if(code !== 0){
                        this.$message({message:msg, type: 'error'});
                    }else{
                        this.ready = false;
                        this.form.createdDate = data.detail.createdDate;
                        this.form.id = data.detail.id;
                        this.form.momentNumber = data.detail.momentNumber;
                        this.form.name = data.detail.name;
                        this.form.picUrl = data.detail.picUrl;
                        this.form.readNumber = data.detail.readNumber;

                        if(data.detail.momentList.length == 0){
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }
                        this.tableData = data.detail.momentList;

                        this.pagi.pageTotal = data.detail.momentNumber/this.pagi.pageSize + 1;
                        this.pagi.total = data.detail.momentNumber;
                        this.noPagi = false;
                    }
                });
            },
            topicModify(){
                this.$router.push({path:'/topicModify',query:{id:this.form.id}});
            },
            historyBack(){
                this.$router.go(-1);
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getTopicDetails();
            }
        },
        mounted(){
            this.getTopicDetails();
        }
    }
</script>

<style lang="scss" scoped>
    .box{
        width: 100%;
        margin: 24px 0 0 182px;
        div{
            height: auto;
            overflow: hidden;
            p{
                float: left;
                &.left{
                    color: #666666;
                    width: 48px;
                    height: 18px;
                    line-height: 18px;
                    text-align: right;
                    margin-right: 20px;
                }
            }
            div{
                float: left;
                &.pic{
                    width: 220px;
                    height: 80px;
                    background-repeat: no-repeat;
                }
            }
            &.serialNum{
                margin-bottom: 42px;
            }
            &.name{
                margin-bottom: 35px;
            }
            &.picture{
                margin-bottom: 30px;
            }
            &.num{
                margin-bottom: 31px;
            }
            &.table{
                margin-bottom: 30px;
            }
            &.clickNum{
                margin-bottom: 42px;
            }
            &.date{
                margin-bottom: 48px;
            }
            &.pagiNum{
                margin-left: 27%;
                div{
                    padding: 0;
                }                
            }
            &.button{
                margin-left: 68px;
            }
        }
    }
</style>
