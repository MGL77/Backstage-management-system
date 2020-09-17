<template>
  <div class="Order">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <div class="search">
        <el-input
          @input="SearchUser"
          placeholder="请输入订单编号关键字搜索"
          clearable
          class="input-with-select"
          v-model="pageInfo.query"
        >
          <el-button slot="append" icon="el-icon-search" @click="SearchUser"></el-button>
        </el-input>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%;font-size: 12px;margin-top:20px" border>
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="order_number" label="订单编号" width="200px"></el-table-column>
          <el-table-column prop="order_price" label="订单价格"></el-table-column>
          <el-table-column prop="order_pay" label="是否付款">
            <template slot-scope="scope">
              <el-tag
                size="small"
                :type="tagType[scope.row.order_pay]"
              >{{ scope.row.order_pay | pay }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop label="下单时间">
            <template slot-scope="scope">
              <span>{{ scope.row.update_time | dateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-row>
                <!-- 修改地址 -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="ChangeAddress(scope.row)"
                ></el-button>
                <!-- 查看物流进度 -->
                <el-button type="success" size="mini" icon="el-icon-location" @click="progress"></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.pagenum"
            :page-sizes="[2, 4, 6]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <!-- 表格 -->
    </el-card>
    <!-- 简单卡片结束 -->

    <!-- 修改地址对话框开始 -->
    <div class="OrderList">
      <el-dialog title="修改地址" :visible.sync="OrderList" width="36%">
        <!-- ... -->
        <el-form :label-position="labelPosition">
          <!-- ... -->
          <el-form-item label="省市区/县" :label-width="formLabelWidth" prop>
            <!-- 三级联动开始 -->
            <el-cascader :options="cityOptions"></el-cascader>
            <!-- 三级联动结束 -->
          </el-form-item>

          <el-form-item label="详细地址" :label-width="formLabelWidth" prop>
            <el-input autocomplete="off" v-model="inputs"></el-input>
          </el-form-item>
          <!-- ... -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="OrderList = false">取 消</el-button>
          <el-button size="small" type="primary" @click="Confirm_to_modify_the_address">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改地址对话框结束 -->

    <!-- 查看物流进度开始 -->
    <div class="logistics" style="font-size:12px">
      <el-dialog title="查看物流进度" :visible.sync="Check" width="50%">
        <!-- 时间线 -->
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(item, index) in express_delivery"
            :key="index"
            :timestamp="item.time"
          >{{item.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
    <!-- 查看物流进度结束 -->
  </div>
</template>


<script>
// 三级联动 JS
import cityOptions from "../../assets/js/city_data2017_element.js";

//  引入lodash 用于防抖节流
import _ from "lodash";

// 订单列表/物流
import { OrderList, Logistics } from "../../http/api.js";

export default {
  data() {
    return {
      // 详细信息
      inputs: "",

      // 三级联动
      cityOptions: cityOptions,

      // 物流内的时间线
      reverse: false,

      // 物流
      Check: false,

      // 物流进度和时间
      express_delivery: [],
      timestamp: "",

      // 修改地址
      OrderList: false,

      // 修改地址对话框内input框的宽
      formLabelWidth: "106px",

      // 修改地址对话框的文字靠左
      labelPosition: "left",

      // 是否付款背景色
      tagType: ["danger", "success"],

      // 分页器共多少页
      total: 10,

      // 请求参数
      pageInfo: {
        query: "", // 搜索
        pagenum: 1, // 当前页码
        pagesize: 4 // 每页显示条数
      },

      // 订单
      tableData: []
    };
  },
  created() {
    this.GetOrderList();
  },
  methods: {
    // 查看物流进度
    async progress() {
      let res = await Logistics();
      // console.log("物流..", res);
      this.express_delivery = res.result;
      // console.log("物流..", this.express_delivery);
      this.Check = true;
    },

    // 确定修改地址
    Confirm_to_modify_the_address() {
      this.OrderList = false;
    },

    // 修改地址
    ChangeAddress() {
      this.OrderList = true;
    },

    // 获取订单列表数据
    async GetOrderList() {
      const res = await OrderList(this.pageInfo);
      // console.log("订单列表..", res);
      this.tableData = res.result.goods;
      this.total = res.result.total;
    },

    // 搜索(已加入防抖节流)
    SearchUser: _.debounce(function() {
      // console.log(this.pageInfo.query);
      this.GetOrderList();
    }, 300),

    // 分页器
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageInfo.pagesize = val;
      this.GetOrderList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageInfo.pagenum = val;
      this.GetOrderList();
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.input-with-select {
  width: 300px;
}
.block {
  margin-top: 20px;
}
</style>