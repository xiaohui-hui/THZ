<template>
  <el-dialog
    class="configDialog"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="参数类型" prop="paramKey">
        <el-select v-model="dataForm.paramKey" placeholder="参数类型选择" clearable>
          <el-option label="站点类型" value="ST"></el-option>
          <el-option label="地标类型" value="LM"></el-option>
          <el-option label="告警类型" value="AT"></el-option>
          <el-option label="告警原因" value="AR"></el-option>
          <el-option label="设备类型" value="DT"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="参数名" prop="paramKey">-->
<!--        <el-input v-model="dataForm.paramKey" placeholder="参数名"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="参数名" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          paramKey: '',
          paramValue: '',
          remark: ''
        },
        dataRule: {
          paramKey: [
            { required: true, message: '参数类型不能为空', trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sms/parameter//info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.paramKey = data.parameter.paramTypeId
                this.dataForm.paramValue = data.parameter.paramValueName
                this.dataForm.remark = data.parameter.describes
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sms/parameter/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'paramId': this.dataForm.id || undefined,
                'paramTypeId': this.dataForm.paramKey,
                'paramValueName': this.dataForm.paramValue,
                'describes': this.dataForm.remark
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
      }
    }
  }
</script>
<style lang="scss">
  .configDialog {
    .el-dialog {
      width: 30%;
    }

  }

</style>

