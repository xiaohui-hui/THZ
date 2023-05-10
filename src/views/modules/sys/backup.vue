<template>
  <div class="mod-config">
<!--    <el-row>-->
<!--      <el-button type="primary" icon="el-icon-set-up" circle @click="backupHandle()"></el-button>-->
<!--      <el-button type="warning" icon="el-icon-plus" circle @click="addHandle()"></el-button>-->
<!--      <el-button type="danger" icon="el-icon-delete" circle @click="deleteHandle()" :disabled="dataListSelections.length <= 0"></el-button>-->
<!--      <el-button type="success" icon="el-icon-refresh" circle @click="refresh()"></el-button>-->
<!--    </el-row>-->
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="backupHandle">周期设置</el-button>
        <el-button type="primary" @click="addHandle">立即备份</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="primary" @click="refresh()">刷新</el-button>
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
        width="100">
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="bakId"
        header-align="center"
        align="center"
        label="">
      </el-table-column>
      <el-table-column
        prop="bakName"
        header-align="center"
        align="center"
        label="备份文件名称">
      </el-table-column>
      <el-table-column
        prop="bakTime"
        header-align="center"
        align="center"
        label="备份时间">
      </el-table-column>
      <el-table-column
        prop="describes"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editHandle(scope.row.bakId)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.bakId)">删除</el-button>
          <el-button type="text" size="small" @click="recoverHandle(scope.row.bakId)">还原</el-button>
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
    <el-dialog title="编辑" :visible.sync="dialogEditVisible" class="editDialog" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" :rules="editRule" v-loading="dataListLoading">
        <el-form-item label="备份文件名称" prop="bakName">
          <el-input v-model="editForm.bakName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备份文件描述" prop="bakDescribes">
          <el-input v-model="editForm.bakDescribes" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增" :visible.sync="dialogAddVisible" class="addDialog" :close-on-click-modal="false">
      <el-form :model="addForm" ref="addForm" :rules="addRule" v-loading="dataListLoading">
        <el-form-item label="备份文件名称" prop="addBakName">
          <el-input v-model="addForm.addBakName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备份文件描述" prop="addBakDescribes">
          <el-input v-model="addForm.addBakDescribes" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="自动备份周期测试" :visible.sync="backupVisible" class="backupDialog" :close-on-click-modal="false">
      <el-form :model="backupForm" ref="backupForm" :rules="backupRule" v-loading="dataListLoading" label-width="120px">
        <el-form-item label="自动备份">
          <el-switch v-model="backupForm.switch" active-text="ON" inactive-text="OFF"></el-switch>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="backupForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="间隔时间(天)" prop="intervalDays">
          <el-input v-model="backupForm.intervalDays" autocomplete="off" placeholder="设置间隔时间(天)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backupVisible = false">取 消</el-button>
        <el-button type="primary" @click="backupFormSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        dialogEditVisible: false,
        dataForm: {

        },
        editForm: {
          bakId: '',
          bakName: '',
          bakDescribes: ''
        },
        editRule: {
          bakName: [
            { required: true, message: '备份文件名称不能为空', trigger: 'blur' }
          ],
          bakDescribes: [
            { required: true, message: '备份文件描述不能为空', trigger: 'blur' }
          ]
        },
        dialogAddVisible: false,
        addForm: {
          addBakName: '',
          addBakDescribes: ''
        },
        addRule: {
          addBakName: [
            { required: true, message: '备份文件名称不能为空', trigger: 'blur' }
          ],
          addBakDescribes: [
            { required: true, message: '备份文件描述不能为空', trigger: 'blur' }
          ]
        },
        backupVisible: false,
        backupForm: {
          switch: true,
          startTime: '',
          intervalDays: ''
        },
        backupRule: {
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          intervalDays: [
            { required: true, message: '间隔时间不能为空', trigger: 'blur' }
          ]
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
          url: this.$http.adornUrl('/sms/dbBak/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
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
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.bakId
        })
        this.$confirm(`确定对所选的备份数据进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sms/dbBak/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
      // 还原
      recoverHandle (id) {
        this.$confirm(`确定对所选的备份数据进行还原操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sms/dbBak/recover/${id}`),
            method: 'get',
            params: this.$http.adornParams({
            })
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
      // 编辑
      editHandle (id) {
        this.dialogEditVisible = true
        this.$nextTick(() => {
          this.$refs['editForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl(`/sms/dbBak/info/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.editForm.bakName = data.bak.bakName
              this.editForm.bakDescribes = data.bak.describes
              this.editForm.bakId = data.bak.bakId
            }
          })
        })
      },
      // 编辑表单提交
      editFormSubmit () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl('/sms/dbBak/edit'),
              method: 'post',
              data: this.$http.adornData({
                'bakId': this.editForm.bakId,
                'bakName': this.editForm.bakName,
                'describes': this.editForm.bakDescribes
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dialogEditVisible = false
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 增加
      addHandle () {
        this.dialogAddVisible = true
        this.$nextTick(() => {
          this.$refs['addForm'].resetFields()
        })
      },
      // 增加表单提交
      addFormSubmit () {
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl('/sms/dbBak/immediately'),
              method: 'post',
              data: this.$http.adornData({
                'bakName': this.addForm.addBakName,
                'describes': this.addForm.addBakDescribes
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dialogAddVisible = false
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 周期备份
      backupHandle () {
        this.backupVisible = true
        this.$nextTick(() => {
          this.$refs['backupForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl('/sms/autoSchedule/setBakInterval/bak_auto'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.interval !== undefined) {
                let status = data.interval.status
                if (status === 1) {
                  this.backupForm.switch = true
                } else {
                  this.backupForm.switch = false
                }
                this.backupForm.startTime = data.interval.startTime
                this.backupForm.intervalDays = data.interval.intervalDays
              }
            }
          })
        })
      },
      // 周期备份表单提交
      backupFormSubmit () {
        this.$refs['backupForm'].validate((valid) => {
          if (valid) {
            let status = 1
            if (!this.backupForm.switch) {
              status = 0
            }
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl('/sms/autoSchedule/setSubmit'),
              method: 'post',
              data: this.$http.adornData({
                'status': status,
                'startTime': this.backupForm.startTime,
                'intervalDays': this.backupForm.intervalDays,
                'taskname': 'bak_auto'
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.backupVisible = false
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 刷新
      refresh () {
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
  .backupDialog .el-dialog {
    width: 30%;
  }
  .editDialog .el-dialog {
    width: 30%;
  }
  .addDialog .el-dialog {
    width: 30%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>
