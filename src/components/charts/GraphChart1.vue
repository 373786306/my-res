<template>
  <div class="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <div
      ref="chartRef"
      :class="`w-full ${heightClass}`"
      style="min-height: 400px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

// 节点类型
interface Node {
  id: string
  name: string
  category: number
  x?: number
  y?: number
}

// 边类型
interface Link {
  source: string
  target: string
}

// 定义 props
const props = withDefaults(
  defineProps<{
    nodes: Node[]
    links: Link[]
    heightClass?: string
  }>(),
  {
    heightClass: 'h-[700px]'
  }
)

// 图表容器引用
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value || !props.nodes.length) return

  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)

  // 分三列布局
  const width = chartRef.value.clientWidth
  const height = chartRef.value.clientHeight

  const colWidth = width / 4
  const colHeight = height * 0.8
  const topOffset = height * 0.1

  // 手动设置节点坐标
    // 手动设置节点坐标 + 样式
const positionedNodes = props.nodes.map(node => {
  const x = node.category === 0 
    ? colWidth 
    : node.category === 1 
      ? colWidth * 2 
      : colWidth * 3

  let y
  if (node.category === 0) {
    y = height / 2 
  } else {
    const categoryNodes = props.nodes.filter(n => n.category === node.category)
    const index = categoryNodes.findIndex(n => n.id === node.id)
    const count = categoryNodes.length
    // ✅ 关键：如果是第三列且只有一个节点，居中
    if (node.category === 2 && count === 1) {
      y = height / 2
    } else {
      // 其他情况：均匀分布
      y = topOffset + (index / (count - 1 || 1)) * colHeight
    }
  }

  // ✅ 动态计算 symbolSize
  const textWidth = node.name.length * 10 // ✅ 改名：textWidth
  const minWidth = 80
  const nodeHeight = 30 // ✅ 改名：nodeHeight，避免和外层 height 冲突

  const finalWidth = Math.max(textWidth, minWidth)

  // ✅ 颜色配置
  const colors = ['#FFA500', '#90EE90', '#87CEEB']
  const borderColors = ['#FFA500', '#90EE90', '#87CEEB']

  const bgColor = colors[node.category] || '#FFA500'
  const borderColor = borderColors[node.category] || '#00F5FF'

  return {
    ...node,
    x,
    y,
    symbolSize: [finalWidth, nodeHeight], 
    itemStyle: {
      color: bgColor,
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 6
    }
  }
})

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}`
        }
        return params.name
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'none', 
        data: positionedNodes,
        links: props.links,
        categories: [
          { name: '顶层' },
          { name: '中间层' },
          { name: '底层' }
        ],
        symbol: 'rect',
        roam: true,
        label: {
          show: true, // 确保显示标签
          position: 'inside', // 或者尝试使用 'right'
          fontSize: 12,
          color: '#000', // 调整字体颜色以便于阅读
          formatter: '{b}', // 使用 '{b}' 直接显示节点名称
        },
        // lineStyle: {
        //     width: 1.5,
        //     curveness: 0, // ✅ 关键：曲线弯曲度为 0 → 直线
        //     opacity: 0.8,
        //     color: '#555'
        // },
        emphasis: {
          focus: 'adjacency'
        },
        // 禁止节点拖拽（可选）
        draggable: false,
        itemStyle: {
            color: '#FFA500', // 直接指定颜色
            borderColor: '#00F5FF',
            borderWidth: 1,
            borderRadius: 6
            }
      }
    ]
  }

  chartInstance.setOption(option)

  const resizeHandler = () => chartInstance?.resize()
  window.addEventListener('resize', resizeHandler)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    chartInstance?.dispose()
  })
}

onMounted(() => {
  initChart()
})

// 数据变化时更新
watch(
  [() => props.nodes, () => props.links],
  () => {
    initChart()
  },
  { deep: true }
)
</script>

