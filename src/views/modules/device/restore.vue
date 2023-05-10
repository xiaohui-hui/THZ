<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>恢复出厂</span>
      </div>
      <div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <el-form-item label="设备序列号" prop="deviceSerialNumber">
            <el-input v-model="dataForm.deviceSerialNumber" placeholder="序列号"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
          </el-form-item>
          <el-form-item label="恢复选项">
            <el-radio-group v-model="dataForm.restore">
              <el-radio label="恢复时隙出厂设置"></el-radio>
              <el-radio label="恢复电平"></el-radio>
              <el-radio label="恢复全部出厂设置"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataFormSubmit()">恢复</el-button>
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
  methods: {
    uploadFile (fileObj) {

    },
    dataFormSubmit () {

    }
  }
}
</script>

<style scoped>





</style>
