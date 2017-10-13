<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper yzb light-overscroll">
                <section class="crumbs">
                    <el-breadcrumb separator="/" class="crumbs-btn">
                        <el-breadcrumb-item>车牌库</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button type="primary" size="small" class="btn-add" @click.native="carAddPate">新增车品牌</el-button>                    
                </section>   

                <section class="table" id="carTable">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="车品牌">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="车标">
                            <template scope="scope"><img :src="scope.row.logo"></template>                            
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="carAddChildPate(scope.$index, scope.row)">新增子品牌</el-button>
                                <el-button size="small" class="button-link" @click="carAddYear(scope.$index, scope.row)">新增年款</el-button>
                                 <el-button size="small" class="button-link" @click="carAddCon(scope.$index, scope.row)">新增车配置</el-button>
                                <el-button size="small" class="button-link" @click="uploadLogo(scope.$index, scope.row)">上传车标</el-button>
                                <el-button size="small" class="button-link" @click="carDetail(scope.$index, scope.row)">查看详情</el-button>                                
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

                <!--carAddPate-->
                <section class="carAddPate">
                    <el-dialog title="新增车品牌" :visible.sync="dialogShow" size="tiny" :modal-append-to-body="false">
                        <el-form :model="carAddPateForm"  ref="carAddPateForm" label-width="0" class="demo-ruleForm">
                            <el-form-item label="车品牌">
                                <el-input v-model="carAddPateForm.carAddPate" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" class="button-cancle" @click.native="hideDialog">取 消</el-button>
                            <el-button type="primary" :loading="loading" :disabled="!carAddPateForm.carAddPate" @click.native="submitCarPate('carAddPateForm')">确 定</el-button>
                        </span>
                    </el-dialog>
                </section>

                <!--carAddChildPate-->
                <section class="carAddChildPate">
                    <el-dialog title="新增子品牌" :visible.sync="carAddChildPateShow" size="tiny" :modal-append-to-body="false">
                        <el-form :model="carAddChildPateForm"  ref="carAddChildPateForm" label-width="0" class="demo-ruleForm">
                            <el-form-item label="车品牌">
                                <p>{{ carAddChildPateForm.name }}</p>
                            </el-form-item>
                            <el-form-item label="子品牌">
                                <el-input v-model="carAddChildPateForm.carClidPate" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" class="button-cancle" @click.native="hideDialog">取 消</el-button>
                            <el-button type="primary" :loading="loading" :disabled="!carAddChildPateForm.carClidPate" @click.native="submitChildCarPate('carAddChildPateForm')">确 定</el-button>
                        </span>
                    </el-dialog>
                </section>

                <!--carAddYear-->
                <section class="carAddYear">
                    <el-dialog title="新增年款" :visible.sync="carAddYearShow" size="tiny" :modal-append-to-body="false">
                        <el-form  :model="carAddYearForm"  ref="carAddYearForm" label-width="0" class="demo-ruleForm">
                            <el-form-item label="车品牌">
                                <p>{{ carAddYearForm.name }}</p>
                            </el-form-item>
                            <el-form-item label="子品牌">
                                <el-select v-model="carAddYearForm.ChildName" auto-complete="off">
                                    <el-option v-for=" clidcar in carAddYearForm.carClidPate" :label="clidcar.name" :value="clidcar.id"></el-option>
                                </el-select>
                            </el-form-item>
                             <el-form-item label="年款">
                                <el-input v-model="carAddYearForm.year" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" class="button-cancle" @click.native="hideDialog">取 消</el-button>
                            <el-button type="primary" :loading="loading" :disabled="!carAddYearForm.ChildName || !carAddYearForm.year" @click.native="submitYear('carAddYearForm')">确 定</el-button>
                        </span>
                    </el-dialog>
                </section>

                <!--carAddCon-->
                <section class="carAddCon">
                    <el-dialog title="新增车配置" :visible.sync="carAddConShow" size="tiny" :modal-append-to-body="false">
                        <el-form :model="carAddConForm"  ref="carAddConForm" label-width="0" class="demo-ruleForm">
                            <el-form-item label="车品牌">
                                <p>{{ carAddConForm.name }}</p>
                            </el-form-item>
                            <el-form-item label="子品牌">
                                <el-select v-model="carAddConForm.ChildName" auto-complete="off" @change="change">
                                    <el-option v-for=" clidcar in carAddConForm.carClidPate" :label="clidcar.name" :value="clidcar.id"></el-option>                                    
                                </el-select>
                            </el-form-item>
                             <el-form-item label="年款">
                                <el-select v-model="carAddConForm.yearId" auto-complete="off">
                                    <el-option v-for=" clidYear in carAddConForm.carClidYear" :label="clidYear.name" :value="clidYear.id"></el-option>                                                                        
                                </el-select>
                            </el-form-item>
                            <el-form-item label="车配置">
                                <el-input v-model="carAddConForm.carCon" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" class="button-cancle" @click.native="hideDialog">取 消</el-button>
                            <el-button type="primary" :loading="loading" :disabled="!carAddConForm.ChildName || !carAddConForm.yearId || !carAddConForm.carCon" @click.native="submitCon('carAddConForm')">确 定</el-button>
                        </span>
                    </el-dialog>
                </section>

                <!--uploadLogo-->
                <section class="uploadLogo">
                    <el-dialog title="上传车标" :visible.sync="uploadLogoShow" size="tiny" :modal-append-to-body="false">
                        <el-form :model="uploadLogoForm"  ref="uploadLogoForm" label-width="0" class="demo-ruleForm">
                            <el-form-item label="车品牌">
                                <p>{{uploadLogoForm.name}}</p>
                            </el-form-item>
                            <el-form-item label="车标">
                                 <el-upload
                                    :disabled=" uploadLogoForm.thumb.length != 0 "
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    :data="{ 'brandId': uploadLogoForm.id }"
                                    :file-list="uploadLogoForm.thumb"
                                    list-type="picture"
                                    :before-upload="uploadBefore"
                                    :on-success="uploadSucc"
                                    :on-error="uploadError"
                                    :on-remove="uploadRemove">
                                    <el-button type="primary" class="upButton" :disabled="uploadLogoForm.thumb.length != 0 ">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传png文件，尺寸为46*46</div>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" class="button-cancle" @click.native="hideDialog">取 消</el-button>
                            <el-button type="primary" :loading="loading" :disabled="uploadLogoForm.thumb.length == 0 " @click.native="submitLogo">确 定</el-button>
                        </span>
                    </el-dialog>
                </section>


            </div>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import {COMMON} from '../common/js/common';
    import {BASE, carBrandInfoList, carBrandUploadLogo, carBrandInfoAdd, carBrandGetCarInfo} from '../api/api';

    export default {
        data() {
            return {
                tableData: [],
                uploadUrl: BASE + '/carBrandInfo/uploadLogo',
                carAddPateForm:{
                    carAddPate:''
                },
                carAddChildPateForm:{
                    name:'',
                    id: '',
                    carClidPate:''
                },
                carAddYearForm:{
                    id: '',
                    name:'',
                    ChildName:'',
                    carClidPate:[],
                    year:''
                },
                carAddConForm:{
                    name:'',
                    ChildName:'',
                    carClidPate:[],
                    carClidYear:[],
                    year:'',
                    yearId:'',
                    carCon:''
                },
                uploadLogoForm:{
                    thumb:[],
                    id:'',
                    name:''
                },
                tableloading:true,
                noPagi:true,
                pagi: {
                    currentPage: 1,
                    pageSize: 6,
                    total: '',
                    pageTotal:''
                },
                dialogShow: false,
                carAddChildPateShow:false,
                carAddYearShow:false,
                carAddConShow:false,
                uploadLogoShow:false,
                loading:false
            };
        },
        methods: {
            carAddPate() {
                this.dialogShow = true;
            },
            hideDialog() {
                this.dialogShow = false;
                this.carAddChildPateShow = false;
                this.carAddYearShow = false;
                this.carAddConShow = false;
                this.uploadLogoShow = false;
            },
            carAddChildPate(index,row) {
                this.carAddChildPateShow = true;
                this.carAddChildPateForm.name = row.name;
                this.carAddChildPateForm.id = row.id;
                this.carAddChildPateForm.carClidPate = '';
            },
            carAddYear(index,row) {
                this.carAddYearShow = true;
                this.carAddYearForm.name = row.name;
                this.carAddYearForm.ChildName = '';
                this.carAddYearForm.id = row.id;
                this.getCarInfoList(this.carAddYearForm,this.carAddYearForm.id);
            },
            carAddCon(index, row) {
                this.carAddConShow = true;
                this.carAddConForm.name = row.name;
                this.carAddConForm.ChildName = '';
                this.carAddConForm.yearId = '';
                this.carAddConForm.id = row.id;
                this.getCarInfoList(this.carAddConForm,this.carAddConForm.id);
            },
            uploadLogo(index,row) {
               this.uploadLogoShow = true;
               this.uploadLogoForm.id = row.id;
               this.uploadLogoForm.name = row.name;
            },
            getCarBrandInfoList() {
                this.tableloading = true;

                let param = {
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                }

                carBrandInfoList(param).then(res =>{
                    this.tableloading = false;

                    let {msg, code, data} = res;

                    if( code !== 0 ){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        if(data.list.length == 0){
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
            getCarInfoList(name,id){
                let param = {
                    'superId' : id
                };

                carBrandGetCarInfo(param).then(res =>{
                    let {msg, code, data } = res;

                    if( code !== 0 ){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        name.carClidPate = data.carSelectVoList;
                    }
                });
            },
            carBrandAdd(param){
                    let that = this;
                    carBrandInfoAdd(param).then(res =>{
                        let {msg, code, data } = res;

                        if( code !== 0){
                            this.$message({ message :msg, type: 'error'});
                        }else{
                            this.$message({ message : '新增成功', type: 'success'});
                            that.dialogShow = false;
                            that.carAddChildPateShow = false;
                            that.carAddYearShow = false;
                            that.carAddConShow = false;
                            that.uploadLogoShow = false;

                            this.getCarBrandInfoList();
                            this.carAddYearForm.year = '';
                            
                        }
                    });
            },
            submitCarPate(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        let param = {
                            'brandId': 0,
                            'superId': 0,
                            'name': this.carAddPateForm.carAddPate
                        };

                        this.carBrandAdd(param);

                    }else{
                        return false;
                    }
                });
            },
            submitChildCarPate(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        let param = {
                            'brandId': this.carAddChildPateForm.id,
                            'superId': this.carAddChildPateForm.id,
                            'name': this.carAddChildPateForm.carClidPate
                        };

                        this.carBrandAdd(param);
                        
                    }else{
                        return false;
                    }
                });
            },
            submitYear(formName) {
                this.$refs[formName].validate((valid) =>{
                    if(valid){
                        
                        let param = {
                            'brandId': this.carAddYearForm.id,
                            'superId': this.carAddYearForm.ChildName,
                            'name': this.carAddYearForm.year
                        };
                    
                        this.carBrandAdd(param);
                        
                         
                    }else{
                        return false;
                    }
                });
            },
            change(val){
                let param = {
                    'superId' : val
                };

                carBrandGetCarInfo(param).then(res =>{
                    let {msg, code, data } = res;

                    if( code !== 0 ){
                        this.$message({ message: msg, type: 'error'});
                    }else{
                        this.carAddConForm.carClidYear = data.carSelectVoList;
                    }
                });
            },
            submitCon(formName) {
                this.$refs[formName].validate((valid) =>{
                    if(valid){
                        let param = {
                            'brandId': this.carAddConForm.id,
                            'superId': this.carAddConForm.yearId,
                            'name': this.carAddConForm.carCon
                        };

                        this.carBrandAdd(param);
                        this.carAddConForm.carCon = '';

                    }else{
                        return false;
                    }
                });
            },
            submitLogo() {
               this.uploadLogoShow = false;
               this.getCarBrandInfoList();
               this.uploadLogoForm.thumb = [];
            },
            carDetail(index,row){
                this.$router.push({ path: '/LicensePlateDetail', query: { id: row.id ,name: row.name } });
            },
            uploadBefore(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '照片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadError(response, file, fileList) {
                this.$message({ message: '照片上传失败，请重试！', type: 'error'});
            },
            uploadSucc(response, file, fileList) {
                this.uploadLogoForm.thumb = fileList;
            },
            uploadRemove(file, fileList) {
                this.uploadLogoForm.thumb = fileList;
            },
            handleCurrentChange(val) {
                 this.pagi.currentPage = parseInt(val);
                 this.getCarBrandInfoList();
            }
        },
        mounted() {
            this.getCarBrandInfoList();
        }
    }
</script>

<style lang="scss" scoped>
    .crumbs{
        .crumbs-btn{
            float: left;
        }
        .btn-add{
            float: right;
            width: 99px;
            font-weight: 300;
        }
    }
    .cell{
        img{
            margin: 0;
            width: 50px;
            height: 50px;
            display: block;
        }
    }
</style>
