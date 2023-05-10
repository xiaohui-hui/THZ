<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" class="searchForm" v-loading="dataListLoading1" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
      <el-form-item label="设备名称" prop="devSn">
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange">
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前时钟" prop="clock">
        <el-input v-model="dataFormSearch.nowClock" placeholder="当前时钟" readonly></el-input>
      </el-form-item>
      <el-form-item label="设置优先级" prop="clock">
        <el-input v-model="dataFormSearch.priority" placeholder="设置优先级" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-divider class="dividerClock"></el-divider>
    <el-form :inline="true" :model="dataFormSet" class="searchForm" v-loading="dataListLoading2" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
      <el-form-item label="时钟源选择">
        <el-select v-model="dataFormSet.clock" placeholder="时钟" @change="clockChange" :disabled="dataFormSearch.devSn===''" clearable>
          <el-option label="本地时钟" value="240"></el-option>
          <el-option label="外部时钟" value="241"></el-option>
          <el-option label="从时钟" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setHandle()" :disabled="flagSet">设置</el-button>
      </el-form-item>
    </el-form>
    <div v-if="clockE1Flag">
      <p>从时钟列表：</p>
      <el-table
        class="clockList"
        id="sign"
        :data="dataList"
        border
        size="mini"
        :max-height="600"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%;">
<!--        <el-table-column-->
<!--          type="selection"-->
<!--          header-align="center"-->
<!--          align="center"-->
<!--          width="50">-->
<!--        </el-table-column>-->
        <el-table-column
          type="index"
          header-align="center"
          align="center"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          v-if="false"
          prop="id"
          header-align="center"
          align="center"
          label="主键ID">
        </el-table-column>
        <el-table-column
          prop="e1Name"
          header-align="center"
          align="center"
          label="时钟源">
        </el-table-column>
        <!--      <el-table-column-->
        <!--        fixed="right"-->
        <!--        header-align="center"-->
        <!--        align="center"-->
        <!--        label="操作"-->
        <!--        width="250">-->
        <!--        <template slot-scope="scope">-->
        <!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.deviceId)">修改</el-button>-->
        <!--          <el-button type="text" size="small" @click="empower(scope.row.sdeviceId)">授权</el-button>-->
        <!--          <el-button type="text" size="small" @click="deleteHandle(scope.row.deviceId)">删除</el-button>-->
        <!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.deviceId)">点名测试</el-button>-->
        <!--          <el-button type="text" size="small" @click="detailsHandle(scope.row.deviceId)">详情</el-button>-->
        <!--        </template>-->
        <!--      </el-table-column>-->
      </el-table>
    </div>
<!--    <el-pagination-->
<!--      @size-change="sizeChangeHandle"-->
<!--      @current-change="currentChangeHandle"-->
<!--      :current-page="pageIndex"-->
<!--      :page-sizes="[10, 20, 50, 100]"-->
<!--      :page-size="pageSize"-->
<!--      :total="totalPage"-->
<!--      layout="total, sizes, prev, pager, next, jumper">-->
<!--    </el-pagination>-->
  </div>
</template>

<script>
export default {
  name: 'clock',
  data () {
    return {
      snList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListLoading1: false,
      dataListLoading2: false,
      dataListSelections: [],
      dataFormSearch: {
        devSn: '',
        nowClock: '',
        priority: ''
      },
      dataFormSet: {
        clock: ''
      },
      clockE1Flag: false,
      eachSelect: {}
    }
  },
  components: {
  },
  activated () {
    this.getDataList()
    // 获取设备sn
    let that = this
    this.getDeviceDropdownList().then(function (data) {
      let obj = data.dp
      let tempData = Object.keys(obj)
      that.snList = tempData.map(function (item) {
        return {
          sn: item,
          name: obj[item]
        }
      })
    })
  },
  methods: {
    // 获取数据列表
    getDataList () {
      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('/resources/station/conditionList'),
      //   method: 'get',
      //   params: this.$http.adornParams({
      //     'page': this.pageIndex,
      //     'limit': this.pageSize,
      //     'stationName': this.dataFormSearch.stationNameSearch,
      //     'areaname': this.dataFormSearch.areaIdSearch,
      //     'stationType': this.dataFormSearch.stationTypeSearch
      //   })
      // }).then(({data}) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.page.list
      //     this.totalPage = data.page.totalCount
      //   } else {
      //     this.dataList = []
      //     this.totalPage = 0
      //   }
      //   this.dataListLoading = false
      // })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    handleCurrentChange (val) {
      console.log(val)
      this.eachSelect = val
    },
    // 批量设置
    deleteHandle () {
      console.log(this.dataListSelections)
      // this.$http({
      //   url: this.$http.adornUrl('/resources/station/delete'),
      //   method: 'post',
      //   data: this.$http.adornData(ids, false)
      // }).then(({data}) => {
      //   if (data && data.code === 0) {
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success',
      //       duration: 1500,
      //       onClose: () => {
      //         this.getDataList()
      //       }
      //     })
      //   } else {
      //     this.$message.error(data.msg)
      //   }
      // })
    },
    // 序列号下拉变化时触发
    devSnChange (data) {
      this.dataFormSearch.nowClock = ''
      this.dataFormSearch.priority = ''
      this.clockE1Flag = false
      this.dataList = []
      this.dataListLoading1 = true
      let that = this
      this.getClock().then(function (data) {
        console.log(data)
        that.dataListLoading1 = false
        let clocks = data.info.clocks
        if (clocks.length > 0) {
          let lastTmp = clocks[clocks.length - 1]
          let firstTemp = clocks[0]
          if (lastTmp === '240') {
            that.dataFormSearch.nowClock = '本地时钟'
          } else if (lastTmp === '241') {
            that.dataFormSearch.nowClock = '外部时钟'
          } else {
            that.dataFormSearch.nowClock = 'E1-' + (parseInt(lastTmp) + 1)
          }
          if (firstTemp === '240') {
            that.dataFormSearch.priority = '本地时钟'
          } else if (firstTemp === '241') {
            that.dataFormSearch.priority = '外部时钟'
          } else if (firstTemp === '255') {
          } else {
            that.dataFormSearch.priority = 'E1-' + (parseInt(firstTemp) + 1)
          }
        }
      })
    },
    // 时钟变化
    clockChange (data) {
      let that = this
      if (data === '1') { // 从时钟
        this.clockE1Flag = true
        this.getClockE1().then(function (data) {
          console.log(data)
          that.dataList = data.clockE1List || []
        })
      } else {
        this.clockE1Flag = false
        this.dataList = []
      }
    },
    // 时钟设置
    setHandle () {
      let that = this
      this.dataListLoading2 = true
      let tempArr = ['255', '255', '255', '255']
      if (this.dataFormSet.clock === '1') {
        if (Object.keys(this.eachSelect).length > 0) {
          console.log(this.eachSelect.id)
          tempArr.unshift(this.eachSelect.id)
        } else {
          tempArr.unshift('255')
        }
      } else {
        tempArr.unshift(this.dataFormSet.clock)
      }
      console.log(tempArr)
      this.setClock(tempArr).then(function (data) {
        that.dataListLoading2 = false
        console.log(data)
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              that.dataListLoading1 = true
              that.getClock().then(function (data) {
                that.dataListLoading1 = false
                let clocks = data.info.clocks
                if (clocks.length > 0) {
                  let lastTmp = clocks[clocks.length - 1]
                  let firstTemp = clocks[0]
                  if (lastTmp === '240') {
                    that.dataFormSearch.nowClock = '本地时钟'
                  } else if (lastTmp === '241') {
                    that.dataFormSearch.nowClock = '外部时钟'
                  } else {
                    that.dataFormSearch.nowClock = 'E1-' + (parseInt(lastTmp) + 1)
                  }
                  if (firstTemp === '240') {
                    that.dataFormSearch.priority = '本地时钟'
                  } else if (firstTemp === '241') {
                    that.dataFormSearch.priority = '外部时钟'
                  } else if (firstTemp === '255') {
                  } else {
                    that.dataFormSearch.priority = 'E1-' + (parseInt(firstTemp) + 1)
                  }
                }
              })
            }
          })
        }
      })
    },
    // 获取设备下拉列表信息(设备sn)
    getDeviceDropdownList () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/dp'),
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
    // 获取时钟设置
    getClock () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getClock/${this.dataFormSearch.devSn}`),
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
    // 获取从时钟
    getClockE1 () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getClockE1/${this.dataFormSearch.devSn}`),
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
    // 设置时钟
    setClock (clocks) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setClock`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'clocks': clocks
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    }
  },
  computed: {
    flagSet () {
      if (this.dataFormSet.clock === '1') {
        return this.dataFormSearch.devSn === '' || this.dataFormSet.clock === '' || Object.keys(this.eachSelect).length <= 0
      } else {
        return this.dataFormSearch.devSn === '' || this.dataFormSet.clock === ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .clockList {
   width: 30% !important;
 }
 .site-wrapper .el-pagination {
   margin-top: 15px;
   margin-left: 86px;
   text-align: left;
 }

</style>
<style>
#sign .el-table__header-wrapper .el-checkbox {
  display: none;
}
.dividerClock.el-divider--horizontal {
  margin: 0 0 20px 0;
}
</style>
