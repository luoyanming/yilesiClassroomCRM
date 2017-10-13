<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper yzb light-overscroll">
                <section class="crumbs">
                    <el-breadcrumb separator="/" class="crumbs-btn">
                        <el-breadcrumb-item :to="{ path: '/LicensePlate' }">车牌库</el-breadcrumb-item>
                        <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>   

                <section class="collapse">
                    <el-collapse  accordion v-for="( item , index ) in collapseData" :key="index" v-model="activeName">
                        <el-collapse-item :title="item.name" :name="item.id">

                            <template>
                                <el-collapse class="second"  accordion  v-for="( item_2 , index_2 ) in item.subList" :key="index_2" v-model="activeName_2">
                                    <el-collapse-item :title="item_2.name" :name="item_2.id">
                                        <div v-for="( item_3 , index_3 ) in item_2.subList" :key="index_3" >{{item_3.name}}</div>
                                    </el-collapse-item>
                                </el-collapse>
                            </template>
                            
                        </el-collapse-item>
                    </el-collapse>
                </section>
        
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { COMMON } from '../common/js/common';
    import { carBrandInfoDetail } from '../api/api';

    export default {
        data() {
            return {
                 activeName: '1',
                 activeName_2: '2',
                 id: this.$route.query.id,
                 name:this.$route.query.name,
                 collapseData : []
            };
        },
        methods: {
            getCarBrandInfoDetail() {
                let param = {
                    'brandId' : this.id
                }

                carBrandInfoDetail(param).then(res => {
                    let { msg, code, data } = res;

                    if( code !== 0){
                        this.$message({ message : msg, type : 'error' });
                    }else{
                        this.collapseData = data.list;
                    }
                });

            }
        },
        mounted() {
            this.getCarBrandInfoDetail();
        }
    }
</script>

<style lang="scss" scoped>
   
</style>
