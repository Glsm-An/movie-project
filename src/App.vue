<template>
  <div id="app">
    <van-tabbar class="tabbar" route v-model="active" active-color="#f03d37" inactive-color="#696969">
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
  }
}
</script>

<style lang="scss">
.tabbar {
  background-color: aqua;
}
</style>
