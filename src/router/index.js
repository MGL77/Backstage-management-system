import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

/**
 * 路由懒加载 
 */

// 测试
import About from "../views/About.vue"
// 登录
const login = () => import("../views/login")
// 主页
const home = () => import("../views/Home.vue")
// 用户列表
const userlist = () => import("../views/User_Management/userList.vue")
// 角色列表
const RoleList = () => import("../views/authority_management/RoleList.vue")
// 权限列表
const PermissionList = () => import("../views/authority_management/PermissionList.vue")
// 商品列表
const ProductList = () => import("../views/Commodity_management/ProductList.vue")
// 分类参数
const ClassificationParameters = () => import("../views/Commodity_management/ClassificationParameters.vue")
// 商品分类
const Categories = () => import("../views/Commodity_management/Categories.vue")
// 订单列表
// const OrderList = () => import("../views/Order_management/OrderList.vue")
import OrderList from "../views/Order_management/OrderList.vue"
// 数据报表
const DataReport = () => import("../views/Statistics/DataReport.vue")
// 商品列表点击添加商品要跳到的路由页面
const ProductList_children = () => import("../views/Commodity_management/ProductList_children.vue")


export default new VueRouter({
  mode: "history",
  routes: [{
      path: "/",
      component: home,
      name: "home",
      meta: {
        auth: true
      },
      // 主页下面的子路由
      children: [{
          path: "",
          redirect: "/userlist"
        },
        {
          path: "/userlist",
          component: userlist
        },
        {
          path: "/RoleList",
          component: RoleList
        },
        {
          path: "/PermissionList",
          component: PermissionList
        },
        {
          path: "/ProductList",
          component: ProductList,
        },
        {
          path: "/ClassificationParameters",
          component: ClassificationParameters
        },
        {
          path: "/Categories",
          component: Categories
        },
        {
          path: "/OrderList",
          component: OrderList
        },
        {
          path: "/DataReport",
          component: DataReport
        },
        {
          path: "/ProductList/ProductList_children",
          component: ProductList_children
        }
      ]
    },
    {
      path: "/login",
      component: login,
      name: "login"
    },
    {
      path: "/About",
      component: About
    },
  ]
})