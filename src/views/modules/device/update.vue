<template>
<div>
  <el-form :inline="true" :model="dataFormSearch" class="searchForm">
    <el-form-item label="设备名称" prop="devSn">
      <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" filterable clearable>
        <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="卡槽序号" prop="slotId">
      <el-select v-model="dataFormSearch.slotId" placeholder="卡槽序号" filterable clearable>
        <el-option :value="n" :key="n" v-for="n in 7"></el-option>
        <el-option :value="n+9" :key="n+9" v-for="n in 6"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>主控板卡升级</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content">
             <h3>软件升级</h3>
             <br />
             <el-form ref="dataForm">
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  action
                  ref="upload1"
                  :limit="1"
                  :http-request="upload1File">
                  <el-button type="success" icon="el-icon-upload" circle></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm1Submit()" class="cardUpdate" :disabled="dataFormSearch.devSn===''">升级</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <h3>硬件升级</h3>
            <br />
            <el-form ref="dataForm">
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  action
                  ref="upload2"
                  :limit="1"
                  :http-request="upload2File">
                  <el-button type="success" icon="el-icon-upload" circle></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm2Submit()" :disabled="dataFormSearch.devSn===''">升级</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <br />
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>业务板卡升级</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content">
             <h3>软件升级</h3>
             <br />
             <el-form ref="dataForm">
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  action
                  ref="upload3"
                  :limit="1"
                  :http-request="upload3File">
                  <el-button type="success" icon="el-icon-upload" circle></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm3Submit()" :disabled="dataFormSearch.devSn===''||dataFormSearch.slotId===''">升级</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <h3>硬件升级</h3>
            <br />
            <el-form ref="dataForm">
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  action
                  ref="upload4"
                  :limit="1"
                  :http-request="upload4File">
                  <el-button type="success" icon="el-icon-upload" circle></el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm4Submit()" :disabled="dataFormSearch.devSn===''||dataFormSearch.slotId===''">升级</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</div>
</template>

<script>
let formData1 = new FormData()
let formData2 = new FormData()
let formData3 = new FormData()
let formData4 = new FormData()
export default {
  name: 'update',
  data () {
    return {
      dataRule: {
      },
      pos: [],
      snList: [],
      dataFormSearch: {
        devSn: '',
        position: '',
        slotId: ''
      }
    }
  },
  activated () {
    this.pos = []
    this.getRoleName().then((data) => {
      if (data.pos.length === 1) {
        this.pos = data.pos
        this.dataFormSearch.position = this.pos[0]
      }
    })
    // 获取设备sn
    let that = this
    this.getPositionDropdownList().then(function (data) {
      let obj = data.dp2
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
    upload1File (fileObj) {
      formData1.forEach(function (value, key) {
        formData1.delete(key)
      })
      formData1.append('file', fileObj.file)
    },
    upload2File (fileObj) {
      formData2.forEach(function (value, key) {
        formData2.delete(key)
      })
      formData2.append('file', fileObj.file)
    },
    upload3File (fileObj) {
      formData3.forEach(function (value, key) {
        formData3.delete(key)
      })
      formData3.append('file', fileObj.file)
    },
    upload4File (fileObj) {
      formData4.forEach(function (value, key) {
        formData4.delete(key)
      })
      formData4.append('file', fileObj.file)
    },
    dataForm1Submit () {
      const files = this.$refs['upload1'].uploadFiles
      if (files.length <= 0) return alert('请先上传升级文件！')
      formData1.append('sn', this.dataFormSearch.devSn)
      formData1.append('type', 1)
      formData1.append('slotId', 8)
      this.$http({
        url: this.$http.adornUrl('/upgrade/up'),
        method: 'post',
        data: formData1,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 3000,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    dataForm2Submit () {
      const files = this.$refs['upload2'].uploadFiles
      if (files.length <= 0) return alert('请先上传升级文件！')
      formData2.append('sn', this.dataFormSearch.devSn)
      formData2.append('type', 2)
      formData2.append('slotId', 8)
      this.$http({
        url: this.$http.adornUrl('/upgrade/up'),
        method: 'post',
        data: formData2,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 3000,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    dataForm3Submit () {
      const files = this.$refs['upload3'].uploadFiles
      if (files.length <= 0) return alert('请先上传升级文件！')
      formData3.append('sn', this.dataFormSearch.devSn)
      formData3.append('type', 3)
      formData3.append('slotId', this.dataFormSearch.slotId)
      this.$http({
        url: this.$http.adornUrl('/upgrade/up'),
        method: 'post',
        data: formData3,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 3000,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    dataForm4Submit () {
      const files = this.$refs['upload4'].uploadFiles
      if (files.length <= 0) return alert('请先上传升级文件！')
      formData4.append('sn', this.dataFormSearch.devSn)
      formData4.append('type', 4)
      formData4.append('slotId', this.dataFormSearch.slotId)
      this.$http({
        url: this.$http.adornUrl('/upgrade/up'),
        method: 'post',
        data: formData4,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 3000,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
     // 获取角色对应名称
    getRoleName () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/sys/role/pos'),
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
    // 获取设备下拉列表信息(设备sn)
    getPositionDropdownList () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/dp2'),
          method: 'get',
          params: this.$http.adornParams({
            'railway': this.dataFormSearch.position
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

<style scoped lang="scss">
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    height: 250px;
    border: 1px solid #ccc;
    text-align: center;
  }
  .upload-item {
  display: flex;
}
 .upload-item .el-form-item__label {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: orange;
}
.upload-item .el-form-item__content {
  margin-left: 0 !important;
}
.upload-demo {
  height:100px;
}
</style>
