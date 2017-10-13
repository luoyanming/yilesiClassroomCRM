<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper yzb light-overscroll">
                <section class="crumbs">
                    <el-breadcrumb separator="/" v-if="!add && id">
                        <el-breadcrumb-item :to="{ path: '/topicManagement' }">专题管理</el-breadcrumb-item>
                        <el-breadcrumb-item>修改专题</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator="/" v-if="!add && !id">
                        <el-breadcrumb-item :to="{ path: '/topicManagement' }">专题管理</el-breadcrumb-item>
                        <el-breadcrumb-item>新添专题</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator="/" v-if="add && id">
                        <el-breadcrumb-item :to="{ path: '/topicManagement' }">专题管理</el-breadcrumb-item>
                        <el-breadcrumb-item @click.native="add = !add">修改专题</el-breadcrumb-item>
                        <el-breadcrumb-item>添加动态</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator="/" v-if="add && !id">
                        <el-breadcrumb-item :to="{ path: '/topicManagement' }">专题管理</el-breadcrumb-item>
                        <el-breadcrumb-item @click.native="add = !add">新添专题</el-breadcrumb-item>
                        <el-breadcrumb-item>添加动态</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <section class="formation" v-if="!add">
                    <el-form ref="ruleForm" :label-position="labelPosition" label-width="80px" :model="form">
                        <el-form-item label="排序" prop="sortId">
                            <el-input v-model="formList.sortId" placeholder="请输入序号"></el-input>
                        </el-form-item>
                        <el-form-item label="专题名称" prop="nickname">
                            <el-input v-model="formList.name" placeholder="请输入专题名称"></el-input>
                        </el-form-item>
                        <el-form-item label="专题图片" prop="thumb">
                            <el-upload
                                :disabled="formList.picUrl.length != 0"
                                class="upload-demo"
                                :action="uploadUrl"
                                :file-list="formList.picUrl"
                                list-type="picture"
                                :before-upload="uploadBefore"
                                :on-success="uploadSucc"
                                :on-error="uploadError"
                                :on-remove="uploadRemove">
                                <el-button type="primary" :disabled="formList.picUrl.length != 0">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，尺寸为330*120</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="动态列表">
                            <section class="table">
                                <el-table :data="tableData" style="width: 80%;">
                                    <el-table-column label="序号">
                                        <template scope="scope"><p>{{ scope.row.objectId }}</p></template>
                                    </el-table-column>
                                    <el-table-column label="文字内容">
                                        <template scope="scope"><p>{{ scope.row.content }}</p></template>
                                    </el-table-column>
                                    <el-table-column label="作者昵称" width="150">
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
                                    <el-table-column label="发布日期" width="100">
                                        <template scope="scope"><p>{{ scope.row.time }}</p></template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="65">
                                        <template scope="scope">
                                            <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="" width="65">
                                        <template scope="scope">
                                            <el-button size="small" class="button-link" @click="handleDelete(scope.$index,scope.row)">移除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <div class="button-add">
                                    <el-button size="small" class="button-link el-icon-plus" @click="addTopic">&nbsp;&nbsp;添加动态</el-button>
                                </div>
                            </section>
                        </el-form-item>
                        <div class="button-box">
                            <el-button type="primary" size="large" class="button-cancle" @click.native="historyBack">取消</el-button>
                            <el-button type="primary" size="large" @click.native="submitForm()">保存信息</el-button>
                        </div>
                    </el-form>
                </section>

                <section class="topicDynamic" v-if="add">
                    <section class="search clearfix">
                        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                            <el-form-item label="序号">
                                <el-input v-model="searchForm.objectId" size="small" placeholder="请输入序号"></el-input>
                            </el-form-item>
                            <el-form-item label="内容">
                                <el-input v-model="searchForm.content" size="small" placeholder="请输入内容字段"></el-input>
                            </el-form-item>
                            <el-form-item label="用户">
                                <el-input v-model="searchForm.authorName" size="small" placeholder="请输入用户"></el-input>
                            </el-form-item>
                            <el-form-item label="日期">
                                <el-date-picker
                                    v-model="searchForm.date"
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

                        <el-button type="primary" size="small" class="btn-add" @click.native="addMoment">确认添加</el-button>
                        <p class="addNum">已经选择 {{ addMemberNum.length }} 项</p>
                    </section>

                     <section id="topicDynamic">
                        <el-table :data="tableList" stripe style="width: 100%" v-loading="tableloading">
                            <el-table-column label="序号">
                                <template scope="scope"><p>{{scope.row.objectId}}</p></template>
                            </el-table-column>
                            <el-table-column label="文字内容">
                                <template scope="scope"><p>{{scope.row.content}}</p></template>
                            </el-table-column>
                            <el-table-column label="图片" width="140">
                                <template scope="scope"><img :src="scope.row.albumPhoto"></img></template>
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
                            <el-table-column label="状态">
                                <template scope="scope"><p>正常</p></template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <div v-if="scope.row.themeList.indexOf(code) === -1">
                                        <div style="width: 20px; height: 20px; border: 2px solid #E5E5E5;" @click="addClick(scope.$index,scope.row)" v-if="!scope.row.checked"></div>
                                        <div style="width: 20px; height: 20px; background:url('/static/Group5.png')" @click="addClick(scope.$index,scope.row)" v-if="scope.row.checked"></div>
                                    </div>
                                    <div v-if="scope.row.themeList.indexOf(code) !== -1">
                                        <div style="width: 20px; height: 20px; background:url('/static/hui.png')"></div>
                                    </div>    
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="pagi.currentPage"
                            :page-size="pagi.pageSize"
                            layout="total, prev, pager, next, jumper"
                            v-if="!noPagi"
                            :total="pagi.total">
                        </el-pagination>
                    </section>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import { BASE, topicDetail, topicMomentRemove, topicMomentList, topicAdd, topicModify} from '../api/api';
    import { Message } from 'element-ui';
    import { COMMON } from '../common/js/common';

    export default {
        data() {
            return {
                uploadUrl: BASE + '/member/carinfo/vehicleLicense',
                id:this.$route.query.id,
                code:'',
                add:false,
                addMember:[],
                addMemberNum:[],
                formList:{
                    sortId: '',
                    name:'',
                    momentList:[],
                    picUrl: []
                },
                form: {
                    name:'',
                    thumb:[]
                },
                labelPosition:'right',
                noPagi:true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    total: '' ,
                    pageTotal:''
                },
                searchForm: {
                    objectId: '',
                    content: '',
                    authorName: '',
                    date: ''
                },
                tableData:[],
                tableList:[],
                tableloading:true
            };
        },
        methods: {
            uploadBefore(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '专题图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadError(response, file, fileList) {
                this.formList.picUrl = [];
                this.$message({ message: '专题图片上传失败，请重试！', type: 'error'});
            },
            uploadSucc(response, file, fileList) {
                this.formList.picUrl = fileList;
            },
            uploadRemove(file, fileList) {
                this.formList.picUrl = fileList;
            },
            addClick(index, row) {
                if(!this.tableList[index].checked) {
                    if(this.addMember.length>0){
                        for(let i = 0; i<this.addMember.length; i++){
                            if(this.addMember[i].objectId == row.objectId){
                                this.$message({ message: '该动态已添加', type: 'error'});
                                this.tableList[index].checked = false;
                                return false;
                            }
                        }
                    }
                    
                    this.tableList[index].checked = true;
                    this.addMember.push(row);
                    this.addMemberNum.push(index);
                    this.tableData.push(row);
                } else {
                    this.tableList[index].checked = false;
                    

                    for(let i = 0; i < this.addMember.length; i++) {
                        if(this.addMember[i].objectId == row.objectId) {
                            this.addMember.splice(i, 1);
                            this.addMemberNum.splice(index,1);
                        }
                    }

                    for(let i = 0; i < this.tableData.length; i++) {
                        if(this.tableData[i].objectId == row.objectId) {
                            this.tableData.splice(i, 1);
                        }
                    }
                }
            },
            addMoment() {
                if(this.addMemberNum.length <= 0){
                    this.$message({ message: '您未选择添加动态', type: 'error'});
                    return false;
                }

                this.add = false;
            },
            historyBack(){
                this.$router.go(-1);
            },
            submitForm(){
                if(this.formList.sortId == '') {
                    this.$message({ message: '请输入序号!', type: 'error'});
                    return false;
                }

                if(this.formList.name == '') {
                    this.$message({ message: '请输入专题名称!', type: 'error'});
                    return false;
                }

                if(this.formList.picUrl.length == 0) {
                    this.$message({ message: '请上传专题图片!', type: 'error'});
                    return false;
                }

                let addMemberIdsArr = [];
                if(this.addMember.length > 0) {
                    for(let i = 0; i < this.addMember.length; i++) {
                        addMemberIdsArr.push(this.addMember[i].objectId);
                    }
                }else{
                    for(let i = 0; i < this.tableData.length; i++) {
                        addMemberIdsArr.push(this.tableData[i].objectId);
                    }
                }

                if(this.id) {
                    console.log(this.code)
                    let param = {
                        'code': this.code,
                        'title': this.formList.name,
                        'picUrl': this.formList.picUrl[0].response.data.path,
                        'objectIds': addMemberIdsArr.join(','),
                        'sortId': this.formList.sortId
                    }

                    topicModify(param).then(res =>{
                        let { msg, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: msg, type: 'error'});
                            } else {
                                this.$message({ message: '保存信息成功', type: 'success'});
                                this.$router.push({ path: '/topicManagement' });
                            }
                    });
                } else {
                    let param = {
                        'title': this.formList.name,
                        'picUrl': this.formList.picUrl[0].response.data.path,
                        'objectIds': addMemberIdsArr.join(','),
                        'sortId': this.formList.sortId
                    }

                    topicAdd(param).then(res =>{
                        let { msg, code, data } = res;

                            if(code !== 0) {
                                this.$message({ message: msg, type: 'error'});
                            } else {
                                this.$message({ message: '保存信息成功', type: 'success'});
                                this.$router.push({ path: '/topicManagement' });
                            }
                    });
                }
            },
            onSearchSubmit: function() {
                this.searchForm.date = COMMON.formatDate(this.searchForm.date);
                if(this.searchForm.date == 'NaN-NaN-NaN'){
                    this.searchForm.date = ''
                }
                this.pagi.currentPage = 1;
                this.getTopicMomentList();
            },
            getTopicMomentList(){
                this.tableloading = true;

                let param = {
                    'content': this.searchForm.content,
                    'date': this.searchForm.date,
                    'objectId': this.searchForm.objectId,
                    'authorName': this.searchForm.authorName,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                topicMomentList(param).then(res =>{
                    this.tableloading = false;
                    let {msg,code,data} = res;

                    if(code !==0){
                        this.$message({message: msg, type: 'error'});
                    }else{
                        if(data.momentList.length == 0){
                            this.noPagi = true;
                            this.tableList = [];
                            return false;
                        }

                        for(let i = 0; i < data.momentList.length; i++) {
                            data.momentList[i].checked = false;
                        }
                        this.tableList = data.momentList;

                        this.pagi.pageTotal = data.totalNum/this.pagi.pageSize + 1;
                        this.pagi.total = data.totalNum;
                        this.noPagi = false;
                    }
                });
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getTopicMomentList();
            },
            getTopicDetails() {
                if(!this.id) {
                    return false;
                }

                let param = { 'themeId' : this.id, 'pageNo': 1, 'pageSize': 10000 };

                topicDetail(param).then(res =>{
                    let {msg,code,data} = res;
                    
                    if(code !== 0){
                        this.$message({message:msg, type: 'error'});
                    }else{
                        this.code = data.detail.code;
                        this.formList.sortId = data.detail.sortId;
                        this.formList.name = data.detail.name;
                        this.formList.picUrl = [
                            {
                                name: data.detail.path,
                                url: data.detail.picUrl,
                                response: {
                                    data: {
                                        path: data.detail.path,
                                        url: data.detail.url
                                    }
                                }
                            }
                        ];

                        if(data.detail.momentList == 0){
                            this.tableData = [];
                            return false;
                        }
                        this.tableData = data.detail.momentList;
                    }
                });
            },
            handleDetail(index,row){
                this.$router.push({ path: '/dynamicDetail', query: { id: row.objectId} });
            },
            handleDelete(index, row) {
                this.$confirm('确定移除该动态？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    for(let i = 0; i < this.addMember.length; i++) {
                        if(row.objectId == this.addMember[i].objectId) {
                            this.addMember.splice(i, 1);
                            this.tableData.splice(index, 1);
                            this.$message({ message: '移除动态成功', type: 'success'});
                            return false;
                        }
                    }

                    let param = { 'objectIds': row.objectId, 'code': this.code };

                    topicMomentRemove(param).then(res =>{
                        let {msg,code,data} = res;

                        if(code !== 0){
                            this.$message({ message: msg, type: 'error'});
                        }else{
                            this.$message({ message: '移除动态成功', type: 'success'});
                            this.tableData.splice(index, 1);
                        }
                    });
                }).catch(() =>{

                });
            },
            addTopic() {
                this.add = true;
                for(let i = 0; i < this.tableList.length; i++) {
                    this.tableList[i].checked = false;
                }
                this.addMemberNum = [];
            }
        },
        mounted(){
            this.getTopicDetails();
            this.getTopicMomentList();
        }
    }
</script>

<style lang="scss" scoped>
    .formation{
        width: 100%;
        margin: 24px 0 0 50px;
        .form-content{
            p{
                font-size: 12px;
                height: 40px;
                line-height: 40px;                
            }
            img{
                margin-left: 0;
                height: 140px;
                width: 326px;
            }
        }      
        .el-button--large{
            &.buttonUpload{
                font-size: 12px!important;
                background-color: #999999;
                color: #FFF;
                width: 104px;
                height: 40px;
                font-weight: 300;
                border: none;
            }
        }
        .button-add{
            width: 80%;
            height: 40px;
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
            border-top: none;
            text-align: center;
            margin-left: 100px;
        }
    }
    
    
</style>
