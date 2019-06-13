var vueBaseDetail = {
    mixins: [vueCommon],
    data() {
        return {
            formItem: {},
            lang: {},

            url: {
                //initPage: baseUrl + `/InitDetail`,
                get: baseUrl + `/GetDetail`
            },

            childModal: false,
            childUrl: "",
            childTitle: "",

            loading: false,

            keyWord: {
                keyField: "",
                keyName: ""
            },

            keyValue: null
        };
    },
    watch: {

    },
    mounted() {

        debugger;
        //this.initPage();
        this.keyValue = this.getUrlParam("id");
        if (this.keyValue !== null) {
            this.get();
        }
        else {
            window.parent.vObject.$Message.error({
                title: "错误",
                content: "无相关数据"
            });
            window.parent.vObject.childModal = false;
        }

    },
    methods: {
        cancel() {
            window.parent.vObject.childModal = false;
        },
        get() {

            let that = this;

            get(that, that.url.get, { id: that.keyValue }, that.keyWord.keyName, "页面加载", function (data) {
                that.formItem = data;
            });

        }
    }
}; 