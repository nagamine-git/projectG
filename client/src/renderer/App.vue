<template>
  <div id="app" ref="app">
    <v-app class="app" dark>
      <v-layout class="layout">
        <div v-for="item in items" :key="item.id">
          <v-card
            class="card"
            :class="{expand: is_expand}"
            :style="{ top: (item.sequence * 5) + 'px' , 'z-index': -item.sequence}"
            >
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{item.title}}</h3>
                <div>{{item.description}}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange" @click="addTask(item.sequence)">Done</v-btn>
              <v-btn flat color="orange" @click="expandTasks()">Expand</v-btn>
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
    items: [
      {
        sequence: 0,
        title: 'ひとつめのtlite',
        description: 'ひとつめのdescriptionです'
      }
    ],
    is_expand: false
  }),
  methods: {
    addTask (sequence) {
      this.items.push({
        sequence: this.items.length,
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
    }
  },
  mounted () {
    this.init()
    this.start()
    this.changeView(this.$refs.app.clientWidth, (145 + this.items.length * 5))
  },
  watch: {
    items () {
      if (this.is_expand) {
        this.changeView(this.$refs.app.clientWidth, (this.items.length * (145 + 5)))
      } else {
        this.changeView(this.$refs.app.clientWidth, (145 + this.items.length * 5))
      }
    },
    is_expand () {
      if (this.is_expand) {
        this.changeView(this.$refs.app.clientWidth, (this.items.length * (145 + 5)))
      } else {
        this.changeView(this.$refs.app.clientWidth, (145 + this.items.length * 5))
      }
    }
  },
  computed: {
    memos () {
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
