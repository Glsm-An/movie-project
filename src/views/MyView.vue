<template>
  <div class="my-Box">
    <van-nav-bar
      class="top-nav"
      title="我的"
      @click-right="listShow = !listShow"
    >
      <template #right>
        <van-icon name="wap-nav" size="20" />
        <div class="nav-list" v-show="listShow">
          <div class="nav-item" @click="quit">退出登录</div>
          <!-- <div class="nav-item"><a href="/">榜单</a></div>
          <div class="nav-item"><a href="/">热点</a></div>
          <div class="nav-item"><a href="/">商城</a></div> -->
        </div>
      </template>
    </van-nav-bar>
    <!-- 头像 -->
    <div class="header-icon">
      <van-image
        round
        width="65px"
        height="65px"
        :src="require(`../assets/icon.jpg`)"
      />
    </div>

    <!-- 订单 -->
    <div class="order-box">
      <div class="orders">
        <div class="list">
          <div class="order-item movie"><p>电影票</p></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      listShow: false,
    };
  },
  methods: {
    quit() {
      localStorage.removeItem("token");
      Toast("退出成功！");
      this.$router.replace({
        name: "hotMovie",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-Box {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 50px;
  background-color: #fff;
  z-index: 999;
  .top-nav {
    background-color: #e54847 !important;
    .van-nav-bar__title {
      color: #fff;
    }

    .van-icon {
      color: #fff;
    }
  }
}

.van-nav-bar__right {
  position: relative;
}

.nav-list {
  position: absolute;
  top: 46px;
  right: 2px;
  width: 110px;
  z-index: 20;
  background: #fff;
  box-shadow: 0 0.06rem 0.18rem 0 rgba(0, 0, 0, 0.1);

  .nav-item {
    box-sizing: content-box;
    height: 46px;
    text-align: center;
    border-bottom: 0.02rem solid #f0f0f0;
    display: block;
    text-decoration: none;
    line-height: 46px;
    font-size: 16px;
    color: #333;
    letter-spacing: 0;
  }
}
.header-icon {
  background-color: #f03d37;
  background-image: url("../assets/bg.png");
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100% 150px;
  height: 150px;
  overflow: hidden;
  text-align: center;
  border-top: none;
  .van-image {
    margin-top: 30px;
    border: 3px solid #fff;
  }
}
.order-box {
  margin-top: 10px;
  background: #fff;
  .orders {
    padding: 0 15px;
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  .list {
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
    .order-item {
      height: 97px;
      background-repeat: no-repeat;
      background-position: top;
      background-size: 42px auto;
      margin-top: 18px;
      width: 50%;
    }
    .movie {
      background-image: url("../assets/movie.png");
    }
    p {
      position: relative;
      top: 53px;
      text-align: center;
      font-size: 15px;
      line-height: 21px;
      height: 21px;
      margin: 0;
      color: #333;
    }
  }
}
</style>