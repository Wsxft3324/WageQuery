var testInter;
var testInter2 = false;
const Index = {
    template: '<div class="sys-cc"><div class="loading" v-if="loading"></div><div v-if="error" class="error"></div><div v-if="post" id="poco"></div></div>',
    data: function () {
        return {
            loading: false,
            error: null,
            post: null
        }
    },
    created: function () {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function () {
            this.error = this.post = null;
            if (typeof (this.$route.params.Controller) == "undefined" || this.$route.params.Controller == "Home") {
                $("#publicity-info").css("display", "inline-block").css("height", "inherit");
                $("#email-info").css("display", "inline-block");
                var ph = document.getElementById("publicity-info").offsetHeight;
                var eh = document.getElementById("email-info").offsetHeight;
                if (ph > eh) {
                    $("#email-info").css("height", ph + "px");
                } else {
                    $("#publicity-info").css("height", eh + "px");
                }
            }
            else {
                layer.msg('加载中', {
                    icon: 16, shade: 0.01
                });
                $("#publicity-info").css("display", "none");
                $("#email-info").css("display", "none");
                $.post("/" + this.$route.params.Controller + "/" + this.$route.params.Action, (data) => {
                    layer.closeAll();
                    if (data.indexOf("loginport") > 0 || data.indexOf("ycu") > 0) {
                        window.location.href = "/login";
                    }
                    else {
                        this.loading = false;
                        this.post = true;
                        testInter = setInterval(function () { testinter(data) }, 10);
                    }
                });
            }           
        },
        //back: function () {
        //    router.go(-1);
        //}
    }
}
var NotFoundComponent = {
    template: '<div>你猜</div>'
};

var router = new VueRouter({
    routes: [
        { path: '/Home/Index', redirect: '/' },
        { name: 'history', path: '/:Controller/:Action', component: Index },
    ],
    mode: 'history',
})

const app = new Vue({
    router
    }).$mount('#app');
const app_desk = new Vue({
    router
    }).$mount('#app-desk');
function testinter(data) {
    if (testInter2 === true) {
        testInter2 = false;
        clearInterval(testInter);
    }
    else {
        if (document.getElementById("poco") !== null) {
            document.getElementById("poco").innerHTML = data;
            $("#poco").ready(function () {
                $("#poco").find(".currentFS").remove();
                var currentSS = $("#poco").find(".currentSS").html();
                var head = document.getElementsByTagName('head')[0];
                var cscript = document.createElement('script');
                cscript.type = 'text/javascript';
                cscript.innerHTML = currentSS;
                head.appendChild(cscript);
                $("#poco").find(".currentSS").remove();
            });
            testInter2 = true;
        }
    }
};
function messagePro(data) {
    if (data.Statu === "ok") {
        layer.msg(data.Msg);
        setTimeout(function () {
            location.reload();
            //layer.msg(router.path);
        }, 800);
    } else {
        layer.msg(data.Msg, function () { });
    }
};
var oh = $.cookie("oh").split("/");
if (oh.length > 0)
    document.getElementById(oh[3] + oh[4]).click();
$.cookie("oh", "");

function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }
    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}
function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}
function addNum(num1, num2) {
    var sq1, sq2, m;
    try {
        sq1 = num1.toString().split(".")[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split(".")[1].length;
    } catch (e) {
        sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
}
function ChangeDateFormat(jsondate) {

    if (jsondate == null || jsondate == '') {
        return;
    }

    jsondate = jsondate.replace("/Date(", "").replace(")/", "");
    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    }
    else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }

    var date = new Date(parseInt(jsondate, 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    var hours = date.getHours();
    var minu = date.getMinutes();

    if (hours < 10)
    { hours = "0" + hours }

    if (minu < 10)
    { minu = "0" + minu }

    return date.getFullYear()
            + "年"
            + month
            + "月"
            + currentDate
            + "日"
            + " "
            + hours
            + ":"
            + minu;
}

$(function () {
    jQuery.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写手机号码");
    jQuery.validator.addMethod("isIdCardNo", function (value, element) {
        return this.optional(element) || isIdCardNo(value);
    }, "请正确输入身份证号码");
});

