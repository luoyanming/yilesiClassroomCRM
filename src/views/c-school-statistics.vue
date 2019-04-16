<template>
    <div class="main-wrapper light-overscroll luoym">
        
        <div class="school-statistics">
            <!-- tab -->
            <div class="tabs-wrap">
                <el-radio-group v-model="dateRangeType" @change="handleChangeDateRangeType">
                    <el-radio-button label="1">按周</el-radio-button>
                    <el-radio-button label="2">按月</el-radio-button>
                </el-radio-group>
            </div>

            <!-- export -->
            <div class="export-wrap" @click="handleExport">导出</div>

            <!-- title -->
            <div class="chart-title">
                <span class="title">{{ name }}基本指标</span>
                <span class="daterange">{{ dateRangeTips }}</span>
            </div>

            <div v-loading="loading">
                <!-- chart tabs -->
                <div class="chart-tabs flex-h">
                    <div :class="tabsType == 1 ? 'chart-tabs-item flex-a-i active' : 'chart-tabs-item flex-a-i'" @click="handleChangeTabs(1)">
                        <div class="label">使用总数</div>
                        <div class="num">
                            <span class="num-decrease" v-if="detail.loginNumSign == -1">{{ detail.loginNum }}</span>
                            <span class="num-nocrease" v-if="detail.loginNumSign == 0">{{ detail.loginNum }}</span>
                            <span class="num-increase" v-if="detail.loginNumSign == 1">{{ detail.loginNum }}</span>
                        </div>
                        <div class="total">
                            <span class="title">教师人数</span>
                            <span class="number">{{ detail.loginNumTotal }}人</span>
                        </div>
                    </div>
                    <div :class="tabsType == 2 ? 'chart-tabs-item flex-a-i active' : 'chart-tabs-item flex-a-i'" @click="handleChangeTabs(2)">
                        <div class="label">新建课程</div>
                        <div class="num">
                            <span class="num-decrease" v-if="detail.newCourseNumSign == -1">{{ detail.newCourseNum }}</span>
                            <span class="num-nocrease" v-if="detail.newCourseNumSign == 0">{{ detail.newCourseNum }}</span>
                            <span class="num-increase" v-if="detail.newCourseNumSign == 1">{{ detail.newCourseNum }}</span>
                        </div>
                        <div class="total">
                            <span class="title">课程总数</span>
                            <span class="number">{{ detail.newCourseNumTotal }}个</span>
                        </div>
                    </div>
                    <div :class="tabsType == 3 ? 'chart-tabs-item flex-a-i active' : 'chart-tabs-item flex-a-i'" @click="handleChangeTabs(3)">
                        <div class="label">上课数</div>
                        <div class="num">
                            <span class="num-decrease" v-if="detail.startCourseNumSign == -1">{{ detail.startCourseNum }}</span>
                            <span class="num-nocrease" v-if="detail.startCourseNumSign == 0">{{ detail.startCourseNum }}</span>
                            <span class="num-increase" v-if="detail.startCourseNumSign == 1">{{ detail.startCourseNum }}</span>
                        </div>
                        <div class="total">
                            <span class="title">上课总数</span>
                            <span class="number">{{ detail.startCourseNumTotal }}节</span>
                        </div>
                    </div>
                    <div :class="tabsType == 4 ? 'chart-tabs-item flex-a-i active' : 'chart-tabs-item flex-a-i'" @click="handleChangeTabs(4)">
                        <div class="label">课时数</div>
                        <div class="num">
                            <span class="num-decrease" v-if="detail.courseTimeSign == -1">{{ detail.courseTime }}</span>
                            <span class="num-nocrease" v-if="detail.courseTimeSign == 0">{{ detail.courseTime }}</span>
                            <span class="num-increase" v-if="detail.courseTimeSign == 1">{{ detail.courseTime }}</span>
                        </div>
                        <div class="total">
                            <span class="title">课时总数</span>
                            <span class="number">{{ detail.courseTimeTotal }}分</span>
                        </div>
                    </div>
                    <div :class="tabsType == 5 ? 'chart-tabs-item flex-a-i active' : 'chart-tabs-item flex-a-i'" @click="handleChangeTabs(5)">
                        <div class="label">发题数</div>
                        <div class="num">
                            <span class="num-decrease" v-if="detail.issueNumSign == -1">{{ detail.issueNum }}</span>
                            <span class="num-nocrease" v-if="detail.issueNumSign == 0">{{ detail.issueNum }}</span>
                            <span class="num-increase" v-if="detail.issueNumSign == 1">{{ detail.issueNum }}</span>
                        </div>
                        <div class="total">
                            <span class="title">发题总数</span>
                            <span class="number">{{ detail.issueNumTotal }}道</span>
                        </div>
                    </div>
                    <div :class="tabsType == 6 ? 'chart-tabs-item flex-a-i active' : 'chart-tabs-item flex-a-i'" @click="handleChangeTabs(6)">
                        <div class="label">互动数</div>
                        <div class="num">
                            <span class="num-decrease" v-if="detail.interactionNumSign == -1">{{ detail.interactionNum }}</span>
                            <span class="num-nocrease" v-if="detail.interactionNumSign == 0">{{ detail.interactionNum }}</span>
                            <span class="num-increase" v-if="detail.interactionNumSign == 1">{{ detail.interactionNum }}</span>
                        </div>
                        <div class="total">
                            <span class="title">互动总数</span>
                            <span class="number">{{ detail.interactionNumTotal }}次</span>
                        </div>
                    </div>
                </div>

                <!-- charts -->
                <div class="charts-box">
                    <div class="charts" id="charts"></div>

                    <!-- <div class="btn-arrow-prev disabled"> -->
                    <div :class="detail.last ? 'btn-arrow-prev' : 'btn-arrow-prev disabled'" @click="handleGetDateRangePrev">
                        <p v-if="dateRangeType == 1">上周</p>
                        <p v-if="dateRangeType == 2">上月</p>
                    </div>
                    <div :class="detail.next ? 'btn-arrow-next' : 'btn-arrow-next disabled'" @click="handleGetDateRangeNext">
                        <p v-if="dateRangeType == 1">下周</p>
                        <p v-if="dateRangeType == 2">下月</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import G2 from '@antv/g2'
    import DataSet from '@antv/data-set'
    import { Message } from 'element-ui';
    import { uploadPath, quotaStatistics } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                id: this.$route.query.id || '',
                name: this.$route.query.name ? decodeURI(decodeURIComponent(this.$route.query.name)) : '',
                dateRangeType: '1', // 1 按周； 2 按月
                dateRangeTips: '',
                tabsType: '1',
                loading: true,

                detail: {
                    "loginNum": 0, //使用
                    "loginNumSign": 0, //-1减少  0持平  1增长
                    "loginNumTotal": 0,

                    "newCourseNum": 0, //新建课程
                    "newCourseNumSign": 0,
                    "newCourseNumTotal": 0,
                    
                    "startCourseNum": 0, //上课
                    "startCourseNumSign": 0,
                    "startCourseNumTotal": 0,
                    
                    "courseTime": 0, //课时
                    "courseTimeSign": 0,
                    "courseTimeTotal": 0,
                    
                    "issueNum": 0, //发题
                    "issueNumSign": 0,
                    "issueNumTotal": 0,
                    
                    "interactionNum": 0, //互动
                    "interactionNumSign": 0,
                    "interactionNumTotal": 0,
                    
                    "next": false, //是否有下一周期
                    "last": true, //是否有上一周期
                    
                    "loginNumList": [], //每天的使用数
                    "newCourseNumList": [], //每天的新建课程数
                    "startCourseNumList": [], //每天的上课数
                    "courseTimeList": [], //每天的课时总数(分钟)
                    "issueNumList": [], //每天的发题总数
                    "interactionNumList": [] //每天的互动数
                }
            };
        },
        methods: {
            /**
             * [handleChangeDateRangeType description] 切换排序时间类型
             * @param  {[type]} type [description]
             * @return {[type]}      [description]
             */
            handleChangeDateRangeType: function(type) {
                // this.tabsType = '1';
                this.dateInit();
                this.getStatistics();
            },
            /**
             * [handleChangeTabs description]  切换数据类型
             * @param  {[type]} type [description]
             * @return {[type]}      [description]
             */
            handleChangeTabs: function(type) {
                this.tabsType = '' + type;

                this.chartInit();
            },
            /**
             * [handleGetDateRangePrev description] 上一个周期
             * @return {[type]} [description]
             */
            handleGetDateRangePrev: function() {
                if(!this.detail.last) {
                    return false;
                }

                if(this.dateRangeType == 1) {
                    this.day = new Date(new Date(this.day).getTime()  - 7 * 24 * 3600 * 1000);
                } else {
                    this.month -= 1;
                    this.date = new Date(this.year, this.month, 1);
                    this.month = this.date.getMonth();
                    this.year = this.date.getFullYear();
                }

                this.getStatistics();
            },
            /**
             * [handleGetDateRangeNext description] 下一个周期
             * @return {[type]} [description]
             */
            handleGetDateRangeNext: function() {
                if(!this.detail.next) {
                    return false;
                }

                if(this.dateRangeType == 1) {
                    this.day = new Date(new Date(this.day).getTime() + 7 * 24 * 3600 * 1000);
                } else {
                    this.month += 1;
                    this.date = new Date(this.year, this.month, 1);
                    this.month = this.date.getMonth();
                    this.year = this.date.getFullYear();
                }

                this.getStatistics();
            },
            /**
             * [dateInit description] 初始化日期
             * @return {[type]} [description]
             */
            dateInit: function() {
                this.day = new Date();
                this.year = this.day.getFullYear();
                this.month = this.day.getMonth();
            },
            /**
             * [getStatistics description] 获取统计数据
             * @return {[type]} [description]
             */
            getStatistics: function() {
                let startTime = '',
                    endTime = '';

                if(this.dateRangeType == 1) { // 按周
                    let weekMonday = new Date(this.getWeekMonday(this.day)),
                        weekSunday = new Date(this.getWeekMonday(this.day) + 6 * 24 * 3600 * 1000);

                    this.dateRangeTips = weekMonday.pattern("yyyy年MM月dd日") + '~' + weekSunday.pattern("yyyy年MM月dd日");
                    startTime = weekMonday.pattern("yyyy-MM-dd");
                    endTime = weekSunday.pattern("yyyy-MM-dd");
                } else if(this.dateRangeType == 2) { // 按月
                    this.dateRangeTips = this.day.pattern("yyyy年MM月");

                    let monthStart = new Date(this.year, this.month, 1),
                        monthEnd = new Date(new Date(new Date(this.year, this.month + 1, 1).toLocaleDateString()).getTime() - 1);

                    startTime = monthStart.pattern("yyyy-MM-dd");
                    endTime = monthEnd.pattern("yyyy-MM-dd");
                }

                this.loading = true;
                
                let param = {
                    'schoolId': this.id,
                    'startTime': startTime,
                    'endTime': endTime,
                    'type': this.dateRangeType
                };

                quotaStatistics(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.loading = false;
                        this.detail = data;

                        this.chartInit();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取指标数据失败！', type: 'error'});
                });
            },
            /**
             * [chartInit description] 初始化图表
             * @return {[type]} [description]
             */
            chartInit: function() {
                document.getElementById('charts').innerHTML = '';

                let data = [];

                switch (this.tabsType) {
                    case '1':
                        data = this.detail.loginNumList;
                        break;
                    case '2':
                        data = this.detail.newCourseNumList;
                        break;
                    case '3':
                        data = this.detail.startCourseNumList;
                        break;
                    case '4':
                        data = this.detail.courseTimeList;
                        break;
                    case '5':
                        data = this.detail.issueNumList;
                        break;
                    case '6':
                        data = this.detail.interactionNumList;
                        break;
                    default:
                        break;
                }

                let chart = new G2.Chart({
                    container: 'charts',
                    forceFit: true,
                    height: 500,
                    padding: ['auto', 'auto', 40, 'auto']
                });
                chart.source(data);
                chart.scale('num', {
                    min: 0
                });
                chart.scale('date', {
                    range: [0, 1]
                });
                chart.axis('date', {
                    label: {
                        formatter: val => {
                            return val;
                        }
                    }
                });
                chart.axis('num', {
                    label: {
                        formatter: val => {
                            return val;
                        }
                    }
                });
                chart.tooltip({
                    showTitle: true,
                    itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}<span style="margin-left: 20px;">{value}</span></li>'
                });
                chart
                    .line()
                    .position('date*num')
                    .color('#38A0FF')
                    .shape('smooth')
                    .tooltip('date*num', function(date, num) {
                        date = new Date(that.year, that.month, date);

                        let tabsTypeName = '';

                        switch (that.tabsType) {
                            case '1':
                                tabsTypeName = '使用人数';
                                break;
                            case '2':
                                tabsTypeName = '新建课程个数';
                                break;
                            case '3':
                                tabsTypeName = '上课节数';
                                break;
                            case '4':
                                tabsTypeName = '课时分数';
                                break;
                            case '5':
                                tabsTypeName = '发题道数';
                                break;
                            case '6':
                                tabsTypeName = '互动次数';
                                break;
                            default:
                                break;
                        }

                        return {
                            title: date.pattern("MM月dd日"),
                            name: tabsTypeName,
                            value: num
                        };
                    });
                chart
                    .point()
                    .position('date*num')
                    .size(6)
                    .shape('hollowCircle')
                    .style({
                        stroke: '#38A0FF',
                        lineWidth: 2
                    });
                chart.render();
            },
            /**
             * [getNowWeek description] 获取本周
             * @return {[type]} [description]
             */
            getWeekMonday: function(time) {
                let now = new Date(time),
                    dayOfWeek = now.getDay();

                if(dayOfWeek == 0) {
                    dayOfWeek = 6;
                } else {
                    dayOfWeek -= 1;
                }

                return now.getTime() - dayOfWeek * 24 * 3600 * 1000;
            },
            /**
             * [getMonthDays description] 获取某月份的天数
             * @param  {[type]} myMonth [description]
             * @return {[type]}         [description]
             */
            getMonthDays(month) {
                let now = new Date(),
                    year = now.getFullYear();

                let startDate = new Date(year, month, 1),
                    endDate = new Date(year, month + 1, 1);

                return (endDate - startDate) / (1000 * 60 * 60 * 24);
            },
            /**
             * [handleExport description] 导出
             * @return {[type]} [description]
             */
            handleExport: function() {
                let startTime = '',
                    endTime = '';

                if(this.dateRangeType == 1) { // 按周
                    let weekMonday = new Date(this.getWeekMonday(this.day)),
                        weekSunday = new Date(this.getWeekMonday(this.day) + 6 * 24 * 3600 * 1000);

                    startTime = weekMonday.pattern("yyyy-MM-dd");
                    endTime = weekSunday.pattern("yyyy-MM-dd");
                } else if(this.dateRangeType == 2) { // 按月
                    let monthStart = new Date(this.year, this.month, 1),
                        monthEnd = new Date(new Date(new Date(this.year, this.month + 1, 1).toLocaleDateString()).getTime() - 1);

                    startTime = monthStart.pattern("yyyy-MM-dd");
                    endTime = monthEnd.pattern("yyyy-MM-dd");
                }

                location.href = uploadPath + '/ajax/quota/export?schoolId='+ this.id +'&startTime=' + startTime + '&endTime=' + endTime;
            }
        },
        mounted() {
            that = this;

            this.dateInit();
            this.getStatistics();

            this.chartInit();
        }
    }
</script>

<style lang="scss">
    .school-statistics{
        position: relative;
        min-height: 100%;
        padding: 25px 20px;
        background: #FFF;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;

        .tabs-wrap{
            position: absolute;
            z-index: 3;
            top: 14px;
            left: 50%;
            -webkit-transform: translate3d(-50%, 0, 0);
                    transform: translate3d(-50%, 0, 0);

            .el-radio-group{
                .el-radio-button{
                    cursor: pointer;

                    .el-radio-button__inner{
                        font-size: 12px;
                        padding: 10px 40px;
                        color: #666;
                        border-color: #ccc;
                    }

                    &.is-active{
                        .el-radio-button__inner{
                            color: #FFF;
                            border-color: #18c79c;
                        }
                    }
                }
            }
        }

        .export-wrap{
            position: absolute;
            z-index: 3;
            top: 14px;
            right: 20px;
            font-size: 12px;
            color: #38A0FF;
            line-height: 34px;
            padding-left: 20px;
            background: url('/static/icon-export@2x.png') no-repeat left center;
            background-size: 14px 14px;
            cursor: pointer;

            &:hover{
                opacity: .8;
            }

            &:active{
                opacity: .9;
            }
        }

        .chart-title{
            line-height: 24px;

            .title{
                font-size: 14px;
                color: #000;
            }

            .daterange{
                margin-left: 12px;
                font-size: 12px;
                color: #2a2a2a;
            }
        }

        .chart-tabs{
            margin-top: 15px;
            /*padding-right: 10%;*/

            .chart-tabs-item{
                position: relative;
                padding: 28px 18px 20px 18px;
                border: 2px solid #FFF;
                overflow: hidden;
                cursor: pointer;

                &:hover{
                    background: #F3FAFF;
                    cursor: pointer;
                }

                &.active{
                    border-color: #38A0FF;

                    &::after{
                        content: "";
                        position: absolute;
                        z-index: 3;
                        right: -11px;
                        bottom: -11px;
                        height: 0;
                        width: 0;
                        border: 11px solid #38A0FF;
                        border-color: #38A0FF transparent transparent transparent;
                        -webkit-transform: rotate(-45deg);
                                transform: rotate(-45deg);
                    }
                }

                .label{
                    font-size: 14px;
                    color: #333;
                    line-height: 19px;
                }

                .num{
                    span{
                        font-size: 28px;
                        line-height: 48px;
                        font-weight: bold;
                        color: #000;
                        letter-spacing: 1px;
                        padding-right: 21px;
                    }

                    .num-increase{
                        background: url('/static/icon-increase@2x.png') no-repeat right center;
                        background-size: 13px 13px;
                    }

                    .num-decrease{
                        background: url('/static/icon-decrease@2x.png') no-repeat right center;
                        background-size: 13px 13px;
                    }

                    .num-nocrease{
                        background: url('/static/icon-nocrease@2x.png') no-repeat right center;
                        background-size: 13px 13px;
                    }
                }

                .total{
                    font-size: 12px;
                    color: #666;
                    line-height: 16px;

                    .title{}

                    .number{
                        margin-left: 5px;
                    }
                }
            }
        }

        .charts-box{
            position: relative;
            margin-top: 10px;

            .charts{
                height: 500px;
            }

            .btn-arrow-prev,
            .btn-arrow-next{
                position: absolute;
                z-index: 10000;
                top: 50%;
                height: 38px;
                margin-top: -19px;
                background: rgba(240, 240, 240, 1);
                cursor: pointer;
                -webkit-transition: all .1s ease-in;
                        transition: all .1s ease-in;

                &.disabled{
                    cursor: not-allowed;
                }

                &::after{
                    content: "";
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    width: 19px;
                    height: 38px;
                    -webkit-transition: all .1s ease-in;
                            transition: all .1s ease-in;
                }

                p{

                    width: 0;
                    font-size: 12px;
                    color: #333;
                    line-height: 38px;
                    white-space: nowrap;
                    overflow: hidden;
                    -webkit-transition: all .1s ease-in;
                            transition: all .1s ease-in;
                }

                &:not(.disabled):hover{
                    background: rgba(220, 220, 220, 1);
                    -webkit-transition: all .1s ease-in;
                            transition: all .1s ease-in;

                    p{
                        width: calc(2em + 12px);
                        -webkit-transition: all .1s ease-in;
                                transition: all .1s ease-in;
                    }
                }
            }

            .btn-arrow-prev{
                left: 0;
                padding: 0 0 0 19px;
                border-top-right-radius: 19px;
                border-bottom-right-radius: 19px;

                &::after{
                    left: 0;
                    background: url('../../static/icon-arrow-left@2x.png') no-repeat 3px center;
                    background-size: 12px 12px;
                }

                &.disabled{
                    &::after{
                        background: url('../../static/icon-arrow-left-disabled@2x.png') no-repeat 3px center;
                        background-size: 12px 12px;
                    }
                }

                p{
                    text-align: left;
                }

                &:not(.disabled):hover{
                    &::after{
                        content: "";
                        background: url('../../static/icon-arrow-left-hover@2x.png') no-repeat 3px center;
                        background-size: 12px 12px;
                        -webkit-transition: all .1s ease-in;
                                transition: all .1s ease-in;
                    }
                }
            }

            .btn-arrow-next{
                right: 0;
                padding: 0 19px 0 0;
                border-top-left-radius: 19px;
                border-bottom-left-radius: 19px;

                &::after{
                    right: 0;
                    background: url('../../static/icon-arrow-right@2x.png') no-repeat 4px center;
                    background-size: 12px 12px;
                }

                &.disabled{
                    &::after{
                        background: url('../../static/icon-arrow-right-disabled@2x.png') no-repeat 3px center;
                        background-size: 12px 12px;
                    }
                }

                p{
                    text-align: right;
                }

                &:not(.disabled):hover{
                    &::after{
                        content: "";
                        background: url('../../static/icon-arrow-right-hover@2x.png') no-repeat 3px center;
                        background-size: 12px 12px;
                        -webkit-transition: all .1s ease-in;
                                transition: all .1s ease-in;
                    }
                }
            }
        }
    }
</style>

