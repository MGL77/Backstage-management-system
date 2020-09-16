<template>
  <div class="userlist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <div class="search">
        <el-input
          placeholder="请输入姓名关键字搜索"
          @input="SearchUser"
          clearable
          v-model="pageInfo.query"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="SearchUser"></el-button>
        </el-input>
        <el-button class="addUser" @click="dialogFormVisibles">添加用户</el-button>
      </div>
      <!-- 添加用户的弹框 -->
      <div class="dialogs">
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="36%">
          <!-- ... -->
          <el-form
            :model="userinfo"
            :rules="rules"
            ref="addUserForm"
            :label-position="labelPosition"
          >
            <!-- ... -->
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="userinfo.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="userinfo.password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="userinfo.email" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="userinfo.mobile" autocomplete="off"></el-input>
            </el-form-item>
            <!-- ... -->
          </el-form>
          <!-- ... -->
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click.prevent="addUsers">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <!-- 用户列表 -->
      <el-table :data="userlist" border style="width: 100%;font-size: 12px">
        <el-table-column align="center" label="#" type="index"></el-table-column>
        <el-table-column align="center" label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" width="180" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="setUserState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-row>
              <!-- 编辑 -->
              <el-button size="mini" icon="el-icon-edit" circle @click="Upmodify(scope.row)"></el-button>
              <!-- 删除 -->
              <el-button
                size="mini"
                icon="el-icon-delete-solid"
                circle
                @click="removeUser(scope.row.id)"
              ></el-button>
              <!-- 角色分配 -->
              <el-button
                size="mini"
                icon="el-icon-s-tools"
                circle
                @click="Role_Assignments(scope.row)"
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="Pagination">
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
    </el-card>
    <!-- 简单卡片结束 -->

    <!-- 修改用户信息对话框开始 -->
    <div class="modify">
      <el-dialog title="修改用户信息" :visible.sync="modify" width="36%">
        <!-- ... -->
        <el-form
          :model="userinfo"
          :rules="rules"
          ref="editUserForm"
          :label-position="labelPosition"
        >
          <!-- ... -->
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="userinfo.username" autocomplete="off" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="userinfo.email" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="userinfo.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <!-- ... -->
        </el-form>
        <!-- ... -->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="modify = false">取 消</el-button>
          <el-button size="small" type="primary" @click.prevent="editUsers">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改用户信息对话框结束 -->

    <!-- 删除提示框开始 -->
    <div class="rem"></div>
    <!-- 删除提示框结束 -->

    <!-- 角色分配对话框开始 -->
    <div class="Role_Assignments">
      <el-dialog title="分配角色" :visible.sync="Assignments" width="36%">
        <el-form :model="roleForm" :label-position="labelPosition">
          <div class="hao">
            <p>当前用户：{{ currentUser.username }}</p>
            <p style="margin-top:16px;margin-bottom:18px">当前角色：{{ currentUser.role_name }}</p>
          </div>
          <el-form-item label="分配区域">
            <el-select v-model="roleForm.roleName" placeholder="请选择角色">
              <el-option
                v-for="(item,index) in roles"
                :key="index"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="Assignments = false">取 消</el-button>
          <el-button size="small" type="primary" @click="Role">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 角色分配对话框角色 -->
  </div>
</template>

<script>
// 引入用户列表信息/添加用户信息/修改用户信息/删除用户/更新用户状态/用户角色列表
import {
  userlist,
  addUser,
  editUser,
  deleteUser,
  updateUserStatus,
  getUserRoleList
} from "../../http/api";

//  引入lodash 用于防抖节流
import _ from "lodash";

export default {
  data() {
    // 验证邮箱的函数
    const isEmail = (rule, value, callback) => {
      // 邮箱正则
      let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      let isTrue = reg.test(value);
      if (isTrue) {
        return callback();
      }
      callback(new Error("不符合邮箱的规则，请重新输入"));
    };

    // 验证手机号的函数
    const isMobile = (rule, value, callback) => {
      // 手机正则
      let reg = /^[1][3,4,5,7,8,6,9][0-9]{9}$/;
      let isTrue = reg.test(value);
      if (isTrue) {
        return callback();
      }
      callback(new Error("不符合手机的规则，请重新输入"));
    };

    return {
      // 弹出层的文字靠左
      labelPosition: "left",

      // 添加用户信息验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 14, message: "长度在 3 到 14 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: isEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: isMobile, trigger: "blur" }
        ]
      },
      modify: false, // 修改用户弹出层是否显示

      // 添加用户弹框
      formLabelWidth: "66px", // 弹出层内input框的宽
      dialogFormVisible: false, // 添加用户弹出层是否显示

      userinfo: {
        username: "", // 用户名
        password: "", // 密码
        email: "", // 邮箱
        mobile: "" // 手机号
      },

      /**
       * query: 搜索参数
       * pagenum:当前页码
       * pagesize:每页显示条数
       */
      pageInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4
      },

      // 用户列表
      userlist: [],

      // 分页器共多少页
      total: 10,

      // 角色分配对话框是否显示
      Assignments: false,

      // 分配角色
      roleForm: {
        region: ""
      },
      roles: [],

      // 当前用户信息
      currentUser: {}
    };
  },
  created() {
    // 初始加载用户列表信息
    this.getUserList();
  },
  methods: {
    // 打开角色分配对话框
    async Role_Assignments(user) {
      // console.log("user:", user);
      this.currentUser = user;
      this.Assignments = true;
      const res = await getUserRoleList();
      console.log("角色..", res);
      this.roles = res.result;
    },

    // 点击角色分配对话框内的确定按钮
    Role() {
      this.Assignments = false;
    },

    // 更新用户状态(开关)
    async setUserState(user) {
      // console.log("开关..", user);
      const { id, mg_state } = user;
      const res = await updateUserStatus(id, mg_state);
      this.getUserList();
    },

    // 打开删除提示框
    removeUser(userid) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 调取删除接口
          const res = await deleteUser(userid);
          // 拉取信息
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 点击表格内的修改按钮让修改信息对话框弹出
    Upmodify(user) {
      // 用lodash中的cloneDeep将user处理成深拷贝 不影响
      this.userinfo = _.cloneDeep(user);
      // this.userinfo = JSON.parse(JSON.stringify(user));
      this.modify = true;
      // console.log("点击当前用户信息..", user);
    },

    // 修改信息弹框内点击确定按钮并提交到后端
    editUsers() {
      this.$refs.editUserForm.validate(async valid => {
        if (valid) {
          const userid = this.userinfo.id;
          // 向后台提交要编辑的数据
          const res = await editUser(userid, this.userinfo);
          // console.log("更新提示..", res);
          // 拉取用户信息 更新视图
          this.getUserList();
          this.modify = false;
        } else {
          return false;
        }
      });
    },

    // 点击添加用户按钮弹出层是否显示
    dialogFormVisibles() {
      // 进入时清空userinfo
      this.userinfo = {};
      // 显示添加用户对话框
      this.dialogFormVisible = true;
    },

    // 添加用户确定按钮
    addUsers() {
      // console.log("添加用户信息..", this.userinfo);
      this.$refs.addUserForm.validate(async valid => {
        if (valid) {
          // console.log(valid);
          // 调用封装的接口将数据添加到后台
          const res = await addUser(this.userinfo);
          // console.log("添加完用户信息的结果..", res);
          this.userinfo = {
            // 添加完用户input 清空
            username: "",
            password: "",
            email: "",
            mobile: ""
          };
          this.dialogFormVisible = false; // 隐藏弹出层
        } else {
          // console.log(valid);
          return false;
        }
      });
    },

    // 搜索(已加入防抖节流)
    SearchUser: _.debounce(function() {
      // console.log(this.pageInfo.query);
      this.getUserList();
    }, 300),

    // 分页器
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageInfo.pagenum = val;
      this.getUserList();
    },

    // 获取用户列表
    async getUserList() {
      const res = await userlist(this.pageInfo);
      // console.log("用户列表..", res);
      let { pagenum, users, total } = res.result;
      this.pageInfo.pagenum = pagenum;
      this.userlist = users;
      this.total = total;
    }
  }
};
</script>

<style scoped>
.hao p {
  font-size: 14px;
  color: #606266;
}
.Pagination {
  margin-top: 20px;
}
.box-card {
  margin-top: 20px;
}
.input-with-select {
  width: 300px;
}
.addUser {
  margin-left: 20px;
  background-color: #c99117;
  border-color: #c99117;
  color: #fff;
}
.search {
  margin-bottom: 20px;
}
</style>