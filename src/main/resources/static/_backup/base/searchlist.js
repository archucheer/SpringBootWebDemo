var vueSearchList = {
    mixins: [vueBaseList],
    data() {
        return {
            searchItem: [],
            searchParams: {},
            lang: {},

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
                getList: baseUrl + `/GetList`
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
            listData: []
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
        //获取用户绑定的设备号
        getUserBandDevice() {

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
                    console.log(data);
                    //that.total = data.total;
                });
            that.post(that.url.getCount, that.searchParams,
                that.keyWord.keyName, "加载",
                function (data) {
                    console.log(data);
                    that.total = data.total;
                    if (data.countBO != null) {
                        that.successCount = data.countBO.successCount;
                        that.failedCount = data.countBO.failedCount;
                        that.peopleCount = data.countBO.peopleCount;
                    }

                });


        },
    }


};