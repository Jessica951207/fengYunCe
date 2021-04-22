<template>
  <div class="dropdown-news">
    <transition name="el-zoom-in-top">
      <div v-show="isShow">
        <div class="sjx-box">
          <div class="content-box">
            <el-scrollbar style="height:100%;">
              <ul class="icon-list">
                <li v-for="(v,k) in iconList" :key="k" @click="onLiClick(v)">
                  <span>
                    <i :class="v"></i>
                    <span class="icon-name">{{v}}</span>
                  </span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { iconList } from '../mock/iconZoom'
export default {
  name: 'dropdownNews',
  data() {
    return {
      isShow: false,
      iconList
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
    // 当前图标点击
    onLiClick(v) {
      this.$emit('sendIcon', v)
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown-news {
  position: absolute;
  right: 0px;
  top: 45px;
  z-index: 1600;
  .sjx-box {
    width: 400px;
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
      left: 136px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #dcdfe6;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
    }
    &::after {
      content: "";
      position: absolute;
      top: -4px;
      left: 136px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid white;
      border-radius: 2px;
    }
    .content-box {
      height: 280px;
      .icon-list {
        overflow: hidden;
        list-style: none;
        padding: 0 !important;
        border: 1px solid #eaeefb;
        border-radius: 4px;
        li {
          float: left;
          width: 25%;
          text-align: center;
          height: 100px;
          line-height: 100px;
          color: #666;
          font-size: 13px;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          &::after {
            content: "";
            height: 100%;
            display: inline-block;
            vertical-align: middle;
          }
          &:hover {
            i,
            .icon-name {
              cursor: pointer;
              color: #5cb6ff !important;
            }
          }
          i {
            display: block;
            font-size: 20px;
            color: #606266;
            transition: color 0.15s linear;
          }
          span {
            line-height: normal;
            color: #99a9bf;
            transition: color 0.15s linear;
            display: inline-block;
            vertical-align: middle;
          }
          .icon-name {
            display: inline-block;
            padding: 0 3px;
            height: 1em;
            transition: color 0.15s linear;
          }
        }
      }
    }
  }
}
</style>