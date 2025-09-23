<template>
  <!-- 外层容器：使用 Tailwind 样式 -->
  <div class="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <!-- 图表容器 -->
    <div
      ref="chartRef"
      :class="`w-full ${heightClass} transition-all duration-300`"
      style="min-height: 400px"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 定义节点和边的类型
interface GraphNode {
  id: string
  name: string
  category: number
  value?: number
  symbolSize?: number
}

interface GraphLink {
  source: string
  target: string
  value?: number
  lineStyle?: {
    curveness?: number
  }
}

interface GraphCategory {
  name: string
}

// 定义组件 props
const props = withDefaults(
  defineProps<{
    nodes: GraphNode[]
    links: GraphLink[]
    categories?: GraphCategory[]
    showTooltip?: boolean
    heightClass?: string // 自定义高度 Tailwind 类
  }>(),
  {
    nodes: () => [],     // ✅ 添加默认值
    links: () => [],
    categories: () => [],
    showTooltip: true,
    heightClass: 'h-[600px]' // 默认高度
  }
)

// 图表容器引用
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value || !props.nodes.length) return

  // 销毁旧实例
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)

  // ECharts 配置项
  const option: EChartsOption = {
    tooltip: props.showTooltip
      ? {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.dataType === 'edge') {
              return `<strong>关系：</strong><br/>${params.data.source} → ${params.data.target}`
            }
            const data = params.data as GraphNode
            return `<strong>${data.name}</strong><br/>ID: ${data.id}<br/>类别: ${props.categories?.[data.category]?.name || '未知'}`
          }
        }
      : undefined,

    series: [
      {
        type: 'graph',
        layout: 'force', // 力导向布局，适合关系图
        data: props.nodes,
        links: props.links,
        categories: props.categories,
        roam: true, // 支持缩放和平移
        label: {
          show: true,
          position: 'right',
          fontSize: 12
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        force: {
          repulsion: 800, // 节点间排斥力
          edgeLength: [50, 150], // 边的长度范围
          gravity: 0.1 // 重力，向中心靠拢
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          focus: 'adjacency', // 高亮相邻节点和边
          lineStyle: {
            width: 2
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 响应窗口大小变化
  const resizeHandler = () => chartInstance?.resize()
  window.addEventListener('resize', resizeHandler)

  // 清理
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  })
}

// 数据变化时重新渲染
watch(
  [() => props.nodes, () => props.links],
  () => {
    initChart()
  },
  { deep: true }
)

// 组件挂载后初始化
onMounted(() => {
  initChart()
})
</script>



<style scoped>
/* 可选：自定义样式 */
</style>