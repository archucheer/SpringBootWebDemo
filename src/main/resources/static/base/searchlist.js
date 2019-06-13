var vueSearchList = {
    mixins: [vueBaseList],
    data() {
        return {
            searchItem: [],
            searchParams: {},
            lang: {},

            deleteList: [],
            loading: false,

            keyWord: {
                keyField: "",
                keyName: ""
            },

            //baseUrl: "",
            url: {
                create: baseUrl + `/Form`,
                update: baseUrl + `/Form`,
                detail: baseUrl + `/Detail`,
                delete: baseUrl + `/Delete`,
                deletes: baseUrl + `/Deletes`,
                getList: baseUrl + `/GetList`,
                getUserDevice: '/device/getUserDevice'
                //initPage: baseUrl + `/InitList`,
            },

            total: 0,
            successCount: 0,
            failedCount: 0,
            peopleCount: 0,
            pageIndex: 1,
            pageSize: 10,
            pageSizeOpt: [10, 20, 30, 50, 100],
            selectitems: [],

            childModal: false,
            childUrl: "",
            childTitle: "",

            columnData: [],
            listData: [],
            deviceGroup:[]
        };
    },
    watch: {

    },
    mounted() {

    },
    methods: {
        pageIndexChange: function (index) {
            this.pageIndex = index;
            //this.$Message.success('pageIndex ' + this.pageIndex);
            //this.$Message.success('pageSize ' + this.pageSize);
            this.rowband();
        },
        pageSizeChange: function (size) {
            this.pageSize = size;
            //this.$Message.success('pageIndex ' + this.pageIndex);
            //this.$Message.success('pageSize ' + this.pageSize);
            this.rowband();
        },
        onSelectionChange: function (selection) {
            this.selectitems = selection;
            //for (var i = 0; i < selection.length; i++) {
            //    this.$Message.success('selection ' + selection[i]["name"]);
            //}
        },
        //仅更新数据,总数不变,供分页使用
        rowband: function () {
            this.loading = true;
            let that = this;

            if (that.pageIndex === undefined) {
                that.pageIndex = 1;
            }
            //that.pageIndex = 1;

            //this.$Message.success('pageIndex ' + that.pageIndex);
            //this.$Message.success('pageSize ' + that.pageSize);

            that.selectitems = [];
            that.setSearchParams();
            that.post(that.url.getList, that.searchParams,
                that.keyWord.keyName,
                "加载",
                function (data) {
                    that.listData = data.rows;
                });
        },
        //获取用户绑定的设备号(Cookie获取Id)
        getUserBandDevice() {

            this.loading = true;
            let that = this;

            that.selectitems = [];
            that.post(that.url.getUserDevice, {},
                that.keyWord.keyName,
                "加载",
                function (data) {
                    console.log("device from cookie");
                    //console.log("userDevice", data.device);
                    //console.log("处理data");
                    var newDevice = that.dealDevice(data.device);
                    console.log("新设备",newDevice);
                    //console.log(JSON.stringify(newDevice));
                    that.bandDeviceList = data.device;
                    that.deviceGroup = newDevice;
                    // 设置绑定设备第一个为默认值
                    // that.searchParams.deviceCode = that.bandDeviceList[0].value;
                });

        },
        //处理后台数据,按照站点分组
        dealDevice(arr) {
            var map = {},
                dest = [];
            for (var i = 0; i < arr.length; i++) {
                var ai = arr[i];
                if (!map[ai.business]) {
                    dest.push({
                        busiName: ai.business,
                        indeterminate: false,
                        checkAll: false,
                        checkAllGroup: [],
                        deviceCode: [ai]
                    });
                    map[ai.business] = ai;
                } else {
                    for (var j = 0; j < dest.length; j++) {
                        var dj = dest[j];
                        if (dj.busiName == ai.business) {
                            dj.deviceCode.push(ai);
                            break;
                        }
                    }
                }
            }
            return dest;
        },
        //获取用户绑定的设备号
        getUserBandDevice2() {

            this.loading = true;
            let that = this;

            that.selectitems = [];
            that.post(that.url.getDevice, { userId: that.userId },
                that.keyWord.keyName,
                "加载",
                function (data) {
                    console.log(data);
                    that.bandDeviceList = data.device;
                    // 设置绑定设备第一个为默认值
                    // that.searchParams.deviceCode = that.bandDeviceList[0].value;
                });

        },
        //同时绑定总数和内容,仅在更改查询条件后使用
        databand: function () {

            this.loading = true;
            let that = this;
            that.deleteList = [];

            if (that.pageIndex === undefined) {
                that.pageIndex = 1;
            }

            //this.$Message.success('pageIndex ' + that.pageIndex);
            //this.$Message.success('pageSize ' + that.pageSize);

            that.selectitems = [];
            that.setSearchParams();
            that.post(that.url.getList, that.searchParams,
                that.keyWord.keyName,
                "加载",
                function (data) {
                    that.listData = data.rows;
                    console.log("row", data);
                    //that.total = data.total;
                    if (data.mapId != null) {
                        that.mapId = data.mapId;
                        console.log("mapId:" + that.mapId);
                    }
                });
            that.post(that.url.getCount, that.searchParams,
                that.keyWord.keyName, "加载",
                function (data) {
                    console.log("count", data);
                    that.total = data.total;
                    if (data.countBO != null) {
                        that.successCount = data.countBO.successCount;
                        that.failedCount = data.countBO.failedCount;
                        that.peopleCount = data.countBO.peopleCount;
                    }

                });
        },
        selectAll() {
            console.log("全选");
            this.checkAllGroup = []; //置空
            for (busi in this.deviceGroup) {
                var business = this.deviceGroup[busi];
                business.checkAllGroup = []; //置空
                console.log("busi", business);
                console.log("busi_code", business.deviceCode);
                for (device in business.deviceCode) {
                    var deviceCode = business.deviceCode[device].value;
                    business.checkAllGroup.push(deviceCode);
                    this.checkAllGroup.push(deviceCode);
                }
                console.log("busi_code_after", business.deviceCode);
                this.checkAllGroupChange(business);
            }
            console.log("select", this.checkAllGroup);
        },
        reverceSelect() {
            //debugger;
            console.log("反选");
            //console.log("before_all", this.checkAllGroup); //原来已经选择的值
            var newGroup = [];
            var all = this.checkAllGroup;
            for (busi in this.deviceGroup) {
                var business = this.deviceGroup[busi];
                business.checkAllGroup = [];
                for (device in business.deviceCode) {
                    var code = business.deviceCode[device].value;
                    if (this.contains(all, code)) {
                        //continue;
                    } else {
                        newGroup.push(code);
                        business.checkAllGroup.push(code);
                    }
                }
                this.checkAllGroupChange(business);
                //business.checkAllGroup = [];
            }
            //console.log("after_new", newGroup);
            this.checkAllGroup = [];
            this.checkAllGroup = newGroup;
            //console.log("select", this.checkAllGroup);
            for (busi in this.deviceGroup) {
                var business = this.deviceGroup[busi];
                //console.log("business", business);
                //this.checkAllGroupChange(business);
            }
        },
        closeDeviceModal() {
            this.deviceModal = false;
            console.log("关闭设备选择窗口");
        },
        //点击全选按钮
        handleCheckAll(busi) {
            //console.log('handle_busi', busi);
            if (busi.indeterminate) {
                busi.checkAll = false;
            } else {
                busi.checkAll = !busi.checkAll;
            }
            busi.indeterminate = false;

            if (busi.checkAll) {
                // 返回value
                busi.checkAllGroup = busi.deviceCode.map((item) => {
                    return item.value;
                });
            } else {
                busi.checkAllGroup = [];
            }
            this.linkTo();
        },
        //已选设备
        checkAllGroupChange(busi) {
            //console.log('busi', busi);
            if (busi.checkAllGroup.length === busi.deviceCode.length) {
                busi.indeterminate = false;
                busi.checkAll = true;
            } else if (busi.checkAllGroup.length > 0) {
                busi.indeterminate = true;
                busi.checkAll = false;
            } else {
                busi.indeterminate = false;
                busi.checkAll = false;
            }
            this.linkTo();
            console.log("select", this.checkAllGroup);
        },
        //赋值
        linkTo() {
            this.checkAllGroup = [];
            for (i = 0; i < this.deviceGroup.length; i++) {
                var business = this.deviceGroup[i];
                var all = this.checkAllGroup;
                for (device in business.checkAllGroup) {
                    this.checkAllGroup.push(business.checkAllGroup[device]);
                }
            }
            //this.searchParams.deviceCode = 
        },
        //是否包含
        contains(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        }
    }


};