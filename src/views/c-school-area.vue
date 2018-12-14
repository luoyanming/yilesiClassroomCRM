<template>
    <div class="main-wrapper light-overscroll luoym clearfix">
        <section class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>学校区域管理</el-breadcrumb-item>
            </el-breadcrumb>
        </section>

        <div class="pull-left">
            <div class="search-box">
                <el-input v-model="schoolname" @click="keyDownSubmit" size="small" placeholder="请输入学校名称" :icon="schoolSearchLoading ? 'loading' : 'search'"></el-input>
            </div>
            <div class="light-overscroll">
                <el-tree
                  empty-text="暂无数据"
                  :data="schoolOptions"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  @node-click="handleNodeClick">
                </el-tree>
            </div>
        </div>
        <div class="pull-right">
            <div class="light-overscroll" v-if="showTable">
                
                <section class="search clearfix">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="区域名称">
                            <el-input v-model="searchForm.name" size="small" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="区域类型">
                            <el-select v-model="searchForm.type" placeholder="请选择">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>                                
                        
                        <el-form-item>
                            <el-button type="primary" size="small" icon="search" @click.native="onSearchSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                
                    <el-button type="primary" size="small" class="btn-add" icon="plus" @click.native="handleAddArea()" v-if="searchForm.schoolId">添加区域</el-button>
                    <el-button type="primary" size="small" class="btn-add" icon="view" @click.native="handleShowSchoolArea()" v-if="searchForm.schoolId" style="margin-right: 20px;">学校总览</el-button>
                </section>

                <section class="table" style="height: auto">
                    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableloading">
                        <el-table-column label="区域编号">
                            <template scope="scope">
                                <p style="color: orange" v-if="scope.row.syncStatus == 0">{{ scope.row.code }}</p>
                                <p v-else>{{ scope.row.code }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="区域名称">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="区域设备数量">
                            <template scope="scope"><p>{{ scope.row.acceptorNum }}</p></template>
                        </el-table-column>
                        <el-table-column label="区域类型">
                            <template scope="scope"><p>{{ scope.row.typeStr }}</p></template>
                        </el-table-column>
                        <el-table-column label="所属大区域编号">
                            <template scope="scope"><p>{{ scope.row.parentRegionCode }}</p></template>
                        </el-table-column>
                        <el-table-column label="区域视图">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleDetail(scope.$index, scope.row)" v-if="scope.row.type == 1">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" class="button-link" v-if="scope.row.type == 1" @click="handleAddChildArea(scope.$index, scope.row)">添加子区域</el-button>
                                <el-button size="small" class="button-link" v-if="(scope.row.type == 1 && scope.row.subRegionNum == 0) || scope.row.type == 0" @click="handleDeleteArea(scope.$index, scope.row)">删除</el-button>
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
            </div>
        </div>
        
        <el-dialog :title="!dialogInfo.id ? '添加区域' : '编辑区域'" :visible.sync="dialogShow" :modal-append-to-body="false" class="areaDialog-wrapper">
            <section class="formation">
       
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="180px" :model="dialogInfo">
                    <el-form-item label="区域名称" prop="name">
                        <el-input v-model="dialogInfo.name"></el-input>
                        <el-input v-model="dialogInfo.code" style="width: 100px !important;" disabled></el-input>
                        <input type="text" v-model="dialogInfo.code" id="cCode" class="cCodeCopyInput">
                        <div class="cCodeCopyBtn" data-clipboard-action="copy" data-clipboard-target="#cCode">复制</div>
                    </el-form-item>
                    <el-form-item label="区域类型">
                        <el-select v-model="dialogInfo.type" placeholder="请选择">
                            <el-option v-for="item in dialogTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属大区域编号" v-if="dialogInfo.type == 0">
                        <el-input v-model="dialogInfo.parentRegionCode"></el-input>
                    </el-form-item>
                    <el-form-item label="区域作用" v-if="dialogInfo.type == 1">
                        <el-radio-group v-model="dialogInfo.action">
                            <el-radio :label="0" :disabled="!!dialogInfo.id">起定位作用</el-radio>
                            <el-radio :label="1" :disabled="!!dialogInfo.id">起装饰作用，用来完成地图拼接</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="标签">
                        <div class="tag-list">
                            <el-button type="primary" size="small" icon="delete" class="tag-item" v-for="(tagItem, tagIndex) in dialogInfo.tagList" @click.native="handleTagDetele(tagIndex, tagItem)">{{ tagItem.name }}</el-button>
                            <el-button type="primary" size="small" icon="plus" class="tag-add" @click.native="handleTagsDialogShow">添加</el-button>
                        </div>
                    </el-form-item>                            
                    <el-form-item label="是否检测进出门" v-if="(dialogInfo.type == 1 && dialogInfo.action == 0) || dialogInfo.type == 0">
                        <el-select v-model="dialogInfo.checkDoorType" placeholder="请选择">
                            <el-option v-for="item in checkDoorTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否推送通知" v-if="dialogInfo.checkDoorType == 1">
                        <el-select v-model="dialogInfo.pushStatus" placeholder="请选择">
                            <el-option v-for="item in pushStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>                            

                    <el-form-item label="添加接收器" v-if="(dialogInfo.type == 1 && dialogInfo.action == 0) || dialogInfo.type == 0">
                        <el-transfer
                            v-model="dialogInfo.acceptorIds"
                            filterable
                            filter-placeholder="搜索接收器MAC号"
                            :titles="['未添加的接收器', '已添加的接收器']"
                            :button-texts="['删除', '添加']"
                            :data="acceptorOptions">
                        </el-transfer>
                    </el-form-item>

                    <el-form-item label="相关班级编号" prop="classCode">
                        <el-input v-model="dialogInfo.classCode"></el-input>
                    </el-form-item>                    
                </el-form>

            </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogInfo.dialogLoading" @click.native="submitForm('ruleForm')">保存</el-button>
            </span>
        </el-dialog>
        

        <el-dialog :title="areaDetail.name" :visible.sync="areaDetail.dialogShow" :modal-append-to-body="false">
            <div class="area-map">
                <canvas id="canvas-area" width="500" height="300" v-if="areaDetail.regionMapVo"></canvas>
                <div class="text" v-else>暂无预览图</div>
            </div>
            <!-- <div class="area-title">下属子区域</div>
            <div class="area-subRegion">
                <p class="subRegion-item" v-for="item in areaDetail.subRegionNameList" key="item">{{ item }}</p>
            </div> -->
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
    import { uploadPath, schoolList, areaList, areaCode, areaSave, areaDelete, areaMachineList, tagsClassifyList, tagsList } from '../api/api';

    let that;

    export default {
        data() {
            return {
                showTable: false,

                // 左侧学校列表
                schoolOptions: [],
                defaultProps: {
                    label: 'label'
                },
                schoolname: '',
                schoolSearchLoading: false,

                searchForm: {
                    schoolId: '',
                    name: '',
                    type: ''
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

                typeOptions: [
                    {
                        'value': '',
                        'label': '全部'
                    },                
                    {
                        'value': '0',
                        'label': '子区域'
                    },
                    {
                        'value': '1',
                        'label': '大区域'
                    }                    
                ],
                dialogTypeOptions: [               
                    {
                        'value': '0',
                        'label': '子区域'
                    },
                    {
                        'value': '1',
                        'label': '大区域'
                    }                    
                ],
                dialogActionOptions: [               
                    {
                        'value': '0',
                        'label': '起定位作用'
                    },
                    {
                        'value': '1',
                        'label': '起装饰作用，用来完成地图拼接'
                    }                    
                ],                
                checkDoorTypeOptions: [
                    {
                        'value': '0',
                        'label': '否'
                    },                
                    {
                        'value': '1',
                        'label': '是'
                    }                    
                ],
                pushStatusOptions: [
                    {
                        'value': '0',
                        'label': '否'
                    },                
                    {
                        'value': '1',
                        'label': '是'
                    }                    
                ],                
                acceptorOptions: [
                    {
                        key: 0,
                        label: 'B0000001（高中部3F）'
                    },
                    {
                        key: 1,
                        label: 'B0000002（高中部4F）'
                    }                    
                ],

                dialogShow: false,
                dialogInfo: {
                    id: '',
                    name: '',
                    code: '',
                    type: '0',
                    parentRegionCode: '',
                    action: 0,
                    tagList: [],
                    checkDoorType: '0',
                    pushStatus: '1',
                    acceptorIds: [],
                    classCode: '',
                    dialogLoading: false
                },
                rules: {
                    name: [
                        { required: true, message: '*请输入区域名称', trigger: 'blur' }
                    ]
                },

                uploadUrl: uploadPath + '/ajax/school/region/map/upload',
                picUrl: [],
                fileArr: [],

                areaDetail: {
                    name: '',
                    regionMapVo: '',
                    dialogShow: false
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
            // 获取学校列表
            getSchoolList: function() {
                this.schoolSearchLoading = true;

                let param = {
                    'name': this.schoolname,
                    'pageNo': 1,
                    'pageSize': 5000
                };

                schoolList(param).then(res => {
                    this.schoolSearchLoading = false;

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        that.schoolOptions = [];
                        if(data.list && data.list.length > 0) {
                            for(let i = 0; i < data.list.length; i++) {
                                let item = data.list[i];

                                this.schoolOptions.push({
                                    "label": item.fullName + '(' + item.code + ')',
                                    "code": item.code,
                                    "id": item.id
                                });
                            }
                        }
                    }
                }).catch(error => {
                    this.schoolSearchLoading = false;
                    this.$message({ message: '网络异常！获取学校列表失败！', type: 'error'});
                });
            },
            // 选择节点触发的事件
            handleNodeClick(data) {
                this.searchForm.schoolId = data.id;
                this.searchForm.schoolCode = data.code;
                this.showTable = true;

                this.getList();
            },
            // 搜索按钮
            onSearchSubmit: function() {
                this.pagi.currentPage = 1;

                this.getList();
            },
            // 分页
            handleCurrentChange(val) {
                this.pagi.currentPage = parseInt(val);
                this.getList();
            },
            // 获取区域列表
            getList: function() {
                this.tableloading = true;

                let param = {
                    'schoolId': this.searchForm.schoolId,
                    'name': this.searchForm.name,
                    'type': this.searchForm.type,
                    'pageNo': this.pagi.currentPage,
                    'pageSize': this.pagi.pageSize
                };

                areaList(param).then(res => {
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
                    this.$message({ message: '网络异常！获取区域列表失败！', type: 'error'});
                });
            },

            // 未添加的接收器列表
            getMacList: function(regionId) {
                let param = {
                    'schoolId': this.searchForm.schoolId,
                    'regionId': regionId
                };

                areaMachineList(param).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        that.$message({ message: errorInfo, type: 'error'});
                    } else {
                        let obj = [];
                        if(data.list && data.list.length > 0) {
                            for(let i = 0; i < data.list.length; i++) {
                                obj.push({
                                    key: data.list[i].id,
                                    label: data.list[i].macNo + '('+ data.list[i].location +')'
                                })
                            }
                        }

                        that.acceptorOptions = obj;
                    }
                }).catch(error => {
                    that.$message({ message: '网络异常！获取接收器列表失败！', type: 'error'});
                });                     
            },

            // 搜索学校
            keyDownSubmit: function() {
                that.getSchoolList();
            },

            // 添加区域
            handleAddArea: function() {
                this.getMacList('');

                this.dialogShow = true;

                setTimeout(function() {
                    that.dialogInfo = {
                        id: '',
                        name: '',
                        code: '',
                        type: '1',
                        parentRegionCode: '',
                        action: 0,
                        tagList: [],
                        checkDoorType: '0',
                        pushStatus: '1',
                        acceptorIds: [],
                        classCode: '',
                        dialogLoading: false
                    }

                    that.fileArr = [];


                    // 获取区域编号
                    let param = {
                        schoolId: that.searchForm.schoolId
                    }

                    areaCode(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.dialogInfo.code = data.code;
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！获取区域编号失败！', type: 'error'});
                    });
                }, 1);                
            },

            // 添加子区域
            handleAddChildArea: function(index, row) {
                this.getMacList('');

                this.dialogShow = true;

                setTimeout(function() {
                    that.dialogInfo = {
                        id: '',
                        name: '',
                        code: '',
                        type: '0',
                        parentRegionCode: row.code,
                        action: 0,
                        tagList: [],
                        checkDoorType: '0',
                        pushStatus: '1',
                        dialogLoading: false,
                        acceptorIds: [],
                        classCode: ''
                    }

                    that.fileArr = [];


                    // 获取区域编号
                    let param = {
                        schoolId: that.searchForm.schoolId
                    }

                    areaCode(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.dialogInfo.code = data.code;
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！获取区域编号失败！', type: 'error'});
                    });
                }, 1);
            },

            // 编辑区域
            handleEdit: function(index, row) {
                this.getMacList(row.id);

                that.dialogShow = true;

                let tagListArr = [];
                if(row.tagVoList.length > 0) {
                    for(let i = 0; i < row.tagVoList.length; i++) {
                        tagListArr.push({
                            id: row.tagVoList[i].id,
                            name: row.tagVoList[i].name
                        })
                    }
                }

                setTimeout(function() {
                    that.dialogInfo = {
                        id: row.id,
                        name: row.name,
                        code: row.code,
                        parentRegionCode: row.parentRegionCode,
                        type: '' + row.type,
                        action: row.action,
                        tagList: tagListArr,
                        checkDoorType: '' + row.checkDoorType,
                        pushStatus: '' + row.pushStatus,
                        acceptorIds: that.transArray(row.acceptorIds),
                        classCode: row.classCode || '',
                        dialogLoading: false
                    }
                }, 1);                
            },

            // 提交
            submitForm: function(formName) {
                if(this.dialogInfo.dialogLoading) {
                    return false;
                }
                
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.dialogInfo.dialogLoading = true;

                        let tagIds = [];
                        if(this.dialogInfo.tagList.length > 0) {
                            for(let i = 0; i < this.dialogInfo.tagList.length; i++) {
                                tagIds.push(this.dialogInfo.tagList[i].id);
                            }
                        }

                        let params = {
                            id: this.dialogInfo.id,
                            schoolId: this.searchForm.schoolId,
                            name: this.dialogInfo.name,
                            code: this.dialogInfo.code,
                            type: this.dialogInfo.type,
                            parentRegionCode: this.dialogInfo.parentRegionCode,
                            action: this.dialogInfo.action,
                            tagIds: tagIds.join(','),
                            checkDoorType: this.dialogInfo.checkDoorType,
                            pushStatus: this.dialogInfo.pushStatus,
                            acceptorIds: this.dialogInfo.acceptorIds.join(','),
                            classCode: this.dialogInfo.classCode
                        };

                        areaSave(params).then(res=>{
                            this.dialogInfo.dialogLoading = false;

                            let { errorInfo, code, data } = res;

                            if(code !== 0){
                                this.$message({ message: errorInfo, type: 'error' });
                            }else{
                                this.$message({ message: '保存成功！', type: 'success' });
                                this.dialogShow = false;
                                this.getList();
                            }
                        }).catch(error => {
                            this.dialogInfo.dialogLoading = false;
                            this.$message({ message: '网络异常！保存失败！', type: 'error'});
                        });
                    }else{
                        return false;
                    }
                });
            },


            // 查看区域
            handleDetail: function(index, row) {
                that.areaDetail = {
                    name: '',
                    regionMapVo: [],
                    dialogShow: true
                }                

                setTimeout(function() {
                    that.areaDetail.name = row.name;
                    that.areaDetail.regionMapVo = row.regionMapVo;

                    if(row.regionMapVo) {
                        that.canvasAreaInit();
                    }
                }, 1)
            },

            //canvasAreaInit
            canvasAreaInit: function() {
                let pointXArr = [],
                    pointYArr = [],
                    mapPoint = that.areaDetail.regionMapVo;

                for(var i = 0; i < mapPoint.point.length; i++) {
                    pointXArr.push(mapPoint.point[i].x);
                    pointYArr.push(mapPoint.point[i].y);
                }
                if(mapPoint.center.x) {
                    pointXArr.push(mapPoint.center.x + 40);
                    pointYArr.push(mapPoint.center.y + 20);
                }

                var xMax = Math.max.apply(null, pointXArr),
                    xMin = Math.min.apply(null, pointXArr),
                    yMax = Math.max.apply(null, pointYArr),
                    yMin = Math.min.apply(null, pointYArr);

                var dx = xMax - xMin,
                    dy = yMax - yMin,
                    wrapW = $('#canvas-area').parent().width(),
                    wrapH = 200;

                var pointsItem = {};
                pointsItem.center = {
                    x: mapPoint.center.x ? mapPoint.center.x - xMin : '',
                    y: mapPoint.center.y ? mapPoint.center.y - yMin : ''
                };

                var pointsItemPointArr = [];
                for(var y = 0; y < mapPoint.point.length; y++) {
                    pointsItemPointArr.push({
                        x: mapPoint.point[y].x - xMin,
                        y: mapPoint.point[y].y - yMin
                    })
                }
                pointsItem.point = pointsItemPointArr;
                pointsItem.color = mapPoint.color;
                pointsItem.name = mapPoint.name;
                pointsItem.num = mapPoint.num || 0;
                


                var cvs = document.getElementById('canvas-area'),
                    scale = wrapH/dy * 5 * 0.8;

                if(wrapH/dy > wrapW/dx) {
                    scale = wrapW/dx * 5 * 0.8;
                }

                cvs.width = dx * scale;
                cvs.height = dy * scale;
                $('#canvas-area').css({ 'margin-left': -dx * scale/2, 'margin-top': -dy * scale/2 });
                var ctx = cvs.getContext('2d'); 

                ctx.clearRect(0, 0, dx, dy);

                ctx.beginPath();
                ctx.fillStyle = pointsItem.color;
                var point = pointsItem.point;
                ctx.moveTo(point[0].x * scale, point[0].y * scale);
                for(var k = 0; k < point.length; k++) {
                    ctx.lineTo(point[k].x * scale, point[k].y * scale);
                }
                ctx.lineTo(point[0].x * scale, point[0].y * scale);       
                ctx.closePath();  
                ctx.fill();

                if(mapPoint.id) {
                    // 区域名字
                    ctx.font = 8 * scale + 'px Helvetica';
                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(pointsItem.name, pointsItem.center.x * scale, pointsItem.center.y * scale);

                    // 区域数量色块
                    var cx = pointsItem.center.x,
                        cy = pointsItem.center.y,
                        delta = 5;
                    ctx.beginPath();
                    ctx.fillStyle = '#38A0FF';
                    ctx.moveTo((cx - 2 * delta)  * scale, (cy + 0.5 * delta)  * scale);
                    ctx.lineTo((cx + 2 * delta)  * scale, (cy + 0.5 * delta)  * scale);
                    ctx.arc((cx + 2 * delta)  * scale, (cy + 1.5 * delta)  * scale, delta * scale, -0.5 * Math.PI, 1 * Math.PI);
                    ctx.lineTo((cx + 2 * delta)  * scale, (cy + 2.5 * delta)  * scale);
                    ctx.lineTo((cx - 2 * delta)  * scale, (cy + 2.5 * delta)  * scale);
                    ctx.arc((cx - 2 * delta)  * scale, (cy + 1.5 * delta)  * scale, delta * scale, 0.5 * Math.PI, 1.5 * Math.PI);
                    ctx.lineTo((cx - 2 * delta)  * scale, (cy + 0.5 * delta)  * scale);
                    ctx.closePath();
                    ctx.fill();

                    // 区域数量文字
                    ctx.font = 8 * scale + 'px Helvetica';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(pointsItem.num || 0, cx * scale, (cy + 1.5 * delta) * scale);
                }

                that.canvasTransform(1/5, dx, dy)                
            },

            canvasTransform: function(scale, dx, dy) {
                $('#canvas-area').css({
                    '-webkit-transform': 'scale('+ scale +')',
                    'transform': 'scale('+ scale +')'
                })
            },              


            // 学校总览
            handleShowSchoolArea: function() {
                this.$router.push({ path: '/schoolAreaMap', query: { schoolId: this.searchForm.schoolId } });
            },

            // 删除区域
            handleDeleteArea: function(index, row) {
                this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id
                    }

                    areaDelete(param).then(res => {
                        let { errorInfo, code, data } = res;

                        if(code !== 0) {
                            that.$message({ message: errorInfo, type: 'error'});
                        } else {
                            that.$message({ message: '删除成功', type: 'success'});

                            that.getList();
                        }
                    }).catch(error => {
                        that.$message({ message: '网络异常！删除失败！', type: 'error'});
                    });
                }).catch(() => {
                            
                });
            },

            // 获取学校编号事件
            copyBind: function() {
                var clipboard = new Clipboard('.cCodeCopyBtn');

                clipboard.on('success', function(e) {
                    that.$message({ message: '复制区域编号成功！', type: 'success' });

                    e.clearSelection();
                });

                clipboard.on('error', function(e) {
                    that.$message({ message: '复制区域编号失败！', type: 'error' });
                });
            },

            // 转换数组
            transArray: function(ids) {
                ids = ids.split(',');

                let newIds = [];
                if(ids && ids.length > 0) {
                    for(let i = 0; i < ids.length; i++) {
                        if(ids[i]) {
                            newIds.push(parseInt(ids[i]));
                        }
                    }
                }

                return newIds;
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
                if(that.dialogInfo.tagList.length > 0) {
                    for(let i = 0; i < that.dialogInfo.tagList.length; i++) {
                        tagIds.push(that.dialogInfo.tagList[i].id);
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

            // 保存编辑
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

                        that.dialogInfo.tagList.push({
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
                that.dialogInfo.tagList.splice(index, 1);
            }                  
        },
        mounted() {
            that = this;

            this.getSchoolList();
            this.copyBind();
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
    }


    .el-radio__label{
        font-size: 12px;
        color: #333;
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
                width: 350px;
            }

            .table-right{
                float: right;
                height: 100%;
                width: calc(100% - 360px);
            }

            .light-overscroll{
                height: 100%;
            }

            .button-separate{
                margin-right: 10px;
                color: #999;
            }
        }

        .cCodeCopyInput{
            display: inline-block;
            width: 10px;
            height: 10px;
            overflow: hidden;
            opacity: 0;
        }

        .cCodeCopyBtn{
            display: inline-block;
            white-space: nowrap;
            cursor: pointer;
            border: 1px solid #c4c4c4;
            box-sizing: border-box;
            min-width: 76px;
            padding: 0 14px;
            line-height: 38px;
            border-radius: 2px;
            font-size: 12px;
            color: #fff;
            background-color: #18c79c;
            border-color: #18c79c;
            text-align: center;

            &:hover{
                background: rgb(70, 210, 176);
                border-color: rgb(70, 210, 176);
                color: #fff;
            }
        }

        .area-map{
            position: relative;
            min-width: 500px;
            min-height: 300px;
            overflow: hidden;

            canvas{
                position: absolute;
                z-index: 3;
                top: 50%;
                left: 50%;
            }
            .text{
                font-size: 12px;
                color: #999;
                text-align: center;
                line-height: 300px;
            }
        }
        .area-title{
            font-size: 16px;
            line-height: 70px;
            color: #666;
            border-top: 1px solid #eee;
        }
        .area-subRegion{
            padding-bottom: 40px;
        }
        .area-subRegion p{
            display: inline-block;
            width: 47%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding: 0 25px;
            font-size: 14px;
            line-height: 60px;
            color: #333;

            &:nth-of-type(4n + 1){
                background: #fafafa;
            }
            &:nth-of-type(4n + 2){
                background: #fafafa;
            }
            &:nth-of-type(2n + 1){
                margin-right: 5.8%;
            }                     
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

