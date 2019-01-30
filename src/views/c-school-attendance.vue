<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>学校考勤时间表</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <div class="pull-left" v-loading.body="schoolLoading">
            <div class="search-box">
                <el-select v-model="schoolId" placeholder="请选择学校" @change="handleSchoolChange">
                    <el-option v-for="item in schoolOptions" :key="item.id" :label="item.fullName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="light-overscroll">
                <el-tree
                  empty-text="暂无数据"
                  :data="treeOptions"
                  :props="defaultProps"
                  auto-expand-parent
                  :default-expanded-keys="currentKeys"
                  :current-node-key="currentKey"
                  node-key="key"
                  ref="tree"
                  accordion
                  highlight-current
                  @node-click="handleNodeClick">
                </el-tree>
            </div>
        </div>
        <div class="pull-right">
            <div class="light-overscroll" v-if="showTable" >
                
                <section class="search clearfix">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="课时设置"></el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd(0)" style="margin-left: 20px;">新增课时</el-button>
                    <el-button type="primary" size="small" class="btn-add" icon="menu" @click.native="handleReuse">复用课时</el-button>
                </section>

                <section class="table" style="height: auto;">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="课时名称">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="课时顺序">
                            <template scope="scope"><p>{{ scope.row.sort }}</p></template>
                        </el-table-column>
                        <el-table-column label="课时开始时间">
                            <template scope="scope"><p>{{ scope.row.startTime }}</p></template>
                        </el-table-column>
                        <el-table-column label="课时结束时间">
                            <template scope="scope"><p>{{ scope.row.endTime }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleAdd(1, scope.$index, scope.row)">编辑</el-button>
                                <span class="button-separate">|</span>
                                <el-button size="small" class="button-link" @click="handleDelete(scope.row)">删除</el-button>
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

                <el-dialog :title="dialogInfo.type == 0 ? '新增课时' : '编辑课时'" :visible.sync="dialogShow" :modal-append-to-body="false" class="attendance-dialog" custom-class="w850">
                    <section class="formation"> 
                       
                        <el-form label-position="right" label-width="180px" :model="dialogInfo">
                            <el-form-item label="课时名称">
                                <el-input v-model="dialogInfo.name"></el-input>
                            </el-form-item>
                            <el-form-item label="课时开始时间">
                                <el-select v-model="dialogInfo.startHour" placeholder="请选择">
                                    <el-option v-for="item in hourOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                :
                                <el-select v-model="dialogInfo.startMinute" placeholder="请选择">
                                    <el-option v-for="item in minuteOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                :
                                <el-select v-model="dialogInfo.startSecond" placeholder="请选择">
                                    <el-option v-for="item in secondOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="课时结束时间">
                                <el-select v-model="dialogInfo.endHour" placeholder="请选择">
                                    <el-option v-for="item in hourOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                :
                                <el-select v-model="dialogInfo.endMinute" placeholder="请选择">
                                    <el-option v-for="item in minuteOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select> 
                                :
                                <el-select v-model="dialogInfo.endSecond" placeholder="请选择">
                                    <el-option v-for="item in secondOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>                                
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="dialogLoading" @click.native="submitForm">保存</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="复用课时表" :visible.sync="reUsedDialogShow" :modal-append-to-body="false" class="attendance-dialog">
                    <section class="formation"> 
                       
                        <el-form label-position="right" label-width="180px" :model="reUsedDialogInfo">
                            <el-form-item label="选择学校">
                                <el-select v-model="reUsedDialogInfo.schoolId" placeholder="请选择" @change="handleReusedSchoolChange">
                                    <el-option v-for="item in schoolOptions" :key="item.id" :label="item.fullName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择学段">
                                <el-select v-model="reUsedDialogInfo.periodId" placeholder="请选择" @change="handleReusedPeriodChange">
                                    <el-option v-for="item in periodOptions" :key="item.periodValue" :label="item.periodName" :value="item.periodValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择年级">
                                <el-select v-model="reUsedDialogInfo.gradeId" placeholder="请选择">
                                    <el-option v-for="item in gradeOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="reusedDialogLoading" @click.native="reuseSubmitForm">保存</el-button>
                    </span>
                </el-dialog>                
            </div>
        </div>
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { schoolList, schoolGradeList, schoolAttendanceList, schoolAttendanceAdd, schoolAttendanceEdit, schoolAttendanceDelete, schoolAttendanceReUsed, schoolAttendanceCanUsePeriodList, schoolAttendanceCanUseGradeList } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showTable: false,

                // 左侧学校列表
                schoolLoading: true,
                schoolId: '',
                schoolPeriodId: '',
                schoolGradeId: '',

                schoolOptions: [],
                treeOptions: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                currentKeys: [],
                currentKey: '', 


                tableData: [],
                tableloading: true,

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },

                hourOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ],
                minuteOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ],
                secondOptions: [
                    {
                        'id': '',
                        'name': '请选择'
                    }
                ],                

                dialogInfo: {
                    type: '',
                    id: '',
                    name: '',
                    startHour: '',
                    startMinute: '',
                    startSecond: '',
                    endHour: '',
                    endMinute: '',
                    endSecond: ''
                },
                dialogShow: false,
                dialogLoading: false,


                reUsedDialogShow: false,
                reUsedDialogInfo: {
                    schoolId: '',
                    periodId: '',
                    gradeId: ''
                },
                periodOptions: [],
                gradeOptions: [],
                reusedDialogLoading: false
            };
        },
        methods: {
            // 设置事件选择列表
            setTimeOptions: function() {
                for(let i = 0; i < 24; i++) {
                    this.hourOptions.push({
                        'id': i < 10 ? '0' + i : '' + i,
                        'name': i < 10 ? '0' + i : '' + i
                    })
                }
                for(let i = 0; i < 60; i++) {
                    this.minuteOptions.push({
                        'id': i < 10 ? '0' + i : '' + i,
                        'name': i < 10 ? '0' + i : '' + i
                    })
                    this.secondOptions.push({
                        'id': i < 10 ? '0' + i : '' + i,
                        'name': i < 10 ? '0' + i : '' + i
                    })                    
                }                
            },
            // 获取学校列表
            getSchoolList: function() {
                this.schoolLoading = true;

                let param = {
                    'name': '',
                    'pageNo': 1,
                    'pageSize': 5000
                };

                schoolList(param).then(res => {
                    this.schoolLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list && data.list.length > 0) {
                            this.schoolOptions = data.list;

                            if(this.$route.query.school) {
                                that.schoolId = parseInt(this.$route.query.school);
                            }
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取学校列表失败！', type: 'error'});
                });
            },
            // 选择学校触发的事件
            handleSchoolChange: function(val) {
                for(let i = 0; i < this.schoolOptions.length; i++) {
                    let item = this.schoolOptions[i];

                    if(val == item.id) {
                        this.setTreeOptions(item);
                        break;
                    }
                }
            },
            // 生成树结构数据
            setTreeOptions: function(school) {
                this.treeOptions = [];
                let periodVoList = school.periodVoList;
                for(let i = 0; i < periodVoList.length; i++) {
                    let periodItem = periodVoList[i],
                        gradeVoList = periodItem.schoolSystemGradeVoList,
                        gradeArr = [];

                    for(let j = 0; j < gradeVoList.length; j++) {
                        let gradeItem = gradeVoList[j];

                        gradeArr.push({
                            'id': gradeItem.id,
                            'label': gradeItem.name,
                            'periodId': gradeItem.period,
                            'key': periodItem.periodValue + '-' + gradeItem.id
                        });
                    }

                    this.treeOptions.push({
                        'id': periodItem.periodValue,
                        'label': periodItem.periodName,
                        'key': '' + periodItem.periodValue,
                        'children': gradeArr
                    });
                }
            },
            // 选择节点触发的事件
            handleNodeClick(data) {
                if(!data.gradeId && data.periodId) {
                    // 选中年级
                    this.schoolPeriodId = data.periodId;
                    this.schoolGradeId = data.id;
                    this.schoolClassId = '';

                    this.showTable = true;

                    that.getList();
                } else {
                    // 选中学段
                    this.schoolPeriodId = data.id;
                    this.schoolGradeId = '';
                    this.schoolClassId = '';
                }
            },


            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取列表
            getList: function() {
                this.tableloading = true;

                let param = {
                    'schoolId': this.schoolId,
                    'schoolSystemGradeId': this.schoolGradeId,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                schoolAttendanceList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取班级列表失败！', type: 'error'});
                });
            },

            // 新增、编辑
            handleAdd: function(type, index, row) {
                this.dialogShow = true;

                setTimeout(function() {
                    if(type == 0) {
                        // add
                        that.dialogInfo = {
                            type: type,
                            index: '',
                            id: '',
                            name: '',
                            startHour: '',
                            startMinute: '',
                            startSecond: '',
                            endHour: '',
                            endMinute: '',
                            endSecond: ''
                        };
                        that.dialogLoading = false;
                    } else if(type == 1) {
                        // edit
                        let startTimeArr = row.startTime.split(':'),
                            endTimeArr = row.endTime.split(':');
                        that.dialogInfo = {
                            type: type,
                            index: index,
                            id: row.id,
                            name: row.name,
                            startHour: startTimeArr[0] || '00',
                            startMinute: startTimeArr[1] || '00',
                            startSecond: startTimeArr[2] || '00',
                            endHour: endTimeArr[0] || '00',
                            endMinute: endTimeArr[1] || '00',
                            endSecond: endTimeArr[2] || '00'
                        };
                        that.dialogLoading = false;
                    }
                }, 1);
            },

            // 提交用户信息
            submitForm: function(formName) {
                if(this.dialogLoading) {
                    return false;
                }

                if(!this.dialogInfo.name) {
                    this.$message({ message: '请输入课时名称', type: 'error' });
                    return false;
                }                
                if(!this.dialogInfo.startHour || !this.dialogInfo.startMinute || !this.dialogInfo.startSecond) {
                    this.$message({ message: '请选择课时开始时间', type: 'error' });
                    return false;
                }
                if(!this.dialogInfo.endHour || !this.dialogInfo.endMinute || !this.dialogInfo.endSecond) {
                    this.$message({ message: '请选择课时结束时间', type: 'error' });
                    return false;
                }

                this.dialogLoading = true;

                

                if(this.dialogInfo.type == 0) {
                    // 新增
                    let params = {
                        'schoolId': this.schoolId,
                        'schoolSystemGradeId': this.schoolGradeId,
                        'name': this.dialogInfo.name,
                        'startTime': this.dialogInfo.startHour + ':' + this.dialogInfo.startMinute + ':' + this.dialogInfo.startSecond,
                        'endTime': this.dialogInfo.endHour + ':' + this.dialogInfo.endMinute + ':' + this.dialogInfo.endSecond
                    };                    
                    schoolAttendanceAdd(params).then(res=>{
                        let { errorInfo, code, data } = res;

                        if(code !== 0){
                            this.dialogLoading = false;

                            this.$message({ message: errorInfo, type: 'error' });
                        }else{
                            this.$message({ message: '保存成功！', type: 'success' });
                            this.dialogShow = false;
                            this.getList();
                        }
                    }).catch(error => {
                        this.dialogLoading = false;
                        this.$message({ message: '网络异常！保存失败！', type: 'error'});
                    });                    
                } else if(this.dialogInfo.type == 1) {
                    // 编辑
                    let params = {
                        'id': this.dialogInfo.id,
                        'name': this.dialogInfo.name,
                        'startTime': this.dialogInfo.startHour + ':' + this.dialogInfo.startMinute + ':' + this.dialogInfo.startSecond,
                        'endTime': this.dialogInfo.endHour + ':' + this.dialogInfo.endMinute + ':' + this.dialogInfo.endSecond
                    };                    
                    schoolAttendanceEdit(params).then(res=>{
                        let { errorInfo, code, data } = res;

                        if(code !== 0){
                            this.dialogLoading = false;

                            this.$message({ message: errorInfo, type: 'error' });
                        }else{
                            this.$message({ message: '保存成功！', type: 'success' });
                            this.dialogShow = false;
                            this.getList();
                        }
                    }).catch(error => {
                        this.dialogLoading = false;
                        this.$message({ message: '网络异常！保存失败！', type: 'error'});
                    });
                }
            },

            // 删除
            handleDelete: function(row) {
                let params = {
                    'id': row.id,
                };                    
                schoolAttendanceDelete(params).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '删除成功！', type: 'success' });
                        this.getList();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！操作失败！', type: 'error'});
                });                 
            },

            // 复用课时
            handleReuse: function() {
                this.reUsedDialogShow = true;
                this.periodOptions = [];
                this.gradeOptions = [];
                this.reUsedDialogInfo = {
                    schoolId: this.schoolId || '',
                    periodId: '',
                    gradeId: ''
                }
                this.reusedDialogLoading = false;

                if(this.schoolId) {
                    this.handleReusedSchoolChange(this.schoolId);
                }
            },
            // 复用课时 - 选择学校触发的事件
            handleReusedSchoolChange: function(val) {
                if(!val) {
                    return false;
                }

                let param = {
                    schoolId: val
                };

                schoolAttendanceCanUsePeriodList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.periodOptions = data.list;
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取失败！', type: 'error'});
                });
            },

            // 复用课时 - 选择学段触发的事件
            handleReusedPeriodChange: function(val) {
                if(!val) {
                    return false;
                }                

                let param = {
                    schoolId: this.reUsedDialogInfo.schoolId,
                    periodValue: val,
                    toSchoolId: this.schoolId,
                    toSchoolSystemGradeId: this.schoolGradeId
                };

                schoolAttendanceCanUseGradeList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.gradeOptions = data.list;
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取失败！', type: 'error'});
                });                         
            },

            // 复用课时 - 提交数据
            reuseSubmitForm: function() {
                if(this.reusedDialogLoading) {
                    return false;
                }

                if(!this.reUsedDialogInfo.schoolId) {
                    this.$message({ message: '请选择学校', type: 'error' });
                    return false;
                }
                if(!this.reUsedDialogInfo.periodId) {
                    this.$message({ message: '请选择学段', type: 'error' });
                    return false;
                }
                if(!this.reUsedDialogInfo.gradeId) {
                    this.$message({ message: '请选择年级', type: 'error' });
                    return false;
                }


                this.reusedDialogLoading = true;

                let params = {
                    'fromSchoolId': this.reUsedDialogInfo.schoolId,
                    'fromSchoolSystemGradeId': this.reUsedDialogInfo.gradeId,
                    'toSchoolId': this.schoolId,
                    'toSchoolSystemGradeId': this.schoolGradeId
                };                    
                schoolAttendanceReUsed(params).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.reusedDialogLoading = false;

                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '保存成功！', type: 'success' });
                        this.reUsedDialogShow = false;
                        this.getList();
                    }
                }).catch(error => {
                    this.reusedDialogLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });                
            }
        },
        mounted() {
            that = this;

            this.setTimeOptions();
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


        .attendance-dialog{
            height: auto;

            .el-dialog{
                height: auto !important;
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

