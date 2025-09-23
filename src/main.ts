import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import persistedState from 'pinia-plugin-persistedstate'
import 'splitpanes/dist/splitpanes.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ComponentsPlugin from './plugins/components.ts'

import './assets/style/element-variables.css'
import 'element-plus/dist/index.css'
import './assets/style/index.css'
import './assets/style/style.css'

// 1. 导入插件
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createI18n } from 'vue-i18n'
import directives from './directives'


const i18n = createI18n({
  legacy: false,
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn',
  messages: {
    'zh-cn': {}
  }
})

import { createPinia } from 'pinia'
const pinia = createPinia()
pinia.use(persistedState)
const app = createApp(App)
app.use(directives)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(i18n)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
   // console.log(key, component)
  app.component(key, component)
}
app.use(ComponentsPlugin)
app.use(router)
app.use(pinia)

app.mount('#app')
