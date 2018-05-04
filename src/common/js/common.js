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
    }
};

export default { COMMON };