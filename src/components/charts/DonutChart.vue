<!-- RoseChart.vue -->
<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

// 定义 props，接收父组件传入的数据
const props = defineProps({
  // 图表数据，格式：[{ value: 10, name: 'A' }]
  chartData: {
    type: Array,
    required: true,
    default: () => []
  },
  // 图例位置
  legendTop: {
    type: String,
    default: '5%'
  },
  // 是否显示标签
  showLabel: {
    type: Boolean,
    default: false
  }
})

const customColors = [

  '#C8B2F4',  
  '#E6E6FA', // 淡紫色（另一种色调）
  '#87CEFA', // 淡天蓝色
  '#F0E68C', // 卡其色
  '#2EC7C9',
  '#5AB1EF', 
  '#67E0E3', 
  '#B6E2DE',  

  // 扩展的颜色：
  '#FFB6C1', // 淡粉色
  '#FFD700', // 金色
  '#FFA07A', // 淡鲑红色
  '#FFB5C5', // 淡玫瑰色
  '#ADD8E6', // 淡蓝色
  '#D3D3D3', // 浅灰色
  '#FAEBD7', // 古董白色

  
]

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
}

// 设置图表选项
const setOption = () => {
  if (!chartInstance) return

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)' // 显示名称、数值、百分比
    },
    legend: {
      top: props.legendTop,
      left: 'center',
      data: props.chartData.map(item => item.name) // 自动匹配数据名称
    },
    series: [
      {
        name: '分类统计',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        roseType: 'radius', 
        avoidLabelOverlap: true,
        
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          borderRadius: 4, // 扇形圆角
          borderColor: '#fff',
          borderWidth: 1,
          color: function(params) {
            return customColors[params.dataIndex];
          }
        },
        data: props.chartData
      }
    ]
  }

  chartInstance.setOption(option, true) // true 表示覆写，避免 merge 问题
}

// 监听数据变化，自动更新图表
watch(
  () => props.chartData,
  () => {
    setOption()
  },
  { deep: true }
)

// 页面挂载后初始化
onMounted(() => {
  initChart()
  setOption()

  // 自适应窗口大小
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

// 组件销毁前清除事件和实例
onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
  chartInstance?.dispose() // 释放资源
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
  /* 可选：添加圆角 */
  /* border-radius: 12px; */
  /* overflow: hidden; */
}
</style>