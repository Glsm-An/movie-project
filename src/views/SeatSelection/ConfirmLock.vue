<template>
  <div>
     <div class="pay-btn" v-if="payshow">
      <div class="pay-cancel" @click="cancel">取消订单</div>
      <div class="pay-commit" @click="goTicket">￥{{price * selectedSeat.length}}提交订单</div>
     </div>
    <div class="confirm" @click="lockSeat()" v-else>确认选座</div>
    <div class="pay" v-if="payshow">
      <div
        v-for="(item, index) in payMode"
        :key="index"
        :class="pay_i == index ? 'active' : ''"
        :style="`background:${item.bgColor};`"
        @click="pay_i = index"
      >
        <div class="img-box">
          <img :src="item.img" />
        </div>
        <span>{{ item.text }}</span>
      </div>
      <button>＋添加支付方式</button>
    </div>
   
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: [
    "propSelectedSeat",
    "propSeatList",
    "propIsCheap",
    "propServiceFee",
    "propPlanId",
    "price",
    "title",
    "bgImg",
    "cdate",
    "cmd",
    "startTime",
    "endTime"
  ],
  data() {
    return {
      selectedSeat: this.propSelectedSeat,
      seatList: this.propSeatList,
      payshow: false,
      pay_i: 0,
      payMode: [
        {
          text: "支付宝支付",
          img: require("../../assets/alipay.png"),
          bgColor: "#1296db42",
        },
        {
          text: "微信支付",
          img: require("../../assets/weixin.png"),
          bgColor: "#01CD0D42",
        },
        {
          text: "PayPal支付",
          img: require("../../assets/cc-paypal.png"),
          bgColor: "#13227a42",
        },
        {
          text: "钱包支付",
          img: require("../../assets/sack-dollar.png"),
          bgColor: "#FE8D0042",
        },
      ],
    };
  },
  computed: {
    chPrice() {
      let totalPrice = 0;
      let selectedSeat = this.selectedSeat;
      for (const iterator of selectedSeat) {
        totalPrice += parseInt(iterator.price);
      }
      return totalPrice;
    },
    seatIdList() {
      let seatIdList = [];
      let selectedSeat = this.selectedSeat;
      for (const iterator of selectedSeat) {
        seatIdList.push(iterator.id);
      }
      return seatIdList;
    },
  },
  // 监控data中的数据变化
  watch: {
    propSelectedSeat: function () {
      this.selectedSeat = this.propSelectedSeat;
    },
    propSeatList: function () {
      this.seatList = this.propSeatList;
    },
    propIsCheap: function (value) {
      this.isCheap = value;
    },
    propServiceFee: function (value) {
      this.serviceFee = value;
    },
    propPlanId: function (value) {
      this.planId = value;
    },
  },
  //方法集合
  methods: {
    lockSeat() {
      let _this = this;
      //防止连点
      let check = _this.$once(new Date().getTime());
      if (!check) {
        return;
      }
      if (_this.selectedSeat.length === 0) {
        Toast("请至少选择一个座位哈~");
        return;
      }
      //开始计算是否留下空位 ------开始
      let result = _this.selectedSeat.every(function (element) {
        return _this.checkSeat(element);
      });
      // 开始计算是否留下空位 ------------ 结束
      if (!result) {
        Toast("请不要留下空位~");
      } else {
        if (_this.chPrice === 0) {
          Toast("锁座失败了~,金额为0");
          return;
        }
        //允许锁座
        this.createOrder();
        this.payshow = true;
      }
    },
    createOrder() {
      // console.log("aaa");
      // console.log(this.propSelectedSeat);
      // console.log(this.selectedSeat);

      Toast("选座成功~")
    },
    cancel(){
      Toast("用户取消订单~");
      this.payshow = false;
      this.pay_i = 0;
    },
    goTicket(){
      this.$router.replace({
        name:'movieticket',
        params:{
          arr:this.selectedSeat,
          title:this.title,
          bgImg:this.bgImg,
          cdate:this.cdate,
          cmd:this.cmd,
          startTime:this.startTime,
          endTime:this.endTime,
        }
      })
    },
    // 检查每个座位是否会留下空位
    checkSeat: function (element) {
      // 标准为 1.左右侧都必须保留 两格座位 + 最大顺延座位(也就是已选座位减去自身)
      // 2.靠墙和靠已售的座位一律直接通过
      const checkNum = 2 + this.selectedSeat.length - 1;
      const gRowBasic = element.gRow;
      const gColBasic = element.gCol;
      let otherLoveSeatIndex = element.otherLoveSeatIndex;
      if (otherLoveSeatIndex != null) {
        // 如果是情侣座 不检测
        return true;
      }
      // 检查座位左侧
      let left = this.checkSeatDirection(gRowBasic, gColBasic, checkNum, "-");
      // 如果左侧已经检查出是靠着过道直接 返回true
      if (left === "special") {
        return true;
      }
      // 检查座位右侧
      let right = this.checkSeatDirection(gRowBasic, gColBasic, checkNum, "+");
      if (right === "special") {
        // 无论左侧是否是什么状态 检查出右侧靠着过道直接 返回true
        return true;
      } else if (right === "normal" && left === "normal") {
        // 如果左右两侧都有富裕的座位 返回true
        return true;
      } else if (right === "fail" || left === "fail") {
        // 如果左右两侧都是不通过检测 返回false
        return false;
      }
      return true;
    },
    // 检查左右侧座位满足规则状态
    checkSeatDirection: function (gRowBasic, gColBasic, checkNum, direction) {
      // 空位个数
      let emptySeat = 0;
      let x = 1; // 检查位置 只允许在x的位置出现过道,已售,维修
      for (let i = 1; i <= checkNum; i++) {
        let iter; // 根据 gRow gCol direction 找出检查座位左边按顺序排列的checkNum
        if (direction === "-") {
          iter = this.seatList.find(
            (el) => el.gRow === gRowBasic && el.gCol === gColBasic - i
          );
        } else if (direction === "+") {
          iter = this.seatList.find(
            (el) => el.gRow === gRowBasic && el.gCol === gColBasic + i
          );
        }
        if (x === i) {
          if (iter === undefined) {
            // 过道
            return "special";
          }
          if (
            iter.nowIcon === iter.soldedIcon ||
            iter.nowIcon === iter.fixIcon
          ) {
            // 已售或者维修
            return "special";
          }
          if (iter.nowIcon === iter.selectedIcon) {
            // 已选 顺延一位
            x++;
            continue;
          }
        } else {
          if (iter === undefined) {
            // 过道
            return "fail";
          }
          if (
            iter.nowIcon === iter.soldedIcon ||
            iter.nowIcon === iter.fixIcon ||
            iter.nowIcon === iter.selectedIcon
          ) {
            // 已售或者维修
            return "fail";
          }
        }
        emptySeat++;
        if (emptySeat >= 2) {
          return "normal";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 100%;
  background: linear-gradient(to right, #6f50f5, #c26dfe);
  line-height: 45px;
  text-align: center;
  color: white;
  font-size: 15px;
}

.pay-btn{
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 100%;
   line-height: 45px;
  text-align: center;
  color: black;
  font-size: 15px;
  display: flex;
  z-index: 99;
  padding: 0 20px;
  justify-content: space-between;

  .pay-cancel{
    width: 40%;
    background: #ccc;
    border-radius: 20px;
  }

  .pay-commit{
    width: 50%;
    border-radius: 20px;
    background: linear-gradient(to right, #6f50f5, #c26dfe);
  }
}

.pay {
  position: absolute;
  width: calc(100% - 40px);
  height: calc(100% - 320px - 100px);
  margin: 0 20px;
  background-color: #fff;
  border-radius: 18px;
  bottom: 250px;
  display: flex;
  flex-direction: column;
  z-index: 99;
  left: 50%;
  transform: translateX(-180px);
  overflow: hidden;

  & > div {
    display: flex;
    width: 100%; 
    padding: 20px;
    height: 20%;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.5s, height 0.5s;
  }

  .img-box {
    width: 40px;
    transform: width 0.5s;
    background-color: none;

    img {
      width: 100%;
      display: block;
    }
  }

  span {
    padding: 0 10px;
    padding-bottom: 4px;
    transition: font-size 0.5s, font-weight 0.5s, color 0.5s;
    font-size: 16px;
  }

  &>div:last-child {
    .img-box {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 80%;
      }
    }
  }

  .active {
    opacity: 1;
    height: 28%;
    transition: opacity 0.5s, height 0.5s;

    .img-box {
      width: 60px;
      transition: width 0.5s;
    }

    span {
      font-size: 22px;
      font-weight: bolder;
      color: rgba(44, 44, 44, 0.942);
      transition: font-size 0.5s, font-weight 0.5s, color 0.5s;
    }
  }

  button {
    margin-top: 5px;
    height: 30px;
    background-color: #fff;
    outline-style: none;
    border: none;
    // flex-grow: 1;
    font-weight: bolder;
    color: #000000ce;
    font-size: 14px;
  }
}
</style>