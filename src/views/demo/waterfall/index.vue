<template>
  <div class="waterfall" :style="styleHeight">
    <ul class="waterfall-box" ref="waterfall" @scroll="onScroll">
      <transition-group name="waterfall-li">
        <li class="waterfall-item" @click="onOpenPage(v)" v-for="(v,k) in waterfallList" :key="v.id"
          :style="{top:v.top+ 'px',left:v.left+'px', width:v.width+'px', height:v.height + 'px'}">
          <div class="img-box" @mouseenter="onMouseleaveAndEnter('enter', $event, k)"
            @mouseleave="onMouseleaveAndEnter('leave', $event, k)">
            <img :src="v.src" />
            <div class="img-mask" ref="imgMaskRef">
              <div class="img-mask-box">
                <div class="img-mask-title">{{ v.title }}</div>
                <div class="img-mask-size">
                  {{ v.width }}x{{ v.height }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
    <el-backtop target=".waterfall .waterfall-box" :visibility-height="400"></el-backtop>
  </div>
</template>

<script>
import { imgList } from "./mock.js";
export default {
  name: "waterfall",
  data() {
    return {
      waterfallList: [],
      waterfallCofig: {
        col: 5, // 每行数量
        colwidth: 236, // 每行每项宽度
        colHeights: [], // 每项高度集合
        marginRight: 10, // 右外边距
        marginBottom: 10, // 下外边距
        loading: false, // 是否加载完成
      },
      params: {
        pageSize: 1,
        pageNumber: 20
      }
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    // 动态高度，适配各布局。单页面的话，高度设为100%即可。
    styleHeight() {
      let { layout, isTagsView } = this.$store.state.layoutConfig
      if (layout === 'fashion' || layout === 'strange') {
        if (isTagsView) {
          return {
            height: `calc(100vh - 84px)`
          }
        } else {
          return {
            height: `calc(100vh - 50px)`
          }
        }
      } else {
        return {
          height: `calc(100vh - 50px)`
        }
      }
    }
  },
  methods: {
    // 打开链接
    onOpenPage(v) {
      window.open(v.src);
    },
    // 初始化布局，初始化时，每栏高度都为0
    init() {
      this.waterfallCofig.colHeights = new Array(this.waterfallCofig.col);
      for (let i = 0; i < this.waterfallCofig.colHeights.length; i++) {
        this.waterfallCofig.colHeights[i] = 0;
      }
      this.waterfallCofig.colWidth =
        (this.$refs.waterfall.clientWidth -
          (this.waterfallCofig.col - 1) * this.waterfallCofig.marginRight) /
        this.waterfallCofig.col;
      this.loadImgs();
    },
    // 处理每项图片
    loadImgs() {
      this.waterfallCofig.loading = true;
      // 接口获取数据
      // getImgList(this.params).then(res => {
      //   if (res.data) let images = res.data;
      let images = imgList;
      let promiseAll = [],
        imgs = []
      for (let i = 0; i < imgList.length; i++) {
        promiseAll[i] = new Promise(resolve => {
          imgs[i] = new Image();
          imgs[i].src = images[i].url;
          imgs[i].onload = () => {
            let imgData = {};
            imgData.height = Math.floor((imgs[i].height * this.waterfallCofig.colWidth) / imgs[i].width);
            imgData.width = Math.floor(this.waterfallCofig.colWidth);
            imgData.src = images[i].url;
            imgData.title = images[i].title;
            imgData.id = Math.random() * 10000;
            this.waterfallList.push(imgData);
            this.rankImgs(imgData);
            resolve(imgs[i]);
          };
        });
      }
      Promise.all(promiseAll).then(() => {
        this.waterfallCofig.loading = false;
        this.loadMore();
      });
      // })
    },
    // 加载更多
    loadMore() {
      if (
        this.$refs.waterfall.clientHeight + this.$refs.waterfall.scrollTop >
        this.filterMin().minHeight &&
        this.waterfallCofig.loading == false
      ) {
        this.waterfallCofig.loading = true;
        setTimeout(() => {
          this.loadImgs();
        }, 200);
      }
    },
    // 处理每项图片的偏移量
    rankImgs(imgData) {
      let min = this.filterMin();
      imgData.top = min.minHeight;
      imgData.left = min.minIndex * (this.waterfallCofig.colWidth + this.waterfallCofig.marginRight);
      this.waterfallCofig.colHeights[min.minIndex] += imgData.height + this.waterfallCofig.marginBottom;
    },
    // 图片最小值计算
    filterMin() {
      let minHeight = Math.min.apply(null, this.waterfallCofig.colHeights);
      return {
        minHeight: minHeight,
        minIndex: this.waterfallCofig.colHeights.indexOf(minHeight)
      };
    },
    // 滚动时加载更多
    onScroll() {
      this.loadMore();
    },
    // 鼠标移入移出方向判断
    onMouseleaveAndEnter(t, e, k) {
      let els = this.$refs.imgMaskRef;
      if (!els) return false;
      let dir = this.setDirection(e);
      let dirPos = {
        top: `bottom: 100%;left: 0`,
        right: `bottom: 0;left: 100%`,
        bottom: `bottom: -100%;left: 0`,
        left: `bottom: 0;left: -100%`,
      };
      if (t === "enter") {
        els[k].style.cssText = `${dirPos[dir]};transition: none;`;
        setTimeout(() => {
          els[k].style.cssText = `bottom:0;left:0;transition: all 0.3s ease;`;
        }, 0);
      } else {
        els[k].style.cssText = `${dirPos[dir]};transition: all 0.3s ease;`;
      }
    },
    // 鼠标移入移出方向判断
    setDirection(e) {
      let dirs = ["top", "right", "bottom", "left"];
      var w = e.target.offsetWidth,
        h = e.target.offsetHeight,
        t = e.target.style.top.replace(/px/gi, ""),
        l = e.target.style.left.replace(/px/gi, ""),
        x = (e.offsetX - l - w / 2) * (w > h ? h / w : 1),
        y = (e.offsetY - t - h / 2) * (h > w ? w / h : 1),
        d = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
      return dirs[d];
    },
  },
};
</script>

<style scoped lang="scss">
.waterfall {
  width: 100%;
  overflow: hidden;
  position: relative;
  .waterfall-box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    list-style: none;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03) !important;
    .waterfall-li-enter-active,
    .waterfall-li-leave-active {
      transition: all 1s;
    }
    .waterfall-li-enter,
    .waterfall-li-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }
    .waterfall-item {
      position: absolute;
      list-style: none;
      .img-box {
        width: 100%;
        height: 100%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
        border: 1px solid #ebeef5;
        background: #fff;
        overflow: hidden;
        position: relative;
        backface-visibility: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .img-mask {
          position: absolute;
          width: 100%;
          height: 50px;
          color: #fff;
          font-size: 12px;
          backface-visibility: hidden;
          background: url("https://gitee.com/lyt-top/vue-admin-wonderful-images/raw/master/images/demo/waterfall/shadow.png") repeat-x;
          overflow: hidden;
          padding: 0 10px;
          display: flex;
          align-items: center;
          flex-direction: column;
          .img-mask-box {
            width: 100%;
            margin: auto;
            .img-mask-title {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-shadow: 1px 1px rgba(0, 0, 0, 1);
            }
            .img-mask-size {
              color: rgba(255, 255, 255, 0.6);
              margin-top: 3px;
            }
          }
        }
      }
    }
  }
}
</style>