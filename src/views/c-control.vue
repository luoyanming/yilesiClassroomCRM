<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>智慧卡管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="卡号">
                            <el-input v-model="searchForm.cardNo" size="small" placeholder="请输入卡号"></el-input>
                        </el-form-item>
                        <el-form-item label="售出渠道">
                            <el-select v-model="searchForm.saleChannel" placeholder="请选择">
                                <el-option v-for="item in saleChannelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="售出方式">
                            <el-select v-model="searchForm.saleType" placeholder="请选择">
                                <el-option v-for="item in saleTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="卡状态">
                            <el-select v-model="searchForm.cardStatus" placeholder="请选择">
                                <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="handleAdd">导入新卡</el-button>
                    <el-button type="primary" size="small" class="btn-add button-add" icon="upload2" @click.native="handleCardlistExport">导出</el-button>
                    <el-button type="primary" size="small" class="btn-add" icon="edit" @click.native="handleExchange" style="margin-right: 5px;">批量换卡</el-button>
                </section>

                <section class="table">
                    <el-table ref="multipleTable" :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="卡号MAC">
                            <template scope="scope">{{ scope.row.code }}</template>
                        </el-table-column>
                        <el-table-column label="NFC号">
                            <template scope="scope">{{ scope.row.nfcCode }}</template>
                        </el-table-column>
                        <el-table-column label="持卡人">
                            <template scope="scope">{{ scope.row.holder }}</template>
                        </el-table-column>
                        <el-table-column label="学校编号">
                            <template scope="scope">{{ scope.row.schoolCode }}</template>
                        </el-table-column>                       
                        <el-table-column label="OU班级编号">
                            <template scope="scope">{{ scope.row.classCode }}</template>
                        </el-table-column>    
                        <el-table-column label="学籍号">
                            <template scope="scope">{{ scope.row.schoolRollNo }}</template>
                        </el-table-column>    
                        <el-table-column label="持卡人信息">
                            <template scope="scope">{{ scope.row.holderInfo == '' ? '' : scope.row.holderInfo.substring(0, 4) +'***'+ scope.row.holderInfo.substring(7, 8) }}</template>
                        </el-table-column>
                        <el-table-column label="卡版本">
                            <template scope="scope">{{ scope.row.version }}</template>
                        </el-table-column>
                        <el-table-column label="售出渠道">
                            <template scope="scope">{{ scope.row.channelName }}</template>
                        </el-table-column>
                        <el-table-column label="售出方式">
                            <template scope="scope">{{ scope.row.saleTypeStr }}</template>
                        </el-table-column>
                        <el-table-column label="售出价格">
                            <template scope="scope">{{ scope.row.price }}</template>
                        </el-table-column>
                        <el-table-column label="卡目前状态">
                            <template scope="scope">{{ scope.row.statusStr }}</template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" class="button-link" @click="handleCardChange(scope.$index, scope.row)" v-if="scope.row.status == 0 || scope.row.status == 1">换卡</el-button>
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

                <el-dialog title="导入新卡" :visible.sync="addDialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="addRules" ref="addRuleForm" label-width="180px" :model="addDialogInfo">
                            <el-form-item label="导入卡号" prop="excel">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    :on-change="uploadChange"
                                    :action="uploadUrl"
                                    :data="{ 'version': addDialogInfo.version, 'channelId': addDialogInfo.saleChannel, 'saleType': addDialogInfo.saleType, 'price': addDialogInfo.price, 'status': addDialogInfo.cardStatus }"
                                    :on-success="uploadSucc"
                                    :on-error="uploadError"
                                    :file-list="fileList"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small" type="primary">导入excel</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="卡版本" prop="version">
                                <el-input v-model="addDialogInfo.version"></el-input>
                            </el-form-item>
                            <el-form-item label="售出渠道" prop="saleChannel">
                                <el-select v-model="addDialogInfo.saleChannel" placeholder="请选择">
                                    <el-option v-for="item in saleChannelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="售出方式" prop="saleType">
                                <el-select v-model="addDialogInfo.saleType" placeholder="请选择">
                                    <el-option v-for="item in saleTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="售出价格" prop="price">
                                <el-input v-model="addDialogInfo.price"></el-input>
                            </el-form-item>
                            <el-form-item label="原始状态" prop="cardStatus">
                                <el-select v-model="addDialogInfo.cardStatus" placeholder="请选择">
                                    <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="addDialogLoading" @click.native="submitUpload('addRuleForm')">保存</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="编辑卡" :visible.sync="editDialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="editRules" ref="editRuleForm" label-width="180px" :model="editDialogInfo">
                            
                            <el-form-item label="卡号MAC">
                                <el-input v-model="editDialogInfo.cardNo" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="NFC号">
                                <el-input v-model="editDialogInfo.nfcCode"></el-input>
                            </el-form-item>
                            <el-form-item label="卡版本" prop="version">
                                <el-input v-model="editDialogInfo.version"></el-input>
                            </el-form-item>
                            <el-form-item label="持卡人" prop="holder">
                                <el-input v-model="editDialogInfo.holder"></el-input>
                            </el-form-item>
                            <el-form-item label="学校编号">
                                <el-input v-model="editDialogInfo.schoolCode"></el-input>
                            </el-form-item>                            
                            <el-form-item label="OU班级编号" prop="classCode">
                                <el-input v-model="editDialogInfo.classCode"></el-input>
                            </el-form-item>
                            <el-form-item label="学籍号">
                                <el-input v-model="editDialogInfo.schoolRollNo"></el-input>
                            </el-form-item>     
                            <el-form-item label="持卡人信息" prop="holderInfo">
                                <input type="text" v-model="holderInfoStr" class="dateInput">
                                <el-date-picker
                                    v-model="editDialogInfo.holderInfo"
                                    size="small"
                                    type="date"
                                    format="yyyyMMdd"
                                    @change="dateChange"
                                    placeholder="请选择">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="售出渠道" prop="saleChannel">
                                <el-select v-model="editDialogInfo.saleChannel" placeholder="请选择">
                                    <el-option v-for="item in saleChannelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="售出方式" prop="saleType">
                                <el-select v-model="editDialogInfo.saleType" placeholder="请选择">
                                    <el-option v-for="item in saleTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="售出价格" prop="price">
                                <el-input v-model="editDialogInfo.price"></el-input>
                            </el-form-item>
                            <el-form-item label="原始状态" prop="cardStatus">
                                <el-select v-model="editDialogInfo.cardStatus" placeholder="请选择">
                                    <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="editDialogLoading" @click.native="submitEdit('editRuleForm')">保存</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="智慧卡批量换卡（信息转移）" :visible.sync="exchangeDialogShow" :modal-append-to-body="false">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="exchangeRules" ref="exchangeRuleForm" label-width="180px" :model="exchangeDialogInfo" style="padding: 40px 0;">
                            <el-form-item label="导入Excel" prop="excel">
                                <el-upload
                                    class="upload-demo"
                                    ref="uploadExchange"
                                    :on-change="uploadExchangeChange"
                                    :action="uploadExchangeUrl"
                                    :on-success="uploadExchangeSucc"
                                    :on-error="uploadExchangeError"
                                    :file-list="exchangeFileList"
                                    :auto-upload="false"
                                    style="float: left;">
                                    <el-button slot="trigger" size="small" type="primary" :disabled="exchangeFileChange.length > 0">导入excel</el-button>
                                </el-upload>

                                <el-button type="primary" size="small" class="btn-add button-add" icon="upload2" @click.native="handleDownloadExchange" style="float: right;">下载批量换卡模板</el-button>
                            </el-form-item>
                        </el-form>

                        <div class="tips" style="color: #888;">
                            注意：智慧卡换卡后原卡的所有信息，包括持卡人基本信息（持卡人姓名、生日、所在班级等）、课程记录、答题记录都将转移至新卡上。
                        </div>
                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="exchangeDialogLoading" @click.native="submitExchangeUpload('exchangeRuleForm')">确定</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="智慧卡换卡（信息转移）" :visible.sync="transferDialogShow" :modal-append-to-body="false" class="transfer-dialog">
                    <section class="formation">
                       
                        <el-form label-position="right" :rules="transferRules" ref="transferRuleForm" label-width="180px" :model="transferDialogInfo">

                            <div class="flex-h">
                                <div class="flex-a-i">
                                    <el-form-item label="原卡号MAC">
                                        <el-input v-model="transferDialogInfo.cardNo" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item label="NFC号">
                                        <el-input v-model="transferDialogInfo.nfcCode" disabled></el-input>
                                    </el-form-item>                                    
                                </div>
                                <div class="seprate">换成</div>
                                <div class="flex-a-i">
                                    <el-form-item label="新卡号MAC">
                                        <el-input v-model="transferDialogInfo.newCardNo"></el-input>
                                    </el-form-item>
                                    <el-form-item label="NFC号">
                                        <el-input v-model="transferDialogInfo.newNfcCode"></el-input>
                                    </el-form-item>                                    
                                </div>
                            </div>
                            
                        </el-form>

                    </section>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" :loading="transferDialogLoading" @click.native="submitTransfer('transferRuleForm')">保存</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, channelList, smartCardList, smartCardSave, transferCard, smartCardExport, smartCardImport } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    cardNo: '',
                    saleChannel: '',
                    saleType: '',
                    cardStatus: ''
                },
                tableData: [],
                multipleSelection: [],
                tableloading: true,

                noPagi: true,
                pagi: {
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: '',
                    total: ''
                },
                saleChannelOptions:[
                    {
                        value:'',
                        label:'全部'
                    }
                ],
                saleTypeOptions:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'购买'
                    },
                    {
                        value:'1',
                        label:'赠送'
                    }
                ],
                cardStatusOptions:[
                    {
                        value:'',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'正常'
                    },
                    {
                        value:'1',
                        label:'停用'
                    },
                    {
                        value:'2',
                        label:'作废'
                    }
                ],

                addDialogInfo: {
                    id: '',
                    index: '',
                    version: '',
                    price: '',
                    saleChannel: '',
                    saleType: '',
                    cardStatus: ''
                },
                addDialogShow: false,
                addDialogLoading: false,
                addRules: {
                    version: [
                        { required: true, message: '*请输入卡版本', trigger: 'blur' }
                    ],
                    saleChannel: [
                        { required: true, message: '*请选择售出渠道', trigger: 'change' }
                    ],
                    saleType: [
                        { required: true, message: '*请选择售出方式', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '*请输入售出价格', trigger: 'blur' }
                    ],
                    cardStatus: [
                        { required: true, message: '*请选择原始状态', trigger: 'change' }
                    ],
                },

                editDialogInfo: {
                    id: '',
                    index: '',
                    cardNo: '',
                    nfcCode: '',
                    schoolRollNo: '',
                    schoolCode: '',
                    version: '',
                    holder: '',
                    holderInfo: '',
                    price: '',
                    saleChannel: '',
                    saleType: '',
                    cardStatus: ''
                },
                holderInfoStr: '',
                editDialogShow: false,
                editDialogLoading: false,
                editRules: {
                    version: [
                        { required: true, message: '*请输入卡版本', trigger: 'blur' }
                    ],
                    saleChannel: [
                        { required: true, message: '*请选择售出渠道', trigger: 'change' }
                    ],
                    saleType: [
                        { required: true, message: '*请选择售出方式', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '*请输入售出价格', trigger: 'blur' }
                    ],
                    cardStatus: [
                        { required: true, message: '*请选择原始状态', trigger: 'change' }
                    ],
                },

                uploadLoading: false,
                uploadUrl: uploadPath + '/ajax/smartCard/excel/import',
                fileList: [],
                fileChange: new Array(),

                exchangeDialogShow: false,
                exchangeDialogLoading: false,
                exchangeDialogInfo: {

                },
                exchangeRules: {

                },
                uploadExchangeLoading: false,
                uploadExchangeUrl: uploadPath + '/ajax/smartCard/batch/change',
                exchangeFileList: [],
                exchangeFileChange: new Array(),


                transferDialogShow: false,
                transferDialogLoading: false,
                transferDialogInfo: {
                    cardNo: '',
                    nfcCode: '',
                    newCardNo: '',
                    newNfcCode: ''
                },
                transferRules: {
                    
                }                          
            };
        },
        methods: {
            getChannelList: function() {
                let param = {
                    'status': '',
                    'pageNo': 1,
                    'pageSize': 10000
                };

                channelList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            return false;
                        }

                        for(let i = 0; i < data.list.length; i++) {
                            this.saleChannelOptions.push({
                                'value': ''+ data.list[i].id,
                                'label': data.list[i].name
                            });
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取渠道列表失败！', type: 'error'});
                });
            },
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getCardList();
            },
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getCardList();
            },
            getCardList: function() {
                this.tableloading = true;

                let param = {
                    'code': this.searchForm.cardNo,
                    'channelId': this.searchForm.saleChannel,
                    'saleType': this.searchForm.saleType,
                    'status': this.searchForm.cardStatus,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                smartCardList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取智慧卡列表失败！', type: 'error'});
                });
            },
            // 换卡
            handleExchange: function() {
                this.exchangeDialogShow = true;

                setTimeout(function() {
                    that.$refs['exchangeRuleForm'].resetFields();
                }, 1);                
            },
            // 添加
            handleAdd: function() {
                this.addDialogShow = true;

                setTimeout(function() {
                    that.$refs['addRuleForm'].resetFields();
                }, 1);
            },
            // 编辑
            handleEdit: function(index, row) {
                this.editDialogShow = true;

                setTimeout(function() {
                    that.$refs['editRuleForm'].resetFields();

                    that.editDialogInfo.id = row.id;
                    that.editDialogInfo.index = index;
                    that.editDialogInfo.cardNo = row.code;
                    that.editDialogInfo.nfcCode = row.nfcCode;
                    that.editDialogInfo.schoolRollNo = row.schoolRollNo;
                    that.editDialogInfo.schoolCode = row.schoolCode;
                    that.editDialogInfo.version = row.version;
                    that.editDialogInfo.holder = row.holder;
                    that.editDialogInfo.classCode = row.classCode;
                    if(row.holderInfo) {
                        that.editDialogInfo.holderInfo = row.holderInfo.substring(0, 4) + '-' + row.holderInfo.substring(4, 6) + '-' + row.holderInfo.substring(6, 8);
                    } else {
                        that.editDialogInfo.holderInfo = row.holderInfo;
                    }
                    that.editDialogInfo.price = ''+ row.price;
                    that.editDialogInfo.saleChannel = ''+ (row.channelId == 0 ? '' : row.channelId);
                    that.editDialogInfo.saleType = ''+ row.saleType;
                    that.editDialogInfo.cardStatus = ''+ row.status;
                }, 1);
            },

            // 单卡转移
            handleCardChange: function(index, row) {
                this.transferDialogShow = true;

                setTimeout(function() {
                    that.$refs['transferRuleForm'].resetFields();

                    that.transferDialogInfo.cardNo = row.code;
                    that.transferDialogInfo.nfcCode = row.nfcCode;
                    that.transferDialogInfo.newCardNo = '';
                    that.transferDialogInfo.newNfcCode = '';                 
                }, 1);             
            },

            // 单卡转移 提交
            submitTransfer: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(!this.transferDialogInfo.newCardNo) {
                            this.$message({ message: '请输入新卡号MAC', type: 'error'});
                            return false;
                        }

                        this.transferDialogLoading = true;

                        let params = {
                            'code': this.transferDialogInfo.cardNo,
                            'nfcCode': this.transferDialogInfo.nfcCode,
                            'nwCode': this.transferDialogInfo.newCardNo,
                            'nwNfcCode': this.transferDialogInfo.newNfcCode
                        };

                        transferCard(params).then(res=>{
                            this.transferDialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存智慧卡信息成功！', type: 'success' });
                                this.transferDialogShow = false;
                                this.getCardList();
                            }
                        }).catch(error => {
                            this.transferDialogLoading = false;
                            this.$message({ message: '网络异常！保存智慧卡信息失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });                
            },

            // 提交编辑内容
            submitEdit: function(formName) {
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.editDialogLoading = true;

                        let params = {
                            'id': this.editDialogInfo.id,
                            'code': this.editDialogInfo.cardNo,
                            'nfcCode': this.editDialogInfo.nfcCode,
                            'schoolRollNo': this.editDialogInfo.schoolRollNo,
                            'schoolCode': this.editDialogInfo.schoolCode,
                            'channelId': this.editDialogInfo.saleChannel,
                            'saleType': this.editDialogInfo.saleType,
                            'status': this.editDialogInfo.cardStatus,
                            'version': this.editDialogInfo.version,
                            'holder': this.editDialogInfo.holder,
                            'classCode': this.editDialogInfo.classCode,
                            'holderInfo': this.editDialogInfo.holderInfo == '' ? '' : COMMON.formatDate(this.editDialogInfo.holderInfo, ''),
                            'price': this.editDialogInfo.price
                        };

                        smartCardSave(params).then(res=>{
                            this.editDialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存智慧卡信息成功！', type: 'success' });
                                this.editDialogShow = false;
                                this.getCardList();
                            }
                        }).catch(error => {
                            this.editDialogLoading = false;
                            this.$message({ message: '网络异常！保存智慧卡信息失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });
            },
            dateChange: function(val) {
                if(val == ''){
                    this.holderInfoStr = '';
                } else {
                    this.holderInfoStr = val.substring(0, 4) +'***'+ val.substring(7, 8);
                }
            },

            uploadError(response, file, fileList) {
                this.$message({ message: '导入excel失败！请重试！', type: 'error' });
                this.uploadLoading = false;
                this.fileList = [];
            },
            uploadSucc(response, file, fileList) {
                if(response.code != 0) {
                    this.$message({ message: response.errorInfo, type: 'error' });
                    this.uploadLoading = false;
                    this.fileList = [];
                } else {
                    this.$message({ message: '导入excel成功！', type: 'success' });
                    this.uploadLoading = false;
                    this.addDialogShow = false;
                    this.fileList = [];
                    this.addDialogInfo.version = '';
                    this.addDialogInfo.price = '';
                    this.addDialogInfo.saleChannel = '';
                    this.addDialogInfo.saleType = '';
                    this.addDialogInfo.cardStatus = '';
                    this.getCardList();
                }
            },
            uploadChange: function(file, fileList) {
                this.fileChange = fileList;
            },
            // 提交excel
            submitUpload: function(formName) {
                if(this.fileChange.length == 0) {
                    this.$message({ message: '请上传excel文件！', type: 'error' });
                    return false;
                }

                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.uploadLoading = true;
                        this.$refs.upload.submit();
                    }else{
                        return false;
                    }
                });
            },


            // 批量换卡上传组件
            uploadExchangeError(response, file, fileList) {
                this.$message({ message: '导入excel失败！请重试！', type: 'error' });
                this.uploadExchangeLoading = false;
                this.exchangeFileList = [];
            },
            uploadExchangeSucc(response, file, fileList) {
                setTimeout(function() {

                    if(response.code != 0) {
                        that.$message({ message: response.errorInfo, type: 'error' });
                        that.uploadExchangeLoading = false;
                        that.exchangeFileList = [];
                        that.exchangeFileChange = [];
                    } else {
                        that.$message({ message: '导入excel成功！', type: 'success' });
                        that.uploadExchangeLoading = false;
                        that.exchangeDialogShow = false;
                        that.exchangeFileList = [];
                        that.exchangeFileChange = [];
                        that.getCardList();
                    }

                }, 1);
            },
            uploadExchangeChange: function(file, fileList) {
                this.exchangeFileChange = fileList;
            },
            // 提交excel
            submitExchangeUpload: function(formName) {
                if(this.exchangeFileChange.length == 0) {
                    this.$message({ message: '请上传excel文件！', type: 'error' });
                    return false;
                }

                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.uploadExchangeLoading = true;
                        this.$refs.uploadExchange.submit();
                    }else{
                        return false;
                    }
                });
            },
            handleDownloadExchange: function() {
                location.href = uploadPath + '/template/download?fileName=card-update.xlsx';
            },    

            handleCardlistExport: function() {
                let idsArr = [];
                if(this.multipleSelection && this.multipleSelection.length > 0) {
                    for(let i = 0; i < this.multipleSelection.length; i++) {
                        idsArr.push(this.multipleSelection[i].id);
                    }
                }

                location.href = uploadPath + '/ajax/smartCard/export?code='+ this.searchForm.cardNo +'&channelId=' + this.searchForm.saleChannel + '&saleType=' + this.searchForm.saleType + '&status=' + this.searchForm.cardStatus + '&ids=' + idsArr.join(',');
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        mounted() {
            that = this;
            this.getChannelList();
            this.getCardList();
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

    .dateInput{
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 180px;
        height: 40px;
        font-size: 12px;
        color: #333;
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        padding: 3px 10px;

        & + .el-input .el-input__inner{
            opacity: 0 !important;
        }
    }

     .transfer-dialog .el-dialog{
        width: auto;
        padding-right: 50px;

        .seprate{
            position: relative;
            right: -45px;
            white-space: nowrap;
            line-height: 120px;
        }

        .el-button{
            position: relative;
            right: -50px;
        }
    }
</style>

<style lang="scss" scoped="">
    .button-add{
        margin-right: 15px;
    }
</style>

