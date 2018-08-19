import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/mark/safe/:id',
      name: 'Mark Safe',
      component: Vue.component('mark', {
        template: `<p>Marked Safe</p>`,
        mounted () {
          const id = this.$route.params.id
          const ref = this.$root.$firebaseRefs.afe
          ref.child(id).child('safe').set(true)
            .then(() => { window.location.href = '/' })
        }
      })
    }
  ]
})
