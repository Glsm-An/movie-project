<template>
  <div class="cinema-box" v-show="details.length != 0">
    <!-- 顶部导航栏 -->
    <div class="top">
      <van-nav-bar
        class="top-nav"
        :title="ciemasName"
        @click-right="listShow = !listShow"
        @click-left="$router.go(-1)"
      >
        <template #left>
          <van-icon name="arrow-left" size="20" />
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
    </div>
    <!-- 电影院地址 -->
    <van-cell :title="ciemasName" :center="true">
      <template #label>
        <p>{{ ciemasAddr }}</p>
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="location-o" size="26" color="skyblue" />
      </template>
    </van-cell>
    <!-- 上映电影 -->
    <div class="movie-block" v-show="movies.length != 0">
      <!-- 电影图片 -->
      <div class="swiper-container">
        <div
          class="post-bg"
          :style="{ 'background-image': `url(${bgImg})` }"
        ></div>
        <div class="post-bg-filter"></div>
        <div class="swiper-wrapper" ref="swiper">
          <div
            class="swiper-slide"
            v-for="(m, i) in movies"
            :key="i"
            @click="movieBg(i)"
          >
            <div
              class="post"
              :style="{ 'background-image': 'url(' + m.img + ')' }"
              :class="{ active: i == activeIndex }"
            ></div>
            <div></div>
            <div class="lazyload-wrapper">
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="movie-info-container">
        <div class="movie-info">
          <div class="movie-title line-ellipsis">
            <span class="title">{{ title }}</span>
            <span class="grade" v-if="globalReleased && sc != 0">
              <span class="sc">{{ sc }} <span class="small">分</span></span>
            </span>
            <span class="grade" v-else
              ><span class="sc">{{ wish }}</span>
              <span class="small">人想看</span>
            </span>
          </div>
          <div class="movie-desc line-ellipsis">
            {{ desc }}
          </div>
        </div>
      </div>
    </div>
    <!-- 电影日期 -->
    <div class="show-wrap">
      <!-- 日期导航条 -->
      <div class="date-nav">
        <div
          class="data-item"
          v-for="(s, index) in shows"
          :key="index"
          :class="{ active: navIndex == index }"
          @click="setNavActive(index)"
        >
          <span class="data-title"
            >{{ day[index].times }}{{ day[index].md }}</span
          >
        </div>
      </div>
      <!-- 广告 -->
      <div class="activity-block-container" v-show="vipInfo">
        <div class="vip-tips">
          <div class="label">折扣</div>
          <div class="label-text line-ellipsis">
            {{ vipInfo?.title }}
          </div>
          <div class="process">
            {{ vipInfo?.process }}
            <van-icon name="arrow" size="14" color="#777" />
          </div>
        </div>
      </div>
      <!-- 电影场次信息 -->
      <div class="show-list-container" v-if="plist.length != 0">
        <div class="show-item-wrap" v-for="(s, index) in plist" :key="index">
          <div class="show-item">
            <div class="time-block">
              <div class="begin">{{ s.tm }}</div>
              <div class="end">
                {{ breakTime[index] }}
                <span class="tui">散场</span>
              </div>
            </div>
            <div class="info-block">
              <div class="lan">{{ s.lang }}{{ s.tp }}</div>
              <div class="hall">{{ s.th }}</div>
            </div>
            <div class="price">
              <div class="sellPr">
                <span class="d">￥</span>
                <span class="stonefont">{{
                  s.vipPrice > 0 ? s.vipPrice : 35
                }}</span>
              </div>
              <div class="vipPrice" v-show="s.vipPrice">
                <span class="icon">{{ s.vipPriceNameNew }}</span>
                <span class="num"
                  >￥{{ s.vipPrice > 0 ? s.vipPrice * 0.9 : 35 * 0.9 }}</span
                >
              </div>
            </div>
            <div class="button-block" @click="goBuyMovie">
              <div class="button">购票</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 当天没有档期 -->
      <div class="no-seat" v-else>
        <div class="icon today-no-movie"></div>
        <div class="text">今日场次已映完</div>
        <div class="next-date-button" @click="goNext">
          点击查看{{ day[navIndex + 1]?.md }}场次
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCiemaInformation, getCiemaMovie } from "../apis/cinemas";
export default {
  props: ["id"],
  data() {
    return {
      cityId: "",
      ciemasName: "",
      ciemasAddr: "",
      details: [],
      listShow: false,
      movies: [],
      //电影高亮
      activeIndex: 0,
      screenWidth: 0,
      bgImg: "",
      title: "",
      globalReleased: "",
      sc: "",
      wish: "",
      desc: "",
      //电影场次
      shows: [],
      //日期高亮
      navIndex: 0,
      ciemasData: "",
      vipInfo: "",
      //当日电影档期
      plist: [],
    };
  },
  mounted() {
    this.cityId = JSON.parse(localStorage.city).id;
    this.getCiemaMovie();
    this.getCiemaInformation();
    this.getWidth();
    // this.plist = this.movies[0].shows[0].plist?  this.movies[0].shows[0].plist : "";
  },
  methods: {
    async getCiemaInformation() {
      let { data } = await getCiemaInformation(this.id);
      this.details = data;
      this.ciemasName = data.nm;
      this.ciemasAddr = data.addr;
      // console.log(this.details);
    },
    async getCiemaMovie() {
      let { data } = await getCiemaMovie(this.id, this.cityId);
      this.movies = data.movies;
      this.bgImg = this.movies[0].img;
      this.title = this.movies[0].nm;
      this.globalReleased = this.movies[0].globalReleased;
      this.sc = this.movies[0].sc;
      this.desc = this.movies[0].desc;
      this.shows = this.movies[0].shows;
      this.ciemasData = data;
      this.vipInfo = data.vipInfo ? data.vipInfo[0] : "";
      this.plist = data.movies[0].shows[0].plist;
      // console.log(data);
    },
    setAttr() {},
    getWidth() {
      this.screenWidth = window.innerWidth;
      this.$refs.swiper.style.transform = `translate3d(${
        this.screenWidth / 2 - 52
      }px,0px,0px)`;
    },
    movieBg(i) {
      let offsetWidth = this.screenWidth / 2 - 52 - i * 82;

      if (i > this.activeIndex) {
        this.$refs.swiper.style.transform = `translate3d(${offsetWidth}px,0px,0px)`;
        this.activeIndex = i;
      }
      if (i < this.activeIndex) {
        this.activeIndex = i;
        i = this.activeIndex - i;
        this.$refs.swiper.style.transform = `translate3d(${offsetWidth}px,0px,0px)`;
      }
      this.bgImg = this.movies[this.activeIndex].img;
      this.title = this.movies[this.activeIndex].nm;
      this.globalReleased = this.movies[this.activeIndex].globalReleased;
      this.sc = this.movies[this.activeIndex].sc;
      this.wish = this.movies[this.activeIndex].wish
        ? this.movies[this.activeIndex].wish
        : "";
      this.desc = this.movies[this.activeIndex].desc;
      this.shows = this.movies[this.activeIndex].shows;
      this.navIndex = 0;
      this.plist = this.movies[this.activeIndex].shows[this.navIndex].plist;
      //   this.vipInfo = this.ciemasData.vipInfo[i];
      // console.log(this.wish);
      // console.log(i);
    },
    dayHandler(date) {
      if (date == null) return "";

      const dayArr = ["今天", "明天", "后天"];

      // 星期数组
      const weekArr = ["日", "一", "二", "三", "四", "五", "六"];

      // 获取传入日期与当前日期相差的天数，一天 86400000 毫秒
      const diffTime =
        (date.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
        86400000;

      // 获取“今天/明天/后天”，若不在这些里面则显示星期
      return dayArr[diffTime] || `周${weekArr[date.getDay()]}`;
    },
    setNavActive(i) {
      this.navIndex = i;
      this.plist = this.movies[this.activeIndex].shows[i].plist;
    },
    goNext() {
      if (this.navIndex < this.shows.length) {
        this.navIndex = this.navIndex + 1;
        this.plist = this.movies[this.activeIndex].shows[this.navIndex].plist;
        // console.log(this.navIndex);
      }
    },
    goBuyMovie(){
      this.$router.push({
        name:'ticketing',

      })
    }
  },
  computed: {
    day() {
      let days = "";
      let time = "";
      //   let a = '';
      let arr = [];
      let md = "";
      let obj = {
        times: "",
        day: "",
      };
      this.shows.map((item) => {
        // a = item.showDate.slice(5)
        days = new Date(item.showDate);
        md = days.getTime();
        md = new Date(md);
        let month = md.getMonth() + 1 + "月";
        let date = md.getDate() + "日";
        // console.log(days);
        time = this.dayHandler(days);
        let a = [month, date].join("");

        obj = {
          times: time,
          md: a,
        };
        arr.push(obj);
        // console.log([month,date].join(''));
        // console.log(arr);
      });
      return arr;
    },
    breakTime() {
      let plist = this.movies[this.activeIndex].shows[this.navIndex].plist;
      let start = "";
      let dt = "";
      let movieTime = this.movies[this.activeIndex].dur;
      // let days = "";
      let ms = "";
      let arr = [];
      let movieEnd = "";
      let endTimeStr = "";
      let endTime = movieTime * 60 * 1000;
      let endTimeArr = [];
      plist.map((item) => {
        dt = item.dt;
        start = new Date(`${dt} ${item.tm}`);
        ms = start.getTime();
        arr.push(ms);
        // ms = new Date(ms)
      });
      arr.map((item) => {
        item = item + endTime;
        movieEnd = new Date(item);
        let hour = movieEnd.getHours();
        let minute = movieEnd.getMinutes();
        endTimeStr = `${hour < 10 ? "0" + hour : hour}:${
          minute < 10 ? "0" + minute : minute
        }`;
        // let hour = movieEnd.getHours();
       endTimeArr.push(endTimeStr)
        // endTimeStr = hour
      });
      // console.log(endTimeStr);
      
      return endTimeArr;
    },
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.activeIndex = 0;
        this.getCiemaInformation();
        this.getCiemaMovie();
        this.navIndex = 0;
        this.vipInfo = "";
        this.plist = [];
      },
    },
  },
};
</script>

<style lang="scss">
.top-nav {
  background-color: var(--bgColor);

  .van-nav-bar__title {
    color: #fff;
  }

  .van-icon {
    color: #fff;
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

.van-nav-bar__left {
  position: static !important;
  padding-left: 0px;
}

.van-nav-bar__title {
  // position: static !important;
}

.van-nav-bar__title {
  font-size: 17px;
}

.custom-title {
  margin-right: 4px;
  vertical-align: middle;
}

.van-cell__title {
  span {
    font-size: 17px;
    font-weight: 700;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  p {
    max-width: 70vw;
    font-size: 13px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.van-cell {
  .van-icon {
    border-left: 1px solid #ccc;
    padding-left: 20px;
  }
}

.swiper-container {
  padding: 20px 15px 20px 5px;
  transform: translateZ(0);
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  z-index: 1;
}

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

.swiper-wrapper {
  transition-duration: 300ms;
  transform: translate3d(162.5px, 0px, 0px);
  height: 95px !important;
  position: relative;
  // width: 3000vw;
  z-index: 1;
  display: flex;
  box-sizing: initial;
}

.swiper-slide {
  width: 65px !important;
  height: 95px;
  margin-left: 15px;
  box-sizing: initial;
  .active {
    transform: scale(1.15);
    border: 2px solid #fff;

    &::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      height: 5px;
      background: url("../assets/download.png") no-repeat;
      background-size: contain;
    }
  }
}

//当前高亮

// .next{

// }

.post {
  background-color: #f5f5f5;
  // opacity: 0;
  background-size: cover;
  background-repeat: no-repeat;
  width: 65px !important;
  height: 100%;
  animation: imageanimation 1s forwards;
}
.movie-info-container {
  height: 66.5px;
  background-color: #fff;
  .movie-info {
    padding: 11px 15px;
    text-align: center;
  }
  .movie-title {
    height: 24px;
    line-height: 24px;
    font-size: 17px;
    color: #333;
    font-weight: 700;
    .title {
      margin-right: 5px;
    }
  }
  .grade {
    color: #ffb400;
    font-size: 16px;
    // .sc{
    //     position: static !important;
    //     size: 16px !important;
    // }
    .small {
      font-size: 10px;
    }
  }
  .movie-desc {
    margin-top: 2px;
    height: 18.5px;
    line-height: 18.5px;
    font-size: 13px;
    color: #999;
  }
}
.line-ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.date-nav {
  height: 48px;
  width: 100%;
  white-space: nowrap;
  overflow-x: scroll;
  border-top: 1px solid #ccc;
  .data-item {
    display: inline-block;
    line-height: 45px;
    height: 45px;
    margin-left: 30px;
    text-align: center;
    font-size: 14px;
    color: #666;
    &:first-child {
      margin-left: 15px;
    }
    &.active {
      color: #f03d37;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        width: 110%;
        height: 2px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f03d37;
      }
    }
  }
  &::-webkit-scrollbar {
    height: 0px;
  }
}
.vip-tips {
  margin-top: -1px;
  background-color: #fff5ea;
  padding: 0 15px;
  height: 42px;
  line-height: 42px;
  display: flex;
  color: #777;
  .label {
    background-color: #ff941a;
    flex: 0 0 auto;
    display: inline-block;
    border-radius: 2px;
    font-size: 10px;
    line-height: 15px;
    height: 15px;
    width: 34px;
    text-align: center;
    color: #fff;
    margin-top: 13px;
    margin-right: 10px;
  }
  .label-text {
    color: #fa9600;
    flex: 1 1 auto;
    font-size: 12px;
  }
  .process {
    flex: 0 0 auto;
    line-height: 42px;
    color: #999;
    font-size: 12px;
  }
}
// 电影场次
.show-item-wrap {
  padding: 17px 12.5px;
  border-top: 1px solid #d8d8d8;
}
.show-item {
  display: flex;
  .time-block {
    position: relative;
    .begin {
      font-size: 20px;
      color: #333;
      line-height: 1;
      white-space: nowrap;
    }
    .end {
      margin-top: 10px;
      color: #999;
      font-size: 11px;
      line-height: 1;
      white-space: nowrap;
    }
  }
  .info-block {
    margin-left: 17px;
    flex: 1;
    .lan {
      margin-top: 2px;
      line-height: 18px;
      font-size: 13px;
      color: #333;
      white-space: normal;
    }
    .hall {
      margin-top: 7px;
      font-size: 11px;
      color: #999;
      white-space: normal;
    }
  }
  .price {
    flex: 0 1 auto;
    width: 130px;
    margin-left: 5px;
    .sellPr {
      display: inline-block;
      line-height: 1;
      color: #f03d37;
      margin-top: 1px;
      font-size: 19px;
    }
    .d {
      font-size: 11px;
    }
  }
  .vipPrice {
    display: inline-block;
    line-height: 15px;
    height: 15px;
    transform: scale(0.8);
    transform-origin: left;
    margin: 0 -16px 0 4px;
    border: 1px solid #ff9000;
    border-radius: 2px;
    font-size: 12px;
    .icon {
      display: inline-block;
      color: #fff;
      background-color: #f90;
    }
    .num {
      display: inline-block;
      padding: 0 2px;
      color: #f90;
      background-color: #fff;
    }
  }
  .button-block {
    width: 45px;
    margin-left: 2px;
    position: relative;
    .button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 25px;
      line-height: 26px;
      font-size: 12px;
      border: 1px solid #f06762;
      border-radius: 50px;
      color: #f03d37;
      text-align: center;
    }
  }
}
// 没有场次
.no-seat {
  text-align: center;
  // flex-direction: column;
  align-items: center;
  // justify-content: center;
  height: 230px;
  background-color: #f0f0f0;
  .icon {
    display: inline-block;
    margin: 50px auto 0;
    width: 77.5px;
    height: 71.5px;
  }
  .today-no-movie {
    background: url("../assets/today-no-show.png") no-repeat 50%;
    background-size: contain;
  }
  .text {
    margin-top: 12px;
    line-height: 1;
    font-size: 16px;
    color: #acacac;
  }
  .next-date-button {
    margin: 20px auto 0;
    border-radius: 5px;
    width: 170px;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #f03d37;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background-color: #fff;
    text-align: center;
  }
}
</style>