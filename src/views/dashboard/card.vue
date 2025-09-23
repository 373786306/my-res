<template>
  <el-card shadow="hover" class="card">
    <div class="card-content">
      <div class="title">{{ title }}</div>
      <div class="value">{{ value }}</div>
      <div class="total">
        总{{ totalLabel }}: {{ totalValue }}
      </div>
      <div class="icon">
        <i :class="icon"></i>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  totalLabel: string;
  totalValue: string;
  icon: string;
}>();
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-md overflow-hidden p-4;
}

.card-content {
  @apply flex justify-between items-center;
}

.title {
  @apply text-lg font-bold;
}

.value {
  @apply mt-2 text-xl;
}

.total {
  @apply mt-1 text-sm text-gray-500;
}

.icon {
  @apply text-4xl text-gray-400;
}
</style>