<template>
    <div>
        <div class="main-wrapper light-overscroll luoym" v-loading="pageLoading">
            <section class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>绘制区域地图</el-breadcrumb-item>
                </el-breadcrumb>
            </section>                

            <section class="map-wrapper" v-show="mapurl">
                <div class="map-info flex-h" style="position:relative;">
                    <div class="info-item flex-a-i">
                        <div class="title el-icon-picture">原图（分辨率：1000 * 600）</div>
                        <div class="thumb-box">
                            <img :src="mapurl" class="thumb">
                        </div>
                    </div>
                    <div class="info-item flex-a-i">
                        <div class="title el-icon-picture">预览图</div>
                        <div class="canvas-box">
                            <canvas id="canvas-map"></canvas>
                        </div>
                    </div>
                    <section class="formation" v-show="mapurl">
                        <div class="upload-wrap absolute-upload-wrap">
                            <el-upload
                                class="upload-demo list-pic-box"
                                :data="schoolParam"
                                :action="uploadUrl"
                                :file-list="dialog.thumbList"
                                list-type="picture"
                                :before-upload="uploadBeforeList"
                                :on-success="uploadSuccList"
                                :on-error="uploadErrorList"
                                :on-remove="uploadRemoveList">
                                <el-button type="primary" class="el-icon-upload reloadUpload" element-loading-text="正在上传"> 重新上传图片</el-button>
                            </el-upload>
                        </div>
                    </section>
                </div>
                
                <!-- <div class="area-list clearfix">
                    <div class="list-item" v-for="(item, index) in areaList">
                        <div class="item-header flex-h">
                            <div v-bind:class="[ item.point.length > 0 ? 'name el-icon-star-on flex-a-i' : 'name el-icon-star-off flex-a-i' ]">{{ item.name }}</div>
                            <div class="btn btn-start el-icon-plus" v-if="item.point.length == 0" @click="handleAddPoint(index, item)">区域描点</div>
                            <div class="btn btn-end el-icon-plus" v-if="item.point.length > 0" @click="handleAddPoint(index, item)">重新绘制</div>
                            <div class="btn btn-end el-icon-delete" v-if="!item.id" @click="handleDeleteDecorateArea(index, item)">删除</div>
                        </div>
                        <div class="item-body">
                            <canvas :id="'canvas-area-' + index" width="350" height="200" v-if="item.point.length > 0"></canvas>
                            <div class="text" v-else>暂无预览图</div>
                        </div>
                    </div>
                    <div class="list-item add-more">
                        <div class="btn-add el-icon-plus" @click="handleAddDecorateArea">添加装饰区域</div>
                    </div>
                </div> -->

                <section class="table" style="height: auto; margin-top: 30px;">
                    <el-table :data="schoolRegionList" stripe style="width: 100%">
                        <el-table-column label="区域编号">
                            <template scope="scope">
                                <p style="color: orange" v-if="scope.row.syncStatus == 0">{{ scope.row.code }}</p>
                                <p v-else>{{ scope.row.code }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="区域名称">
                            <template scope="scope"><p>{{ scope.row.name }}</p></template>
                        </el-table-column>
                        <el-table-column label="区域类型">
                            <template scope="scope">
                                <p v-if="scope.row.type == 0">子区域</p>
                                <p v-if="scope.row.type == 1">大区域</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="作用">
                            <template scope="scope">
                                <p v-if="scope.row.action == 0">起定位作用</p>
                                <p v-if="scope.row.action == 1">起装饰作用</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" class="button-link" @click="handleAddPoint(scope.$index, scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </section>                      
            </section>

            <section class="upload-wrapper formation" v-show="!mapurl">
                <div class="map-info flex-h">
                    <div class="info-item flex-a-i">
                        <div class="title el-icon-picture">上传图片（分辨率：1000 * 600）</div>
                    </div>
                </div>
                <div class="list-item add-more upload-wrap">
                    <el-upload
                        class="upload-demo list-pic-box"
                        :data="schoolParam"
                        :action="uploadUrl"
                        :file-list="dialog.thumbList"
                        list-type="picture"
                        :before-upload="uploadBeforeList"
                        :on-success="uploadSuccList"
                        :on-error="uploadErrorList"
                        :on-remove="uploadRemoveList">
                        <el-button type="primary" class="btn-add el-icon-upload" element-loading-text="正在上传">上传图片</el-button>
                        <div slot="tip" class="el-upload__tip" style="text-align: center;position: absolute;width: 100%;bottom: 30%;">只能上传jpg/png文件</div>
                    </el-upload>
                </div>
            </section>
        </div>


        <el-dialog :title="'绘制大区域（' + dialog.name + '）'" :visible.sync="dialog.show" class="dialog-canvas">
            <div class="form-section flex-h">
                <div class="title">区域颜色：</div>
                <div class="input-wrap">
                    <el-input v-model="dialog.color" class="input-color"></el-input>
                </div>
                <div class="tips flex-a-i el-icon-warning">6位区域色号(如：#AAAAAA)</div>
            </div>

            <div class="form-section flex-h" style="margin-bottom: 5px;">
                <div class="title">区域描点：</div>
                <div class="tips el-icon-warning">至少三个点，起点不限，描点顺序请严格按照区域边缘进行</div>
                <div class="flex-a-i">
                    <div class="btn el-icon-circle-close" @click="dialogCanvasPointClear" v-if="dialog.point.length > 0">重绘</div>
                </div>
            </div>

            <div class="form-section">
                <div class="canvas-box">
                    <img :src="mapurl">
                    <canvas width="1000" height="600" id="canvas-dialog-point"></canvas>
                </div>
            </div>

            <div class="form-section flex-h" style="margin-bottom: 5px;" v-if="dialog.id">
                <div class="title">文字描点：</div>
                <div class="tips flex-a-i el-icon-warning">一个点，尽量选择当前区域中心，防止与其它区域重叠</div>
            </div>

            <div class="form-section" v-if="dialog.id">
                <div class="canvas-box">
                    <img :src="mapurl">
                    <canvas width="1000" height="600" id="canvas-dialog-center"></canvas>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false"> 取消 </el-button>
                <el-button type="primary" :loading="dialog.loading" @click="dialogSubmit" element-loading-text="正在保存"> 保存 </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { uploadPath, uploadSchoolArea, saveSchoolAreaPoints, saveSchoolRegionMapPoint, getSchoolAreaDetail } from '../api/api.js'

    export default {
        data() {
            return {
                pageLoading: false,

                schoolId: this.$route.query.schoolId,

                // mapurl: '../../static/mapDemo.png',
                mapurl: '',
                uploadUrl: uploadPath + '/ajax/school/regionMap/upload',

                schoolRegionList: [],
                areaList: [],

                colorLength: 7,

                dialog: {
                    show: false,
                    index: -1,
                    id: '',
                    color: '',
                    point: [],
                    center: {},
                    loading: false,
                    thumbList: []
                },

                schoolParam: {
                    schoolId: this.$route.query.schoolId
                }
            };
        },
        methods: {
            /**
             * [getAreaList description] 获取学校区域列表
             * @return {[type]} [description]
             */
            getAreaList: function() {
                this.pageLoading = true;

                getSchoolAreaDetail(this.schoolParam).then(res => {
                    let { errorInfo, code, data } = res;
                    console.log(data)

                    if(code !== 0) {
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        this.pageLoading = false;
                        this.mapurl = data.mapUrl;
                        let regionMapPoint = data.regionMapVoList;
                        for(let i = 0; i < regionMapPoint.length; i++) {
                            regionMapPoint[i].center = JSON.parse(regionMapPoint[i].center);
                            regionMapPoint[i].point = JSON.parse(regionMapPoint[i].point);
                        }
                        this.areaList = regionMapPoint;
                        this.schoolRegionList = data.schoolRegionList;
                    
                        
                        setTimeout(() => {
                            // for(let i = 0; i < this.areaList.length; i++) {
                            //     this.drawArea(i, this.areaList[i]);
                            // }

                            this.drawMap();
                        }, 300)
                    }
                })             
            },
            /**
             * [drawMap 绘制学校地图]
             * @return {[type]} [description]
             */
            drawMap: function() {
                let that = this,
                    cvs = document.getElementById('canvas-map'),
                    ctx = cvs.getContext('2d'),
                    _w = $('#canvas-map').parent().width(),
                    _h = _w * 0.6,
                    scale = _w / 1000;

                cvs.width = _w;
                cvs.height = _h;

                ctx.clearRect(0, 0, _w, _h);

                for(let i = 0; i < that.areaList.length; i++) {
                    let points = that.areaList[i];

                    if(points.point.length > 0) {
                        // 区域色块
                        ctx.beginPath();
                        ctx.fillStyle = points.color;
                        let point = points.point;

                        if(point.length > 0) {
                            ctx.moveTo(point[0].x * scale, point[0].y * scale);
                            for(let j = 0; j < point.length; j++) {
                                ctx.lineTo(point[j].x * scale, point[j].y * scale);
                            }
                            ctx.lineTo(point[0].x * scale, point[0].y * scale);       
                            ctx.closePath();  
                            ctx.fill();                          
                            
                            if(points.id) {
                                // 区域名字
                                ctx.font = 8 * scale + 'px Helvetica';
                                ctx.fillStyle = '#000000';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(points.name, points.center.x * scale, points.center.y * scale);

                                // 区域数量色块
                                var cx = points.center.x,
                                    cy = points.center.y,
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
                                ctx.fillText(points.num || 0, cx * scale, (cy + 1.5 * delta) * scale);
                            }
                        }
                    }
                }
            },
            /**
             * [drawArea 绘制单个地图预览图]
             * @param  {[type]} index    [区域序号]
             * @param  {[type]} mapPoint [区域数据]
             * @return {[type]}          [description]
             */
            drawArea: function(index, mapPoint) {
                let that = this;

                if(mapPoint.point.length == 0) {
                    return false;
                }

                var pointXArr = [],
                    pointYArr = [];
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
                    wrapW = $('#canvas-area-' + index).parent().width(),
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
                


                var cvs = document.getElementById('canvas-area-' + index),
                    scale = wrapH/dy * 5 * 0.8;

                if(wrapH/dy > wrapW/dx) {
                    scale = wrapW/dx * 5 * 0.8;
                }

                cvs.width = dx * scale;
                cvs.height = dy * scale;
                $('#canvas-area-' + index).css({ 'margin-left': -dx * scale/2, 'margin-top': -dy * scale/2 });
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

                that.canvasTransform(index, 1/5, dx, dy)
            },
            /**
             * [canvasTransform 缩放区域预览图]
             * @param  {[type]} index [区域序号]
             * @param  {[type]} scale [缩放倍数]
             * @param  {[type]} dx    [description]
             * @param  {[type]} dy    [description]
             * @return {[type]}       [description]
             */
            canvasTransform: function(index, scale, dx, dy) {
                $('#canvas-area-' + index).css({
                    '-webkit-transform': 'scale('+ scale +')',
                    'transform': 'scale('+ scale +')'
                })
            },        
            /**
             * [handleAddPoint 大区域描点]
             * @param  {[INT]} index [序号]
             * @param  {[OBJECT]} item  [区域单条数据]
             */
            handleAddPoint: function(index, item) {
                this.dialog = {
                    show: true,
                    index: index,
                    id: item.action == 0 ? item.id : 0,
                    name: item.name,
                    color: '',
                    point: [],
                    center: {},
                    loading: false  
                }

                let that = this;
                setTimeout(function() {
                    that.dialogCanvasPointInit();

                    if(item.action == 0) {
                        that.dialogCanvasCenterInit();
                    }
                }, 2)
            },
            /**
             * [dialogCanvasPointInit 初始化区域画布]
             * @return {[type]} [description]
             */
            dialogCanvasPointInit: function() {
                let that = this,
                    cvsPoint = document.getElementById('canvas-dialog-point'),
                    ctxPoint = cvsPoint.getContext('2d');

                ctxPoint.clearRect(0, 0, 1000, 600);
                    
                cvsPoint.removeEventListener('click', that.dialogCnavasPointEvent, false);
                cvsPoint.addEventListener('click', that.dialogCnavasPointEvent, false);
            },
            /**
             * [dialogCanvasCenterInit 初始化中心点画布]
             * @return {[type]} [description]
             */
            dialogCanvasCenterInit: function() {
                let that = this,
                    cvsCenter = document.getElementById('canvas-dialog-center'),
                    ctxCenter = cvsCenter.getContext('2d');

                ctxCenter.clearRect(0, 0, 1000, 600);
                    
                cvsCenter.removeEventListener('click', that.dialogCnavasCenterEvent, false);
                cvsCenter.addEventListener('click', that.dialogCnavasCenterEvent, false);                
            },
            /**
             * [dialogCnavasDrawPoint 绘制区域点]
             * @param  {[type]} ctx [description]
             * @return {[type]}     [description]
             */
            dialogCnavasDrawPoint: function(ctx) {
                let that = this,
                    cvsPoint = document.getElementById('canvas-dialog-point'),
                    ctxPoint = cvsPoint.getContext('2d');
                
                if(that.dialog.point.length > 0) {
                    that.dialogCanvasPointInit();

                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(252, 25, 50, .1)';
                    for(let i = 0; i < that.dialog.point.length; i++) {
                        ctx.lineTo(that.dialog.point[i].x, that.dialog.point[i].y);
                    }
                    ctx.lineTo(that.dialog.point[0].x, that.dialog.point[0].y);       
                    ctx.closePath();  
                    ctx.fill();

                    for(let i = 0; i < that.dialog.point.length; i++) {
                        that.dialogCanvasDrawRedCircle(ctxPoint, that.dialog.point[i]);
                    }                    
                    
                }
            },
            /**
             * [dialogCnavasDrawCenter 绘制中心点]
             * @param  {[type]} ctx [description]
             * @return {[type]}     [description]
             */
            dialogCnavasDrawCenter: function(ctx) {
                let that = this,
                    cvsCenter = document.getElementById('canvas-dialog-center'),
                    ctxCenter = cvsCenter.getContext('2d');

                if(that.dialog.center.x) {
                    that.dialogCanvasCenterInit();

                    // 区域名字
                    ctx.font = 8 + 'px Helvetica';
                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(that.dialog.name, that.dialog.center.x, that.dialog.center.y);

                    // 区域数量色块
                    let cx = that.dialog.center.x,
                        cy = that.dialog.center.y,
                        delta = 5;
                    ctx.beginPath();
                    ctx.fillStyle = '#38A0FF';
                    ctx.moveTo((cx - 2 * delta) , (cy + 0.5 * delta) );
                    ctx.lineTo((cx + 2 * delta) , (cy + 0.5 * delta) );
                    ctx.arc((cx + 2 * delta) , (cy + 1.5 * delta) , delta, -0.5 * Math.PI, 1 * Math.PI);
                    ctx.lineTo((cx + 2 * delta) , (cy + 2.5 * delta) );
                    ctx.lineTo((cx - 2 * delta) , (cy + 2.5 * delta) );
                    ctx.arc((cx - 2 * delta) , (cy + 1.5 * delta) , delta, 0.5 * Math.PI, 1.5 * Math.PI);
                    ctx.lineTo((cx - 2 * delta) , (cy + 0.5 * delta) );
                    ctx.closePath();
                    ctx.fill();

                    // 区域数量文字
                    ctx.font = 8 + 'px Helvetica';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(0, cx, (cy + 1.5 * delta));

                    that.dialogCanvasDrawRedCircle(ctxCenter, that.dialog.center);
                }                
            },
            /**
             * [dialogCnavasPointEvent 区域点击事件]
             * @param  {[type]} e [description]
             * @return {[type]}   [description]
             */
            dialogCnavasPointEvent: function(e) {
                let that = this,
                    cvsPoint = document.getElementById('canvas-dialog-point'),
                    ctxPoint = cvsPoint.getContext('2d');

                that.dialog.point.push({
                    x: e.offsetX,
                    y: e.offsetY
                })

                that.dialogCnavasDrawPoint(ctxPoint);
            },
            /**
             * [dialogCnavasCenterEvent 中心点点击事件]
             * @param  {[type]} e [description]
             * @return {[type]}   [description]
             */
            dialogCnavasCenterEvent: function(e) {
                let that = this,
                    cvsCenter = document.getElementById('canvas-dialog-center'),
                    ctxCenter = cvsCenter.getContext('2d');

                that.dialog.center = {
                    x: e.offsetX,
                    y: e.offsetY
                }

                that.dialogCnavasDrawCenter(ctxCenter);          
            },
            /**
             * [dialogCanvasDrawRedCircle 绘制小红点]
             * @param  {[type]} ctx   [description]
             * @param  {[type]} point [description]
             * @return {[type]}       [description]
             */
            dialogCanvasDrawRedCircle: function(ctx, point) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(252, 25, 50, 1)';
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);      
                ctx.closePath();  
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = '#FFFFFF';
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);      
                ctx.closePath();  
                ctx.fill();                
            },
            /**
             * [dialogCanvasPointClear 清空区域画布的点]
             * @return {[type]} [description]
             */
            dialogCanvasPointClear: function() {
                let that = this;

                that.dialogCanvasPointInit();
                that.dialog.point = [];
            },
            /**
             * [dialogSubmit 保存区域地图数据]
             * @return {[type]} [description]
             */
            dialogSubmit: function() {
                let that = this;

                if(that.dialog.loading) {
                    return false;
                }

                if(!that.dialog.color || that.dialog.color.length != 7) {
                    that.$message({ message: '请输入正确的色号', type: 'error', duration: '2000' });
                    return false;
                }

                if(that.dialog.point.length < 3) {
                    that.$message({ message: '请至少描绘三个区域描点', type: 'error', duration: '2000' });
                    return false;
                }

                if(that.dialog.id && !that.dialog.center.x) {
                    that.$message({ message: '请描绘区域文字描点', type: 'error', duration: '2000' });
                    return false;
                }

                that.dialog.loading = true;


                let mapAllData = that.areaList;
                mapAllData[that.dialog.index].center = that.dialog.center;
                mapAllData[that.dialog.index].point = that.dialog.point;
                mapAllData[that.dialog.index].color = that.dialog.color;

                let mapPoint = {},
                    regionId = '';
                mapPoint.center = that.dialog.center;
                mapPoint.point = that.dialog.point;
                mapPoint.color = that.dialog.color; 

                for(let i = 0; i < that.schoolRegionList.length; i++) {
                    if(that.dialog.name == that.schoolRegionList[i].name) {
                        regionId = that.schoolRegionList[i].id;
                        break;
                    }
                }                     
                
                let saveParam = {
                    'regionId': regionId,
                    'mapPoint': JSON.stringify(mapPoint)
                }

                saveSchoolRegionMapPoint(saveParam).then(res => {
                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        that.dialog.loading = false;
                        this.$message({ message: errorInfo, type: 'error'});
                    } else {
                        that.$message({ message: '保存成功', type: 'success', duration: '2000' });
                        
                        that.dialog.show = false;
                        that.areaList = mapAllData;

                        setTimeout(function() {
                            // that.drawArea(that.dialog.index, that.areaList[that.dialog.index]);
                            that.drawMap();
                        }, 300);
                    }
                })
            },
            /**
             * [handleAddDecorateArea 添加装饰区域]
             * @return {[type]} [description]
             */
            // handleAddDecorateArea: function() {
            //     this.areaList.push({
            //         id: '',
            //         name: '装饰性区域',
            //         center: {},
            //         point: [],
            //         color: ''        
            //     })
            // },
            /**
             * [handleDeleteDecorateArea 删除装饰区域]
             * @param  {[type]} index [description]
             * @param  {[type]} item  [description]
             * @return {[type]}       [description]
             */
            // handleDeleteDecorateArea: function(index, item) {
            //     this.areaList.splice(index, 1);
                
            //     for(let i = 0; i < this.areaList.length; i++) {
            //         this.drawArea(i, this.areaList[i]);
            //     }

            //     this.drawMap();
            // },
            // 上传图片 
            uploadBeforeList(file) {
                if(!/image\/\w+/.test(file.type)) {
                    this.$message({ message: '图片格式不正确！请重试！', type: 'error'});
                    return false;
                }
            },
            uploadErrorList(response, file, fileList) {
                this.dialog.thumbList = [];
                this.$message({ message: '图片上传失败，请重试！', type: 'error'});
            },
            uploadSuccList(response, file, fileList) {
                if(fileList.length > 1) {
                    fileList.shift();
                }
                this.dialog.thumbList = fileList;
                this.$message({ message: '上传成功', type: 'success'});
                this.mapurl = response.data.mapUrl;
            },
            uploadRemoveList(file, fileList) {
                this.dialog.thumbList = fileList;
            },
        },
        mounted() {
            this.getAreaList();
        }
    }
</script>

<style lang="scss">
    .dialog-canvas{
        .el-dialog--small{
            width: auto !important;
        }
    }

    .input-color{
        width: 90px;       
        input{
            height: 32px;
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
            border-radius: 2px;
            padding: 0 10px; 
        }
    }
</style>

<style lang="scss" scoped>
    .map-wrapper{
        margin-top: 30px;
    }

    .map-info{
        .info-item{

            & ~ .info-item {
                margin-left: 20px;
            }

            .title{
                font-size: 12px;
                margin-bottom: 20px;

                &::before{
                    color: #3FCB9A;
                    margin-right: 5px;
                }
            }

            .thumb-box{
                position: relative;
                height: 0;
                padding-top: 60%;

                .thumb{
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }

            .canvas-box{
                position: relative;
                height: 0;
                padding-top: 60%;

                canvas{
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }                
            }
        }
    }

    .area-list{
        margin-top: 30px;
        user-select: none;

        .list-item{
            float: left;
            width: 48%;
            margin-bottom: 20px;
            border: 1px solid #eee;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;

            &:nth-of-type(2n + 2) {
                margin-left: 4%;
            }

            .item-header{
                padding: 10px 20px;
                background: rgba(0, 0, 0, .02);

                .name{
                    font-size: 12px;
                    /*font-weight: bolder;*/
                    line-height: 30px;
                    width: 50%;

                    &::before{
                        margin-right: 5px;
                        color: #3FCB9A;
                    }
                }

                .btn{
                    height: 30px;
                    padding: 0 15px;
                    line-height: 30px;
                    text-align: center;
                    background: #3FCB9A;
                    color: #FFF;
                    border-radius: 2px;
                    margin-left: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    overflow: hidden;

                    &::before{
                        font-size: 12px;
                        margin-right: 5px;
                    }

                    &:hover{
                        opacity: .8;
                    }
                }                
            }

            .item-body{
                position: relative;
                height: 200px;
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
                    line-height: 200px;
                }
            }

            &.add-more{
                position: relative;
                height: 250px;
                border: 1px dashed #999;

                .btn-add{
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    height: 30px;
                    padding: 0 15px;
                    line-height: 30px;
                    text-align: center;
                    background: #3FCB9A;
                    color: #FFF;
                    border-radius: 2px;
                    font-size: 12px;
                    cursor: pointer;
                    overflow: hidden;
                    -webkit-transform: translate3d(-50%, -50%, 0);
                            transform: translate3d(-50%, -50%, 0);

                    &::before{
                        font-size: 12px;
                        margin-right: 5px;
                    }

                    &:hover{
                        opacity: .8;
                    }                    
                }
            }
        }
    }

    .form-section{
        margin-bottom: 20px;

        .title{
            font-size: 12px;
            color: #666;
            line-height: 32px;
        }

        .input-wrap{
            input{
                width: 80px;
                height: 32px;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 2px;
                padding: 0 10px;

                &:hover{
                    border-color: #83a5a2;
                }

                &:focus{
                    outline: 0;
                    border-color: #18c79c;
                }
            }
        }

        .tips{
            font-size: 12px;
            margin-left: 10px;
            line-height: 32px;
            color: #999;

            &::before{
                margin-right: 3px;
            }
        }

        .btn{
            float: left;
            height: 30px;
            padding: 0 15px;
            line-height: 30px;
            text-align: center;
            background: #3FCB9A;
            color: #FFF;
            border-radius: 2px;
            margin-left: 20px;
            font-size: 12px;
            cursor: pointer;
            overflow: hidden;

            &::before{
                font-size: 12px;
                margin-right: 5px;
            }

            &:hover{
                opacity: .8;
            }
        }         

        .canvas-box{
            position: relative;
            width: 1000px;
            height: 600px;
            background: #FFF;

            &:hover{
                cursor: default;
            }

            img{
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                width: 1000px;
                height: 600px;
            }

            canvas{
                position: absolute;
                z-index: 3;
                top: 0;
                left: 0;
                width: 1000px;
                height: 600px;                
            }
        }
    }

    .upload-wrapper {
        margin-top: 30px;

        .list-item{
            width: 40%;
            margin-bottom: 20px;
            border: 1px solid #eee;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            
            &.add-more{
                position: relative;
                height: 250px;
                border: 1px dashed #999;

                .btn-add{
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    height: 30px;
                    padding: 0 15px;
                    line-height: 30px;
                    text-align: center;
                    background: #3FCB9A;
                    color: #FFF;
                    border-radius: 2px;
                    font-size: 12px;
                    cursor: pointer;
                    overflow: hidden;
                    -webkit-transform: translate3d(-50%, -50%, 0);
                            transform: translate3d(-50%, -50%, 0);

                    &::before{
                        font-size: 12px;
                        margin-right: 5px;
                    }

                    &:hover{
                        opacity: .8;
                    }  
                }
            }
        }
    }
    
    .absolute-upload-wrap {
        position: absolute;
        left: 200px;
        top: -6px;
        z-index: 1;

        .reloadUpload {
            font-size: 12px;
            height: 30px;
            line-height: 30px;
        }
    }
</style>

