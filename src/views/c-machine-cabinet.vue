<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>智慧文教柜</el-breadcrumb-item>
            </el-breadcrumb>
        </section>
        
        <section class="search clearfix">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option v-for="item in searchFormTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="searchForm.typeValue" size="small" placeholder="请输入" style="margin-left: 10px;"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-select v-model="searchForm.version" placeholder="请选择">
                        <el-option v-for="item in versionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
                <el-form-item label="设备状态">
                    <el-select v-model="searchForm.cardStatus" placeholder="请选择">
                        <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
            
            <div class="button-blank">
                <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleExport">导出</el-button>
                <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="handleApplication">导入应用信息</el-button>
                <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd">导入新文教柜</el-button>
            </div>
        </section>

        <section class="table">
            <!-- <el-table ref="multipleTable" :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading" @selection-change="handleSelectionChange"> -->
            <el-table :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column label="文教柜设备号">
                    <template scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column label="文教柜编号">
                    <template scope="scope">{{ scope.row.deviceName }}</template>
                </el-table-column>
                <el-table-column label="所在学校编号">
                    <template scope="scope">{{ scope.row.schoolCode }}</template>
                </el-table-column>
                <el-table-column label="所在区域编号">
                    <template scope="scope">{{ scope.row.regionCode }}</template>
                </el-table-column>
                <el-table-column label="文教柜版本">
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
                <el-table-column label="操作">
                    <template scope="scope">
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

        <el-dialog title="导入新文教柜" :visible.sync="addDialogShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="addRules" ref="addRuleForm" label-width="180px" :model="addDialogInfo">

                    <el-form-item label="导入EXCEL" prop="excel">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :on-change="uploadChange"
                            :action="uploadUrl"
                            :data="{ 'versionId': addDialogInfo.version, 'channelId': addDialogInfo.saleChannel, 'saleType': addDialogInfo.saleType, 'price': addDialogInfo.price, 'batch': addDialogInfo.batch, 'status': addDialogInfo.cardStatus }"
                            :on-success="uploadSucc"
                            :on-error="uploadError"
                            :file-list="fileList"
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">导入excel</el-button>
                        </el-upload>

                        <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleDownloadActivate" style="position: absolute; z-index: 3; top: 0; right: 0;">下载导入模板</el-button>
                    </el-form-item>
                    <el-form-item label="文教柜版本" prop="version">
                        <el-select v-model="addDialogInfo.version" placeholder="请选择">
                            <el-option v-for="item in versionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>                        
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
                    <el-form-item label="批次" prop="batch">
                        <el-input v-model="addDialogInfo.batch"></el-input>
                        <p style="color: #888; font-size: 12px; line-height: 1.5; margin-top: 10px;">批次格式为订单号/合同号 - 借样号 - 批次编号，如果没有借样号那么借样号处填写为0</p>
                    </el-form-item>
                    <el-form-item label="设备状态" prop="cardStatus">
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

        <el-dialog title="编辑文教柜信息" :visible.sync="editDialogShow" :modal-append-to-body="false" class="editDialog-wrapper">
            <section class="formation">
               
                <el-form label-position="right" :rules="editRules" ref="editRuleForm" label-width="180px" :model="editDialogInfo">
                    <div class="flex-h">
                        <div style="width: 300px">
                            <div style="font-size: 14px; line-height: 2; color: #333; padding: 10px 0 20px 0;">智慧文教柜基本信息</div>
                            <div class="">
                                <el-form-item label="文教柜设备号">
                                    <el-input v-model="editDialogInfo.code" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="文教柜版本" prop="version">
                                    <el-select v-model="editDialogInfo.version" placeholder="请选择">
                                        <el-option v-for="item in versionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select> 
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
                                <el-form-item label="批次" prop="batch">
                                    <el-input v-model="editDialogInfo.batch"></el-input>
                                </el-form-item>
                                <el-form-item label="设备状态" prop="status">
                                    <el-select v-model="editDialogInfo.status" placeholder="请选择">
                                        <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>

                        <div class="flex-a-i">
                            <div style="font-size: 14px; line-height: 2; color: #333; padding: 10px 0 20px 0;">智慧文教柜应用信息</div>
                            <div class="">
                                <el-form-item label="文教柜编号">
                                    <el-input v-model="editDialogInfo.deviceName"></el-input>
                                </el-form-item>
                                <el-form-item label="所在学校编号">
                                    <el-input v-model="editDialogInfo.schoolCode"></el-input>
                                </el-form-item>
                                <el-form-item label="所在区域编号">
                                    <el-input v-model="editDialogInfo.regionCode"></el-input>
                                </el-form-item>
                                <el-form-item label="具体位置">
                                    <el-input type="textarea" v-model="editDialogInfo.position" resize="none"></el-input>
                                </el-form-item>
                                <el-form-item label="视图">
                                    <el-upload
                                        class="upload-demo"
                                        :action="uploadViewUrl"
                                        :data="{ 'code': editDialogInfo.code }"
                                        :before-upload="handleViewUploadBefore"
                                        :on-remove="handleViewUploadRemove"
                                        :on-success="handleViewUploadSuccess"
                                        :on-error="handleViewUploadError"
                                        :file-list="editDialogInfo.viewUrl"
                                        list-type="picture">
                                        <el-button size="small" type="primary" :disabled="editDialogInfo.viewUrl.length != 0">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip" style="display: inline-block; width: 200px; vertical-align: middle; line-height: 1.2;">上传尺寸不得小于1024像素 X 768像素，支持jpg、jpeg、png</div>
                                    </el-upload>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="editDialogLoading" @click.native="submitEdit('editRuleForm')">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="导入文教柜应用信息" :visible.sync="applicationDialogShow" :modal-append-to-body="false">
            <section class="formation">
               
                <el-form label-position="right" :rules="applicationRules" ref="applicationRuleForm" label-width="180px" :model="applicationDialogInfo" style="padding: 40px 0;">
                    <el-form-item label="导入Excel" prop="excel">
                        <el-upload
                            class="upload-demo"
                            ref="uploadApplication"
                            :on-change="uploadApplicationChange"
                            :action="uploadApplicationUrl"
                            :on-success="uploadApplicationSucc"
                            :on-error="uploadApplicationError"
                            :file-list="applicationFileList"
                            :auto-upload="false"
                            style="float: left;">
                            <el-button slot="trigger" size="small" type="primary" :disabled="applicationFileChange.length > 0">导入excel</el-button>
                        </el-upload>

                        <el-button type="primary" size="small" class="btn-add button-add" icon="upload2" @click.native="handleDownloadApplication" style="position: absolute; z-index: 3; top: 0; right: 0;">下载模板</el-button>
                    </el-form-item>
                </el-form>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="applicationDialogLoading" @click.native="submitApplicationUpload('applicationRuleForm')">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="导出信息" :visible.sync="exportDialogShow" :modal-append-to-body="false" class="export-dialog">
            <section class="formation">

                <div class="checkbox-wrap">
                    <div class="checkbox-item flex-h">
                        <div class="item-label">导出内容</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.contentAll" @change="handleContentCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.content" @change="handleContentCheckChange">
                                <el-checkbox v-for="item in contentOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>

                <div class="checkbox-wrap">
                    <div class="checkbox-item flex-h">
                        <div class="item-label">设备版本</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.versionAll" @change="handleVersionCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.version" @change="handleVersionCheckChange">
                                <el-checkbox v-for="item in versionOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="checkbox-item flex-h">
                        <div class="item-label">选择渠道</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.saleChannelAll" @change="handleSaleChannelCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.saleChannel" @change="handleSaleChannelCheckChange">
                                <el-checkbox v-for="item in saleChannelOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="checkbox-item flex-h">
                        <div class="item-label">售出方式</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.saleTypeAll" @change="handleSaleTypeCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.saleType" @change="handleSaleTypeCheckChange">
                                <el-checkbox v-for="item in saleTypeOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="checkbox-item flex-h">
                        <div class="item-label">设备状态</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.cardStatusAll" @change="handleCardStatusCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.cardStatus" @change="handleCardStatusCheckChange">
                                <el-checkbox v-for="item in cardStatusOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>

                <div class="checkbox-wrap" v-show="schoolOptions.length > 0">
                    <div class="checkbox-item flex-h">
                        <div class="item-label">学校</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.schoolAll" @change="handleSchoolCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.school" @change="handleSchoolCheckChange">
                                <el-checkbox v-for="item in schoolOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>

                
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="exportDialogLoading" @click.native="handleExportSubmit">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, channelList, getAllSmartDeviceVersion, getSchoolListByChannel, smartCounterList, smartCounterSave } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                searchForm: {
                    type: '1',
                    typeValue: '',
                    version: '',
                    saleChannel: '',
                    saleType: '',
                    cardStatus: ''
                },
                searchFormTypeOptions: [
                    {
                        value: '1',
                        label: '设备号'
                    },
                    {
                        value: '2',
                        label: '设备编号'
                    }
                ],

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
                ],
                saleTypeOptions:[
                    {
                        value:'0',
                        label:'购买'
                    },
                    {
                        value:'1',
                        label:'赠送'
                    },
                    {
                        value:'2',
                        label:'租借'
                    }
                ],
                cardStatusOptions:[
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
                versionOptions: [        
                ],
                schoolOptions: [            
                ],
                genderOptions: [
                    {
                        value:'0',
                        label:'男'
                    },
                    {
                        value:'1',
                        label:'女'
                    }                  
                ],
                contentOptions: [
                    {
                        value:'1',
                        label:'基本信息'
                    },
                    {
                        value:'2',
                        label:'应用信息'
                    }
                ],

                addDialogInfo: {
                    id: '',
                    index: '',
                    version: '',
                    price: '',
                    saleChannel: '',
                    saleType: '',
                    batch: '',
                    cardStatus: ''
                },
                addDialogShow: false,
                addDialogLoading: false,
                addRules: {
                    version: [
                        { required: true, message: '*请选择设备版本', trigger: 'change' }
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
                    batch: [
                        { required: true, message: '*请输入批次', trigger: 'blur' }
                    ],
                    cardStatus: [
                        { required: true, message: '*请选择设备状态', trigger: 'change' }
                    ],
                },

                editDialogInfo: {
                    id: '',
                    index: '',
                    code: '',
                    version: '',
                    price: '',
                    saleChannel: '',
                    saleType: '',
                    batch: '',
                    status: '',
                    deviceName: '',
                    schoolCode: '',
                    classCode: '',
                    regionCode: '',
                    position: '',
                    viewUrl: []
                },
                uploadViewUrl: uploadPath + '/ajax/counter/upload/view',
                holderInfoStr: '',
                editDialogShow: false,
                editDialogLoading: false,
                editRules: {
                    version: [
                        { required: true, message: '*请输入设备版本', trigger: 'change' }
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
                    batch: [
                        { required: true, message: '*请输入批次', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '*请选择设备状态', trigger: 'change' }
                    ],
                },

                // 激活新设备
                uploadLoading: false,
                uploadUrl: uploadPath + '/ajax/counter/import/activate',
                fileList: [],
                fileChange: new Array(),

                // 应用信息导入
                applicationDialogShow: false,
                applicationDialogLoading: false,
                applicationDialogInfo: {},
                applicationRules: {},
                uploadApplicationLoading: false,
                uploadApplicationUrl: uploadPath + '/ajax/counter/import/applicationInfo',
                applicationFileList: [],
                applicationFileChange: new Array(),                

                // 导出信息
                exportDialogShow: false,
                exportDialogLoading: false,
                exportInfo: {
                    contentAll: false,
                    content: [],
                    versionAll: false,
                    version: [],
                    saleChannelAll: false,
                    saleChannel: [],
                    saleTypeAll: false,
                    saleType: [],
                    cardStatusAll: false,
                    cardStatus: [],
                    schoolAll: false,
                    school: []
                }
            };
        },
        methods: {
            // 获取渠道列表
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
            // 获取设备版本列表
            getAllSmartCardVersion: function() {
                let param = {
                    'type': 5
                };

                getAllSmartDeviceVersion(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            return false;
                        }

                        for(let i = 0; i < data.list.length; i++) {
                            this.versionOptions.push({
                                'value': ''+ data.list[i].id,
                                'label': data.list[i].version
                            });
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取设备版本列表失败！', type: 'error'});
                });                
            },
            //根据渠道id获取学校列表
            getSchoolListByChannel: function(channelIds) {
                let param = {
                    'channelIds': channelIds || ''
                };

                getSchoolListByChannel(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.schoolOptions = [];

                        if(data.schoolList.length == 0) {
                            return false;
                        }

                        for(let i = 0; i < data.schoolList.length; i++) {
                            this.schoolOptions.push({
                                'value': ''+ data.schoolList[i].id,
                                'label': data.schoolList[i].fullName
                            });
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取学校列表失败！', type: 'error'});
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
                    'code': this.searchForm.type == 1 ? this.searchForm.typeValue : '',
                    'deviceName': this.searchForm.type == 2 ? this.searchForm.typeValue : '',
                    'versionId': this.searchForm.version,
                    'channelId': this.searchForm.saleChannel,
                    'saleType': this.searchForm.saleType,
                    'status': this.searchForm.cardStatus,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                smartCounterList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取设备列表失败！', type: 'error'});
                });
            },
            // 激活新设备
            handleAdd: function() {
                this.addDialogShow = true;

                setTimeout(function() {
                    that.$refs['addRuleForm'].resetFields();
                }, 1);
            },
            // 导入应用信息
            handleApplication: function() {
                this.applicationDialogShow = true;

                setTimeout(function() {
                    that.$refs['applicationRuleForm'].resetFields();
                }, 1);                
            },
            // 编辑设备
            handleEdit: function(index, row) {
                this.editDialogShow = true;

                setTimeout(function() {
                    that.$refs['editRuleForm'].resetFields();

                    that.editDialogInfo.id = row.id;
                    that.editDialogInfo.index = index;
                    that.editDialogInfo.code = row.code;
                    that.editDialogInfo.version = '' + row.versionId;
                    that.editDialogInfo.price = ''+ row.price;
                    that.editDialogInfo.saleChannel = ''+ (row.channelId == 0 ? '' : row.channelId);
                    that.editDialogInfo.saleType = ''+ row.saleType;
                    that.editDialogInfo.batch = row.batch;
                    that.editDialogInfo.status = ''+ row.status;
                    that.editDialogInfo.deviceName = row.deviceName;
                    that.editDialogInfo.schoolCode = row.schoolCode;
                    that.editDialogInfo.classCode = row.classCode;
                    that.editDialogInfo.regionCode = row.regionCode;
                    that.editDialogInfo.position = row.position;

                    if(row.view) {
                        that.editDialogInfo.viewUrl = [
                            {
                                'name': row.view,
                                'url': row.viewUrl,
                                'response': {
                                    'code': 0,
                                    'data': {
                                        'path': row.view,
                                        'url': row.viewUrl
                                    },
                                    'errorInfo': ''
                                }
                            }
                        ];
                    } else {
                        that.editDialogInfo.faceUrl = [];
                    }

                    that.editDialogLoading = false;
                }, 1);
            },
            // 提交编辑内容
            submitEdit: function(formName) {
                if(this.editDialogLoading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.editDialogLoading = true;

                        let params = {
                            'id': this.editDialogInfo.id,
                            'code': this.editDialogInfo.code,
                            'channelId': this.editDialogInfo.saleChannel,
                            'saleType': this.editDialogInfo.saleType,
                            'status': this.editDialogInfo.status,
                            'versionId': this.editDialogInfo.version,
                            'price': this.editDialogInfo.price,
                            'batch': this.editDialogInfo.batch,
                            'deviceName': this.editDialogInfo.deviceName,
                            'schoolCode': this.editDialogInfo.schoolCode,
                            'classCode': this.editDialogInfo.classCode,
                            'regionCode': this.editDialogInfo.regionCode,
                            'position': this.editDialogInfo.position,
                            'view': this.editDialogInfo.viewUrl.length > 0 ? this.editDialogInfo.viewUrl[0].response.data.path : '',
                        };

                        smartCounterSave(params).then(res=>{
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
                    }else{
                        return false;
                    }
                });
            },
            handleViewUploadBefore: function(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            handleViewUploadSuccess: function(response, file, fileList) {
                this.editDialogInfo.viewUrl = fileList;
            },
            handleViewUploadError: function(err, file, fileList) {
                this.editDialogInfo.viewUrl = [];
                this.$message({ message: '图片上传失败，请重试！', type: 'error'});
            },
            handleViewUploadRemove: function(file, fileList) {
                this.editDialogInfo.viewUrl = fileList;
            }, 
            // 日期格式更改
            dateChange: function(val) {
                if(val == ''){
                    this.holderInfoStr = '';
                } else {
                    this.holderInfoStr = val.substring(0, 4) +'***'+ val.substring(7, 8);
                }
            },

            // 激活新设备上传组件
            uploadError(response, file, fileList) {
                this.$message({ message: '导入excel失败！请重试！', type: 'error' });
                this.uploadLoading = false;
                this.fileList = [];
                this.fileChange = [];
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
                    this.getList();
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

            // 应用信息导入组件
            uploadApplicationError(response, file, fileList) {
                this.$message({ message: '导入excel失败！请重试！', type: 'error' });
                this.uploadApplicationLoading = false;
                this.applicationFileList = [];
                this.applicationFileChange = [];
            },
            uploadApplicationSucc(response, file, fileList) {
                setTimeout(function() {

                    if(response.code != 0) {
                        that.$message({ message: response.errorInfo, type: 'error' });
                        that.uploadApplicationLoading = false;
                        that.applicationFileList = [];
                        that.applicationFileChange = [];
                    } else {
                        that.$message({ message: '导入excel成功！', type: 'success' });
                        that.uploadApplicationLoading = false;
                        that.applicationDialogShow = false;
                        that.applicationFileList = [];
                        that.applicationFileChange = [];
                        that.getList();
                    }

                }, 1);
            },
            uploadApplicationChange: function(file, fileList) {
                this.applicationFileChange = fileList;
            },
            submitApplicationUpload: function(formName) {
                if(this.applicationFileChange.length == 0) {
                    this.$message({ message: '请上传excel文件！', type: 'error' });
                    return false;
                }

                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.uploadApplicationLoading = true;
                        this.$refs.uploadApplication.submit();
                    }else{
                        return false;
                    }
                });
            },            

            // 下载激活模板
            handleDownloadActivate: function() {
                location.href = uploadPath + '/ajax/counter/import/template?type=1';
            },   
            // 下载录入模板
            handleDownloadApplication: function() {
                location.href = uploadPath + '/ajax/counter/import/template?type=2';
            },

            // 导出信息
            handleExport: function() {
                this.exportDialogShow = true;
                this.exportDialogLoading = false;
                this.exportInfo =  {
                    contentAll: false,
                    content: [],
                    versionAll: false,
                    version: [],
                    saleChannelAll: false,
                    saleChannel: [],
                    saleTypeAll: false,
                    saleType: [],
                    cardStatusAll: false,
                    cardStatus: [],
                    schoolAll: false,
                    school: []
                };
            },
            // 导出信息 - 导出内容
            handleContentCheckAllChange: function(e) {
                if(e.target.checked) {
                    let content = [];
                    for(let i = 0; i < this.contentOptions.length; i++) {
                        content.push(this.contentOptions[i].value)
                    }
                    this.exportInfo.content = content;
                } else {
                    this.exportInfo.content = [];
                }
            },
            handleContentCheckChange: function(e) {
                this.exportInfo.contentAll = e.length === this.contentOptions.length;
            },
            // 导出信息 - 设备版本
            handleVersionCheckAllChange: function(e) {
                if(e.target.checked) {
                    let version = [];
                    for(let i = 0; i < this.versionOptions.length; i++) {
                        version.push(this.versionOptions[i].value)
                    }
                    this.exportInfo.version = version;
                } else {
                    this.exportInfo.version = [];
                }
            },
            handleVersionCheckChange: function(e) {
                this.exportInfo.versionAll = e.length === this.versionOptions.length;
            },
            // 导出信息 - 选择渠道
            handleSaleChannelCheckAllChange: function(e) {
                if(e.target.checked) {
                    let saleChannel = [];
                    for(let i = 0; i < this.saleChannelOptions.length; i++) {
                        saleChannel.push(this.saleChannelOptions[i].value)
                    }
                    this.exportInfo.saleChannel = saleChannel;
                } else {
                    this.exportInfo.saleChannel = [];
                }

                // 更新学校
                let channelIds = this.exportInfo.saleChannel;
                this.exportInfo.schoolAll = false;
                this.exportInfo.school = [];
                this.getSchoolListByChannel(channelIds.join(','));
            },
            handleSaleChannelCheckChange: function(e) {
                this.exportInfo.saleChannelAll = e.length === this.saleChannelOptions.length;

                // 更新学校
                let channelIds = this.exportInfo.saleChannel;
                this.exportInfo.schoolAll = false;
                this.exportInfo.school = [];
                this.getSchoolListByChannel(channelIds.join(','));

            },
            // 导出信息 - 售出方式
            handleSaleTypeCheckAllChange: function(e) {
                if(e.target.checked) {
                    let saleType = [];
                    for(let i = 0; i < this.saleTypeOptions.length; i++) {
                        saleType.push(this.saleTypeOptions[i].value)
                    }
                    this.exportInfo.saleType = saleType;
                } else {
                    this.exportInfo.saleType = [];
                }
            },
            handleSaleTypeCheckChange: function(e) {
                this.exportInfo.saleTypeAll = e.length === this.saleTypeOptions.length;
            },
            // 导出信息 - 设备状态
            handleCardStatusCheckAllChange: function(e) {
                if(e.target.checked) {
                    let cardStatus = [];
                    for(let i = 0; i < this.cardStatusOptions.length; i++) {
                        cardStatus.push(this.cardStatusOptions[i].value)
                    }
                    this.exportInfo.cardStatus = cardStatus;
                } else {
                    this.exportInfo.cardStatus = [];
                }
            },
            handleCardStatusCheckChange: function(e) {
                this.exportInfo.cardStatusAll = e.length === this.cardStatusOptions.length;
            },
            // 导出信息 - 学校
            handleSchoolCheckAllChange: function(e) {
                if(e.target.checked) {
                    let school = [];
                    for(let i = 0; i < this.schoolOptions.length; i++) {
                        school.push(this.schoolOptions[i].value)
                    }
                    this.exportInfo.school = school;
                } else {
                    this.exportInfo.school = [];
                }
            },
            handleSchoolCheckChange: function(e) {
                this.exportInfo.schoolAll = e.length === this.schoolOptions.length;
            },
            // 导出信息 -- 提交
            handleExportSubmit: function() {
                let exportContent = this.exportInfo.contentAll ? '' : this.exportInfo.content.join(','),
                    versionIds = this.exportInfo.versionAll ? '' : this.exportInfo.version.join(','),
                    channelIds = this.exportInfo.saleChannelAll ? '' : this.exportInfo.saleChannel.join(','),
                    saleType = this.exportInfo.saleTypeAll ? '' : this.exportInfo.saleType.join(','),
                    status = this.exportInfo.cardStatusAll ? '' : this.exportInfo.cardStatus.join(','),
                    schoolIds = this.exportInfo.schoolAll ? '' : this.exportInfo.school.join(',');

                location.href = uploadPath + '/ajax/counter/export?exportContent=' + exportContent + '&versionIds=' + versionIds + '&channelIds=' + channelIds + '&saleType=' + saleType + '&status=' + status + '&schoolIds=' + schoolIds;
            }
        },
        mounted() {
            that = this;
            this.getChannelList();
            this.getAllSmartCardVersion();
            this.getSchoolListByChannel();
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

    .luoym .editDialog-wrapper .formation .el-form .el-form-item{
        .el-form-item__label{
            width: 120px !important;
        }

        .el-form-item__content{
            margin-left: 120px !important;
        }

        .el-textarea{
            width: 180px !important;
        }       
    }

    .export-dialog .checkbox-wrap{
        padding: 10px 0;
        border-top: 1px solid #ddd;

        &:first-child{
            border-top: none;
        }

        .checkbox-item{
            padding: 10px 0;

            .item-label{
                width: 5em;
                font-size: 12px;
                color: #333;
                line-height: 24px;
            }

            .item-list{
                .el-checkbox{
                    margin-right: 15px;

                    & + .el-checkbox{
                        margin-left: 0;
                    }

                    .el-checkbox__input{
                        font-size: 0;
                    }
                    .el-checkbox__label{
                        font-size: 12px;
                        color: #666;
                        line-height: 24px;
                    }
                }

                .el-checkbox-group{
                    margin-top: 10px;
                }
            }
        }
    }    
</style>

<style lang="scss" scoped>
    .button-add{
        margin-right: 15px;
    }
</style>

