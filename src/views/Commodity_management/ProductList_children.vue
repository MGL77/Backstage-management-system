<template>
  <div class="ProductList_children">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>

      <!-- 步骤头 -->
      <el-steps :active="tabType*1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- （大表单）标签页开始 ------------------------------------------------------------------------------------->
      <el-form :v-model="goodsForm" style="height:380px;overflow:auto">
        <el-tabs :tab-position="tabPosition" v-model="tabType" :before-leave="handleClick">
          <!-- 1开始 ------------------------------------->
          <el-tab-pane name="1" label="基本信息">
            <!-- 表单 -->
            <!-- <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign"> -->
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格">
              <el-input type="number" v-model="goodsForm.goods_price"></el-input>
            </el-form-item>

            <el-form-item label="商品重量">
              <el-input type="number" v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>

            <el-form-item label="商品数量">
              <el-input type="number" v-model="goodsForm.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <div class="block">
                <el-cascader
                  clearable
                  v-model="selectOtions"
                  :options="options"
                  :props="defaultProps"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>
            <!-- </el-form> -->
          </el-tab-pane>
          <!-- 1结束 ------------------------------------->

          <!-- 2开始 ------------------------------------->
          <el-tab-pane name="2" label="商品参数">
            <!-- 表单 -->
            <!-- <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign"> -->
            <el-form-item :label="item.attr_name" v-for="(item,index) in GoodsDynamic" :key="index">
              <el-checkbox-group v-model="checkList" @change="test">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2,index2) in item.attr_vals"
                  :key="index2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- </el-form> -->
          </el-tab-pane>
          <!-- 2结束 ------------------------------------->

          <!-- 3开始 ------------------------------------->
          <el-tab-pane name="3" label="商品属性">
            <!-- 表单 -->
            <!-- <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign"> -->
            <el-form-item :label="item.attr_name" v-for="(item,index) in GoodsStatic" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
            <!-- </el-form> -->
          </el-tab-pane>
          <!-- 3结束 ------------------------------------->

          <!-- 4开始 ------------------------------------->
          <el-tab-pane name="4" label="商品图片">
            <el-upload
              class="upload-demo"
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 4结束 ------------------------------------->

          <!-- 5开始 ------------------------------------->
          <el-tab-pane name="5" label="商品内容">
            <!-- 富文本开始 -->
            <div id="Test">
              <quill-editor ref="myTextEditor" v-model="goodsForm.goods_introduce"></quill-editor>
            </div>
            <!-- 富文本结束 -->
            <el-button type="success" size="small" class="cheng" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
          <!-- 5结束 ------------------------------------->
        </el-tabs>
      </el-form>
      <!-- （大表单）标签页结束 ------------------------------------------------------------------------------------->
    </el-card>
    <!-- 简单卡片结束 -->
  </div>
</template>

<script>
// 级联商品分类数据列表/商品动态和静态参数/添加商品/根据 ID 查询商品
import {
  getGoodsCate,
  getGoodsParams,
  addGoods,
  QueryID
} from "../../http/api";

// 富文本
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
// 富文本编辑器外部引用样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  // 富文本
  components: {
    quillEditor
  },
  data() {
    return {
      // 大表单(最后要提交到后台的是大表单内的所有信息)
      /**
       * goods_name	商品名称	不能为空
         goods_cat	以为','分割的分类列表	不能为空
         goods_price	价格	不能为空
         goods_number	数量	不能为空
         goods_weight	重量	不能为空
         goods_introduce	介绍	可以为空
         pics	上传的图片临时路径（对象）	可以为空
         attrs	商品参数和属性的结合（数组），包含 动态参数 和 静态属性
       */
      goodsForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },

      // 上传图片的请求头
      headers: {
        Authorization: localStorage.getItem("token")
      },

      // 上传图片
      fileList: [],

      // 标签页和步骤头建立关系
      tabType: "1",

      // 分类id
      currentCateID: "",

      // 动态参数
      GoodsDynamic: "",

      // 静态参数
      GoodsStatic: "",

      // 多选框组
      checkList: [],

      // 级联选择器
      selectOtions: [],
      options: [],
      defaultProps: {
        expandTrigger: "hover",
        label: "cat_name",
        children: "children",
        value: "cat_id"
      },

      // 标签页位置
      tabPosition: "left",

      // 表单
      labelPosition: "top",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      }
    };
  },
  created() {
    // 判断是否从编辑按钮进入
    if (this.$route.query.id) {
      this.JudgeId();
    }

    // 初始加载
    this.GetGoods();
  },

  methods: {
    // 获取级联商品分类数据
    async GetGoods() {
      // 调接口
      const res = await getGoodsCate();
      // console.log("级联商品分类..", res);
      this.options = res.result;
    },

    // 判断ID
    async JudgeId() {
      const res = await QueryID(this.$route.query.id);
      // console.log("商品总数据..", res);

      // console.log("级联..", res.result.goods_cat);
      let GetArray = res.result.goods_cat.split(",");
      // console.log("数组..", GetArray);
      let NewArray = [];
      GetArray.forEach(item => {
        NewArray.push(item * 1);
      });
      res.result.goods_cat = NewArray;
      this.goodsForm = res.result;
      // console.log("新数据..", this.goodsForm);
      this.selectOtions = NewArray;
      // console.log(this.selectOtions);
    },

    // 添加商品
    async addGoods() {
      this.goodsForm.goods_cat = this.selectOtions.join(",");
      // console.log("动态参数处理", this.GoodsDynamic);
      // 动态参数处理
      this.GoodsDynamic = this.GoodsDynamic.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join()
        };
      });

      // 静态参数处理
      this.GoodsStatic = this.GoodsStatic.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });

      this.goodsForm.attrs = [...this.GoodsDynamic, ...this.GoodsStatic];
      // 调用接口
      // console.log("添加商品", JSON.stringify(this.goodsForm));
      this.goodsForm.goods_id = "";
      const res = await addGoods(this.goodsForm);
      // console.log("添加商品返回的结果..", res);
      this.$router.push("/ProductList");
    },

    // 上传图片
    handleRemove(file, fileList) {
      // console.log("handleRemove", file, fileList);
    },
    // 上传图片预览
    handlePreview(file) {
      // console.log("handlePreview", file);
    },
    handleSuccess(file) {
      // console.log("handlePreview", file);
      this.goodsForm.pics.push({ pic: file.data.tmp_path });
    },

    // 多选框组
    test(e) {
      // console.log(e);
    },

    //  级联选择器
    handleChange(value) {
      // console.log("sadfasdf", value);
      this.selectOtions = value;
    },

    // 大表单
    async handleClick(activeName, oldActiveName) {
      // console.log(activeName);
      // console.log(oldActiveName);
      // console.log(this.goodsForm);
      // console.log(this.selectOtions);

      if (activeName === "2") {
        if (this.selectOtions.length !== 3) {
          this.$message({
            message: "您还没有选择三级分类",
            type: "error"
          });
          return false;
        } else {
          this.currentCateID = this.selectOtions[2];
          // 调分类参数接口
          const res = await getGoodsParams(this.currentCateID, "many");
          // console.log("商品分类参数..", res);
          this.GoodsDynamic = res.result;

          // 将attr_vals添加到临时数组中 为了默认全部选中
          let tempArr = [];
          this.GoodsDynamic.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(/\s+/g);
            tempArr.push(...item.attr_vals);
          });
          // console.log("正则..", this.GoodsDynamic);
          this.checkList = tempArr;
        }
      }

      if (activeName === "3") {
        if (this.selectOtions.length !== 3) {
          this.$message({
            message: "您还没有选择三级分类",
            type: "error"
          });
          return false;
        } else {
          this.currentCateID = this.selectOtions[2];
          //  调接口
          const res = await getGoodsParams(this.currentCateID, "only");
          // console.log("商品静态参数..", res);
          this.GoodsStatic = res.result;
        }
      }
    }
  }
};
</script>

<style scoped>
.ProductList_children >>> .ql-editor {
  min-height: 200px;
}
.cheng {
  margin-top: 20px;
}
.el-steps {
  margin-bottom: 20px;
}
.box-card {
  margin-top: 20px;
}
.el-alert {
  margin-bottom: 20px;
}
.ProductList_children >>> .el-step__title {
  font-size: 12px;
}
</style>