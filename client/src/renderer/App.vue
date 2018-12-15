<template>
  <div id="app" ref="app">
    <v-app class="app" dark>
      <v-layout class="layout">
        <div v-for="item in items" :key="item.id">
          <v-card
            class="card"
            :style="{ top: (item.sequence * 5) + 'px' , 'z-index': -item.sequence}"
            >
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{item.name}}</h3>
                <div>{{item.description}}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange" @click="addTask(item.sequence)">Add</v-btn>
              <v-btn flat color="orange" @click="addTask(item.sequence)">Expand</v-btn>
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
    ]
  }),
  methods: {
    addTask (sequence) {
      this.items.push({
        sequence: this.items.length,
        title: 'そのほかのtlite',
        description: 'そのほかのdescriptionです'
      })
    },
    changeView (width, height) {
      ipcRenderer.send('changeView', { width: width, height: height })
    }
  },
  mounted () {
    this.changeView(this.$refs.app.clientWidth, (113 + this.items.length * 5))
  },
  watch: {
    items () {
      this.changeView(this.$refs.app.clientWidth, (113 + this.items.length * 5))
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
  position: absolute;
  top: 0px;
  z-index: 2;
  width: 400px;
  border-radius: 4px;
}
</style>
