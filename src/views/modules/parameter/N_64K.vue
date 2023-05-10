<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">
      <el-form-item label="设备名称" prop="devSn">
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange">
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-loading="dataListLoading1">批量设置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :default-sort = "{prop: 'chId', order: 'ascending'}"
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
        prop="cardId"
        header-align="center"
        align="center"
        label="板卡序号">
      </el-table-column>
      <el-table-column
        prop="cardTypeName"
        header-align="center"
        align="center"
        label="板卡类型">
      </el-table-column>
      <el-table-column
        prop="chId"
        header-align="center"
        align="center"
        label="通道">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="N*64K"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.n64K" placeholder="N*64K" clearable>
            <el-option :label="n-1" :value="n-1" :key="n" v-for="n in 32"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        fixed="right"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        label="操作"-->
      <!--        width="250">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.deviceId)">修改</el-button>-->
      <!--          <el-button type="text" size="small" @click="empower(scope.row.sdeviceId)">授权</el-button>-->
      <!--          <el-button type="text" size="small" @click="deleteHandle(scope.row.deviceId)">删除</el-button>-->
      <!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.deviceId)">点名测试</el-button>-->
      <!--          <el-button type="text" size="small" @click="detailsHandle(scope.row.deviceId)">详情</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
<!--    <el-pagination-->
<!--      @size-change="sizeChangeHandle"-->
<!--      @current-change="currentChangeHandle"-->
<!--      :current-page="pageIndex"-->
<!--      :page-sizes="[10, 20, 50, 100]"-->
<!--      :page-size="pageSize"-->
<!--      :total="totalPage"-->
<!--      layout="total, sizes, prev, pager, next, jumper">-->
<!--    </el-pagination>-->
  </div>
</template>

<script>
export default {
  name: 'N_64K',
  data () {
    return {
      snList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListLoading1: false,
      dataListSelections: [],
      dataFormSearch: {
        devSn: ''
      }
    }
  },
  components: {
  },
  activated () {
    // 获取设备sn
    let that = this
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
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/n64k/list'),
        method: 'get',
        params: this.$http.adornParams({
          'sn': this.dataFormSearch.devSn
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.dataList = data.n64k
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      })
    },
    // 序列号下拉变化时触发
    devSnChange () {
      this.getDataList()
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
    // 批量设置
    deleteHandle () {
      this.dataListLoading1 = true
      this.$http({
        url: this.$http.adornUrl(`/n64k/set?sn=${this.dataFormSearch.devSn}`),
        method: 'post',
        data: this.$http.adornData({
          'cardChannelEntities': this.dataListSelections
        })
      }).then(({data}) => {
        this.dataListLoading1 = false
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
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
