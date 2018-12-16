<template>
  <div id="app" ref="app">
    <v-app class="app" dark>
      <v-layout class="layout">
        <div v-for="task in tasks" :key="task.sequence">
          <v-card
            class="card"
            :class="{expand: is_expand}"
            :style="{ top: (task.sequence * 5) + 'px' , 'z-index': -task.sequence}"
            >
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{task.title}}</h3>
                <div>{{task.description}}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange" @click="addTask(task.sequence)">Done</v-btn>
              <v-btn flat color="orange" @click="expandTasks()">Expand</v-btn>
              <v-btn flat color="orange" @click="RemoveTask(task.id)">Remove</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-layout>
    </v-app>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'xor',
  data: () => ({
    is_expand: false
  }),
  methods: {
    addTask (sequence) {
      this.tasks.push({
        sequence: this.tasks.length,
        title: 'そのほかのtlite',
        description: 'そのほかのdescriptionです'
      })
    },
    expandTasks () {
      this.is_expand = !this.is_expand
    },
    changeView (width, height) {
      ipcRenderer.send('changeView', { width: width, height: height })
    },
    init () {
      this.$store.dispatch('tasks/clear')
    },
    start () {
      this.$store.dispatch('tasks/startListener')
    },
    RemoveTask (id) {
      this.$store.dispatch('tasks/deletetask', {id})
    }
  },
  mounted () {
    this.init()
    this.start()
    this.changeView(this.$refs.app.clientWidth, (145 + this.tasks.length * 5))
  },
  watch: {
    tasks () {
      if (this.is_expand) {
        this.changeView(this.$refs.app.clientWidth, (this.tasks.length * (145 + 5)))
      } else {
        this.changeView(this.$refs.app.clientWidth, (145 + this.tasks.length * 5))
      }
      this.$forceUpdate()
    },
    is_expand () {
      if (this.is_expand) {
        this.changeView(this.$refs.app.clientWidth, (this.tasks.length * (145 + 5)))
      } else {
        this.changeView(this.$refs.app.clientWidth, (145 + this.tasks.length * 5))
      }
      this.$forceUpdate()
    }
  },
  computed: {
    tasks () {
      return this.$store.getters['tasks/data']
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons");
/* Global CSS */
html,
body {
  background-color: rgba(0, 0, 0, 0);
  display: inline-block;
}
.layout {
  width: 400px;
  display: inline-block;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
</style>
<style scoped>
/* Scoped CSS */
.app {
  background-color: rgba(0, 0, 0, 0);
}
.card {
  border-radius: 4px;
  width: 400px;
  position: absolute;
  top: 0px;
}
.card.expand {
  position: relative;
  top: auto;
}
</style>
