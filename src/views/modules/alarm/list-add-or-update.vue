<template>
  <div>
    <el-dialog
      class="infoDialog"
      title="告警处理"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="确认人" prop="confirm">
          <el-input v-model="dataForm.confirm" placeholder="确认人"></el-input>
        </el-form-item>
        <el-form-item label="处理经过">
          <el-input type="textarea" v-model="dataForm.process"></el-input>
        </el-form-item>
        <el-form-item label="处理时间" prop="time">
          <el-input v-model="dataForm.time" placeholder="处理时间"></el-input>
        </el-form-item>
        <el-form-item label="是否解决" prop="solve">
          <el-radio-group v-model="dataForm.solve">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
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
          confirm: '',
          process: '',
          time: '',
          solve: ''
        },
        dataRule: {
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          // 获取信息
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          // if (valid) {
          //   this.$http({
          //     url: this.$http.adornUrl(`/resources/station/${!this.dataForm.stationId ? 'save' : 'update'}`),
          //     method: 'post',
          //     data: this.$http.adornData({
          //       'stationId': this.dataForm.stationId || undefined,
          //       'stationName': this.dataForm.stationName,
          //       'areaId': this.dataForm.lineId,
          //       'publicareaId': this.dataForm.roadId,
          //       'stationType': this.dataForm.stationType,
          //       'stationTypeImg': this.dataForm.stationTypeImg,
          //       'longitude': this.dataForm.longitude,
          //       'latitude': this.dataForm.latitude,
          //       'describes': this.dataForm.describes
          //     })
          //   }).then(({data}) => {
          //     if (data && data.code === 0) {
          //       this.$message({
          //         message: '操作成功',
          //         type: 'success',
          //         duration: 1500,
          //         onClose: () => {
          //           this.visible = false
          //           this.$emit('refreshDataList')
          //         }
          //       })
          //     } else {
          //       this.$message.error(data.msg)
          //     }
          //   })
          // }
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

