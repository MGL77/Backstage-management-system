<template>
  <div class="Product">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <div class="search">
        <el-input
          @input="SearchUser"
          placeholder="请输入商品关键字搜索"
          clearable
          class="input-with-select"
          v-model="pageInfo.query"
        >
          <el-button slot="append" icon="el-icon-search" @click="SearchUser"></el-button>
        </el-input>
        <el-button class="AddUser" @click="ProductListChildren">添加商品</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%;font-size: 12px" border>
        <el-table-column label type="index" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <el-table-column prop label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.add_time | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-row>
              <!-- 编辑 -->
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="CommodityEditor(scope.row)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeProduct(scope.row.goods_id)"
              ></el-button>
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
    </el-card>
    <!-- 简单卡片结束 -->
    <!-- 商品编辑对话框开始 -->
    <div class="CommodityEditor">
      <el-dialog title="编辑商品" :visible.sync="Product" width="36%">
        <!-- ... -->
        <el-form
          :model="userinfo"
          :rules="rules"
          ref="editUserForm"
          :label-position="labelPosition"
        >
          <!-- ... -->
          <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goods_name">
            <el-input autocomplete="off" v-model="userinfo.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格(元)" :label-width="formLabelWidth" prop="goods_price">
            <el-input autocomplete="off" v-model="userinfo.goods_price"></el-input>
          </el-form-item>

          <el-form-item label="商品重量" :label-width="formLabelWidth" prop="goods_weight">
            <el-input autocomplete="off" v-model="userinfo.goods_weight"></el-input>
          </el-form-item>

          <el-form-item label="商品数量" :label-width="formLabelWidth" prop="goods_number">
            <el-input autocomplete="off" v-model="userinfo.goods_number"></el-input>
          </el-form-item>
          <!-- ... -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="Product = false">取 消</el-button>
          <el-button size="small" type="primary" @click.prevent="CommodityDetermination">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 商品编辑对话框结束 -->
  </div>
</template>

<script>
//  引入lodash 用于防抖节流
import _ from "lodash";

// 引入商品列表数据/删除商品/编辑商品/
import {
  ProductList,
  deleteProduct,
  EditProduct,
  
} from "../../http/api";
export default {
  data() {
    return {
      // 编辑对话框是否显示
      Product: false,

      // 编辑对话框内input框的宽
      formLabelWidth: "106px",

      // 编辑对话框的文字靠左
      labelPosition: "left",

      // 编辑
      userinfo: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },

      // 编辑验证
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 4, max: 60, message: "长度在 4 到 60 个字符", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格(元)", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { min: 1, max: 18, message: "长度在 1 到 18 个字符", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          {
            min: 1,
            max: 999,
            message: "长度在 1 到 999 个字符",
            trigger: "blur"
          }
        ]
      },

      // 分页器共多少页
      total: 10,

      // 商品
      tableData: [],

      // 请求参数
      pageInfo: {
        query: "", // 搜索
        pagenum: 1, // 当前页码
        pagesize: 4 // 每页显示条数
      }
    };
  },
  created() {
    // 初始加载
    this.GetProductList();
  },

  methods: {
    // 添加商品
    ProductListChildren() {
      this.$router.push({
        path: "/ProductList/ProductList_children"
      });
    },

    // 商品编辑对话框内的确定按钮
    CommodityDetermination() {
      this.$refs.editUserForm.validate(async valid => {
        if (valid) {
          const userid = this.userinfo.goods_id;
          // 向后台提交要编辑的数据
          const res = await EditProduct(userid, this.userinfo);
          console.log("更新提示..", res);

          // 拉取用户信息 更新视图
          this.GetProductList();
          this.Product = false;
        } else {
          return false;
        }
      });
    },

    // 打开商品编辑对话框
    CommodityEditor(user) {
      this.$router.push({
        path: "/ProductList/ProductList_children",
        query: {
          id: user.goods_id
        }
      });
      // console.log("...........", user);

      this.userinfo = _.cloneDeep(user);
      this.Product = true;
    },

    // 删除
    removeProduct(userid) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 调取删除接口
          const res = await deleteProduct(userid);
          // console.log(userid);
          // 拉取信息
          this.GetProductList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 搜索(已加入防抖节流)
    SearchUser: _.debounce(function() {
      // console.log(this.pageInfo.query);
      this.GetProductList();
    }, 300),

    // 分页器
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageInfo.pagesize = val;
      this.GetProductList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageInfo.pagenum = val;
      this.GetProductList();
    },

    // 获取商品列表
    async GetProductList() {
      const res = await ProductList(this.pageInfo);
      // console.log("商品列表..", res);
      this.tableData = res.result.goods;
      this.total = res.result.total;
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
.AddUser {
  margin-left: 20px;
  background-color: #e29407;
  border-color: #e29407;
  color: #fff;
}
.search {
  margin-bottom: 20px;
}
.block {
  margin-top: 20px;
}
</style>