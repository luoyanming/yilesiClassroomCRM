<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper yzb light-overscroll">
                <section class="crumbs">
                    <el-breadcrumb separator="/" class="crumbs-btn">
                        <el-breadcrumb-item>车服务</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button type="primary" size="small" class="btn-add" @click.native="linkTo('/carEdit')">新增车服务</el-button>                    
                </section>   

                <section class="table" id="carTable">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="序号">
                            <template scope="scope"><p>{{ scope.row.id }}</p></template>
                        </el-table-column>
                        <el-table-column label="名称">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="发布日期">
                            <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                        </el-table-column>
                        <el-table-column label="状态">
                             <template scope="scope">
                                <p v-if="scope.row.status == 0">正常</p>
                                <p class="color-red" v-if="scope.row.status == -1 ">已隐藏</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.changeable != -1">编辑</el-button>
                                 <el-button size="small" class="button-link" @click="handleFreeze(scope.$index, scope.row)" v-if="scope.row.status == 0 && scope.row.changeable != -1">隐藏</el-button>
                                <el-button size="small" class="button-link color-orange" @click="handleUnFreeze(scope.$index, scope.row)" v-if="scope.row.status == -1 && scope.row.changeable != -1">取消隐藏</el-button>
                                <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.changeable != -1">删除</el-button>
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

                </section>   


            </div>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import {COMMON} from '../common/js/common';
    import {carServiceList,carServiceDelete,carServiceChange} from '../api/api';

    export default {
        data() {
            return {
                tableData: [],
                tableloading:true,
                noPagi:true,
                pagi: {
                    currentPage: 1,
                    pageSize: 6,
                    total: '',
                    pageTotal:''
                }
            };
        },
        methods: {
            linkTo(url){
                this.$router.push({path:url});
            },
            getCarServiceList(){
                this.tableloading = true;

                let param = {
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                }

                carServiceList(param).then(res =>{
                    this.tableloading = false;

                    let {msg, code, data} = res;

                    if(code != 0){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        if(data.list.length == 0){
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.list;
                        this.pagi.pageTotal = data.page.pageTotal;
                        this.pagi.total = data.page.dataTotal;
                        this.noPagi = false;
                    }
                });
            },
            handleCurrentChange(val){
                 this.pagi.currentPage = parseInt(val);
                 this.getCarServiceList();
            },
            handleDetail(index,row){
                this.$router.push({ path: '/carSerDetails', query: { id: row.id } });
            },
            handleEdit(index,row){
                this.$router.push({ path: '/carEdit', query: { id: row.id } });
            },
            handleDelete(index,row){
                this.$confirm('确定删除该车服务?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        let param = { 'id': row.id };

                        carServiceDelete(param).then(res =>{
                            let { msg, code, data } = res;
                            if(code !== 0) {
                                this.$message({ message: msg, type: 'error'});
                            } else {
                                this.$message({ message: '删除车服务成功', type: 'success'});
                                this.tableData.splice(index, 1);
                            }
                        });
                    }).catch(() => {
                         
                    });
            },
            handleFreeze: function(index, row) {
                this.changeFreeze(row.id, -1, index);
            },
            handleUnFreeze: function(index, row) {
                this.changeFreeze(row.id, 0, index);
            },
            changeFreeze(id,status,index){
                let confirmStr = '';
                if(status == 0) {
                    confirmStr = '确定取消隐藏该车服务？';
                } else if(status == -1) {
                    confirmStr = '确定隐藏该车服务？';
                }

                this.$confirm(confirmStr, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'id': id, 'status': status };

                    carServiceChange(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.tableData[index].status = status ;
                        }
                    });
                }).catch(() => {
                       
                });

            }
        },
        mounted(){
            this.getCarServiceList();
        }
    }
</script>

<style lang="scss" scoped>
    .crumbs{
        .crumbs-btn{
            float: left;
        }
        .btn-add{
            float: right;
            width: 99px;
            font-weight: 300;
        }
    }
</style>
