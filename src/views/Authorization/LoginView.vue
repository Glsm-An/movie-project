<template>
  <div class="form-wrapper">
    <div class="header">Movie Login</div>
    <div class="input-wrapper">
      <div class="border-wrapper">
        <input
          type="text"
          name="username"
          placeholder="请输入用户名"
          class="border-item"
          v-model.trim="username"
        />
      </div>
      <div class="border-wrapper">
        <input
          type="password"
          name="password"
          placeholder="请输入密码"
          class="border-item"
          v-model.trim="psd"
        />
      </div>
    </div>
    <div class="action">
      <div class="btn" @click="registerHandle">登录</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      username: "",
      psd: "",
    };
  },
  methods: {
    registerHandle() {
      if (this.username && this.psd) {
        let users = localStorage.users || "[]";
        users = JSON.parse(users);
        //判断账户是否已经注册
        let u = users.find((u) => u.username == this.username);

        if (!u) {
          Toast.fail("用户不存在");
          return;
        }

        if (u.psd == this.psd) {
          // 将token存入 localStorage 来做登录成功标记
          localStorage.token = "1231hxzusj145sqads528akk";
          Toast.success("登录成功");
          this.$emit("back");
          this.username = '';
          this.psd = '';
        } else {
          Toast.fail("密码错误");
          return;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.form-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: rgba(41, 45, 62, 0.8);
  color: #fff;
  border-radius: 2px;
  padding: 45px;
}

.form-wrapper .header {
  text-align: center;
  font-size: 30px;
  text-transform: uppercase;
  line-height: 100px;
}

.form-wrapper .input-wrapper input {
  background-color: rgb(41, 45, 62);
  border: 0;
  width: 100%;
  text-align: center;
  font-size: 15px;
  color: #fff;
  outline: none;
}

.form-wrapper .input-wrapper input::placeholder {
  text-transform: uppercase;
}

.form-wrapper .input-wrapper .border-wrapper {
  background-image: linear-gradient(to right, #e8198b, #0eb4dd);
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper .input-wrapper .border-wrapper .border-item {
  height: calc(100% - 4px);
  width: calc(100% - 4px);
  border-radius: 30px;
}

.form-wrapper .action {
  display: flex;
  justify-content: center;
}

.form-wrapper .action .btn {
  width: 60%;
  text-transform: uppercase;
  border: 2px solid #0e92b3;
  text-align: center;
  line-height: 50px;
  border-radius: 30px;
  cursor: pointer;
}

.form-wrapper .action .btn:hover {
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}

.form-wrapper .icon-wrapper {
  text-align: center;
  width: 60%;
  margin: 0 auto;
  margin-top: 20px;
  border-top: 1px dashed rgb(146, 146, 146);
  padding: 20px;
}

.form-wrapper .icon-wrapper i {
  font-size: 20px;
  color: rgb(187, 187, 187);
  cursor: pointer;
  border: 1px solid #fff;
  padding: 5px;
  border-radius: 20px;
}

.form-wrapper .icon-wrapper i:hover {
  background-color: #0e92b3;
}
</style>