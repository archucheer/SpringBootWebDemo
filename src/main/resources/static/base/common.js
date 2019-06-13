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

function formatDate(value, fmt, span) {
    if (value === null || value === undefined) return null;
    if (span === null || span === undefined) span = 0;

    if(isNaN(value)){
        value = value.replace("T", " ").replace("Z", "");
    }


    let getDate = new Date(new Date(value).getTime() - span * 60 * 60 * 1000);
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
}
function treeNodeDisabled(treeItems) {
    for (var i = 0; i < treeItems.length; i++) {
        if (treeItems[i].children.length > 0) {
            treeItems[i].disabled = true;
            treeNodeDisabled(treeItems[i].children);
        }
    }
    return treeItems;
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
        formatDate(value, fmt, span) {
            if (value === null || value === undefined) return null;
            if (span === null || span === undefined) span = 0;

            if(isNaN(value)){
                value = value.replace("T", " ").replace("Z", "");
            }


            let getDate = new Date(new Date(value).getTime() - span * 60 * 60 * 1000);
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

        },
        _post(url, paramsData, keyName, operateName, callBackAction) {

            let that = this;
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

            }).catch(function (error) {
                //console.log(error);
                window.parent.vObject.$Message.error(keyName + operateName + `异常:` + error.message);
            });

        },
        _get(url, paramsData, keyName, operateName, callBackAction) {

            let that = this;

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

            }).catch(function (error) {
                //console.log(error);
                window.parent.vObject.$Message.error(keyName + operateName + "异常：" + error.message);
            });

        }
    }
};


