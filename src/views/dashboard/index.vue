<template>
  <div>
    <!-- 数据统计卡片 -->
    <!-- <el-row :gutter="20" class="mb-4">
      <el-col :span="6" v-for="(item, index) in statisticsData" :key="index">
        <Card
          :title="item.title"
          :value="item.value"
          :totalLabel="item.totalLabel"
          :totalValue="item.totalValue"
          :icon="item.icon"
        />
      </el-col>
    </el-row> -->

    <el-row :gutter="20" class="mb-4">
      <el-col :span="24">
        <el-card shadow="hover" class="h-full">
          <div slot="header" class="flex justify-between items-center">
            <span>标准行业统计</span>
            <!-- <el-tabs v-model="trafficTabsActiveName">
              <el-tab-pane label="流量趋势" name="day"></el-tab-pane>
              <el-tab-pane label="月访问量" name="month"></el-tab-pane>
            </el-tabs> -->
          </div>
          <div class="h-96 bg-white rounded-lg shadow-md overflow-hidden">
            <bar-chart :x-data="industryData.xAxisData" :series-data="industryData.seriesData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="h-full">
          <div slot="header" class="flex justify-between items-center">
            <span>标准状态统计</span>
          </div>
          <div class="chart-container h-64">
            <RadarChart
              :indicator="indicator"
              :chart-data="standardStatusData"
              shape="circle"
              area-color="#409EFF"
              symbol-size="8"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="h-full">
          <div slot="header" class="flex justify-between items-center">
            <span>标准分类统计</span>
          </div>
          <div class="h-64 bg-white rounded-lg shadow-md overflow-hidden p-4">
            <pie-chart :data="chartData" class="h-64 w-full "  />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="h-full">
          <div slot="header" class="flex justify-between items-center">
            <span>产品模块统计</span>
          </div>
          <div class="chart-container h-64">
            <donut-chart :chart-data="productData" :show-label="true" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { industryStatistics, categoryStatistics, standardStatusStatistics, productStatistics} from '../../services/dashboard/statisticsService'
import BarChart from '../../components/charts/barChart.vue';
import PieChart from '../../components/charts/PieChart.vue';  
import DonutChart from '../../components/charts/DonutChart.vue';

import RadarChart from '../../components/charts/RadarChart.vue';
//import Card from './card.vue';

const indicator = ref<{name: string, max: number}[]>([])


const industryData = ref({
  xAxisData: [],
  seriesData: []
})

const productData = ref([])

onMounted(() => {
  industryInfo()
  categoryInfo()
  productInfo()
  standardStatusInfo()
})

interface SeriesData {
  value: number[];
  name: string;
  areaStyle?: { color: string }; // 可选
}

const standardStatusData = ref<SeriesData[]>([])

const chartData = ref([])
const standardStatusInfo = async () => {
    const res = await standardStatusStatistics()

    let obj: SeriesData = {
      value: [],
      name: '标准状态统计'
    }
    if (res.length > 0) {
      let max = 100
       res.forEach((element: any, index: number) => {
        if(index === 0) {
          max = element.total_count
        }
        obj.value.push(element.total_count)
        let o = {
          name: element.std_sta_value,
          max: max
        }
        indicator.value.push(o)
    });
    standardStatusData.value.push(obj) 
    console.log(indicator.value)
   }
    
}

const productInfo = async () => {
  const res = await productStatistics()
  productData.value = res
}

const categoryInfo = async () => {
  const res = await categoryStatistics()
  chartData.value = res
}

const industryInfo = async () => {
  const res = await industryStatistics()
  industryData.value.xAxisData = res.map((item: any) => item.industryName),
  industryData.value.seriesData = res.map((item: any) => item.count)
}

</script>

<style scoped>
.dashboard-container {
  @apply p-4;
}

.chart-container {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}
</style>