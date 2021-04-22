<template>
  <div class="dropdown-news">
    <transition name="el-zoom-in-top">
      <div v-show="isShow">
        <div class="sjx-box" @mouseenter="open()" @mouseleave="close()">
          <div class="head-box">
            <div class="head-box-title">通知</div>
            <div class="head-box-btn">全部已读</div>
          </div>
          <div class="content-box">
            <div class="content-box-item" v-for="v in 1" :key="v">
              <div>关于版本发布的通知</div>
              <div class="content-box-msg">
                vue-admin-wonderful， 一套为开发者快速开发准备的基于 vue2.x、 element ui 2.14.1 越看越精彩的后台管理系统一站式平台模板。 此次发布了5个模板：分为1个 pro
                版本（包含全部基础版本），4个基础版本。 可选择相对应的模板进行预览及下载，希望可以帮你完成快速开发。</div>
              <div class="content-box-time">2020-11-15</div>
            </div>
          </div>
          <div class="foot-box" @click="onOpen">前往通知中心</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'dropdownNews',
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    // 打开
    open() {
      this.isShow = true;
    },
    // 关闭
    close() {
      this.isShow = false;
    },
    // 跳转到 gitee
    onOpen() {
      window.open('https://gitee.com/lyt-top/vue-admin-wonderful');
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown-news {
  position: absolute;
  right: -106px;
  top: 50px;
  z-index: 1600;
  .sjx-box {
    width: 300px;
    position: relative;
    border-radius: 2px;
    background: white;
    border: 1px solid #ebeef5;
    border-radius: 0px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &::before {
      content: "";
      position: absolute;
      top: -5px;
      right: 115px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #ebeef5;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    &::after {
      content: "";
      position: absolute;
      top: -4px;
      right: 115px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid white;
    }
    .head-box {
      display: flex;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
      color: #333333;
      justify-content: space-between;
      height: 50px;
      align-items: center;
      padding: 0 15px;
      .head-box-btn {
        color: #0099ff;
        font-size: 13px;
        cursor: pointer;
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      }
    }
    .content-box {
      font-size: 13px;
      padding: 0 15px;
      .content-box-item {
        border-bottom: 1px solid #ebeef5;
        padding: 15px 0;
        &:last-of-type {
          border-bottom: 1px solid transparent;
        }
        .content-box-msg {
          color: #999999;
          margin-top: 5px;
          margin-bottom: 5px;
        }
        .content-box-time {
          color: #999999;
        }
      }
    }
    .foot-box {
      height: 40px;
      color: #0099ff;
      font-size: 13px;
      cursor: pointer;
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid #ebeef5;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>