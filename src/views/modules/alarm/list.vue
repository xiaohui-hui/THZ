<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">
      <el-form-item label="设备名称" prop="devSn">
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange" clearable>
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmAlarmHandle()" :disabled="dataListSelections.length <= 0">确认告警</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
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
        prop="alarmId"
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
        prop="devIp"
        header-align="center"
        align="center"
        label="IP">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="position"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="所在位置">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="devCardNum"
        header-align="center"
        align="center"
        label="告警板卡">
      </el-table-column>
      <el-table-column
        prop="port"
        header-align="center"
        align="center"
        label="告警端口">
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
        sortable
        :sort-orders = "['descending','ascending']"
        label="上报时间">
      </el-table-column>
      <el-table-column
        prop="alarmLevel"
        header-align="center"
        align="center"
        label="告警等级">
      </el-table-column>
<!--      <el-table-column-->
<!--        fixed="right"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="告警处理"-->
<!--        width="250">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.deviceId)">确认</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <el-dialog
      class="infoDialog"
      title="告警处理"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" label-width="120px">
<!--        <el-form-item label="确认人" prop="confirm">-->
<!--          <el-input v-model="dataForm.confirm" placeholder="确认人"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="处理经过">
          <el-input type="textarea" v-model="dataForm.process"></el-input>
        </el-form-item>
<!--        <el-form-item label="处理时间" prop="time">-->
<!--          <el-input v-model="dataForm.time" placeholder="处理时间"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="是否解决" prop="solve">-->
<!--          <el-radio-group v-model="dataForm.solve">-->
<!--            <el-radio label="是"></el-radio>-->
<!--            <el-radio label="否"></el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './list-add-or-update'
export default {
  name: 'list',
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
        devSn: ''
      },
      visible: false,
      dataForm: {
        process: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
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
        url: this.$http.adornUrl('/alarm/alarm/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'devSn': this.dataFormSearch.devSn,
          'alarmStatus': '0'
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
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 确认告警
    confirmAlarmHandle () {
      this.visible = true
    },
    // 确认告警提交
    dataFormSubmit () {
      let ids = this.dataListSelections.map(item => {
        return item.alarmId
      })
      this.$http({
        url: this.$http.adornUrl('/alarm/alarm/updatePatchAlarmReason'),
        method: 'post',
        data: this.$http.adornData({
          'alarmIds': ids,
          'process': this.dataForm.process
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.$message({
            message: '确认成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.getDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 设备序列号下拉变化触发
    devSnChange (devSn) {
      this.getDataList()
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
