<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">
      <el-form-item label="设备名称" prop="devSn">
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange">
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量设置</el-button>-->
<!--      </el-form-item>-->
    </el-form>
    <el-table
      :data="dataList"
      size="mini"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="50">-->
<!--      </el-table-column>-->
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
        prop="cardTypeName"
        header-align="center"
        align="center"
        label="板卡类型">
      </el-table-column>
      <el-table-column
        prop="slot"
        header-align="center"
        align="center"
        label="板卡序号">
      </el-table-column>
      <el-table-column
        prop="chNum"
        header-align="center"
        align="center"
        label="通道">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="发电平(dB)"
        width="150"
      >
        <template slot-scope="scope">
<!--          <el-form :model="scope.row" :rules="sendValRule"  ref="sendVal">-->
<!--            <el-form-item prop="sendVal">-->
<!--              <el-input v-model="scope.row.sendVal"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
          <el-input v-model="scope.row.sendVal"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="收电平(dB)"
        width="150"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.receiveVal"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="setElectrical(scope.row.id)" v-loading="scope.row.id===flagId?dataListLoading1:''">设置</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  name: 'electrical',
  data () {
    let checkReportTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('上报时间不能为空'))
      }
      if (!this.isNumber(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 5 || value > 120) {
          callback(new Error('上报时间5~120秒'))
        } else {
          callback()
        }
      }
    }
    return {
      snList: [],
      dataList: [],
      flagId: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListLoading1: false,
      dataListSelections: [],
      dataFormSearch: {
        devSn: ''
      },
      sendValRule: {
        sendVal: [
          { validator: checkReportTime, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  activated () {
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
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/settings/getElectricalLevel/${this.dataFormSearch.devSn}`),
        method: 'get',
        params: this.$http.adornParams({
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.dataList = data.list4WEM
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    // 序列号下拉变化时触发
    devSnChange () {
      this.getDataList()
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
    // 批量设置
    deleteHandle () {
      // let ids = this.dataListSelections.map(item => {
      //   return item.alarmId
      // })
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/ch/e1set?sn=${this.dataFormSearch.devSn}`),
        method: 'post',
        data: this.$http.adornData({
          'cardChannelEntities': this.dataListSelections
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    setElectrical (id) {
      this.flagId = id
      let that = this
      let temp = this.dataList.find(item => {
        return item.id === id
      })
      this.dataListLoading1 = true
      this.setElectricalLevel(temp).then(function (data) {
        that.dataListLoading1 = false
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              that.getDataList()
            }
          })
        } else {
          that.$message({
            message: '设置失败',
            type: 'error',
            duration: 1500,
            onClose: () => {
              that.getDataList()
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
    // 设置电平
    setElectricalLevel (obj) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setElectricalLevel`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            ...obj
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
  }
}
</script>
<style lang="scss" scoped>

</style>
