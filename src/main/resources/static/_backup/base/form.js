var vueBaseForm = {
    mixins: [vueCommon],
    data() {
        return {
            formItem: {},
            rules: initFormRule(),
            lang: {},

            url: {
                save: baseUrl + '/Save',
                get: baseUrl + '/Get'
                //initPage: baseUrl + `/InitForm`
            },
 
            childModal: false,
            childUrl: "",
            childTitle: "",

            loading: false,

            keyValue: "",

            keyWord: {
                keyField: "",
                keyName: ""
            }
        };
    },
    watch: {

    },
    mounted() {

        this.resetForm();
        this.keyValue = this.getUrlParam("id");
        if (this.keyValue !== null) {
            this.get();
        }

    },
    methods: {
        save() {

            let that = this;

            that.$refs["formItem"].validate((valid) => {
                if (valid) {

                    that.post(that.url.save, that.formItem,
                        that.keyWord.keyName,
                        "保存",
                        function (data) {
                            that.aftersuccess();
                        });

                    this.$Message.success('Success!');

                } else {

                    this.$Message.error('输入内容不符合要求!');
                }
            });

        },
        aftersuccess() {

            window.parent.vObject.$Message.success("保存成功");
            window.parent.vObject.childModal = false;
            this.resetForm();
            window.parent.vObject.databand();

        },
        reset() {

            if (this.keyValue === null) {
                this.resetForm();
            }
            else {
                this.get(this.keyValue);
            }

        },
        cancel() {
            window.parent.vObject.childModal = false;
        },
        resetForm() {

            this.$refs["formItem"].resetFields();
            //this.formItem = {
            //    user_id: "",
            //    user_name: "",
            //    user_fullname: "",
            //    user_age: 0,
            //    user_address: "",
            //    user_birthday: null,
            //    user_status: false
            //};

        },
        get() {

            let that = this;

            get(that, that.url.get, { id: that.keyValue }, that.keyWord.keyName, "页面加载", function (data) {
                that.formItem = data;
            });
          
        }
    }
}; 