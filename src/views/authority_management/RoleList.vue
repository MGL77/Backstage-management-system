<template>
  <div class="Role">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <div class="addRole">
        <el-button type="primary" size="small" @click="OpenRole">添加角色</el-button>
      </div>
      <!-- 表格 -->
      <div class="table" style="font-size: 12px;height:400px;overflow:auto">
        <el-table :data="tableData" border>
          <el-table-column type="expand">
            <!-- 角色权限开始 -->
            <template slot-scope="scope">
              <div v-if="scope.row.children.length">
                <el-row
                  style="margin-top:7px;margin-bottom:7px"
                  v-for="(item1,index) in scope.row.children"
                  :key="index"
                >
                  <!-- 1 -->
                  <el-col :span="8">
                    <el-tag
                      size="small"
                      closable
                      @close="deleteRights(scope.row.id,item1.id)"
                    >{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 2 -->
                  <el-col :span="16">
                    <el-row
                      v-for="(item2,index2) in item1.children"
                      :key="index2"
                      style="margin-bottom:7px"
                    >
                      <el-col :span="8">
                        <el-tag
                          closable
                          type="success"
                          size="small"
                          @close="deleteRights(scope.row.id,item2.id)"
                        >{{ item2.authName }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="16">
                        <el-tag
                          @close="deleteRights(scope.row.id,item3.id)"
                          type="warning"
                          closable
                          style="margin-right:7px;margin-bottom:10px"
                          size="small"
                          v-for="(item3,index3) in item2.children"
                          :key="index3"
                        >{{ item3.authName }}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>

              <el-row v-if="!scope.row.children.length">
                <el-col>
                  <el-tag type="danger" size="medium">该角色暂无权限</el-tag>
                </el-col>
              </el-row>
            </template>
            <!-- 角色权限结束 -->
          </el-table-column>
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="350">
            <!-- 图标按钮 -->
            <template slot-scope="scope">
              <el-row>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="EditRole(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRole(scope.row.id)"
                >删除</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="Authority(scope.row)"
                >分配权限</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 简单卡片结束 -->

    <!-- 添加角色对话框开始 -->
    <div class="Role">
      <el-dialog title="添加角色" :visible.sync="IsRole" width="36%">
        <!-- ... -->
        <el-form
          :label-position="labelPosition"
          :rules="rules"
          :model="RoleInformation"
          ref="addUserForm"
        >
          <!-- ... -->
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input autocomplete="off" v-model="RoleInformation.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
            <el-input autocomplete="off" v-model="RoleInformation.roleDesc"></el-input>
          </el-form-item>
          <!-- ... -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="IsRole = false">取 消</el-button>
          <el-button size="small" type="primary" @click="Addrole">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 添加角色对话框角色 -->

    <!-- 编辑角色对话框开始 -->
    <div class="edit">
      <el-dialog title="编辑角色" :visible.sync="IsEdit" width="36%">
        <!-- ... -->
        <el-form
          :label-position="labelPosition"
          :rules="rules"
          :model="RoleInformation"
          ref="editUserForm"
        >
          <!-- ... -->
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input autocomplete="off" v-model="RoleInformation.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
            <el-input autocomplete="off" v-model="RoleInformation.roleDesc"></el-input>
          </el-form-item>
          <!-- ... -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="IsEdit = false,clearBoth()">取 消</el-button>
          <el-button size="small" type="primary" @click="Addedit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑角色对话框角色 -->

    <!-- 分配权限对话框开始 -->
    <div class="Authority">
      <el-dialog title="分配权限" :visible.sync="Authoritys" width="36%">
        <!-- ... -->
        <el-form>
          <!-- Tree 树形控件开始 -->
          <!-- 
             Tree 属性说明:
             1. data:tree组件的数据源
             2. show-checkbox 显示tree组件的复选框
             3. node-key 指定tree组件每个节点唯一的key
             4. default-expanded-keys 默认展开的id
             5. default-checked-keys 默认选中的id
             6. props 指定tree组件的配置项 
          -->
          <el-tree
            ref="tree"
            :data="TreeData"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="checkArr"
            :props="defaultProps"
          ></el-tree>
          <!-- Tree 树形控件结束 -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="Authoritys = false,clearBoth()">取 消</el-button>
          <el-button size="small" type="primary" @click="UPAuthority">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 分配权限对话框结束 -->
  </div>
</template>

<script>
// 树形
import { getTreeIds } from "@/utils";
// lodash
import _ from "lodash";
// 引入角色列表信息/添加角色/删除角色/编辑角色/分配权限/删除角色指定权限/角色授权
import {
  RoleList,
  AddRole,
  deleteroles,
  editRoles,
  PermissionList,
  deleteRightsList,
  giveGight
} from "../../http/api";
export default {
  data() {
    return {
      // 分配权限
      TreeData: [],

      // tree 组件默认选中的数组 数组元素为id的集合
      checkArr: [], // 分析：包括全部选中的id + 部分选中的id

      defaultProps: {
        children: "children",
        label: "authName"
      },

      // 分配权限对话框是否显示
      Authoritys: false,

      // 添加角色的信息验证
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 9, message: "长度在 2 到 9 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      },

      RoleInformation: {
        roleName: "", // 角色名称
        roleDesc: "" // 角色描述
      },

      // 添加角色对话框是否显示
      IsRole: false,

      // 编辑角色对话框是否显示
      IsEdit: false,

      // 添加角色对话框内input框的宽
      formLabelWidth: "80px",

      // 添加角色对话框的文字靠左
      labelPosition: "left",

      // 角色列表
      tableData: [],
      //角色id
      roleId: ""
    };
  },
  created() {
    // 初始加载角色列表信息
    this.GetRoleList();
  },
  methods: {
    // 删除角色指定权限
    async deleteRights(roleId, rightId) {
      // 调接口
      const res = await deleteRightsList(roleId, rightId);
      // console.log("删除之后..", res);
      this.GetRoleList();
    },

    // 分配权限对话框点击显示
    async Authority(row) {
      // 1. 调取显示tree数据接口
      const res = await PermissionList("tree");
      // console.log("权限..", res);
      this.TreeData = res.result;
      // console.log('数据',row)
      this.roleId = row.id;
      // 2. 获取当前角色拥有的权限列表 并提取当前用户权限的id 组成一个数组
      // console.log("当前角色拥有的权限列表..", row);
      this.checkArr = getTreeIds(row);

      this.Authoritys = true;
    },

    // 分配权限对话框的确定按钮 向后台发请求
    async UPAuthority() {
      // 获取全部选中的tree节点
      const arr1 = this.$refs.tree.getCheckedKeys();

      // 获取部分选中的tree节点
      const arr2 = this.$refs.tree.getHalfCheckedKeys();

      // 合并全部选中和部分选中
      let str = [...arr1, ...arr2].join(",");

      // console.log("字符串", str);

      const res = await giveGight(this.roleId, { rids: str });

      this.GetRoleList();

      this.Authoritys = false;

      // console.log("全部..", arr1);
      // console.log("部分..", arr2);
    },

    // 点击编辑角色对话框内的确定按钮
    Addedit() {
      this.$refs.editUserForm.validate(async valid => {
        if (valid) {
          const userid = this.RoleInformation.id;
          // 向后台提交要编辑的数据
          const res = await editRoles(userid, this.RoleInformation);
          // console.log("更新提示..", res);
          // 拉取角色信息 更新视图
          this.GetRoleList();
          this.clearBoth();
          this.IsEdit = false;
        } else {
          return false;
        }
      });
    },

    clearBoth() {
      this.RoleInformation = {
        // 添加完角色input 清空
        roleName: "", // 角色名称
        roleDesc: "" // 角色描述
      };
    },

    // 打开编辑角色信息对话框
    EditRole(user) {
      this.RoleInformation = _.cloneDeep(user);
      this.IsEdit = true;
    },

    // 删除角色信息对话框
    deleteRole(userid) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 调用删除接口
          const res = await deleteroles(userid);
          // 拉取信息
          this.GetRoleList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 添加角色
    Addrole() {
      //  console.log("添加角色信息..", this.RoleInformation);
      this.$refs.addUserForm.validate(async valid => {
        if (valid) {
          // console.log(valid);
          // 调用封装的接口将数据添加到后台
          const res = await AddRole(this.RoleInformation);
          // console.log("添加完角色信息的结果..", res);
          this.RoleInformation = {
            // 添加完角色input 清空
            roleName: "", // 角色名称
            roleDesc: "" // 角色描述
          };
          this.GetRoleList();
          this.IsRole = false; // 隐藏弹出层
        } else {
          // console.log(valid);
          return false;
        }
      });
    },

    // 打开添加角色对话框
    OpenRole() {
      this.IsRole = true;
    },

    // 角色列表
    async GetRoleList() {
      const res = await RoleList();
      // console.log("角色列表..", res);
      this.tableData = res.result;
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
.addRole {
  margin-bottom: 20px;
}
</style>