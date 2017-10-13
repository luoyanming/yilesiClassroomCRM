<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper yzb light-overscroll">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/carService' }">车服务</el-breadcrumb-item>
                        <el-breadcrumb-item>服务详情</el-breadcrumb-item>                        
                    </el-breadcrumb>
                </section> 

                <section class="formation carSerDetails">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form" v-loading.fullscreen.lock="ready">
                        <el-form-item label="序号">
                            <div>{{ form.id }}</div>
                        </el-form-item>
                        <el-form-item label="所属模块">
                            <div>{{ form.moduleName }}</div>
                        </el-form-item>
                        <el-form-item label="名称">
                            <div>{{ form.name }}</div>
                        </el-form-item>
                        <el-form-item label="URL">
                            <div>{{ form.linkUrl }}</div>
                        </el-form-item>
                        <el-form-item label="图标">
                            <img :src="form.picUrl">
                        </el-form-item>
                        <el-form-item label="发布日期">
                            <div>{{ form.createdDate }}</div>
                        </el-form-item>
                        <el-form-item label="状态">
                            <div>{{ form.statusStr }}</div>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click="historyBack">取消</el-button>
                            <el-button type="primary" size="large" @click="linkTo('/carEdit')">编辑详情</el-button>
                        </div>
                    </el-form>
                </section>                                                    
            </div>
        </div>
    </div>
</template>

<script>
    import {Message, Loading} from 'element-ui';
    import {carServiceDetail} from '../api/api';

    export default {
        data() {
            return {
                labelPosition:'right',
                form:{},
                ready:true,
                id:this.$route.query.id
            };
        },
        methods: {
            historyBack(){
                this.$router.go(-1);
            },
            linkTo(url){
                this.$router.push({ path: url, query: { id: this.id } });
            },
            getCarServiceDetail(){
                let param = {'id': this.id};

                carServiceDetail(param).then(res =>{
                    let {msg, code, data} = res;

                    if( code !== 0){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        this.form = data.detail;
                        this.ready = false;
                    }
                });
            },
        },
        mounted(){
            this.getCarServiceDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .yzb{
        .carSerDetails{
            .el-form{
                margin-left: 70px;
                .el-form-item{
                    .el-form-item__content{
                        img{
                            margin: 0;
                        }
                        div{
                            line-height: 40px!important;
                            font-size: 12px;
                            color: #333;
                        }
                    }
                }
            }
        }
    }

</style>
