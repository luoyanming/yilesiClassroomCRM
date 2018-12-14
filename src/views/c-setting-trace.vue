<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>行为轨迹显示</el-breadcrumb-item>
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
            <div class="light-overscroll" v-if="showData">
                
                <div class="setting-list">
                    <el-card class="box-card" v-for="(item, index) in listData" :key="index">
                        <div slot="header">
                            <div class="title" v-if="item.schoolRegion == 1 && item.type == 1">标签为校门的进出校轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 1 && item.type == 2">标签为校门的停留校轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 2 && item.type == 1">标签为危险区域里所有标签的区域进出轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 2 && item.type == 2">标签为危险区域里所有标签的区域停留轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 3 && item.type == 1">标签为限制区域里所有标签的区域进出轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 3 && item.type == 2">标签为限制区域里所有标签的区域停留轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 4 && item.type == 1">标签为宿舍楼的进出轨迹，包括男宿舍和女宿舍</div>
                            <div class="title" v-if="item.schoolRegion == 4 && item.type == 2">标签为宿舍楼的停留轨迹，包括男宿舍和女宿舍</div>
                            <div class="title" v-if="item.schoolRegion == 5 && item.type == 1">其他标签或没有标签的进出区域轨迹</div>
                            <div class="title" v-if="item.schoolRegion == 5 && item.type == 2">其他标签或没有标签的停留区域轨迹</div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">校领导</div>
                            <div class="switch">
                                <el-switch v-model="item.schoolLeader" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(index, item.id, 1)"></el-switch>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">教师</div>
                            <div class="switch">
                                <el-switch v-model="item.teacher" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(index, item.id, 2)"></el-switch>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">家长</div>
                            <div class="switch">
                                <el-switch v-model="item.parent" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(index, item.id, 3)"></el-switch>
                            </div>
                        </div>
                    </el-card>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { schoolList, schoolPersonalTraceSet, schoolPersonalTraceSetUpdate } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showData: false,

                switchYes: 1,
                switchNo: 0,

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
                    schoolCode: ''
                },

                listData: []             

                                
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

                this.showData = true;

                this.getData();
            },
            // 获取数据
            getData: function() {
                let fullPageLoading = Loading.service({ fullscreen: true });

                let param = {
                    schoolId: this.searchForm.schoolId
                };

                schoolPersonalTraceSet(param).then(res => {
                    fullPageLoading.close();

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        let listData = data.schoolTraSetList;
                        // if(listData && listData.length > 0) {
                        //     for(let i = 0; i < listData.length; i++) {

                        //     }
                        // }
                        this.listData = listData;
                    }
                }).catch(error => {
                    fullPageLoading.close();
                    this.$message({ message: '网络异常！获取数据失败！', type: 'error'});
                });
            },

            // 搜索学校
            keyDownSubmit: function() {
                that.getSchoolList();
            },

            // 保存修改
            handleSwitchChange: function(index, id, type) {
                let fullPageLoading = Loading.service({ fullscreen: true });

                let listData = this.listData;
                    status = '';

                if(type == 1) {
                    status = this.listData[index].schoolLeader;
                } else if(type == 2) {
                    status = this.listData[index].teacher;
                } else if(type == 3) {
                    status = this.listData[index].parent;
                }

                let param = {
                    'id': id,
                    'type': type,
                    'status': status
                };

                schoolPersonalTraceSetUpdate(param).then(res => {
                    fullPageLoading.close();

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '保存成功', type: 'success'});
                    }
                }).catch(error => {
                    fullPageLoading.close();
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

<style lang="scss">
    .setting-list{
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

                .item{
                    padding: 10px 0;
                    border-top: 1px solid #eee;

                    &:first-child{
                        border-top: none;
                    }

                    .label{
                        color: #333;
                    }
                }
            }
        }
    }
</style>

