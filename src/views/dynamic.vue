<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>动态管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="内容">
                            <el-input v-model="searchForm.content" size="small" placeholder="请输入内容字段"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="用户">
                            <el-input v-model="searchForm.name" size="small" placeholder="请输入用户"></el-input>
                        </el-form-item> -->
                        <el-form-item label="时间">
                            <el-date-picker
                            v-model="searchForm.date"
                            size="small"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                    </el-form-item>
                </el-form>
                
                <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="linkTo('/dynamicAdd')">发布新动态</el-button>
                <el-button type="primary" size="small" class="button-default" @click.native="linkTo('/dynamicHot')">热门动态</el-button>
                <el-button type="primary" size="small" class="button-default" @click.native="linkTo('/dynamicUsual')">常用作者动态</el-button>
            </section>

            <section class="table">
                <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                    <el-table-column label="序号">
                        <template scope="scope"><p>{{ scope.row.objectId }}</p></template>
                    </el-table-column>
                    <el-table-column label="文字内容">
                        <template scope="scope"><p>{{ scope.row.content }}</p></template>
                    </el-table-column>
                    <el-table-column label="图片" width="120">
                        <template scope="scope"><p><img :src="scope.row.albumPhoto"></p></template>
                    </el-table-column>
                    <el-table-column label="作者昵称">
                        <template scope="scope"><p>{{ scope.row.authorName }}</p></template>
                    </el-table-column>
                    <el-table-column label="点赞数" width="70">
                        <template scope="scope"><p>{{ scope.row.likeNum }}</p></template>
                    </el-table-column>
                    <el-table-column label="评论数" width="70">
                        <template scope="scope"><p>{{ scope.row.commentNum }}</p></template>
                    </el-table-column>
                    <el-table-column label="阅读数" width="70">
                        <template scope="scope"><p>{{ scope.row.readNum }}</p></template>
                    </el-table-column>
                    <el-table-column label="发布日期">
                        <template scope="scope"><p>{{ scope.row.time }}</p></template>
                    </el-table-column>
                    <!-- <el-table-column label="状态" width="70">
                        <template scope="scope"><p class="color-red">{{ scope.row.status }}</p></template>
                        <template scope="scope"><p>正常</p></template>
                    </el-table-column> -->
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                            <el-button size="small" class="button-link" @click="handleTopic(scope.$index, scope.row)">加入专题</el-button>
                            <el-button size="small" class="button-link" @click="handleTags(scope.$index, scope.row)">设置Tag</el-button>
                            <!-- <el-button size="small" class="button-link" @click="handleHidden(scope.$index, scope.row)">隐藏</el-button> -->
                            <!-- <el-button size="small" class="button-link color-orange" @click="handleUnHidden(scope.$index, scope.row)">取消隐藏</el-button> -->
                            <el-button size="small" class="button-link" @click="handleSetHot(scope.$index, scope.row)">设为热门</el-button>
                            <el-button size="small" class="button-link" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog title="加入专题" :visible.sync="themeDialogShow" :modal-append-to-body="false">
            <h4 class="dialog-title">选择要加入的专题</h4>
            <section class="formation">
                <el-form label-width="0" class="demo-ruleForm">
                    <el-form-item>
                        <el-checkbox-group v-model="themeForm">
                            <el-checkbox-button v-for="item in themeOptions" :disabled="item.current " :label="item.code">{{ item.title }}</el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="button-cancle" @click.native="themeDialogShow = !themeDialogShow">取 消</el-button>
                <el-button type="primary" :loading="themeLoading" @click.native="submitTheme()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="设置Tag" :visible.sync="tagsDialogShow" :modal-append-to-body="false">
            <h4 class="dialog-title">输入Tag</h4>
            <section class="formation">
                <el-form label-width="0" class="demo-ruleForm">
                    <el-form-item>
                        <el-tag
                        :key="tag"
                        v-for="tag in tagsOptions"
                        :closable="true"
                        color="#3FCB9A"
                        :close-transition="false"
                        @close="handleTagClose(tag)"
                        >
                        {{ tag }}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="tagsInputVisible"
                    v-model="tagsInputValue"
                    ref="saveTagInput"
                    size="mini"
                    @blur="handleTagsInputConfirm"
                    >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showTagsInput">+&nbsp;&nbsp;&nbsp;&nbsp;添加Tag</el-button>
            </el-form-item>
        </el-form>
    </section>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="button-cancle" @click.native="tagsDialogShow = !tagsDialogShow">取 消</el-button>
        <el-button type="primary" :loading="tagsLoading" @click.native="submitTags()">确 定</el-button>
    </span>
</el-dialog>
</div>
</div>
</div>
</template>

<script>
    import { Message } from 'element-ui';
    import { dynamicList, dynamicSetTags, dynamicSetThemes, dynamicDelete, dynamicSetHot } from '../api/api';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                searchForm: {
                    content: '',
                    date: ''
                },
                tableData: [],
                tableloading: true,

                themeOptions: [],
                themeForm: [],
                themeDialogShow: false,
                themeLoading: false,

                tagsOptions: [],
                tagsDialogShow: false,
                tagsLoading: false,
                tagsInputVisible: false,
                tagsInputValue: '',
                
                currentIndex: '',
                currentId: '',

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                }
            };
        },
        methods: {
            onSearchSubmit: function() {
                this.searchForm.date = COMMON.formatDate(this.searchForm.date);

                if(this.searchForm.date == 'NaN-NaN-NaN') {
                    this.searchForm.date = '';
                }

                this.pagi.currentPage = 1;

                this.getDynamicList();
            },
            linkTo: function(url) {
                this.$router.push({ path: url });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getDynamicList();
            },
            getDynamicList: function() {
                this.tableloading = true;

                let param = {
                    'content': this.searchForm.content,
                    'date': this.searchForm.date,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                dynamicList(param).then(res => {
                    this.tableloading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        if(data.momentList.length == 0) {
                            this.noPagi = true;
                            this.tableData = [];
                            return false;
                        }

                        this.tableData = data.momentList;
                        this.pagi.pageTotal = data.totalNum/this.pagi.pageSize + 1;
                        this.pagi.total = data.totalNum;
                        this.noPagi = false;

                        this.themeOptions = data.themeList;
                    }
                });
            },
            handleDetail: function(index, row) {
                this.$router.push({ path: '/dynamicDetail', query: { id: row.objectId } });
            },
            handleTopic: function(index, row) {
                this.currentId = row.objectId;
                this.currentIndex = index;

                this.themeForm = row.themeList;
                for(let i = 0; i < this.themeOptions.length; i++) {
                    this.themeOptions[i].current = false;
                    if(this.themeForm.length > 0)  {
                        for(let j = 0; j < this.themeForm.length; j++) {
                            if(this.themeOptions[i].code == this.themeForm[j]) {
                                this.themeOptions[i].current = true;
                            }
                        }
                    }
                }

                this.themeDialogShow = true;
            },
            handleTags: function(index, row) {
                this.currentId = row.objectId;
                this.currentIndex = index;
                this.tagsOptions = row.tagList;

                this.tagsDialogShow = true;
            },
            handleDelete: function(index, row) {
                this.$confirm('确定删除该动态？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = { 'objectId': row.objectId, 'status': -2 };

                    dynamicDelete(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '删除动态成功', type: 'success'});
                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() => {

                });
            },
            submitTheme: function() {
                this.themeLoading = true;

                let param = {
                    'objectId': this.currentId,
                    'themes': this.themeForm.join(',')
                };

                dynamicSetThemes(param).then(res => {
                    this.themeLoading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.themeDialogShow = false;
                        this.tableData[this.currentIndex].themeList = this.themeForm;
                        this.$message({ message: '主题加入成功！', type: 'success'});
                    }
                });
            },
            handleTagClose(tag) {
                this.tagsOptions.splice(this.tagsOptions.indexOf(tag), 1);
            },
            handleTagsInputConfirm: function() {
                let tagsInputValue = this.tagsInputValue;
                if (tagsInputValue) {
                    this.tagsOptions.push(tagsInputValue);
                }
                this.tagsInputVisible = false;
                this.tagsInputValue = '';
            },
            showTagsInput: function() {
                this.tagsInputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            submitTags: function() {
                this.tagsLoading = true;

                let param = {
                    'objectId': this.currentId,
                    'tags': this.tagsOptions.join(',')
                };

                dynamicSetTags(param).then(res => {
                    this.tagsLoading = false;

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: msg, type: 'error'});
                    } else {
                        this.tagsDialogShow = false;
                        this.tableData[this.currentIndex].tagList = this.tagsOptions;
                        this.$message({ message: 'Tag设置成功！', type: 'success'});
                    }
                });
            },
            handleSetHot: function(index, row) {
                this.$prompt('请输入热门动态标题', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPlaceholder: '不超过25个中文字符',
                    inputPattern: /([^x00-xff]|(?:\.[\w!#$%&'*+/=?^_`{|}~-]+))+/,
                    inputErrorMessage: '请输入热门动态标题'
                }).then(({ value }) => {
                    let param = { 'objectId': row.objectId, 'title': value };

                    dynamicSetHot(param).then(res => {
                        let { msg, code, data } = res;

                        if(code !== 0) {
                            this.$message({ message: msg, type: 'error'});
                        } else {
                            this.$message({ message: '您已成功将该动态设为热门动态！', type: 'success'});
                        }
                    });
                }).catch(() => {
                       
                });
            }
        },
        mounted() {
            this.getDynamicList();
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
</style>

