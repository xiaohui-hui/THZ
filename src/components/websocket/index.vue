<template>
  <div>
<!--    测试websocket<br />-->
<!--    {{ recevieData }}-->
<!--    <input type="button" value="打开socket" @click="initWebSocket" />-->
<!--    <input type="button" value="关闭socket" @click="closewebsocket" />-->
    <!-- <input type="button" value="发送数据给java" @click="sendwebsocket" /> -->
  </div>
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
    closewebsocket () {
      this.websock.close()
    },
    initWebSocket () {
      // 初始化weosocket
      const wsuri = 'ws://192.168.10.222:8010/ws'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      // 连接建立之后执行send方法发送数据
      this.websocketsend('connectSuccess')
    },
    websocketonerror () {
      // 连接建立失败重连
      // this.initWebSocket();
      // handleErrors(e)
    },
    websocketonmessage (e) {
      // 数据接收
      console.log('数据接收')
      console.log(e.data)
      this.recevieData = e.data
      this.websocketsend('OK')
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
      // this.websocketonerror();
    }
  }
}
</script>

