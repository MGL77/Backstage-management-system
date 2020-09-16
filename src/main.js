import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


// 导入vue-table-with-tree-grid树形表格组件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)


// echarts 
import echarts from "echarts"
// 这里把ecahrts对象注册到Vue原型方法中
Vue.prototype.$echarts = echarts


// 处理时间戳过滤器
import * as filters from "@/filters"
Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item])
})


// css 开始
import "@/assets/css/reset.css"
// css 结束

// element-ui开始
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// element-ui结束


// axios 开始
import axios from "axios"
Vue.prototype.http = axios
// axios 结束


//全局路由拦截开始
router.beforeEach((to, from, next) => {
  // console.log("from:", from);
  // console.log("to:", to.matched[0].meta.auth);
  if (to.matched[0].meta.auth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // console.log(ssssss)
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next();
  }
});
// 全局路由拦截结束


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");