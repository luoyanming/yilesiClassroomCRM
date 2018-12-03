<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>学校教职工管理</el-breadcrumb-item>
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
                        <el-form-item label="教职工账号">
                            <el-input v-model="searchForm.account" size="small" placeholder="请输入账号"></el-input>
                        </el-form-item>
                        <el-form-item label="用户角色">
                            <el-select v-model="searchForm.character" placeholder="请选择">
                                <el-option v-for="item in characterOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleSchoolStaffAdd()" v-if="searchForm.schoolId">添加教职工</el-button>
                </section>

                <section class="table" style="height: auto">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="手机账号">
                            <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                        </el-table-column>
                        <el-table-column label="学校账号">
                            <template scope="scope"><p>{{ scope.row.schoolAccount }}</p></template>
                        </el-table-column>
                        <el-table-column label="姓名">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="用户状态">
                            <template scope="scope"><p>{{ scope.row.activeStatusStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="用户角色">
                            <template scope="scope"><p>{{ scope.row.typeStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleSchoolStaffDelete(scope.$index, scope.row)">从该校去除</el-button>
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

                <el-dialog title="添加教职工" :visible.sync="staffDialogShow" :modal-append-to-body="false" custom-class="w80">
                    <div class="dialog-table clearfix">
                        <div class="dialog-left">
                            <section class="table-search">
                                <el-input v-model="staffDialog.searchParam" @click="staffDialogSearch" size="small" placeholder="搜索用户名/手机号/学校账号" :icon="staffDialog.tableLoading ? 'loading' : 'search'"></el-input>
                            </section>
                            <section class="table">
                                <el-table ref="multipleTable" :data="staffDialog.tableData" stripe style="width: 100%" @selection-change="staffDialogSelect" :loading="staffDialog.tableLoading">
                                    <el-table-column type="selection" width="75"></el-table-column>
                                    <el-table-column label="">
                                        <template scope="scope">{{ scope.row.name }}</template>
                                    </el-table-column>
                                    <el-table-column label="">
                                        <template scope="scope">{{ scope.row.mobile }}</template>
                                    </el-table-column>
                                    <el-table-column label="">
                                        <template scope="scope">{{ scope.row.schoolAccount }}</template>
                                    </el-table-column>
                                </el-table>

                                <el-pagination
                                    @current-change="handleStaffDialogPageChange"
                                    :current-page.sync="staffDialog.pagi.currentPage"
                                    :page-size="staffDialog.pagi.pageSize"
                                    layout="total, prev, pager, next, jumper"
                                    :total="staffDialog.pagi.total"
                                    v-if="!staffDialog.noPagi">
                                </el-pagination>
                            </section>
                        </div>

                        <div class="dialog-right">
                            <section class="table-title">已选择教职工</section>
                            <section class="table">
                                <el-table :data="staffDialog.selectedData" stripe style="width: 100%">
                                    <el-table-column>
                                        <template scope="scope"><p>{{ scope.row.name }}</p></template>
                                    </el-table-column>
                                    <el-table-column>
                                        <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                                    </el-table-column>
                                    <el-table-column label="">
                                        <template scope="scope">{{ scope.row.schoolAccount }}</template>
                                    </el-table-column>
                                    <el-table-column label="">
                                        <template scope="scope">
                                            <el-select v-model="scope.row.type" size="small" placeholder="请选择">
                                                <el-option v-for="item in characterDialogOptions" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="100">
                                        <template scope="scope">
                                            <el-button size="small" class="button-link" @click="handleStaffDialogSelectedDelete(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </section>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="staffDialog.submitLoading" @click.native="staffDialogSubmit">保存</el-button>
                    </span>
                </el-dialog>                        
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, schoolList, schoolStaffAdd, schoolStaffDelete, schoolStaffList, notContainsSchoolStaffList } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showTable: false,

                // 左侧学校列表
                schoolOptions: [],
                defaultProps: {
                    // children: 'children',
                    label: 'label'
                },
                schoolname: '',
                schoolSearchLoading: false,

                searchForm: {
                    schoolId: '',
                    schoolCode: '',
                    account: '',
                    character: ''
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

                staffDialogShow: false,
                staffDialog: {
                    searchParam: '',
                    notContainIds: [],
                    tableData: [],
                    tableLoading: true,
                    noPagi: true,
                    pagi: {
                        currentPage: 1,
                        pageSize: 10,
                        pageTotal: '',
                        total: ''
                    },
                    selectedData: [],
                    submitLoading: false                    
                },


                characterOptions: [
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'教师'
                    },
                    {
                        value:'1',
                        label:'校领导'
                    }
                ],
                characterDialogOptions: [
                    {
                        value:'0',
                        label:'教师'
                    },
                    {
                        value:'1',
                        label:'校领导'
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
            // 获取教职工列表
            getList: function() {
                this.tableloading = true;

                let param = {
                    'schoolId': this.searchForm.schoolId,
                    'account': this.searchForm.account,
                    'type': this.searchForm.character,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                schoolStaffList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取教职工列表失败！', type: 'error'});
                });
            },

            // 搜索学校
            keyDownSubmit: function() {
                that.getSchoolList();
            },

            // 添加教职工
            handleSchoolStaffAdd: function() {
                this.staffDialog.searchParam = '';
                this.staffDialog.selectedData = [];
                this.staffDialogShow = true;

                this.getStaffDialogList();                
            },

            // 获取所有教职工列表
            getStaffDialogList: function() {
                this.staffDialog.tableLoading = true;

                let param = {
                    'searchParam': this.staffDialog.searchParam,
                    'schoolId': this.searchForm.schoolId,
                    'pageNo': this.staffDialog.pagi.currentPage,
                    'pageSize': this.staffDialog.pagi.pageSize
                };

                notContainsSchoolStaffList(param).then(res => {
                    this.staffDialog.tableLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.staffDialog.noPagi = true;
                            this.staffDialog.tableData = [];
                            return false;
                        }

                        this.staffDialog.tableData = data.list;
                        if(data.total % this.staffDialog.pagi.pageSize == 0) {
                            this.staffDialog.pagi.pageTotal = data.total/this.staffDialog.pagi.pageSize;
                        } else {
                            this.staffDialog.pagi.pageTotal = parseInt(data.total/this.staffDialog.pagi.pageSize) + 1;
                        }
                        this.staffDialog.pagi.total = data.total;
                        this.staffDialog.noPagi = false;
                    }
                }).catch(error => {
                    this.staffDialog.tableLoading = false;
                    this.$message({ message: '网络异常！获取所有教职工列表失败！', type: 'error'});
                });
            },
            // 所有教职工列表分页
            handleStaffDialogPageChange: function(val) {
                this.staffDialog.pagi.currentPage = parseInt(val);
                this.getStaffDialogList();
            },
            // 所有教职工列表搜索
            staffDialogSearch: function() {
                this.staffDialog.pagi.currentPage = 1;
                this.getStaffDialogList();
            },
            // 所有教职工列表选中checkbox触发事件
            staffDialogSelect: function(val) {
                this.staffDialog.selectedData = val;
            },
            // 所有教职工列表删除已选中
            handleStaffDialogSelectedDelete: function(index, row) {
                this.staffDialog.selectedData.splice(index, 1);
            },
            // 添加教职工保存
            staffDialogSubmit: function() {
                if(this.staffDialog.selectedData.length == 0) {
                    this.$message({ message: '请选择需要添加的教职工', type: 'error'});
                    return false;
                }

                this.staffDialog.submitLoading = true;

                let ids = [];
                for(let i = 0; i < this.staffDialog.selectedData.length; i++) {
                    let item = this.staffDialog.selectedData[i];

                    ids.push({
                        "memberId": item.memberId,
                        "schoolCode": this.searchForm.schoolCode,
                        "type": item.type
                    });
                }

                let param = {
                    'jsonStr': JSON.stringify(ids)
                };

                schoolStaffAdd(param).then(res => {
                    this.staffDialog.submitLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '保存成功', type: 'success'});
                        this.staffDialogShow = false;
                        this.getList();
                    }
                }).catch(error => {
                    this.staffDialog.submitLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });
            },            

            // 从该校去除
            handleSchoolStaffDelete: function(index, row) {
                let param = {
                    'id': row.id
                };

                schoolStaffDelete(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '从该校成功移除', type: 'success'});
                        this.tableData.splice(index, 1);
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！移除失败！', type: 'error'});
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
</style>

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
            height: calc(100% - 40px);
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
</style>

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

