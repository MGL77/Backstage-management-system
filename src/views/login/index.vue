<template>
  <div class="login">
    <div class="login_child">
      <el-form
        label-width="80px"
        :model="formLabelAlign"
        :rules="loginRules"
        :label-position="labelPosition"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="formLabelAlign.username" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formLabelAlign.password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleLogin">登录</el-button>
      <!-- <p>温馨提示：</p>
      <p>未登录过的新用户，自动注册</p>
      <p>注册过的用户可凭账号密码登录</p>-->
    </div>
  </div>
</template>

<script>
// 引入登录接口
import { login } from "../../http/api";
export default {
  data() {
    return {
      labelPosition: "left",
      formLabelAlign: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async handleLogin() {
      /**
       * 调用登录接口
       * 成功：
       *     保存token
       *     跳转到首页，并给出成功的提示
       * 失败：给出错误提示，让用户重新登录
       */
      const res = await login(this.formLabelAlign);
      // console.log(res);
      const { token } = res.result;
      // console.log(token);
      if (token) {
        localStorage.setItem("token", token);
        //记住上次没有token要访问的页面地址，如果登录成功，再返回到上次要访问到页面
        const { redirect } = this.$route.query;
        //如果直接登录，没有redirect,成功后直接跳转到home
        if (!redirect) {
          this.$router.push({ name: "home" });
        } else {
          this.$router.push({ path: redirect });
        }
      }
    }
  }
};
</script>


<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d4c6a;
}

.el-button {
  width: 300px;
  margin: 0 auto;
  display: block;
  margin-bottom: 20px;
}
.login_child {
  width: 300px;
  height: 165px;
  background-color: #ffff;
  padding: 30px;
  position: fixed;
  top: 230px;
  right: 500px;
  border-radius: 6px;
}
.login_child p {
  font-size: 12px;
  text-align: center;
  color: rgb(230, 68, 68);
  margin-bottom: 4px;
}
</style>