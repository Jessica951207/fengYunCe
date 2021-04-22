<template>
  <div class="filtering">
    <el-card class="filtering-list">
      <div v-for="(val,key) in filtering" :key="key" ref="dlRef" class="filtering-list-flex">
        <div class="filtering-list-title">{{val.title}}</div>
        <div class="filtering-list-item" :style="{'height': val.isMore ? 'auto' : '50px' }">
          <span :class="v.active ? 'dd-active' : ''" v-for="(v,k) in val.children" :key="k"
            @click="onSelItem(val,v)">{{v.label}}</span>
          <div class="dd-more" v-if="val.isShowMore" @click="val.isMore = !val.isMore">
            <font>{{val.isMore ? '收起' : '展开'}}</font>
            <i :class="val.isMore ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="filtering-list br-top-no" v-loading="tableData.loading" element-loading-text="加载中..."
      element-loading-background="rgba(255, 255, 255, 0.1)" :class="{'min-h-360': tableData.data.length <= 0}">
      <div class="flex-warp" v-if="tableData.data.length > 0">
        <div class="flex-warp-item" v-for="(v,k) in tableData.data" :key="k" @click="onTableItemClick(v)">
          <div class="flex-warp-item-box">
            <div class="item-img">
              <img :src="v.img" />
            </div>
            <div class="item-txt">
              <div class="item-txt-title">{{v.title}}</div>
              <div class="item-txt-other">
                <div style="width: 100%;">
                  <div class="item-txt-msg mb10">
                    <span>评价 {{v.evaluate}}</span>
                    <span class="ml10">收藏 {{v.collection}}</span>
                  </div>
                  <div class="item-txt-msg item-txt-price">
                    <span class="font-price">
                      <span>￥</span>
                      <font>{{v.price}}</font>
                    </span>
                    <span>月销{{v.monSales}}笔</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="filtering-no-data">
        <div class="no-data-box">
          <i class="el-icon-search"></i>
          <div class="no-txt">暂无数据</div>
        </div>
      </div>
    </el-card>
    <el-card class="filtering-list br-top-no" v-if="tableData.data.length > 0">
      <el-pagination style="text-align: right;" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :page-sizes="[10, 20, 30]" :current-page="tableData.param.pageNum"
        :page-size="tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { filtering, filterList } from "./mock/index";
export default {
  name: "filtering",
  data() {
    return {
      filtering,
      tableData: {
        data: filterList,
        total: 99,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    };
  },
  mounted() {
    this.init();
    window.onresize = () => {
      this.init();
    };
  },
  methods: {
    // 初始化 `收起、展开` 按钮
    init() {
      this.$nextTick(() => {
        const els = this.$refs["dlRef"];
        els.map((v, k) => {
          v.scrollHeight < v.lastChild.scrollHeight
            ? this.$set(this.filtering[k], "isShowMore", true)
            : this.$set(this.filtering[k], "isShowMore", false);
        });
      });
    },
    // 过滤当前选中的数据
    onSelItem(val, v) {
      val.children.map((v) => (v.active = false));
      v.active = true;
      let arr = [];
      this.filtering.map((item) => {
        item.children.map((chil) => {
          if (chil.active) {
            arr.push({
              ...item,
              children: [{ ...chil }],
            });
          }
        });
      });
      this.tableData.loading = true;
      setTimeout(() => {
        this.tableData.loading = false;
      }, 500);
    },
    // 当前列表项点击
    onTableItemClick(v) {
      this.$router.push({
        path: '/demo/filtering-details',
        query: { id: v.id }
      })
    },
    // 分页点击
    handleSizeChange(val) {
      this.tableData.param.pageSize = val;
    },
    // 分页点击
    handleCurrentChange(val) {
      this.tableData.param.pageNum = val;
    },
  },
};
</script>

<style scoped lang="scss">
.filtering {
  .filtering-list {
    overflow: hidden;
    padding: 15px;
    .filtering-list-flex {
      &:last-of-type {
        .filtering-list-item {
          border-bottom: none !important;
        }
      }
      .filtering-list-title {
        float: left;
        width: 64px;
        font-weight: 700;
        position: relative;
        color: #909399;
        margin: 15px 0;
        &:after {
          content: "";
          position: absolute;
          border: 1px solid #909399;
          border-width: 0 1px 1px 0;
          width: 4px;
          height: 4px;
          transform: rotate(-45deg) translateY(-50%);
          right: 10px;
          top: 50%;
        }
      }
      .filtering-list-item {
        border-bottom: 1px dotted #e0e0e0;
        margin-left: 64px;
        overflow: hidden;
        position: relative;
        span {
          color: #8d8d91;
          font-size: 14px;
          float: left;
          padding: 0 15px;
          margin: 15px 0;
          &:hover {
            color: #09f;
            cursor: pointer;
          }
        }
        .dd-active {
          color: #09f;
        }
        .dd-more {
          font-size: 12px;
          position: absolute;
          right: 0;
          top: 16px;
          color: #a5a5a5;
          &:hover {
            cursor: pointer;
            color: #8d8d91;
          }
        }
      }
    }
  }
  .br-top-no {
    border-top: none;
    .flex-warp {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      margin: 0 -5px;
      .flex-warp-item {
        padding: 5px;
        width: 20%;
        height: 360px;
        .flex-warp-item-box {
          border: 1px solid #ebeef5;
          width: 100%;
          height: 100%;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          &:hover {
            cursor: pointer;
            border: 1px solid #09f;
            transition: all 0.3s ease;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
            .item-txt-title {
              color: #09f !important;
              transition: all 0.3s ease;
            }
            .item-img {
              img {
                transition: all 0.3s ease;
                transform: translateZ(0) scale(1.05);
              }
            }
          }
          .item-img {
            width: 100%;
            height: 215px;
            overflow: hidden;
            img {
              transition: all 0.3s ease;
              width: 100%;
              height: 100%;
            }
          }
          .item-txt {
            flex: 1;
            padding: 15px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            .item-txt-title {
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              color: #666666;
              transition: all 0.3s ease;
              &:hover {
                color: #09f;
                text-decoration: underline;
                transition: all 0.3s ease;
              }
            }
            .item-txt-other {
              flex: 1;
              align-items: flex-end;
              display: flex;
              .item-txt-msg {
                font-size: 12px;
                color: #8d8d91;
              }
              .item-txt-price {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .font-price {
                  color: #ff5000;
                  font {
                    font-size: 22px;
                  }
                }
              }
            }
          }
        }
      }
    }
    ::v-deep .el-card__body {
      height: 100%;
      .filtering-no-data {
        display: flex;
        height: 100%;
        .no-data-box {
          color: #cccccc;
          margin: auto;
          i {
            font-size: 70px;
          }
          .no-txt {
            font-size: 14px;
            text-align: center;
            margin-top: 15px;
          }
        }
      }
    }
  }
  .min-h-360 {
    height: 360px;
  }
}
</style>