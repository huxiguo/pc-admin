import type { App } from 'vue'
// ep 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
export default function registerIcons(app: App) {
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
}
