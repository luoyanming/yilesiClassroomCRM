<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <section class="main-wrapper yzb management">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>专题管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                <div class="cardBox clearfix">
                    <div class="card" v-for="(item,index) in form">
                        <img :src="item.picUrl">
                        <div class="content">
                            <p>{{ item.sortId }}.{{ item.name }}</p>
                            <p>发布时间：{{ item.createdDate }}</p>
                            <p>动态数：{{ item.momentNumber }}</p>
                            <p>点击数：{{ item.readNumber }}</p>
                            <div class="cardCheck">
                                <el-button type='text'size="small" class="check" @click="topicDetail(item)" >查看</el-button>   
                                <el-button type='text'size="small" class="check" @click="topicModify(item)" >修改</el-button>                                                                               
                                <el-button type='text'size="small" class="check" v-if="item.status == 0" @click="topicStatus(item, index, 1)" >隐藏</el-button>
                                <el-button type='text'size="small" class="check" v-if="item.status == 1" @click="topicStatus(item, index, 0)" >显示</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="card-add" @click="topicAdd">
                        <span><i>+</i>新增专题</span>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { topicList, topicModifyStatus } from '../api/api';

    export default {
        data() {
            return {
                form:[]
            };
        },
        methods: {
            getTopicList(){
                topicList({}).then(res =>{
                    let {msg,code,data} = res;

                    if(code !== 0){
                        this.$message({message:msg, type: 'error'});
                    }else{
                        this.form = data.list;
                    }
                });
            },
            topicDetail(item) {
                this.$router.push({path: '/topicDetails',query:{ id:item.id }});
            },
            topicModify(item) {
                this.$router.push({path: '/topicModify',query:{ id:item.id }});                
            },
            topicAdd() {
                this.$router.push({path: '/topicModify'});
            },
            topicStatus(item, index, status) {
                let param = { 'id': item.id, 'status': status };

                topicModifyStatus(param).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        if(item.status == 1) {
                            this.$message({ message: '显示专题成功！', type: 'success'});
                            this.form[index].status = 0;
                        } else if(item.status == 0) {
                            this.$message({ message: '隐藏专题成功！', type: 'success'});
                            this.form[index].status = 1;
                        }
                    }
                });
            }
        },
        mounted(){
            this.getTopicList();
        }
    }
</script>

<style lang="scss" scoped>
.cardBox{
    margin-top: 20px;
    width: 1200px;
    .card{
        position: relative;
        float: left;
        height: 180px;
        width: 495px;
        margin: 0 20px 20px 0;

        img{
            display: block;
            width: 100%;
            height: 100%;
        }

        .content{
            position: absolute;
            z-index: 3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 20px 0 20px 30px;
            
            p{
                color: #FFF;
                font-size: 12px;
                height: 17px;
                line-height: 17px;
                font-weight: 300;            
                &:nth-child(1){
                    font-size: 32px;
                    height: 45px;
                    line-height: 45px;
                }
                &:nth-child(2){
                    margin-top: 34px;
                }
                &:nth-child(3){
                    margin-top: 6px;
                }
                &:nth-child(4){
                    margin-top: 4px;
                }
            }
            .cardCheck{
                position: absolute;
                top: 0;
                right: 0;
                height: 180px;
                padding: 0 38px;
                background-color: rgba(255,255,255,0.1);
                overflow: hidden;

                .check{
                    display: block;
                    color: #FFF;
                    border: none;
                    text-align: center;
                    line-height: 17px;
                    margin: 0;
                    padding: 0;

                    &:nth-child(1){
                        margin-top: 40px;
                    }
                    &:nth-child(2){
                        margin-top: 25px;
                    }
                    &:nth-child(3){
                        margin-top: 25px;
                    }
                }
            }
        }
    }

    .card-add{
        position: relative;
        float: left;
        width: 495px;
        height: 180px;
        border: 1px dashed #979797;
        border-radius: 4px;
        margin: 0 20px 20px 0;
        cursor: pointer;
        text-align: center;

        span{
            font-size: 32px;
            color: #999999;
            line-height: 180px;

            i{
                position: relative;
                top: -4px;
                font-style: normal;
                font-size: 50px;
                vertical-align: top;
            }
        }
    }
}
</style>
