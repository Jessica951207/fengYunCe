// sky 天气
export const skyList = [
  {
    v1: "时间",
    v2: "天气",
    v3: "温度",
    v4: "湿度",
    v5: "降水概率",
    v6: "风向",
    v7: "风力",
    type: "title",
  },
  {
    v1: "今天",
    v2: "el-icon-cloudy-and-sunny",
    v3: "20°/26°",
    v4: "80%",
    v5: "50%",
    v6: "东南风",
    v7: "13m/s",
  },
  {
    v1: "明天",
    v2: "el-icon-lightning",
    v3: "20°/26°",
    v4: "80%",
    v5: "50%",
    v6: "东南风",
    v7: "13m/s",
  },
  {
    v1: "后天",
    v2: "el-icon-sunny",
    v3: "20°/26°",
    v4: "80%",
    v5: "50%",
    v6: "东南风",
    v7: "13m/s",
  },
];

// 当前设置状态
export const dBtnList = [
  {
    v1: "地块A-灌溉",
    v2: "阳光玫瑰种植",
    v3: "126天",
    v4: "设备在线",
  },
  {
    v1: "地块B-收割",
    v2: "阳光玫瑰种植",
    v3: "360天",
    v4: "设备预警",
  },
];

// 近30天预警总数
export const chartData1 = {
  columns: ["label", "value"],
  rows: [
    { label: "天气预警", value: Math.random() * 1000 },
    { label: "病虫害预警", value: Math.random() * 1000 },
    { label: "任务预警", value: Math.random() * 1000 },
    { label: "监测设备预警", value: Math.random() * 1000 },
  ],
};

// 当前设备监测
export const chartData4List = [
  {
    label: "温度",
  },
  {
    label: "光照",
  },
  {
    label: "湿度",
  },
  {
    label: "风力",
  },
  {
    label: "张力",
  },
  {
    label: "气压",
  },
];

// 近7天产品追溯扫码统计
export const chartData3 = {
  columns: ["周期", "火龙果", "苹果", "葡萄"],
  rows: [
    {
      周期: "1天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
    {
      周期: "2天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
    {
      周期: "3天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
    {
      周期: "4天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
    {
      周期: "5天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
    {
      周期: "6天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
    {
      周期: "7天",
      火龙果: Math.random() * 100,
      苹果: Math.random() * 100,
      葡萄: Math.random() * 100,
    },
  ],
};

// 近7天投入品记录
export const chartData2 = {
  columns: ["周期", "访问用户"],
  rows: [
    { 周期: "1天", 访问用户: Math.random() * 100 },
    { 周期: "2天", 访问用户: Math.random() * 100 },
    { 周期: "3天", 访问用户: Math.random() * 100 },
    { 周期: "4天", 访问用户: Math.random() * 100 },
    { 周期: "5天", 访问用户: Math.random() * 100 },
    { 周期: "6天", 访问用户: Math.random() * 100 },
    { 周期: "7天", 访问用户: Math.random() * 100 },
  ],
};

// 3DEarth 地图周围按钮组
export const earth3DBtnList = [
  {
    topLevelClass: "fixed-top",
    icon: "el-icon-s-marketing",
    label: "环境监测",
    type: 0,
  },
  {
    topLevelClass: "fixed-right",
    icon: "el-icon-s-cooperation",
    label: "精准管理",
    type: 1,
  },
  {
    topLevelClass: "fixed-bottom",
    icon: "el-icon-s-order",
    label: "数据报表",
    type: 2,
  },
  {
    topLevelClass: "fixed-left",
    icon: "el-icon-s-claim",
    label: "产品追溯",
    type: 3,
  },
];
