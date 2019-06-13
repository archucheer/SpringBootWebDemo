var selectColumn = {
    type: 'selection',
    width: 55,
    align: 'center',
    fixed: 'left'
};

var actionColumn = {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center',
    fixed: 'right',
    render: (h, params) => {
        return h('div', vObject.getLineAction(h, vObject, params));
    }
};

var lineButton = [];

var lineDropdownButton = [];


var btnUpdate = {
    text: "修改",
    type: "primary",
    name: "update",
    action: function (that, row) {  // vObject-vue对象，row-行数据
        that.childModal = true;
        that.childUrl = that.url.update + "/?id=" + row[that.keyWord.keyField];
        that.childTitle = that.keyWord.keyName + " 修改";
    }
};
var btnDetail = {
    text: "详情",
    type: "",
    name: "detail",
    action: function (that, row) {  // vObject-vue对象，row-行数据
        that.childModal = true;
        that.childUrl = that.url.detail + "/?id=" + row[that.keyWord.keyField];
        that.childTitle = that.keyWord.keyName + " 详情";
    }
};
var btnDelete = {
    text: "删除",
    type: "error",
    name: "delete",
    action: function (that, row) {  // vObject-vue对象，row-行数据

        that.$Modal.confirm({
            title: '告警',
            content: `确认要删除该信息吗？`,
            onOk: function () {

                that.get(that.url.delete, { id: row.user_id }, that.keyWord.keyName, "删除", function (data) {

                    that.$Message.success(that.keyWord.keyName + "删除" + "成功");
                    that.databand();

                });

            }
        });

    }
};

function wdButton(tag, name, url, returnCallBack) {
    //let params_ = params;
    return {
        text: tag,
        name: name,
        action: function (that, row) {  // vObject-vue对象，row-行数据

            if (returnCallBack === undefined || returnCallBack === null) {
                that.childUrl = url + "/?id=" + row[that.keyWord.keyField];
            }
            else {
                that.childUrl = returnCallBack(that, row);
            }

            that.childModal = true;
            that.childTitle = that.keyWord.keyName + " " + tag;

        }
    };
}

function opButton(tag, name, callBack) {
    return {
        text: tag,
        name: name,
        action: function (that, row) {  // vObject-vue对象，row-行数据

            callBack(that, row);

        }
    };
}

var vueBaseList = {
    mixins: [vueCommon],
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
        handleSelectAll(status) {
            this.$refs.selection.selectAll(status);
        },
        create: function () {
            this.childModal = true;
            this.childUrl = this.url.create;
            this.childTitle = "新增" + this.keyWord.keyName;
        },
        deletes: function () {

            let that = this;

            if (that.selectitems.length === 0) {
                that.$Message.warning(`请选择要删除的` + that.keyWord.keyName + `信息`);
                return;
            }

            var keys = "";
            for (var i = 0; i < that.selectitems.length; i++) {
                if (keys.length > 0) keys += ",";
                keys += that.selectitems[i][that.keyWord.keyField];
            }

            that.$Modal.confirm({
                title: `告警 批量删除`,
                content: `确认要删除选中的` + that.keyWord.keyName + `信息吗？`,
                onOk: function () {

                    that.get(that.url.deletes, { ids: keys }, that.keyWord.keyName, "删除", function (data) {

                        that.$Message.success(that.keyWord.keyName + `信息删除成功`);
                        that.databand();

                    });

                }
            });

        },
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
                    //that.total = data.total;
                });
            that.post(that.url.getCount, that.searchParams,
                that.keyWord.keyName, "加载",
                function (data) {
                    that.total = data.total;
                });


        },
        setSearchParams() {
            this.searchParams = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
        },
        getLineAction(h, that, params) {

            let buttons = new Array();

            for (var bi = 0; bi < lineButton.length; bi++) {

                let bi_index = bi;

                buttons.push(
                    h('Button', {
                        props: {
                            type: lineButton[bi_index].type,
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {

                                lineButton[bi_index].action(that, params.row);

                            }
                        }
                    }, lineButton[bi_index].text)
                );
            }

            if (lineDropdownButton.length > 0) {

                var dropdownButtons = [];

                for (var di = 0; di < lineDropdownButton.length; di++) {

                    dropdownButtons.push(
                        h('DropdownItem', {
                            props: {
                                name: lineDropdownButton[di].name
                            }
                        }, lineDropdownButton[di].text)
                    );
                }

                var dropdown = h('Dropdown', {
                    props: {
                        placement: 'bottom',
                    },
                    on: {
                        'on-click': (name) => {
                            // 事件处理
                            for (var index = 0; index < lineDropdownButton.length; index++) {
                                if (name === lineDropdownButton[index].name) {
                                    lineDropdownButton[index].action(that, params.row);
                                }
                            }

                        }
                    }
                },
                    [
                        h('Button', {
                            props: {
                                type: 'success',
                                placement: "top-end"
                            }
                        }, [
                                h('span', '更多'),
                                h('Icon', {
                                    props: {
                                        type: 'arrow-down-b'
                                    },
                                    style: {
                                        marginLeft: '5px'
                                    }
                                })
                            ]),
                        h('DropdownMenu', {
                            slot: 'list'
                        }, dropdownButtons)
                    ]);

                buttons.push(dropdown);

                return buttons;
            }
        }
    }
};



