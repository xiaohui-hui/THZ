<template>
  <div>
    <el-form :inline="true" :model="dataFormSearch" class="searchForm">
      <el-form-item label="设备名称" prop="devSn">
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" filterable>
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content" v-loading="dataListLoading1" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <h3>校时</h3>
            <el-form :model="timing" :rules="timingRule" label-width="100px">
              <el-form-item label="网元时间" prop="networkElementTime">
                <el-date-picker
                  v-model="timing.networkElementTime"
                  type="datetime"
                  readonly
                  placeholder="网元时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="系统时间" prop="systemTime">
                <el-date-picker
                  v-model="timing.systemTime"
                  type="datetime"
                  readonly
                  placeholder="系统时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="调整时间" prop="adjustTime">
                <el-date-picker
                  v-model="timing.adjustTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="调整时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-button type="primary" class="save1" @click="getTimingHandle()" :disabled="dataFormSearch.devSn===''">采集</el-button>
            <el-button type="primary" class="save2" @click="timingHandle()" :disabled="dataFormSearch.devSn===''||timing.adjustTime===''">设置</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" v-loading="dataListLoading2" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <h3>上报时间</h3>
            <el-form :model="reportTime" :rules="reportTimeRule" label-width="100px" ref="reportTime">
              <el-form-item label="上报时间" prop="reportTime">
                <el-input v-model="reportTime.reportTime" placeholder="上报时间">
                  <span slot="append">5~120s</span>
                </el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" class="save1" @click="getReportTimeHandle" :disabled="dataFormSearch.devSn===''">采集</el-button>
            <el-button type="primary" class="save2" @click="reportTimeHandle()" :disabled="dataFormSearch.devSn===''||reportTime.reportTime===''">设置</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" v-loading="dataListLoading3" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <h3>话路阻抗</h3>
            <el-form :model="impedance" :rules="impedanceRule" label-width="100px">
              <el-form-item label="FXO" prop="fxo">
                <el-select v-model="impedance.fxo" placeholder="FXO" clearable filterable>
                  <el-option label="600" value="0"></el-option>
                  <el-option label="900" value="1"></el-option>
                  <el-option label="270+(750||150nF) and 275+(780||150nF)" value="2"></el-option>
                  <el-option label="220+(820||120nF) and 220+(820||115nF)" value="3"></el-option>
                  <el-option label="370+(620||310nF)" value="4"></el-option>
                  <el-option label="320+(1050||230nF)" value="5"></el-option>
                  <el-option label="370+(820||110nF)" value="6"></el-option>
                  <el-option label="275+(780||115nF)" value="7"></el-option>
                  <el-option label="120+(820||110nF)" value="8"></el-option>
                  <el-option label="350+(1000||210nF)" value="9"></el-option>
                  <el-option label="200+(680||100nF)" value="10"></el-option>
                  <el-option label="600+2.16μF" value="11"></el-option>
                  <el-option label="900+1μF" value="12"></el-option>
                  <el-option label="900+2.16μF" value="13"></el-option>
                  <el-option label="600+1μF" value="14"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="FXS" prop="fxs">
                <el-select v-model="impedance.fxs" placeholder="FXS" clearable filterable>
                  <el-option label="600" value="0"></el-option>
                  <el-option label="270+(750||150nF)" value="1"></el-option>
                  <el-option label="370+(620||310nF)" value="2"></el-option>
                  <el-option label="220+(820||120nF)" value="3"></el-option>
                  <el-option label="600+1μF" value="4"></el-option>
                  <el-option label="200+(680||100nF)" value="5"></el-option>
                  <el-option label="220+(820||115nF)" value="6"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-button type="primary" class="save1" @click="getImpedanceHandle()" :disabled="dataFormSearch.devSn===''">采集</el-button>
            <el-button type="primary" class="save2" @click="impedanceHandle()" :disabled="dataFormSearch.devSn===''||(impedance.fxo===''&&impedance.fxs==='')">设置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content" v-loading="dataListLoading4" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <h3>信令设置</h3>
            <el-form :model="sign" :rules="signRule" label-width="100px">
              <el-form-item label="B信令" prop="networkElementTime">
                <el-radio-group v-model="sign.sign">
                  <el-radio label="0">正常传输</el-radio>
                  <el-radio label="1">强制0</el-radio>
                  <el-radio label="2">强制1</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <el-button type="primary" class="save1" @click="getSignHandle()" :disabled="dataFormSearch.devSn===''">采集</el-button>
            <el-button type="primary" class="save2" @click="signHandle()" :disabled="dataFormSearch.devSn===''">设置</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" v-loading="dataListLoading5" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <h3>电源告警屏蔽</h3>
            <el-form :model="battery" :rules="batteryRule" label-width="100px">
              <el-form-item label="电源1" prop="battery1">
                <el-checkbox-group v-model="battery.battery1">
                  <el-checkbox label="0">12V</el-checkbox>
                  <el-checkbox label="1">48V Input</el-checkbox>
                  <el-checkbox label="2">220V Input</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="电源2" prop="battery2">
                <el-checkbox-group v-model="battery.battery2">
                  <el-checkbox label="0">12V</el-checkbox>
                  <el-checkbox label="1">48V Input</el-checkbox>
                  <el-checkbox label="2">220V Input</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <el-button type="primary" class="save1" @click="getBatteryHandle()" :disabled="dataFormSearch.devSn===''">采集</el-button>
            <el-button type="primary" class="save2" @click="batteryHandle()" :disabled="dataFormSearch.devSn===''||(battery.battery1.length<=0&&battery.battery2.length<=0)">设置</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" v-loading="dataListLoading6" element-loading-text="加载中..." element-loading-spinner="el-icon-loading">
            <h3>OHT</h3>
            <el-form :model="oht">
              <el-form-item prop="oht">
                <el-radio-group v-model="oht.oht">
                  <el-radio :label="true">Enable</el-radio>
                  <el-radio :label="false">Disable</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <el-button type="primary" class="save1" @click="getOhtHandle()" :disabled="dataFormSearch.devSn===''">采集</el-button>
            <el-button type="primary" class="save2" @click="ohtHandle()" :disabled="dataFormSearch.devSn===''||oht.oht===''">设置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'other',
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
      dataFormSearch: {
        devSn: ''
      },
      snList: [],
      timing: {
        networkElementTime: '',
        systemTime: '',
        adjustTime: ''
      },
      timingRule: {

      },
      reportTime: {
        reportTime: ''
      },
      reportTimeRule: {
        reportTime: [
          { validator: checkReportTime, trigger: 'blur' }
        ]
      },
      impedance: {
        fxo: '',
        fxs: ''
      },
      impedanceRule: {

      },
      sign: {
        sign: '0'
      },
      signRule: {

      },
      battery: {
        battery1: [],
        battery2: []
      },
      batteryRule: {

      },
      oht: {
        oht: ''
      },
      dataListLoading1: false,
      dataListLoading2: false,
      dataListLoading3: false,
      dataListLoading4: false,
      dataListLoading5: false,
      dataListLoading6: false
    }
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
    getTimingHandle () {
      this.dataListLoading1 = true
      let that = this
      this.getTimeData().then(function (data) {
        that.dataListLoading1 = false
        that.timing.networkElementTime = data.info.devTime
        that.timing.systemTime = data.info.serverTime
      })
    },
    timingHandle () {
      this.dataListLoading1 = true
      let that = this
      this.setTimeData().then(function (data) {
        that.dataListLoading1 = false
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading1 = false
      })
    },
    getReportTimeHandle () {
      this.dataListLoading2 = true
      let that = this
      this.getUpTimeData().then(function (data) {
        that.dataListLoading2 = false
        that.reportTime.reportTime = data.info.upTime
      })
    },
    reportTimeHandle () {
      this.$refs['reportTime'].validate((valid) => {
        if (valid) {
          this.dataListLoading2 = true
          let that = this
          this.setUpTimeData().then(function (data) {
            that.dataListLoading2 = false
            if (data && data.code === 0) {
              that.$message({
                message: '设置成功',
                type: 'success'
              })
            } else {
              that.$message({
                message: data.msg,
                type: 'error'
              })
            }
          }).catch(function (err) {
            that.$message({
              message: err.msg,
              type: 'error'
            })
            that.dataListLoading2 = false
          })
        } else {
          this.$message({
            message: '上报时间为5~120秒',
            type: 'error'
          })
        }
      })
    },
    getImpedanceHandle () {
      this.dataListLoading3 = true
      let that = this
      this.getImpedanceData().then(function (data) {
        that.dataListLoading3 = false
        console.log(data)
        that.impedance.fxo = data.info.fxo
        that.impedance.fxs = data.info.fxs
      })
    },
    impedanceHandle () {
      this.dataListLoading3 = true
      let that = this
      this.setImpedanceData().then(function (data) {
        that.dataListLoading3 = false
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading3 = false
      })
    },
    getSignHandle () {
      this.dataListLoading4 = true
      let that = this
      this.getSignalling().then(function (data) {
        that.dataListLoading4 = false
        that.sign.sign = data.info.signalling
      })
    },
    signHandle () {
      this.dataListLoading4 = true
      let that = this
      this.setSignalling().then(function (data) {
        that.dataListLoading4 = false
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading4 = false
      })
    },
    getBatteryHandle () {
      this.battery1 = []
      this.battery2 = []
      this.dataListLoading5 = true
      let that = this
      this.getPowerAlarmShield().then(function (data) {
        that.dataListLoading5 = false
        let battery1Data = [data.info.pwrA12V, data.info.pwrA48VInput, data.info.pwrA220VInput]
        let battery2Data = [data.info.pwrB12V, data.info.pwrB48VInput, data.info.pwrB220VInput]
        for (let i = 0; i <= 2; i++) {
          if (battery1Data[i] === '1') {
            that.battery.battery1.push('' + i)
          }
          if (battery2Data[i] === '1') {
            that.battery.battery2.push('' + i)
          }
        }
      })
    },
    batteryHandle () {
      this.dataListLoading5 = true
      let that = this
      this.setPowerAlarmShield().then(function (data) {
        that.dataListLoading5 = false
        console.log(data)
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading5 = false
      })
    },
    getOhtHandle () {
      this.dataListLoading6 = true
      let that = this
      this.getOhtData().then(function (data) {
        that.dataListLoading6 = false
        console.log(data)
        that.oht.oht = data.info.oht
      })
    },
    ohtHandle () {
      this.dataListLoading6 = true
      let that = this
      this.setOhtData().then(function (data) {
        that.dataListLoading6 = false
        console.log(data)
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading6 = false
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
    // 获取校时
    getTimeData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getTiming/${this.dataFormSearch.devSn}`),
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
    // 设置校时
    setTimeData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setTiming`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'setTime': this.timing.adjustTime
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
    // 获取上报时间
    getUpTimeData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getUpTime/${this.dataFormSearch.devSn}`),
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
    // 设置上报时间
    setUpTimeData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setUpTime`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'upTime': this.reportTime.reportTime
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
    // 获取阻抗
    getImpedanceData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getImpedance/${this.dataFormSearch.devSn}`),
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
    // 设置阻抗
    setImpedanceData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setImpedance`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'fxo': this.impedance.fxo,
            'fxs': this.impedance.fxs
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
    // 获取Oht
    getOhtData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getOht/${this.dataFormSearch.devSn}`),
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
    // 设置Oht
    setOhtData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setOht`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'oht': this.oht.oht
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
    // 获取电源屏蔽
    getPowerAlarmShield () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getPowerAlarmShield/${this.dataFormSearch.devSn}`),
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
    // 设置电源屏蔽
    setPowerAlarmShield () {
      let pwrA12V = '0'
      let pwrA48VInput = '0'
      let pwrA220VInput = '0'
      let pwrB12V = '0'
      let pwrB48VInput = '0'
      let pwrB220VInput = '0'
      if (this.battery.battery1.includes('0')) {
        pwrA12V = '1'
      }
      if (this.battery.battery1.includes('1')) {
        pwrA48VInput = '1'
      }
      if (this.battery.battery1.includes('2')) {
        pwrA220VInput = '1'
      }
      if (this.battery.battery2.includes('0')) {
        pwrB12V = '1'
      }
      if (this.battery.battery2.includes('1')) {
        pwrB48VInput = '1'
      }
      if (this.battery.battery2.includes('2')) {
        pwrB220VInput = '1'
      }
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setPowerAlarmShield`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'pwrA12V': pwrA12V,
            'pwrA48VInput': pwrA48VInput,
            'pwrA220VInput': pwrA220VInput,
            'pwrB12V': pwrB12V,
            'pwrB48VInput': pwrB48VInput,
            'pwrB220VInput': pwrB220VInput
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
    // 获取信令
    getSignalling () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/getSignalling/${this.dataFormSearch.devSn}`),
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
    // 设置信令
    setSignalling () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/settings/setSignalling`),
          method: 'post',
          data: this.$http.adornData({
            'sn': this.dataFormSearch.devSn,
            'signalling': this.sign.sign
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
    isNumber (val) {
      let regPos = /^[0-9]+.?[0-9]*/ // 判断是否是数字
      if (regPos.test(val)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    height: 300px;
    border: 1px solid #ccc;
    text-align: center;
    position: relative;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-form-item {
    margin-right: 30px;
  }
  .save1 {
    position: absolute;
    bottom: 20px;
    left: 170px;
  }
  .save2 {
    position: absolute;
    bottom: 20px;
    left: 260px;
  }

</style>
