<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>微课排行榜</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button type="primary" size="small" class="btn-add" @click.native="handleRankingPublish">发布排行榜</el-button>   
                </section>

                <section class="table">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="视频">
                            <template scope="scope">
                                <p><img :src="scope.row.videoThumbnailUrl" class="video-thumb"></p>
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
                        <el-table-column label="微课排名">
                            <template scope="scope"><p>{{ scope.row.seq }}</p></template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </section>

                
                <el-dialog title="编辑微课排行榜" :visible.sync="editDialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" label-width="180px">
                            <el-form-item label="视频">
                                <p class="form-item-thumb"><img :src="editDialogInfo.info.videoThumbnailUrl" class="video-thumb"></p>
                            </el-form-item>
                            <el-form-item label="微课名称">
                                <p class="form-item-text">{{ editDialogInfo.info.courseName }}</p>
                            </el-form-item>
                            <el-form-item label="用户">
                                <p class="form-item-text">{{ editDialogInfo.info.memberName }}（{{ editDialogInfo.info.mobile }}）</p>
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
                            <el-form-item label="标签">
                                <div class="tag-list">
                                    <el-button type="primary" size="small" disabled class="tag-item" v-for="(tagItem, tagIndex) in editDialogInfo.tagList" @click.native="handleTagDetele(tagIndex, tagItem)">{{ tagItem.name }}</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="微课排名">
                                <el-select v-model="editDialogInfo.info.seq" placeholder="请选择">
                                    <el-option v-for="item in seqOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>                                
                            </el-form-item>
                            <el-form-item label="视频缩略图">
                                <el-upload
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    :before-upload="handleBefore"
                                    :on-remove="handleRemove"
                                    :on-success="handleSuccess"
                                    :on-error="handleError"
                                    :file-list="editDialogInfo.logoUrl"
                                    list-type="picture">
                                    <el-button size="small" type="primary" :disabled="editDialogInfo.logoUrl.length != 0">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">上传尺寸300像素 X 300像素，支持jpg、jpeg、png</div>
                                </el-upload>                                
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

            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, courseRecordRankingList, courseRecordRankingUpdate, courseRecordRankingPublish } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                tableData: [],
                tableloading: true,

                editDialogShow: false,
                editDialogLoading: false,
                editDialogInfo: {
                    info: {},
                    tagList: [],
                    logoUrl: []
                },
                uploadUrl: uploadPath + '/ajax/courseRecordRanking/thumbnail/upload',
                seqOptions:[],                
            };
        },
        methods: {
            // 获取列表
            getList() {
                this.tableloading = true;

                courseRecordRankingList({}).then(res => {
                    this.tableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.tableData = data.list;
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
                row.seq = '' + row.seq;

                setTimeout(function() {
                    that.editDialogInfo.info = row;
                    that.editDialogInfo.tagList = row.tagVoList;
                    that.editDialogInfo.logoUrl = that.editDialogInfo.logoUrl = [];
                    if(row.thumbnailUrl) {
                        that.editDialogInfo.logoUrl = [
                            {
                                'name': row.thumbnailUrl,
                                'url': row.thumbnailUrl,
                                'response': {
                                    'code': 0,
                                    'data': {
                                        'thumbnailUrl': row.thumbnailUrl
                                    },
                                    'errorInfo': ''
                                }
                            }
                        ];
                    }                  
                }, 1);
            },

            // 编辑微课记录保存
            handleSaveCourse: function() {
                let idArr = [],
                    id = this.editDialogInfo.info.id,
                    index = '',
                    seq = parseInt(this.editDialogInfo.info.seq) - 1;
                for(let i = 0; i < that.tableData.length; i++) {
                    idArr.push(that.tableData[i].id);
                }
                index = idArr.indexOf(id);
                idArr.splice(index, 1);
                idArr.splice(seq, 0, id)

                this.editDialogLoading = true;

                let params = {
                    id: id,
                    seqIds: idArr.join(','),
                    type: this.editDialogInfo.info.hasRanking == 'true' ? 1 : 0,
                    thumbnailUrl: this.editDialogInfo.logoUrl.length > 0 ? this.editDialogInfo.logoUrl[0].response.data.thumbnailUrl : ''
                };

                courseRecordRankingUpdate(params).then(res=>{
                    this.editDialogLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0){
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

            // 发布排行榜
            handleRankingPublish: function() {
                courseRecordRankingPublish({}).then(res=>{
                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '发布成功！', type: 'success' });
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });                    
            },

            handleBefore: function(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: 'LOGO格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            handleSuccess: function(response, file, fileList) {
                this.editDialogInfo.logoUrl = fileList;
            },
            handleError: function(err, file, fileList) {
                this.editDialogInfo.logoUrl = [];
                this.$message({ message: 'LOGO上传失败，请重试！', type: 'error'});
            },
            handleRemove: function(file, fileList) {
                this.editDialogInfo.logoUrl = fileList;
            },            
        },
        mounted() {
            that = this;

            for(let i = 1; i < 21; i++) {
                that.seqOptions.push({
                    value: '' + i,
                    label: '' + i                    
                })
            }

            this.getList();
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

