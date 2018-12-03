<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>学校接收器管理</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <div class="pull-left">
            <div class="search-box">
                <el-input v-model="schoolname" @click="keyDownSubmit" size="small" placeholder="请输入学校名称" :icon="schoolSearchLoading ? 'loading' : 'search'"></el-input>
            </div>
            <div class="light-overscroll">
                <el-tree
                  empty-text="暂无数据"
                  :data="schoolOptions"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  @node-click="handleNodeClick">
                </el-tree>
            </div>
        </div>
        <div class="pull-right">
            <div class="light-overscroll" v-if="showTable">
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="接收器MAC号">
                            <el-input v-model="searchForm.account" size="small" placeholder="请输入"></el-input>
                        </el-form-item>
                        
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd()" v-if="searchForm.schoolId">添加接收器</el-button>
                </section>

                <section class="table" style="height: auto">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="接收器MAC号">
                            <template scope="scope"><p>{{ scope.row.macNo }}</p></template>
                        </el-table-column>
                        <el-table-column label="所处位置">
                            <template scope="scope"><p>{{ scope.row.location }}</p></template>
                        </el-table-column>
                        <el-table-column label="布设方向">
                            <template scope="scope">
                                <p v-if="scope.row.layDirection == 0">内</p>
                                <p v-if="scope.row.layDirection == 1">外</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="信号过滤">
                            <template scope="scope"><p>{{ scope.row.signalFilterStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog :title="dialog.type == 0 ? '添加接收器' : '编辑接收器'" :visible.sync="dialogShow" :modal-append-to-body="false">
            <section class="formation">
       
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialog">
                    <el-form-item label="接收器MAC号" prop="macNo">
                        <el-input v-model="dialog.macNo"></el-input>
                    </el-form-item>
                    <el-form-item label="所处位置" prop="location">
                        <el-input v-model="dialog.location"></el-input>
                    </el-form-item>
                    <el-form-item label="布设方向" prop="layDirection">
                        <el-select v-model="dialog.layDirection" placeholder="请选择">
                            <el-option v-for="item in layDirectionOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="信号过滤" prop="signalFilter">
                        <el-select v-model="dialog.signalFilter" placeholder="请选择">
                            <el-option v-for="item in signalFilterOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>                                    
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialog.dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
            </span>
        </el-dialog>                        
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { schoolList, macList, macOperate, macDelete } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showTable: false,

                // 左侧学校列表
                schoolOptions: [],
                defaultProps: {
                    label: 'label'
                },
                schoolname: '',
                schoolSearchLoading: false,

                searchForm: {
                    schoolId: '',
                    schoolCode: '',
                    account: ''
                },
                tableData: [],
                tableloading: true,

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },

                dialogShow: false,
                dialog: {
                    type: 0,
                    id: '',
                    macNo: '',
                    location: '',
                    layDirection: '0',
                    signalFilter: '0',
                    dialogLoading: false
                },
                rules: {
                    macNo: [
                        { required: true, message: '*请输入接收器MAC号', trigger: 'blur' }
                    ],
                    location: [
                        { required: true, message: '*请输入所处位置', trigger: 'blur' }
                    ]
                },

                layDirectionOptions: [
                    {
                        'value': '0',
                        'label': '内'
                    },
                    {
                        'value': '1',
                        'label': '外'
                    }                    
                ],

                signalFilterOptions: [
                    {
                        'value': '0',
                        'label': '不过滤'
                    },
                    {
                        'value': '1',
                        'label': '1米'
                    },
                    {
                        'value': '3',
                        'label': '3米'
                    },
                    {
                        'value': '5',
                        'label': '5米'
                    },
                    {
                        'value': '10',
                        'label': '10米'
                    },
                    {
                        'value': '15',
                        'label': '15米'
                    }               
                ]       
            };
        },
        methods: {
            // 获取学校列表
            getSchoolList: function() {
                this.schoolSearchLoading = true;

                let param = {
                    'name': this.schoolname,
                    'pageNo': 1,
                    'pageSize': 5000
                };

                schoolList(param).then(res => {
                    this.schoolSearchLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        that.schoolOptions = [];
                        if(data.list && data.list.length > 0) {
                            for(let i = 0; i < data.list.length; i++) {
                                let item = data.list[i];

                                this.schoolOptions.push({
                                    "label": item.fullName + '(' + item.code + ')',
                                    "code": item.code,
                                    "id": item.id
                                });
                            }
                        }
                    }
                }).catch(error => {
                    this.schoolSearchLoading = false;
                    this.$message({ message: '网络异常！获取学校列表失败！', type: 'error'});
                });
            },
            // 选择节点触发的事件
            handleNodeClick(data) {
                this.searchForm.schoolId = data.id;
                this.searchForm.schoolCode = data.code;

                this.showTable = true;

                this.getList();
            },
            // 搜索按钮
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取接收器列表
            getList: function() {
                this.tableloading = true;

                let param = {
                    'id': this.searchForm.schoolId,
                    'searchNo': this.searchForm.account,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                macList(param).then(res => {
                    this.tableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.list;
                        if(data.total % this.pagi.pageSize == 0) {
                            this.pagi.pageTotal = data.total/this.pagi.pageSize;
                        } else {
                            this.pagi.pageTotal = parseInt(data.total/this.pagi.pageSize) + 1;
                        }
                        this.pagi.total = data.total;
                        this.noPagi = false;                       
                    }
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取接收器列表失败！', type: 'error'});
                });
            },

            // 搜索学校
            keyDownSubmit: function() {
                that.getSchoolList();
            },

            // 添加接收器
            handleAdd: function() {
                this.dialogShow = true;
                this.dialog.type = 0;
                this.dialog.id = '';
                this.dialog.macNo = '';
                this.dialog.location = '';
                this.dialog.layDirection = '0';
                this.dialog.signalFilter = '0';
                this.dialog.dialogLoading = false;
            },

            // 编辑
            handleEdit: function(index, row) {
                this.dialogShow = true;
                this.dialog.type = 1;
                this.dialog.id = row.id;
                this.dialog.macNo = row.macNo;
                this.dialog.location = row.location;
                this.dialog.layDirection = '' + row.layDirection;
                this.dialog.signalFilter = '' + row.signalFilter;
                this.dialog.dialogLoading = false;                
            },

            // 提交用户信息
            submitForm: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dialog.dialogLoading = true;

                        let params = {
                            'id': this.dialog.id,
                            'schoolId': this.searchForm.schoolId,
                            'macNo': this.dialog.macNo,
                            'location': this.dialog.location,
                            'layDirection': this.dialog.layDirection,
                            'signalFilter': this.dialog.signalFilter
                        };

                        macOperate(params).then(res=>{
                            this.dialog.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getList();
                            }
                        }).catch(error => {
                            this.dialog.dialogLoading = false;
                            this.$message({ message: '网络异常！保存失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });
            },

            // 删除
            handleDelete: function(index, row) {
                let params = {
                    'id': row.id
                };

                macDelete(params).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '删除成功！', type: 'success' });
                        
                        this.getList();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！删除失败！', type: 'error'});
                });                
            }
        },
        mounted() {
            that = this;

            this.getSchoolList();
        }
    }
</script>

<style lang="scss">
    .el-message-box{
        height: auto !important;
    }
    .el-dialog .formation .el-form .el-form-item .el-form-item__content{
        padding-left: 0 !important;
    }
    .pickerMonth{
        .el-date-picker__header{
            > button{
                display: none !important;
            }

            > span{
                &:nth-of-type(1) {
                    display: none !important;
                }
            }
        }
    }
    .pull-left{
        .search-box{
            .el-input{
                width: 100%;
                font-size: 12px;
                
                .el-input__inner {
                    height: 36px;
                    background: #FFFFFF;
                    border: none;
                    border-bottom: 1px solid #E5E5E5;
                    border-radius: 0;
                    text-align: center;
                    &:hover {
                        background: transparent;
                    }
                    &:focus {
                        outline: 0;
                        background: transparent;
                    }
                    &::placeholder,
                    &::-webkit-input-placeholder {
                        color: rgba(51, 51, 51, .3);
                    }
                }

                .el-input__icon{
                    cursor: pointer;
                }
            }
        }
    }
    .pull-right{
        .el-checkbox{
            margin-left: 10px;

            .el-checkbox__label{
                font-size: 12px;
                color: #333;
            }
        }

        .upload-demo{
            float: right;

            .el-upload-list{
                display: none !important;
            }
        }
    }
</style>

<!-- <style lang="scss" scoped>
    .luoym{
        .button-add{
            margin-right: 15px;
        }

        .pull-left{
            position: relative;
            width: 200px;
            height: calc(100% - 29px);
            margin-top: 15px;
            overflow: hidden;
            box-shadow: 0 1px 4px 0 rgba(65, 86, 105, 0.2);

            .light-overscroll{
                margin-top: 36px;
                height: calc(100% - 36px);
            }

            .search-box{
                position: absolute;
                z-index: 3;
                top: 0;
                left: 0;
                right: 0;
            }
        }

        .pull-right{
            width: calc(100% - 215px);
            height: calc(100% - 14px);
            overflow: hidden;

            .light-overscroll{
                height: 100%;
            }

            .button-separate{
                margin-right: 10px;
                color: #999;
            }
        }

        .cCodeCopyInput{
            display: inline-block;
            width: 10px;
            height: 10px;
            overflow: hidden;
            opacity: 0;
        }

        .cCodeCopyBtn{
            display: inline-block;
            white-space: nowrap;
            cursor: pointer;
            border: 1px solid #c4c4c4;
            box-sizing: border-box;
            min-width: 76px;
            padding: 0 14px;
            line-height: 38px;
            border-radius: 2px;
            font-size: 12px;
            color: #fff;
            background-color: #18c79c;
            border-color: #18c79c;

            &:hover{
                background: rgb(70, 210, 176);
                border-color: rgb(70, 210, 176);
                color: #fff;
            }
        }
    }
</style> -->

<!-- <style lang="scss">
    .el-message-box{
        height: auto !important;
    }
    .el-dialog .formation .el-form .el-form-item .el-form-item__content{
        padding-left: 0 !important;
    }
    .pickerMonth{
        .el-date-picker__header{
            > button{
                display: none !important;
            }

            > span{
                &:nth-of-type(1) {
                    display: none !important;
                }
            }
        }
    }
    .pull-left{
        .search-box{
            .el-input{
                width: 100%;
                font-size: 12px;
                
                .el-input__inner {
                    height: 36px;
                    background: #FFFFFF;
                    border: none;
                    border-bottom: 1px solid #E5E5E5;
                    border-radius: 0;
                    text-align: center;
                    &:hover {
                        background: transparent;
                    }
                    &:focus {
                        outline: 0;
                        background: transparent;
                    }
                    &::placeholder,
                    &::-webkit-input-placeholder {
                        color: rgba(51, 51, 51, .3);
                    }
                }

                .el-input__icon{
                    cursor: pointer;
                }
            }
        }

        .el-select{
            width: 100%;

            .el-input{
                .el-input__icon{
                    color: #18c79c;
                }
            }
        }
    }
    .pull-right{
        .el-checkbox{
            margin-left: 10px;

            .el-checkbox__label{
                font-size: 12px;
                color: #333;
            }
        }

        .upload-demo{
            float: right;

            .el-upload-list{
                display: none !important;
            }
        }

        .table-left,
        .table-right{
            position: relative;

            .overflow{
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .crumbs{
                position: absolute;
                z-index: 3;
                top: -14px;
                left: 0;
            }

            .el-input{
                width: 200px;
                font-size: 12px;
                
                .el-input__inner {
                    height: 36px;
                    background: #FFFFFF;
                    border: none;
                    border: 1px solid #E5E5E5;
                    border-radius: 0;
                    text-align: center;
                    &:hover {
                        background: transparent;
                    }
                    &:focus {
                        outline: 0;
                        background: transparent;
                    }
                    &::placeholder,
                    &::-webkit-input-placeholder {
                        color: rgba(51, 51, 51, .3);
                    }
                }

                .el-input__icon{
                    cursor: pointer;
                }
            }

            .el-button--primary{
                padding: 2px 14px;
            }

            .el-pagination{
                padding: 20px 0;
            }
        }

        .table{
            height: 100%;

            .el-table{
                height: 100%;
            }

            thead{
                /*display: none;*/
            }
        }        

        .el-dialog__wrapper,
        .el-table__body-wrapper{
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;

            .el-dialog{
                height: 70%;

                .el-dialog__body{
                    padding-top: 15px;
                    height: calc(100% - 132px);

                    .dialog-table{
                        height: 100%;

                        .dialog-left{
                            position: relative;
                            float: left;
                            width: 50%;
                            height: 100%;
                            border: 1px solid #eee;

                            .table-search{
                                position: absolute;
                                z-index: 3;
                                top: 2px;
                                right: 15px;

                                .el-input{
                                    width: 250px;
                                }
                            }
                        }

                        .dialog-middle{
                            position: relative;
                            float: left;
                            width: 100px;
                            height: 100%;

                            .shift{
                                position: absolute;
                                z-index: 3;
                                top: 50%;
                                left: 50%;
                                -webkit-transform: translate3d(-50%, -50%, 0);
                                        transform: translate3d(-50%, -50%, 0);

                                .icon{
                                    display: block;
                                    width: 60px;
                                    height: 60px;
                                    font-size: 16px;
                                    color: #fff;
                                    line-height: 60px;
                                    text-align: center;
                                    border-radius: 4px;
                                    background: #18c79c;
                                }

                                .text{
                                    display: block;
                                    margin-top: 6px;
                                    font-size: 14px;
                                    line-height: 22px;
                                    color: #333;
                                    text-align: center;
                                }
                            }
                        }

                        .dialog-right{
                            position: relative;
                            float: right;
                            width: 50%;
                            height: 100%;
                            border: 1px solid #eee;
                            border-left: none;

                            .table-title{
                                position: absolute;
                                z-index: 3;
                                top: 0;
                                left: 0;
                                color: #000;
                                line-height: 40px;
                                padding-left: 15px;
                            }

                            .table .el-table .el-table__body-wrapper .el-table__body tbody tr{
                                padding-left: 20px;

                                td{
                                    padding-left: 20px;

                                    .cell {
                                        padding: 10px 0 10px 0;
                                    }
                                }
                            }

                        }

                        .table{
                            .el-table__header-wrapper{
                                .el-table__header{
                                    thead{
                                        display: block;
                                    }
                                }
                            }

                            .el-table__body-wrapper{
                                .el-table__body{
                                    .el-table__row{
                                        .el-table-column--selection{
                                            .cell{
                                                padding-right: 20px;
                                                text-overflow: initial;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }        

        .w80{
            width: 80%;
            margin-left: 5%;
        }
    }
</style> -->

<style lang="scss" scoped>
    .luoym{
        .button-add{
            margin-right: 15px;
        }

        .pull-left{
            position: relative;
            width: 200px;
            height: calc(100% - 29px);
            margin-top: 15px;
            overflow: hidden;
            box-shadow: 0 1px 4px 0 rgba(65, 86, 105, 0.2);

            .light-overscroll{
                margin-top: 36px;
                height: calc(100% - 36px);
            }

            .search-box{
                position: absolute;
                z-index: 3;
                top: 0;
                left: 0;
                right: 0;
            }
        }

        .pull-right{
            width: calc(100% - 215px);
            height: calc(100% - 14px);
            /*overflow: hidden;*/

            .table-left{
                float: left;
                height: 100%;
                width: 350px;
            }

            .table-right{
                float: right;
                height: 100%;
                width: calc(100% - 360px);
            }

            .light-overscroll{
                height: 100%;
            }

            .button-separate{
                margin-right: 10px;
                color: #999;
            }
        }
    }
</style>

