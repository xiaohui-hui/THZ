<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>恢复出厂</span>
      </div>
      <div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" v-loading="dataListLoading" element-loading-text="恢复中..." element-loading-spinner="el-icon-loading">
          <el-form-item label="设备名称">
            <el-select v-model="dataForm.deviceSerialNumber" placeholder="设备名称" @change="devSnChange" filterable>
              <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备序列号">
            <el-input v-model="dataForm.deviceName" placeholder="设备序列号" readonly></el-input>
          </el-form-item>
          <el-form-item label="恢复选项">
            <el-radio-group v-model="dataForm.restore">
              <el-radio label="1">恢复时隙出厂设置</el-radio>
              <el-radio label="2">恢复电平</el-radio>
              <el-radio label="3">恢复全部出厂设置</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataFormSubmit()" :disabled="dataForm.deviceSerialNumber===''||dataForm.restore===''">恢复</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'restore',
  data () {
    return {
      snList: [],
      dataListLoading: false,
      dataForm: {
        deviceSerialNumber: '',
        deviceName: '',
        restore: ''
      },
      dataRule: {
        deviceSerialNumber: [
          { required: true, message: '站点名称不能为空', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '车站类型不能为空', trigger: 'blur' }
        ]
      }
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
    uploadFile (fileObj) {

    },
    dataFormSubmit () {
      this.dataListLoading = true
      if (this.dataForm.restore === '1') {
        this.restoreTS().then((data) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          this.$message({
            message: err.msg,
            type: 'error'
          })
          this.dataListLoading = false
        })
      } else if (this.dataForm.restore === '2') {
        this.restoreEL().then((data) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          this.$message({
            message: err.msg,
            type: 'error'
          })
          this.dataListLoading = false
        })
      } else if (this.dataForm.restore === '3') {
        this.restoreAll().then((data) => {
          this.dataListLoading = false
          if (data && data.code === 0) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          this.$message({
            message: err.msg,
            type: 'error'
          })
          this.dataListLoading = false
        })
      }
    },
    // 序列号下拉变化时触发
    devSnChange (devSn) {
      this.dataForm.deviceName = devSn
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
    // 恢复电平
    restoreEL () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/reset/el`),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataForm.deviceSerialNumber
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
    // 恢复时隙
    restoreTS () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/reset/ts`),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataForm.deviceSerialNumber
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
    // 恢复所有
    restoreAll () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/reset/factroy`),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataForm.deviceSerialNumber
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

<style scoped>





</style>
