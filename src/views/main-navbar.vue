<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <websocket @receiveData="receiveData"></websocket>
    <audio loop :src="src" ref="audio"></audio>
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">综合接入设备网管</a>
        <a class="site-navbar__brand-mini" href="javascript:;"></a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item index="5" @click="$router.push({ name: 'alarm-list' })" title="告警">
          <el-badge :value="alarmValue" class="item"><icon-svg name="alarm" class="alarm"></icon-svg></el-badge>
        </el-menu-item>
        <el-menu-item index="4" title="告警声音" @click="videoStatus=!videoStatus">
          <icon-svg v-if="videoStatus" name="open"></icon-svg>
          <icon-svg v-else name="close"></icon-svg>
        </el-menu-item>
<!--        <el-menu-item index="2" @click="$router.push({ name: 'alarm-list' })">-->
<!--          <el-badge :value="7" class="item"><icon-svg name="alarm2" class="alarm"></icon-svg></el-badge>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="2" @click="$router.push({ name: 'alarm-list' })">-->
<!--          <el-badge :value="18" class="item"><icon-svg name="alarm3" class="alarm"></icon-svg></el-badge>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item index="1" @click="$router.push({ name: 'theme' })" style="padding: 0" title="布局设置">-->
<!--          <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>-->
<!--        </el-menu-item>-->
        <el-menu-item class="site-navbar__avatar" index="3" style="padding: 0">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <i class="el-icon-user"></i>{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  import websocket from '@/components/websocket'
  export default {
    data () {
      return {
        src: '',
        updatePassowrdVisible: false,
        videoStatus: false
      }
    },
    components: {
      UpdatePassword,
      websocket
    },
    mounted () {
      this.src = window.SITE_CONFIG.cdnUrl + '/static/video/warm.MP3'
      // let that = this
      // this.getAlarm().then(function (data) {
      //   if (data.alarm) {
      //     that.alarmValue = data.alarm.alarmCount
      //   }
      // })
      // setInterval(() => {
      //   this.getAlarm().then(function (data) {
      //     if (data.alarm) {
      //       that.alarmValue = data.alarm.alarmCount

      //     }
      //   })
      // }, 5000)
    },
    computed: {
      alarmValue: {
        get () { return this.$store.state.common.websocateAlarmValue }
      },
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
      // 获取点名测试数据
      getAlarm () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/alarm/alarm/countByAlarmLevel'),
            method: 'get',
            params: this.$http.adornParams({
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              reject(data)
            }
          })
        })
      },
      receiveData (alarmValue) {
        this.$store.commit('common/updateAlarmValue', alarmValue)
      }
    },
    watch: {
      videoStatus (val) {
        if (val) {
          if (this.alarmValue > 0) {
            this.$refs.audio.play()
          } else {
            this.videoStatus = false
          }
        } else {
          this.$refs.audio.pause()
        }
      }
    }
  }
</script>
<style scoped>
  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: none;
    color: #303133;
  }
  .alarm {
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
</style>
