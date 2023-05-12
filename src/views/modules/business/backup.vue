<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">
      <el-form-item label="位置" prop="position">
        <el-select v-model="dataFormSearch.position" placeholder="位置" @change="positionChange" clearable>
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
      </el-form-item>
      <el-form-item label="设备名称" prop="devSn">
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange">
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
<!--        <el-button @click="getDataList()">查询</el-button>-->
        <el-button type="primary" @click="addOrUpdateHandle(dataFormSearch.devSn)" :disabled="dataFormSearch.devSn===''">新增</el-button>
<!--        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        <el-button type="primary" @click="setHandle()" :disabled="dataFormSearch.devSn===''||dataList.length<=0">设置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="deviceId"
        header-align="center"
        align="center"
        label="主键ID">
      </el-table-column>
      <el-table-column
        prop="mainCardId"
        header-align="center"
        align="center"
        label="主用所在板卡">
      </el-table-column>
      <el-table-column
        prop="mainChId"
        header-align="center"
        align="center"
        label="主用通道">
      </el-table-column>
      <el-table-column
        prop="bak1CardId"
        header-align="center"
        align="center"
        label="备用1板卡">
      </el-table-column>
      <el-table-column
        prop="bak1ChId"
        header-align="center"
        align="center"
        label="备用1通道">
      </el-table-column>
      <el-table-column
        prop="bak2CardId"
        header-align="center"
        align="center"
        label="备用2板卡">
      </el-table-column>
      <el-table-column
        prop="bak2ChId"
        header-align="center"
        align="center"
        label="备用2通道">
      </el-table-column>
      <el-table-column
        prop="bak3CardId"
        header-align="center"
        align="center"
        label="备用3板卡">
      </el-table-column>
      <el-table-column
        prop="bak3ChId"
        header-align="center"
        align="center"
        label="备用3通道">
      </el-table-column>
      <el-table-column
        prop="workCard"
        header-align="center"
        align="center"
        label="工作所在板卡">
      </el-table-column>
      <el-table-column
        prop="workThoroughfare"
        header-align="center"
        align="center"
        label="工作通道">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
        width="250">
        <template slot-scope="scope">
<!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>-->
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getTempDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './backup-add-or-update'
export default {
  name: 'backup',
  data () {
    return {
      snList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataFormSearch: {
        devSn: '',
        position: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    // 获取设备sn
    let that = this
    this.getPositionDropdownList().then(function (data) {
      console.log(data)
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
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/e1bak/info'),
        method: 'get',
        params: this.$http.adornParams({
          'sn': this.dataFormSearch.devSn
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.dataList = data.e1bak
          // this.totalPage = data.page.totalCount
        } else {
          this.$message({
            message: data.msg,
            type: 'error',
            onClose: () => {
              this.dataList = []
              this.dataFormSearch.devSn = ''
            }
          })
        }
        this.dataListLoading = false
      })
    },
    // 子组件传递
    getTempDataList (data) {
      console.log(data)
      this.dataList.unshift(data)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (sn) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(sn)
      })
    },
    // 删除
    deleteHandle (id) {
      // 前端删除 暂存数据
      this.dataList = this.dataList.filter(function (item) {
        return item.id !== id
      })
    },
    // 位置变化
    positionChange () {
      this.dataList = []
      this.dataFormSearch.devSn = []
      // 获取设备sn
      let that = this
      this.getPositionDropdownList().then(function (data) {
        let obj = data.dp2
        if (Object.keys(obj).length <= 0) {
          that.$message({
            message: '此路局下没有设备，请重新选择！',
            type: 'error',
            duration: 2000,
            onClose: () => {
              that.dataFormSearch.position = ''
              // 获取设备sn
              that.getPositionDropdownList().then(function (data) {
                let obj = data.dp2
                let tempData = Object.keys(obj)
                that.snList = tempData.map(function (item) {
                  return {
                    sn: item,
                    name: obj[item]
                  }
                })
              })
            }
          })
          return
        }
        let tempData = Object.keys(obj)
        that.snList = tempData.map(function (item) {
          return {
            sn: item,
            name: obj[item]
          }
        })
      })
    },
    // 序列号下拉变化时触发
    devSnChange (devSn) {
      this.getDataList()
    },
    // 设置E1备份
    setHandle () {
      let that = this
      that.dataListLoading = true
      this.setE1Backup(this.dataList).then(function (data) {
        console.log(data)
        if (data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
          that.getDataList()
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
        that.dataListLoading = false
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading = false
      })
    },
    // 设置E1备份接口
    setE1Backup (data) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/e1bak/bak?sn=${this.dataFormSearch.devSn}`),
          method: 'post',
          data: this.$http.adornData({
            'e1Baks': data
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
<style lang="scss" scoped>

</style>
