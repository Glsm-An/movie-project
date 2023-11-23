<template>
  <div class="full-screen">
    <div class="nav-bar">
      <div class="left-btn" @click="$router.go(-1)">&lt;</div>
      <div class="title">{{ title }}</div>
      <div class="right-btn"></div>
    </div>
    <router-view @back="back"></router-view>
    <p class="go">
      <router-link replace to="/authorization">登录</router-link>
      <span> | </span>
      <router-link replace to="/authorization/register">注册</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromName: "",
    };
  },
  computed: {
    title() {
      return this.$route.name == "register" ? "注册" : "登录";
    },
  },
   methods:{
    back() {
        this.$router.replace({
            name: this.fromName
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromName = to.params.name || "movie";
    });
  },
};
</script>

<style lang="scss">
.full-screen {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;

  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    background-color: #df2d2d;
    // color: #ccc;
    color: #fff;

    .left-btn,
    .right-btn {
      flex: 0 0 44px;
      box-sizing: border-box;
      padding: 5px 10px;
      font-size: 25px;
      font-weight: bold;
    }
  }
}
.go{
  color: #007dff;
  position: absolute;
  top: 80vh;
  right: 15px;
}
</style>