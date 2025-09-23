<template>
  <div ref="chart" ></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const chart = ref(null)

// 自定义颜色列表
const customColors = [

  '#2EC7C9',
  '#5AB1EF', 
  '#67E0E3', 
  '#B6E2DE',  
  '#C8B2F4',  
  '#E6E6FA', // 淡紫色（另一种色调）
  '#87CEFA', // 淡天蓝色
  '#F0E68C', // 卡其色

  // 扩展的颜色：
  '#FFB6C1', // 淡粉色
  '#FFD700', // 金色
  '#FFA07A', // 淡鲑红色
  '#FFB5C5', // 淡玫瑰色
  '#ADD8E6', // 淡蓝色
  '#D3D3D3', // 浅灰色
  '#FAEBD7', // 古董白色

  
]

const initChart = () => {
  const myChart = echarts.init(chart.value)
  const option = {
    // title: {
    //   text: props.title,
    //   left: 'center',
    //   top: 'top',
    //   textStyle: {
    //     fontSize: 16,
    //     fontWeight: 'bold'
    //   }
    // },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 'right',
      top: 'middle'
    },
    series: [
      {
        name: '标准分类',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          color: function(params) {
            return customColors[params.dataIndex]
          }
        }
      }
    ]
  }

  myChart.setOption(option)
}

onMounted(() => {
  initChart()

})

// 监听数据变化，重新渲染
watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)
</script>

<style scoped>

</style>