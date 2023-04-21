import { createApp } from 'vue'
import router from './router'
import registerIcons from './global/register-epIcons'
import pinia from '@/stores'
import '@/assets/css/index.less'

import App from './App.vue'

const app = createApp(App)
app.use(registerIcons)

app.use(pinia)
app.use(router)
app.mount('#app')
