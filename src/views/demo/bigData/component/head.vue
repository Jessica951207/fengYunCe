<template>
  <div class="big-data-up">
    <div class="up-left">
      <i class="el-icon-time mr5"></i>
      <span>{{ time.txt }}</span>
    </div>
    <div class="up-center">
      <span @click="$router.go(-1)">智慧农业系统平台</span>
    </div>
    <div class="up-right">
      <el-dropdown @command="$emit('handle-click')">
        <span class="el-dropdown-link">
          {{ listActive }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(v, k) in list" :key="k" @click.native="onDropdownItemClick(v)">{{ v.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="ml15">
        <i class="el-icon-bell mr5"></i>
        <span>消息</span>
      </div>
      <div class="ml15">
        <i class="el-icon-user mr5"></i>
        <span>个人</span>
      </div>
      <div class="ml15" @click="signOut()">
        <i class="el-icon-switch-button mr5"></i>
        <span>返回</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/formatTime";
export default {
  name: "bigHead",
  data() {
    return {
      time: {
        txt: "",
        fun: null,
      },
      list: [
        {
          label: "广东省农业农村厅",
        },
        {
          label: "广西省农业农村厅",
        },
        {
          label: "四川省农业农村厅",
        },
        {
          label: "湖北省农业农村厅",
        },
        {
          label: "福建省农业农村厅",
        },
        {
          label: "山东省农业农村厅",
        },
        {
          label: "江西省农业农村厅",
        },
      ],
      listActive: "请选择",
    };
  },
  created() {
    this.initTime();
  },
  destroyed() {
    clearInterval(this.time.fun);
  },
  methods: {
    initTime() {
      this.time.txt = formatDate(new Date(), "YYYY-mm-dd HH:MM:SS WWW QQQQ");
      this.time.fun = setInterval(() => {
        this.time.txt = formatDate(new Date(), "YYYY-mm-dd HH:MM:SS WWW QQQQ");
      }, 1000);
    },
    onDropdownItemClick(v) {
      this.listActive = v.label;
    },
    signOut() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.big-data-up {
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #43bdf0;
  overflow: hidden;
  .up-left {
    width: 30%;
    font-style: italic;
  }
  .up-center {
    width: 40%;
    display: flex;
    justify-content: center;
    font-size: 20px;
    letter-spacing: 5px;
    background-image: -webkit-linear-gradient(
      left,
      #43bdf0,
      #c0d1f2 25%,
      #43bdf0 50%,
      #c0d1f2 75%,
      #43bdf0
    );
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 100%;
    animation: masked-animation 4s infinite linear;
    -webkit-box-reflect: below -2px -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(rgba(0, 0, 0, 0)),
        to(rgba(255, 255, 255, 0.1))
      );
    @keyframes masked-animation {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
    position: relative;
    &::after {
      content: "";
      width: 50%;
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      border: 1px transparent solid;
      border-image: linear-gradient(to right, #000718, #43bdf0) 1 10;
    }
    span {
      cursor: pointer;
    }
  }
  .up-right {
    width: 30%;
    justify-content: flex-end;
    display: flex;
    align-items: center;
    .ml15:hover {
      cursor: pointer;
    }
    .el-dropdown {
      font-size: 13px !important;
      color: #43bdf0;
      cursor: pointer;
    }
  }
}
</style>