<template>
  <el-header class="me-area">
    <el-row class="me-header">

      <el-col :span="2" class="me-header-left">
        <router-link to="/" class="me-title">
          <img src="../assets/img/happyfire.png"/>
        </router-link>
      </el-col>

      <el-col v-if="!simple" :span="12">
        <el-menu :router=true menu-trigger="click" active-text-color="#5FB878" :default-active="activeIndex"
                 mode="horizontal">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/category/all">文章分类</el-menu-item>
          <el-menu-item index="/tag/all">标签</el-menu-item>
          <el-menu-item index="/archives">文章归档</el-menu-item>
          <el-menu-item v-if="this.$store.state.id !== ''" index="/myArticles">我的文章</el-menu-item>
          <!--          <el-col :span="4" :offset="4">-->
          <el-menu-item v-if="this.$store.state.id !== ''" index="/write"><i class="el-icon-edit"></i>写文章</el-menu-item>
          <!--          </el-col>-->

        </el-menu>
      </el-col>

      <template v-else>
        <slot></slot>
      </template>


<!--            <el-col :span="6">-->
<!--              <el-menu  mode="horizontal" active-text-color="#5FB878">-->
<!--                  <el-menu-item >-->
<!--                    &lt;!&ndash; <el-input placeholder="请输入搜索内容"  @keyup.enter.native="searchHandler" v-model="search"></el-input> &ndash;&gt;-->

<!--                    <template>-->
<!--                      <el-button @click="clear()">清除</el-button>-->
<!--                      <el-autocomplete-->
<!--                        v-model="search.condition"-->
<!--                        :trigger-on-focus="false"-->
<!--                        :fetch-suggestions="querySearchAsync"-->
<!--                        debounce="1500"-->
<!--                        placeholder="请输入内容"-->
<!--                        @select="handleSelect"-->
<!--                        @keyup.enter.native="querySearchAsync"-->
<!--                      ></el-autocomplete>-->
<!--                    </template>-->

<!--                    </el-menu-item>-->
<!--              </el-menu>-->
<!--            </el-col>-->

<!--            搜索框-->
      <el-col :span="6" class="center">
        <el-menu>
          <el-menu-item>
            <el-input
              v-model="search.condition"
              @keyup.enter.native="searchHandler"
              placeholder="请输入搜索内容"
            >
              <el-button slot="append" icon="el-icon-search" id="search" @click="searchHandler"></el-button>
            </el-input>
            <el-card v-if="isSearch" >...</el-card>
          </el-menu-item>
        </el-menu>
      </el-col>


      <el-col :span="4">
        <el-menu :router=true menu-trigger="click" mode="horizontal" active-text-color="#5FB878">

          <template v-if="!user.login">
            <el-menu-item index="/login">
              <el-button type="text">登录</el-button>
            </el-menu-item>
            <el-menu-item index="/register">
              <el-button type="text">注册</el-button>
            </el-menu-item>
          </template>

          <template v-else>
            <el-submenu index>
              <template slot="title">
                <img class="me-header-picture" :src="user.avatar"/>
                {{ user.name }}
              </template>
              <el-menu-item index="/change"><i class="el-icon-back"></i>个人信息</el-menu-item>
              <el-menu-item index @click="logout"><i class="el-icon-back"></i>退出</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>

    </el-row>
  </el-header>
</template>

<script>
import {searchArticle} from '@/api/article'

export default {
  name: 'BaseHeader',
  props: {
    activeIndex: String,
    simple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: {
        condition: ''
      },
      articles: []
    }
  },
  computed: {
    isSearch() {
      return this.isFocus;
    },
    user() {
      let login = this.$store.state.account.length !== 0
      let avatar = this.$store.state.avatar
      let name = this.$store.state.name
      return {
        login, avatar, name
      }
    }
  },
  created() {

  },
  methods: {
    clear() {
      this.search.condition = '';
    },
    searchHandler() {
      this.$store.state.query = this.search.condition
      if (this.$router.history.current.fullPath === '/search'){
        this.$router.replace({path: '/empty'})
      }else {
        this.$router.push({path: '/search'})
      }
    },
    logout() {
      let that = this
      this.$store.dispatch('logout').then(() => {
        this.$router.push({path: '/'})
      }).catch((error) => {
        if (error !== 'error') {
          that.$message({message: error, type: 'error', showClose: true});
        }
      })
    },
    querySearchAsync(queryString, cb) {
      searchArticle(this.search).then((res) => {
        if (res.success) {
          var results = [];
          for (const item of res.data) {
            results.push({
              id: item.id,
              value: item.title
            });
          }
          cb(results)
        }
      })

    },
    handleSelect(item) {
      this.$router.push({path: '/view/' + item.id})
    }
  }
}
</script>

<style scoped>

.center {
}

#search {
  /*background-color: #ffc300;*/
  border-radius: 0%;
}

.el-button {
  border: 0;
  padding: 0;
}

.el-header {
  position: fixed;
  z-index: 1024;
  min-width: 100%;
  box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
}

.me-title {
  margin-top: 10px;
  font-size: 24px;
}

.me-header-left {
  margin-top: 10px;
}

.me-title img {
  max-height: 2.4rem;
  max-width: 100%;
}

.me-header-picture {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 50%;
  vertical-align: middle;
  background-color: #5fb878;
}
</style>
