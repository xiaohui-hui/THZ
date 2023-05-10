<template>
  <div>
    <div class="baidumap" id="allmap"></div>
  </div>
</template>

<script>
  let map
  export default {
    name: 'baidu-map',
    components: {
    },
    mounted () {
      this.baiduMap()
    },
    created () {
    },
    data () {
      return {
      }
    },
    methods: {
      baiduMap () {
        map = new window.BMap.Map('allmap') // 创建地图实例
        let point = new window.BMap.Point(116.331398, 39.897445) // 创建点坐标
        map.centerAndZoom(point, 6) // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        // 如下两项推荐设置，否则没有对应级别的瓦片会出现空白
        map.setMinZoom(1)// 最小深度
        map.setMaxZoom(13)// 最大深度
        // 添加控件
        map.addControl(new window.BMap.NavigationControl())
        map.addControl(new window.BMap.OverviewMapControl())
        // map.addControl(new window.BMap.MapTypeControl())
        // map.addControl(new window.BMap.ScaleControl())
        // 单击获取点击的经纬度
        // map.addEventListener('click', function (e) {
        //   alert('经纬度： ' + e.point.lng + ',' + e.point.lat)
        // })

        let marker = new window.BMap.Marker(point) // 创建标注
        map.addOverlay(marker) // 将标注添加到地图中

        // 提示信息
        // let infoWindow = new window.BMap.InfoWindow('这是提示信息')
        // 鼠标移上标注点要发生的事
        // marker.addEventListener('mouseover', function () {
        //   this.openInfoWindow(infoWindow)
        // })

        // 鼠标移开标注点要发生的事
        // marker.addEventListener('mouseout', function () {
        //   this.closeInfoWindow(infoWindow)
        // })
      }
    }
  }
</script>

<style lang="scss">
  .baidumap {
    width:100%;
    height:770px;
    border: 1px solid red;
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*margin: auto;*/
  }
  .baidumap > .BMap_cpyCtrl {
    display: none !important;
  }
  .baidumap > .anchorBL {
    display: none !important;
  }

</style>
