// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Firebase from 'firebase/app'
import Key from './key'
import 'firebase/database'
import VueFire from 'vuefire'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueFire)

const app = Firebase.initializeApp(Key.firebase)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  firebase: {
    afe: app.database().ref('afe')
  },
  template: '<App/>',
  components: { App }
})
