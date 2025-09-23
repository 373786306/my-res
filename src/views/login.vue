<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 bg-no-repeat bg-cover" :style="{ backgroundImage: 'url(' + loginBg + ')' }">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
      <h2 class="text-3xl font-bold text-center text-gray-800">登录</h2>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">用戶</label>
          <input
            v-model="form.username"
            id="email"
            type="text"
            placeholder="请输入用戶名"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': v$.username.$error }"
            autocomplete="username"
          />
          <p v-if="v$.username.$error" class="mt-1 text-sm text-red-500">{{ v$.username.$errors[0].$message }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': v$.password.$error }"
            autocomplete="current-password"
          />
          <p v-if="v$.password.$error" class="mt-1 text-sm text-red-500">{{ v$.password.$errors[0].$message }}</p>
          <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
        </div>

        <!-- Remember me & Forgot password -->
        <!-- <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span class="ml-2 text-sm text-gray-600">记住我</span>
          </label>
          <a href="#" class="text-sm text-blue-600 hover:underline">忘记密码？</a>
        </div> -->

        <!-- Submit button -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none"
          :disabled="loading"
        >
          <span v-if="!loading">登录</span>
          <span v-else>正在登录...</span>
        </button>
      </form>
      
      <!-- Sign up link -->
      <!-- <p class="text-center text-sm text-gray-600">
        还没有账号？
        <a href="#" class="text-blue-600 hover:underline">注册</a>
      </p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import loginBg from '@/assets/login-background.jpg?url'
import { reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import {useAuthStore} from '../stores/useAuthStore'

const authStore = useAuthStore()
const error = ref('');

// 表单数据
const form = reactive({
  username: 'admin',
  password: '123456'
})

// 验证规则
const rules = {
  username: { required},
  password: { required, minLength: minLength(6) }
}

const v$ = useVuelidate(rules, form)

// 模拟加载状态
const loading = ref(false)

// 提交处理
const onSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  loading.value = true
  try {
    await authStore.login(form.username, form.password)
  } catch (err) {
    console.log(err)
    loading.value = false
    authStore.clearTokens()
    error.value = '登录失败，请检查用户名或密码'
  }
}
</script>