import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './components/router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/primevue.min.css'
// PrimeVue theme (required for proper component styling/functionality)
import 'primevue/resources/themes/aura-dark-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Import PrimeVue components
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import Image from 'primevue/image';
import Divider from 'primevue/divider';





const app = createApp(App)

// Use PrimeVue plugin

app.use(PrimeVue)
app.use(router)

// Register components globally
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('Checkbox', Checkbox)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Row', Row)
app.component('Image', Image)
app.component('Divider', Divider)


app.mount('#app')
