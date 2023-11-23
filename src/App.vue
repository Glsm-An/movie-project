<template>
  <div id="app">
    <van-nav-bar class="top-nav" title="猫眼电影" @click-right="listShow = !listShow" v-show="!(path == '/shortvideoplay' || path == '/city-list' || path == '/moviedetails' || routeName == 'ciemas')"   @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" size="20" v-if="(path == '/search' || routeName == 'ciemas')"/>
  </template>
      <template #right>
        <van-icon name="wap-nav" size="20" />
        <div class="nav-list" v-show="listShow">
          <div class="nav-item"><a href="/">首页</a></div>
          <div class="nav-item"><a href="/">榜单</a></div>
          <div class="nav-item"><a href="/">热点</a></div>
          <div class="nav-item"><a href="/">商城</a></div>
        </div>
      </template>
    </van-nav-bar>

    <!-- 底部导航栏 -->
    <van-tabbar class="tabbar" route v-model="active" active-color="#f03d37" inactive-color="#696969"
    v-show="!(path == '/shortvideoplay' || path == '/city-list' || path == '/moviedetails' || path == '/search' || routeName == 'ciemas')"
    >
      <van-tabbar-item to="/" icon="home-o" title="电影/影院">电影/影院</van-tabbar-item>
      <van-tabbar-item to="/video" icon="tv-o">视频</van-tabbar-item>
      <van-tabbar-item to="/shortvideo" icon="video-o">小视频</van-tabbar-item>
      <van-tabbar-item to="/performs" icon="coupon-o">演出</van-tabbar-item>
      <van-tabbar-item to="/my" icon="user-circle-o">我的</van-tabbar-item>
    </van-tabbar>

    <keep-alive>
      <router-view />
    </keep-alive>

  </div>
</template>

<script>
const activeIndex = {
  movie: 0,
  video: 1,
  shortvideo: 2,
  performs: 3,
  my: 4,
};
export default {
  data() {
    return {
      listShow: false,
      path:'',
      routeName:'',
    };
  },
  methods: {
    onClickLeft(){
      this.$router.go(-1);
    }
  },
  computed: {
    //根据路由信息中的name属性来给予相应的高亮
    active: {
      get() {
        const { name } = this.$route;
        const index = activeIndex[name] || 0;
        return index;
      },
      set() { },
    }
  },
  mounted(){
    this.path = this.$route.path
  },
  watch:{
    $route(to){
      this.path = to.path,
      this.routeName = to.name;
    },
  }
}
</script>

<style lang="scss">
@import "./style/color.scss";

#app {
  .top-nav {
    background-color: var(--bgColor);

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
  box-shadow: 0 0.06rem 0.18rem 0 rgba(0, 0, 0, .1);

  .nav-item {
    box-sizing: content-box;
    height: 46px;
    text-align: center;
    border-bottom: 0.02rem solid #f0f0f0;

    a {
      display: block;
      text-decoration: none;
      height: 100%;
      line-height: 46px;
      font-size: 16px;
      color: #333;
      letter-spacing: 0;
    }
  }
}

</style>
