<template>
  <div class="popup-warp" v-show="visible" :class="[isAddClass ? 'bindata-popup-open' : 'bindata-popup-close']"
    ref="popupWarp">
    <div class="popup-card" :class="isAddClass ? 'popup-card-open' : 'popup-card-close'">
      <div class="popup-head">
        <div class="popup-head-title">{{title}}</div>
        <i class="el-icon-close bindata-btn-close" @click="hide"></i>
      </div>
      <div :class="[$slots.footer ? 'h110' : 'h55', 'popup-body']">
        <el-scrollbar style="height:100%;">
          <slot />
        </el-scrollbar>
      </div>
      <div class="popup-footer" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 自定义弹窗：仿电视开关机
 */
export default {
  name: "popup",
  props: {
    title: {
      type: String,
      default: () => "提示",
    },
    visible: {
      type: Boolean,
      default: () => false,
    },
    appendToBody: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      isAddClass: false,
    };
  },
  methods: {
    // 隐藏 `popup` 弹窗
    hide() {
      this.isAddClass = false;
      setTimeout(() => {
        this.$emit("update:visible", false);
      }, 700);
    },
  },
  watch: {
    visible: {
      handler(bool) {
        if (bool) {
          this.isAddClass = true;
          if (!this.appendToBody) return false;
          document.body.appendChild(this.$refs.popupWarp);
        } else {
          this.isAddClass = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.popup-warp {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  color: #333333;
}
.popup-card {
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .popup-head {
    height: 55px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: white;
    border: 1px solid #eaeefb;
    .popup-head-title {
      flex: 1;
      font-weight: 500;
      font-size: 16px;
    }
    .bindata-btn-close {
      font-size: 20px;
      cursor: pointer;
      color: gray;
      &:hover {
        color: #09f;
      }
    }
  }
  .popup-body {
    background: white;
    padding: 15px;
    overflow: hidden;
    border: 1px solid #eaeefb;
    border-top: none;
  }
  .popup-footer {
    height: 55px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: white;
    border: 1px solid #eaeefb;
    border-top: none;
    justify-content: flex-end;
  }
  .h55 {
    height: calc(100% - 55px);
  }
  .h110 {
    height: calc(100% - 110px);
  }
}
.popup-card-open,
.popup-card-close {
  padding: 15px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
.popup-card-open {
  animation: open-fade 0.5s ease-out 0.7s both;
}
.popup-card-close {
  animation: close-fade 0.5s ease-out both;
}
.bindata-popup-open:before,
.bindata-popup-close:before {
  content: "";
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  top: 50%;
  will-change: height, top;
  background: #f5f5f5;
}
.bindata-popup-open:before {
  animation: open-animation 0.5s cubic-bezier(0.83, 0.04, 0, 1.16) 0.1s both;
}
.bindata-popup-close:before {
  animation: close-animation 0.5s cubic-bezier(0.83, 0.04, 0, 1.16) 0.1s both;
}
@keyframes open-animation {
  0% {
    height: 0;
    top: 50%;
  }
  100% {
    height: 100vh;
    top: 0;
  }
}
@keyframes close-animation {
  0% {
    height: 100vh;
    top: 0;
  }
  100% {
    height: 0;
    top: 50%;
  }
}
@keyframes open-fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes close-fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>