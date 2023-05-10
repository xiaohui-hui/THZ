<template>
<div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>设备升级</span>
    </div>
    <div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="设备序列号" prop="deviceSerialNumber">
          <el-input v-model="dataForm.deviceSerialNumber" placeholder="序列号"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
        </el-form-item>
        <el-form-item label="升级文件">
          <el-upload
            class="upload-demo"
            action
            ref="upload"
            :http-request="uploadFile"
            :show-file-list="false">
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="dataForm.version" placeholder="版本"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataFormSubmit()">升级</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'update',
  data () {
    return {
      dataForm: {
        deviceSerialNumber: '',
        deviceName: '',
        version: ''
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
