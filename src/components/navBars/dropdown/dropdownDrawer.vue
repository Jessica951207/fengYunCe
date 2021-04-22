<template>
  <el-drawer title="系统布局配置" :visible.sync="isDrawer" :show-close="false" size="260px" append-to-body>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: !isFashionOrStrange() ? '0.5' : '1' }">
        开启 Breadcrumb
      </div>
      <el-switch v-model="layouts.isBreadcrumb" class="drawer-item" :disabled="!isFashionOrStrange()"
        @change="onSwitchChange"></el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: !isFashionOrStrange() ? '0.5' : '1' }">
        开启 Tags-View
      </div>
      <el-switch v-model="layouts.isTagsView" class="drawer-item" :disabled="!isFashionOrStrange()"
        @change="onSwitchChange"></el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: !isFashionOrStrange() ? '0.5' : '1' }">
        固定 Header
      </div>
      <el-switch v-model="layouts.isFixedHead" class="drawer-item" :disabled="!isFashionOrStrange()"
        @change="onSwitchChange"></el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: !isFashionOrStrange() ? '0.5' : '1' }">
        侧边栏 Logo
      </div>
      <el-switch v-model="layouts.isLogo" class="drawer-item" :disabled="!isFashionOrStrange()"
        @change="onSwitchChange"></el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: isElegant() ? '0.5' : '1' }">
        开启折叠 NavMenu
      </div>
      <el-switch v-model="layouts.isCollapse" class="drawer-item" :disabled="isElegant()" @change="onSwitchChange">
      </el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: isElegant() ? '0.5' : '1' }">
        开启一个 NavMenu 展开
      </div>
      <el-switch v-model="layouts.isUniqueOpened" class="drawer-item" :disabled="isElegant()" @change="onSwitchChange">
      </el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item">登录用户头像</div>
      <el-switch v-model="layouts.isUserPhoto" class="drawer-item" @change="onSwitchChange"></el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: isStrange() ? '0.5' : '1' }">
        菜单主题 {{ layouts.subMenuTheme === "dark" ? "Dark" : "Light" }}
      </div>
      <el-switch active-value="light" inactive-value="dark" v-model="layouts.subMenuTheme" class="drawer-item"
        :disabled="isStrange()" @change="onSwitchChange"></el-switch>
    </div>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: !isClassic() ? '0.5' : '1' }">
        自动菜单分割
      </div>
      <el-switch v-model="layouts.isSplitMenu" class="drawer-item" :disabled="!isClassic()"
        @change="onSwitchChangeSplitMenu"></el-switch>
    </div>

    <!-- 切换布局 -->
    <div class="drawer-layout">
      <div class="drawer-layout-title">切换布局</div>
      <div class="drawer-layout-content-flex">
        <!-- fashion 时尚布局 -->
        <div class="drawer-layout-content-item" @click="onLayoutClick('fashion')">
          <section class="el-container el-circular" :class="{ 'drawer-layout-active': isFashion() }">
            <aside class="el-aside" style="width: 20px"></aside>
            <section class="el-container is-vertical">
              <header class="el-header" style="height: 10px"></header>
              <main class="el-main"></main>
            </section>
          </section>
          <div :class="[isFashion()? 'layout-tips-warp-active':'layout-tips-warp']">
            <div class="layout-tips-box">
              <p class="layout-tips-txt">时尚</p>
            </div>
          </div>
        </div>

        <!-- classic 经典布局 -->
        <div class="drawer-layout-content-item" @click="onLayoutClick('classic')">
          <section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': isClassic() }">
            <header class="el-header" style="height: 10px"></header>
            <section class="el-container">
              <aside class="el-aside" style="width: 20px"></aside>
              <section class="el-container is-vertical">
                <main class="el-main"></main>
              </section>
            </section>
          </section>
          <div :class="[isClassic()? 'layout-tips-warp-active':'layout-tips-warp']">
            <div class="layout-tips-box">
              <p class="layout-tips-txt">经典</p>
            </div>
          </div>
        </div>

        <!-- elegant 典雅布局 -->
        <div class="drawer-layout-content-item" @click="onLayoutClick('elegant')">
          <section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': isElegant() }">
            <header class="el-header" style="height: 10px"></header>
            <section class="el-container">
              <section class="el-container is-vertical">
                <main class="el-main"></main>
              </section>
            </section>
          </section>
          <div :class="[isElegant()? 'layout-tips-warp-active':'layout-tips-warp']">
            <div class="layout-tips-box">
              <p class="layout-tips-txt">典雅</p>
            </div>
          </div>
        </div>

        <!-- strange 怪异布局 -->
        <div class="drawer-layout-content-item" @click="onLayoutClick('strange')">
          <section class="el-container el-circular" :class="{ 'drawer-layout-active': isStrange() }">
            <aside class="el-aside-dark" style="width: 10px"></aside>
            <aside class="el-aside" style="width: 20px"></aside>
            <section class="el-container is-vertical">
              <header class="el-header" style="height: 10px"></header>
              <main class="el-main"></main>
            </section>
          </section>
          <div :class="[isStrange()? 'layout-tips-warp-active':'layout-tips-warp']">
            <div class="layout-tips-box">
              <p class="layout-tips-txt">怪异</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制配置 -->
    <div class="copy-config">
      <el-alert title="点击下方按钮，复制布局配置。路径：src/store/index.js" type="warning" :closable="false">
      </el-alert>
      <el-button size="small" class="copy-config-btn" icon="el-icon-document-copy" @click="onCopyConfig">一键复制配置
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { setSession } from "@/utils/storage";
import ClipboardJS from 'clipboard';
export default {
  name: "dropdownDrawer",
  data() {
    return {
      isDrawer: false,
      layouts: {},
    };
  },
  computed: {
    ...mapState(["layoutConfig"]),
  },
  mounted() {
    this.layouts = this.layoutConfig;
  },
  methods: {
    ...mapActions(["setLayoutConfig"]),
    // isDev() {
    //   return process.env.NODE_ENV === "development" ? true : false
    // },
    isFashionOrStrange() {
      return (
        this.layouts.layout === "fashion" || this.layouts.layout === "strange"
      );
    },
    isFashion() {
      return this.layouts.layout === "fashion";
    },
    isStrange() {
      return this.layouts.layout === "strange";
    },
    isClassic() {
      return this.layouts.layout === "classic";
    },
    isElegant() {
      return this.layouts.layout === "elegant";
    },
    openDrawer() {
      this.isDrawer = true;
    },
    onLayoutClick(layoutType) {
      this.isDrawer = false;
      this.layouts.layout = layoutType;
      this.layouts.layoutLoading = true;
      layoutType === "fashion"
        ? (this.layouts.subMenuTheme = "dark")
        : (this.layouts.subMenuTheme = "light");
      this.$nextTick(() => {
        setTimeout(() => {
          this.layouts.layoutLoading = false;
          this.bus.$emit('initTagsList')
          this.onSwitchChange();
          this.onSwitchChangeSplitMenu();
        }, this.layouts.loadingTimer);
      });
    },
    onSwitchChange() {
      if (this.layouts.layout === "elegant") {
        this.layouts.isCollapse = false;
      }
      setSession("layoutConfig", this.layouts);
      this.setLayoutConfig(this.layouts);
    },
    onSwitchChangeSplitMenu() {
      this.onSwitchChange();
      this.bus.$emit("sendClassicSplitMenuData", null);
    },
    onCopyConfig() {
      let clipboardJS = new ClipboardJS('.copy-config-btn', {
        text: () => JSON.stringify(this.layouts)
      });
      clipboardJS.on('success', e => {
        this.$message.success('配置复制成功');
        this.isDrawer = false;
        clipboardJS.destroy();
      })
      clipboardJS.on('error', e => {
        this.$message.error('配置复制失败');
      })
    }
  },
};
</script>

<style scoped lang="scss">
.drawer-flex {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 20px;
  .drawer-item {
    color: #666666;
  }
}
.drawer-layout {
  display: flex;
  flex-direction: column;
  .drawer-layout-title {
    color: #666666;
    margin-bottom: 15px;
  }
  .drawer-layout-content-flex {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin: 0 -5px;
    .drawer-layout-content-item {
      width: 50%;
      height: 70px;
      cursor: pointer;
      border: 1px solid transparent;
      position: relative;
      padding: 5px;
      .el-circular {
        overflow: hidden;
        border: 1px solid transparent;
        transition: all 0.3s ease-in-out;
      }
      .el-container {
        height: 100%;
        .el-aside-dark {
          background-color: #b3c0d1;
        }
        .el-aside {
          background-color: #d3dce6;
        }
        .el-header {
          background-color: #b3c0d1;
        }
        .el-main {
          background-color: #e9eef3;
        }
      }
      .drawer-layout-active {
        border: 1px solid #09f;
      }
      .layout-tips-warp,
      .layout-tips-warp-active {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #b3c0d1;
        border-radius: 100%;
        padding: 4px;
        .layout-tips-box {
          width: 30px;
          height: 30px;
          z-index: 9;
          border: 1px solid #b3c0d1;
          border-radius: 100%;
          .layout-tips-txt {
            position: relative;
            top: 5px;
            font-size: 12px;
            line-height: 1;
            letter-spacing: 2px;
            white-space: nowrap;
            color: #b3c0d1;
            text-align: center;
            transform: rotate(30deg);
            left: -1px;
            background-color: #e9eef3;
            width: 32px;
            height: 17px;
            line-height: 17px;
          }
        }
      }
      .layout-tips-warp-active {
        border: 1px solid #09f !important;
        .layout-tips-box {
          border: 1px solid #09f !important;
          .layout-tips-txt {
            color: #09f !important;
            background-color: #e9eef3 !important;
          }
        }
      }
      &:hover {
        .el-circular {
          transition: all 0.3s ease-in-out;
          border: 1px solid;
          border-color: #09f;
        }
        .layout-tips-warp {
          transition: all 0.3s ease-in-out;
          border-color: #09f;
          .layout-tips-box {
            transition: inherit;
            border-color: #09f;
            .layout-tips-txt {
              transition: inherit;
              color: #09f !important;
              background-color: #e9eef3 !important;
            }
          }
        }
      }
    }
  }
}
.copy-config {
  margin-top: 20px;
  .copy-config-btn {
    width: 100%;
    margin-top: 15px;
  }
}
</style>
