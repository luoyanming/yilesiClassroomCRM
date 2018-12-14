<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="btn-wrap">
            <el-button type="primary" size="small" class="" :disabled="tabNav == 1" @click.native="handleTabNavChange(1)">由系统发起</el-button>
            <el-button type="primary" size="small" class="" :disabled="tabNav == 2" @click.native="handleTabNavChange(2)">由用户发起</el-button>
        </section>

        <div class="pull-left">
            <div class="search-box">
                <el-select v-model="schoolId" placeholder="请选择学校" @change="handleSchoolChange">
                    <el-option v-for="item in schoolOptions" :key="item.id" :label="item.fullName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="light-overscroll" v-show="tabNav == 1">
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
            <div class="light-overscroll" v-show="tabNav == 2" style="position: relative;">
                <div class="statistics-input-wrap">
                    <el-input v-model="teacherName" placeholder="搜索老师名称" icon="search" :on-icon-click="handleTeacherSearchClick"></el-input>
                </div>
                <div class="statistics-teacher-list" v-loading.body="teacherSearchLoading">
                    <p v-for="item in teacherData" key="item.id" :class="teacherId == item.id ? 'list-item selected' : 'list-item'" @click="handleSelectTeacher(item.id)">{{ item.name }}</p>
                </div>
            </div>
        </div>

        <div class="pull-right">
            <div class="light-overscroll" v-if="showTable">
                
                <section class="search clearfix">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="" class="week-picker">
                            <el-input v-model="weekDuration" class="week-picker-input" placeholder="请选择时间范围"></el-input>
                            <el-date-picker v-model="week" type="week" format="yyyy-MM-dd" placeholder="请选择时间范围" :picker-options="pickerOptions" @change="handleWeekChange" class="week-picker-picker"></el-date-picker>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleExport" v-if="showSystemStatisticsData">导出</el-button>
                </section>

                <div class="" style="height: calc(100% - 68px);" v-loading.body="systemStatisticsLoading" v-if="showSystemStatisticsData">
                    <section class="table" style="height: auto;">
                        <el-table :data="tableData" style="width: 100%" class="class-statistics-table" v-if="tabNav == 1">
                            <el-table-column label="">
                                <template scope="scope"><p>{{ scope.row[0] }}</p></template>
                            </el-table-column>
                            <el-table-column label="周一">
                                <template scope="scope">
                                    <p v-for="item in scope.row[1]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周二">
                                <template scope="scope">
                                    <p v-for="item in scope.row[2]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周三">
                                <template scope="scope">
                                    <p v-for="item in scope.row[3]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周四">
                                <template scope="scope">
                                    <p v-for="item in scope.row[4]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周五">
                                <template scope="scope">
                                    <p v-for="item in scope.row[5]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周六">
                                <template scope="scope">
                                    <p v-for="item in scope.row[6]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周日">
                                <template scope="scope">
                                    <p v-for="item in scope.row[7]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-table :data="tableData" style="width: 100%" class="teacher-statistics-table" v-if="tabNav == 2">
                            <el-table-column label="周一">
                                <template scope="scope">
                                    <p v-for="item in scope.row[0]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周二">
                                <template scope="scope">
                                    <p v-for="item in scope.row[1]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周三">
                                <template scope="scope">
                                    <p v-for="item in scope.row[2]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周四">
                                <template scope="scope">
                                    <p v-for="item in scope.row[3]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周五">
                                <template scope="scope">
                                    <p v-for="item in scope.row[4]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周六">
                                <template scope="scope">
                                    <p v-for="item in scope.row[5]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="周日">
                                <template scope="scope">
                                    <p v-for="item in scope.row[6]" key="item"><i class="el-icon-star-on" v-if="item.regionWork"></i> {{ item.regionName }}={{ item.score }}</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, schoolList, attendanceSystemStatistics, attendanceTeacherStatistics, schoolTeacherList } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                tabNav: 1,

                showTable: false,

                // 左侧学校列表
                schoolId: '',
                schoolPeriodId: '',
                schoolGradeId: '',
                schoolClassId: '',

                schoolOptions: [],
                treeOptions: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                currentKeys: [],
                currentKey: '',

                systemStatisticsLoading: true,
                showSystemStatisticsData: false,
                week: '',
                weekDuration: '',
                pickerOptions: {
                    firstDayOfWeek: 1
                },
                tableData: [],

                teacherName: '',
                teacherSearchLoading: false,
                teacherData: [],
                teacherId: ''

                
            };
        },
        methods: {
            // tab切换
            handleTabNavChange: function(tabNav) {
                this.tabNav = tabNav;

                this.schoolId = '';
                this.treeOptions = [];
                this.showTable = false;
                this.teacherName = '';
                this.teacherSearchLoading = false;
                this.teacherData = [];
                this.teacherId = '';
            },
            // 获取学校列表
            getSchoolList: function() {
                let param = {
                    'name': '',
                    'pageNo': 1,
                    'pageSize': 5000
                };

                schoolList(param).then(res => {
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
                this.schoolId = val;

                for(let i = 0; i < this.schoolOptions.length; i++) {
                    let item = this.schoolOptions[i];

                    if(val == item.id) {
                        this.showTable = false;
                        this.showSystemStatisticsData = false;
                        this.week = '';
                        this.weekDuration = '';
                        this.tableData = [];   
                        this.teacherId = '';                     

                        if(this.tabNav == 1) {
                            this.setTreeOptions(item);
                        } else {
                            this.getTeacherList();
                        }
                        
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
                        let gradeItem = gradeVoList[j],
                            classVoList = gradeItem.schoolClassList,
                            classArr = [];

                        for(let k = 0; k < classVoList.length; k++) {
                            let classItem = classVoList[k];

                            classArr.push({
                                'id': classItem.id,
                                'label': classItem.name,
                                'periodId': classItem.period,
                                'key': periodItem.periodValue + '-' + gradeItem.id + '-' + classItem.id,
                                'gradeId': classItem.schoolSystemGradeId
                            });
                        }

                        gradeArr.push({
                            'id': gradeItem.id,
                            'label': gradeItem.name,
                            'periodId': gradeItem.period,
                            'key': periodItem.periodValue + '-' + gradeItem.id,
                            'children': classArr
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
                if(data.gradeId && data.periodId) {
                    // 选中班级
                    this.schoolPeriodId = data.periodId;
                    this.schoolGradeId = data.gradeId;
                    this.schoolClassId = data.id;

                    this.showTable = true;
                    this.showSystemStatisticsData = false;
                    this.week = '';
                    this.weekDuration = '';
                    this.tableData = [];
                    this.teacherId = '';
                } else if(!data.gradeId && data.periodId) {
                    // 选中年级
                    this.schoolPeriodId = data.periodId;
                    this.schoolGradeId = data.id;
                    this.schoolClassId = '';

                    this.showTable = false;
                } else {
                    // 选中学段
                    this.schoolPeriodId = data.id;
                    this.schoolGradeId = '';
                    this.schoolClassId = '';

                    this.showTable = false;
                }
            },
            // 教师搜索
            handleTeacherSearchClick: function() {
                if(!this.schoolId) {
                    this.$message({ message: '请选择学校！', type: 'error'});
                    return false;
                }

                this.showTable = false;
                this.showSystemStatisticsData = false;
                this.week = '';
                this.weekDuration = '';
                this.teacherId = '';
                this.tableData = [];                  

                this.getTeacherList();
            },
            // 获取教师列表
            getTeacherList: function() {
                this.teacherSearchLoading = true;

                let param = {
                    'schoolId': this.schoolId,
                    'teacherName': this.teacherName
                };

                schoolTeacherList(param).then(res => {
                    this.teacherSearchLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.teacherData = data;
                    }
                }).catch(error => {
                    this.teacherSearchLoading = false;

                    this.$message({ message: '网络异常！获取教师列表失败！', type: 'error'});
                });                
            },
            // 选择教师
            handleSelectTeacher: function(teacherId) {
                if(this.teacherId == teacherId) {
                    return false;
                }

                this.teacherId = teacherId;

                this.showTable = true;
                this.showSystemStatisticsData = false;
                this.week = '';
                this.weekDuration = '';
                this.tableData = [];
            },
            // 选择星期
            handleWeekChange: function(e) {
                if(!e) {
                    return false;
                }

                let startDate = COMMON.getMonday(e),
                    endDate = COMMON.getSunday(e);

                this.weekDuration = startDate + ' ~ ' + endDate;

                if(this.tabNav == 1) {
                    this.getAttendanceSystemStatistics();
                } else if(this.tabNav == 2) {
                    this.getAttendanceTeacherStatistics();
                }
                
            },

            // =======================================================
            // 获取班级统计考勤
            getAttendanceSystemStatistics: function() {
                this.showSystemStatisticsData = true;
                this.systemStatisticsLoading = true;

                let param = {
                    'classId': this.schoolClassId,
                    'startDate': COMMON.getMonday(this.week)
                };

                attendanceSystemStatistics(param).then(res => {
                    this.systemStatisticsLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.dataPackageSystem(data);
                    }
                }).catch(error => {
                    this.systemStatisticsLoading = false;
                    this.$message({ message: '网络异常！获取失败！', type: 'error'});
                });
            },
            // 重新封装汇总表数据 -- 班级
            dataPackageSystem: function(data) {
                let classLength = parseInt(data.maxRow),
                    packageData = [];

                data = data.list;


                for(let i = 0; i < classLength; i++) { //课时长度
                    let classSort = '',
                        classItem = [];
                    switch (i) {
                        case 0:
                            classSort = '一';
                            break;
                        case 1:
                            classSort = '二';
                            break;
                        case 2:
                            classSort = '三';
                            break;
                        case 3:
                            classSort = '四';
                            break;
                        case 4:
                            classSort = '五';
                            break;
                        case 5:
                            classSort = '六';
                            break;
                        case 6:
                            classSort = '七';
                            break;
                        case 7:
                            classSort = '八';
                            break;
                        case 8:
                            classSort = '九';
                            break;
                        case 9:
                            classSort = '十';
                            break;
                        case 10:
                            classSort = '十一';
                            break;
                        case 11:
                            classSort = '十二';
                            break;
                        case 12:
                            classSort = '十三';
                            break;
                        case 13:
                            classSort = '十四';
                            break;
                        case 14:
                            classSort = '十五';
                            break;
                        default:
                            classSort = i;
                            break;                            
                    }

                    classItem.push('第'+ classSort +'课时');

                    for(let j = 0; j < data.length; j++) { //周几长度
                        let dataItem = data[j],
                            listItem = [];

                        if(dataItem.list.length > 0) { //某周几课时数据
                            for(let k = 0; k < dataItem.list.length; k++) {
                                if(dataItem.list[k].numberOfClass == i + 1) {
                                    classItem.push(dataItem.list[k].infoList);
                                    break;
                                }
                            }
                        } else {
                            classItem.push('');
                        }
                    }

                    packageData.push(classItem)
                }

                this.tableData = packageData;
            },

            // =======================================================
            // 获取教师统计考勤
            getAttendanceTeacherStatistics: function() {
                this.showSystemStatisticsData = true;
                this.systemStatisticsLoading = true;

                let param = {
                    'teacherId': this.teacherId,
                    'startDate': COMMON.getMonday(this.week)
                };

                attendanceTeacherStatistics(param).then(res => {
                    this.systemStatisticsLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.dataPackageTeacher(data);
                    }
                }).catch(error => {
                    this.systemStatisticsLoading = false;
                    this.$message({ message: '网络异常！获取失败！', type: 'error'});
                });
            },
            // 重新封装汇总表数据 -- 教师
            dataPackageTeacher: function(data) {
                let classLength = parseInt(data.maxRow),
                    packageData = [],
                    listLength = 0;

                data = data.list;


                for(let i = 0; i < classLength; i++) { //课时长度
                    let classItem = [];

                    for(let j = 0; j < data.length; j++) { //周几长度
                        let dataItem = data[j],
                            listItem = [];

                        if(dataItem.list.length > 0) { //某周几课时数据
                            if(dataItem.list.length > listLength) {
                                listLength = dataItem.list.length;
                            }
                            for(let k = 0; k < dataItem.list.length; k++) {
                                if(i == k) {
                                    classItem.push(dataItem.list[k].list);
                                    break;
                                }
                            }
                        } else {
                            classItem.push('');
                        }
                    }

                    packageData.push(classItem)

                    packageData = packageData.splice(0, listLength);
                }

                this.tableData = packageData;                
            },

            // 导出
            handleExport: function() {
                if(this.tabNav == 1) {
                    location.href = uploadPath + '/attendance/systemStatistics/exportExcel?classId=' + this.schoolClassId + '&startDate=' + COMMON.getMonday(this.week);
                } else if(this.tabNav == 2) {
                    location.href = uploadPath + '/attendance/teacherStatistics/exportExcel?teacherId=' + this.teacherId + '&startDate=' + COMMON.getMonday(this.week);
                }
            }
        },
        mounted() {
            that = this;

            // console.log(COMMON.getMonday(new Date()), COMMON.getPreviousMonday(COMMON.getMonday(new Date())))

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

        .el-select{
            width: 100%;

            .el-input{
                .el-input__icon{
                    color: #18c79c;
                }
            }
        }
    }

    .week-picker{
        .el-form-item__content{
            position: relative;
        }

        .week-picker-input{
            .el-input__inner{
                width: 200px !important;
            }
        }

        .week-picker-picker{
            position: absolute;
            z-index: 3;
            top: 0;
            left: 0;
            width: 200px !important;

            .el-input__inner{
                width: 100% !important;
                opacity: 0;
            }
        }
    }

    .class-statistics-table{
        .el-table__header-wrapper{
            background: #18c79c;

            tr th{
                border-right: 1px solid #FFF !important;
                border-bottom: 1px solid #FFF !important;

                .cell{
                    color: #FFF !important;
                    font-weight: 500 !important;
                    font-size: 14px !important;
                    text-align: center !important;                    
                }
            }
        }

        .el-table__body-wrapper{
            .el-table__body{
                .el-table__row{
                    td{
                        border-right: 1px solid rgb(223, 236, 234) !important;
                        border-bottom: 1px solid rgb(223, 236, 234) !important;

                        .cell{
                            padding-left: 5px !important;
                            padding-right: 5px !important;                            
                        }

                        &:first-child{
                            background: #18c79c;

                            .cell{
                                padding-left: 10px !important;
                                padding-right: 10px !important;

                                p{
                                    color: #FFF;
                                    font-weight: 500;
                                    font-size: 14px;
                                    text-align: center;
                                }                                
                            }
                        }
                    }
                }
            }
        }
    }

    .teacher-statistics-table{
        .el-table__header-wrapper{
            background: #18c79c;

            tr th{
                border-right: 1px solid #FFF !important;
                border-bottom: 1px solid #FFF !important;

                .cell{
                    color: #FFF !important;
                    font-weight: 500 !important;
                    font-size: 14px !important;
                    text-align: center !important;                    
                }
            }
        }

        .el-table__body-wrapper{
            .el-table__body{
                .el-table__row{
                    td{
                        border-right: 1px solid rgb(223, 236, 234) !important;
                        border-bottom: 1px solid rgb(223, 236, 234) !important;

                        .cell{
                            padding-left: 5px !important;
                            padding-right: 5px !important;                            
                        }
                    }
                }
            }
        }
    }    

    .statistics-input-wrap{
        padding: 10px;
        border-bottom: 1px solid #E5E5E5;
        background: #FFF;

        .el-input{
            font-size: 12px;
        }
    }

    .statistics-teacher-list{
        padding: 10px 0;

        .list-item{
            padding: 10px 20px;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            background: transparent;
            cursor: pointer;

            &.selected{
                background: #18c79c;
                color: #FFF;
                cursor: default;
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
            height: calc(100% - 59px);
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
            height: calc(100% - 34px);
            overflow: hidden;

            .light-overscroll{
                height: 100%;
            }
        }
    }
</style>

