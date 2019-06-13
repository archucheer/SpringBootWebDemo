Vue.component('e-map', {
  template: `<div ref="divMovePerson" style="width:550px;height:600px"></div>`,

  props: {
    title: {
      type: String,
      default: '中国地图'
    },
    mapOption: {
      type: Object,
      default: function () {
        return {
          isShowZero: false, // 是否显示 地图数值为0或空
          showPinTop: 0, // 雨滴图展示排名前几，0全部显示
          backgroundMapUrl: '/resources/chinese-map/map/china.json', // 背景地图数据源地址(json数据)
          mapPinDataUrl: '', //地图数据来源链接，pinData为空数组的情况下才会处理
          pinSymbol: 'pin', //自定譯圓點
          pinSymbolSize: 16,
          pinLabel: false,//圓點文字展示
          seriesSymbol: 'pin',
          seriesSymbolSize: 10,

          formatter: function (params) {
            if (params.data && params.data.value) {
              return '<p style="text-align:center;font-size:14px;line-height:20px;font-weight:bold;background-color:#0049a4;color:#eac248;margin:-4.5px -4.5px 0 -4.5px; padding:3px;">' + params.name + '</p><p style="background-color:rgba(0, 25, 88,0.7);padding:5px;">总数：' + params.data.value[2] + '<p>';
            }
          },
          mapName: 'mp_china',
          mapData: [],
          option: {},
          resData: {},

          zoom: 1,
          siwtchPin: false,

          geoCoordMap: [],
          seriesScatter: true, //展示散点气泡
          seriesMap: true, //展示地图配色
          seriesPin: true, //雨滴形气泡
          seriesEffectScatterp: false //展示涟漪特效动画
        };
      }
    },
    pinData: {
      type: Array,
      default: function () {
        return [
          //{ name: '新疆', value: [84.9023, 41.748, 113] },
          //{ name: '福建', value: [118.3008, 25.9277, 813] },
          //{ name: '测试位置3', value: [108.3008, 35.9277, 513] }
        ];
      }
    }
  },

  data() {
    return {
      //title: '福州铁路公安处动态人像布控预警系统',
      // 34个省、市、自治区的名字拼音映射数组
      provinces: {
        //23个省
        '台湾': 'taiwan',
        '河北': 'hebei',
        '山西': 'shanxi',
        '辽宁': 'liaoning',
        '吉林': 'jilin',
        '黑龙江': 'heilongjiang',
        '江苏': 'jiangsu',
        '浙江': 'zhejiang',
        '安徽': 'anhui',
        '福建': 'fujian',
        '江西': 'jiangxi',
        '山东': 'shandong',
        '河南': 'henan',
        '湖北': 'hubei',
        '湖南': 'hunan',
        '广东': 'guangdong',
        '海南': 'hainan',
        '四川': 'sichuan',
        '贵州': 'guizhou',
        '云南': 'yunnan',
        '陕西': 'shanxi1',
        '甘肃': 'gansu',
        '青海': 'qinghai',
        //5个自治区
        '新疆': 'xinjiang',
        '广西': 'guangxi',
        '内蒙古': 'neimenggu',
        '宁夏': 'ningxia',
        '西藏': 'xizang',
        //4个直辖市
        '北京': 'beijing',
        '天津': 'tianjin',
        '上海': 'shanghai',
        '重庆': 'chongqing',
        //2个特别行政区
        '香港': 'xianggang',
        '澳门': 'aomen'
      },

      // 直辖市和特别行政区-只有二级地图，没有三级地图
      special: ['北京', '天津', '上海', '重庆', '香港', '澳门'],
      mp_option: {
        echart: {},
        parentName: '', // 当前地图归属(切换地图用)
        isShowZero: this.mapOption.isShowZero === true ? true : false, // 数值为0或空是否显示
        showPinTop: this.mapOption.showPinTop || 0, // 雨滴图展示排名前几，0全部显示
        backgroundMapUrl: this.mapOption.backgroundMapUrl || '/resources/chinese-map/map/china.json', // 背景地图数据源地址(json数据)
        pinSymbol: this.mapOption.pinSymbol || 'pin',
        pinSymbolSize: this.mapOption.pinSymbolSize || 16,
        pinLabel: this.mapOption.pinLabel === true ? true : false,
        seriesSymbol: this.mapOption.seriesSymbol || 'pin',
        seriesSymbolSize: this.mapOption.seriesSymbolSize || 10,

        titleName: this.title || '中国地图',
        formatter: this.mapOption.formatter || function (params) {
          if (params.data && params.data.value) {
              return `<p style="text-align:center;font-size:15px;line-height:1.3;font-weight:bold;background-color:#002e9f;color:#ffc23e;margin:-4.5px -4.5px 0 -4.5px; padding:3px;">` + params.name + `</p>
                                    <p style="color:#b7cde2; padding:5px;">总数：`+ params.data.value[2] + `<p>`;
            }
        },
        mapName: this.mapOption.mapName || 'mp_china',
        mapData: this.mapOption.mapData || [],
        option: this.mapOption.option || {},
        resData: this.mapOption.resData || {},

        zoom: this.mapOption.zoom || 1,
        siwtchPin: this.mapOption.siwtchPin === true ? true : false,

        geoCoordMap: this.mapOption.geoCoordMap || [],
        seriesScatter: this.mapOption.seriesScatter === false ? false : true, //展示散点气泡
        seriesMap: this.mapOption.seriesMap === false ? false : true, //展示地图配色
        seriesPin: this.mapOption.seriesPin === false ? false : true, //雨滴形气泡
        seriesEffectScatterp: this.mapOption.seriesEffectScatterp === true ? true : false //展示涟漪特效动画
      },
      mp_data:this.pinData||[],
      //requestData: this.mapOption.requestData || {},
      loading: false
    };
  },
  mounted() {
    this.initECharts(this.mp_option, this.requestUrl, this.requestData);
  },
  methods: {
    // 地图配置 获取
    createOption(titleName, mapName, zoom) {
      return {
        //backgroundColor: '#06224E',
        title: {
          text: titleName,
          left: 'center',
          textStyle: {
            color: '#f2bc47',
            fontSize: 20,
            fontWeight: 'normal',
            fontFamily: 'Microsoft YaHei'
          }
        },
        geo: {
          map: mapName,
          roam: false, // 地图不允许拖动
          zoom: zoom, // 当前视角的缩放比例
          label: { // 省份文字
            normal: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 13
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 13
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#0052f1', //'rgba(147, 235, 248, 1)',
              borderWidth: 1,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {offset: 0, color: '#093092'}, // 0% 处的颜色'rgba(7, 40, 105, 0.2)'
                  {offset: 1, color: '#093092'} // 100% 处的颜色'rgba(7, 40, 105, 0.9)'
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: '#0052f1', //'rgba(7, 40, 105, 1)',
              // shadowColor: 'rgba(255, 255, 255, 1)',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 2
            },
            emphasis: {
              areaColor: '#093cbd',
              borderWidth: 0
            }
          }
        },

        // 提示框组件
        tooltip: {
          trigger: 'item',
            // triggerOn: 'click',
          enterable:true,
          formatter: this.mp_option.formatter,
            // function (params) {
            //     if (params.data && params.data.value) {
            //         return `<p style="text-align:center;font-size:15px;line-height:1.3;font-weight:bold;background-color:#002e9f;color:#ffc23e;margin:-4.5px -4.5px 0 -4.5px; padding:3px;">` + params.name + `</p>
            //                         <p style="color:#b7cde2; padding:5px;">总数：`+ params.data.value[2] + `<p>`;
            //     }
            // },
            backgroundColor: 'rgba(0, 25, 88, 0.9)',
            borderColor: '#154eda',
          borderWidth: 0.5,
          textStyle: {
            color: '#b7cde2',
            fontSize: 12
          }
        },
        // 工具栏
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          },
          iconStyle: {
            normal: {
              color: '#fff'
            }
          }
        },
        // 初始动画的时长
        animationDuration: 1000,
        // 初始动画的缓动效果
        animationEasing: 'cubicOut',
        // 数据更新动画的时长
        animationDurationUpdate: 1000
      };
    },

    // 加载地图数据
    getData(echartOption) {
      echartOption.mapData = [];
      if (this.mp_data && this.mp_data.length > 0) {
        this.mp_data.forEach((item) => {
          let name = item.name;
          let cp = item.value.slice(0, 2);
          echartOption.geoCoordMap[name] = cp;
          if (this.mp_option.isShowZero || item.value[item.value.length - 1] > 0) {
            echartOption.mapData.push(item);
          }
        });
      } else if (this.mapOption.mapPinDataUrl && this.mapOption.mapPinDataUrl !== '') {
        axios.post(this.mapOption.mapPinDataUrl, {}).then((res) => {
          if (res.data.result === '1') {
            for (let i = 0; i < echartOption.resData.features.length; i++) {
              let name = echartOption.resData.features[i].properties.name;
              let code = echartOption.resData.features[i].properties.area;
              let cp = echartOption.resData.features[i].properties.cp;
              echartOption.geoCoordMap[name] = cp;
              let counts = [];
              if (res.data.data[code] === undefined) {
                counts.push(0);
              }
              else {
                counts.push(res.data.data[code]);
              }
              if (this.mp_option.isShowZero || counts[counts.length - 1] > 0) {
                echartOption.mapData.push({name: name, value: cp.concat(counts)});
              }
            }
            //绘制地图
            // this.renderMap(echartOption);
          }
        });

      } else {

      }
    },

    // 地图绘制
    initECharts(echartOption, url, params) {
      echartOption.echart = echarts.init(this.$refs.divMovePerson);
      echartOption.option = this.createOption(echartOption.titleName, echartOption.mapName, echartOption.zoom);

      this.$nextTick(function () {
        //绘制全国地图(此json版本省份不偏移)
        axios.get(this.mp_option.backgroundMapUrl, {}).then((res) => {
          echartOption.resData = res.data;
          //注册地图
          echarts.registerMap(echartOption.mapName, echartOption.resData);
          setTimeout(() => {
            this.getData(echartOption);
            this.renderMap(echartOption);
          }, 100);//props部分数据是请求后台再传递，不希望多开watch，故这样

        });
      });
    },

    // 地图描点
    renderMap(echartOption) {
      let mapName = echartOption.mapName;
      let title = echartOption.mapTitle;
      let data = echartOption.mapData;
      let zoom = echartOption.zoom;

      //let max = 480,
      //    min = 9; // todo
      //let maxSize4Pin = 100,
      //    minSize4Pin = 20;

      echartOption.option.geo.map = mapName;
      echartOption.option.series = [];
      if (echartOption.seriesScatter) {
        echartOption.option.series.push({
          name: title,
          type: 'scatter', //散点（气泡）图
          coordinateSystem: 'geo',
          zoom: zoom, // 当前视角的缩放比例
          data: data,
          symbol: this.mp_option.seriesSymbol, //气泡
          symbolSize: this.mp_option.seriesSymbolSize,
          // function (val) { // 散点宽度
          //   return 10;
          // },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              textStyle: {color: '#fff'},
              show: this.mp_option.pinLabel
            },
            emphasis: {show: true}
          },
          itemStyle: {
            normal: {color: '#ee5b5e'}// #05C3FF
          }
        });
      }
      //色彩地图
      if (echartOption.seriesMap) {
        echartOption.option.series.push({
          type: 'map',
          map: mapName,
          geoIndex: 0,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          label: {
            normal: {show: false},
            emphasis: {
              show: false,
              textStyle: {color: '#fff'}
            }
          },
          roam: false,
          zoom: zoom, // 当前视角的缩放比例
          itemStyle: {
            emphasis: {
              areaColor: '#093cbd' //'#389BB7'
            },
            normal: {
              borderColor: '#0052f1',
              borderWidth: 1,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {offset: 0, color: '#093092'}, // 0% 处的颜色'rgba(9, 61, 146, 1)'
                  {offset: 1, color: '#093092'} // 100% 处的颜色'rgba(9, 61, 146, 1)'
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: '#0052f1', //'rgba(7, 40, 105, 1)',
              // shadowColor: 'rgba(255, 255, 255, 1)',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 2 //图形阴影的模糊大小
            }
          },
          animation: false,
          data: data
        });
      }

      let showPinTop = this.mp_option.showPinTop;
      // 雨滴描点
      if (echartOption.seriesPin) {
        echartOption.option.series.push({
          name: '点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: showPinTop === 0 ? data : (data.sort(function (a, b) {
            return b.value[2] > a.value[2];
          }).slice(0, showPinTop)),
          symbol: this.mp_option.pinSymbol, //气泡
          symbolSize: this.mp_option.pinSymbolSize,
          label: {
            normal: {
              show: this.mp_option.pinLabel,
              textStyle: {
                color: '#fff', fontSize: 9
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#F62157' //标志颜色
            }
          },
          zlevel: 6
        });
      }

      if (echartOption.seriesEffectScatterp) {
        echartOption.option.series.push({
          name: 'Top 5',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: data.sort(function (a, b) {
            return b.value[2] > a.value[2];
          }).slice(0, 5),
          symbolSize: function (val) {
            return 10;
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: 'yellow',
              shadowBlur: 10,
              shadowColor: 'yellow'
            }
          },
          zlevel: 1
        });
      }

      //渲染地图
      echartOption.echart.setOption(echartOption.option);

    },

    // 切换地图
    changeMap(echartOption, params) {
      if (params.name in this.provinces) {
        //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
        axios.get('/resources/chinese-map/map/province/' + this.provinces[params.name] + '.json').then((res) => {
          echartOption.resData = res.data;
          echarts.registerMap(echartOption.mapName, echartOption.resData);
        });
      } else if (this.parentName in this.provinces) { //params.seriesName
        //如果是【直辖市/特别行政区】只有二级下钻
        if (this.special.indexOf(params.seriesName) >= 0) {
          this.renderMap(echartOption);
        } else {
          //显示县级地图
          axios.get('/resources/chinese-map/map/city/' + cityMap[params.name] + '.json').then((res) => {
            echartOption.resData = res.data;
            echarts.registerMap(echartOption.mapName, echartOption.resData);
          });
        }
      } else {
        this.renderMap(echartOption);
      }
    }
  },
  watch: {
    pinData(newValue, oldValue) {
      this.mp_data=newValue;
      this.initECharts(this.mp_option, this.requestUrl, this.requestData);
    }
  }

});

var vMap = {
  mixins: [vueCommon]
};
