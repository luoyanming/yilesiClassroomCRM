<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>学制管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="学制名称">
                            <el-input v-model="searchForm.systemName" size="small" placeholder="请输入学制名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd(0)">新增学制</el-button>
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="学制名称">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="学制详情">
                            <template scope="scope"><p>学前{{ scope.row.pre }}；小学{{ scope.row.primarys }}；初中{{ scope.row.junior }}；高中{{ scope.row.senior }}；大专院校{{ scope.row.college }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleAdd(1, scope.$index, scope.row)">编辑</el-button>
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

                <el-dialog :title="dialogInfo.type == 0 ? '新增学制' : '编辑学制'" :visible.sync="dialogShow" :modal-append-to-body="false" custom-class="w70">
                    <section class="formation">
                        <div class="tooltip-wrap">
                            <el-tooltip placement="top" effect="light">
                                <div slot="content">
                                    <div class="number-wrap">
                                        <div class="title">年级编号对应表</div>
                                        <div class="list">
                                            <div class="list-item">
                                                <div class="item-line">小班 05</div>
                                                <div class="item-line">中班 06</div>
                                                <div class="item-line">大班 07</div>
                                            </div>
                                            <div class="list-item">
                                                <div class="item-line">一年级 11</div>
                                                <div class="item-line">二年级 12</div>
                                                <div class="item-line">三年级 13</div>
                                                <div class="item-line">四年级 14</div>
                                                <div class="item-line">五年级 15</div>
                                                <div class="item-line">六年级 16</div>
                                            </div>
                                            <div class="list-item">
                                                <div class="item-line">七年级 17</div>
                                                <div class="item-line">八年级 18</div>
                                                <div class="item-line">九年级 19</div>
                                            </div>
                                            <div class="list-item">
                                                <div class="item-line">高一 31</div>
                                                <div class="item-line">高二 32</div>
                                                <div class="item-line">高三 33</div>
                                            </div>
                                            <div class="list-item">
                                                <div class="item-line">本一 41</div>
                                                <div class="item-line">本二 42</div>
                                                <div class="item-line">本三 43</div>
                                                <div class="item-line">本四 44</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <el-button class="button-link el-icon-information"></el-button>
                            </el-tooltip>
                        </div>                      
                       
                        <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                            <el-form-item label="学制名称" prop="name">
                                <el-input v-model="dialogInfo.name"></el-input>
                            </el-form-item>
                            <!-- 学前 -->
                            <el-form-item label="学前" prop="pre">
                                <el-input v-model.number="dialogInfo.pre" :disabled="dialogInfo.preDisabled"></el-input>
                                <span class="tip">&nbsp;&nbsp;年</span>
                            </el-form-item>
                            <div class="inline-box">
                                <el-form-item v-for="(preItem, index) in dialogInfo.preGrade">
                                    <el-input v-model="preItem.name" :placeholder="'年级名' + (index + 1)"></el-input>
                                    <el-select v-model="preItem.gradeNum" placeholder="编号">
                                        <el-option v-for="item in gradeNumListOptions" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>                                    
                                </el-form-item>
                            </div>
                            <!-- 小学 -->
                            <el-form-item label="小学" prop="primarys">
                                <el-input v-model.number="dialogInfo.primarys" :disabled="dialogInfo.primarysDisabled"></el-input>
                                <span class="tip">&nbsp;&nbsp;年</span>
                            </el-form-item>
                            <div class="inline-box">
                                <el-form-item v-for="(primarysItem, index) in dialogInfo.primarysGrade">
                                    <el-input v-model="primarysItem.name" :placeholder="'年级名' + (index + 1)"></el-input>
                                    <el-select v-model="primarysItem.gradeNum" placeholder="编号">
                                        <el-option v-for="item in gradeNumListOptions" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <!-- 初中 -->
                            <el-form-item label="初中" prop="junior">
                                <el-input v-model.number="dialogInfo.junior" :disabled="dialogInfo.juniorDisabled"></el-input>
                                <span class="tip">&nbsp;&nbsp;年</span>
                            </el-form-item>
                            <div class="inline-box">
                                <el-form-item v-for="(juniorItem, index) in dialogInfo.juniorGrade">
                                    <el-input v-model="juniorItem.name" :placeholder="'年级名' + (index + 1)"></el-input>
                                    <el-select v-model="juniorItem.gradeNum" placeholder="编号">
                                        <el-option v-for="item in gradeNumListOptions" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <!-- 高中 -->
                            <el-form-item label="高中" prop="senior">
                                <el-input v-model.number="dialogInfo.senior" :disabled="dialogInfo.seniorDisabled"></el-input>
                                <span class="tip">&nbsp;&nbsp;年</span>
                            </el-form-item>
                            <div class="inline-box">
                                <el-form-item v-for="(seniorItem, index) in dialogInfo.seniorGrade">
                                    <el-input v-model="seniorItem.name" :placeholder="'年级名' + (index + 1)"></el-input>
                                    <el-select v-model="seniorItem.gradeNum" placeholder="编号">
                                        <el-option v-for="item in gradeNumListOptions" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <!-- 大专院校 -->
                            <el-form-item label="大专院校" prop="college">
                                <el-input v-model.number="dialogInfo.college" :disabled="dialogInfo.collegeDisabled"></el-input>
                                <span class="tip">&nbsp;&nbsp;年</span>
                            </el-form-item>
                            <div class="inline-box">
                                <el-form-item v-for="(collegeItem, index) in dialogInfo.collegeGrade">
                                    <el-input v-model="collegeItem.name" :placeholder="'年级名' + (index + 1)"></el-input>
                                    <el-select v-model="collegeItem.gradeNum" placeholder="编号">
                                        <el-option v-for="item in gradeNumListOptions" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { schoolSystemGradeNumList, schoolSystemGradeNumVoList, schoolSystemList, schoolSystemSave } from '../api/api';

    let that;

    export default {
        data() {
            let checkSystem = (rule, value, callback) => {
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value > 12 || value < 0) {
                            callback(new Error('请输入0~12之间的数字值'));
                        } else {
                            callback();
                        }
                    }
                }, 0);
            };

            return {
                searchForm: {
                    systemName: ''
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
                dialogInfo: {
                    type: '',
                    id: '',
                    index: '',
                    name: '',
                    pre: 0,
                    preGrade: [],
                    preDisabled: false,
                    primarys: 0,
                    primarysGrade: [],
                    primarysDisabled: false,
                    junior: 0,
                    juniorGrade: [],
                    juniorDisabled: false,
                    senior: 0,
                    seniorGrade: [],
                    seniorDisabled: false,
                    college: 0,
                    collegeGrade: [],
                    collegeDisabled: false
                },
                dialogShow: false,
                dialogLoading: false,
                rules: {
                    name: [
                        { required: true, message: '*请输入学制名称', trigger: 'blur' }
                    ],
                    pre: [
                        { validator: checkSystem, trigger: 'blur' }
                    ],
                    primarys: [
                        { validator: checkSystem, trigger: 'blur' }
                    ],
                    junior: [
                        { validator: checkSystem, trigger: 'blur' }
                    ],
                    senior: [
                        { validator: checkSystem, trigger: 'blur' }
                    ],
                    college: [
                        { validator: checkSystem, trigger: 'blur' }
                    ]
                },

                // gradeNumListOptions: ["05", "06", "07", "11", "12", "13", "14", "15", "16", "17", "18", "19", "31", "32", "33", "41", "42"]
                gradeNumListOptions: [],
                gradeNumVoList: []

            };
        },
        watch: {
            'dialogInfo.pre': {
                handler: (val, oldVal) => {
                    if(!Number.isInteger(val) || val > 12 || val < 0) {
                        return false;
                    }
                    that.dialogInfo.preGrade = [];
                    for(let i = 0; i < val; i++) {
                        that.dialogInfo.preGrade.push({
                            'id': '',
                            'name': '',
                            'gradeNum': ''
                        });
                    }
                },
                deep: true
            },
            'dialogInfo.primarys': {
                handler: (val, oldVal) => {
                    if(!Number.isInteger(val) || val > 12 || val < 0) {
                        return false;
                    }
                    that.dialogInfo.primarysGrade = [];
                    for(let i = 0; i < val; i++) {
                        that.dialogInfo.primarysGrade.push({
                            'id': '',
                            'name': '',
                            'gradeNum': ''
                        });
                    }
                },
                deep: true
            },
            'dialogInfo.junior': {
                handler: (val, oldVal) => {
                    if(!Number.isInteger(val) || val > 12 || val < 0) {
                        return false;
                    }
                    that.dialogInfo.juniorGrade = [];
                    for(let i = 0; i < val; i++) {
                        that.dialogInfo.juniorGrade.push({
                            'id': '',
                            'name': '',
                            'gradeNum': ''
                        });
                    }
                },
                deep: true
            },
            'dialogInfo.senior': {
                handler: (val, oldVal) => {
                    if(!Number.isInteger(val) || val > 12 || val < 0) {
                        return false;
                    }
                    that.dialogInfo.seniorGrade = [];
                    for(let i = 0; i < val; i++) {
                        that.dialogInfo.seniorGrade.push({
                            'id': '',
                            'name': '',
                            'gradeNum': ''
                        });
                    }
                },
                deep: true
            },
            'dialogInfo.college': {
                handler: (val, oldVal) => {
                    if(!Number.isInteger(val) || val > 12 || val < 0) {
                        return false;
                    }
                    that.dialogInfo.collegeGrade = [];
                    for(let i = 0; i < val; i++) {
                        that.dialogInfo.collegeGrade.push({
                            'id': '',
                            'name': '',
                            'gradeNum': ''
                        });
                    }
                },
                deep: true
            }
        },
        methods: {
            getGradeNumList: function() {
                schoolSystemGradeNumList({}).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.gradeNumListOptions = data.list;
                    }
                });                
            },
            getGradeNumVoList: function() {
                schoolSystemGradeNumVoList({}).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.gradeNumVoList = data.list;
                    }
                });                
            },
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            getList: function() {
                this.tableloading = true;

                let param = {
                    'name': this.searchForm.systemName,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                schoolSystemList(param).then(res => {
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
                }).catch((error) => {
                    this.tableloading = false;
                    this.$message({ message: '网络异常！获取学制列表失败！', type: 'error'});
                });
            },

            // 添加、编辑内测用户
            handleAdd: function(type, index, row) {
                this.dialogShow = true;
                this.dialogInfo.type = type;

                setTimeout(function() {
                    // 重置表单
                    that.$refs['ruleForm'].resetFields();

                    that.dialogInfo = {
                        type: '',
                        id: '',
                        index: '',
                        name: '',
                        pre: 0,
                        preGrade: [],
                        preDisabled: false,
                        primarys: 0,
                        primarysGrade: [],
                        primarysDisabled: false,
                        junior: 0,
                        juniorGrade: [],
                        juniorDisabled: false,
                        senior: 0,
                        seniorGrade: [],
                        seniorDisabled: false,
                        college: 0,
                        collegeGrade: [],
                        collegeDisabled: false
                    }                    

                    // 编辑赋值
                    if(type == 1) {
                        that.dialogInfo.type = type;
                        that.dialogInfo.id = row.id;
                        that.dialogInfo.index = index;
                        that.dialogInfo.name = row.name;
                        that.dialogInfo.pre = row.pre;
                        setTimeout(function() {
                            that.dialogInfo.preGrade = row.preGrade;
                        },1);
                        that.dialogInfo.preDisabled = row.preDisabled;
                        that.dialogInfo.primarys = row.primarys;
                        setTimeout(function() {
                            that.dialogInfo.primarysGrade = row.primarysGrade;
                        },1);
                        that.dialogInfo.primarysDisabled = row.primarysDisabled;
                        that.dialogInfo.junior = row.junior;
                        setTimeout(function() {
                            that.dialogInfo.juniorGrade = row.juniorGrade;
                        },1);
                        that.dialogInfo.juniorDisabled = row.juniorDisabled;
                        that.dialogInfo.senior = row.senior;
                        setTimeout(function() {
                            that.dialogInfo.seniorGrade = row.seniorGrade;
                        },1);
                        that.dialogInfo.seniorDisabled = row.seniorDisabled;
                        that.dialogInfo.college = row.college;
                        setTimeout(function() {
                            that.dialogInfo.collegeGrade = row.collegeGrade;
                        },1);
                        that.dialogInfo.collegeDisabled = row.collegeDisabled;
                    }
                }, 1);
            },

            // 提交用户信息
            submitForm: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(this.dialogInfo.pre == 0 && this.dialogInfo.primarys == 0 && this.dialogInfo.junior == 0 && this.dialogInfo.senior == 0 && this.dialogInfo.college == 0) {
                           this.$message({ message: '必须有一个学段不为0', type: 'error' });
                           return false; 
                        }

                        let preFlag = false,
                            primaryFlag = false,
                            juniorFlag = false,
                            seniorFlag = false,
                            collegeFlag = false;
                        if(this.dialogInfo.pre > 0) {
                            for(let i = 0; i < this.dialogInfo.preGrade.length; i++) {
                                if(!this.dialogInfo.preGrade[i].name) {
                                    preFlag = true;
                                }
                            }
                        }
                        if(this.dialogInfo.primarys > 0) {
                            for(let i = 0; i < this.dialogInfo.primarysGrade.length; i++) {
                                if(!this.dialogInfo.primarysGrade[i].name) {
                                    primaryFlag = true;
                                }
                            }
                        }
                        if(this.dialogInfo.junior > 0) {
                            for(let i = 0; i < this.dialogInfo.juniorGrade.length; i++) {
                                if(!this.dialogInfo.juniorGrade[i].name) {
                                    juniorFlag = true;
                                }
                            }
                        }
                        if(this.dialogInfo.senior > 0) {
                            for(let i = 0; i < this.dialogInfo.seniorGrade.length; i++) {
                                if(!this.dialogInfo.seniorGrade[i].name) {
                                    seniorFlag = true;
                                }
                            }
                        }
                        if(this.dialogInfo.college > 0) {
                            for(let i = 0; i < this.dialogInfo.collegeGrade.length; i++) {
                                if(!this.dialogInfo.collegeGrade[i].name) {
                                    collegeFlag = true;
                                }
                            }
                        }

                        if(preFlag || primaryFlag || juniorFlag || seniorFlag || collegeFlag) {
                            this.$message({ message: '学段的年级名不能为空', type: 'error' });
                            return false;
                        }


                        this.dialogLoading = true;

                        let params = {
                            'id': this.dialogInfo.id,
                            'name': this.dialogInfo.name,
                            'pre': this.dialogInfo.pre,
                            'preGrade': JSON.stringify(this.dialogInfo.preGrade),
                            'primarys': this.dialogInfo.primarys,
                            'primarysGrade': JSON.stringify(this.dialogInfo.primarysGrade),
                            'junior': this.dialogInfo.junior,
                            'juniorGrade': JSON.stringify(this.dialogInfo.juniorGrade),
                            'senior': this.dialogInfo.senior,
                            'seniorGrade': JSON.stringify(this.dialogInfo.seniorGrade),
                            'college': this.dialogInfo.college,
                            'collegeGrade': JSON.stringify(this.dialogInfo.collegeGrade),
                        };

                        schoolSystemSave(params).then(res=>{
                            this.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存学制信息成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getList();
                            }
                        });
                    }else{
                        return false;
                    }
                }).catch((error) => {
                    this.dialogLoading = false;
                    this.$message({ message: '网络异常！保存学制信息失败！', type: 'error'});
                });
            }
        },
        mounted() {
            that = this;
            this.getGradeNumList();
            // this.getGradeNumVoList();
            this.getList();
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
    .w70{
        width: 60%;
    }

    .el-tooltip__popper{
        border-color: #3FCB9A !important;

        /*.popper__arrow::after{
            border-color: #3FCB9A !important;
        }*/

        .number-wrap{
            .title{
                font-size: 12px;
                line-height: 2;
                border-bottom: 1px solid #dbdbdb;
            }

            .list{
                padding: 10px 0;
                /*white-space: nowrap;*/

                .list-item{
                    float: left;
                    padding: 0 10px;

                    .item-line{
                        color: #666;
                        line-height: 1.6;
                    }
                }
            }
        }
    }

    .el-dialog__wrapper{
        button{
            &:before{
                font-size: 20px;
            }
        }        
    }
</style>

<style lang="scss" scoped>
    .luoym{
        .button-add{
            margin-right: 15px;
        }
    }

    .tooltip-wrap{
        position: absolute;
        z-index: 3;
        top: 19px;
        right: 80px;
    }

</style>

