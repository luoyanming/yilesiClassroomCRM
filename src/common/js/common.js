export const COMMON = {
    checkNull: function(value) {
        if (value == '' || value == undefined || value == null) {
            return false;
        } else {
            return true;
        }
    },
    checkMobile: function(mobile) {
        var re = /^1\d{10}$/;
        if (re.test(mobile)) {
            return true;
        } else {
            return false;
        }
    },
    checkIDCards: function(idcards) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(idcards) === false) {
            return false;
        } else {
            return true;
        }
    },
    checkNumber: function(number) {
        var reg = /^\+?[0-9][0-9]*$/;
        if (reg.test(number) === false) {
            return false;
        } else {
            return true;
        }
    },
    formatDate: function(time, concat) {
        let formatdate = new Date(time),
            year = formatdate.getFullYear(),
            month = formatdate.getMonth(),
            date = formatdate.getDate();

        if (month + 1 < 10) {
            month = '0' + (month + 1);
        } else {
            month = month + 1;
        }
        if (date < 10) {
            date = '0' + date;
        }

        return year + concat + month + concat + date;
    },
    formatMonth: function(time) {
        let formatdate = new Date(time),
            year = formatdate.getFullYear(),
            month = formatdate.getMonth();

        if (month + 1 < 10) {
            month = '0' + (month + 1);
        } else {
            month = month + 1;
        }

        return year + '-' + month;
    },
    formatMonthDay: function(time, concat) {
        let formatdate = new Date(time),
            month = formatdate.getMonth(),
            date = formatdate.getDate();

        if (month + 1 < 10) {
            month = '0' + (month + 1);
        } else {
            month = month + 1;
        }
        if (date < 10) {
            date = '0' + date;
        }

        return month + concat + date;
    },
    formatTime: function(time) {
        let formatdate = new Date(time),
            h = formatdate.getHours(),
            m = formatdate.getMinutes();

        if(h < 10) {
            h = '0' + h;
        }
        if(m < 10) {
            m = '0' + m;
        }        

        return h + ':' + m;
    },
    formatTimeUTC: function(time) {
        return new Date(new Date((new Date().setHours(time.substring(0, 2)))).setMinutes(time.substring(3, 5)));
    },
    // 设置当前日期
    newToday : function(_today){
        _today = new Date(_today);
        this.today=_today;
        this.year=_today.getYear()+1900;//当前年份
        this.Month_a=_today.getMonth();
        this.Month=this.Month_a+1;//当前月份
        this.day=_today.getDate();//当前日期
        this.date=_today.getDay()==0?7:_today.getDay();//本周第几天 因系统会把周日作为第0天
        this.Monday="";
        this.Sunday="";
        this.day_one="";
    },
    // 获取当前日子所在周的周一
    getMonday: function(_today) {
        COMMON.newToday(_today);

        if(this.Monday.length!=0){
            return this.Monday;
        }else{
            var _monday = new Date(this.year,this.Month_a,this.day-this.date+1);
            this.Monday = _monday;
            return _monday.pattern("yyyy-MM-dd");
        }
    },
    // 获取当前日子所在周的周日
    getSunday: function(_today) {
        COMMON.newToday(_today);

        if(this.Sunday.length!=0){
            return this.Sunday;
        }else{
            var _Sunday = new Date(this.year,this.Month_a,this.day-this.date+7);
            this.Sunday = _Sunday;
            return _Sunday.pattern("yyyy-MM-dd");
        }
    },
    getPreviousMonday:function(Monday){
        Monday = new Date(Monday);
        var _monday = new Date(Monday.getYear()+1900,Monday.getMonth(),Monday.getDate()-7);
        return _monday.pattern("yyyy-MM-dd");
    },
    getPreviousSunday:function(Monday){
        Monday = new Date(Monday);
        var _Sunday = new Date(Monday.getYear()+1900,Monday.getMonth(),Monday.getDate()-1);
        this.Sunday = _Sunday;
        return _Sunday.pattern("yyyy-MM-dd");
    }      
};

Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

export default { COMMON };