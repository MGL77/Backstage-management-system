<template>
  <div class="data_report">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 简单卡片开始 -->
    <el-card class="box-card">
      <!-- 图表 -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
    <!-- 简单卡片结束 -->
  </div>
</template>

<script>
export default {
  methods: {
    init: function() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["华东", "华南", "华北", "西部", "其他"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "2017-12-27",
              "2017-12-28",
              "2017-12-29",
              "2017-12-30",
              "2017-12-31",
              "2018-1-1",
              "2018-1-2"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "华东",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "华南",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "华北",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "西部",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "其他",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {},
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    // 调用这个方法
    this.init();
  }
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
</style>