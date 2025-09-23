<template>
  <div class="top-right-btn" :style="style">
    <el-row class="flex space-x-2">
      <!-- 显示/隐藏搜索 -->
      <el-tooltip v-if="search" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="small" circle icon="Search" @click="toggleSearch" />
      </el-tooltip>

      <!-- 刷新 -->
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button size="small" circle icon="Refresh" @click="refresh" />
      </el-tooltip>

      <!-- 显隐列 -->
      <el-tooltip v-if="columns" effect="dark" content="显隐列" placement="top">
        <!-- transfer 模式 -->
        <el-button
          v-if="showColumnsType === 'transfer'"
          size="small"
          circle
          icon="Menu"
          @click="showColumn"
        />

        <!-- checkbox 模式 -->
        <el-dropdown
          v-if="showColumnsType === 'checkbox'"
          trigger="click"
          :hide-on-click="false"
          style="padding-left: 12px"
        >
          <el-button size="small" circle icon="Menu" />
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 全选/反选 -->
              <el-dropdown-item>
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model:checked="isChecked"
                  @change="toggleCheckAll"
                >
                  列展示
                </el-checkbox>
              </el-dropdown-item>
              <div class="check-line"></div>
              <!-- 每个列的显隐 -->
              <template v-for="item in columns" :key="item.key">
                <el-dropdown-item>
                  <el-checkbox v-model:checked="item.visible" @change="(e: any) => checkboxChange(e, item.label)">
                    {{ item.label }}
                  </el-checkbox>
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </el-row>

    <!-- 显隐列弹窗（transfer 穿梭框模式） -->
    <el-dialog v-model="open" :title="title" append-to-body>
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model:value="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Column {
  key: number
  label: string
  visible: boolean
}

const props = defineProps<{
  showSearch: boolean
  columns?: Column[]
  search: boolean
  showColumnsType: 'transfer' | 'checkbox'
  gutter: number
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:showSearch', value: boolean): void
  (e: 'queryTable'): void
}>()

// Data
const value = ref<number[]>([])
const open = ref(false)
const title = ref('显示/隐藏')

// Computed
const style = computed(() => {
  if (props.gutter) {
    return { marginRight: `${props.gutter / 2}px` }
  }
  return {}
})

const isChecked = computed({
  get: () => {
    return props.columns?.every((col) => col.visible) ?? false
  },
  set: () => {}
})

const isIndeterminate = computed(() => {
  const cols = props.columns
  if (!cols) return false
  return cols.some((col) => col.visible) && !isChecked.value
})

// Methods
const toggleSearch = () => {
  emit('update:showSearch', !props.showSearch)
}

const refresh = () => {
  emit('queryTable')
}

const dataChange = (data: any[]) => {
  props.columns?.forEach((col) => {
    col.visible = !data.includes(col.key)
  })
}

const showColumn = () => { 
  open.value = true
}

const checkboxChange = (event: any, label: string) => {

const isVisible = Boolean(event)
  const col = props.columns?.find((item) => item.label === label)
  if (col) {
    col.visible = isVisible
  }
}

const toggleCheckAll = () => {
  const newValue = !isChecked.value
  props.columns?.forEach((col) => {
    col.visible = newValue
  })
}

// Lifecycle
onMounted(() => {
  if (props.showColumnsType === 'transfer' && props.columns) {
    props.columns.forEach((item) => {
      if (!item.visible) {
        value.value.push(item.key)
      }
    })
  }
})
</script>

<style scoped>
.check-line {
  width: 90%;
  height: 1px;
  background-color: #ccc;
  margin: 3px auto;
}
</style>