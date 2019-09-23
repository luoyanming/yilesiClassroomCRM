<template>
    <div class="main-wrapper light-overscroll luoym">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>智慧卡及手环</el-breadcrumb-item>
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
                <el-form-item label="售出渠道" v-if="role == 2">
                    <el-select v-model="searchForm.saleChannel" placeholder="请选择">
                        <el-option v-for="item in saleChannelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="售出方式" v-if="role == 2">
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
                <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="handleZip">上传人脸识别照片包</el-button>
                <el-button type="primary" size="small" class="btn-add" icon="edit" @click.native="handleExchange" v-if="role == 2">批量更换</el-button>
                <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleExport">导出</el-button>
                <el-button type="primary" size="small" class="btn-add" icon="upload" @click.native="handleApplication">导入应用信息</el-button>
                <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAdd" v-if="role == 2">激活新设备</el-button>
            </div>
        </section>

        <section class="table">
            <!-- <el-table ref="multipleTable" :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading" @selection-change="handleSelectionChange"> -->
            <el-table :data="tableData" stripe tooltip-effect="dark" style="width: 100%" v-loading="tableloading">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column label="设备MAC号">
                    <template scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column label="NFC号">
                    <template scope="scope">{{ scope.row.nfcCode }}</template>
                </el-table-column>
                <el-table-column label="持有人">
                    <template scope="scope">{{ scope.row.holder }}</template>
                </el-table-column>
                <el-table-column label="设备版本">
                    <template scope="scope">{{ scope.row.version }}</template>
                </el-table-column>
                <el-table-column label="售出渠道" v-if="role == 2">
                    <template scope="scope">{{ scope.row.channelName }}</template>
                </el-table-column>
                <el-table-column label="售出方式" v-if="role == 2">
                    <template scope="scope">{{ scope.row.saleTypeStr }}</template>
                </el-table-column>
                <el-table-column label="售出价格" v-if="role == 2">
                    <template scope="scope">{{ scope.row.price }}</template>
                </el-table-column>
                <el-table-column label="学校编号" v-if="role == 0 || role == 1">
                    <template scope="scope">{{ scope.row.schoolCode }}</template>
                </el-table-column>
                <el-table-column label="班级编号" v-if="role == 0 || role == 1">
                    <template scope="scope">{{ scope.row.classCode }}</template>
                </el-table-column>
                <el-table-column label="设备状态">
                    <template scope="scope">{{ scope.row.statusStr }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" class="button-link" @click="handleCardChange(scope.$index, scope.row)" v-if="scope.row.status == 0 || scope.row.status == 1">更换</el-button>
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

        <el-dialog title="激活新卡及手环" :visible.sync="addDialogShow" :modal-append-to-body="false" custom-class="w700">
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

                        <el-button type="primary" size="small" class="btn-add" icon="upload2" @click.native="handleDownloadActivate" style="position: absolute; z-index: 3; top: 0; right: 0;">下载激活模板</el-button>
                    </el-form-item>
                    <el-form-item label="设备版本" prop="version">
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

        <el-dialog title="编辑卡" :visible.sync="editDialogShow" :modal-append-to-body="false" class="editDialog-wrapper">
            <section class="formation">
               
                <el-form label-position="right" :rules="editRules" ref="editRuleForm" label-width="180px" :model="editDialogInfo">
                    <div class="flex-h">
                        <div style="width: 300px">
                            <div style="font-size: 14px; line-height: 2; color: #333; padding: 10px 0 20px 0;">智慧卡基本信息</div>
                            <div class="">
                                <el-form-item label="设备MAC号">
                                    <el-input v-model="editDialogInfo.cardNo" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="NFC号">
                                    <el-input v-model="editDialogInfo.nfcCode" :disabled="role != 2"></el-input>
                                </el-form-item>
                                <el-form-item label="设备版本" prop="version">
                                    <el-select v-model="editDialogInfo.version" placeholder="请选择" :disabled="role != 2">
                                        <el-option v-for="item in versionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select> 
                                </el-form-item>
                                <el-form-item label="售出渠道" prop="saleChannel" v-if="role == 2">
                                    <el-select v-model="editDialogInfo.saleChannel" placeholder="请选择">
                                        <el-option v-for="item in saleChannelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="售出方式" prop="saleType" v-if="role == 2">
                                    <el-select v-model="editDialogInfo.saleType" placeholder="请选择">
                                        <el-option v-for="item in saleTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="售出价格" prop="price" v-if="role == 2">
                                    <el-input v-model="editDialogInfo.price"></el-input>
                                </el-form-item>
                                <el-form-item label="批次" prop="batch" v-if="role == 2">
                                    <el-input v-model="editDialogInfo.batch"></el-input>
                                </el-form-item>
                                <el-form-item label="设备状态" prop="cardStatus">
                                    <el-select v-model="editDialogInfo.cardStatus" placeholder="请选择" :disabled="role != 2">
                                        <el-option v-for="item in cardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>

                        <div class="flex-a-i">
                            <div style="font-size: 14px; line-height: 2; color: #333; padding: 10px 0 20px 0;">智慧卡应用信息</div>
                            <div class="">
                                <el-form-item label="持有人" prop="holder">
                                    <el-input v-model="editDialogInfo.holder"></el-input>
                                </el-form-item>
                                <el-form-item label="持有人信息" prop="holderInfo">
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
                                <el-form-item label="学校编号" v-if="role == 2">
                                    <el-input v-model="editDialogInfo.schoolCode"></el-input>
                                </el-form-item>
                                <el-form-item label="学校编号" v-if="role == 0 || role == 1">
                                    <el-select v-model="editDialogInfo.schoolCode" placeholder="请选择" :disabled="role == 0" @change="handleEditDialogSchoolCodeChange">
                                        <el-option v-for="(item, index) in editDialogSchoolOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select> 
                                </el-form-item>
                                <el-form-item label="OU班级编号" prop="classCode" v-if="role == 2">
                                    <el-input v-model="editDialogInfo.classCode"></el-input>
                                </el-form-item>
                                <el-form-item label="OU班级编号" prop="classCode" v-if="role == 0 || role == 1">
                                    <el-select v-model="editDialogInfo.classCode" placeholder="请选择">
                                        <el-option v-for="(item, index) in editDialogClassOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select> 
                                </el-form-item>
                                <el-form-item label="学籍号">
                                    <el-input v-model="editDialogInfo.schoolRollNo"></el-input>
                                </el-form-item>
                                <el-form-item label="学号">
                                    <el-input v-model="editDialogInfo.schoolNo"></el-input>
                                </el-form-item>
                                <el-form-item label="性别">
                                    <el-select v-model="editDialogInfo.gender" placeholder="请选择">
                                        <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select> 
                                </el-form-item>
                                <el-form-item label="身份证">
                                    <el-input v-model="editDialogInfo.idCard"></el-input>
                                </el-form-item>
                                <el-form-item label="人脸识别照片">
                                    <el-upload
                                        class="upload-demo"
                                        :action="uploadFaceUrl"
                                        :data="{ 'macNo': editDialogInfo.cardNo }"
                                        :before-upload="handleFaceUploadBefore"
                                        :on-remove="handleFaceUploadRemove"
                                        :on-success="handleFaceUploadSuccess"
                                        :on-error="handleFaceUploadError"
                                        :file-list="editDialogInfo.faceUrl"
                                        list-type="picture">
                                        <el-button size="small" type="primary" :disabled="editDialogInfo.faceUrl.length != 0">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip" style="display: inline-block; width: 200px; vertical-align: middle; line-height: 1.2;">上传尺寸不得小于300像素 X 300像素，支持jpg、jpeg、png</div>
                                    </el-upload>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="editDialogInfo.resetLoading" style="float: left;" @click.native="handleCardReset" v-if="role == 2">还原</el-button>
                <el-button type="primary" :loading="editDialogLoading" @click.native="submitEdit('editRuleForm')">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="导入卡及手环应用信息" :visible.sync="applicationDialogShow" :modal-append-to-body="false" custom-class="w700">
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

                        <el-button type="primary" size="small" class="btn-add button-add" icon="upload2" @click.native="handleDownloadApplication" style="position: absolute; z-index: 3; top: 0; right: 0;">下载录入模板</el-button>
                    </el-form-item>
                </el-form>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="applicationDialogLoading" @click.native="submitApplicationUpload('applicationRuleForm')">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="智慧设备批量更换（信息转移）" :visible.sync="exchangeDialogShow" :modal-append-to-body="false" custom-class="w700">
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

                        <el-button type="primary" size="small" class="btn-add button-add" icon="upload2" @click.native="handleDownloadExchange" style="position: absolute; z-index: 3; top: 0; right: 0;">下载批量更换模板</el-button>
                    </el-form-item>
                </el-form>

                <div class="tips" style="color: #888; font-size: 12px;">
                    注意：智慧设备更换后原设备的所有信息，包括持有人应用信息（持有人姓名、生日、所在班级等）、课程记录、答题记录都将转移至新设备上。
                </div>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="exchangeDialogLoading" @click.native="submitExchangeUpload('exchangeRuleForm')">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="智慧设备更换（信息转移）" :visible.sync="transferDialogShow" :modal-append-to-body="false" class="transfer-dialog">
            <section class="formation">

                <el-form label-position="right" :rules="transferRules" ref="transferRuleForm" label-width="180px" :model="transferDialogInfo">
                    <div class="flex-h">
                        <div class="flex-a-i">
                            <el-form-item label="原设备MAC号">
                                <el-input v-model="transferDialogInfo.cardNo" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="原设备NFC号" v-if="role == 2">
                                <el-input v-model="transferDialogInfo.nfcCode" disabled></el-input>
                            </el-form-item>                             
                        </div>
                        <div class="seprate" :style="role != 2 ? 'line-height: 40px;' : ''">换成</div>
                        <div class="flex-a-i">
                            <el-form-item label="新设备MAC号">
                                <el-input v-model="transferDialogInfo.newCardNo"></el-input>
                            </el-form-item>
                            <el-form-item label="新设备NFC号" v-if="role == 2">
                                <el-input v-model="transferDialogInfo.newNfcCode"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>

                <div class="tips" style="color: #888;">
                    注意：智慧设备更换后原设备的所有信息，包括持有人应用信息（持有人姓名、生日、所在班级等）、课程记录、答题记录都将转移至新设备上。
                </div>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="transferDialogLoading" @click.native="submitTransfer('transferRuleForm')">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="导出信息" :visible.sync="exportDialogShow" :modal-append-to-body="false" class="export-dialog" custom-class="w700">
            <section class="formation">

                <div class="checkbox-wrap" v-if="role == 2">
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
                    <div class="checkbox-item flex-h" v-if="role == 2">
                        <div class="item-label">选择渠道</div>
                        <div class="item-list flex-a-i">
                            <el-checkbox v-model="exportInfo.saleChannelAll" @change="handleSaleChannelCheckAllChange">全部</el-checkbox>
                            <el-checkbox-group v-model="exportInfo.saleChannel" @change="handleSaleChannelCheckChange">
                                <el-checkbox v-for="item in saleChannelOptions" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="checkbox-item flex-h" v-if="role == 2">
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

                <div class="checkbox-wrap" v-if="(role == 1 || role == 2) && schoolOptions.length > 0">
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

        <el-dialog title="上传人脸识别照片包" :visible.sync="zipDialogShow" :modal-append-to-body="false" custom-class="w700">
            <section class="formation">
               
                <el-form label-position="right" :rules="zipRules" ref="zipRuleForm" label-width="180px" :model="zipDialogInfo" style="padding: 40px 0;">
                    <el-form-item label="上传ZIP包" prop="zip">
                        <el-upload
                            class="upload-demo"
                            ref="uploadZip"
                            :on-change="uploadZipChange"
                            :action="uploadZipUrl"
                            :on-success="uploadZipSucc"
                            :on-error="uploadZipError"
                            :file-list="zipFileList"
                            :auto-upload="false"
                            style="float: left;">
                            <el-button slot="trigger" size="small" type="primary" :disabled="zipFileChange.length > 0">上传ZIP包</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>

                <div class="tips" style="color: #888; font-size: 12px;">
                    注意：上传的人脸识别照片包必须是后缀为.zip格式的压缩包，不能是.rar格式的压缩包。
                </div>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="exchangeDialogLoading" @click.native="submitZipUpload('zipRuleForm')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, channelList, getAllSmartDeviceVersion, smartCardList, smartCardReset, smartCardSave, transferCard, smartCardExport, smartCardImport, getSchoolListByChannel, getClassListBySchool, getRegionListBySchool } from '../api/api';
    import { COMMON } from '../common/js/common';

    let that;

    export default {
        data() {
            return {
                role: localStorage.getItem('role'),

                searchForm: {
                    type: '1',
                    typeValue: this.$route.query.code || '',
                    saleChannel: '',
                    saleType: '',
                    cardStatus: ''
                },
                searchFormTypeOptions: [
                    {
                        value: '1',
                        label: '卡号'
                    },
                    {
                        value: '2',
                        label: '持卡人'
                    },
                    {
                        value: '3',
                        label: '学籍号'
                    },
                    {
                        value: '4',
                        label: 'NFC号'
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
                        value:'',
                        label:'请选择'
                    },
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
                    // batch: [
                    //     { required: true, message: '*请输入批次', trigger: 'blur' }
                    // ],
                    cardStatus: [
                        { required: true, message: '*请选择设备状态', trigger: 'change' }
                    ],
                },

                editDialogInfo: {
                    id: '',
                    index: '',
                    cardNo: '',
                    nfcCode: '',
                    schoolRollNo: '',
                    schoolCode: '',
                    classCode: '',
                    version: '',
                    holder: '',
                    holderInfo: '',
                    price: '',
                    saleChannel: '',
                    saleType: '',
                    cardStatus: '',
                    batch: '',
                    schoolNo: '',
                    gender: '',
                    idCard: '',
                    faceUrl: [],

                    resetLoading: false
                },
                uploadFaceUrl: uploadPath + '/ajax/uploadFace',
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
                    cardStatus: [
                        { required: true, message: '*请选择设备状态', trigger: 'change' }
                    ],
                },
                editDialogSchoolOptions: [],
                editDialogClassOptions: [],

                // 激活新设备
                uploadLoading: false,
                uploadUrl: uploadPath + '/ajax/smartCard/excel/import/activate',
                fileList: [],
                fileChange: new Array(),

                // 批量更换
                exchangeDialogShow: false,
                exchangeDialogLoading: false,
                exchangeDialogInfo: {},
                exchangeRules: {},
                uploadExchangeLoading: false,
                uploadExchangeUrl: uploadPath + '/ajax/smartCard/batch/change',
                exchangeFileList: [],
                exchangeFileChange: new Array(),

                // 上传人脸识别zip包
                zipDialogShow: false,
                zipDialogLoading: false,
                zipDialogInfo: {},
                zipRules: {},
                uploadZipLoading: false,
                uploadZipUrl: uploadPath + '/ajax/uploadFaceZip',
                zipFileList: [],
                zipFileChange: new Array(),

                // 应用信息导入
                applicationDialogShow: false,
                applicationDialogLoading: false,
                applicationDialogInfo: {},
                applicationRules: {},
                uploadApplicationLoading: false,
                uploadApplicationUrl: uploadPath + '/ajax/smartCard/excel/import/applicationInfo',
                applicationFileList: [],
                applicationFileChange: new Array(),                

                // 单卡更换
                transferDialogShow: false,
                transferDialogLoading: false,
                transferDialogInfo: {
                    cardNo: '',
                    nfcCode: '',
                    newCardNo: '',
                    newNfcCode: ''
                },
                transferRules: {},

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
                    'type': 1
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

                        this.editDialogSchoolOptions.push({
                            'id': '',
                            'value': '',
                            'label': '请选择'
                        });

                        if(data.schoolList.length == 0) {
                            return false;
                        }

                        for(let i = 0; i < data.schoolList.length; i++) {
                            this.schoolOptions.push({
                                'value': ''+ data.schoolList[i].id,
                                'label': data.schoolList[i].fullName
                            });

                            this.editDialogSchoolOptions.push({
                                'id': data.schoolList[i].id,
                                'value': data.schoolList[i].code,
                                'label': data.schoolList[i].code + ' (' + data.schoolList[i].fullName + ')'
                            });
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取学校列表失败！', type: 'error'});
                });
            },
            // 监听学校编号变化，获取对应班级编号列表
            handleEditDialogSchoolCodeChange: function(val) {
                let schoolId = '';

                if(!this.editDialogInfo.schoolCode || this.editDialogSchoolOptions.length == 0) {
                    this.editDialogInfo.classCode = '';
                    this.editDialogClassOptions = [{
                        'id': '',
                        'value': '',
                        'label': '请选择'
                    }];
                    return false;
                }

                for(let i = 0; i < this.editDialogSchoolOptions.length; i++) {
                    if(this.editDialogSchoolOptions[i].value == this.editDialogInfo.schoolCode) {
                        schoolId = this.editDialogSchoolOptions[i].id;
                    }
                }

                if(this.editDialogClassOptions.length > 0) {
                    this.editDialogInfo.classCode = '';
                }

                let param = {
                    'schoolId': schoolId
                };

                getClassListBySchool(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.editDialogClassOptions = [{
                            'id': '',
                            'value': '',
                            'label': '请选择'
                        }];

                        if(data.list.length == 0) {
                            return false;
                        }

                        for(let i = 0; i < data.list.length; i++) {
                            this.editDialogClassOptions.push({
                                'id': data.list[i].id,
                                'value': data.list[i].code,
                                'label': data.list[i].code + ' (' + data.list[i].name + ')'
                            });
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取班级列表失败！', type: 'error'});
                });
            },
            // 搜索
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
                    'code': this.searchForm.type == 1 ? this.searchForm.typeValue : '',
                    'name': this.searchForm.type == 2 ? this.searchForm.typeValue : '',
                    'schoolRollNo': this.searchForm.type == 3 ? this.searchForm.typeValue : '',
                    'nfcCode': this.searchForm.type == 4 ? this.searchForm.typeValue : '',
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
                    this.$message({ message: '网络异常！获取设备列表失败！', type: 'error'});
                });
            },
            // 批量更换
            handleExchange: function() {
                this.exchangeDialogShow = true;

                setTimeout(function() {
                    that.$refs['exchangeRuleForm'].resetFields();
                }, 1);                
            },
            // zip包
            handleZip: function() {
                this.zipDialogShow = true;

                setTimeout(function() {
                    that.$refs['zipRuleForm'].resetFields();
                }, 1);                
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
            // 单卡转移
            handleCardChange: function(index, row) {
                this.transferDialogShow = true;

                setTimeout(function() {
                    that.$refs['transferRuleForm'].resetFields();

                    that.transferDialogInfo.cardNo = row.code;
                    that.transferDialogInfo.nfcCode = row.nfcCode;
                    that.transferDialogInfo.newCardNo = '';
                    that.transferDialogInfo.newNfcCode = '';
                    that.transferDialogLoading = false;
                }, 1);             
            },
            // 单卡转移 提交
            submitTransfer: function(formName) {
                if(this.transferDialogLoading) {
                    return false;
                }

                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        if(!this.transferDialogInfo.newCardNo) {
                            this.$message({ message: '请输入新设备MAC号', type: 'error'});
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
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.transferDialogLoading = false;

                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存成功！', type: 'success' });
                                this.transferDialogShow = false;
                                this.getCardList();
                            }
                        }).catch(error => {
                            this.transferDialogLoading = false;
                            this.$message({ message: '网络异常！保存失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });                
            },
            // 单卡还原 
            handleCardReset: function() {
                this.editDialogInfo.resetLoading = true;

                let params = {
                    id: this.editDialogInfo.id
                }

                smartCardReset(params).then(res=>{
                    this.editDialogInfo.resetLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '还原成功！', type: 'success' });
                        this.editDialogShow = false;
                        this.getCardList();
                    }
                }).catch(error => {
                    this.editDialogInfo.resetLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });
            },
            // 编辑设备
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
                    that.editDialogInfo.version = '' + row.versionId;
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
                    that.editDialogInfo.batch = row.batch;
                    that.editDialogInfo.schoolNo = row.schoolNo;
                    that.editDialogInfo.gender = ''+ row.gender;
                    that.editDialogInfo.idCard = row.idCard;
                    that.editDialogLoading = false;

                    if(row.faceUrl) {
                        that.editDialogInfo.faceUrl = [
                            {
                                'name': row.faceUrl,
                                'url': row.faceUrlShow,
                                'response': {
                                    'code': 0,
                                    'data': {
                                        'faceUrl': row.faceUrl,
                                        'linkUrl': row.faceUrlShow
                                    },
                                    'errorInfo': ''
                                }
                            }
                        ];
                    } else {
                        that.editDialogInfo.faceUrl = [];
                    }

                    that.editDialogInforesetLoading = false;

                    that.editDialogClassOptions = [];
                    that.handleEditDialogSchoolCodeChange();
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
                            'code': this.editDialogInfo.cardNo,
                            'nfcCode': this.editDialogInfo.nfcCode,
                            'schoolRollNo': this.editDialogInfo.schoolRollNo,
                            'schoolCode': this.editDialogInfo.schoolCode,
                            'channelId': this.editDialogInfo.saleChannel,
                            'saleType': this.editDialogInfo.saleType,
                            'status': this.editDialogInfo.cardStatus,
                            'versionId': this.editDialogInfo.version,
                            'holder': this.editDialogInfo.holder,
                            'classCode': this.editDialogInfo.classCode,
                            'holderInfo': this.editDialogInfo.holderInfo == '' ? '' : COMMON.formatDate(this.editDialogInfo.holderInfo, ''),
                            'price': this.editDialogInfo.price,
                            'batch': this.editDialogInfo.batch,
                            'schoolNo': this.editDialogInfo.schoolNo,
                            'gender': this.editDialogInfo.gender,
                            'idCard': this.editDialogInfo.idCard,
                            'faceUrl': this.editDialogInfo.faceUrl.length > 0 ? this.editDialogInfo.faceUrl[0].response.data.faceUrl : ''
                        };

                        smartCardSave(params).then(res=>{
                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.editDialogLoading = false;

                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存成功！', type: 'success' });
                                this.editDialogShow = false;
                                this.getCardList();
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
            handleFaceUploadBefore: function(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            handleFaceUploadSuccess: function(response, file, fileList) {
                if(response.code != 0) {
                    this.editDialogInfo.faceUrl = [];
                    this.$message({ message: response.errorInfo, type: 'error'});
                } else {
                    this.editDialogInfo.faceUrl = fileList;
                }
            },
            handleFaceUploadError: function(err, file, fileList) {
                this.editDialogInfo.faceUrl = [];
                this.$message({ message: '图片上传失败，请重试！', type: 'error'});
            },
            handleFaceUploadRemove: function(file, fileList) {
                this.editDialogInfo.faceUrl = fileList;
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
                this.exchangeFileChange = [];
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

            // 人脸识别zip包
            uploadZipError(response, file, fileList) {
                this.$message({ message: '导入zip包失败！请重试！', type: 'error' });
                this.uploadZipLoading = false;
                this.zipFileList = [];
                this.zipFileChange = [];
            },
            uploadZipSucc(response, file, fileList) {
                setTimeout(function() {

                    if(response.code != 0) {
                        that.$message({ message: response.errorInfo, type: 'error' });
                        that.uploadZipLoading = false;
                        that.zipFileList = [];
                        that.zipFileChange = [];
                    } else {
                        that.$message({ message: '导入zip包成功！', type: 'success' });
                        that.uploadZipLoading = false;
                        that.zipDialogShow = false;
                        that.zipFileList = [];
                        that.zipFileChange = [];
                    }

                }, 1);
            },
            uploadZipChange: function(file, fileList) {
                this.zipFileChange = fileList;
            },
            submitZipUpload: function(formName) {
                if(this.zipFileChange.length == 0) {
                    this.$message({ message: '请上传zip包！', type: 'error' });
                    return false;
                }

                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.uploadZipLoading = true;
                        this.$refs.uploadZip.submit();
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
                        that.getCardList();
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
                location.href = uploadPath + '/ajax/smartCard/excel/import/template?template=activate';
            },   
            // 下载录入模板
            handleDownloadApplication: function() {
                location.href = uploadPath + '/ajax/smartCard/excel/import/template?template=applicate';
            },   
            // 下载批量更换模板
            handleDownloadExchange: function() {
                location.href = uploadPath + '/template/download?fileName=card-update.xlsx';
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

                location.href = uploadPath + '/ajax/smartCard/export?exportContent=' + exportContent + '&versionIds=' + versionIds + '&channelIds=' + channelIds + '&saleType=' + saleType + '&status=' + status + '&schoolIds=' + schoolIds;

                // this.exportDialogShow = false;
            }
        },
        mounted() {
            that = this;
            this.getChannelList();
            this.getAllSmartCardVersion();
            this.getSchoolListByChannel();
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

    .luoym .editDialog-wrapper{
        .formation .el-form .el-form-item{
            .el-form-item__label{
                width: 120px !important;
            }

            .el-form-item__content{
                margin-left: 120px !important;

                .upload-demo .el-upload-list__item{
                    width: 320px !important;
                }
            }        
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

