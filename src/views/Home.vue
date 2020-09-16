<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <h6>
          <img src="../assets/img/火.png" alt class="imgs" />
        </h6>
        <h6 class="se">Inner Mongolia Autonomous Region</h6>
        <h6 class="outLogin">
          <img src="../assets/img/退出.png" @click="LoginOut" alt />
        </h6>
      </el-header>

      <el-container>
        <!-- 左侧开始 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 折叠开始 -->
          <div class="toggle-button" @click="togleCollapse">∮</div>
          <!-- 折叠结束 -->
          <el-menu
            default-active="1-4-1"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            text-color="#000"
            active-text-color="#ffd04b"
            :router="true"
            :collapse="isCollapse"
          >
            <!-- 1 -->
            <el-submenu index="1">
              <template slot="title">
                <img src="../assets/img/用户管理 (1).png" alt />
                <span>用户管理</span>
              </template>

              <el-menu-item index="/userlist">
                <img src="../assets/img/用户列表 (3).png" alt />
                用户列表
              </el-menu-item>
            </el-submenu>
            <!-- 2 -->
            <el-submenu index="2">
              <template slot="title">
                <img src="../assets/img/权限管理 6w.png" alt />
                <span>权限管理</span>
              </template>

              <el-menu-item index="/RoleList">
                <img src="../assets/img/角色列表.png" alt />
                角色列表
              </el-menu-item>
              <el-menu-item index="/PermissionList">
                <img src="../assets/img/权限列表.png" alt />
                权限列表
              </el-menu-item>
            </el-submenu>
            <!-- 3 -->
            <el-submenu index="3">
              <template slot="title">
                <img src="../assets/img/商品 管理.png" alt />
                <span>商品管理</span>
              </template>

              <el-menu-item index="/ProductList">
                <img src="../assets/img/商品列表.png" alt />
                商品列表
              </el-menu-item>
              <el-menu-item index="/ClassificationParameters">
                <img src="../assets/img/参数.png" alt />
                分类参数
              </el-menu-item>
              <el-menu-item index="/Categories">
                <img src="../assets/img/商品分类.png" alt />
                商品分类
              </el-menu-item>
            </el-submenu>
            <!-- 4 -->
            <el-submenu index="4">
              <template slot="title">
                <img src="../assets/img/订单管理 (1).png" alt />
                <span>订单管理</span>
              </template>

              <el-menu-item index="/OrderList">
                <img src="../assets/img/订单列表.png" alt />
                订单列表
              </el-menu-item>
            </el-submenu>
            <!-- 5 -->
            <el-submenu index="5">
              <template slot="title">
                <img src="../assets/img/数据统计头标.png" alt />
                <span>数据统计</span>
              </template>

              <el-menu-item index="/DataReport">
                <img src="../assets/img/数据报表分析.png" alt />
                数据报表
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 左侧结束 -->

        <!-- 右侧开始 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 右侧结束 -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 折叠
      isCollapse: true
    };
  },
  methods: {
    // 折叠开始
    togleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 折叠结束

    LoginOut() {
      // 清除token
      localStorage.removeItem("token");
      // 返回到登录页
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style scoped>
.toggle-button {
  background-color: darkslategray;
  font-size: 16px;
  line-height: 60px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu img {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
.el-aside {
  background-color: darkslategray;
}
.el-menu {
  border-right: 0.01rem solid darkslategray;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: darkslategray;
}
.home {
  height: 100%;
}
.el-header {
  background: #eb5757;
  background: -webkit-linear-gradient(to right, #000000, #eb5757);
  background: linear-gradient(to right, #000000, #eb5757);
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-header h6 {
  width: 260px;
  line-height: 60px;
}
.outLogin {
  color: #833636;
  cursor: pointer;
}
.outLogin img {
  width: 24px;
  height: 24px;
  float: right;
}
.el-header .imgs {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 635px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.se {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
  overflow: hidden;
  font-size: 14px;
  font-style: oblique;
  font-weight: bold;
  text-align: center;
  background-image: -webkit-linear-gradient(
    left,
    #1a5388,
    #5a3a16,
    #c99117,
    #e29407,
    #4f78a9,
    #ca534e,
    #969b9c,
    #3e5626,
    #1a5388,
    #5a3a16,
    #c99117,
    #e29407,
    #daa48d,
    #943c03
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  animation: stream 15s infinite linear;
  background-size: 200% 100%;
}
@keyframes stream {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
