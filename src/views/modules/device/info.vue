<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataFormSearch" @keyup.enter.native="getDataList()" class="searchForm">
      <el-form-item>
        <el-input v-model="dataFormSearch.deviceName" placeholder="设备名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="setIdHandle()">采集</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      element-loading-text="正在测试..."
      element-loading-spinner="el-icon-loading"
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
<!--      <el-table-column-->
<!--        prop="deviceNumber"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="设备编号">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="devType"
        header-align="center"
        align="center"
        label="设备型号">
      </el-table-column>
      <el-table-column
        prop="devName"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="位置">
        <template slot-scope="scope">
          {{ scope.row.belongRailway }}&nbsp;{{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column
        prop="devSn"
        header-align="center"
        align="center"
        label="设备序列号">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        label="ip">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="port"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="port">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="gateway"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="网关">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="online"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span style="color:#F56C6C" v-if="scope.row[scope.column.property] === false ">离线</span>
          <span style="color:#67C23A" v-else>在线</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.devSn)">修改</el-button>
<!--          <el-button type="text" size="small" @click="empower(scope.row.sdeviceId)">授权</el-button>-->
          <el-button type="text" size="small" @click="deleteHandle(scope.row.devSn)">删除</el-button>
          <el-button type="text" size="small" @click="nameTestHandle(scope.row.devSn)">在线检测</el-button>
          <el-button type="text" size="small" @click="detailsHandle(scope.row.devSn,scope.row.devName)">详情</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--设备用户权限分配-->
    <el-dialog title="用户权限分配" :visible.sync="setUserRoleVisible" :close-on-click-modal="false">
      <el-form :model="userRoleForm" ref="userRoleForm">
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="userRoleForm.serialNumber" autocomplete="off" placeholder="序列号"></el-input>
        </el-form-item>
        <el-form-item label="用户" prop="userName">
          <el-input v-model="userRoleForm.userName" autocomplete="off" placeholder="用户"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="userRoleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!--设备详情-->
    <el-dialog title="详情" :visible.sync="detailsVisible" :close-on-click-modal="false" class="detailDialog">
      <el-card class="box-card" v-loading="dataListLoading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
        <div class="detailContainer">
          <el-form :inline="true" :model="detailsForm" ref="detailsForm">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="detailsForm.deviceName" autocomplete="off" placeholder="设备名称"></el-input>
            </el-form-item>
            <el-form-item label="序列号" prop="serialNumber">
              <el-input v-model="detailsForm.serialNumber" autocomplete="off" placeholder="序列号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="refreshHandle()" :disabled="this.detailsForm.serialNumber===''">强制刷新</el-button>
            </el-form-item>
          </el-form>
          <img src="~@/assets/img/RLT-6600SD.png" alt="">
          <div class="cardWrap">
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[0]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[0]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[0]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[0]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[0]!=='1'&&detailsCardsList[0]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[0]!=='1'&&detailsCardsList[0]!==undefined&&alarmCardList[0]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[0]!=='1'&&detailsCardsList[0]!==undefined&&alarmCardList[0]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[1]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[1]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[1]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[1]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[1]!=='1'&&detailsCardsList[1]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[1]!=='1'&&detailsCardsList[1]!==undefined&&alarmCardList[1]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[1]!=='1'&&detailsCardsList[1]!==undefined&&alarmCardList[1]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[2]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[2]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[2]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[2]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[2]!=='1'&&detailsCardsList[2]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[2]!=='1'&&detailsCardsList[2]!==undefined&&alarmCardList[2]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[2]!=='1'&&detailsCardsList[2]!==undefined&&alarmCardList[2]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[3]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[3]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[3]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[3]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[3]!=='1'&&detailsCardsList[3]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[3]!=='1'&&detailsCardsList[3]!==undefined&&alarmCardList[3]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[3]!=='1'&&detailsCardsList[3]!==undefined&&alarmCardList[3]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[4]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[4]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[4]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[4]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[4]!=='1'&&detailsCardsList[4]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[4]!=='1'&&detailsCardsList[4]!==undefined&&alarmCardList[4]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[4]!=='1'&&detailsCardsList[4]!==undefined&&alarmCardList[4]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[5]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[5]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[5]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[5]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[5]!=='1'&&detailsCardsList[5]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[5]!=='1'&&detailsCardsList[5]!==undefined&&alarmCardList[5]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[5]!=='1'&&detailsCardsList[5]!==undefined&&alarmCardList[5]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[6]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[6]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[6]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[6]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[6]!=='1'&&detailsCardsList[6]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[6]!=='1'&&detailsCardsList[6]!==undefined&&alarmCardList[6]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[6]!=='1'&&detailsCardsList[6]!==undefined&&alarmCardList[6]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <div class="light">
                <span>
                  <img src="~@/assets/img/红闪.gif" v-if="detailsCardsList.length>0&&alarmCards.length>0" alt="">
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList.length>0&&alarmCards.length<=0" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/绿.png" v-if="detailsCardsList.length>0" alt="">
                </span>
              </div>
            </div>
            <div>
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList.length>0" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList.length>0" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[7]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[7]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[7]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[7]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[7]!=='1'&&detailsCardsList[7]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[7]!=='1'&&detailsCardsList[7]!==undefined&&alarmCardList[7]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[7]!=='1'&&detailsCardsList[7]!==undefined&&alarmCardList[7]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[8]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[8]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[8]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[8]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[8]!=='1'&&detailsCardsList[8]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[8]!=='1'&&detailsCardsList[8]!==undefined&&alarmCardList[8]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[8]!=='1'&&detailsCardsList[8]!==undefined&&alarmCardList[8]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[9]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[9]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[9]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[9]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[9]!=='1'&&detailsCardsList[9]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[9]!=='1'&&detailsCardsList[9]!==undefined&&alarmCardList[9]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[9]!=='1'&&detailsCardsList[9]!==undefined&&alarmCardList[9]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[10]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[10]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[10]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[10]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[10]!=='1'&&detailsCardsList[10]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[10]!=='1'&&detailsCardsList[10]!==undefined&&alarmCardList[10]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[10]!=='1'&&detailsCardsList[10]!==undefined&&alarmCardList[10]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[11]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[11]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[11]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[11]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[11]!=='1'&&detailsCardsList[11]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[11]!=='1'&&detailsCardsList[11]!==undefined&&alarmCardList[11]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[11]!=='1'&&detailsCardsList[11]!==undefined&&alarmCardList[11]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[12]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[12]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[12]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[12]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[12]!=='1'&&detailsCardsList[12]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[12]!=='1'&&detailsCardsList[12]!==undefined&&alarmCardList[12]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[12]!=='1'&&detailsCardsList[12]!==undefined&&alarmCardList[12]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[13]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[13]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[13]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[13]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[13]!=='1'&&detailsCardsList[13]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[13]!=='1'&&detailsCardsList[13]!==undefined&&alarmCardList[13]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[13]!=='1'&&detailsCardsList[13]!==undefined&&alarmCardList[13]==='1'" alt="">
                </span>
              </div>
            </div>
            <div>
              <img src="~@/assets/img/RLT-6600SD_1.png" v-if="detailsCardsList[14]==='1'" alt="">
              <img src="~@/assets/img/RLT-6600SD_2.png" v-else-if="detailsCardsList[14]==='2'" alt="">
              <img src="~@/assets/img/RLT-6600SD_3.png" v-else-if="detailsCardsList[14]==='3'" alt="">
              <img src="~@/assets/img/RLT-6600SD_4.png" v-else-if="detailsCardsList[14]==='4'" alt="">
              <div class="light">
                <span>
                  <img src="~@/assets/img/绿闪.gif" v-if="detailsCardsList[14]!=='1'&&detailsCardsList[14]!==undefined" alt="">
                </span>
                <span>
                  <img src="~@/assets/img/白.png" v-if="detailsCardsList[14]!=='1'&&detailsCardsList[14]!==undefined&&alarmCardList[14]==='0'" alt="">
                  <img src="~@/assets/img/红.png" v-else-if="detailsCardsList[14]!=='1'&&detailsCardsList[14]!==undefined&&alarmCardList[14]==='1'" alt="">
                </span>
              </div>
            </div>
          </div>
          <div class="powerWrap">
           <span>
             <img src="~@/assets/img/绿.png" v-if="detailsCardsList.length>0" alt="">
           </span>
           <span>
             <img src="~@/assets/img/红.png" v-if="detailsCardsList.length>0&&alarmCardList[15]==='1'" alt="">
             <img src="~@/assets/img/白.png" v-if="detailsCardsList.length>0&&alarmCardList[15]==='0'" alt="">
           </span>
            <span>
            <img src="~@/assets/img/绿.png" v-if="detailsCardsList.length>0" alt="">
           </span>
            <span>
            <img src="~@/assets/img/白.png" v-if="detailsCardsList.length>0" alt="">
           </span>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header">
          <span>板卡列表：</span>
        </div>
        <div>
          <el-table
            :data="detailsCards"
            style="width: 100%;">
<!--            <el-table-column-->
<!--              type="index"-->
<!--              header-align="center"-->
<!--              align="center"-->
<!--              label="序号"-->
<!--              width="50">-->
<!--            </el-table-column>-->
            <el-table-column
              type="index"
              header-align="center"
              align="center"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="cardTypeName"
              header-align="center"
              align="center"
              label="板卡型号">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-dialog>
    <!--采集sn ip-->
    <el-dialog title="网元ID查询" :visible.sync="setIdVisible" :close-on-click-modal="false" class="getId">
      <el-form :model="setIdForm" ref="setIdForm" label-width="70px" v-loading="dataListLoading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="setIdForm.serialNumber" autocomplete="off" placeholder="序列号" class="snInput"></el-input>&nbsp;&nbsp;<el-button type="primary" @click="getSN()" :disabled="serData.length <= 0">采集</el-button>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="IP" prop="IP">
          <el-input v-model="setIdForm.IP" autocomplete="off" placeholder="IP" class="ipInput"></el-input>&nbsp;&nbsp;<el-button type="primary" @click="getIP()" :disabled="this.setIdForm.serialNumber === ''">采集</el-button>
        </el-form-item>
        <el-form-item label="Mask" prop="Mask">
          <el-input v-model="setIdForm.Mask" autocomplete="off" placeholder="Mask" class="ipInput"></el-input>&nbsp;&nbsp;<el-button type="primary" @click="setIP()">设置</el-button>
        </el-form-item>
        <el-form-item label="Gateway" prop="Gateway">
          <el-input v-model="setIdForm.Gateway" autocomplete="off" placeholder="Gateway" class="ipInput"></el-input>
        </el-form-item>
      </el-form>
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="setIdVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="userRoleSubmit()">确 定</el-button>-->
<!--      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './info-add-or-update'
export default {
  name: 'info',
  data () {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataFormSearch: {
        deviceName: ''
      },
      setUserRoleVisible: false,
      userRoleForm: {
        serialNumber: '',
        userName: ''
      },
      detailsVisible: false,
      detailsForm: {
        deviceName: '',
        serialNumber: ''
      },
      detailsCards: [],
      // 存储1~15个板卡序号列表
      detailsCardsList: [],
      alarmCards: [],
      alarmCardList: [],
      setIdVisible: false,
      setIdForm: {
        serialNumber: '',
        IP: '',
        Mask: '',
        Gateway: ''
      },
      // 采集sn 序号
      ser: 0,
      serData: []
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/dev/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'devName': this.dataFormSearch.deviceName
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
    addOrUpdateHandle (devSn) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(devSn)
      })
    },
    // 删除
    deleteHandle (sn) {
      let sns = sn ? [sn] : this.dataListSelections.map(item => {
        return item.devSn
      })
      this.$confirm(`您确定要删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/dev/del'),
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
    // 用户权限分配设置
    userRoleSubmit () {

    },
    // 授权
    empower (id) {
      this.setUserRoleVisible = true
    },
    // 点名测试
    nameTestHandle (devSn) {
      this.dataListLoading = true
      let that = this
      this.nameTest(devSn).then(function (data) {
        that.dataListLoading = false
        if (data.code === 0) {
          that.$message({
            message: '设备在线',
            type: 'success',
            onClose: () => {
              that.getDataList()
            }
          })
        } else {
          that.$message({
            message: '设备不在线',
            type: 'warning',
            onClose: () => {
              that.getDataList()
            }
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error',
          onClose: () => {
            that.getDataList()
          }
        })
        that.dataListLoading = false
      })
    },
    // 详情
    detailsHandle (devSn, devName) {
      this.detailsCardsList = []
      this.alarmCardList = []
      this.detailsVisible = true
      this.detailsForm.deviceName = devName
      this.detailsForm.serialNumber = devSn
      this.dataListLoading = true
      let that = this
      this.getDeviceDetails(devSn).then(function (data) {
        that.dataListLoading = false
        that.detailsCards = data.info.cards
        let index = that.detailsCards.findIndex((item) => {
          return item.cardId > 7
        })
        let temp = that.detailsCards.splice(-2)
        that.detailsCards.splice(index, 0, temp[0], temp[1])
        that.alarmCards = data.info.alramCards || []
        if (that.detailsCards && that.detailsCards.length > 0) {
          for (let i = 1; i <= 15; i++) {
            let tempEachArr = that.detailsCards.find(function (item) {
              return item.cardId === i
            })
            if (tempEachArr === undefined) {
              that.detailsCardsList.push('1')
            } else if (tempEachArr.cardTypeCode.includes('80')) {
              that.detailsCardsList.push('2')
            } else if (tempEachArr.cardTypeCode.includes('93')) {
              that.detailsCardsList.push('3')
            } else if (tempEachArr.cardTypeCode.includes('07')) {
              that.detailsCardsList.push('4')
            }
          }
        }
        if (that.alarmCards && that.alarmCards.length > 0) {
          for (let i = 1; i <= 17; i++) {
            let tempEachArr = that.alarmCards.find(function (item) {
              return item === i
            })
            if (tempEachArr === undefined) {
              that.alarmCardList.push('0')
            } else {
              that.alarmCardList.push('1')
            }
          }
        } else {
          for (let i = 1; i <= 17; i++) {
            that.alarmCardList.push('0')
          }
        }
      })
    },
    // 设备详情强制刷新
    refreshHandle () {
      this.detailsCardsList = []
      this.alarmCardList = []
      this.detailsCards = []
      this.dataListLoading = true
      let that = this
      this.refreshData(this.detailsForm.serialNumber).then(function () {
        that.getDeviceDetails(that.detailsForm.serialNumber).then(function (data) {
          that.dataListLoading = false
          that.detailsCards = data.info.cards
          let index = that.detailsCards.findIndex((item) => {
            return item.cardId > 7
          })
          let temp = that.detailsCards.splice(-2)
          that.detailsCards.splice(index, 0, temp[0], temp[1])
          that.alarmCards = data.info.alramCards || []
          if (that.detailsCards && that.detailsCards.length > 0) {
            for (let i = 1; i <= 15; i++) {
              let tempEachArr = that.detailsCards.find(function (item) {
                return item.cardId === i
              })
              if (tempEachArr === undefined) {
                that.detailsCardsList.push('1')
              } else if (tempEachArr.cardTypeCode.includes('80')) {
                that.detailsCardsList.push('2')
              } else if (tempEachArr.cardTypeCode.includes('93')) {
                that.detailsCardsList.push('3')
              } else if (tempEachArr.cardTypeCode.includes('07')) {
                that.detailsCardsList.push('4')
              }
            }
          }
          if (that.alarmCards && that.alarmCards.length > 0) {
            for (let i = 1; i <= 17; i++) {
              let tempEachArr = that.alarmCards.find(function (item) {
                return item === i
              })
              if (tempEachArr === undefined) {
                that.alarmCardList.push('0')
              } else {
                that.alarmCardList.push('1')
              }
            }
          } else {
            for (let i = 1; i <= 17; i++) {
              that.alarmCardList.push('0')
            }
          }
        })
      }).catch((err) => {
        that.$message({
          message: err.msg,
          type: 'error',
          duration: 2000,
          onClose: () => {
            that.dataListLoading = false
          }
        })
      })
    },
    // 采集 设置Id
    setIdHandle () {
      this.ser = 0
      this.serData = []
      this.setIdVisible = true
      this.dataListLoading = true
      let that = this
      this.$nextTick(() => {
        this.$refs['setIdForm'].resetFields()
        this.getSnData().then(function (data) {
          console.log(data)
          that.dataListLoading = false
          localStorage.setItem('serData', data.sn.join(','))
          that.serData = data.sn
        }).catch(function (err) {
          that.$message({
            message: err.msg,
            type: 'error'
          })
          that.dataListLoading = false
        })
      })
    },
    // 采集sn
    getSN () {
      let storageData = localStorage.getItem('serData').split(',')
      let length = storageData.length
      if (this.ser >= length) {
        this.ser = 0
      }
      this.setIdForm.serialNumber = storageData[this.ser]
      this.ser++
    },
    // 采集IP
    getIP () {
      this.dataListLoading = true
      let that = this
      this.getIdData(this.setIdForm.serialNumber).then(function (data) {
        that.dataListLoading = false
        that.setIdForm.IP = data.gIp.ip
        that.setIdForm.Gateway = data.gIp.gateway
        that.setIdForm.Mask = data.gIp.mask
      })
    },
    // 设置IP
    setIP () {
      this.dataListLoading = true
      let that = this
      this.setIdData().then(function (data) {
        that.dataListLoading = false
        if (data && data.code === 0) {
          that.$message({
            message: '设置成功',
            type: 'success'
          })
        }
      }).catch(function (err) {
        that.$message({
          message: err.msg,
          type: 'error'
        })
        that.dataListLoading = false
      })
    },
    // 获取设备详情信息
    getDeviceDetails (devSn) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/info'),
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
    // 获取sn信息
    getSnData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/sn'),
          method: 'get',
          params: this.$http.adornParams({
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            resolve(data)
          } else {
          }
        })
      })
    },
    // 获取id信息
    getIdData (devSn) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/gIp'),
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
    // 设置id信息
    setIdData () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/mIp'),
          method: 'post',
          data: this.$http.adornData({
            'devSn': this.setIdForm.serialNumber,
            'ip': [this.setIdForm.IP],
            'mask': this.setIdForm.Mask,
            'gateway': this.setIdForm.Gateway
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
    // 强制刷新
    refreshData (devSn) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl(`/dev/force?sn=${devSn}`),
          method: 'post',
          data: this.$http.adornData({
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
    // 获取点名测试数据
    nameTest (devSn) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/manueOnline'),
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
    }
  }
}
</script>
<style lang="scss" scoped>
.detailContainer {
  position: relative;
}
.powerWrap {
  position: absolute;
  width: 130px;
  height: 245px;
  top:63px;
  right:123px;
  span {
    position: absolute;
    &:nth-child(1) {
      top:21px;
      left:45px;
    }
    &:nth-child(2) {
      top:28px;
      left:45px;
    }
    &:nth-child(3) {
      top:21px;
      left:110px;
    }
    &:nth-child(4) {
      top:28px;
      left:110px;
    }
  }
}
.cardWrap {
  position: absolute;
  width: 580px;
  height: 245px;
  top:63px;
  left:34px;
  display: flex;
  justify-content: space-between;
   div {
     width: 30px;
     position: relative;
     .light {
       position: absolute;
       top: 22px;
       left: 8px;
       height: 4px;
       img {
         width:5px;
         height:5px;
       }
     }
     img {
       height: 100%;
       width: 100%;
     }
     &:nth-child(8) {
       // visibility: hidden;
     }
     &:nth-child(9) {
       // visibility: hidden;
     }
     &:nth-child(10) {
       margin-left: 2px;
     }
   }

}
</style>
<style>
.snInput.el-input {
  width: 80%;
}
.getId .el-dialog {
  width: 30%;
}
.ipInput.el-input {
  width: 80%;
}
</style>
