<template>
  <div class="home">
      <panel-group @handleSetLineChartData="handleSetLineChartData" />
      <report-statistics></report-statistics>
    <!-- 用户信息 -->
    <!--<el-row :gutter="15">-->
      <!--<el-col :span="16">-->
        <!--<el-card>-->
          <!--<div slot="header">-->
            <!--<span>我的工作台</span>-->
          <!--</div>-->
          <!--<div class="user-item">-->
            <!--<div class="user-item-left">-->
              <!--<img :src="userImg" />-->
            <!--</div>-->
            <!--<div class="user-item-right">-->
              <!--<el-row>-->
                <!--<el-col :span="24" class="right-title mb15">{{currentTime}}，{{userInfo.userName}}，{{dailyMessage}}-->
                <!--</el-col>-->
                <!--<el-col :span="24">-->
                  <!--<el-col :span="8" class="right-l-v">-->
                    <!--<div class="right-label">昵称：</div>-->
                    <!--<div class="right-value">小柒</div>-->
                  <!--</el-col>-->
                  <!--<el-col :span="16" class="right-l-v">-->
                    <!--<div class="right-label">身份：</div>-->
                    <!--<div class="right-value">{{userInfo.userName === 'admin' ? '超级管理' : '普通用户'}}</div>-->
                  <!--</el-col>-->
                <!--</el-col>-->
                <!--<el-col :span="24" class="mt5">-->
                  <!--<el-col :span="8" class="right-l-v">-->
                    <!--<div class="right-label">登录ip：</div>-->
                    <!--<div class="right-value">192.168.1.1</div>-->
                  <!--</el-col>-->
                  <!--<el-col :span="16" class="right-l-v">-->
                    <!--<div class="right-label">登录时间：</div>-->
                    <!--<div class="right-value">{{userInfo.time}}</div>-->
                  <!--</el-col>-->
                <!--</el-col>-->
                <!--<el-col :span="24" class="mt15">-->
                  <!--<el-button size="small" icon="el-icon-edit-outline" @click="$refs.homeUserSetDialog.open()">修改信息-->
                  <!--</el-button>-->
                  <!--<el-button size="small" icon="el-icon-unlock">修改密码</el-button>-->
                  <!--<el-button size="small" icon="el-icon-position" type="primary">发布活动</el-button>-->
                <!--</el-col>-->
              <!--</el-row>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-card>-->
      <!--</el-col>-->
      <!--<el-col :span="8">-->
        <!--<el-card>-->
          <!--<div slot="header">-->
            <!--<span>消息通知</span>-->
            <!--<el-button class="home-card-more" type="text" @click="onOpenGitee">更多</el-button>-->
          <!--</div>-->
          <!--<div class="info">-->
            <!--<Scroll :data="newsInfoList" class="info-scroll" :class-option="optionSingleHeight">-->
              <!--<ul class="info-ul">-->
                <!--<li v-for="(v,k) in newsInfoList" :key="k" class="info-item" @click="onNewsInfoListClick(v)">-->
                  <!--<div class="info-item-left" v-text="v.title"></div>-->
                  <!--<div class="info-item-right" v-text="v.date"></div>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</Scroll>-->
          <!--</div>-->
        <!--</el-card>-->
      <!--</el-col>-->
    <!--</el-row>-->

    <!-- 推荐 -->
    <!--<el-card class="mt15">-->
      <!--<div slot="header">-->
        <!--<span>营销推荐</span>-->
        <!--<el-button class="home-card-more" type="text" @click="onOpenGitee">更多</el-button>-->
      <!--</div>-->
      <!--<el-row :gutter="15" class="home-recommend-row">-->
        <!--<el-col :span="6" v-for="(v,k) in recommendList" :key="k">-->
          <!--<div class="home-recommend" :style="{'background-color': v.bg}">-->
            <!--<i :class="v.icon" :style="{'color': v.iconColor}"></i>-->
            <!--<div class="home-recommend-auto">-->
              <!--<div>{{v.title}}</div>-->
              <!--<div class="home-recommend-msg">{{v.msg}}</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-card>-->

    <!-- charts -->
    <el-row :gutter="15" class="mt15">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>库存作业</span>
          </div>
          <div class="charts">
            <div class="charts-right">
              <ve-pie :data="chartData3" :settings="chartSettings3" height="310px"></ve-pie>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>履约情况</span>
          </div>
          <div class="charts">
            <div class="charts-left mr7">
              <ve-ring :data="chartData4" :settings="chartSettings4" height="310px"></ve-ring>
            </div>
            <div class="charts-right ml7">
              <ve-bar :data="chartData5" :settings="chartSettings5" height="310px" :extend="{grid: {right: 20}}">
              </ve-bar>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- v-charts -->
    <el-row :gutter="15" class="mt15">
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>缺货监控</span>
            <el-date-picker v-model="charts.time" type="date" placeholder="选择日期" class="home-card-time" size="mini">
            </el-date-picker>
          </div>
          <div class="charts">
            <div class="charts-left mr7">
              <ve-line :data="chartData1" :settings="chartSettings1" height="310px" v-loading="chartData1Loading">
              </ve-line>
            </div>
            <div class="charts-right ml7">
              <ve-histogram :data="chartData2" :settings="chartSettings2" height="310px"></ve-histogram>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>履约超时预警</span>
          </div>
          <div class="home-charts">
            <div class="home-charts-item" v-for="(v,k) in chartsRightList" :key="k">
              <div class="home-charts-item-left">
                <div class="home-charts-item-title">{{v.title}}</div>
                <div class="home-charts-item-num" :style="{'color': v.color}">{{v.num}}</div>
              </div>
              <div class="home-charts-item-right">
                <i :class="v.icon" :style="{'background-color': v.iconBg, 'color': v.color}"></i>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <HomeUserSetDialog ref="homeUserSetDialog" />
  </div>
</template>

<script>
import { getSession } from '@/utils/storage'
import { dragDialog } from "@/utils/directive";
import { formatAxis, formatDate } from "@/utils/formatTime";
import { recommendList, chartsRightList, newsInfoList, dailyMessage } from "@/mock/home";
import Scroll from "vue-seamless-scroll";
import HomeUserSetDialog from "@/components/dialog/homeUserSetDialog";
import PanelGroup from './components/PanelGroup'
import ReportStatistics from "./components/ReportStatistics";

const lineChartData = {
    newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
    }
}

export default {
  name: "home",
  components: {ReportStatistics, Scroll, HomeUserSetDialog ,PanelGroup,ReportStatistics},
  data() {
    this.chartSettings1 = {
      metrics: ["访问用户"],
      dimension: ["日期"],
    };
    this.chartSettings2 = {
      stack: { 用户: ["访问用户", "下单用户"] },
      showLine: ["下单用户"],
    };
    this.chartSettings3 = {
      radius: 80,
      offsetY: 150,
      level: [
        ["1/1", "1/2", "1/3"],
        ["1/4", "1/5"],
      ],
    };
    this.chartSettings4 = {
      radius: [60, 80],
      offsetY: 150,
      level: [
        ["1/1", "1/2", "1/3"],
        ["1/4", "1/5"],
      ],
    };
    this.chartSettings5 = {
      stack: {
        xxx: ["访问用户", "下单用户"],
      },
    };
    return {
        lineChartData: lineChartData.newVisitis,
      recommendList,
      chartsRightList,
      newsInfoList,
      chartData1: {
        columns: [],
        rows: [],
      },
      chartData1Loading: false,
      chartData1DataEmpty: false,
      chartData2: {
        columns: ["日期", "访问用户", "下单用户", "下单率"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
        ],
      },
      chartData3: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393 },
          { 日期: "1/2", 访问用户: 3530 },
          { 日期: "1/3", 访问用户: 2923 },
          { 日期: "1/4", 访问用户: 1723 },
          { 日期: "1/5", 访问用户: 3792 },
          { 日期: "1/6", 访问用户: 4593 },
        ],
      },
      chartData4: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393 },
          { 日期: "1/2", 访问用户: 3530 },
          { 日期: "1/3", 访问用户: 2923 },
          { 日期: "1/4", 访问用户: 1723 },
          { 日期: "1/5", 访问用户: 3792 },
        ],
      },
      chartData5: {
        columns: ["日期", "访问用户", "下单用户", "下单率"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
        ],
      },
      userImg:
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg",
      charts: {
        time: "",
      },
      userInfo: {},
      dailyMessage: {}
    };
  },
  created() {
    dragDialog();
    this.getChartData1();
    this.initUserInfo();
    this.initDailyMessage();
  },
  computed: {
    currentTime() {
      return formatAxis(new Date());
    },
    optionSingleHeight() {
      return {
        singleHeight: 28,
        limitMoveNum: 8,
        waitTime: 2000,
      };
    },
  },
  methods: {
      handleSetLineChartData(type) {
          this.lineChartData = lineChartData[type]
      },
    // 随机语录
    initDailyMessage() {
      this.dailyMessage = dailyMessage[Math.floor(Math.random() * dailyMessage.length)]
    },
    // 初始化登录信息
    initUserInfo() {
      if (!getSession('userInfo')) return false
      this.userInfo = getSession('userInfo')
      this.userInfo.time = formatDate(new Date(this.userInfo.time), 'YYYY-mm-dd HH:MM:SS')
    },
    // 图表假数据模拟
    getChartData1() {
      this.chartData1Loading = true;
      setTimeout(() => {
        this.chartData1 = {
          columns: ["日期", "访问用户", "下单用户", "下单率"],
          rows: [
            { 日期: "1/1", 访问用户: Math.random() * 100, 下单用户: Math.random() * 1000, 下单率: Math.random() },
            { 日期: "1/2", 访问用户: Math.random() * 100, 下单用户: Math.random() * 1000, 下单率: Math.random() },
            { 日期: "1/3", 访问用户: Math.random() * 100, 下单用户: Math.random() * 1000, 下单率: Math.random() },
            { 日期: "1/4", 访问用户: Math.random() * 100, 下单用户: Math.random() * 1000, 下单率: Math.random() },
            { 日期: "1/5", 访问用户: Math.random() * 100, 下单用户: Math.random() * 1000, 下单率: Math.random() },
            { 日期: "1/6", 访问用户: Math.random() * 100, 下单用户: Math.random() * 1000, 下单率: Math.random() },
          ],
        };
        this.chartData1Loading = false;
      }, 1000);
    },
    // 消息通知当前项点击
    onNewsInfoListClick(v) {
      window.open(v.link);
    },
    // 跳转到 gitee
    onOpenGitee() {
      window.open('https://gitee.com/lyt-top/vue-admin-wonderful');
    }
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>