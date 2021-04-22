<template>
  <div class="v-charts-warp" :style="styleHeight">
    <ve-line :data="chartData" :data-zoom="dataZoom" height="100%" :colors="['#19D4AE','#5AB1EF']"
      :loading="chartConfig.loading" :data-empty="chartConfig.dataEmpty" :mark-point="markPoint" :extend="chartSettings"
      :toolbox="toolbox">
    </ve-line>
  </div>
</template>

<script>
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/markPoint'
import 'v-charts/lib/style.css'
export default {
  name: 'vCharts',
  data() {
    this.toolbox = {
      feature: {
        magicType: { type: ['line', 'bar'] },
        saveAsImage: {}
      }
    }
    this.chartSettings = {
      yAxisName: ['价格'],
      title: {
        show: true,
        text: 'v-charts 图表示例',
        left: 'center',
        top: 3,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      grid: {
        top: 80
      },
      legend: {
        right: 100,
        top: 5
      }
    }
    this.markPoint = {
      data: [
        {
          name: '最大值',
          type: 'max'
        }
      ]
    }
    this.dataZoom = [
      {
        id: 'dataZoomX',
        type: 'slider',
        start: 0,
        end: 100
      },
      {
        id: 'dataZoomY',
        type: 'inside'
      }
    ]
    return {
      chartData: {},
      chartConfig: {
        loading: false,
        dataEmpty: false
      }
    }
  },
  computed: {
    // 动态高度，适配各布局。单页面的画，高度设为100%即可。
    styleHeight() {
      let { layout, isTagsView } = this.$store.state.layoutConfig;
      if (layout === 'fashion' || layout === 'strange') {
        if (isTagsView) {
          return {
            height: `calc(100vh - 114px)`
          }
        } else {
          return {
            height: `calc(100vh - 80px)`
          }
        }
      } else {
        return {
          height: `calc(100vh - 80px)`
        }
      }
    }
  },
  mounted() {
    this.getChartsData();
  },
  methods: {
    // 获取数据
    getChartsData() {
      this.chartConfig.loading = true;
      this.chartData = {
        columns: ['日期', '成本', '利润'],
        rows: [
          { '日期': '1月1日', '成本': Math.floor(Math.random() * 100), '利润': Math.floor(Math.random() * 100) },
          { '日期': '1月2日', '成本': Math.floor(Math.random() * 100), '利润': Math.floor(Math.random() * 100) },
          { '日期': '1月3日', '成本': Math.floor(Math.random() * 100), '利润': Math.floor(Math.random() * 100) },
          { '日期': '1月4日', '成本': Math.floor(Math.random() * 100), '利润': Math.floor(Math.random() * 100) },
          { '日期': '1月5日', '成本': Math.floor(Math.random() * 100), '利润': Math.floor(Math.random() * 100) },
          { '日期': '1月6日', '成本': Math.floor(Math.random() * 100), '利润': Math.floor(Math.random() * 100) }
        ]
      }
      setTimeout(() => {
        this.chartConfig.loading = false;
      }, 500)
    }
  }
}
</script>

<style scoped lang="scss">
.v-charts-warp {
  border-radius: 0px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03) !important;
  margin: 15px;
}
</style>