<template>
  <div>
    <el-dialog
      class="infoDialog"
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="电话号码" prop="phoneNum">
          <el-input v-model="dataForm.phoneNum" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item label="电话位置" prop="locate">
          <el-input v-model="dataForm.locate" placeholder="电话位置"></el-input>
        </el-form-item>
        <el-form-item label="使用人" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="使用人"></el-input>
        </el-form-item>
<!--        <el-form-item label="设备名称" prop="devName">-->
<!--          <el-input v-model="dataForm.devName" placeholder="设备名称"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="设备序列号" prop="devSn">-->
<!--          <el-input v-model="dataForm.devSn" placeholder="设备序列号"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="设备名称" prop="devSn">
          <el-select v-model="dataForm.devSn" placeholder="设备名称" filterable>
            <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="板卡序号" prop="cardId">
          <el-input v-model="dataForm.cardId" placeholder="板卡序号"></el-input>
        </el-form-item>
        <el-form-item label="端口序号" prop="portId">
          <el-input v-model="dataForm.portId" placeholder="端口序号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          phoneNum: '',
          locate: '',
          userName: '',
          devName: '',
          devSn: '',
          devicePort: '',
          cardId: '',
          portId: ''
        },
        dataRule: {
          deviceSerialNumber: [
            { required: true, message: '站点名称不能为空', trigger: 'blur' }
          ],
          deviceNumber: [
            { required: true, message: '所属路局不能为空', trigger: 'blur' }
          ],
          deviceType: [
            { required: true, message: '所属线路不能为空', trigger: 'blur' }
          ],
          deviceName: [
            { required: true, message: '车站类型不能为空', trigger: 'blur' }
          ],
          deviceIp: [
            { required: true, message: '经度不能为空', trigger: 'blur' }
          ],
          devicePort: [
            { required: true, message: '纬度不能为空', trigger: 'blur' }
          ],
          deviceGateway: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ]
        },
        snList: []
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id
        this.visible = true
        let that = this
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          // 获取信息
          if (id) {
            this.getEachNumberDetails(id).then(function (data) {
              that.dataForm.phoneNum = data.info.phoneNum
              that.dataForm.locate = data.info.locate
              that.dataForm.userName = data.info.username
              that.dataForm.devSn = data.info.devSn
              that.dataForm.cardId = data.info.cardId
              that.dataForm.portId = data.info.portId
            })
          }
          // 获取设备sn
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
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/pns/${!this.dataForm.id ? 'add' : 'modify'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'phoneNum': this.dataForm.phoneNum,
                'locate': this.dataForm.locate,
                'username': this.dataForm.userName,
                'devSn': this.dataForm.devSn,
                'cardId': this.dataForm.cardId,
                'portId': this.dataForm.portId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取单个号码详情信息
      getEachNumberDetails (id) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/pns/info'),
            method: 'get',
            params: this.$http.adornParams({
              'id': id
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
      }
    }
  }
</script>
<style lang="scss">
  .infoDialog {
    .el-dialog {
      width: 35%;
    }
  }

</style>

