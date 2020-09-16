// 处理时间戳过滤器
import moment from "moment"
export function dateTime(v) {
    return moment(v * 1000).format("YYYY-MM-DD")
}

// 处理权限等级过滤器
export function levelRank(num) {
    let result = "";
    switch (num) {
        case "0":
            result = "一级";
            break;
        case "1":
            result = "二级";
            break;
        case "2":
            result = "三级";
            break;
        default:
            result = "没有等级"
    }
    return result;
}

// 处理是否付款过滤器
export function pay(num) {
    let result = "";
    switch (num) {
        case "0":
            result = "未付款";
            break;
        case "1":
            result = "已付款";
            break;
        default:
            result = "未知"
    }
    return result;
}