<template>
  <div class="big-data" v-loading="pageLoading" element-loading-text="初始化中..."
    element-loading-background="rgba(0, 0, 0, 0.3)">

    <Head @handle-click="setLoading" />
    <div class="big-data-down">
      <!-- 左边 -->
      <div class="big-data-down-left">
        <div class="flex-warp-item">
          <div class="flex-warp-item-box">
            <div class="flex-title">天气预报</div>
            <div class="flex-content flex-content-overflow">
              <div class="sky">
                <i class="sky-left el-icon-cloudy-and-sunny"></i>
                <div class="sky-center">
                  <div class="mb2">
                    <font>多云转晴</font>
                    <font>东南风</font>
                    <span>良</span>
                  </div>
                  <div class="sky-tip">温馨提示：多云转晴，南风转北风风力3级</div>
                </div>
                <div class="sky-right">
                  <span>25</span>
                  <font>°C</font>
                </div>
              </div>
              <div class="sky-dd">
                <div class="sky-dl" v-for="(v,k) in skyList" :key="k" :class="{'sky-dl-first': k === 1}">
                  <div>{{v.v1}}</div>
                  <div v-if="v.type === 'title'">{{v.v2}}</div>
                  <div v-else>
                    <i :class="v.v2"></i>
                  </div>
                  <div>{{v.v3}}</div>
                  <div>{{v.v4}}</div>
                  <div class="tip">{{v.v5}}</div>
                  <div>{{v.v6}}</div>
                  <div>{{v.v7}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-warp-item">
          <div class="flex-warp-item-box">
            <div class="flex-title">当前设备状态</div>
            <div class="flex-content flex-content-overflow">
              <div class="d-states">
                <div class="d-states-item">
                  <i class="el-icon-odometer i-bg1"></i>
                  <div class="d-states-flex">
                    <div class="d-states-item-label">园区设备数</div>
                    <div class="d-states-item-value">99</div>
                  </div>
                </div>
                <div class="d-states-item">
                  <i class="el-icon-first-aid-kit i-bg2"></i>
                  <div class="d-states-flex">
                    <div class="d-states-item-label">预警设备数</div>
                    <div class="d-states-item-value">10</div>
                  </div>
                </div>
                <div class="d-states-item">
                  <i class="el-icon-video-play i-bg3"></i>
                  <div class="d-states-flex">
                    <div class="d-states-item-label">运行设备数</div>
                    <div class="d-states-item-value">20</div>
                  </div>
                </div>
              </div>
              <div class="d-btn">
                <div class="d-btn-item" v-for="(v,k) in dBtnList" :key="k" :class="{'d-btn-active':dBtnActive === k}"
                  @click="onDBtnActiveClikc(k)">
                  <i class="d-btn-item-left el-icon-money"></i>
                  <div class="d-btn-item-center">
                    <div>{{v.v1}}</div>
                    <div>{{v.v2}}|{{v.v3}}</div>
                  </div>
                  <div class="d-btn-item-eight">{{v.v4}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-warp-item">
          <div class="flex-warp-item-box">
            <div class="flex-title">近30天预警总数</div>
            <div class="flex-content" ref="rightChartData1">
              <ve-pie :height="echarts.rightChartData1" :data="chartData1" :settings="{roseType: 'radius',radius: 60}"
                :extend="{series: {type: 'pie',center: ['50%', '50%']},legend: {show: false}}"></ve-pie>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间 -->
      <div class="big-data-down-center">
        <div class="big-data-down-center-one">
          <div class="big-data-down-center-one-content" ref="rightChartData5">
            <div id="3DEarth"></div>
            <div :class="v.topLevelClass" v-for="(v,k) in earth3DBtnList" :key="k" @click="onEarth3DBtnListClick(v)">
              <div class="circle" v-for="i in 4" :key="i"></div>
              <div class="text-box">
                <i :class="v.icon"></i>
                <div class="text">{{v.label}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="big-data-down-center-two">
          <div class="flex-warp-item-box">
            <div class="flex-title">
              <span>当前设备监测</span>
              <span class="flex-title-small">单位：次</span>
            </div>
            <div class="flex-content">
              <div class="flex-content-left">
                <div class="monitor-item" v-for="(v,k) in chartData4List" :key="k" @click="onMonitorClick(k)">
                  <div class="monitor-wave" :class="{'monitor-active':k === chartData4Index}">
                    <div class="monitor-z-index">
                      <div class="monitor-item-label">{{v.label}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-content-right" ref="rightChartData4">
                <ve-line :height="echarts.rightChartData4" :data="chartData4"
                  :settings="{areaStyle: {color: {type: 'linear',x: 0,y: 0, x2: 0,y2: 1,
                  colorStops: [{offset: 0,color: 'rgba(52,153,245,0.5)'},{offset: 1,color: 'rgba(52,153,245,0.1)'}],global: false}}}" :extend="{legend: {show: false},
                  series: {type: 'line',barWidth: 20,smooth: 0,itemStyle: {normal: {label: {show: false},lineStyle: {width: 1,color: '#43bdf0'}}}},
                  yAxis: {axisLabel: {color: '#c0d1f2'},splitLine: {lineStyle: {type:'dotted',color: ['#09445e']}}},
                  xAxis: {axisLabel: {color: '#c0d1f2'}},
                  grid: {top: 15,bottom: 0}}"></ve-line>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右边 -->
      <div class="big-data-down-right">
        <div class="flex-warp-item">
          <div class="flex-warp-item-box">
            <div class="flex-title">
              <span>近7天产品追溯扫码统计</span>
              <span class="flex-title-small">单位：次</span>
            </div>
            <div class="flex-content" ref="rightChartData3">
              <ve-line :height="echarts.rightChartData3" :data="chartData3" :extend="{legend: {show: false},
                series: {type: 'line',barWidth: 20},
                yAxis: {axisLabel: {color: '#c0d1f2'},splitLine: {lineStyle: {type:'dotted',color: ['#09445e']}}},
                xAxis: {axisLabel: {color: '#c0d1f2'}},
                grid: {top: 15,bottom: 0}}"></ve-line>
            </div>
          </div>
        </div>
        <div class="flex-warp-item">
          <div class="flex-warp-item-box">
            <div class="flex-title">当前任务统计</div>
            <div class="flex-content">
              <div class="task">
                <div class="task-item task-first-item">
                  <div class="task-item-value task-first">25</div>
                  <div class="task-item-label">待办任务</div>
                </div>
                <div class="task-item">
                  <div class="task-item-box task1">
                    <div class="task-item-value">12</div>
                    <div class="task-item-label">施肥</div>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-item-box task2">
                    <div class="task-item-value">3</div>
                    <div class="task-item-label">施药</div>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-item-box task3">
                    <div class="task-item-value">5</div>
                    <div class="task-item-label">农事</div>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-item-box task4">
                    <div class="task-item-value">3</div>
                    <div class="task-item-label">巡园</div>
                  </div>
                </div>
                <div class="task-item">
                  <div class="task-item-box task5">
                    <div class="task-item-value">2</div>
                    <div class="task-item-label">采集</div>
                  </div>
                </div>
              </div>
              <div class="progress">
                <div class="progress-item">
                  <span>施肥任务完成率</span>
                  <div class="progress-box">
                    <el-progress :percentage="70" color="#43bdf0"></el-progress>
                  </div>
                </div>
                <div class="progress-item">
                  <span>施药任务完成率</span>
                  <div class="progress-box">
                    <el-progress :percentage="36" color="#43bdf0"></el-progress>
                  </div>
                </div>
                <div class="progress-item">
                  <span>农事任务完成率</span>
                  <div class="progress-box">
                    <el-progress :percentage="91" color="#43bdf0"></el-progress>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-warp-item">
          <div class="flex-warp-item-box">
            <div class="flex-title">
              <span>近7天投入品记录</span>
              <span class="flex-title-small">单位：件</span>
            </div>
            <div class="flex-content" ref="rightChartData2">
              <ve-histogram :height="echarts.rightChartData2" :data="chartData2"
                :settings="{itemStyle: {color: {type: 'linear',x: 0,y: 0, x2: 0,y2: 1,
                colorStops: [{offset: 0,color: 'rgba(52,153,245,1)'},{offset: 1,color: 'rgba(52,153,245,0.1)'}],global: false}}}" :extend="{legend: {show: false},
                series: {type: 'bar',barWidth: 20},
                yAxis: {axisLabel: {color: '#c0d1f2'},splitLine: {lineStyle: {color: ['#09445e']}}},
                xAxis: {axisLabel: {color: '#c0d1f2'}},
                grid: {top: 15,bottom: 0},
                tooltip: {trigger: 'axis',axisPointer: {type: 'shadow'}}}"></ve-histogram>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Popup :visible.sync="visible.show" :title="visible.title">
      <h3>
        提供具名插槽或需要接收 prop 的插槽。
        <a href="https://cn.vuejs.org/v2/api/#v-slot" target="_blank">https://cn.vuejs.org/v2/api/#v-slot</a>
      </h3>
    </Popup>
  </div>
</template>

<script>
import Head from "./component/head";
import Popup from "@/components/popup/index";
import {
  skyList,
  dBtnList,
  chartData1,
  chartData2,
  chartData3,
  chartData4List,
  earth3DBtnList,
} from "./index.js";
export default {
  name: "bigData",
  components: { Head, Popup },
  data() {
    return {
      pageLoading: true,
      skyList,
      dBtnList,
      chartData1,
      chartData2,
      chartData3,
      chartData4: {},
      chartData4List,
      chartData4Index: 0,
      dBtnActive: 0,
      echarts: {
        rightChartData3: null,
        rightChartData2: null,
        rightChartData4: null,
        rightChartData1: null,
        rightChartData5: null,
      },
      my3DEarthChart: null,
      earth3DBtnList,
      visible: {
        show: false,
        title: "提示",
      },
    };
  },
  mounted() {
    this.initCharts();
    this.initChartData4();
    this.initChartData5();
  },
  methods: {
    initChartData5Onresize() {
      window.onresize = () => {
        this.my3DEarthChart.resize();
      };
    },
    initChartData5() {
      setTimeout(() => {
        this.$nextTick(() => {
          let el = document.getElementById("3DEarth");
          el.style.height = this.echarts.rightChartData5;
          this.my3DEarthChart = this.$echarts.init(el);
          this.my3DEarthChart.setOption(
            {
              backgroundColor: "transparent",
              globe: {
                baseTexture: require("./images/world.jpg"),
                heightTexture: require("./images/world.jpg"),
                displacementScale: 0.04,
                shading: "realistic",
                realisticMaterial: {
                  roughness: 0.8,
                },
                postEffect: {
                  enable: true,
                  bloom: {
                    enable: true,
                    bloomIntensity: 0.3,
                  },
                },
                light: {
                  main: {
                    intensity: 5,
                    shadow: true,
                  },
                  ambientCubemap: {
                    exposure: 0.2,
                  },
                },
                globeRadius: 80,
                globeOuterRadius: 130,
                viewControl: {
                  autoRotateAfterStill: 2,
                  zoomSensitivity: 0,
                },
              },
            },
            true
          );
          setTimeout(() => {
            this.pageLoading = false;
            this.initChartData5Onresize();
          }, 1000);
        });
      }, 1500);
    },
    initChartData4() {
      setTimeout(() => {
        this.chartData4 = {
          columns: ["周期", "访问用户"],
          rows: [
            { 周期: "02:00", 访问用户: Math.random() * 100 },
            { 周期: "04:00", 访问用户: Math.random() * 100 },
            { 周期: "06:00", 访问用户: Math.random() * 100 },
            { 周期: "08:00", 访问用户: Math.random() * 100 },
            { 周期: "10:00", 访问用户: Math.random() * 100 },
            { 周期: "12:00", 访问用户: Math.random() * 100 },
            { 周期: "14:00", 访问用户: Math.random() * 100 },
          ],
        };
      }, 1000);
    },
    initChartsFun() {
      this.initRightChartData("rightChartData3");
      this.initRightChartData("rightChartData2");
      this.initRightChartData("rightChartData4");
      this.initRightChartData("rightChartData1");
      this.initRightChartData("rightChartData5");
    },
    initCharts() {
      this.initChartsFun();
      window.onresize = () => {
        this.initChartsFun();
      };
    },
    initRightChartData(echartsRef) {
      this.$nextTick(() => {
        const h = this.$refs[echartsRef].offsetHeight;
        this.$set(this.echarts, echartsRef, `${h}px`);
      });
    },
    onDBtnActiveClikc(k) {
      this.dBtnActive = k;
      this.setLoading();
    },
    onMonitorClick(k) {
      this.chartData4Index = k;
      this.initChartData4();
    },
    onEarth3DBtnListClick(row) {
      this.visible.show = true;
      this.visible.title = row.label;
    },
    setLoading() {
      this.pageLoading = true;
      setTimeout(() => {
        this.pageLoading = false;
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>