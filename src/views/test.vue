<template>
  <div class="Product">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 添加商品 -->
      <el-button class="AddUser" size="small" @click="addCategory">添加分类</el-button>

      <!-- vue-table-with-tree-grid树形表格组件开始 -->
      <zk-table
        ref="table"
        :data="data1"
        :columns="columns"
        :stripe="props.stripe"
        :border="props.border"
        :show-header="props.showHeader"
        :show-summary="props.showSummary"
        :show-row-hover="props.showRowHover"
        :show-index="props.showIndex"
        :tree-type="props.treeType"
        :is-fold="props.isFold"
        :expand-type="props.expandType"
        :selection-type="props.selectionType"
        sum-text="sum"
        index-text="#"
      ></zk-table>
      <!-- vue-table-with-tree-grid树形表格组件结束 -->

      <!-- 表格开始 -->
      <!-- <el-table :data="tableData" style="width: 100%;font-size:12px" border>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="name" label="是否有效">
          <i class="el-icon-success" style="color: lightgreen;"></i>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="tagType[scope.row.cat_level]"
            >{{ scope.row.cat_level | levelRank }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="edit_category(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="delCategories(scope.row.cat_id)"
              >删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>-->
      <!-- 表格结束 -->

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pagenum"
          :page-sizes="[4, 6]"
          :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 简单卡片结束 -->
    <!-- 添加分类对话框开始 -->
    <div class="category">
      <el-dialog title="添加分类" :visible.sync="category" width="36%">
        <!-- ... -->
        <el-form :label-position="labelPosition">
          <!-- ... -->
          <el-form-item label="分类名称" :label-width="formLabelWidth">
            <el-input autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="父级分类" :label-width="formLabelWidth">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <!-- ... -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="category = false">取 消</el-button>
          <el-button size="small" type="primary" @click="determine_category">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 添加分类对话框结束 -->

    <!-- 编辑对话框开始 -->
    <div class="edit">
      <el-dialog title="编辑分类" :visible.sync="edit" width="36%">
        <!-- ... -->
        <el-form
          :model="userinfo"
          :rules="rules"
          ref="editUserForm"
          :label-position="labelPosition"
        >
          <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
            <el-input autocomplete="off" v-model="userinfo.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="edit = false">取 消</el-button>
          <el-button size="small" type="primary" @click.prevent="determine_edit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑对话框结束 -->
  </div>
</template>

<script>
//  引入lodash 用于防抖节流
import _ from "lodash";

// 商品分类/删除分类商品/编辑分类
import { Categories, deleteProduct, Editcategory } from "../../http/api";
export default {
  data() {
    return {
      // vue-table-with-tree-grid树形表格组件开始
      props: {
        stripe: false,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false
      },
      columns: [
        { label: "姓名", align: "left", prop: "name", tree: true },
        { label: "序号", align: "center", prop: "id" },
        { label: "年龄", align: "center", prop: "age" },
        { label: "性别", align: "center", prop: "sex" },
        {
          label: "操作",
          align: "center",
          prop: "action",
          template: "action",
          type: "template",
          width: "180px"
        }
      ],
      data1: [
        {
          id: 1,
          name: "Jack",
          age: "17",
          sex: "男",
          children: [
            {
              id: 12,
              name: "Jack1",
              age: "12",
              sex: "女",
              children: [
                {
                  id: 13,
                  name: "Jack10",
                  age: "17",
                  sex: "男"
                }
              ]
            }
          ]
        }
      ],
      // vue-table-with-tree-grid树形表格组件结束

      // 编辑
      userinfo: {
        cat_name: "" // 商品名称
      },

      // 添加用户信息验证
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 4, max: 16, message: "长度在 4 到 16 个字符", trigger: "blur" }
        ]
      },

      // 编辑分类弹出层显示与否
      edit: false,

      // 添加分类弹出层的文字靠左
      labelPosition: "left",

      // 添加分类弹出层显示与否
      category: false,

      // 添加分类弹出层内input框的宽
      formLabelWidth: "96px",

      // 排序等级背景色
      tagType: ["default", "success", "danger"],

      // 分页器请求参数
      pageInfo: {
        pagenum: 1, // 当前页码
        pagesize: 4 // 每页显示条数
      },

      // 分页器共多少页
      total: 10,

      tableData: []
    };
  },
  created() {
    this.GetCategories();
  },
  methods: {
    // 编辑对话框
    edit_category(user) {
      // 用lodash中的cloneDeep将user处理成深拷贝 不影响
      this.userinfo = _.cloneDeep(user);
      this.edit = true;
    },

    // 编辑对话框内的确定按钮
    determine_edit() {
      this.$refs.editUserForm.validate(async valid => {
        if (valid) {
          const userid = this.userinfo.cat_id;
          // 向后台提交要编辑的数据
          const res = await Editcategory(userid, this.userinfo);
          console.log("更新提示..", res);
          // 拉取用户信息 更新视图
          this.GetCategories();
          this.edit = false;
        } else {
          return false;
        }
      });
    },

    // 添加分类的对话框
    addCategory() {
      this.category = true;
    },

    // 添加分类的对话框的确定按钮
    determine_category() {
      this.category = false;
    },

    // 删除
    delCategories(userid) {
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
          this.GetCategories();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分页器
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageInfo.pagesize = val;
      this.GetCategories();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageInfo.pagenum = val;
      this.GetCategories();
    },

    // 商品分类接口
    async GetCategories() {
      const res = await Categories(this.pageInfo);
      console.log("商品分类..", res);
      this.tableData = res.result.result;
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
  margin-bottom: 20px;
  background-color: #4f78a9;
  border-color: #4f78a9;
  color: #fff;
}
.search {
  margin-bottom: 20px;
}
.block {
  margin-top: 20px;
}
</style>