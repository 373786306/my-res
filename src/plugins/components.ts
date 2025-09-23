//import rightToolbar from '../components/rightToolBar/index.vue'
//import AnotherComponent from '../components/AnotherComponent.vue'
import MyButton from './MyButton.vue'
import Tedd from './Tedd.vue'
import GenericTree from './GenericTree.vue'
import ImageUpload from './ImageUpload.vue'
import Pagination from './Pagination.vue'
import type { App } from 'vue'
import BaseSearchForm from './BaseSearchForm.vue'
import CommonTable from './CommonTable.vue'
import BaseFormDialog from '../components/BaseFormDialog/index.vue'

export default {
  install: (app: App) => {
    app.component('BaseFormDialog', BaseFormDialog)
    app.component('CommonTable', CommonTable)
    app.component('BaseSearchForm', BaseSearchForm)
    app.component('Pagination', Pagination)
    app.component('GenericTree', GenericTree)
    app.component('MyButton', MyButton)
    app.component('ImageUpload', ImageUpload)
    app.component('Tedd', Tedd)
    //app.component('AnotherComponent', AnotherComponent)
  }
}