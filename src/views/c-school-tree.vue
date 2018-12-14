<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>校组织结构树</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <div class="pull-left">
            <div class="search-box">
                <el-select v-model="schoolId" placeholder="请选择学校" @change="handleSchoolChange">
                    <el-option v-for="item in schoolOptions" :key="item.id" :label="item.fullName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="light-overscroll">
                <el-tree
                  empty-text="暂无数据"
                  :data="treeOptions"
                  :props="defaultProps"
                  auto-expand-parent
                  :default-expanded-keys="currentKeys"
                  :current-node-key="currentKey"
                  node-key="key"
                  ref="tree"
                  accordion
                  highlight-current
                  @node-click="handleNodeClick">
                </el-tree>
            </div>
        </div>
        <div class="pull-right" v-if="showTable">
            <section class="table-left">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>班级教师</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <div class="overflow">
                    <section class="search clearfix">
                        <el-input v-model="classTeacherSearchForm.searchParam" size="small" placeholder="搜索用户名/手机号/学校账号" :icon="classTeacherTableloading ? 'loading' : 'search'" @click="keyDownClassTeacher"></el-input>
                    
                        <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleClassTeacherAdd">添加教师</el-button>
                    </section>

                    <div class="light-overscroll" style="height: calc(100% - 72px);">
                        <section class="table">
                            <el-table :data="classTeacherTableData" stripe style="width: 100%" v-loading="classTeacherTableloading">
                                <el-table-column>
                                    <template scope="scope"><p>{{ scope.row.name }}<span class="icon-headTeacher" v-if="scope.row.headTeacher == 1">班</span></p></template>
                                </el-table-column>
                                <el-table-column>
                                    <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                                </el-table-column>
                                <el-table-column>
                                    <template scope="scope">
                                        <el-button size="small" class="button-link" @click="handleClassTeacherEdit(scope.$index, scope.row)">编辑</el-button>
                                        <el-button size="small" class="button-link" @click="handleClassTeacherDelete(scope.$index, scope.row)" style="margin-right: 0;">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </section>

                        <el-dialog title="添加教师" :visible.sync="classTeacherDialogShow" :modal-append-to-body="false" custom-class="w80">
                            <div class="dialog-table clearfix">
                                <div class="dialog-left">
                                    <section class="table-search">
                                        <el-input v-model="classTeacherDialog.searchParam" @click="classTeacherDialogSearch" size="small" placeholder="搜索用户名/手机号/学校账号" :icon="classTeacherDialog.tableLoading ? 'loading' : 'search'"></el-input>
                                    </section>
                                    <section class="table">
                                        <el-table ref="multipleTable" :data="classTeacherDialog.tableData" stripe style="width: 100%" @selection-change="classTeacherDialogSelect" :loading="classTeacherDialog.tableLoading">
                                            <el-table-column type="selection" width="75"></el-table-column>
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.name }}</template>
                                            </el-table-column>
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.mobile }}</template>
                                            </el-table-column>
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.schoolAccount }}</template>
                                            </el-table-column>
                                        </el-table>

                                        <el-pagination
                                            @current-change="handleClassTeacherDialogPageChange"
                                            :current-page.sync="classTeacherDialog.pagi.currentPage"
                                            :page-size="classTeacherDialog.pagi.pageSize"
                                            layout="total, prev, pager, next, jumper"
                                            :total="classTeacherDialog.pagi.total"
                                            v-if="!classTeacherDialog.noPagi">
                                        </el-pagination>
                                    </section>
                                </div>

                                <div class="dialog-right">
                                    <section class="table-title">已选择教师</section>
                                    <section class="table">
                                        <el-table :data="classTeacherDialog.selectedData" stripe style="width: 100%">
                                            <el-table-column>
                                                <template scope="scope"><p>{{ scope.row.name }}</p></template>
                                            </el-table-column>
                                            <el-table-column>
                                                <template scope="scope"><p>{{ scope.row.mobile }}</p></template>
                                            </el-table-column>
                                            <el-table-column>
                                                <template scope="scope">
                                                    <el-switch v-model="scope.row.headTeacher" on-color="#13ce66" on-value="1" off-value="0" on-text="是" off-text="否" style="vertical-align: top;"></el-switch>
                                                    <span style="line-height: 22px;">班主任</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column width="100">
                                                <template scope="scope">
                                                    <el-button size="small" class="button-link" @click="handleClassTeacherDialogSelectedDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </section>
                                </div>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" :loading="classTeacherDialog.submitLoading" @click.native="classTeacherDialogSubmit">保存</el-button>
                            </span>
                        </el-dialog>

                        <el-dialog title="编辑班级中的教师" :visible.sync="editTeacherDialogShow" :modal-append-to-body="false" class="auto-height">
                            <section class="formation">
                               
                                <el-form label-position="right" label-width="180px" :model="editTeacherInfo">
                                    <el-form-item label="教师姓名">
                                        <el-input v-model="editTeacherInfo.name" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机账号">
                                        <el-input v-model="editTeacherInfo.mobile" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="学校账号">
                                        <el-input v-model="editTeacherInfo.schoolAccount" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="该班级班主任">
                                        <el-switch v-model="editTeacherInfo.headTeacher" on-color="#13ce66" on-value="1" off-value="0" on-text="是" off-text="否" style="margin-top: 9px;"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="标签">
                                        <div class="tag-list">
                                            <el-button type="primary" size="small" icon="delete" class="tag-item" v-for="(tagItem, tagIndex) in editTeacherInfo.tagList" @click.native="handleTagDetele(tagIndex, tagItem)">{{ tagItem.name }}</el-button>
                                            <el-button type="primary" size="small" icon="plus" class="tag-add" @click.native="handleTagsDialogShow">添加</el-button>
                                        </div>
                                    </el-form-item> 
                                </el-form>

                            </section>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" :loading="editTeacherDialogLoading" @click.native="editTeacherSubmitForm">保存</el-button>
                            </span>
                        </el-dialog>

                        <el-dialog title="添加标签" :visible.sync="tagsDialogInfo.show" :modal-append-to-body="false" class="auto-height">
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
                </div>
            </section>

            <section class="table-right">
                <section class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>班级学生</el-breadcrumb-item>
                    </el-breadcrumb>
                </section>

                <div class="overflow">
                    <section class="search clearfix">
                        <el-input v-model="classStudentSearchForm.searchParam" size="small" placeholder="搜索姓名/mac号/nfc号" :icon="classStudentTableloading ? 'loading' : 'search'" @click="keyDownClassStudent"></el-input>
                    
                        <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleClassStudentAdd">添加学生</el-button>
                    </section>

                    <div class="light-overscroll" style="height: calc(100% - 72px);">
                        <section class="table">
                            <el-table :data="classStudentTableData" stripe style="width: 100%" v-loading="classStudentTableloading">
                                <el-table-column>
                                    <template scope="scope"><p>{{ scope.row.name }}</p></template>
                                </el-table-column>
                                <el-table-column>
                                    <template scope="scope"><p>{{ scope.row.nfcCode }}</p></template>
                                </el-table-column>
                                <el-table-column>
                                    <template scope="scope"><p>{{ scope.row.code }}</p></template>
                                </el-table-column>
                                <el-table-column width="110">
                                    <template scope="scope">
                                        <el-button size="small" class="button-link" @click="handleClassStudentShift(scope.$index, scope.row)">转移</el-button>
                                        <span class="button-separate">|</span>
                                        <el-button size="small" class="button-link" @click="handleClassStudentDelete(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </section> 

                        <el-dialog title="添加学生" :visible.sync="classStudentDialogShow" :modal-append-to-body="false" custom-class="w80">
                            <div class="dialog-table clearfix">
                                <div class="dialog-left">
                                    <section class="table-search">
                                        <el-input v-model="classStudentDialog.searchParam" @click="classStudentDialogSearch" size="small" placeholder="搜索姓名/mac号/nfc号" :icon="classStudentDialog.tableLoading ? 'loading' : 'search'"></el-input>
                                    </section>
                                    <section class="table">
                                        <el-table ref="multipleTable" :data="classStudentDialog.tableData" stripe style="width: 100%" @selection-change="classStudentDialogSelect" :loading="classStudentDialog.tableLoading">
                                            <el-table-column type="selection" width="75"></el-table-column>
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.holder }}</template>
                                            </el-table-column>
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.nfcCode }}</template>
                                            </el-table-column>
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.code }}</template>
                                            </el-table-column>
                                        </el-table>

                                        <el-pagination
                                            @current-change="handleClassStudentDialogPageChange"
                                            :current-page.sync="classStudentDialog.pagi.currentPage"
                                            :page-size="classStudentDialog.pagi.pageSize"
                                            layout="total, prev, pager, next, jumper"
                                            :total="classStudentDialog.pagi.total"
                                            v-if="!classStudentDialog.noPagi">
                                        </el-pagination>
                                    </section>
                                </div>

                                <div class="dialog-right">
                                    <section class="table-title">已选择学生</section>
                                    <section class="table">
                                        <el-table :data="classStudentDialog.selectedData" stripe style="width: 100%">
                                            <el-table-column label="">
                                                <template scope="scope">{{ scope.row.holder }}</template>
                                            </el-table-column>
                                            <el-table-column>
                                                <template scope="scope"><p>{{ scope.row.nfcCode }}</p></template>
                                            </el-table-column>
                                            <el-table-column>
                                                <template scope="scope"><p>{{ scope.row.code }}</p></template>
                                            </el-table-column>
                                            <el-table-column width="100">
                                                <template scope="scope">
                                                    <el-button size="small" class="button-link" @click="handleClassStudentDialogSelectedDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </section>
                                </div>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" :loading="classStudentDialog.submitLoading" @click.native="classStudentDialogSubmit">保存</el-button>
                            </span>
                        </el-dialog>

                        <el-dialog title="学生转移" :visible.sync="classStudentShiftDialogShow" :modal-append-to-body="false" custom-class="w80">
                            <div class="dialog-table clearfix">
                                <div class="dialog-left" style="width: calc(100% - 302px);">
                                    <section class="table-search">
                                        <el-input v-model="classStudentShiftDialog.searchParam" @click="classStudentShiftDialogSearch" size="small" placeholder="搜索姓名/mac号/nfc号" :icon="classStudentShiftDialog.tableLoading ? 'loading' : 'search'"></el-input>
                                    </section>
                                    <div class="overflow">
                                        <section class="table">
                                            <el-table ref="multipleTableShift" :data="classStudentShiftDialog.tableData" stripe style="width: 100%" @selection-change="classStudentShiftDialogSelect" :loading="classStudentShiftDialog.tableLoading">
                                                <el-table-column type="selection" width="75"></el-table-column>
                                                <el-table-column label="">
                                                    <template scope="scope">{{ scope.row.name }}</template>
                                                </el-table-column>
                                                <el-table-column label="">
                                                    <template scope="scope">{{ scope.row.nfcCode }}</template>
                                                </el-table-column>
                                                <el-table-column label="">
                                                    <template scope="scope">{{ scope.row.code }}</template>
                                                </el-table-column>
                                            </el-table>
                                        </section>
                                    </div>
                                </div>

                                <div class="dialog-middle">
                                    <p class="shift">
                                        <span class="icon">>></span>
                                        <span class="text">转移至</span>
                                    </p>
                                </div>

                                <div class="dialog-right" style="width: 202px; height: calc(100% - 36px); border-left: 1px solid #eee;">
                                    <div class="search-box">
                                        <el-select v-model="classStudentShiftDialog.schoolId" placeholder="请选择学校" @change="handleClassStudentShiftSchoolChange">
                                            <el-option v-for="item in classStudentShiftDialog.schoolOptions" :key="item.id" :label="item.fullName" :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="light-overscroll">
                                        <el-tree
                                          empty-text="暂无数据"
                                          :data="classStudentShiftDialog.treeOptions"
                                          :props="defaultProps"
                                          accordion
                                          highlight-current
                                          @node-click="handleClassStudentShiftNodeClick">
                                        </el-tree>
                                    </div>
                                </div>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" :loading="classStudentShiftDialog.submitLoading" @click.native="classStudentShiftDialogSubmit">保存</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { uploadPath, schoolList, schoolClassTeacherList, schoolClassStudentList, memberList, smartCardList, schoolTeacherAdd, schoolTeacherDelete, schoolTeacherEdit, schoolStudentAdd, schoolStudentShift, schoolStudentDelete, schoolStaffList, tagsClassifyList, tagsList } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showTable: false,

                // 左侧学校列表
                schoolId: '',
                schoolPeriodId: '',
                schoolGradeId: '',
                schoolClassId: '',

                schoolOptions: [],
                treeOptions: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                currentKeys: [],
                currentKey: '',

                // 班级教师
                classTeacherSearchForm: {
                    searchParam: ''
                },
                classTeacherTableData: [],
                classTeacherTableloading: true,
                // 班级教师新增
                classTeacherDialog: {
                    searchParam: '',
                    notContainIds: [],
                    tableData: [],
                    tableLoading: true,
                    noPagi: true,
                    pagi: {
                        currentPage: 1,
                        pageSize: 10,
                        pageTotal: '',
                        total: ''
                    },
                    selectedData: [],
                    submitLoading: false
                },
                classTeacherDialogShow: false,
                // 班级教师编辑
                editTeacherDialogShow: false,
                editTeacherDialogLoading: false,
                editTeacherInfo: {
                    id: '',
                    memberId: '',
                    index: '',
                    name: '',
                    mobile: '',
                    schoolAccount: '',
                    headTeacher: '',
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
                },            

                // 班级学生
                classStudentSearchForm: {
                    searchParam: ''
                },
                classStudentTableData: [],
                classStudentTableloading: true,
                // 班级学生新增
                classStudentDialog: {
                    searchParam: '',
                    notContainIds: [],
                    tableData: [],
                    tableLoading: true,
                    noPagi: true,
                    pagi: {
                        currentPage: 1,
                        pageSize: 10,
                        pageTotal: '',
                        total: ''
                    },
                    selectedData: [],
                    submitLoading: false
                },
                classStudentDialogShow: false,

                // 学生转移
                classStudentShiftDialogShow: false,
                classStudentShiftDialog: {
                    searchParam: '',
                    tableData: [],
                    tableLoading: false,
                    selectedData: [],
                    submitLoading: false,
                    schoolOptions: [],
                    treeOptions: [],
                    schoolId: '',
                    schoolPeriodId: '',
                    schoolGradeId: '',
                    schoolClassId: '',
                }
            };
        },
        methods: {
            // 获取学校列表
            getSchoolList: function() {
                let param = {
                    'name': '',
                    'pageNo': 1,
                    'pageSize': 5000
                };

                schoolList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list && data.list.length > 0) {
                            this.schoolOptions = data.list;

                            if(this.$route.query.school) {
                                that.schoolId = parseInt(this.$route.query.school);
                            }
                        }
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！获取学校列表失败！', type: 'error'});
                });
            },
            // 选择学校触发的事件
            handleSchoolChange: function(val) {
                for(let i = 0; i < this.schoolOptions.length; i++) {
                    let item = this.schoolOptions[i];

                    if(val == item.id) {
                        this.setTreeOptions(item);
                        break;
                    }
                }
            },
            // 生成树结构数据
            setTreeOptions: function(school) {
                this.treeOptions = [];
                let periodVoList = school.periodVoList;
                for(let i = 0; i < periodVoList.length; i++) {
                    let periodItem = periodVoList[i],
                        gradeVoList = periodItem.schoolSystemGradeVoList,
                        gradeArr = [];

                    for(let j = 0; j < gradeVoList.length; j++) {
                        let gradeItem = gradeVoList[j],
                            classVoList = gradeItem.schoolClassList,
                            classArr = [];

                        for(let k = 0; k < classVoList.length; k++) {
                            let classItem = classVoList[k];

                            classArr.push({
                                'id': classItem.id,
                                'label': classItem.name,
                                'periodId': classItem.period,
                                'key': periodItem.periodValue + '-' + gradeItem.id + '-' + classItem.id,
                                'gradeId': classItem.schoolSystemGradeId
                            });
                        }

                        gradeArr.push({
                            'id': gradeItem.id,
                            'label': gradeItem.name,
                            'periodId': gradeItem.period,
                            'key': periodItem.periodValue + '-' + gradeItem.id,
                            'children': classArr
                        });
                    }

                    this.treeOptions.push({
                        'id': periodItem.periodValue,
                        'label': periodItem.periodName,
                        'key': '' + periodItem.periodValue,
                        'children': gradeArr
                    });
                }

                this.handleSetChecked();
            },
            // 设置选中的节点
            handleSetChecked: function() {
                if(this.$route.query.period && this.$route.query.grade && this.$route.query.class) {
                    let keyStr = this.$route.query.period +'-'+ this.$route.query.grade +'-'+ this.$route.query.class;
                    this.currentKeys.push(keyStr);
                    this.currentKey = keyStr;

                    this.schoolPeriodId = this.$route.query.period;
                    this.schoolGradeId = this.$route.query.grade;
                    this.schoolClassId = this.$route.query.class;

                    this.showTable = true;
                    this.classTeacherSearchForm.searchParam = '';
                    this.classStudentSearchForm.searchParam = '';
                    this.getClassTeacherList();
                    this.getClassStudentList();
                }
            },
            // 选择节点触发的事件
            handleNodeClick(data) {
                if(data.gradeId && data.periodId) {
                    // 选中班级
                    this.schoolPeriodId = data.periodId;
                    this.schoolGradeId = data.gradeId;
                    this.schoolClassId = data.id;

                    this.showTable = true;
                    this.classTeacherSearchForm.searchParam = '';
                    this.classStudentSearchForm.searchParam = '';
                    this.getClassTeacherList();
                    this.getClassStudentList();
                } else if(!data.gradeId && data.periodId) {
                    // 选中年级
                    this.schoolPeriodId = data.periodId;
                    this.schoolGradeId = data.id;
                    this.schoolClassId = '';

                    this.showTable = false;
                } else {
                    // 选中学段
                    this.schoolPeriodId = data.id;
                    this.schoolGradeId = '';
                    this.schoolClassId = '';

                    this.showTable = false;
                }
            },

            // =======================================================
            // 获取教师列表
            getClassTeacherList: function() {
                this.classTeacherTableloading = true;

                let param = {
                    'searchParam': this.classTeacherSearchForm.searchParam,
                    'schoolId': this.schoolId,
                    'period': this.schoolPeriodId,
                    'schoolSystemGradeId': this.schoolGradeId,
                    'schoolClassId': this.schoolClassId
                };

                schoolClassTeacherList(param).then(res => {
                    this.classTeacherTableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.classTeacherTableData = data.list;

                        this.classTeacherDialog.notContainIds = [];
                        for(let i = 0; i < this.classTeacherTableData.length; i++) {
                            this.classTeacherDialog.notContainIds.push(this.classTeacherTableData[i].memberId);
                        }
                    }
                }).catch(error => {
                    this.classTeacherTableloading = false;
                    this.$message({ message: '网络异常！获取教师列表失败！', type: 'error'});
                });
            },
            // 班级教师搜索
            keyDownClassTeacher: function() {
                this.getClassTeacherList();
            },
            // 编辑班级教师
            handleClassTeacherEdit: function(index, row) {
                this.editTeacherDialogShow = true;

                setTimeout(function() {
                    that.editTeacherInfo.id = row.id;
                    that.editTeacherInfo.memberId = row.memberId;
                    that.editTeacherInfo.index = index;
                    that.editTeacherInfo.name = row.name;
                    that.editTeacherInfo.mobile = row.mobile;
                    that.editTeacherInfo.schoolAccount = row.schoolAccount;
                    that.editTeacherInfo.headTeacher = '' + row.headTeacher;
                    that.editTeacherInfo.tagList = row.tagVoList || [];
                }, 1);                
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
                if(that.editTeacherInfo.tagList.length > 0) {
                    for(let i = 0; i < that.editTeacherInfo.tagList.length; i++) {
                        tagIds.push(that.editTeacherInfo.tagList[i].id);
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

                        that.editTeacherInfo.tagList.push({
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
                that.editTeacherInfo.tagList.splice(index, 1);
            },                   
            // 保存编辑教师
            editTeacherSubmitForm() {
                if(this.editTeacherDialogLoading) {
                    return false;
                }

                this.editTeacherDialogLoading = true;

                let tagIds = [];
                if(this.editTeacherInfo.tagList.length > 0) {
                    for(let i = 0; i < this.editTeacherInfo.tagList.length; i++) {
                        tagIds.push(this.editTeacherInfo.tagList[i].id);
                    }
                }                        

                let params = {
                    'id': this.editTeacherInfo.id,
                    'headTeacher': this.editTeacherInfo.headTeacher,
                    'tagIds': tagIds.join(',')
                };

                schoolTeacherEdit(params).then(res=>{
                    this.editTeacherDialogLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0){
                        this.$message({ message: errorInfo, type: 'error' });
                    }else{
                        this.$message({ message: '保存成功！', type: 'success' });
                        this.editTeacherDialogShow = false;
                        this.getClassTeacherList();
                    }
                }).catch(error => {
                    this.editTeacherDialogLoading = false;
                    this.$message({ message: '网络异常！保存失败！', type: 'error'});
                });
            },
            // 删除班级教师
            handleClassTeacherDelete: function(index, row) {
                let param = {
                    'id': row.id
                };

                schoolTeacherDelete(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '删除成功', type: 'success'});
                        this.getClassTeacherList();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！删除班级教师失败！', type: 'error'});
                });
            },
            // 显示添加班级教师弹窗
            handleClassTeacherAdd: function() {
                this.classTeacherDialog.searchParam = '';
                this.classTeacherDialog.selectedData = [];
                this.classTeacherDialogShow = true;

                this.getClassTeacherDialogList();
            },
            // 获取所有教师列表
            getClassTeacherDialogList: function() {
                this.classTeacherDialog.tableLoading = true;

                let param = {
                    'searchParam': this.classTeacherDialog.searchParam,
                    'schoolId': this.schoolId,
                    'notContainIds': this.classTeacherDialog.notContainIds.join(','),
                    'pageNo': this.classTeacherDialog.pagi.currentPage,
                    'pageSize': this.classTeacherDialog.pagi.pageSize
                };

                schoolStaffList(param).then(res => {
                    this.classTeacherDialog.tableLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.classTeacherDialog.noPagi = true;
                            this.classTeacherDialog.tableData = [];
                            return false;
                        }

                        for(let i = 0; i < data.list.length; i++) {
                            data.list[i].headTeacher = 0;
                        }
                        this.classTeacherDialog.tableData = data.list;

                        if(data.total % this.classTeacherDialog.pagi.pageSize == 0) {
                            this.classTeacherDialog.pagi.pageTotal = data.total/this.classTeacherDialog.pagi.pageSize;
                        } else {
                            this.classTeacherDialog.pagi.pageTotal = parseInt(data.total/this.classTeacherDialog.pagi.pageSize) + 1;
                        }
                        this.classTeacherDialog.pagi.total = data.total;
                        this.classTeacherDialog.noPagi = false;
                    }
                }).catch(error => {
                    this.classTeacherDialog.tableLoading = false;
                    this.$message({ message: '网络异常！获取所有教师列表失败！', type: 'error'});
                });
            },
            // 所有教师列表分页
            handleClassTeacherDialogPageChange: function(val) {
                this.classTeacherDialog.pagi.currentPage = parseInt(val);
                this.getClassTeacherDialogList();
            },
            // 所有教师列表搜索
            classTeacherDialogSearch: function() {
                this.classTeacherDialog.pagi.currentPage = 1;
                this.getClassTeacherDialogList();
            },
            // 所有教师列表选中checkbox触发事件
            classTeacherDialogSelect: function(val) {
                this.classTeacherDialog.selectedData = val;
            },
            // 所有教师列表删除已选中
            handleClassTeacherDialogSelectedDelete: function(index, row) {
                this.classTeacherDialog.selectedData.splice(index, 1);
            },
            // 添加班级教师保存
            classTeacherDialogSubmit: function() {
                if(this.classTeacherDialog.submitLoading) {
                    return false;
                }

                if(this.classTeacherDialog.selectedData.length == 0) {
                    this.$message({ message: '请选择需要添加的教师', type: 'error'});
                    return false;
                }

                this.classTeacherDialog.submitLoading = true;

                let classTeacher = [];
                for(let i = 0; i < this.classTeacherDialog.selectedData.length; i++) {
                    classTeacher.push({
                        'memberId': this.classTeacherDialog.selectedData[i].memberId,
                        'headTeacher': this.classTeacherDialog.selectedData[i].headTeacher
                    });
                }

                let param = {
                    'schoolClassId': this.schoolClassId,
                    'classTeacherJson': JSON.stringify(classTeacher)
                };

                schoolTeacherAdd(param).then(res => {
                    this.classTeacherDialog.submitLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '成功添加教师', type: 'success'});
                        this.classTeacherDialogShow = false;
                        this.getClassTeacherList();
                    }
                }).catch(error => {
                    this.classTeacherDialog.submitLoading = false;
                    this.$message({ message: '网络异常！保存班级教师失败！', type: 'error'});
                });
            },

            // =======================================================
            // 获取学生列表
            getClassStudentList: function() {
                this.classStudentTableloading = true;

                let param = {
                    'searchParam': this.classStudentSearchForm.searchParam,
                    'schoolId': this.schoolId,
                    'period': this.schoolPeriodId,
                    'schoolSystemGradeId': this.schoolGradeId,
                    'schoolClassId': this.schoolClassId,
                };

                schoolClassStudentList(param).then(res => {
                    this.classStudentTableloading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.classStudentTableData = data.list;

                        this.classStudentDialog.notContainIds = [];
                        for(let i = 0; i < this.classStudentTableData.length; i++) {
                            this.classStudentDialog.notContainIds.push(this.classStudentTableData[i].studentId);
                        }
                    }
                }).catch(error => {
                    this.classStudentTableloading = false;
                    this.$message({ message: '网络异常！获取班级学生列表失败！', type: 'error'});
                });
            },
            // 班级学生搜索
            keyDownClassStudent: function() {
                this.getClassStudentList();
            },
            // 转移班级学生
            handleClassStudentShift: function(index, row) {
                this.classStudentShiftDialog.searchParam = '';
                this.classStudentShiftDialogShow = true;

                this.classStudentShiftDialog.schoolOptions = this.schoolOptions;
                this.classStudentShiftDialog.treeOptions = this.treeOptions;
                this.classStudentShiftDialog.schoolId = this.schoolId;
                this.classStudentShiftDialog.schoolPeriodId = '';
                this.classStudentShiftDialog.schoolGradeId = '';
                this.classStudentShiftDialog.schoolClassId = '';

                this.getClassStudentShiftList(index);
            },
            // 删除班级学生
            handleClassStudentDelete: function(index, row) {
                let param = {
                    'id': row.id
                };

                schoolStudentDelete(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '删除成功', type: 'success'});
                        this.getClassStudentList();
                    }
                }).catch(error => {
                    this.$message({ message: '网络异常！删除班级学生失败！', type: 'error'});
                });
            },
            // 显示添加班级学生弹窗
            handleClassStudentAdd: function() {
                this.classStudentDialog.searchParam = '';
                this.classStudentDialog.selectedData = [];
                this.classStudentDialogShow = true;

                this.getClassStudentDialogList();
            },
            // 获取所有学生列表
            getClassStudentDialogList: function() {
                this.classStudentDialog.tableLoading = true;

                let param = {
                    'searchParam': this.classStudentDialog.searchParam,
                    'notContainIds': this.classStudentDialog.notContainIds.join(','),
                    'pageNo': this.classStudentDialog.pagi.currentPage,
                    'pageSize': this.classStudentDialog.pagi.pageSize,
                    'filterClassStudent': 1
                };

                smartCardList(param).then(res => {
                    this.classStudentDialog.tableLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        if(data.list.length == 0) {
                            this.classStudentDialog.noPagi = true;
                            this.classStudentDialog.tableData = [];
                            return false;
                        }

                        this.classStudentDialog.tableData = data.list;
                        if(data.total % this.classStudentDialog.pagi.pageSize == 0) {
                            this.classStudentDialog.pagi.pageTotal = data.total/this.classStudentDialog.pagi.pageSize;
                        } else {
                            this.classStudentDialog.pagi.pageTotal = parseInt(data.total/this.classStudentDialog.pagi.pageSize) + 1;
                        }
                        this.classStudentDialog.pagi.total = data.total;
                        this.classStudentDialog.noPagi = false;
                    }
                }).catch(error => {
                    this.classStudentDialog.tableLoading = false;
                    this.$message({ message: '网络异常！获取所有学生列表失败！', type: 'error'});
                });
            },
            // 所有学生列表分页
            handleClassStudentDialogPageChange: function(val) {
                this.classStudentDialog.pagi.currentPage = parseInt(val);
                this.getClassStudentDialogList();
            },
            // 所有学生列表搜索
            classStudentDialogSearch: function() {
                this.classStudentDialog.pagi.currentPage = 1;
                this.getClassStudentDialogList();
            },
            // 所有学生列表选中checkbox触发事件
            classStudentDialogSelect: function(val) {
                this.classStudentDialog.selectedData = val;
            },
            // 所有学生列表删除已选中
            handleClassStudentDialogSelectedDelete: function(index, row) {
                this.classStudentDialog.selectedData.splice(index, 1);
            },
            // 添加班级学生保存
            classStudentDialogSubmit: function() {
                if(this.classStudentDialog.submitLoading) {
                    return false;
                }

                if(this.classStudentDialog.selectedData.length == 0) {
                    this.$message({ message: '请选择需要添加的学生', type: 'error'});
                    return false;
                }

                this.classStudentDialog.submitLoading = true;

                let ids = [];
                for(let i = 0; i < this.classStudentDialog.selectedData.length; i++) {
                    ids.push(this.classStudentDialog.selectedData[i].id);
                }

                let param = {
                    'schoolClassId': this.schoolClassId,
                    'studentIds': ids.join(',')
                };

                schoolStudentAdd(param).then(res => {
                    this.classStudentDialog.submitLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '成功添加学生', type: 'success'});
                        this.classStudentDialogShow = false;
                        this.getClassStudentList();
                    }
                }).catch(error => {
                    this.classStudentDialog.submitLoading = false;
                    this.$message({ message: '网络异常！保存班级学生失败！', type: 'error'});
                });
            },


            // 学生转移弹框学生列表
            getClassStudentShiftList: function(index) {
                this.classStudentShiftDialog.tableLoading = true;

                let param = {
                    'searchParam': this.classStudentShiftDialog.searchParam,
                    'schoolId': this.schoolId,
                    'period': this.schoolPeriodId,
                    'schoolSystemGradeId': this.schoolGradeId,
                    'schoolClassId': this.schoolClassId,
                };

                schoolClassStudentList(param).then(res => {
                    this.classStudentShiftDialog.tableLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.classStudentShiftDialog.tableData = data.list;


                        setTimeout(function() {
                            let row = that.classStudentShiftDialog.tableData[index];
                            that.$refs.multipleTableShift.toggleRowSelection(row, true);
                        }, 1);
                    }
                }).catch(error => {
                    this.classStudentShiftDialog.tableLoading = false;
                    this.$message({ message: '网络异常！获取学生列表失败！', type: 'error'});
                });
            },
            // 学生转移弹框搜索
            classStudentShiftDialogSearch: function() {
                this.getClassStudentShiftList();
            },
            // 学生转移checkbox选中事件
            classStudentShiftDialogSelect: function(val) {
                this.classStudentShiftDialog.selectedData = val;
            },
            // 学生转移选择学校触发事件
            handleClassStudentShiftSchoolChange: function(val) {
                for(let i = 0; i < this.classStudentShiftDialog.schoolOptions.length; i++) {
                    let item = this.classStudentShiftDialog.schoolOptions[i];

                    if(val == item.id) {
                        this.ClassStudentShiftSetTreeOptions(item);
                        break;
                    }
                }
            },
            // 学生转移 生成树结构数据
            ClassStudentShiftSetTreeOptions: function(school) {
                this.classStudentShiftDialog.treeOptions = [];
                let periodVoList = school.periodVoList;
                for(let i = 0; i < periodVoList.length; i++) {
                    let periodItem = periodVoList[i],
                        gradeVoList = periodItem.schoolSystemGradeVoList,
                        gradeArr = [];

                    for(let j = 0; j < gradeVoList.length; j++) {
                        let gradeItem = gradeVoList[j],
                            classVoList = gradeItem.schoolClassList,
                            classArr = [];

                        for(let k = 0; k < classVoList.length; k++) {
                            let classItem = classVoList[k];

                            classArr.push({
                                'id': classItem.id,
                                'label': classItem.name,
                                'periodId': classItem.period,
                                'gradeId': classItem.schoolSystemGradeId
                            });
                        }

                        gradeArr.push({
                            'id': gradeItem.id,
                            'label': gradeItem.name,
                            'periodId': gradeItem.period,
                            'children': classArr
                        });
                    }

                    this.classStudentShiftDialog.treeOptions.push({
                        'id': periodItem.periodValue,
                        'label': periodItem.periodName,
                        'children': gradeArr
                    });
                }
            },
            // 学生转移选择树节点触发事件
            handleClassStudentShiftNodeClick: function(data) {
                if(data.gradeId && data.periodId) {
                    // 选中班级
                    this.classStudentShiftDialog.schoolPeriodId = data.periodId;
                    this.classStudentShiftDialog.schoolGradeId = data.gradeId;
                    this.classStudentShiftDialog.schoolClassId = data.id;
                } else if(!data.gradeId && data.periodId) {
                    // 选中年级
                    this.classStudentShiftDialog.schoolPeriodId = data.periodId;
                    this.classStudentShiftDialog.schoolGradeId = data.id;
                    this.classStudentShiftDialog.schoolClassId = '';
                } else {
                    // 选中学段
                    this.classStudentShiftDialog.schoolPeriodId = data.id;
                    this.classStudentShiftDialog.schoolGradeId = '';
                    this.classStudentShiftDialog.schoolClassId = '';
                }
            },
            // 学生转移保存
            classStudentShiftDialogSubmit: function() {
                if(this.classStudentShiftDialog.submitLoading) {
                    return false;
                }
                
                if(this.classStudentShiftDialog.selectedData.length == 0) {
                    this.$message({ message: '请选择需要转移的学生', type: 'error'});
                    return false;
                }

                if(this.classStudentShiftDialog.schoolClassId == '') {
                    this.$message({ message: '请选择需要转移到的班级', type: 'error'});
                    return false;
                }

                this.classStudentShiftDialog.submitLoading = true;

                let ids = [];
                for(let i = 0; i < this.classStudentShiftDialog.selectedData.length; i++) {
                    ids.push(this.classStudentShiftDialog.selectedData[i].id);
                }

                let param = {
                    'schoolClassId': this.classStudentShiftDialog.schoolClassId,
                    'schoolStudentIds': ids.join(',')
                };

                schoolStudentShift(param).then(res => {
                    this.classStudentShiftDialog.submitLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.$message({ message: '成功转移学生', type: 'success'});
                        this.classStudentShiftDialogShow = false;
                        this.getClassStudentList();
                    }
                }).catch(error => {
                    this.classStudentShiftDialog.submitLoading = false;
                    this.$message({ message: '网络异常！转移学生失败！', type: 'error'});
                });
            }
        },
        mounted() {
            that = this;

            this.getSchoolList();

            this.getClassifyList();
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
    .pickerMonth{
        .el-date-picker__header{
            > button{
                display: none !important;
            }

            > span{
                &:nth-of-type(1) {
                    display: none !important;
                }
            }
        }
    }
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

        .el-select{
            width: 100%;

            .el-input{
                .el-input__icon{
                    color: #18c79c;
                }
            }
        }
    }
    .pull-right{
        .el-checkbox{
            margin-left: 10px;

            .el-checkbox__label{
                font-size: 12px;
                color: #333;
            }
        }

        .upload-demo{
            float: right;

            .el-upload-list{
                display: none !important;
            }
        }

        .table-left,
        .table-right{
            position: relative;

            .overflow{
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .crumbs{
                position: absolute;
                z-index: 3;
                top: -14px;
                left: 0;
            }

            .el-input{
                width: 200px;
                font-size: 12px;
                
                .el-input__inner {
                    height: 36px;
                    background: #FFFFFF;
                    border: none;
                    border: 1px solid #E5E5E5;
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

            .el-button--primary{
                padding: 2px 14px;
            }

            .table{
                height: 100%;

                .el-table{
                    height: 100%;
                }

                thead{
                    display: none;
                }
            }

            .el-dialog__wrapper,
            .el-table__body-wrapper{
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;

                .el-dialog{
                    height: 70%;

                    .el-dialog__body{
                        padding-top: 15px;
                        height: calc(100% - 132px);

                        .dialog-table{
                            height: 100%;

                            .dialog-left{
                                position: relative;
                                float: left;
                                width: 50%;
                                height: 100%;
                                border: 1px solid #eee;

                                .table-search{
                                    position: absolute;
                                    z-index: 3;
                                    top: 2px;
                                    right: 15px;

                                    .el-input{
                                        width: 250px;
                                    }
                                }
                            }

                            .dialog-middle{
                                position: relative;
                                float: left;
                                width: 100px;
                                height: 100%;

                                .shift{
                                    position: absolute;
                                    z-index: 3;
                                    top: 50%;
                                    left: 50%;
                                    -webkit-transform: translate3d(-50%, -50%, 0);
                                            transform: translate3d(-50%, -50%, 0);

                                    .icon{
                                        display: block;
                                        width: 60px;
                                        height: 60px;
                                        font-size: 16px;
                                        color: #fff;
                                        line-height: 60px;
                                        text-align: center;
                                        border-radius: 4px;
                                        background: #18c79c;
                                    }

                                    .text{
                                        display: block;
                                        margin-top: 6px;
                                        font-size: 14px;
                                        line-height: 22px;
                                        color: #333;
                                        text-align: center;
                                    }
                                }
                            }

                            .dialog-right{
                                position: relative;
                                float: right;
                                width: 50%;
                                height: 100%;
                                border: 1px solid #eee;
                                border-left: none;

                                .table-title{
                                    position: absolute;
                                    z-index: 3;
                                    top: 0;
                                    left: 0;
                                    color: #000;
                                    line-height: 40px;
                                    padding-left: 15px;
                                }


                            }

                            .table{
                                .el-table__header-wrapper{
                                    .el-table__header{
                                        thead{
                                            display: block;
                                        }
                                    }
                                }

                                .el-table__body-wrapper{
                                    .el-table__body{
                                        .el-table__row{
                                            .el-table-column--selection{
                                                .cell{
                                                    padding-right: 20px;
                                                    text-overflow: initial;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                &.auto-height{
                    .el-dialog{
                        height: auto !important;

                        .el-dialog__body{
                            height: auto !important;
                        }
                    }
                }
            }

            .el-pagination{
                padding: 20px 0;
            }
        }

        .w80{
            width: 80%;
            margin-left: 5%;
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
                width: 40%;
            }

            .table-right{
                float: right;
                height: 100%;
                width: calc(60% - 10px);
            }

            .light-overscroll{
                height: 100%;
            }

            .button-separate{
                margin-right: 10px;
                color: #999;
            }
        }

        .icon-headTeacher{
            display: inline-block;
            background: orange;
            vertical-align: top;
            border-radius: 4px;
            width: 18px;
            height: 18px;
            text-align: center;
            margin-left: 5px;
            color: #FFFFFF;
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
    }
</style>

