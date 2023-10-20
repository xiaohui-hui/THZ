<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">
        <el-form-item label="告警原因">
            <el-input v-model="dataFormSearch.alarmReason" autocomplete="off" placeholder="告警原因"></el-input>
        </el-form-item>
        <el-form-item label="告警级别">
          <el-select v-model="dataFormSearch.alarmLevel" placeholder="告警级别" @change="devSeChange" filterable clearable>
            <el-option label="一般告警" value="3"></el-option>
            <el-option label="重要告警" value="2"></el-option>
            <el-option label="严重告警" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryHandle()">查询</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
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
<!--      <el-table-column-->
<!--        v-if="false"-->
<!--        prop="deviceId"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="主键ID">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="告警原因">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="告警级别">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='3'">一般告警</span>
          <span v-else-if="scope.row.level==='2'">重要告警</span>
          <span v-else-if="scope.row.level==='1'">严重告警</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
    <!--新增/修改告警-->
    <el-dialog :title="!alarmId?'新增':'修改'" :visible.sync="alarmVisible" :close-on-click-modal="false">
      <el-form :model="alarmForm" :rules="alarmRule" ref="alarmForm" label-width="120px">
        <el-form-item label="告警原因" prop="alarmReason">
          <el-input v-model="alarmForm.alarmReason" autocomplete="off" placeholder="告警原因"></el-input>
        </el-form-item>
        <el-form-item label="告警级别" prop="alarmLevel">
          <el-select v-model="alarmForm.alarmLevel" placeholder="告警级别" filterable>
            <el-option label="一般告警" value="3"></el-option>
            <el-option label="重要告警" value="2"></el-option>
            <el-option label="严重告警" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alarmVisible = false">取 消</el-button>
        <el-button type="primary" @click="alarmSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'info',
  data () {
    return {
      dataFormSearch: {
        alarmReason: '',
        alarmLevel: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [],
      alarmVisible: false,
      alarmForm: {
        alarmReason: '',
        alarmLevel: ''
      },
      alarmRule: {
        alarmReason: [
            { required: true, message: '告警原因不能为空', trigger: 'blur' }
        ],
        alarmLevel: [
            { required: true, message: '告警级别不能为空', trigger: 'blur' }
        ]
      },
      alarmId: ''
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/alarm/alarmLevel/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'levelName': this.dataFormSearch.alarmReason,
          'level': this.dataFormSearch.alarmLevel
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
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
      this.alarmId = id
      this.alarmVisible = true
      this.$nextTick(() => {
        this.$refs['alarmForm'].resetFields()
        if (id) {
          this.$http({
            url: this.$http.adornUrl(`/alarm/alarmLevel/info/${id}`),
            method: 'get',
            params: this.$http.adornParams({
            })
          }).then(({data}) => {
            this.alarmForm.alarmReason = data.alarmLevel.name
            this.alarmForm.alarmLevel = data.alarmLevel.level
          })
        }
      })
    },
    // 删除
    deleteHandle (sn) {
      let sns = sn ? [sn] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`您确定要删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('alarm/alarmLevel/delete'),
          method: 'post',
          data: this.$http.adornData(sns, false)
        }).then(({data}) => {
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
      })
    },
    // 查询下拉变化
    devSeChange () {
      this.getDataList()
    },
    // 查询
    queryHandle () {
      this.getDataList()
    },
    // 告警提交
    alarmSubmit () {
      this.$refs['alarmForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/alarm/alarmLevel/${!this.alarmId ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.alarmId,
              'name': this.alarmForm.alarmReason,
              'level': this.alarmForm.alarmLevel
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                  this.alarmVisible = false
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
<style lang="scss" scoped>

</style>
