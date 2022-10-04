<template>
  <div id="Change" v-title data-title="个人信息 - happyfire">
    <!--<video preload="auto" class="me-video-player" autoplay="autoplay" loop="loop">
          <source src="../../static/vedio/sea.mp4" type="video/mp4">
      </video>-->

    <div class="me-login-box me-login-box-radius">
      <h1>个人信息</h1>

      <span>账号</span>
      <el-form ref="userForm" :model="userForm" :rules="rules">
        <el-form-item prop="account">
          <el-input disabled="true" placeholder="账号" v-model="userForm.account"></el-input>
        </el-form-item>
        <span>昵称</span>
        <el-form-item prop="nickname">
          <el-input :disabled="disEditNickName" placeholder="昵称" v-model="userForm.nickname"></el-input>
          <el-button class="change" @click="editNickName">修改</el-button>
        </el-form-item>
        <span>头像</span>
<!--        action="/api/users/avatar"-->
        <el-upload
          class="avatar-uploader"
          action="/api/upload/avatar"
          :data="ImageData"
          drag="true"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon">上传头像</i>
        </el-upload>
        <span>密码</span>
        <el-form-item prop="oldPassword">
          <el-input :disabled="disEditPassword" placeholder="旧密码" type="password" v-model="userForm.oldPassword"></el-input>
          <el-button class="change" @click="editPassword">修改</el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :disabled="disEditPassword" placeholder="新密码" type="password" v-model="userForm.password"></el-input>
          <el-button class="change" @click="editPassword">修改</el-button>
        </el-form-item>

        <el-form-item size="small" class="me-login-button">
          <div>
            <el-button  type="primary" @click.native.prevent="changeUserInfo('userForm')">提交</el-button>
            <el-button  type="primary" @click.native.prevent="goback">返回</el-button>
          </div>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script>
import md5 from "md5";
import {change} from '@/api/login'
export default {
  name: "Change",
  computed() {
    this.userForm.account = this.$store.state.account
    this.userForm.nickname = this.$store.state.name
    this.userForm.token = this.$store.state.token
  },
  created() {
    this.userForm.account = this.$store.state.account
    this.userForm.nickname = this.$store.state.name
    this.userForm.token = this.$store.state.token
  },
  data() {
    return {
      ImageData: {
        token: this.$store.state.token
      },
      imageUrl: '',
      disEditPassword: true,
      disEditNickName: true,
      userForm: {
        account: '',
        nickname: '',
        password: '',
        oldPassword: '',
        token: ''
      },
      rules: {
        oldPassword: [
          {message: '请输入密码', trigger: 'blur'},
          {max: 10, message: '不能大于10个字符', trigger: 'blur'}
        ],
        password: [
          {message: '请输入密码', trigger: 'blur'},
          {max: 10, message: '不能大于10个字符', trigger: 'blur'}
        ]
      }
    }
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG格式');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    goback() {
      this.$router.push({path: '/'})
    },

    editPassword() {
      this.disEditPassword = !this.disEditPassword;
    },
    editNickName() {
      this.disEditNickName = !this.disEditNickName;
    },
    changePassword(formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let oldPassword = that.userForm.oldPassword
          let password = that.userForm.password
          that.userForm.oldPassword = md5(oldPassword)
          that.userForm.password = md5(password)

          that.$store.dispatch('change', that.userForm).then(() => {
              that.$message({message: '修改密码成功，请重新登录', type: 'success', showClose: true});
              that.$router.push({path: '/'})
          }).catch((error) => {
            if (error !== 'error') {
              that.$message({message: error, type: 'error', showClose: true});
            }
          })
        } else {
          return false;
        }
      });
    },
    changeUserInfo(formName) {
      let that = this
      let oldNickName = this.$store.state.name
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.userForm.oldPassword === '' && oldNickName === that.userForm.nickname) {
            //没有涉及到修改
            that.$message({message: '未作任何修改', type: 'error', showClose: true});
          } else if (that.userForm.oldPassword !== '') {
            //修改密码 （可包括昵称）
            let oldPassword = that.userForm.oldPassword
            let password = that.userForm.password
            that.userForm.oldPassword = md5(oldPassword)
            that.userForm.password = md5(password)

            that.$store.dispatch('change', that.userForm).then(() => {
              that.$message({message: '修改密码成功，请重新登录', type: 'success', showClose: true});
              that.$router.push({path: '/'})
            }).catch((error) => {
              if (error !== 'error') {
                that.$message({message: error, type: 'error', showClose: true});
              }
            })
          } else if (that.userForm.oldPassword === '' && oldNickName !== that.userForm.nickname) {
            //只修改昵称
            that.$store.dispatch('changeUserInfo', that.userForm).then(() => {
              // that.userForm.nickname = this.$store.state.name
              that.$message({message: '修改成功', type: 'success', showClose: true});
              this.editNickName()
              // that.$router.push({path: '/'})
            }).catch((error) => {
              if (error !== 'error') {
                that.$message({message: error, type: 'error', showClose: true});
              }
            })
          } else {
            return false;
          }
        }
      });
    }
  }

}
</script>

<style scoped>
#login {
  min-width: 100%;
  min-height: 100%;
}

.el-input {
  width: 80%;
}

.change {
  /*padding: 0;*/
  border: 0;
}

.me-video-player {
  background-color: transparent;
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  position: absolute;
  left: 0;
  z-index: 0;
  top: 0;
}

.me-login-box {
  position: absolute;
  width: 400px;
  height: auto;
  background-color: white;
  margin-top: 150px;
  margin-left: -180px;
  left: 50%;
  padding: 30px;
}

.me-login-box-radius {
  border-radius: 10px;
  box-shadow: 0px 0px 1px 1px rgba(161, 159, 159, 0.1);
}

.me-login-box h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  vertical-align: middle;
}

.me-login-design {
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
}

.me-login-design-color {
  color: #5FB878 !important;
}

.me-login-button {
  text-align: justify;
  /*justify-content: space-between;*/
}

.me-login-button button {
  width: 40%;
  margin: 0 4%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/deep/ .el-upload-dragger {
  width: 100%;
}
</style>
