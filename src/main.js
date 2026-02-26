import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// Mount to WordPress target or dev fallback
const target =
  document.getElementById('macgizmo-gridgen') ||
  document.getElementById('app')

const app = mount(App, { target })

export default app
