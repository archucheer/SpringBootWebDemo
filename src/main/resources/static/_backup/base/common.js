var baseUrl = "";

var Lang = {};


function get(that, url, paramsData, keyName, operateName, callBackAction) {

    //let that = vObject;

    that.loading = true;
    axios.get(url, {
        params: paramsData
    }
    ).then(function (response) {

        if (response.data.result === "1") {
            if (callBackAction === null || callBackAction === undefined) {
                that.$Message.success(keyName + operateName + "成功");
            }
            else {
                callBackAction(response.data.data);
            }
        }
        else {
            that.$Message.error(keyName + operateName + "失败：" + response.data.msg);
        }

        that.loading = false;

    }).catch(function (error) {
        //console.log(error);
        window.parent.vObject.$Message.error(keyName + operateName + "异常：" + error.message);
        that.loading = false;
    });

}

var vueCommon = {
    data() {
        return {

        };
    },
    watch: {

    },
    mounted() {

    },
    methods: {
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r !== null) return unescape(r[2]); return null;
        },
        formatDate(value, fmt) {
            let getDate = new Date(value);
            let o = {
                'M+': getDate.getMonth() + 1,
                'd+': getDate.getDate(),
                'h+': getDate.getHours(),
                'm+': getDate.getMinutes(),
                's+': getDate.getSeconds(),
                'q+': Math.floor((getDate.getMonth() + 3) / 3),
                'S': getDate.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        },
        post(url, paramsData, keyName, operateName, callBackAction) {

            let that = this;
            that.loading = true;
            axios.post(
                url,
                paramsData
            ).then(function (response) {

                if (response.data.result === "1") {
                    if (callBackAction === null || callBackAction === undefined) {
                        that.$Message.success(keyName + operateName + "成功");
                    }
                    else {
                        callBackAction(response.data.data);
                    }
                }
                else {
                    that.$Message.error(keyName + operateName + `失败:` + response.data.msg);
                }

                that.loading = false;

            }).catch(function (error) {
                //console.log(error);
                window.parent.vObject.$Message.error(keyName + operateName + `异常:` + error.message);
                that.loading = false;
            });

        },
        get(url, paramsData, keyName, operateName, callBackAction) {

            let that = this;

            that.loading = true;
            axios.get(url, {
                params: paramsData
            }
            ).then(function (response) {

                if (response.data.result === "1") {
                    if (callBackAction === null || callBackAction === undefined) {
                        that.$Message.success(keyName + operateName + "成功");
                    }
                    else {
                        callBackAction(response.data.data);
                    }
                }
                else {
                    that.$Message.error(keyName + operateName + "失败：" + response.data.msg);
                }

                that.loading = false;

            }).catch(function (error) {
                //console.log(error);
                window.parent.vObject.$Message.error(keyName + operateName + "异常：" + error.message);
                that.loading = false;
            });

        }
    }
};


