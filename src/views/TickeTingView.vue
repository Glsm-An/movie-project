<template>
  <div class="buy-box">
    <!-- 头部导航栏 -->
    <van-nav-bar class="top-nav" :title="ciemasName" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" size="20" />
      </template>
    </van-nav-bar>
    <!-- 头部导航栏结束 -->
    <!-- 排期详情和座位上方示例图 开始 -->
    <div>
      <p class="movie-title">{{ title }}</p>
      <!-- 排期详情 -->
      <div class="plan-detail">
        <div class="plan-detail-item">{{ cmd }} {{ cdate }}</div>
        <div class="plan-detail-item">{{ startTime }}-{{ endTime }}</div>
        <div class="plan-detail-item">{{ lang }} {{ th }}</div>
      </div>
      <!-- 座位示例图 -->
      <div class="seat-detail">
        <div
          v-show="s.isShow === '1' && s.position === 'up'"
          v-for="(s, index) in seatTypeList"
          :key="index"
          class="seat-detail-item"
        >
          <img :src="s.icon" class="seatTypeClass" />
          <span class="seatTypeClass">{{ s.name }}</span>
        </div>
      </div>
    </div>
    <!--排期详情和座位上方示例图 结束-->
    <seat-area
      :propThumbnailAreaWidth="thumbnailBoxWidth"
      :propThumbnailAreaHeight="thumbnailBoxHeight"
      :propYMax="yMax"
      :propSeatScale="seatScale"
      :propSeatHeight="positionDistin"
      :propSeatToolArr="seatToolArr"
      :propSeatAreaWidthRem="seatAreaWidthRem"
      :propSeatAreaHeightRem="seatAreaHeightRem"
      :propSeatBoxHeight="seatBoxHeight"
      :propMiddleLine="middleLine"
      :propHorizontalLine="horizontalLine"
      ref="seatArea"
    >
      <!--以下为缩略座位图具名插槽 开始-->
      <template slot="thumbnail-seat-solt">
        <template v-for="seatItem in seatList">
          <div
            class="thumbnailSeatClass"
            :key="'thumbnail' + seatItem.id"
            :style="{
              height: thumbnailHeight + 'rem',
              width: thumbnailWidth + 'rem',
              background: thumbnailBackgroud(seatItem),
              top: seatItem.gRow * thumbnailPositionDistin + 'rem',
              left: seatItem.gCol * thumbnailPositionDistin + 'rem',
            }"
          ></div>
        </template>
      </template>
      <!--以上为缩略座位图具名插槽 结束-->
      <!--以下为座位图具名插槽 开始-->
      <template slot="seat-area-solt">
        <div
          class="seatBox"
          :style="{
            transform: 'scale(' + seatScale + ')',
            height: seatBoxHeight + 'rem',
            width: seatBoxWidth + 'rem',
            marginLeft: seatBoxCenterMargin + 'rem',
          }"
        >
          <!--中轴线-->
          <div
            v-show="seatList.length > 0"
            class="middle-line"
            :style="{ height: seatBoxHeight + 'rem', left: middleLine + 'rem' }"
          ></div>
          <template v-for="(seatItem, index) in seatList">
            <div
              class="seatClass"
              @click.prevent="clickSeat(index)"
              :key="seatItem.id"
              :style="{
                height: (height/2) + 'rem',
                width: (width/2) + 'rem',
                top: (seatItem.gRow * positionDistin)/2 + 'rem',
                left: (seatItem.gCol * positionDistin)/2 + 'rem',
              }"
            >
              <img
                class="seatImgClass"
                :seatId="seatItem.id"
                :seatIndex="index"
                :src="seatItem.nowIcon"
              />
            </div>
          </template>
        </div>
      </template>
      <!--以上为座位图具名插槽 结束-->
    </seat-area>
    <!-- 失活的组件将会被缓存！-->
    <keep-alive>
      <component
        v-bind:is="selectedTabComponents"
        :propSeatList="seatList"
        :propSelectedSeat="selectedSeatList"
        :moviePrice="price"
        @quickSelect="processUnSelected"
        @cancelSelect="processSelected"
      ></component>
    </keep-alive>
    <confirm-lock
      :propSelectedSeat="selectedSeatList"
      :propSeatList="seatList"
      :price="price"
      :title="title"
      :bgImg="bgImg"
      :cdate="cdate"
      :cmd="cmd"
      :startTime="startTime"
      :endTime="endTime"
    ></confirm-lock>
  </div>
</template>


<script>
import SeatArea from "./SeatSelection/SeatArea.vue";
import ConfirmLock from "./SeatSelection/ConfirmLock.vue";
import QuickSelectTab from "./SeatSelection/QuickSelectTab.vue";
import SelectedTab from "./SeatSelection/SelectedTab.vue";
import { Toast } from "vant";

export default {
  props: [
    "ciemasName",
    "title",
    "cdate",
    "cmd",
    "lang",
    "th",
    "index",
    "price",
    "startTime",
    "endTime",
    "bgImg",
  ],
  data() {
    return {
      seatList: [], // 座位对象list
      seatTypeList: [], // 座位类型list
      // movieName: "", // 展示用 电影名称 接口获取
      // hallName: "", // 展示用 影厅名称 接口获取
      // showDate: "", // 展示用 开始日期 接口获取
      // showTime: "", // 展示用 开始时间 接口获取
      positionDistin: 0.5, // 每个座位偏移距离
      width: 0.5, // 每个座位的宽
      height: 0.5, // 每个座位的高
      thumbnailWidth: 0.1, // 缩略图每个座位的宽
      thumbnailHeight: 0.1, // 缩略图每个座位的高
      thumbnailPositionDistin: 0.15, // 缩略图每个座位偏移距离
      seatAreaWidthRem: 10, // 座位区域横向rem最大值 用于和 seatAreaHeightRem 共同计算区域缩放比例
      selectedSeatList: [], // 已选择座位
      maxSelect: 4, // 最大选择座位数量 改动可改变最大选择座位数
      load: false, // 加载dom的控制
    };
  },
  components: {
    SeatArea,
    ConfirmLock,
    QuickSelectTab,
    SelectedTab,
  },
  mounted() {
    this.getSeatList();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //获取影院列表数据
    getSeatList() {
      this.$get("/mock/seatLove.json").then(
        (data) => {
          // console.log("huoq", data);
          let resSeatList = data.seatList;
          //处理座位信息 ---开始
          if (!resSeatList) {
            return;
          }
          resSeatList.map((item) => {
            // 获取座位的类型的首字母
            let firstNumber = item.type.substr(0, 1);
            // 在原来的对象中加入两个属性  otherLoveSeatIndex 对应情侣座位的原数组下标 otherLoveSeatId  对应情侣座位的Id
            item.otherLoveSeatIndex = null;
            item.otherLoveSeatId = null;
            // 座位的类型的首字母为 '1' 是情侣首座 处理情侣首座位
            if (firstNumber === "1") {
              for (const index in resSeatList) {
                if (
                  resSeatList[index].gRow === item.gRow &&
                  resSeatList[index].gCol === item.gCol + 1
                ) {
                  item.otherLoveSeatIndex = index;
                  item.otherLoveSeatId = resSeatList[index].id;
                }
              }
            }
            // 座位的类型的首字母为 '2' 是情侣次座 处理情侣次座位
            if (firstNumber === "2") {
              for (const index in resSeatList) {
                if (
                  resSeatList[index].gRow === item.gRow &&
                  resSeatList[index].gCol === item.gCol - 1
                ) {
                  item.otherLoveSeatIndex = index;
                  item.otherLoveSeatId = resSeatList[index].id;
                }
              }
            }
            //加载座位图标
            for (const t of data.seatTypeList) {
              // 加载每个座位的初始图标defautIcon 和 当前图标 nowIcon
              if (item.type === t.type) {
                item.nowIcon = t.icon;
                item.defautIcon = t.icon;
              }
              // 根据首字母找到对应的被选中图标
              if (firstNumber + "-1" === t.type) {
                item.selectedIcon = t.icon;
              }
              //根据首字母找到对应的被选中图标
              if (firstNumber + "-2" === t.type) {
                item.soldedIcon = t.icon;
              }
              //根据首字母找到对应的被选中图标
              if (firstNumber + "-3" === t.type) {
                item.fixIcon = t.icon;
              }
            }
            // 如果座位是已经售出 和 维修座位 加入属性canClick 判断座位是否可以点击
            if (
              item.defautIcon === item.soldedIcon ||
              item.defautIcon === item.fixIcon
            ) {
              item.canClick = false;
            } else {
              item.canClick = true;
            }
          });
          // 座位处理 -------结束
          // 开始处理上方影片信息显示数据
          // let temp = data.showTime;
          // if (temp.length === 19) {
          //   this.showDate =
          //     temp.substring(0, 10) + "(" + temp.substring(11, 13) + ")";
          //   this.showTime = temp.substring(14, 19);
          // }
          this.seatList = resSeatList;
          this.seatTypeList = data.seatTypeList;
          // this.movieName = response.movieName;
          // this.hallName = response.name;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    //点击每个座位触发的函数
    clickSeat(index) {
      if (this.seatList[index].canClick) {
        if (
          this.seatList[index].nowIcon === this.seatList[index].selectedIcon
        ) {
          //触发已选座位的方法
          this.processSelected(index);
        } else {
          this.processUnSelected(index);
          // console.log(this.selectedSeatList);
        }
      }
    },
    // 处理已选的座位
    processSelected(index) {
      let _selectedSeatList = this.selectedSeatList;
      let otherLoveSeatIndex = this.seatList[index].otherLoveSeatIndex;
      if (otherLoveSeatIndex !== null) {
        //如果是情侣座位
        //改变这些座位的图标为初始图标
        this.$set(
          this.seatList[index],
          "nowIcon",
          this.seatList[index].defautIcon
        );
        this.$set(
          this.seatList[otherLoveSeatIndex],
          "nowIcon",
          this.seatList[otherLoveSeatIndex].defautIcon
        );
        for (const key in _selectedSeatList) {
          //移出ID一样的座位
          if (_selectedSeatList[key].id === this.seatList[index].id) {
            _selectedSeatList.splice(key, 1);
          }
        }
        //移出对应情侣座位
        for (const key in _selectedSeatList) {
          if (
            _selectedSeatList[key].id === this.seatList[otherLoveSeatIndex].id
          ) {
            _selectedSeatList.splice(key, 1);
          }
        }
      } else {
        //改变这些座位的图标为初始图标 并 移除id一样的座位
        this.$set(
          this.seatList[index],
          "nowIcon",
          this.seatList[index].defautIcon
        );
        for (const key in _selectedSeatList) {
          if (_selectedSeatList[key].id === this.seatList[index].id) {
            _selectedSeatList.splice(key, 1);
          }
        }
      }
    },
    //处理未选择的座位
    processUnSelected(index) {
      // 如果是选择第一个座位 放大区域并移动区域 突出座位 增加用户体验
      if (this.selectedSeatList.length === 0) {
        let top = ((this.seatList[index].gRow * this.positionDistin) - this.horizontalLine) * this.seatScale
        let left = ((this.seatList[index].gCol * this.positionDistin) - this.middleLine) * this.seatScale
        top = top > 0 ? -top - this.positionDistin : -top + this.positionDistin
        left = left > 0 ? -left - this.positionDistin : -left + this.positionDistin
        this.$refs.seatArea.changeScale()
        this.$refs.seatArea.changePosition(top, left)
      }
      let _selectedSeatList = this.selectedSeatList;
      let otherLoveSeatIndex = this.seatList[index].otherLoveSeatIndex;
      if (otherLoveSeatIndex !== null) {
        //如果选中的是情侣座位 判断选择个数不大于 maxSelect
        if (_selectedSeatList.length >= this.maxSelect - 1) {
          Toast(`最多只能选择${this.maxSelect}个座位哦~`);
          return;
        }
        //改变这些座位的图标为已选择图标
        this.$set(
          this.seatList[index],
          "nowIcon",
          this.seatList[index].selectedIcon
        );
        this.$set(
          this.seatList[otherLoveSeatIndex],
          "nowIcon",
          this.seatList[otherLoveSeatIndex].selectedIcon
        );
        //记录 orgIndex属性 是原seatList数组中的下标
        this.seatList[index].orgIndex = index;
        this.seatList[otherLoveSeatIndex].orgIndex = otherLoveSeatIndex;
         // 把选择的座位放入到已选座位数组中
        _selectedSeatList.push(this.seatList[index])
        _selectedSeatList.push(this.seatList[otherLoveSeatIndex])
      } else {
        //如果选中的是非情侣座位 判断选择个数不大于maxSelect
        if (_selectedSeatList.length >= this.maxSelect) {
          Toast(`最多只能选择${this.maxSelect}个座位哦~`);
          return;
        }
        //改变这些座位的图标为已选择图标
        this.$set(
          this.seatList[index],
          "nowIcon",
          this.seatList[index].selectedIcon
        );
        //记录 orgIndex属性 是原seatList数组中的下标值
        this.seatList[index].orgIndex = index;
        //把选择的座位放入已选座位数组中
        _selectedSeatList.push(this.seatList[index]);
      }
    },
    thumbnailBackgroud(seatItem) {
      if (seatItem.nowIcon === seatItem.selectedIcon) {
        return "green";
      } else if (seatItem.nowIcon === seatItem.soldedIcon) {
        return "red";
      } else if (seatItem.nowIcon === seatItem.fixIcon) {
        return "red";
      } else {
        return "white";
      }
    },
  },
  computed: {
    // 座位区域高度rem
    seatAreaHeightRem() {
      let screenRem =
        (document.body.clientWidth ||
          window.innerWidth ||
          document.documentElement.clientWidth) / 10;
      let height =
        document.documentElement.clientHeight ||
        window.innerHeight ||
        document.body.clientHeight;
      //除开座位区域的大小
      // let otherDom = 1.08 + 1.2 + 1.2 + 0.67 + 1.87 + 1.2; // 头+排期信息+座位示例+屏幕方向区域+底部快捷选择+确认按钮
      let otherDom = 0.504 + 0.6 + 0.6 + 0.335 + 0.935 + 0.6;
      // 剩下的座位区域的大小
      return height / screenRem - otherDom;
    },
    //取最大横坐标
    xMax() {
      let i = 0;
      for (let index in this.seatList) {
        if (this.seatList[index].gCol > 1) {
          i = this.seatList[index].gCol;
        }
      }
      return i;
    },
    //取最大纵坐标
    yMax() {
      let i = 0;
      for (let index in this.seatList) {
        if (this.seatList[index].gRow > i) {
          i = this.seatList[index].gRow;
        }
      }
      return i;
    },
    //竖的中轴线
    middleLine() {
      // 0.0125是.middle-line线本身宽度的一半 也需要居中
      return (this.xMax / 2 + 1) * this.positionDistin - 0.0125;
    },
    //横中轴线
    horizontalLine() {
      // 0.0125是.horizontal-line线本身宽度的一半 也需要居中
      return (this.yMax / 2 + 1) * this.positionDistin - 0.0125;
    },
    //根据影厅的大小缩放比例(需要把影厅全部显示出来)
    seatScale() {
     let seatScaleX = 1
      let seatScaleY = 1
      seatScaleX = this.seatAreaWidthRem / this.seatBoxWidth
      seatScaleY = this.seatAreaHeightRem / this.seatBoxHeight
      return seatScaleX < seatScaleY ? seatScaleX : seatScaleY
    },
    //让影厅居中展示的偏移值
    seatBoxCenterMargin() {
      return -(this.seatBoxWidth * this.seatScale) / 2;
    },
    // class 为 seatBox 的高度值 单位为rem
    seatBoxHeight() {
      // 纵轴总数量+1 * 座位偏移值 + 一个座位高度
      return (this.yMax + 1) * this.positionDistin + this.height;
    },
    // class 为 seatBox 的宽度值 单位为rem
    seatBoxWidth() {
      // 横轴总数量+1 * 座位偏移值 + 一个座位宽度
      return (this.xMax + 1) * this.positionDistin + this.width;
    },
    //缩略图宽 rem
    thumbnailBoxWidth() {
      return (
        (this.xMax + 1) * this.thumbnailPositionDistin + this.thumbnailWidth
      );
    },
    // 缩略图高 rem
    thumbnailBoxHeight() {
      return (
        (this.yMax + 1) * this.thumbnailPositionDistin + this.thumbnailHeight
      );
    },
    // 快速选择和选择座位组件component on-bind:is的值
    selectedTabComponents() {
      return this.selectedSeatList.length > 0
        ? "SelectedTab"
        : "QuickSelectTab";
    },
    //座位左侧标识栏
    seatToolArr() {
      let seatToolArr = [];
      let yMax = this.yMax;
      for (let i = 1; i <= yMax; i++) {
        let el = this.seatList.find((item) => item.gRow === i);
        if (el) {
          seatToolArr.push(el.row);
        } else {
          seatToolArr.push("");
        }
      }
      return seatToolArr;
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-box {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
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

  .movie-title {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    font-family: 仿宋;
  }
  .plan-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #888888;
    height: 45px;
    width: 100%;
    background: #ffffff;
    // padding: 15px;
    .plan-detail-item {
      width: 125px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .seat-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: 13px;
    color: #888888;
    height: 45px;
    width: 100vw;
    background: #f3f4f6;
    padding: 0 10px 0 10px;
  }
  .seat-detail-item {
    display: flex;
    align-content: center;
  }
  .seatTypeClass {
    display: block;
    height: 17.5px;
    line-height: 17.5px;
    white-space: nowrap;
  }
  .thumbnailSeatClass {
    position: absolute;
  }
  .seatBox {
    position: absolute;
    left: 50%;
    transform-origin: 0rem 0rem 0rem;
  }
  .middle-line {
    position: absolute;
    height: 3rem !important;
    border-right: 0.025rem rgba(0, 0, 0, 0.2) dashed;
  }
  .seatClass {
    position: absolute;
  }
  .seatImgClass {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
  }
}
</style>