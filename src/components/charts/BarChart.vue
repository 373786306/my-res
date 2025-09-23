<template>
  <div ref="chart" class="h-full w-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// 定义组件接收的 props
const props = defineProps({
  xData: {
    type: Array,
    required: true,
    default: () => []
  },
  seriesData: {
    type: Array,
    required: true,
    default: () => []
  }
})

const chart = ref(null)
let myChart = null

// 初始化图表
const initChart = () => {
  if (!chart.value) return

  // 如果已存在实例，先释放
  if (myChart) {
    myChart.dispose()
  }

  myChart = echarts.init(chart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: props.xData,
      axisLabel: {
        rotate: 0, // 如果文字太长，可以旋转
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: props.seriesData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#79bbff' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }

  myChart.setOption(option)
}

// 组件挂载后初始化图表
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

// 监听数据变化，动态更新图表
watch(
  () => [props.xData, props.seriesData],
  () => {
    nextTick(() => {
      initChart()
    })
  },
  { deep: true }
)

// 窗口大小变化时，图表自适应
const onResize = () => {
  if (myChart) myChart.resize()
}
window.addEventListener('resize', onResize)

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px; /* 建议设置具体高度，避免 100% 在某些布局中失效 */
}
</style>