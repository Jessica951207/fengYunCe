<template>
  <div class="comment">
    <el-card>
      <div slot="header">
        <span>论坛评价</span>
      </div>
      <div class="comment-card">
        <div class="main-textarea top-level-textarea">
          <div class="main-textarea-img">
            <img
              src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg" />
          </div>
          <div class="main-textarea-content">
            <el-rate v-model="level.topLevelRatesVal"></el-rate>
            <div class="main-textarea-content-input">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="写下你的评论..."
                class="main-textarea-content-txt" ref="topLevelInputValRef" v-model="level.topLevelInputVal"
                @input="onInputChange(level,'topLevelInputVal',$event)" @keyup.enter.native.stop="onTopLevelPublish">
              </el-input>
              <div class="main-textarea-content-btn">
                <el-button type="primary" size="mini" @click="onTopLevelPublish">发布评论</el-button>
              </div>
            </div>
          </div>
        </div>
        <template v-if="commentList.length > 0">
          <div class="discuss-list" v-for="(val,key) in commentList" :key="key">
            <div class="discuss-list-left">
              <img
                src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg" />
            </div>
            <div class="discuss-list-right">
              <div class="discuss-list-right-top">
                <div class="name">
                  <span>{{val.userName}}</span>
                  <el-rate disabled disabled-void-color="#D8D8D8" text-color="#ff9900" show-score
                    v-model="val.mainRateValue" score-template="{value}"></el-rate>
                </div>
                <div class="desc main" :style="{'max-height': val.isShowMainMoreDesc ? 'unset' : '100px'}"
                  ref="descMainList">{{val.content}}</div>
                <div class="info">
                  <div class="time">{{formatPastTime(val.createdTime)}}</div>
                  <div class="btn">
                    <span @click="onMianShowInput(val,key)">
                      <i :class="val.isShowMainInput?'el-icon-chat-round':'el-icon-chat-line-round'"></i>
                      {{val.isShowMainInput ? '取消回复' : '回复'}}
                    </span>
                    <span class="m-l-10" v-if="val.isShowMainMoreBtn" @click="onFullText(val,key)">
                      <i :class="!val.isShowMainMoreDesc?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
                      {{!val.isShowMainMoreDesc?'展开':'收起'}}全文
                    </span>
                    <span class="m-l-10" v-if="val.children.length > 0" @click="onFullChat(val,key)">
                      <i :class="val.isShowMainMoreChat?'el-icon-chat-dot-square':'el-icon-chat-square'"></i>
                      {{val.isShowMainMoreChat?'展开':'收起'}}评论
                    </span>
                  </div>
                </div>
              </div>
              <div class="main-textarea" v-if="val.isShowMainInput">
                <div class="main-textarea-img">
                  <img
                    src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg" />
                </div>
                <div class="main-textarea-content">
                  <el-rate v-model="val.mainRateVal"></el-rate>
                  <div class="main-textarea-content-input">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="val.mainPlaceholder"
                      class="main-textarea-content-txt" :ref="`mainInputRef${key}`" v-model="val.mainInputVal"
                      @input="onInputChange(val,'mainInputVal',$event)"
                      @keyup.enter.native.stop="onMainPublish(val,key)"></el-input>
                    <div class="main-textarea-content-btn">
                      <el-button type="primary" size="mini" @click="onMainPublish(val,key)">发布</el-button>
                      <el-button size="mini" @click="val.isShowMainInput = false">取消</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="discuss-list-right-foot" v-show="val.children.length > 0 && !val.isShowMainMoreChat">
                <div class="foot-box" v-for="(v,k) in val.children" :key="k">
                  <div class="left-img">
                    <img
                      src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg" />
                  </div>
                  <div class="right-content">
                    <div class="name">
                      <span class="name-mr10">{{v.userName}}</span>
                      <el-rate disabled disabled-void-color="#D8D8D8" v-model="v.chilRateValue" v-if="!v.chilResponder">
                      </el-rate>
                    </div>
                    <div class="desc chil" :style="{'max-height': v.isShowChilMoreDesc ? 'unset' : '100px'}"
                      ref="descChilList" :data-key="key">
                      <span v-if="v.chilResponder">回复{{v.chilResponder}}：</span>
                      <span class="desc-opacity">{{v.content}}</span>
                      <span class="desc-more" v-if="v.isShowChilMoreBtn"
                        @click="onFullItemText(v, k)">{{!v.isShowChilMoreDesc?'展开':'收起'}}</span>
                    </div>
                    <div class="info">
                      <div class="time">{{formatPastTime(v.createdTime)}}</div>
                      <div class="btn">
                        <span @click="onChilShowInput(key, v, k)">
                          <i :class="v.isShowChilInput?'el-icon-chat-round':'el-icon-chat-line-round'"></i>
                          {{v.isShowChilInput ? '取消回复' : '回复'}}
                        </span>
                      </div>
                    </div>
                    <div class="main-textarea chil-textarea" v-if="v.isShowChilInput">
                      <div class="main-textarea-content">
                        <div class="main-textarea-content-input">
                          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="v.chilPlaceholder" class="main-textarea-content-txt"
                            :ref="`chilInputRef${key}${k}`" v-model="v.chilInputVal"
                            @input="onInputChange(v,'chilInputVal',$event)"
                            @keyup.enter.native.stop="onChilPublish(val, key, v, k)"></el-input>
                          <div class="main-textarea-content-btn">
                            <el-button type="primary" size="mini" @click="onChilPublish(val, key, v, k)">发布</el-button>
                            <el-button size="mini" @click="v.isShowChilInput = false">取消</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="val.isExpandMoreClick">
                  <div class="more-foot-box" @click="onChilExpandMore(val,key)" v-if="val.isExpandMore">
                    更多评论
                    <i class="el-icon-arrow-right"></i>
                  </div>
                  <div class="more-foot-box" @click="onChilRetractMore(val,key)" v-else>
                    收起评论
                    <i class="el-icon-arrow-up"></i>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-comment">
            <span>暂无评论</span>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
// 评论组件
import { formatPast } from "@/utils/formatTime";
import { commentListMock } from "./mock.js";
export default {
  name: "comment",
  data() {
    return {
      commentList: [],
      level: {
        topLevelInputVal: "",
        topLevelRatesVal: 0,
      },
    };
  },
  mounted() {
    this.initData();
    this.initDiscussList();
  },
  methods: {
    // 时间格式化
    formatPastTime(time) {
      return formatPast(time);
    },
    /**
     * 初始化数据
     * 1.1 针对一次性返回全部子级，截取子级前两条做显示(不建议使用)
     * 2.2 针对分页的为点击 `更多评论` 后查询接口
     */
    initData() {
      this.commentList = this.initDynamicAddAttr(commentListMock);
    },
    // 数据初始化，动态添加属性
    initDynamicAddAttr(arr) {
      let arrs = [];
      let list = JSON.parse(JSON.stringify(arr));
      list.map((val) => {
        val["mainPlaceholder"] = "写下你的评论..."; // input 的 placeholder
        val["mainRateVal"] = 0; // 评星星el-rate input v-model 初始值(回复顶级时可星星，子级回复子级不可评分)
        val["mainInputVal"] = ""; // input v-model 初始值
        val["isShowMainInput"] = false; // 是否显示 input 回复框
        val["isShowMainMoreDesc"] = false; // 是否显示展开（收起）全文
        val["isShowMainMoreChat"] = false; // 是否显示展开（收起）评论
        val["isExpandMore"] = false; // 是否显示子级中的更多评论 按钮
        val["isExpandMoreClick"] = false; // 子级中的 `更多评论` 按钮是否
        val["oldChildren"] = val.children; // 记录原数组子级，子级更多评价时使用(更多评论->收起评论)
        if (val.children.length > 2) {
          val["isExpandMore"] = true;
          val["isExpandMoreClick"] = true;
          val.children = val.children.slice(0, 2); // slice、map、filter、concat 不改变原数组长度
        }
        val.children.map((v) => {
          v["chilPlaceholder"] = "写下你的评论...";
          v["chilInputVal"] = "";
          v["isShowChilInput"] = false;
          v["isShowChilMoreDesc"] = false;
        });
        arrs.push({ ...val });
      });
      return arrs;
    },
    // 子级收起更多评价(子级展开更多评价)
    chilRetractAndExpand(val) {
      let obj = {
        chilPlaceholder: "写下你的评论...",
        chilInputVal: "",
        isShowChilInput: false,
        isShowChilMoreDesc: false,
      };
      val.oldChildren.map((v) => {
        val.children.push({ ...obj, ...v });
      });
      return val;
    },
    // 子级收起更多评价
    onChilRetractMore(val, key) {
      val.isExpandMore = true;
      val.oldChildren = JSON.parse(JSON.stringify(val.children));
      val.children = val.children.slice(0, 2);
    },
    // 子级展开更多评价
    onChilExpandMore(val, key) {
      val.isExpandMore = false;
      val.children = this.duplicate(
        this.chilRetractAndExpand(val).children,
        "id"
      );
      this.refsElsFunChil("children");
    },
    // 子级展开更多评价(收起更多评价)数组对象去重
    duplicate(arr, type) {
      if (arr.length == 0) {
        return arr;
      } else {
        if (type) {
          var obj = {};
          var newArr = arr.reduce((cur, next) => {
            obj[next[type]] ? "" : (obj[next[type]] = true && cur.push(next));
            return cur;
          }, []);
          return newArr;
        } else {
          return Array.from(new Set(arr));
        }
      }
    },
    // 初始化
    initDiscussList() {
      this.refsElsFunMain();
      this.refsElsFunChil("children");
    },
    // 动态显示展开全文按钮
    refsElsFunMain() {
      this.$nextTick(() => {
        if (this.commentList.length <= 0) return false;
        const mainEls = this.$refs["descMainList"];
        mainEls.map((v, k) => {
          v.scrollHeight > v.clientHeight
            ? this.$set(this.commentList[k], "isShowMainMoreBtn", true)
            : this.$set(this.commentList[k], "isShowMainMoreBtn", false);
        });
      });
    },
    // 动态显示展开评论按钮
    refsElsFunChil(attr) {
      this.$nextTick(() => {
        const chilEls = this.$refs["descChilList"];
        if (chilEls == undefined) return false;
        let newChilEls = this.mergeArray(chilEls);
        newChilEls.map((val, key) => {
          val.data.map((v, k) => {
            if (this.commentList[v.dataset.key][attr].length <= 0) return false;
            if (v.scrollHeight > v.clientHeight) {
              this.$set(
                this.commentList[v.dataset.key][attr][k],
                "isShowChilMoreBtn",
                true
              );
            } else {
              this.$set(
                this.commentList[v.dataset.key][attr][k],
                "isShowChilMoreBtn",
                false
              );
            }
          });
        });
      });
    },
    /**
     * 根据某个值合并数组(id)
     * 1.1 通过 dom 设置 `:dataset-key="key"`， 查询当前 this.$refs["descChilList"]
     * 属于哪个顶级下。
     * 1.2 动态设置每一项子级 `isShowChilMoreBtn` 来实现动态显示展开评论按钮
     * 1.3 由于最顶级数据是 unshift 进 this.commentList 数组中的，
     * this.$refs["descChilList"] 处理后（mergeArray方法），根据 id 进行排序即可
     */
    mergeArray(arr) {
      let newArr = [];
      let teamArr = [];
      let listData = arr;
      for (let i = 0; i < listData.length; i++) {
        if (!teamArr.includes(listData[i].dataset.key)) {
          newArr.push({
            id: listData[i].dataset.key,
            data: [listData[i]],
          });
          teamArr.push(listData[i].dataset["key"]);
        } else {
          for (let n = 0; n < newArr.length; n++) {
            if (newArr[n]["id"] == listData[i].dataset["key"]) {
              newArr[n].data.push(listData[i]);
              break;
            }
          }
        }
      }
      return newArr.sort(this.sortArrData);
    },
    // 数组排序
    sortArrData(a, b) {
      return a.id - b.id;
    },
    // 禁止输入空格
    onInputChange(item, attr, e) {
      this.$set(item, attr, e.replace(/\s+/g, ""));
    },
    // 子级评价展开按钮点击（当内容过多时显示此按钮）
    onFullItemText(v, k) {
      v.isShowChilMoreDesc = !v.isShowChilMoreDesc;
    },
    // 父级展开评价点击
    onFullChat(val, key) {
      val.isShowMainMoreChat = !val.isShowMainMoreChat;
    },
    // 父级展开全文点击
    onFullText(val, key) {
      val.isShowMainMoreDesc = !val.isShowMainMoreDesc;
    },
    // 父级回复
    onMianShowInput(val, key) {
      val.isShowMainInput = !val.isShowMainInput;
      this.mainFocus(val, key);
    },
    // 父级回复获取焦点
    mainFocus(val, key) {
      if (!val.isShowMainInput) return false;
      val.mainPlaceholder = `正在回复 ${val.userName}`;
      this.$nextTick(() => {
        this.$refs[`mainInputRef${key}`][0].focus();
      });
    },
    // 子级回复
    onChilShowInput(key, v, k) {
      v.isShowChilInput = !v.isShowChilInput;
      this.chilFocus(key, v, k);
    },
    // 子级回复获取焦点
    chilFocus(key, v, k) {
      if (!v.isShowChilInput) return false;
      v.chilPlaceholder = `正在回复 ${v.userName}`;
      this.$nextTick(() => {
        this.$refs[`chilInputRef${key}${k}`][0].focus();
      });
    },
    // 顶级发布按钮
    onTopLevelPublish() {
      let { topLevelInputVal, topLevelRatesVal } = this.level;
      if (topLevelInputVal === "") {
        this.$nextTick(() => {
          this.$refs["topLevelInputValRef"].focus();
        });
      } else if (topLevelRatesVal === 0) {
        this.$message.warning("请选择评分！");
      } else {
        // 顶级必填字段
        let objLevel = {
          mainPlaceholder: "写下你的评论...",
          mainRateVal: 0,
          mainInputVal: "",
          isShowMainInput: false,
          isShowMainMoreDesc: false,
          isShowMainMoreChat: false,
          isExpandMore: false,
          isExpandMoreClick: false,
          oldChildren: [],
        };
        // 接口返回字段
        let obj = {
          userName: `最顶级节点${Math.random() * 100}`,
          content: this.level.topLevelInputVal,
          mainRateValue: this.level.topLevelRatesVal,
          id: Math.random() * 100,
          createdTime: new Date(),
          children: [],
        };
        let param = Object.assign({}, objLevel, obj);
        this.commentList.unshift({ ...param });
        // 初始化
        this.level.topLevelInputVal = "";
        this.level.topLevelRatesVal = 0;
        // 动态显示展开全文按钮
        this.refsElsFunMain();
      }
    },
    // 父级发布按钮
    onMainPublish(val, key) {
      if (val.mainInputVal === "") {
        this.mainFocus(val, key);
      } else if (val.mainRateVal === 0) {
        this.$message.warning("请选择评分！");
      } else {
        // children 必填字段
        let objChil = {
          chilPlaceholder: "写下你的评论...",
          chilInputVal: "",
          isShowChilInput: false,
          isShowChilMoreDesc: false,
        };
        // 接口返回字段
        let obj = {
          userName: `小帅帅${Math.random() * 100}`,
          content: val.mainInputVal,
          id: Math.random() * 100,
          chilRateValue: val.mainRateVal,
          createdTime: new Date(),
        };
        let param = Object.assign({}, objChil, obj);
        if (val.children.length > 0) {
          val.children.unshift({ ...param });
        } else {
          val.children.push({ ...param });
        }
        // 初始化 input
        val.isShowMainInput = false;
        val.mainInputVal = "";
        val.mainRateVal = 0;
        // 动态显示展开评论按钮
        this.refsElsFunChil("children");
      }
    },
    // 子级发布按钮
    onChilPublish(val, key, v, k) {
      if (v.chilInputVal == "") {
        this.chilFocus(key, v, k);
      } else {
        /**
         * 1.1 因为只有数组只有2级，所以不管是父级回复还是子级回复都是在数组的第二级，
         * 所以 `children` 必填字段与父级发布按钮点击时的参数一致
         * 1.2 子级不可以进行评分，chilResponder：null 未回复。chilResponder: '李二狗' 被人回复
         */
        // children 必填字段
        let objChil = {
          chilPlaceholder: "写下你的评论...",
          chilInputVal: "",
          isShowChilInput: false,
          isShowChilMoreDesc: false,
        };
        // 接口返回字段
        let obj = {
          userName: `我很丑但是很温柔${Math.random() * 100}`,
          content: v.chilInputVal,
          id: Math.random() * 100,
          chilRateValue: v.chilRateValue,
          chilResponder: v.userName,
          createdTime: new Date(),
        };
        let param = Object.assign({}, objChil, obj);
        val.children.unshift({ ...param });
        // 初始化 input
        v.isShowChilInput = false;
        v.chilInputVal = "";
        // 动态显示展开评论按钮
        this.refsElsFunChil("children");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.comment {
  .comment-card {
    padding: 15px;
    .discuss-list {
      display: flex;
      color: #333;
      margin-top: 20px;
      &:last-of-type {
        .discuss-list-right {
          padding-bottom: 0px !important;
          border-bottom: 1px solid transparent !important;
        }
      }
      .discuss-list-left {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
          border: 1px solid #fff;
        }
      }
      .discuss-list-right {
        flex: 1;
        padding-bottom: 20px;
        border-bottom: 1px solid #eeeeee;
        .discuss-list-right-top {
          .name {
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            ::v-deep .el-rate__text {
              font-weight: normal;
            }
          }
          .desc {
            padding: 5px 0;
            font-size: 14px;
            line-height: 24px;
            overflow: hidden;
          }
          .info {
            font-size: 14px;
            display: flex;
            color: #ababab;
            align-items: center;
            margin-top: 5px;
            .btn {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              .m-l-10 {
                margin-left: 10px;
              }
              span {
                cursor: pointer;
                &:hover {
                  color: gray;
                }
              }
            }
          }
        }
        .discuss-list-right-foot {
          margin-top: 10px;
          background: #f5f5f5;
          padding: 20px;
          border-radius: 1px;
          .foot-box {
            display: flex;
            margin-top: 20px;
            .left-img {
              width: 40px;
              height: 40px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
                border: 1px solid #fff;
              }
            }
            .right-content {
              flex: 1;
              .name {
                font-weight: 700;
                font-size: 14px;
                display: flex;
                align-items: center;
                margin-bottom: 5px;
                .name-mr10 {
                  margin-right: 10px;
                }
              }
              .desc {
                font-size: 14px;
                line-height: 24px;
                overflow: hidden;
                position: relative;
                .desc-opacity {
                  opacity: 0.8;
                }
                .desc-more {
                  position: absolute;
                  right: 0;
                  bottom: 4px;
                  color: #409eff;
                  cursor: pointer;
                  padding-left: 10px;
                  background: linear-gradient(
                    to right,
                    rgba(245, 245, 245, 0.9),
                    rgba(245, 245, 245, 1)
                  );
                }
              }
              .info {
                font-size: 14px;
                display: flex;
                color: #ababab;
                align-items: center;
                margin-top: 5px;
              }
              .time {
                margin-right: 20px;
              }
              .btn {
                flex: unset !important;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .m-l-10 {
                  margin-left: 10px;
                }
                span {
                  cursor: pointer;
                  &:hover {
                    color: gray;
                  }
                }
              }
            }
          }
          .more-foot-box {
            font-size: 14px;
            cursor: pointer;
            color: #ababab;
            margin-top: 15px;
            display: inline-block;
            &:hover {
              color: gray;
            }
          }
        }
      }
    }
    .no-comment {
      height: 200px;
      display: flex;
      font-size: 14px;
      color: #ababab;
      span {
        margin: auto;
      }
    }
  }
  // 回复框
  .main-textarea {
    display: flex;
    margin: 20px 0;
    .main-textarea-img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        border: 1px solid #fff;
      }
    }
    .main-textarea-content {
      width: 100%;
      .main-textarea-content-input {
        width: 100%;
        .main-textarea-content-txt {
          font-size: 14px;
          margin: 15px 0;
          width: 100%;
        }
        .main-textarea-content-btn {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
  .chil-textarea {
    margin: unset !important;
  }
  .top-level-textarea {
    padding-bottom: 20px;
    border-bottom: 1px solid #eeeeee;
    margin-top: 0px !important;
  }
}
</style>