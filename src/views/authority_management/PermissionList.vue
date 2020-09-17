<template>
  <div class="Permission">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="Permission" style="width: 100%;font-size: 12px;height:500px;overflow:auto" border>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="260"></el-table-column>
        <el-table-column prop="path" label="路径" width="260"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag size="small" :type="tagType[scope.row.level]">{{ scope.row.level | levelRank }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 简单卡片结束 -->
  </div>
</template>

<script>
// 权限列表
import { PermissionList } from "../../http/api";
export default {
  data() {
    return {
      // 权限列表
      Permission: [],
      // 权限等级背景色
      tagType: ["default", "success", "danger"]
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取权限列表接口
    async getRightsList() {
      const res = await PermissionList("list");
      this.Permission = res.result;
      // console.log("权限列表信息结果..", this.Permission);
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
</style>