<template>
  <div class="tree-chart-container" :style="{ width: containerWidth, height: containerHeight }">
    <!-- 图表容器 -->
    <div ref="chartRef" class="chart" />

    <!-- 全屏加载 -->
    <div v-loading="loading" class="loading-mask">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECElementEvent } from 'echarts'
import { ElMessage } from 'element-plus'

// 定义 props
interface Props {
  // 树结构数据
  data: any
  // 容器宽度（支持 '100%' 或 '800px'）
  width?: string
  // 容器高度
  height?: string
  // 是否显示加载状态
  loading?: boolean
  // 点击节点的回调
  onClick?: (node: any) => void
  // 是否展开所有节点（默认 -1 表示全部展开）
  initialTreeDepth?: number
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  width: '83vw',
  height: '70vh',
  loading: false,
  initialTreeDepth: -1,
  onClick: undefined
})

// 定义 emit 事件
const emit = defineEmits<{
  (e: 'node-click', nodeData: any): void
}>()

// 图表实例
let chartInstance: echarts.ECharts | null = null

// DOM 引用
const chartRef = ref<HTMLDivElement>()

// 容器尺寸
const containerWidth = ref(props.width)
const containerHeight = ref(props.height)

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 清除旧实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  function convertToEChartsData(rawData: any): any {
  return {
    name: rawData.productName || '未知节点',
    value: rawData.productId,
    children: rawData.children?.map((child: any) => convertToEChartsData(child)),
    // 👇 重要：把原始数据挂载上去，供后续使用
    rawData: rawData  // 保留原始对象
  }
}

  // 初始化
  chartInstance = echarts.init(chartRef.value)

  // 构建配置项
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        console.log('pppp: ', params)
        const data = params.data 
        return data.name || 'Unknown Node'
      }
    },
    series: [
      {
        type: 'tree',
        data: [convertToEChartsData(props.data)],
        top: '10%',
        left: '10%',
        bottom: '15%',
        right: '20%',
        orient: 'LR', // 方向：上到下
        initialTreeDepth: props.initialTreeDepth,
        symbol: 'rect',
        symbolSize: [120,30],
        edgeShape: 'polyline',
        edgeForkPosition: '30%',
        roam: true, // 支持缩放和平移
        
        label: {
          position: 'inside',
          verticalAlign: 'middle',
          align: 'center',
          fontSize: 13,
          fontWeight: 'bold',
          color: '#fff',
          distance: 10,
        },
        itemStyle: {
          borderColor: '#FFA500',
          borderWidth: 2,
          borderRadius: 6,
          color: '#FFA500' 
          // 动态颜色（示例：根据是否有子节点区分）
        //   color: ((params: any) => {
        //     const data = params.data
        //     return data.children && data.children.length > 0 ? '#3490de' : '#3490de'
        //   }) as any 
        },
        leaves: {
          label: {
            position: 'inside',
            verticalAlign: 'middle',
            align: 'center'
          }
        },
        expandAndCollapse: true,
        animationDuration: 500,
        animationDurationUpdate: 500,
        
      }
    ] 
  }

  chartInstance.setOption(option)

  // 绑定点击事件
  chartInstance.on('click', (params: ECElementEvent) => {
    const nodeData = params.data as any
    if (nodeData) {
      emit('node-click', nodeData)
      props.onClick?.(nodeData)
      ElMessage({
        message: `Clicked: ${nodeData.name || 'Unnamed'}`,
        type: 'info',
        duration: 1500
      })
    }
  })

  // 添加窗口 resize 监听
  window.addEventListener('resize', resizeChart)
}

// 调整图表大小
const resizeChart = () => {
  chartInstance?.resize()
}

// 监听数据变化
watch(
  () => props.data,
  () => {
    nextTick(() => {
      initChart()
    })
  },
  { deep: true }
)

// 监听宽高变化
watch([() => props.width, () => props.height], () => {
  containerWidth.value = props.width
  containerHeight.value = props.height
  nextTick(resizeChart)
})

// 页面挂载后初始化
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

// 组件卸载前销毁实例
onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener('resize', resizeChart)
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.tree-chart-container {
  position: relative;
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-mask {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: #fff;
}
</style>