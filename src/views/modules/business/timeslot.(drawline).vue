<template>
  <div class="content" id="plumbContent">
    <div class="left">
      <ul class="bottom" id="leftBottom">
        <li
          v-for="n in 32"
          :key="n"
          :id="'source'+(n-1)"
          name="source"
        >
          {{ n-1 }}
        </li>
      </ul>
    </div>
    <div class="right">
      <ul class="bottom" id="rightBottom">
        <li
          v-for="n in 32"
          :key="n"
          :id="'target'+(n-1)"
          name="target"
        >
          {{ n-1 }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'timeslot',
  data () {
    return {
      leftData: [
        {
          id: 1,
          label: '项目1'
        },
        {
          id: 2,
          label: '项目2'
        },
        {
          id: 3,
          label: '项目3'
        },
        {
          id: 4,
          label: '项目4'
        },
        {
          id: 5,
          label: '项目5'
        },
        {
          id: 6,
          label: '项目6'
        }
      ],
      rightData: [
        {
          id: 1,
          name: '张三'
        },
        {
          id: 2,
          name: '李四'
        },
        {
          id: 3,
          name: '王五'
        }
      ],
      plumbins: null, // 缓存实例化的jsplumb对象
      connection: [],
      connectionList: [] // 手动维护一个关系
    }
  },
  methods: {
    init () {
      let config1 = {
        isSource: true,
        endpoint: ['Dot', {
          radius: 8
        }], // 端点的形状
        endpointStyle: { fill: '#ffffff', outlineStroke: 'darkgray', outlineWidth: 2 }, // 端点默认样式
        endpointHoverStyle: { fill: '#fff', outlineStroke: '#555', outlineWidth: 3 },

        connector: ['Straight'], // 连线类型
        connectorStyle: {
          strokeWidth: 2,
          stroke: '#61B7CF',
          joinstyle: 'round',
          outlineStroke: '#eee',
          outlineWidth: 2
        },
        connectorHoverStyle: {
          strokeWidth: 3,
          stroke: '#216477',
          outlineWidth: 5,
          outlineStroke: '#eee'
        }
        // connectorOverlays: [
        //     ['Arrow', { width: 10, length: 10, location: 1 }]
        // ],
        // maxConnections: 1, // 设置连接点最多可以连接几条线
      }
      let config2 = {
        isTarget: true,
        endpoint: ['Dot', {
          radius: 8
        }], // 端点的形状
        endpointStyle: { fill: '#ffffff', outlineStroke: 'darkgray', outlineWidth: 2 }, // 端点默认样式
        endpointHoverStyle: { fill: '#fff', outlineStroke: '#555', outlineWidth: 3 },

        connector: ['Straight'], // 连线类型
        connectorStyle: {
          strokeWidth: 2,
          stroke: '#61B7CF',
          joinstyle: 'round',
          outlineStroke: '#eee',
          outlineWidth: 2
        },
        connectorHoverStyle: {
          strokeWidth: 3,
          stroke: '#216477',
          outlineWidth: 5,
          outlineStroke: '#eee'
        }
        // connectorOverlays: [
        //     ['Arrow', { width: 10, length: 10, location: 1 }]
        // ],
        // maxConnections: 1, // 设置连接点最多可以连接几条线
      }
      //   初始化实例
      this.$jsPlumb.ready(() => {
        this.plumbins = this.$jsPlumb.getInstance({
          // Container: 'plumbContent', // 选择器id
          Connector: ['Straight'] // 直线连接
        })
        for (let i = 0; i <= 31; i++) {
          this.plumbins.addEndpoint('source' + i, {
            anchors: ['Center'],
            uuid: 'source' + i
          }, config1)
          this.plumbins.addEndpoint('target' + i, {
            anchors: ['Center'],
            uuid: 'target' + i
          }, config2)
        }
        // 双击删除连线
        this.plumbins.bind('dblclick', (connection, originalEvent) => {
          this.plumbins.deleteConnection(connection)
        })
        this.plumbins.bind('connection', (conn, originEvent) => {

        })
      })
    },
    repaintPlumb () {
      this.plumbins.repaintEverything()
    },
    // 保存连线关系
    getConnetion () {
      this.connection = this.plumbins.getConnections()
    }
  },
  mounted () {
    this.init()
    // 每次页面大小改变重新绘画连线
    window.addEventListener('resize', this.repaintPlumb)
  }
}
</script>
<style lang="scss" scoped>
#rightBottom {
  width: 100%;
  height: 20px;
  text-align: left;
  padding-left: 150px;
  li {
    display: inline-block;
    width: 20px;
    background-color: #00FFFF;
    margin-right: 5px;
    cursor: pointer;
    text-align: center;
  }
}
#leftBottom {
  text-align: center;
  li {
    width: 20px;
    background-color: #00FFFF;
    margin-bottom: 4px;
    cursor: pointer;
  }
}
.content {
  background-color: #C0C0C0;
  // width: 60%
}

</style>

