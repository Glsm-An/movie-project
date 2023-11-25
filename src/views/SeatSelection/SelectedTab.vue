<template>
  <div class="selected">
    <div class="text">已选座位:</div>
    <div class="scroll" ref="scroll">
      <ul class="scroll-ul" ref="scrollUl">
        <li
          class="scroll-item"
          v-for="item in selectedSeat"
          :key="'select' + item.id"
          @click="cancelSelect(item)"
        >
          {{ item.row }}排{{ item.col }}座 {{ moviePrice }}元
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: ["propSelectedSeat","moviePrice"],
  data() {
    return {
      selectedSeat: this.propSelectedSeat,
    };
  },
  watch: {
    propSelectedSeat() {
      let width = this.propSelectedSeat.length * 2.4 + 1.2;
      this.$refs.scrollUl.style.width = width + "rem";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll, {
            scrollX: true,
            // 忽略竖直方向的滚动
            scrollY: false,
            eventPassthrough: "vertical",
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
  },
  //方法集合
  methods: {
    cancelSelect(item) {
      this.$emit("cancelSelect", item.orgIndex);
    },
  },
};
</script>

<style lang="scss">
.selected {
  position: fixed;
  z-index: 10;
  bottom: 1.5rem !important;
  background: #fff;
  width: 100vw;
  padding: 10px 0 10px 10px;
  height: 1.8rem !important;
  overflow: hidden;

  .text {
    width: 100vw;
    height: 13px;
    line-height: 13px;
    font-size: 14px;
    font-weight: 400;
  }

  .scroll{
    position: absolute;
    height: 70px;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 11;

    .scroll-ul{
        width: 100vw;
        display: flex;
        margin-top: 30px;
    }

    .scroll-item{
        flex: none;
        margin-left: 10px;
        height: 32.5px;
        line-height: 32.5px;
        text-align: center;
        font-size: 11.5px;
        width: 80px;
        color: #888;
        border: 1px solid #888;
        border-radius: 5px;
    }
  }
}
</style>