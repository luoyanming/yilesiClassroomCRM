<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>功能设置</el-breadcrumb-item>
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
                    <el-card class="box-card">
                        <div slot="header">
                            <div class="title">前端</div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">考勤</div>
                            <div class="switch">
                                <el-switch v-model="detailData.attendance" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(1)"></el-switch>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">危险区域通知推送</div>
                            <div class="switch">
                                <el-switch v-model="detailData.dangerAreaPush" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(2)"></el-switch>
                            </div>
                        </div>
                        <!-- <div class="item flex-h">
                            <div class="label flex-a-i">限制区域通知推送</div>
                            <div class="switch">
                                <el-switch v-model="detailData.restrictAreaPush" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(3)"></el-switch>
                            </div>
                        </div> -->
                        <div class="item flex-h">
                            <div class="label flex-a-i">人脸识别</div>
                            <div class="switch">
                                <el-switch v-model="detailData.faceRecognition" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(4)"></el-switch>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">学校课程记录删除</div>
                            <div class="switch">
                                <el-switch v-model="detailData.courseDelete" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(10)"></el-switch>
                            </div>
                        </div>
                    </el-card>

                    <el-card class="box-card" v-if="detailData.existsAccount">
                        <div slot="header">
                            <div class="title">分权后台</div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">课程记录开放</div>
                            <div class="switch">
                                <el-switch v-model="detailData.recordOpen" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(5)"></el-switch>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">微课开放</div>
                            <div class="switch">
                                <el-switch v-model="detailData.wkRecordOpen" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(6)"></el-switch>
                            </div>
                        </div>
                    </el-card>

                    <el-card class="box-card">
                        <div slot="header">
                            <div class="title">第三方一卡通</div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">正元</div>
                            <div class="switch">
                                <el-switch v-model="detailData.cardZhengyuan" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(9)"></el-switch>
                            </div>
                        </div>
                    </el-card>

                    <el-card class="box-card">
                        <div slot="header">
                            <div class="title">班牌控制</div>
                        </div>
                        <div class="item flex-h">
                            <div class="label w120 flex-v-c">默认服务器地址</div>
                            <div class="input-wrap flex-a-i">
                                <el-input type="text" v-model="detailData.bpIndexDomain" class="w400" disabled></el-input>
                            </div>
                            <div class="btn-box flex-v-c">
                                <el-button size="small" class="button-link" @click="handleEdit('1')">编辑</el-button>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">班牌刷卡服务</div>
                            <div class="switch">
                                <el-switch v-model="detailData.bpCardSwitch" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(7)"></el-switch>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label w120 flex-v-c">班牌刷卡服务地址</div>
                            <div class="input-wrap flex-a-i">
                                <el-input type="text" v-model="detailData.bpCardUrl" class="w400" disabled></el-input>
                            </div>
                            <div class="btn-box flex-v-c">
                                <el-button size="small" class="button-link" @click="handleEdit('2')">编辑</el-button>
                            </div>
                        </div>
                        <div class="item flex-h">
                            <div class="label flex-a-i">悬浮球（功能最多四个）</div>
                            <div class="switch">
                                <el-switch v-model="detailData.bpBallSwitch" on-color="#18c79c" off-color="#bfcbd9" :on-value="switchYes" :off-value="switchNo" @change="handleSwitchChange(8)"></el-switch>
                            </div>
                        </div>
                        <div class="item">
                            <div v-for="(item, index) in detailData.ballMenuList" :key="index" class="item-block flex-h" v-if="index < 4">
                                <div class="input-wrap w120">
                                    <el-input type="text" v-model="item.name" class="w100" disabled placeholder="请输入功能名称"></el-input>
                                </div>
                                <div class="input-wrap flex-a-i">
                                    <el-input type="text" v-model="item.url" class="w400" disabled placeholder="请输入配置地址"></el-input>
                                </div>
                                <div class="btn-box" style="text-align: right;">
                                    <el-button icon="plus" @click="handleEdit('3')" v-if="!item.name && !item.url"></el-button>
                                    <el-button icon="delete" @click="handleDel(index)" v-else></el-button>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>

            </div>
        </div>
        
        <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :modal-append-to-body="false" custom-class="w700">
            <section class="formation">
               
                <el-form label-position="right":rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                    <el-form-item :label="dialogInfo.nameLabel" prop="name">
                        <el-input v-model="dialogInfo.name" style="width: 400px;"></el-input>
                    </el-form-item>
                    <el-form-item :label="dialogInfo.urlLabel" prop="url" v-if="dialogInfo.type == '3'">
                        <el-input v-model="dialogInfo.url" style="width: 400px;"></el-input>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogInfo.loading" @click.native="submitForm('ruleForm')">保存</el-button>
            </span>
        </el-dialog>  
    </div>
</template>

<script>
    import { Message, Loading } from 'element-ui';
    import { schoolList, schoolPersonalFunctionSet, schoolPersonalFunctionSetUpdate, schoolPersonalFunctionSetSave } from '../api/api';

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

                detailData: {
                    recordOpen: 0,
                    restrictAreaPush: 0,
                    existsAccount: false,
                    dangerAreaPush: 0,
                    wkRecordOpen: 0,
                    faceRecognition: 0,
                    attendance: 0,
                    bpIndexDomain: '',
                    bpCardSwitch: 0,
                    bpCardUrl: '',
                    bpBallSwitch: 0,
                    ballMenuList: []
                },

                dialogInfo: {
                    visible: false,
                    type: '',
                    title: '',
                    nameLabel: '',
                    urlLabel: '',
                    name: '',
                    url: '',
                    loading: false
                },
                rules: {
                    name: [
                        { required: true, message: '*请输入', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '*请输入', trigger: 'blur' }
                    ],
                }
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

                schoolPersonalFunctionSet(param).then(res => {
                    fullPageLoading.close();

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        data.schoolFuncSet.ballMenuList.push({
                            name: '',
                            url: ''
                        })

                        this.detailData = data.schoolFuncSet;
                    }
                }).catch(error => {
                    fullPageLoading.close();
                    this.$message({ message: '网络异常！获取数据失败！', type: 'error'});
                });
            },

            // 搜索学校
            keyDownSubmit: function() {
                this.getSchoolList();
            },

            // 保存修改
            handleSwitchChange: function(type) {
                let fullPageLoading = Loading.service({ fullscreen: true });

                let detailData = this.detailData;
                    status = '';

                if(type == 1) {
                    status = this.detailData.attendance;
                } else if(type == 2) {
                    status = this.detailData.dangerAreaPush;
                } else if(type == 3) {
                    status = this.detailData.restrictAreaPush;
                } else if(type == 4) {
                    status = this.detailData.faceRecognition;
                } else if(type == 5) {
                    status = this.detailData.recordOpen;
                } else if(type == 6) {
                    status = this.detailData.wkRecordOpen;
                } else if(type == 7) {
                    status = this.detailData.bpCardSwitch;
                } else if(type == 8) {
                    status = this.detailData.bpBallSwitch;
                } else if(type == 9) {
                    status = this.detailData.cardZhengyuan;
                } else if(type == 10) {
                    status = this.detailData.courseDelete;
                }

                let param = {
                    'schoolId': this.searchForm.schoolId,
                    'type': type,
                    'status': status
                };

                schoolPersonalFunctionSetUpdate(param).then(res => {
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
            },

            // 编辑
            handleEdit: function(type) {
                let title = '',
                    nameLabel = '',
                    urlLabel = '',
                    name = '',
                    url = '';

                if(type == '1') {
                    title = '编辑默认服务器地址';
                    nameLabel = '服务器地址';
                    name = that.detailData.bpIndexDomain;
                } else if(type == '2') {
                    title = '编辑班牌刷卡服务地址';
                    nameLabel = '班牌刷卡服务地址';
                    name = that.detailData.bpCardUrl;
                } else if(type == '3') {
                    title = '添加功能';
                    nameLabel = '功能名称';
                    urlLabel = '配置地址';
                    name = '';
                    url = '';

                }

                that.dialogInfo.visible = true;

                setTimeout(function() {
                    that.dialogInfo.type = type;
                    that.dialogInfo.title = title;
                    that.dialogInfo.nameLabel = nameLabel;
                    that.dialogInfo.urlLabel = urlLabel;
                    that.dialogInfo.name = name;
                    that.dialogInfo.url = url || '';
                    that.dialogInfo.loading = false;
                }, 1);
            },

            // 保存
            submitForm: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){

                        let type = that.dialogInfo.type,
                            bpIndexDomain = '',
                            bpCardUrl = '',
                            bpBallMenu = '';

                        if(type == '1') {
                            bpIndexDomain = that.dialogInfo.name;
                        } else if(type == '2') {
                            bpCardUrl = that.dialogInfo.name;
                        } else if(type == '3') {
                            let list = that.detailData.ballMenuList;
                            
                            list.splice(list.length - 1, 0, {
                                name: that.dialogInfo.name,
                                url: that.dialogInfo.url
                            })
                            
                            list.splice(list.length - 1, 1);
                            
                            bpBallMenu = JSON.stringify(list);
                        }

                        let param = {
                            schoolId: that.searchForm.schoolId,
                            bpIndexDomain: bpIndexDomain,
                            bpCardUrl: bpCardUrl,
                            bpBallMenu: bpBallMenu
                        }

                        this.dialogInfo.loading = true;

                        schoolPersonalFunctionSetSave(param).then(res => {
                            this.dialogInfo.loading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: errorInfo, type: 'error'});
                            } else {
                                this.$message({ message: '保存成功', type: 'success'});
                                this.dialogInfo = {
                                    visible: false,
                                    type: '',
                                    title: '',
                                    nameLabel: '',
                                    urlLabel: '',
                                    name: '',
                                    url: '',
                                    loading: false
                                }
                                this.getData();
                            }
                        }).catch(error => {
                            this.dialogInfo.loading = false;
                            this.$message({ message: '网络异常！保存失败！', type: 'error'});
                        });

                    }else{
                        return false;
                    }
                });
            },

            // 删除
            handleDel: function(index) {
                let list = that.detailData.ballMenuList,
                    bpBallMenu = '';
                            
                list.splice(index, 1);
                
                list.splice(list.length - 1, 1);
                
                bpBallMenu = JSON.stringify(list);


                let param = {
                    schoolId: that.searchForm.schoolId,
                    bpIndexDomain: '',
                    bpCardUrl: '',
                    bpBallMenu: bpBallMenu
                }

                schoolPersonalFunctionSetSave(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '删除成功', type: 'success'});
                        this.getData();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！', type: 'error'});
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

                    .input-wrap{
                        /*.input-text{
                            border: 1px solid #ddd;
                            font-size: 12px;
                            color: #333;
                            line-height: 20px;
                            height: 20px;
                        }*/

                        .el-input{
                            .el-input__inner{
                                background: transparent;
                                color: #333;
                                font-size: 12px;
                            }
                        }
                    }

                    .w400{
                        width: 80%;
                    }

                    .w100{
                        width: 110px;
                    }

                    .w120{
                        width: 130px;
                    }

                    .btn-box{
                        button{
                            border: none;
                        }
                    }

                    .item-block  + .item-block {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
</style>

