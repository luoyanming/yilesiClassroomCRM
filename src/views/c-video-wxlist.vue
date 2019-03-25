<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>微课</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="关键词">
                    <el-input v-model="searchForm.keyword" size="small" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model="searchForm.account" size="small" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="生成时间">
                    <el-date-picker
                        v-model="searchForm.searchDate"
                        size="small"
                        type="date"
                        format="yyyy-MM-dd"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>                        

                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
        </section>

        <section class="table">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                <el-table-column label="视频">
                    <template scope="scope">
                        <p><img :src="scope.row.thumbnailUrl" class="video-thumb"></p>
                    </template>
                </el-table-column>
                <el-table-column label="">
                    <template scope="scope"><p>{{ scope.row.courseName }}</p></template>
                </el-table-column>                        
                <el-table-column label="用户账号">
                    <template scope="scope">
                        <p>{{ scope.row.memberName }}</p>
                        <p>{{ scope.row.mobile }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="视频时长">
                    <template scope="scope"><p>{{ scope.row.videoLength }}</p></template>
                </el-table-column>
                <el-table-column label="生成时间">
                    <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                </el-table-column>
                <el-table-column label="播放次数">
                    <template scope="scope"><p>{{ scope.row.playNum }}</p></template>
                </el-table-column>
                <el-table-column label="点赞数">
                    <template scope="scope"><p>{{ scope.row.likeNum }}</p></template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" class="button-link" @click="handlePlayVideo(scope.row.videoUrl)" v-if="scope.row.videoUrl">播放</el-button>
                        <el-button size="small" class="button-link" @click="handleDownloadCourse(scope.row.id)" v-if="scope.row.videoUrl">下载</el-button>
                        <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

        
        <el-dialog title="编辑微课" :visible.sync="editDialogShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" label-width="180px">
                    <el-form-item label="视频">
                        <p class="form-item-thumb"><img :src="editDialogInfo.info.thumbnailUrl" class="video-thumb"></p>

                        <el-button type="primary" size="small" class="btn-add button-add" icon="upload2" @click.native="handleDownloadCourse(editDialogInfo.info.id)" style="position: absolute; z-index: 3; top: 0; right: 0;">下载课程记录</el-button>
                        <el-button type="primary" size="small" class="btn-add button-add" icon="warning" @click.native="handleShieldVideo(editDialogInfo.info.id, 1)" style="position: absolute; z-index: 3; top: 55px; right: 0;" v-if="editDialogInfo.info.status == 4">屏蔽视频</el-button>
                        <el-button type="primary" size="small" class="btn-add button-add" icon="warning" @click.native="handleShieldVideo(editDialogInfo.info.id, 0)" style="position: absolute; z-index: 3; top: 55px; right: 0;" v-if="editDialogInfo.info.status == -2">取消屏蔽</el-button>
                        <el-button type="primary" size="small" class="btn-add button-add" icon="star-on" @click.native="handleLikeNumAdd(editDialogInfo.info.id)" style="position: absolute; z-index: 3; top: 110px; right: 0;">刷赞</el-button>
                    </el-form-item>
                    <el-form-item label="微课名称">
                        <p class="form-item-text" style="padding-right: 140px;">{{ editDialogInfo.info.courseName }}</p>
                    </el-form-item>
                    <el-form-item label="用户">
                        <p class="form-item-text" style="padding-right: 30px;">{{ editDialogInfo.info.memberName }}（{{ editDialogInfo.info.mobile }}）</p>
                    </el-form-item>
                    <el-form-item label="微课介绍">
                        <p class="form-item-text">{{ editDialogInfo.info.explains }}</p>
                    </el-form-item>
                    <el-form-item label="视频时长">
                        <p class="form-item-text">{{ editDialogInfo.info.videoLength }}</p>
                    </el-form-item>
                    <el-form-item label="生成时间">
                        <p class="form-item-text">{{ editDialogInfo.info.createdDate }}</p>
                    </el-form-item>
                    <el-form-item label="播放次数">
                        <p class="form-item-text">{{ editDialogInfo.info.playNum }}</p>
                    </el-form-item>
                    <el-form-item label="点赞数">
                        <p class="form-item-text">{{ editDialogInfo.info.likeNum }}</p>
                    </el-form-item>
                    <el-form-item label="标签" v-if="role == 2">
                        <div class="tag-list">
                            <el-button type="primary" size="small" icon="delete" class="tag-item" v-for="(tagItem, tagIndex) in editDialogInfo.tagList" @click.native="handleTagDetele(tagIndex, tagItem)">{{ tagItem.name }}</el-button>
                            <el-button type="primary" size="small" icon="plus" class="tag-add" @click.native="handleTagsDialogShow">添加</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="加入排行榜">
                        <el-switch
                            v-model="editDialogInfo.info.hasRanking"
                            on-text=""
                            off-text=""
                            on-color="#18c79c"
                            off-color="#aaaaaa"
                            on-value="true"
                            off-value="false">
                        </el-switch> 
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="editDialogLoading" @click.native="handleSaveCourse">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加标签" :visible.sync="tagsDialogInfo.show" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="tagsRules" ref="ruleFormTags" label-width="180px" :model="tagsDialogInfo">
                    <el-form-item label="标签分类" prop="typeId">
                        <el-select v-model="tagsDialogInfo.typeId" placeholder="请选择" @change="handleTagsClassifyChange">
                            <el-option v-for="item in tagsClassifyOptions" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签" prop="id">
                        <el-select v-model="tagsDialogInfo.id" placeholder="请选择">
                            <el-option v-for="item in tagsOptions" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="handleSaveTags('ruleFormTags')">保存</el-button>
            </span>
        </el-dialog>                        

    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, courseRecordList, tagsClassifyList, tagsList, courseRecordMicroUpdate, courseRecordLikeNumAdd, courseRecordStop } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                role: localStorage.getItem('role'),

                searchForm: {
                    keyword: '',
                    account: '',
                    searchDate: ''
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
                editDialogShow: false,
                editDialogLoading: false,
                editDialogInfo: {
                    info: {},
                    tagList: []
                },

                tagsClassifyOptions:[
                    {
                        value:'',
                        label:'请选择'
                    }
                ],
                tagsOptions: [
                    {
                        value:'',
                        label:'请选择'
                    }
                ],
                tagsDialogInfo: {
                    typeId: '',
                    id: '',
                    show: false
                },
                tagsRules: {
                    typeId: [
                        { required: true, message: '*请选择标签分类', trigger: 'change' }
                    ],
                    id: [
                        { required: true, message: '*请选择标签', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            // 列表搜索
            onSearchSubmit() {
                this.searchForm.searchDate = COMMON.formatDate(this.searchForm.searchDate, '-');

                if(this.searchForm.searchDate == 'NaN-NaN-NaN') {
                    this.searchForm.searchDate = '';
                }                

                this.pagi.currentPage = 1;

                this.getList();
            },
            // 列表分页
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取列表
            getList() {
                this.tableloading = true;

                let param = {
                    'type': 1,
                    'keywords': this.searchForm.keyword,
                    'account': this.searchForm.account,
                    'searchDate': this.searchForm.searchDate,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                courseRecordList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取列表失败！', type: 'error'});
                });
            },
            // 编辑按钮
            handleEdit(index, row) {
                this.editDialogShow = true;

                row.hasRanking = '' + row.hasRanking

                setTimeout(function() {
                    that.editDialogInfo.info = row;
                    that.editDialogInfo.tagList = row.tagVoList;
                    that.editDialogLoading = false;
                }, 1);
            },

            // 编辑微课记录保存
            handleSaveCourse: function() {
                if(this.editDialogLoading) {
                    return false;
                }
                
                let tagIds = [];
                if(this.editDialogInfo.tagList.length > 0) {
                    for(let i = 0; i < this.editDialogInfo.tagList.length; i++) {
                        tagIds.push(this.editDialogInfo.tagList[i].id);
                    }
                }

                this.editDialogLoading = true;

                let params = {
                    id: this.editDialogInfo.info.id,
                    type: this.editDialogInfo.info.hasRanking == 'true' ? 1 : 0,
                    tagIds: tagIds.join(',')
                };

                courseRecordMicroUpdate(params).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.editDialogLoading = false;

                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '保存成功！', type: 'success' });
                        this.editDialogShow = false;
                        this.getList();
                    }
                }).catch(error => {
                    this.editDialogLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });                
            },

            // 下载课程记录
            handleDownloadCourse: function(id) {
                location.href = uploadPath + '/ajax/courseRecord/download/log/add?id=' + id;
            },

            // 播放视频
            handlePlayVideo: function(url) {
                window.open(url);
            },

            //刷赞
            handleLikeNumAdd: function(id) {
                let params = {
                    id: id
                };

                courseRecordLikeNumAdd(params).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '操作成功！', type: 'success' });
                        this.getList();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！操作失败！', type: 'error'});
                });                
            },

            //屏蔽视频
            handleShieldVideo: function(id, type) {
                let params = {
                    id: id,
                    type: type
                };

                courseRecordStop(params).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.editDialogInfo.info.status = type == 0 ? 4 : -2;
                        this.$message({ message: '操作成功！', type: 'success' });
                        this.getList();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！操作失败！', type: 'error'});
                });                
            },

            // 获取标签分类列表
            getClassifyList: function() {
                let param = {
                    'name': '',
                    'pageNo': 1,
                    'pageSize': 1000
                };

                tagsClassifyList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        for(let i = 0; i < data.list.length; i++ ) {
                            this.tagsClassifyOptions.push({
                                value: '' + data.list[i].id,
                                label: data.list[i].name
                            })
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取标签分类列表失败！', type: 'error'});
                });                
            },

            // 添加标签弹窗
            handleTagsDialogShow: function() {
                that.tagsDialogInfo.show = true;

                setTimeout(() => {
                    that.tagsDialogInfo.typeId = '';
                    that.tagsDialogInfo.id = '';
                    that.tagsOptions = [
                        {
                            value:'',
                            label:'请选择'
                        }
                    ]                     
                }, 1);
            },

            // 标签分类变化
            handleTagsClassifyChange: function(typeId) {
                that.tagsDialogInfo.id = '';
                this.tagsOptions = [
                    {
                        value:'',
                        label:'请选择'
                    }
                ]

                let tagIds = [];
                if(that.editDialogInfo.tagList.length > 0) {
                    for(let i = 0; i < that.editDialogInfo.tagList.length; i++) {
                        tagIds.push(that.editDialogInfo.tagList[i].id);
                    }
                }

                let param = {
                    'name': '',
                    'typeId': typeId,
                    'notContainIds': tagIds.join(','),
                    'pageNo': 1,
                    'pageSize': 1000
                };

                tagsList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length) {
                            for(let i = 0; i < data.list.length; i++ ) {
                                this.tagsOptions.push({
                                    value: '' + data.list[i].id,
                                    label: data.list[i].name
                                })
                            }
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取标签列表失败！', type: 'error'});
                });                
            },

            // 保存标签
            handleSaveTags(formName) {
                this.$refs[formName].validate((valid)=>{
                     if(valid){
                        let id = that.tagsDialogInfo.id,
                            name = '';

                        for(let i = 0; i < that.tagsOptions.length; i++) {
                            if(id == that.tagsOptions[i].value) {
                                name = that.tagsOptions[i].label;
                                break;
                            }
                        }

                        that.editDialogInfo.tagList.push({
                            id: id,
                            name: name
                        })

                        that.tagsDialogInfo.show = false;
                     }else{
                         return false;
                     }
                });
            },

            // 移除标签
            handleTagDetele: function(index, item) {
                that.editDialogInfo.tagList.splice(index, 1);
            }   
        },
        mounted() {
            that = this;

            this.getList();
            this.getClassifyList();
        }
    }
</script>

<style lang="scss">
    .character-item{
        .el-select{
            .el-input{
                width: 100px !important;
            }
        }

        .button-add{
            line-height: 30px !important;
        }
    }
</style>

<style lang="scss" scoped>
    .video-thumb{
        float: left;
        width: 122px;
        height: 80px;
        margin-right: 10px;
    }
    .character-item{
        margin-bottom: 10px;

        .el-input,
        .el-select{
            float: left;
            margin-right: 10px;
        }

        .button-remove{
            float: left;
            width: 26px;
            height: 26px;
            margin-top: 7px;
            padding: 0;
            border: 0;
            border-radius: 50%;
            min-width: auto;
            line-height: 26px !important;
        }
    }

    .form-item-text{
        line-height: 40px;
        font-size: 12px;
        color: #333;
    }
    .tag-list{
        .tag-item{
            background: #fff;
            color: #18c79c;
            line-height: 30px !important;
            border-radius: 15px;

            &:hover,
            &:active{
                opacity: .8;
            }
        }

        .tag-add{
            line-height: 30px !important;
        }
    }
    .rank-box{
        float: right;

        .label{
            font-size: 12px;
            color: #999999;
            line-height: 40px;
        }
    }
</style>

