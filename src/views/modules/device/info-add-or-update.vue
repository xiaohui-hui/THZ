<template>
  <div>
    <el-dialog
      class="infoDialog"
      :title="!devSn ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="序列号" prop="deviceSerialNumber">
          <el-input v-model="dataForm.deviceSerialNumber" placeholder="序列号" :readonly="!!devSn"></el-input>
        </el-form-item>
<!--        <el-form-item label="设备编号" prop="deviceNumber">-->
<!--          <el-input v-model="dataForm.deviceNumber" placeholder="设备编号"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="设备型号" prop="deviceType" v-if="!devSn">
          <el-select v-model="dataForm.deviceType" placeholder="设备型号">
            <el-option label="RLT-3000" value="RLT-3000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
        </el-form-item>
<!--        <el-form-item label="设备级别" prop="deviceLevel" v-if="!devSn">-->
<!--          <el-select v-model="dataForm.deviceLevel" placeholder="设备级别">-->
<!--            <el-option label="一级" value="1"></el-option>-->
<!--            <el-option label="二级" value="2"></el-option>-->
<!--            <el-option label="三级" value="3"></el-option>-->
<!--            <el-option label="四级" value="4"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="是否顶级" prop="deviceLevel" v-if="!devSn">
          <el-radio-group v-model="dataForm.deviceLevel" @change="ifRootChange">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级设备1" prop="fatherLevel1" v-if="!devSn&&dataForm.deviceLevel!=='1'&&dataForm.deviceLevel!==''">
          <el-select v-model="dataForm.fatherLevel1" placeholder="上级设备1">
            <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级设备2" prop="fatherLevel2" v-if="!devSn&&dataForm.deviceLevel!=='1'&&dataForm.deviceLevel!==''">
          <el-select v-model="dataForm.fatherLevel2" placeholder="上级设备2">
            <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ip" prop="deviceIp" v-if="dataForm.deviceLevel==='1'&&'!!devSn'">
          <el-input v-model="dataForm.deviceIp" placeholder="ip"></el-input>
        </el-form-item>
<!--        <el-form-item label="port" prop="devicePort" v-if="dataForm.deviceLevel==='1'">-->
<!--          <el-input v-model="dataForm.devicePort" placeholder="port"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="网关" prop="deviceGateway" v-if="dataForm.deviceLevel==='1'">
          <el-input v-model="dataForm.deviceGateway" placeholder="网关"></el-input>
        </el-form-item>
        <el-form-item label="子网掩码" prop="mask" v-if="dataForm.deviceLevel==='1'">
          <el-input v-model="dataForm.mask" placeholder="子网掩码"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input v-model="dataForm.position" placeholder="位置" class="input-with-select">
            <el-select v-model="dataForm.belongRailway" slot="prepend" placeholder="请选择路局">
              <el-option value="北京铁路通信技术中心"></el-option>
              <el-option value="北京局"></el-option>
              <el-option value="成都局"></el-option>
              <el-option value="广铁集团"></el-option>
              <el-option value="哈尔滨局"></el-option>
              <el-option value="呼和局"></el-option>
              <el-option value="济南局"></el-option>
              <el-option value="昆明局"></el-option>
              <el-option value="兰州局"></el-option>
              <el-option value="南昌局"></el-option>
              <el-option value="南宁局"></el-option>
              <el-option value="青藏公司"></el-option>
              <el-option value="上海局"></el-option>
              <el-option value="沈阳局"></el-option>
              <el-option value="太原局"></el-option>
              <el-option value="乌鲁木齐局"></el-option>
              <el-option value="武汉局"></el-option>
              <el-option value="西安局"></el-option>
              <el-option value="郑州局"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="角色" size="mini" prop="roleId">
          <el-radio-group v-model="dataForm.roleId">
            <el-radio v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-radio>
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
      let checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('序列号不能为空'))
        }
        if (!this.isNumber(value)) {
          callback(new Error('格式不正确!'))
        } else {
          callback()
        }
      }
      return {
        snList: [],
        visible: false,
        devSn: '',
        options: [],
        roleList: [],
        dataForm: {
          deviceSerialNumber: '',
          deviceType: '',
          deviceName: '',
          deviceLevel: '',
          fatherLevel1: '',
          fatherLevel2: '',
          deviceIp: '',
          devicePort: '',
          deviceGateway: '',
          mask: '',
          position: '',
          belongRailway: '',
          roleId: ''
        },
        dataRule: {
          deviceSerialNumber: [
            { required: true, validator: checkAge, trigger: 'blur' }
          ],
          deviceType: [
            { required: true, message: '设备型号不能为空', trigger: 'blur' }
          ],
          // deviceName: [
          //   { required: true, message: '设备名称不能为空', trigger: 'blur' }
          // ],
          deviceLevel: [
            { required: true, message: '是否顶级不能为空', trigger: 'blur' }
          ],
          deviceIp: [
            { required: true, message: 'ip不能为空', trigger: 'blur' }
          ],
          // devicePort: [
          //   { required: true, message: '端口不能为空', trigger: 'blur' }
          // ],
          deviceGateway: [
            { required: true, message: '网关不能为空', trigger: 'blur' }
          ],
          belongRailway: [
            { required: true, message: '路局不能为空', trigger: 'blur' }
          ]
          // roleId: [
          //   { required: true, message: '角色不能为空', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      init (devSn) {
        this.devSn = devSn
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.deviceName = ''
          this.dataForm.position = ''
          this.dataForm.belongRailway = ''
          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.roleList = data && data.code === 0 ? data.list : []
          })
          let that = this
          // 获取信息
          if (devSn) {
            this.getModifyData(devSn).then(function (data) {
              console.log(data)
              that.dataForm.roleId = data.sim.role
              that.dataForm.deviceName = data.sim.dev.devName
              that.dataForm.deviceSerialNumber = data.sim.dev.devSn
              that.dataForm.position = data.sim.dev.position
              that.dataForm.belongRailway = data.sim.dev.belongRailway
            })
          } else {
            // 获取设备层级
            // this.deviceTreeData(false).then(function (data) {
            //   that.options = that.getTreeData(data.trees)
            // })
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
              url: this.$http.adornUrl(`/dev/${!this.devSn ? 'add' : 'modify'}?roleId=${this.dataForm.roleId}`),
              method: 'post',
              data: this.$http.adornData({
                'devSn': this.dataForm.deviceSerialNumber,
                'devName': this.dataForm.deviceName,
                'devType': this.dataForm.deviceType,
                'ip': [this.dataForm.deviceIp],
                'port': this.dataForm.devicePort,
                'gateway': this.dataForm.deviceGateway,
                'mask': this.dataForm.mask,
                'position': this.dataForm.position,
                'belongRailway': this.dataForm.belongRailway,
                'isRoot': this.dataForm.deviceLevel === '1',
                'psn': this.dataForm.fatherLevel1 + ',' + this.dataForm.fatherLevel2
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
      // 获取设备树形层级关系
      deviceTreeData (isHomePage) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/dev/level'),
            method: 'get',
            params: this.$http.adornParams({
              'isHomePage': isHomePage
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
      // 递归判断列表，把最后的空设为undefined
      getTreeData (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].devEntityList < 1) {
            data[i].devEntityList = undefined
          } else {
            this.getTreeData(data[i].devEntityList)
          }
        }
        return data
      },
      ifRootChange (ifRoot) {
        if (ifRoot === '1') {
          this.dataForm.fatherLevel = []
        } else {
          this.dataForm.deviceIp = ''
          this.dataForm.devicePort = ''
          this.dataForm.deviceGateway = ''
        }
      },
      isNumber (val) {
        let regPos = /F[0-9]{11}3519/ // 判断是否是数字
        if (regPos.test(val)) {
          return true
        } else {
          return false
        }
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
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    width: 120px;
  }

</style>

