<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      websock: null,
      recevieData: ''
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket () {
      // 初始化weosocket
      const wsuri = `ws://${window.SITE_CONFIG.websocketUrl}/pcm/websocket/${this.$cookie.get('token')}`
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      // 连接建立之后执行send方法发送数据
      // this.websocketsend('connectSuccess')
    },
    websocketonerror () {
      // 连接建立失败重连
      // this.initWebSocket();
      // handleErrors(e)
    },
    websocketonmessage (e) {
      // 数据接收
      // console.log('数据接收')
      let data = JSON.parse(e.data).alarm.alarmCount
      this.$emit('receiveData', data)
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      // console.log('断开连接', e)
      // this.websocketonerror();
    }
  }
}
</script>

