<template>
  <div id="app">
    <!-- <UniLabEditor/> -->
    <router-view/>
  </div>
</template>


<script>
// TODO: auth login, user database, course list page, hw list page, question list page, test list page
// import UniLabEditor from "./components/Editor.vue"
// import UniLabCourse from "./components/CourseList.vue"

export default {
  name: 'UniLab',
  components: {
    // UniLabEditor,
    // UniLabCourse,

  },
  data() {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    
  },
  // mounted 在初始化页面完成后，再对dom节点进行相关操作
  mounted() {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
}
</style>

