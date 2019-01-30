<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>排班走班</el-breadcrumb-item>
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
                
                <div class="relation-list" v-loading="tableloading">
                    <div style="margin-bottom: 20px;">
                        <label style="margin-right: 10px;">排班走班品牌</label>
                        <el-select placeholder="请选择" v-model="detail.type">
                            <el-option v-for="item in classTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>                        
                    </div>

                    <el-card class="box-card">
                        <div slot="header">
                            <div class="title">对接的对方系统的学校编号</div>
                        </div>
                        <div class="card-content">
                            <el-input v-model="detail.oppositeSchoolCode" placeholder="请输入对方系统的学校编号"></el-input>
                        </div>
                    </el-card>

                    <el-card class="box-card">
                        <div slot="header">
                            <div class="title">教师对接唯一信息</div>
                        </div>
                        <div class="card-content">
                            <el-radio class="radio" v-for="item in teacherKeyOptions" :key="item.value" :label="item.value" v-model="detail.teacherRelationKey">{{ item.label }}</el-radio>
                        </div>
                    </el-card>

                    <el-card class="box-card">
                        <div slot="header">
                            <div class="title">学生对接唯一信息</div>
                        </div>
                        <div class="card-content">
                            <el-radio class="radio" v-for="item in studentKeyOptions" :key="item.value" :label="item.value" v-model="detail.studentRelationKey">{{ item.label }}</el-radio>
                        </div>
                    </el-card>

                    <el-button type="primary" :loading="submitLoading" @click.native="submitRelation">保存</el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { schoolList, optionClassRelationSave, optionClassRelationDetail } from '../api/api';

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

                tableloading: false,
                detail: {
                    schoolId: '',
                    schoolCode: '',
                    type: '',
                    oppositeSchoolCode: '',
                    teacherRelationKey: '',
                    studentRelationKey: ''
                },
                submitLoading: false,

                classTypeOptions: [
                    {
                        value:'',
                        label:'请选择'
                    },
                    {
                        value:'1',
                        label:'教享智慧走班'
                    },
                    {
                        value:'2',
                        label:'北京博校走班'
                    },
                    {
                        value:'3',
                        label:'科大讯飞走班'
                    }
                ],
                teacherKeyOptions: [
                    {
                        value:'1',
                        label:'手机号'
                    },
                    {
                        value:'2',
                        label:'学校账号'
                    },
                    {
                        value:'3',
                        label:'教师证'
                    },
                    {
                        value:'4',
                        label:'身份证'
                    },
                    {
                        value:'5',
                        label:'工号/工作证号'
                    }                    
                ],
                studentKeyOptions: [
                    {
                        value:'1',
                        label:'学籍号'
                    },
                    {
                        value:'2',
                        label:'学号'
                    },
                    {
                        value:'3',
                        label:'身份证'
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
            // 搜索学校
            keyDownSubmit: function() {
                this.getSchoolList();
            },
            // 选择节点触发的事件
            handleNodeClick(data) {
                this.detail.schoolId = data.id;
                this.detail.schoolCode = data.code;

                this.showTable = true;

                this.getDetail();
            },
            // 获取排班走班信息
            getDetail: function() {
                this.tableloading = true;

                let param = {
                    'schoolId': this.detail.schoolId
                };

                optionClassRelationDetail(param).then(res => {
                    this.tableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.optionClassRelation) {
                            this.detail.type = '' + data.optionClassRelation.type || '';                       
                            this.detail.oppositeSchoolCode = '' + data.optionClassRelation.oppositeSchoolCode || '';                       
                            this.detail.teacherRelationKey = '' + data.optionClassRelation.teacherRelationKey || '';                       
                            this.detail.studentRelationKey = '' + data.optionClassRelation.studentRelationKey || '';
                        } else {
                            this.detail.type = '';
                            this.detail.oppositeSchoolCode = '';
                            this.detail.teacherRelationKey = '';
                            this.detail.studentRelationKey = '';
                        }                  
                    }
                }).catch(error => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取排班走班信息失败！', type: 'error'});
                });
            },
            // 保存排班走班信息
            submitRelation: function() {
                if(!this.detail.type) {
                    this.$message({ message: '请选择排班走班品牌', type: 'error'});
                    return false;
                }
                if(!this.detail.oppositeSchoolCode) {
                    this.$message({ message: '请输入对方系统的学校编号', type: 'error'});
                    return false;
                }
                if(!this.detail.teacherRelationKey) {
                    this.$message({ message: '请选择教师对接唯一信息', type: 'error'});
                    return false;
                }
                if(!this.detail.studentRelationKey) {
                    this.$message({ message: '请选择学生对接唯一信息', type: 'error'});
                    return false;
                }

                this.submitLoading = true;

                let param = {
                    'schoolId': this.detail.schoolId,
                    'schoolCode': this.detail.schoolCode,
                    'type': this.detail.type,
                    'oppositeSchoolCode': this.detail.oppositeSchoolCode,
                    'teacherRelationKey': this.detail.teacherRelationKey,
                    'studentRelationKey': this.detail.studentRelationKey,
                }

                optionClassRelationSave(param).then(res => {
                    this.submitLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '保存成功', type: 'success'});
                        this.getDetail();
                    }
                }).catch(error => {
                    this.submitLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
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

<style lang="scss">
    .relation-list{
        margin-top: 15px;

        .box-card{
            margin-bottom: 20px;

            .el-card__header{
                padding: 10px 15px;
                background: #18c79c;

                .title{
                    font-size: 14px;
                    color: #FFFFFF;
                    font-weight: 500;
                }
            }

            .el-card__body{
                padding: 10px 15px;
            }

            .card-content{
                padding: 10px 15px;

                .el-input {
                    width: 180px;

                    .el-input__inner {
                        height: 40px;
                        font-size: 12px;
                        color: #333;
                        background: #FFFFFF;
                        border: 1px solid #E5E5E5;
                        border-radius: 2px;
                        &:hover {
                            border-color: rgb(131, 165, 162);
                        }
                        &:focus {
                            outline: 0;
                            border-color: #18c79c;
                        }
                        &::placeholder,
                        &::-webkit-input-placeholder {
                            color: rgba(51, 51, 51, .3);
                        }
                    }
                }

                .el-radio{
                    color: #333;
                }
            }
        }
    }
</style>



