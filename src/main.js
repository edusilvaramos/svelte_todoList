import App from './App.svelte'
import './app.css'

// downgrade para Svelte 4, donc pas de mount
const app = new App({
  target: document.getElementById('app'),
})

export default app
