import request from "./request";

// 登录接口
export function login(data) {
    // console.log(data)
    return request({
        url: "login",
        method: "POST",
        data // post 方法用data
    });
}

// 用户列表接口
export function userlist(params) {
    // console.log(params)
    return request({
        url: "users",
        method: "GET",
        params // get 方法用params
    });
}

// 添加用户接口
export function addUser(data) {
    return request({
        url: "users",
        method: "POST",
        data
    });
}

// 编辑用户信息
export function editUser(userid, data) {
    return request({
        url: `users/${ userid }`,
        method: "PUT", // get post put(更新全部) delete(删除) patch(部分更新)
        data
    });
}

// 删除用户接口
export function deleteUser(userid) {
    return request({
        url: `users/${ userid }`,
        method: "DELETE",
    });
}

// 更新用户状态（开关）
export function updateUserStatus(id, status) {
    return request({
        url: `users/${ id }/state/${ status }`,
        method: "PUT",
    });
}

// 角色列表接口
export function RoleList() {
    return request({
        url: "roles",
        method: "GET",
    });
}

// 添加角色接口
export function AddRole(data) {
    return request({
        url: "roles",
        method: "POST",
        data
    });
}

// 删除角色接口
export function deleteroles(userid) {
    return request({
        url: `roles/${ userid }`,
        method: "DELETE",
    });
}

// 编辑角色接口
export function editRoles(userid, data) {
    return request({
        url: `roles/${ userid }`,
        method: "PUT", // get post put(更新全部) delete(删除) patch(部分更新)
        data
    });
}

// 删除角色指定权限接口
export function deleteRightsList(roleId, rightId) {
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: "DELETE",
    });
}

// 角色授权
export function giveGight(roleId, data) {
    return request({
        url: `roles/${roleId}/rights`,
        method: "POST",
        data
    });
}


// 权限列表接口
export function PermissionList(type = "list") {
    return request({
        url: `rights/${type}`,
        method: "GET",
    });
}

// 商品列表数据
export function ProductList(params) {
    return request({
        url: "goods",
        method: "GET",
        params // get 方法用params
    });
}

// 编辑商品接口
export function EditProduct(userid, data) {
    return request({
        url: `goods/${ userid }`,
        method: "PUT", // get post put(更新全部) delete(删除) patch(部分更新)
        data
    });
}


// 删除商品接口
export function deleteProduct(userid) {
    return request({
        url: `goods/${ userid }`,
        method: "DELETE",
    });
}

// 商品分类接口
export function Categories(params) {
    return request({
        url: "categories",
        method: "GET",
        params // get 方法用params
    });
}

// 编辑分类接口
export function Editcategory(userid, data) {
    return request({
        url: `categories/${ userid }`,
        method: "PUT", // get post put(更新全部) delete(删除) patch(部分更新)
        data
    });
}

// 订单列表接口
export function OrderList(params) {
    return request({
        url: "orders",
        method: "GET",
        params // get 方法用params
    });
}

// 查看物流信息接口
export function Logistics() {
    return request({
        url: `/kuaidi/1106975712662`,
        method: "GET",
    });
}

// 级联商品分类数据列表接口
export function getGoodsCate() {
    return request({
        url: `categories`,
        method: "GET",
        params: {
            type: 3
        }
    });
}

/*
商品动态和静态参数接口 
默认动态参数 many
静态参数 only
*/
export function getGoodsParams(cateId, type) {
    return request({
        url: `categories/${cateId}/attributes`,
        method: "GET",
        params: {
            sel: type
        }
    });
}

// 添加商品接口
export function addGoods(data) {
    return request({
        url: `goods`,
        method: "POST",
        data
    });
}

// 用户角色列表
export function getUserRoleList() {
    return request({
        url: "roles",
        method: "GET",
    });
}


// 根据 ID 查询商品
export function QueryID(userid, params) {
    return request({
        url: `goods/${ userid }`,
        method: "GET", 
        params
    });
}