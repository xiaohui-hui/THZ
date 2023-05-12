<template>
  <div class="mod-config">
<!--    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">-->
<!--      <el-form-item>-->
<!--        <el-input v-model="dataFormSearch.deviceName" placeholder="设备名称" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      &lt;!&ndash;      <el-form-item>&ndash;&gt;-->
<!--      &lt;!&ndash;        <el-button @click="getDataList()">查询</el-button>&ndash;&gt;-->
<!--      &lt;!&ndash;        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>&ndash;&gt;-->
<!--      &lt;!&ndash;        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>&ndash;&gt;-->
<!--      &lt;!&ndash;      </el-form-item>&ndash;&gt;-->
<!--    </el-form>-->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="50">-->
<!--      </el-table-column>-->
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
        prop="deviceName"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="alarmReason"
        header-align="center"
        align="center"
        label="告警原因">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="告警时间">
      </el-table-column>
      <el-table-column
        prop="updateName"
        header-align="center"
        align="center"
        label="处理人">
      </el-table-column>
      <el-table-column
        prop="process"
        header-align="center"
        align="center"
        label="处理经过">
      </el-table-column>
      <el-table-column
        prop="recoveryTime"
        header-align="center"
        align="center"
        label="处理时间">
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
  </div>
</template>

<script>
export default {
  name: 'record',
  data () {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      dataFormSearch: {
        deviceName: ''
      }
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/alarm/alarm/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'alarmStatus': '1'
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
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
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
