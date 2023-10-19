<template>
<div>
  <el-form :inline="true" :model="dataFormSearch" class="searchForm">
    <el-form-item label="设备名称" prop="devSn">
      <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange" filterable>
        <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>ARM板卡升级</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content">
             <h3>软件升级</h3>
             <br />
             <el-form :model="dataForm1" :rules="dataRule" ref="dataForm" label-width="80px">
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
              <el-form-item label="升级版本" prop="version">
                <el-input v-model="dataForm1.version" placeholder="版本"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm1Submit()">升级</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <h3>固件升级</h3>
            <br />
            <el-form :model="dataForm2" :rules="dataRule" ref="dataForm" label-width="80px">
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
              <el-form-item label="升级版本" prop="version">
                <el-input v-model="dataForm2.version" placeholder="版本"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm2Submit()">升级</el-button>
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
      <span>工作板卡升级</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content">
             <h3>软件升级</h3>
             <br />
             <el-form :model="dataForm3" :rules="dataRule" ref="dataForm" label-width="80px">
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
              <el-form-item label="升级版本" prop="version">
                <el-input v-model="dataForm3.version" placeholder="版本"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm3Submit()">升级</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <h3>固件升级</h3>
            <br />
            <el-form :model="dataForm4" :rules="dataRule" ref="dataForm" label-width="80px">
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
              <el-form-item label="升级版本" prop="version">
                <el-input v-model="dataForm4.version" placeholder="版本"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataForm4Submit()">升级</el-button>
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
export default {
  name: 'update',
  data () {
    return {
      dataForm1: {
        version: ''
      },
      dataForm2: {
        version: ''
      },
      dataForm3: {
        version: ''
      },
      dataForm4: {
        version: ''
      },
      dataRule: {
      },
      pos: [],
      snList: [],
      dataFormSearch: {
        devSn: '',
        position: ''
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
    uploadFile (fileObj) {

    },
    dataFormSubmit () {

    },
    devSnChange () {
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
    position: relative;
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



</style>
