<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs" v-if="!showAuthorList">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/dynamic' }">动态管理</el-breadcrumb-item>
                        <el-breadcrumb-item>发布新动态</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                <section class="crumbs" v-if="showAuthorList">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/dynamic' }">动态管理</el-breadcrumb-item>
                        <el-breadcrumb-item @click.native="handleChange">发布新动态</el-breadcrumb-item>
                        <el-breadcrumb-item>添加常用作者</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation" v-if="!showAuthorList">
                    <el-form :label-position="labelPosition" label-width="80px" :model="form">
                        <el-form-item label="作者" v-if="!form.author">
                            <el-button type="primary" @click.native="handleAddAuthor">添加常用作者</el-button>
                        </el-form-item>
                        <el-form-item label="作者" v-if="form.author">
                            <span class="author">{{ form.author }}</span>
                            <el-button type="primary" class="button-cancle" @click.native="handleAddAuthor">修改作者</el-button>
                        </el-form-item>
                        <el-form-item label="文字内容">
                            <el-input type="textarea" v-model="form.content" placeholder="请输入文字内容"></el-input>
                        </el-form-item>
                        <el-form-item label="图片">
                            <div class="upload-list">
                                <div class="upload-item flex-h" v-for="(item, index) in form.thumb">
                                    <div class="photobox">
                                        <el-upload
                                            class="upload-demo"
                                            :action="uploadUrl"
                                            :file-list="item.photo"
                                            list-type="picture"
                                            :data="{ 'authorId': form.authorId, 'index': index }"
                                            :before-upload="uploadBefore"
                                            :on-success="uploadSucc"
                                            :on-error="uploadError"
                                            :on-remove="uploadRemove">
                                            <el-button type="primary">点击上传</el-button>
                                        </el-upload>
                                    </div>
                                    <div class="flex-a-i"><textarea placeholder="请输入描述" v-model="item.description"></textarea></div>
                                    <div class="sortbox flex-v-c"><input type="text" v-model="item.sort"></div>
                                    <div class="flex-v-c"><el-button type="primary" class="button-link button-nopadding" @click.native="handleDelUploadItem(index)">删除</el-button></div>
                                </div>
                                <div class="btn-upload"><el-button type="primary" class="button-link" icon="plus" :disabled="form.thumb.length == 9" @click.native="handleAddUploadItem">添加图片</el-button></div>
                            </div>
                        </el-form-item>
                        <el-form-item label="所属专题">
                            <el-checkbox-group v-model="form.theme">
                                <el-checkbox-button v-for="item in themesOptions" :label="item.code">{{ item.title }}</el-checkbox-button>
                            </el-checkbox-group>
                        </el-form-item>

                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click.native="historyBack">取消</el-button>
                            <el-button type="primary" size="large" :loading="loading"  @click.native="onSubmit">发布</el-button>
                        </div>
                    </el-form>
                </section>

                <section v-if="showAuthorList">
                    <section class="search clearfix">
                        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                            <el-form-item label="序号">
                                <el-input v-model="searchForm.memberId" size="small" placeholder="请输入序号"></el-input>
                            </el-form-item>
                            <el-form-item label="昵称">
                                <el-input v-model="searchForm.nickname" size="small" placeholder="请输入昵称"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="searchForm.name" size="small" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </section>

                    <section class="table">
                        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                            <el-table-column label="序号">
                                <template scope="scope"><p>{{ scope.row.id }}</p></template>
                            </el-table-column>
                            <el-table-column label="昵称">
                                <template scope="scope"><p>{{ scope.row.nickName }}</p></template>
                            </el-table-column>
                            <el-table-column label="真实姓名">
                                <template scope="scope"><p>{{ scope.row.name }}</p></template>
                            </el-table-column>
                            <el-table-column label="手机号">
                                <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                            </el-table-column>
                            <el-table-column label="性别">
                                <template scope="scope"><p>{{ scope.row.sex }}</p></template>
                            </el-table-column>
                            <el-table-column label="车辆昵称">
                                <template scope="scope"><p>{{ scope.row.carNickName }}</p></template>
                            </el-table-column>
                            <el-table-column label="品牌">
                                <template scope="scope"><p>{{ scope.row.brand }}</p></template>
                            </el-table-column>
                            <el-table-column label="型号">
                                <template scope="scope"><p>{{ scope.row.model }}</p></template>
                            </el-table-column>
                            <el-table-column label="设备型号">
                                <template scope="scope"><p>{{ scope.row.deviceModel }}</p></template>
                            </el-table-column>
                            <el-table-column label="注册日期">
                                <template scope="scope"><p>{{ scope.row.createdDate }}</p></template>
                            </el-table-column>
                            <el-table-column label="状态">
                                <!-- <template scope="scope"><p class="color-red">{{ scope.row.status }}</p></template> -->
                                <template scope="scope">
                                    <p v-if="scope.row.status == '正常'">正常</p>
                                    <p v-if="scope.row.status == '已冻结'" class="color-red">已冻结</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" class="button-link" @click="addMember(scope.$index, scope.row)">添加</el-button>
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
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { BASE, dynamicThemeList, uploadDynamic, dynamicAdd, dynamicMemberList } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                uploadUrl: BASE + '/community/moments/uploadPhoto',
                labelPosition: 'right',
                form: {
                    authorId: '',
                    author: '',
                    content: '',
                    thumb: [],
                    theme: []
                },
                themesOptions: [],
                searchForm: {
                    memberId: '',
                    nickname: '',
                    name: ''
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
                showAuthorList: false,
                loading: false
            };
        },
        methods: {
            getThemeList: function() {
                dynamicThemeList({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.themesOptions = data.themeList;
                    }
                });
            },
            handleChange: function() {
                this.showAuthorList = !this.showAuthorList;
            },
            handleAddAuthor: function() {
                this.showAuthorList = true;
            },
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getDynamicMemberList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getDynamicMemberList();
            },
            getDynamicMemberList: function() {
                this.tableloading = true;

                let param = {
                    'memberId': this.searchForm.memberId,
                    'nickName': this.searchForm.nickname,
                    'name': this.searchForm.name,
                    'usual': 1,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                dynamicMemberList(param).then(res => {
                    this.tableloading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.list;
                        this.pagi.pageTotal = data.page.pageTotal;
                        this.pagi.total = data.page.dataTotal;
                        this.noPagi = false;
                    }
                });
            },
            addMember: function(index, row) {
                this.form.authorId = row.id;
                this.form.author = row.nickName;
                this.showAuthorList = false;
            },
            handleAddUploadItem: function() {
                this.form.thumb.push({
                    'photo': [],
                    'description': '',
                    'sort': 0
                });
            },
            handleDelUploadItem: function(index) {
                this.form.thumb.splice(index, 1);
            },
            uploadBefore(file) {
                if(this.form.authorId == '') {
                    this.$message({ message: '请先添加作者！', type: 'error'});
                    return false;
                }

                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadError(response, file, fileList) {
                this.$message({ message: '图片上传失败，请重试！', type: 'error'});
            },
            uploadSucc(response, file, fileList) {
                // this.form.thumb = fileList;
                this.form.thumb[response.data.index].photo = fileList;
            },
            uploadRemove(file, fileList) {
                // this.form.thumb = fileList;
            },
            historyBack: function() {
                this.$router.go(-1);
            },
            onSubmit: function() {
                if(!COMMON.checkNull(this.form.authorId)) {
                    this.$message({ message: '请添加作者！', type: 'error'});
                    return false;
                }
                if(!COMMON.checkNull(this.form.content)) {
                    this.$message({ message: '请输入文字内容！', type: 'error'});
                    return false;
                }

                var photoList = this.form.thumb,
                    photoArr = [];
                
                if(photoList.length == 0) {
                    this.$message({ message: '请上传图片！', type: 'error'});
                    return false;
                }
                for(var i = 0; i < photoList.length; i++) {
                    if(photoList[i].photo.length && photoList[i].photo.length == 1){
                        photoArr.push({
                            'desc': photoList[i].description,
                            'index': photoList[i].sort,
                            'photoUrl': photoList[i].photo[0].response.data.path
                        });
                    } else {
                        this.$message({ message: '图片不能为空！', type: 'error'});
                        return false;
                    }
                }

                // if(this.form.theme.length == 0) {
                //     this.$message({ message: '请选择所属专题！', type: 'error'});
                //     return false;
                // }

                this.loading = true;

                let param = {
                    'authorId': this.form.authorId,
                    'content': this.form.content,
                    'photos': JSON.stringify(photoArr),
                    'theme': this.form.theme.join(',')
                };

                dynamicAdd(param).then(res => {
                    this.loading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.$message({ message: '发布成功', type: 'success'});
                        this.$router.push({ path: '/dynamic' });
                    }
                });
            }
        },
        mounted() {
            this.getThemeList();
            this.getDynamicMemberList();
        }
    }
</script>

<style lang="scss">
    .luoym{
        .formation{
            .author{
                margin-right: 20px;
                font-size: 12px;
                color: #333;
                line-height: 40px;
            }
        }

        .upload-list{
            width: 680px;
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
            border-radius: 2px;

            .upload-item{
                padding: 10px;
                border-bottom: 1px solid #E5E5E5;

                .photobox{
                    .upload-demo{
                        position: relative;
                        width: 230px;
                        height: 90px;

                        .el-upload,
                        .el-upload-list--picture{
                            position: absolute;
                            z-index: 3;
                            top: 50%;
                            left: 50%;
                            -webkit-transform: translate3d(-50%, -50%, 0);
                               -moz-transform: translate3d(-50%, -50%, 0);
                                -ms-transform: translate3d(-50%, -50%, 0);
                                    transform: translate3d(-50%, -50%, 0);
                        }

                        .el-upload-list--picture{
                            width: 230px !important;
                        }

                        .el-upload-list__item{
                            width: auto !important;
                            position: relative;
                            margin: 0 !important;

                            .el-icon-close{
                                display: none !important;
                                top: 10px !important;
                                right: 10px !important;
                                -webkit-transform: translate3d(0, 0, 0) !important;
                                   -moz-transform: translate3d(0, 0, 0) !important;
                                    -ms-transform: translate3d(0, 0, 0) !important;
                                        transform: translate3d(0, 0, 0) !important;
                            }

                            .el-progress{
                                .el-progress-bar{
                                    width: 60% !important;
                                }
                                .el-progress__text{
                                    right: 5px !important;
                                }
                            }
                        }
                    }
                }

                .flex-a-i{
                    margin: 0 10px;

                    textarea{
                        display: block;
                        width: 100%;
                        height: 90px;
                        padding: 8px 15px;
                        font-size: 12px;
                        color: #333;
                        line-height: 1.5;
                        background: #FFFFFF;
                        border: 1px solid #E5E5E5;
                        border-radius: 2px;
                        resize: none;
                    }
                }
                
                .sortbox{
                    margin-right: 10px;

                    input{
                        display: block;
                        width: 40px;
                        height: 40px;
                        font-size: 12px;
                        color: #333;
                        text-align: center;
                        line-height: 40px;
                        background: #FFFFFF;
                        border: 1px solid #E5E5E5;
                        border-radius: 2px;
                    }
                }
            }

            .btn-upload{
                text-align: center;
            }
        }
    }
</style>
