import { createApp } from 'vue'
// import './style.css'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import './assets/tailwind.css'

/* import font awesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */

import { faClock, faTag, faEye, faThumbsUp, faComment, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGithubAlt, faBilibili } from '@fortawesome/free-brands-svg-icons'
/* add icons to the library */
library.add(faClock, faTag, faEye, faThumbsUp, faComment, faSearch, faGithub, faGithubAlt, faBilibili)

import router from './router'
import App from './App.vue'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App)
// app.use(ElementPlus)
app.use(VMdEditor)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
