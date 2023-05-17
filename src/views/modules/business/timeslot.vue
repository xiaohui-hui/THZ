<template>
  <div class="mod-config">
    <el-progress :percentage="percentage" v-if="jdt"></el-progress>
<!--    <dProgress :percentage="40" :text-inside="true"  :stroke-height="16"/>-->
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm"  v-loading="dataListLoading1" element-loading-text="请稍等...">
<!--      <el-form-item label="PCM设备">-->
<!--        <el-input v-model="dataFormSearch.deviceName" placeholder="PCM设备" clearable></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="位置" prop="position">
        <el-select v-model="dataFormSearch.position" placeholder="位置" @change="positionChange" clearable :disabled="dataListLoading===true||pos.length===1">
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
        <el-select v-model="dataFormSearch.devSn" placeholder="设备名称" @change="devSnChange" :disabled="dataListLoading===true">
          <el-option :label="item.name" :value="item.sn" :key="item.sn" v-for="item in snList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTimeslotHandle()" :disabled="dataFormSearch.devSn===''||dataListLoading===true">新增</el-button>
        <el-button type="danger" @click="deleteALlHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="primary" @click="setHandle()" :disabled="dataFormSearch.devSn===''||dataListLoading===true">设置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      height="720"
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
        prop="srcId"
        header-align="center"
        align="center"
        label="主键ID">
      </el-table-column>
      <el-table-column
        prop="srcCardTypeName"
        header-align="center"
        align="center"
        label="源板卡类型">
      </el-table-column>
      <el-table-column
        prop="srcCardId"
        header-align="center"
        align="center"
        label="源板卡">
      </el-table-column>
      <el-table-column
        prop="srcChId"
        header-align="center"
        align="center"
        label="源通道">
      </el-table-column>
      <el-table-column
        prop="srcTsId"
        header-align="center"
        align="center"
        label="源时隙">
      </el-table-column>
      <el-table-column
        prop="dstCardTypeName"
        header-align="center"
        align="center"
        label="目的板卡类型">
      </el-table-column>
      <el-table-column
        prop="dstCardId"
        header-align="center"
        align="center"
        label="目的板卡">
      </el-table-column>
      <el-table-column
        prop="dstChId"
        header-align="center"
        align="center"
        label="目的通道">
      </el-table-column>
      <el-table-column
        prop="dstTsId"
        header-align="center"
        align="center"
        label="目的时隙">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.srcId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增-->
    <el-dialog title="新增" :visible.sync="addTimeslotVisible" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="11">
          <div class="grid-content">
            <el-form :model="source" label-width="80px">
              <el-form-item label="源板卡" prop="card">
                <el-select v-model="source.card" placeholder="源板卡" @change="sourceCardChange">
                  <el-option :value="item.cardId+'_'+item.cardTypeName" :key="item.cardId" v-for="item in sourceCardList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="源通道" prop="thoroughfare">
                <el-select v-model="source.thoroughfare" placeholder="源通道" @change="thoroughfareCardChange">
                  <el-option :label="item" :value="item" :key="item" v-for="item in sourceThoroughfareList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="源时隙" prop="timeSlot">
                <el-select v-model="source.timeSlot" placeholder="源时隙">
                  <el-option :label="item.tsId" :value="item.tsId" :key="item.tsId" v-for="item in sourceTimeSlotList"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="11">
          <div class="grid-content">
            <el-form :model="target" label-width="80px">
              <el-form-item label="目的板卡" prop="card">
                <el-select v-model="target.card" placeholder="目的板卡" @change="targetCardChange">
                  <el-option :value="item.cardId+'_'+item.cardTypeName" :key="item.cardId" v-for="item in targetCardList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目的通道" prop="thoroughfare">
                <el-select v-model="target.thoroughfare" placeholder="目的通道" @change="targetThoroughfareCardChange">
                  <el-option :label="item" :value="item" :key="item" v-for="item in targetThoroughfareList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目的时隙" prop="timeSlot">
                <el-select v-model="target.timeSlot" placeholder="目的时隙">
                  <el-option :label="item.tsId" :value="item.tsId" :key="item.tsId" v-for="item in targetTimeSlotList"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTimeslotVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTimeslotSubmit()">确 定</el-button>
      </div>
    </el-dialog>
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
// import dProgress from '@/components/progress'
export default {
  name: 'timeslot',
  data () {
    return {
      jdt: false,
      percentage: 0,
      timeStart: null,
      pos: [],
      snList: [],
      dataList: [],
      sourceCardList: [],
      sourceThoroughfareList: [],
      sourceTimeSlotList: [],
      targetCardList: [],
      targetThoroughfareList: [],
      targetTimeSlotList: [],
      dataListLoading: false,
      dataListLoading1: false,
      addTimeslotVisible: false,
      dataListSelections: [],
      dataFormSearch: {
        devSn: '',
        position: ''
      },
      source: {
        card: '',
        thoroughfare: '',
        timeSlot: ''
      },
      target: {
        card: '',
        thoroughfare: '',
        timeSlot: ''
      }
    }
  },
  components: {
    // dProgress
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
        url: this.$http.adornUrl('/tsc/sn'),
        method: 'get',
        params: this.$http.adornParams({
          'sn': this.dataFormSearch.devSn
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          // let originalData = data.sn
          this.dataList = data.sn
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
    // // 每页数
    // sizeChangeHandle (val) {
    //   this.pageSize = val
    //   this.pageIndex = 1
    //   this.getDataList()
    // },
    // // 当前页
    // currentChangeHandle (val) {
    //   this.pageIndex = val
    //   this.getDataList()
    // },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增
    addTimeslotHandle () {
      let that = this
      this.addTimeslotVisible = true
      this.getSourceCardList().then(function (data) {
        that.sourceCardList = data.cardSrcList
      })
      this.getTargetCardList().then(function (data) {
        that.targetCardList = data.cardDstList
      })
    },
    // 新增保存
    addTimeslotSubmit () {
      this.addTimeslotVisible = false
      let obj = {
        'srcId': Math.floor(Math.random() * 900) + 100,
        'srcCardId': this.source.card.split('_')[0],
        'srcChId': this.source.thoroughfare,
        'srcCardTypeName': this.source.card.split('_')[1],
        'srcTsId': this.source.timeSlot,
        'dstCardId': this.target.card.split('_')[0],
        'dstChId': this.target.thoroughfare,
        'dstTsId': this.target.timeSlot,
        'dstCardTypeName': this.target.card.split('_')[1]
      }
      this.dataList.unshift(obj)
    },
    // 删除
    deleteHandle (id) {
      // 前端删除 暂存数据
      this.dataList = this.dataList.filter(function (item) {
        return item.srcId !== id
      })
    },
    // 批量删除
    deleteALlHandle () {
      this.dataListSelections.forEach((item) => {
        this.dataList = this.dataList.filter(function (data) {
          return data.srcId !== item.srcId
        })
      })
    },
    // 设置保存数据
    setHandle () {
      let that = this
      let cross = {
        'sn': this.dataFormSearch.devSn,
        'tsc': this.dataList
      }
      that.dataListLoading1 = true
      this.jdt = true
      this.setTimeSlotWork(cross).then(function (data) {
        if (data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: data.msg,
            type: 'error'
          })
        }
        that.dataListLoading1 = false
        that.percentage = 100
        that.jdt = false
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading1 = false
        that.percentage = 100
        that.jdt = false
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
    // 指定设备板卡通道下的时隙交叉列表
    getTimeSlotList (card, thoroughfare) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/tsc/tsSta'),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataFormSearch.devSn,
            'cardId': card,
            'chId': thoroughfare
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
    // 指定设备板卡通道下的时隙交叉列表--目的
    getTargetTimeSlotList (card, thoroughfare) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/tsc/tsdst'),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataFormSearch.devSn,
            'cardId': card,
            'chId': thoroughfare
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
    // 获取源板卡通道
    getSourceCardList () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/tsc/cardSrc'),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataFormSearch.devSn
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
    // 获取目的板卡通道
    getTargetCardList () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/tsc/cardDst'),
          method: 'get',
          params: this.$http.adornParams({
            'sn': this.dataFormSearch.devSn
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
    // 位置变化
    positionChange () {
      this.dataList = []
      this.dataFormSearch.devSn = ''
      this.snList = []
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
    devSnChange () {
      this.getDataList()
    },
    // 源板卡变化
    sourceCardChange (cardId) {
      this.sourceThoroughfareList = ''
      this.source.thoroughfare = ''
      this.sourceTimeSlotList = ''
      this.source.timeSlot = ''
      let thoroughObj = this.sourceCardList.find(function (item) {
        return item.cardId === parseInt(cardId.split('_')[0])
      })
      this.sourceThoroughfareList = thoroughObj.chNum
    },
    // 目的板卡变化
    targetCardChange (cardId) {
      this.targetThoroughfareList = ''
      this.target.thoroughfare = ''
      this.targetTimeSlotList = ''
      this.target.timeSlot = ''
      let thoroughObj = this.targetCardList.find(function (item) {
        return item.cardId === parseInt(cardId.split('_')[0])
      })
      this.targetThoroughfareList = thoroughObj.chNum
    },
    // 源通道变化
    thoroughfareCardChange (thoroughObjId) {
      this.sourceTimeSlotList = ''
      this.source.timeSlot = ''
      let that = this
      this.getTimeSlotList(this.source.card.split('_')[0], this.source.thoroughfare).then(function (data) {
        that.sourceTimeSlotList = data.tsIdle
        if (that.sourceTimeSlotList.length <= 0) {
          that.$message({
            message: '此通道下没有时隙，请重新选择！',
            type: 'error',
            onClose: () => {
              that.source.thoroughfare = ''
            }
          })
        }
      })
    },
    // 目的通道变化
    targetThoroughfareCardChange (thoroughObjId) {
      this.targetTimeSlotList = ''
      this.target.timeSlot = ''
      let that = this
      this.getTargetTimeSlotList(this.target.card.split('_')[0], this.target.thoroughfare).then(function (data) {
        that.targetTimeSlotList = data.tsDstIdle
        if (that.targetTimeSlotList.length <= 0) {
          that.$message({
            message: '此通道下没有时隙，请重新选择！',
            type: 'error',
            duration: 2000,
            onClose: () => {
              that.target.thoroughfare = ''
            }
          })
        }
      })
    },
    // 时隙交叉业务
    setTimeSlotWork (cross) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/tsc/crs`),
          method: 'post',
          data: this.$http.adornData({
            'cross': cross
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
    increase () {
      let that = this
      that.timeStart = setInterval(() => {
        if (that.percentage < 95) {
          that.percentage += 5
        }
        if (that.percentage > 100) {
          that.percentage = 100
        }
      }, 5000)
    },
    increaseend () {
      let that = this
      that.percentage = 100
      clearInterval(this.timeStart)
    }
  },
  watch: {
    jdt (value) {
      const that = this
      if (value) {
        that.increase()
      } else {
        that.increaseend()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-divider--vertical {
  height: 150px;
  left: 30px;
}
</style>
