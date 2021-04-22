<template>
  <div class="navbar-right">
    <el-autocomplete placeholder="菜单搜索：中文、路由" size="small" prefix-icon="el-icon-search" class="icon-search"
      :fetch-suggestions="menuSearch" @blur="onMenuSearchBlur" ref="menuSearchRef" v-if="isShowSearch"
      v-model="queryMenu" @select="onHandleSelect">
    </el-autocomplete>
    <div class="icon-hover" @click="onMenuSearch">
      <i class="el-icon-search icon" title="菜单搜索" v-if="!isShowSearch"></i>
    </div>
    <div class="icon-hover" @click="$refs.dropdownDrawer.openDrawer()">
      <i class="icon-skin iconfont icon" title="全局配置"></i>
    </div>
    <div class="icon-hover" @mouseenter="$refs.dropdownNews.open()" @mouseleave="$refs.dropdownNews.close()">
      <el-badge is-dot>
        <i class="el-icon-bell icon"></i>
        <DropdownNews ref="dropdownNews" />
      </el-badge>
    </div>
    <div class="icon-hover mr10" @click="onScreenfull">
      <i :class="!isFullscreen?'iconfont icon-fullscreen':'iconfont icon-tuichuquanping'" class="icon"
        :title="!isFullscreen?'开全屏':'关全屏'"></i>
    </div>
    <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onDropdownCommand">
      <span class="el-dropdown-link">
        <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg"
          class="user-photo mr5" v-if="$store.state.layoutConfig.isUserPhoto" />
        {{userInfo.userName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="v" :divided="v.type === 'signUp'" v-for="(v,k) in dropdownList" :key="k">
            {{v.label}}
        </el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
    <DropdownDrawer ref="dropdownDrawer" />
  </div>
</template>

<script>
    import {signOut} from "../../../api/login"
import screenfull from "screenfull";
import { getSession, clearSession } from "@/utils/storage";
import { dropdownList } from "@/mock/dropdownList";
import DropdownDrawer from "@/components/navBars/dropdown/dropdownDrawer";
import DropdownNews from "@/components/navBars/dropdown/dropdownNews";
import { resetRouter } from '@/router'
export default {
  name: "dropdown",
  components: { DropdownDrawer, DropdownNews },
  data() {
    return {
      dropdownList,
      isFullscreen: false,
      userInfo: {},
      isShowSearch: false,
      primeMenuData: [],
      newPrimeMenuData: [],
      queryMenu: ''
    };
  },
  mounted() {
    this.initPrimeMenuData();
    this.initUserInfo();
    this.initScreenfull();
  },
  destroyed() {
    this.destroyScreenfull();
  },
  methods: {
    // 递归处理菜单数据
    filterMenu(arr) {
      return arr.map((item) => {
        this.newPrimeMenuData.push({ ...item, value: item.meta.title })
        item = Object.assign({}, item);
        if (item.children) item.children = this.filterMenu(item.children)
        return item;
      });
    },
    // 初始化搜索菜单数据
    initPrimeMenuData() {
      this.filterMenu(this.$store.state.primeMenuData);
      this.primeMenuData = this.newPrimeMenuData;
    },
    // 菜单搜索数据过滤
    menuSearch(queryString, cb) {
      let primeMenuData = this.primeMenuData;
      let results = queryString ? primeMenuData.filter(this.createFilter(queryString)) : primeMenuData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 菜单搜索过滤
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1 || restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    // 菜单搜索当前项点击
    onHandleSelect(item) {
      this.$router.push(item.path);
    },
    // 菜单搜索icon点击
    onMenuSearch() {
      this.isShowSearch = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.menuSearchRef.focus();
        }, 100);
      })
    },
    // 菜单搜索 input 隐藏
    onMenuSearchBlur() {
      setTimeout(() => {
        this.isShowSearch = false;
        this.queryMenu = "";
      }, 100)
    },
    // 初始化登录信息
    initUserInfo() {
      if (!getSession('userInfo')) return false;
      this.userInfo = getSession('userInfo');
    },
    // 初始化全屏
    initScreenfull() {
      if (screenfull.isEnabled) {
        screenfull.on("change", this.changeScreenfull);
      }
    },
    // 全屏改变时
    changeScreenfull() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    // 监听全屏关闭
    destroyScreenfull() {
      if (screenfull.isEnabled) {
        screenfull.off("change", this.changeScreenfull);
      }
    },
    // 全屏点击时
    onScreenfull() {
      if (!screenfull.isEnabled) {
        this.$message.warning("暂不不支持全屏");
        return false;
      }
      screenfull.toggle();
    },
    // `dropdown 下拉菜单` 当前项点击
    onDropdownCommand(item) {
      let { link, type, path } = item;
      if (type === "signUp") {
        this.$msgbox({
          closeOnClickModal: false,
          closeOnPressEscape: false,
          title: "提示",
          message: "此操作将退出登录, 是否继续?",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "退出中";
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 700);
            } else {
              done();
            }
          },
        }).then((action) => {
            let userId = Object.assign({"userId":this.userInfo.id})
            signOut(userId).then(res =>{
                clearSession();
                this.$store.commit('setMenuData', {});
                resetRouter()  // 重置路由
                this.$router.push('/login');
                setTimeout(() => {
                    this.$message.success("退出成功！记得回来哟~");
                }, 300);

            })

        }).catch(() => { });
      } else if (path) {
        this.$router.push(path);
      } else {
        window.open(link);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.navbar-right {
  display: flex;
  align-items: center;
  .icon {
    display: inline-block;
    padding: 0 10px;
    cursor: pointer;
    transition: all 0.3s;
    color: #000000;
    height: 50px;
    line-height: 50px;
  }
  .icon-hover {
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }
  .icon-search {
    animation: searchIconAnimation 0.3s ease-in-out;
  }
  @keyframes searchIconAnimation {
    0% {
      transform: scale(0);
    }
    80% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  ::v-deep .is-dot {
    top: 38% !important;
    right: 15px !important;
  }
  .el-dropdown-link {
    height: 100%;
    display: flex;
    align-items: center;
    .user-photo {
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }
}
</style>