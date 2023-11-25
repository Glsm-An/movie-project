<template>
  <div class="ticket-card">
    <!-- 毛玻璃效果 -->
    <div class="post-bg" :style="{ 'background-image': `url(${bgImg})` }">
      <div class="post-bg-filter"></div>
    </div>
    <!-- 返回首页 -->
    <van-cell title="返回首页" icon="arrow-left" to="/" />
    <!-- 生成电影票 -->
    <div class="tickets-box">
      <div class="img-box">
        <img :src="bgImg" />
      </div>
      <div class="content-box">
        <!-- 购票信息 -->
        <div class="nav">
          <p class="title">{{ title }}</p>
          <p class="date">
            <span>观影时间：</span>{{ cdate }} {{ cmd }} {{ startTime }} -
            {{ endTime }}
          </p>
          <p class="seat">
            座位：<span v-for="a in arr" :key="a.id"
              >{{ a.row }}排{{ a.col }}号</span
            >
          </p>
        </div>
        <!-- 二维码 -->
        <div id="qrCode" ref="qrCodeDiv"></div>
        <!-- 条形码 -->
        <svg id="barcode"></svg>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import JsBarcode from "jsbarcode";
export default {
  props: ["arr", "title", "bgImg", "cdate", "cmd", "startTime", "endTime"],
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.qrCode();
      JsBarcode("#barcode", "Hi world!", {
        format: "CODE128", //选择要使用的条形码类型
        width: 1, //线宽
        height: 36, //条码高度
        text: new Date().getTime(), //显示文本
        displayValue: true, //是否在条形码下方显示文字
        textPosition: "bottom", //设置文本的垂直位置
        fontOptions: "bold italic", //使文字加粗体或变斜体
        background: "#fff", //设置条形码的背景
        // font: "fantasy", //设置文本的字体
        lineColor: "#000", //设置条和文本的颜色。
        fontSize: 14, //设置文本的大小
        marginLeft: 65, //设置条形码周围的空白边距
      });
    });
  },
  methods: {
    qrCode() {
      if (this.$refs.qrCodeDiv) {
        this.$refs.qrCodeDiv.innerHTML = "";
      }
      new QRCode(this.$refs.qrCodeDiv, {
        text: this.title + this.cdate + this.cmd,
        width: 80,
        height: 80, //高度
        colorDark: "#000000", //二维码方块颜色
        colorLight: "#ffffff", //背景颜色
        correctLevel: QRCode.CorrectLevel.Q,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ticket-card {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 2;

  .post-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    filter: blur(30px);
    background-position-y: 40%;
    background-size: 100%;
    overflow: hidden;
    z-index: -1;
  }

  .post-bg-filter {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #40454d;
    opacity: 0.55;
  }

  .img-box {
    width: 50vw;
    height: calc(50vw * 1.3957);
    position: absolute;
    top: 100px;
    left: 25%;
    border-radius: 10px;
    overflow: hidden;
    z-index: 3;
    box-shadow: 10px 10px 18px #0000003d;

    img {
      width: 100%;
      display: block;
    }
  }

  .content-box {
    width: calc(100% - 30%);
    margin: 0 15%;
    height: 60%;
    background-color: #fff;
    position: absolute;
    bottom: 7%;
    border-radius: 10px;
    z-index: 1;
    box-shadow: 5px 5px 18px #0000003d;
  }
}

.nav {
  padding-top: 150px;
  padding-left: 5px;

  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    padding-left: 0;
  }

  .date {
    font-size: 14px;
    margin-top: 5px;
    span {
      font-weight: 600;
    }
  }

  .seat {
    font-size: 14px;
    font-weight: 600;
    margin-top: 5px;
    span {
      font-weight: 400;
      margin-right: 5px;
    }
  }
}

#qrCode {
  margin-top: 20px;
  transform: translateX(90px);
}

#barcode {
  margin-top: 20px;
}
</style>