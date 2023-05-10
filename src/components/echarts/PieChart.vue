<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import * as echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      chartData: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler (val) {
          this.setOptions(val)
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart () {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions (pieChartData) {
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10'
          },
          series: [
            {
              name: '室内前站',
              type: 'pie',
              // label: {
              //   normal: {
              //     show: false,
              //     position: 'center'
              //   },
              // },
              // labelLine: {
              //   show: false
              // },
              // roseType: 'radius',
              radius: [15, 95],
              center: ['45%', '50%'],
              data: pieChartData,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  }
</script>
