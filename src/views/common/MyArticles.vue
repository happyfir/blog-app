<template>
  <div v-title :data-title="title">
    <el-container>
      <el-main class="me-articles">
        <article-scroll-page v-bind="article"></article-scroll-page>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ArticleScrollPage from '@/views/common/ArticleScrollPage'
export default {
  name: "MyArticles",
  components: {
    ArticleScrollPage
  },
  created() {
    this.show()
  },
  data() {
    return {
      article: {
        query: {
          authorId: this.$store.state.id
        }
      }
    }
  },
  computed: {
    title (){
      return '我的文章 - happyfire'
    }
  },
  methods: {
    show() {
      if (this.$store.state.id == ""){
        this.$message({type: 'info', message: '还没有登陆 不能查询您的文章', showClose: true})
      }
    }
  }
}
</script>

<style scoped>
.el-container {
  width: 960px;
}

.el-aside {
  margin-left: 20px;
  width: 260px;
}

.el-main {
  padding: 0px;
  line-height: 16px;
}

.el-card {
  border-radius: 0;
}

.el-card:not(:first-child) {
  margin-top: 20px;
}
</style>
