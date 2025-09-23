<!-- RadarChart.vue -->
<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

// 定义 props
const props = defineProps({
  // 雷达图指标：[{ name: '网页', max: 100 }]
  indicator: {
    type: Array,
    required: true
  },
  // 图表数据：[{ value: [...], name: '访问数量', areaStyle: { color: '...' } }]
  chartData: {
    type: Array,
    required: true
  },
  // 雷达图形状：'polygon' | 'circle'
  shape: {
    type: String,
    default: 'circle'
  },
  // 区域填充颜色（如果 data 中没指定 areaStyle，使用此默认值）
  areaColor: {
    type: String,
    default: '#409EFF'
  },
  // 点的大小
  symbolSize: {
    type: Number,
    default: 8
  }
})

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
}

// 设置图表配置
const setOption = () => {
  if (!chartInstance) return

  // 给 chartData 中的每一项自动添加 areaStyle（如果未指定）
  const seriesData = props.chartData.map(item => ({
    ...item,
    areaStyle: item.areaStyle || { color: props.areaColor, opacity: 0.7 },
    lineStyle: item.lineStyle || { width: 2 }
  }))

  const option = {
    radar: {
      indicator: props.indicator,
      shape: props.shape,
      name: {
        textStyle: {
          color: '#333',
          fontSize: 12
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(120, 120, 120, 0.3)'
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(120, 120, 120, 0.5)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        symbolSize: props.symbolSize,
        data: seriesData,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ],
    tooltip: {
      trigger: 'item'
    }
  }

  chartInstance.setOption(option, true) // true: 清除旧配置
}

// 监听数据变化，重新渲染
watch(
  () => [props.indicator, props.chartData, props.shape],
  () => {
    setOption()
  },
  { deep: true }
)

// 挂载时初始化
onMounted(() => {
  initChart()
  setOption()

  // 窗口大小变化时，图表自适应
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

// 组件销毁前清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
  chartInstance?.dispose() // 释放 ECharts 实例
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>