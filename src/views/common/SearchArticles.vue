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
import ArticleScrollPage from "@/views/common/ArticleScrollPage";
export default {
  name: "SearchArticles",
  components: {
    ArticleScrollPage
  },
  data() {
    return {
      article: {
        query: {
          condition: this.$store.state.query
        }
      }
    }
  },
  computed: {
    title (){
      return '查询结果 - happyfire'
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

