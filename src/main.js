import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// --- Mount App ---
const target =
  document.getElementById('macgizmo-gridgen') ||
  document.getElementById('app')

const app = mount(App, { target })

if (typeof gridgenTrack === 'function') gridgenTrack('tool_loaded')
  
export default app
