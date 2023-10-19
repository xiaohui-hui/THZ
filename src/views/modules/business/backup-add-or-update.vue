<template>
  <div>
    <el-dialog
      class="infoDialog"
      :title="!dataForm.stationId ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="主用所在板卡" prop="mainCard">
          <el-select v-model="dataForm.mainCard" placeholder="主用所在板卡" @change="mainCardChange" filterable>
            <el-option :label="item.cardId" :value="item.cardId" :key="item.cardId" v-for="item in mainCardData"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主用板卡通道" prop="mainThoroughfare">
          <el-select v-model="dataForm.mainThoroughfare" placeholder="主用板卡通道" filterable>
            <el-option :label="item" :value="item" :key="item" v-for="item in mainThoroughfareList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备用1所在板卡" prop="backup1Card">
          <el-select v-model="dataForm.backup1Card" placeholder="备用1所在板卡" @change="backup1CardChange" filterable>
            <el-option :label="item.cardId" :value="item.cardId" :key="item.cardId" v-for="item in backup1CardList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备用1板卡通道" prop="backup1Thoroughfare">
          <el-select v-model="dataForm.backup1Thoroughfare" placeholder="备用1板卡通道" filterable>
            <el-option :label="item.chId" :value="item.chId" :key="item.chId" v-for="item in backup1ThoroughfareList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备用2所在板卡" prop="backup2Card">
          <el-select v-model="dataForm.backup2Card" placeholder="备用2所在板卡" @change="backup2CardChange" filterable>
            <el-option :label="item.cardId" :value="item.cardId" :key="item.cardId" v-for="item in backup2CardList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备用2板卡通道" prop="backup2Thoroughfare">
          <el-select v-model="dataForm.backup2Thoroughfare" placeholder="备用2板卡通道" filterable>
            <el-option :label="item.chId" :value="item.chId" :key="item.chId" v-for="item in backup2ThoroughfareList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备用3所在板卡" prop="backup3Card">
          <el-select v-model="dataForm.backup3Card" placeholder="备用3所在板卡" @change="backup3CardChange" filterable>
            <el-option :label="item.cardId" :value="item.cardId" :key="item.cardId" v-for="item in backup3CardList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备用3板卡通道" prop="backup3Thoroughfare">
          <el-select v-model="dataForm.backup3Thoroughfare" placeholder="备用3板卡通道" filterable>
            <el-option :label="item.chId" :value="item.chId" :key="item.chId" v-for="item in backup3ThoroughfareList"></el-option>
          </el-select>
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
        devSn: '',
        visible: false,
        dataList: [],
        dataForm: {
          mainCard: '',
          mainThoroughfare: '',
          backup1Card: '',
          backup1Thoroughfare: '',
          backup2Card: '',
          backup2Thoroughfare: '',
          backup3Card: '',
          backup3Thoroughfare: ''
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
        mainCardData: [],
        mainThoroughfareList: [],
        backup1CardList: [],
        backup2CardList: [],
        backup3CardList: [],
        backup1ThoroughfareList: [],
        backup2ThoroughfareList: [],
        backup3ThoroughfareList: []
      }
    },
    methods: {
      init (sn) {
        this.devSn = sn
        this.visible = true
        this.$nextTick(() => {
          let that = this
          this.$refs['dataForm'].resetFields()
          // 获取e1备份主板卡 下拉选择
          this.getMainCardDropdownList(sn).then(function (data) {
            that.mainCardData = data.mbcdp
            that.backup1CardList = data.mbcdp
            that.backup2CardList = data.mbcdp
            that.backup3CardList = data.mbcdp
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        let tempObj = {
          'id': Math.floor(Math.random() * 900) + 100,
          'mainCardId': this.dataForm.mainCard,
          'mainChId': this.dataForm.mainThoroughfare,
          'bak1CardId': this.dataForm.backup1Card,
          'bak1ChId': this.dataForm.backup1Thoroughfare,
          'bak2CardId': this.dataForm.backup2Card,
          'bak2ChId': this.dataForm.backup2Thoroughfare,
          'bak3CardId': this.dataForm.backup3Card,
          'bak3ChId': this.dataForm.backup3Thoroughfare
        }
        this.visible = false
        this.$emit('refreshDataList', tempObj)
        // this.$refs['dataForm'].validate((valid) => {
        //   if (valid) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/e1bak/bak?sn=${this.dataForm.devSn}`),
        //       method: 'post',
        //       data: this.$http.adornData({
        //         'mainCardId': this.dataForm.mainCard,
        //         'mainChsId': this.dataForm.mainThoroughfare,
        //         'bak1CardId': this.dataForm.backup1Card,
        //         'bak1ChId': this.dataForm.backup1Thoroughfare,
        //         'bak2CardId': this.dataForm.backup2Card,
        //         'bak2ChId': this.dataForm.backup2Thoroughfare,
        //         'bak3CardId': this.dataForm.backup3Card,
        //         'bak3ChId': this.dataForm.backup3Thoroughfare
        //       })
        //     }).then(({data}) => {
        //       console.log(data)
        //       if (data && data.code === 0) {
        //         this.$message({
        //           message: '操作成功',
        //           type: 'success',
        //           duration: 1500,
        //           onClose: () => {
        //             this.visible = false
        //             this.$emit('refreshDataList')
        //           }
        //         })
        //       } else {
        //         this.$message.error(data.msg)
        //       }
        //     })
        //   }
        // })
      },
      // 主板卡变化
      mainCardChange (cardId) {
        this.dataForm.mainThoroughfare = ''
        this.mainThoroughfareList = []
        let thoroughObj = this.mainCardData.find(function (item) {
          return item.cardId === cardId
        })
        this.mainThoroughfareList = thoroughObj.chNum
      },
      backup1CardChange (id) {
        this.dataForm.backup1Thoroughfare = ''
        this.backup1ThoroughfareList = []
        let that = this
        this.getBackupCardDropdownList(id).then(function (data) {
          that.backup1ThoroughfareList = data.bchdp || []
        })
      },
      backup2CardChange (id) {
        this.dataForm.backup2Thoroughfare = ''
        this.backup2ThoroughfareList = []
        let that = this
        this.getBackupCardDropdownList(id).then(function (data) {
          that.backup2ThoroughfareList = data.bchdp || []
        })
      },
      backup3CardChange (id) {
        this.dataForm.backup3Thoroughfare = ''
        this.backup3ThoroughfareList = []
        let that = this
        this.getBackupCardDropdownList(id).then(function (data) {
          that.backup3ThoroughfareList = data.bchdp || []
        })
      },
      saveHandle () {

      },
      // 获取修改信息
      getModifyData (devSn) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/dev/sim'),
            method: 'get',
            params: this.$http.adornParams({
              'sn': devSn
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
      // 获取e1备份主板卡 下拉选择
      getMainCardDropdownList (sn) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/e1bak/bcdp'),
            method: 'get',
            params: this.$http.adornParams({
              'sn': sn
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
      // 获取e1备份板卡 下拉选择
      getBackupCardDropdownList (id) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/e1bak/bchdp'),
            method: 'get',
            params: this.$http.adornParams({
              'sn': this.devSn,
              'bakCardId': id
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

