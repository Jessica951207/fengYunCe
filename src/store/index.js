import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * 2020/8/22 17:20 全局布局配置
     * 注意：其它属性布局为 `fashion` 才生效，
     * 此配置不可删除，否则页面可能出现未知异常。
     */
    layoutConfig: {
      isBreadcrumb: true, // 是否开启 Breadcrumb
      isTagsView: true, // 是否开启 Tags-View
      isFixedHead: false, // 是否固定 Header
      isLogo: false, // 是否侧边栏 Logo
      isCollapse: false, // 是否折叠导航菜单
      isUniqueOpened: false, // 是否只保持一个子菜单的展开
      isUserPhoto: true, // 是否显示登录用户头像
      layout: "fashion", // 切换布局：1、 classic 经典布局 2、 fashion 时尚布局 3、 elegant 典雅布局 4、 strange 怪异布局
      layoutLoading: false, // 切换布局时的 loading
      loadingTimer: 700, // 切换布局时的 loading 时间
      subMenuTheme: 'dark', // 菜单主题颜色 1、 dark 暗色  2、 light 亮色
      isSplitMenu: false, // 自动菜单分割(仅 classic 经典布局生效)
    },
    menuData: {}, // 后端返回动态路由，处理了 `component` 路径、`hidden` 字段
    originalMenuData: {}, // 后端返回未处理过的动态路由, `breadcrumb 面包屑中使用`，防止路由缓存时，menuData 变化，originalMenuData也跟着变化。
    primeMenuData: [], // 后端返回最原始动态路由，未处理 `component` 路径、`hidden` 字段，用于菜单管理中显示(页面路径：用户/菜单管理)
    // 路由缓存数据，字符串为组件中的 `name` 值，想要缓存嵌套路由，得先在当前组件中定义 `name` 值
    keepAliveList: ['home', 'docs', 'menu2', 'menu11', 'menu122', 'basicForm'],
      dialogType:"",    //dialog类型: 新增/修改
      ruleTypeOptions:[],  //规则组类型
      orzOptions:[],  //适用机构
      markOptions:[],
      regionOptions:[],
      remarkInfoForm:{}, //新增提示语信息 时提交的表单信息
      ruleInfoForm:{},  //新增规则信息 时提交的表单信息
      rgruleid:'',   //修改时的 rgruleid
      markInfoTable:[],  //提示语信息table
      ruleInfoTable:[],  // 规则信息table
      relationOptions:[],  // 判断关系
  },
  mutations: {
    // 触发 layoutConfig 配置更新
    getLayoutConfig(state, res) {
      state.layoutConfig = res;
    },
    // 后端返回动态路由
    setMenuData(state, res) {
      state.menuData = res;
      state.originalMenuData = JSON.parse(JSON.stringify(res));
    },
    // 设置不处理 `component` 路径的原始值，用于菜单管理中显示(页面路径：用户/菜单管理)
    setPrimeMenuData(state, res) {
      // 处理路径 `component` 关键字, 防止页面不显示内容(用户/菜单管理列表中的"组件路径")
      res.children.map(v => v['componentPath'] = v.component);
      state.primeMenuData = res.children;
    },
  },
  actions: {
    // 触发 layoutConfig 配置更新
    setLayoutConfig({
      commit
    }, res) {
      commit("getLayoutConfig", res);
    },
  },
  modules: {},
});