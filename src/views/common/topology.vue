<template>
  <div class="home-container">
    <!--width,height 画布的宽度，高度。 可以是百分比或像素，一般在dom元素上设置 -->
    <div id='network_id' class="network" style="height: 700px;"></div>
    <!--设备详情-->
    <el-dialog title="详情" :visible.sync="detailsVisible" :close-on-click-modal="false" class="detailDialog">
      <el-card class="box-card" v-loading="dataListLoading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
        <div class="detailContainer">
          <el-form :inline="true" :model="detailsForm" size="mini" ref="detailsForm">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="detailsForm.deviceName" autocomplete="off" placeholder="设备名称"></el-input>
            </el-form-item>
            <el-form-item label="序列号" prop="serialNumber">
              <el-input v-model="detailsForm.serialNumber" autocomplete="off" placeholder="序列号"></el-input>
            </el-form-item>
            <el-form-item label="状态" >
              <el-input  v-model="detailsForm.ifOnline" placeholder="状态" readonly></el-input>
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
  </div>
</template>
<script>
import Vis from 'vis'
let network
export default {
  components: {
  },
  data () {
    return {
      nodesList: [],
      edgesList: [],
      //   节点数组
      nodesArrayList: [
        {
          'label': '网管平台',
          'id': '11a',
          'shape': 'image',
          'image': require('@/assets/img/tuopu1.png'),
          'size': 40,
          'color': {
            background: '#D9001B'
          },
          'title': '我是主设备'
        },
        {
          'label': '通信中心主1',
          'id': 111
        },
        {
          'label': '成都局',
          'id': 110
        },
        {
          'label': '北京局',
          'id': 112
        },
        {
          'label': '通信中心备1',
          'id': 121
        },
        {
          'label': '上海局',
          'id': 122
        },
        {
          'label': '通信中心主2',
          'id': 131
        },
        {
          'label': '兰州局',
          'id': 132
        },
        {
          'label': '通信中心备2',
          'id': 141

        },
        {
          'label': '武汉局',
          'id': 142
        },
        {
          'label': '沈阳局',
          'id': 148
        }
      ],
      //   关系线数组
      edgesArrayList: [
        {
          'from': '131',
          'to': 148
        },
        {
          'from': '141',
          'to': 148
        },
        {
          'from': '111',
          'to': 110
        },
        {
          'from': '121',
          'to': 110
        },
        {
          'from': '141',
          'to': 132
        },
        {
          'from': '131',
          'to': 142
        },
        {
          'from': '121',
          'to': 112
        },
        {
          'from': '11a',
          'to': 111
        },
        {
          'from': '11a',
          'to': 121
        },
        {
          'from': '11a',
          'to': 131
        },
        {
          'from': '11a',
          'to': 141
        },
        {
          'from': 111,
          'to': 112
        },
        {
          'from': 111,
          'to': 122
        },
        {
          'from': 112,
          'to': 113
        },
        {
          'from': 113,
          'to': 114
        },
        {
          'from': 114,
          'to': 115
        },
        {
          'from': 121,
          'to': 122
        },
        {
          'from': 122,
          'to': 123
        },
        {
          'from': 123,
          'to': 124
        },
        {
          'from': 131,
          'to': 132
        },
        {
          'from': 132,
          'to': 133
        },
        {
          'from': 133,
          'to': 134
        },
        {
          'from': 134,
          'to': 135
        },
        {
          'from': 141,
          'to': 142
        },
        {
          'from': 142,
          'to': 143
        },
        {
          'from': 143,
          'to': 144
        },
        {
          'from': 144,
          'to': 145
        },
        {
          'from': 145,
          'to': 146
        }
      ],
      detailsVisible: false,
      dataListLoading: false,
      detailsForm: {
        deviceName: '',
        serialNumber: '',
        ifOnline: ''
      },
      detailsCards: [],
      // 存储1~15个板卡序号列表
      detailsCardsList: [],
      alarmCards: [],
      alarmCardList: []
    }
  },
  mounted () {
    let that = this
    this.getTopology().then(function (data) {
      that.nodesList = data.res.sn_name
      that.edgesList = data.res.tpl
      that.nodesList = that.nodesList.map(function (item) {
        return {
          id: item.devSn,
          label: item.devName,
          flag: true
        }
      })
      that.edgesList = that.edgesList.map(function (item) {
        return {
          from: item.parentFromSn,
          to: item.devToSn
        }
      })
      that.init()
    })
  },
  methods: {
    // 初始化拓扑图
    init () {
      let container = document.getElementById('network_id')
      let data = { nodes: this.nodesList, edges: this.edgesList }
      let options = {
        autoResize: true, // 网络将自动检测其容器的大小调整，并相应地重绘自身
        height: '100%',
        width: '100%',
        locale: 'cn', // 语言设置：工具栏显示中文
        // 设置节点样式
        nodes: {
          // shape: 'square', // 节点的外观。为circle时label显示在节点内，为dot时label显示在节点下方
          shape: 'image',
          image: require('@/assets/img/tuopu.jpg'),
          // fixed: false, // 节点node固定不可移动
          size: 30, // 节点的大小，
          shadow: false, // 如果为true，则节点使用默认设置投射阴影。  13810357650
          font: {
            // 字体配置
            size: 12,
            color: '#000',
            align: 'center'
          },
          color: {
            border: 'transparent', // 节点边框颜色
            background: '#ffc7c7', // 节点背景颜色
            highlight: {
              // 节点选中时状态颜色
              border: 'rgb(117, 218, 167)',
              background: 'rgb(117, 218, 167)'
            },
            hover: {
              // 节点鼠标滑过时状态颜色
              border: '#dff9fb',
              background: '#88dab1'
            }
          },
          margin: 5, // 当形状设置为box、circle、database、icon、text；label的边距
          widthConstraint: 200, // 设置数字，将节点的最小和最大宽度设为该值,当值设为很小的时候，label会换行，节点会保持一个最小值，里边的内容会换行
          borderWidth: 1, // 节点边框宽度，单位为px
          borderWidthSelected: 3, // 节点被选中时边框的宽度，单位为px
          labelHighlightBold: false // 确定选择节点时标签是否变为粗体
        },
        // 边线配置
        edges: {
          width: 2,
          length: 200,
          font: {
            align: 'top' // 连接线文字位置
          },
          color: {
            color: '#848499',
            highlight: 'rgb(117, 218, 167)',
            hover: '#88dab1',
            inherit: 'from',
            opacity: 1.0
          },
          smooth: {
            // 设置两个节点之前的连线的状态
            enabled: true // 默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
          }
          // arrows: { to: true } // 箭头指向to
        },
        // 用于所有用户与网络的交互。处理鼠标和触摸事件以及导航按钮和弹出窗口
        interaction: {
          hover: true, // 鼠标移过后加粗该节点和连接线
          hoverConnectedEdges: true, // 鼠标滑动节点后是否显示连接线
          dragNodes: false, // 是否能拖动节点
          dragView: true, // 是否能拖动画布
          selectConnectedEdges: false // 选择节点后是否显示连接线
        },
        layout: {
          // 以分层方式定位节点
          hierarchical: {
            direction: 'UD', // 分层排序方向
            sortMethod: 'directed', // 分层排序方法
            levelSeparation: 1600, // 不同级别之间的距离
            nodeSpacing: 200 // 自由轴上节点间的最小距离
          }
        },
        // 计算节点之前斥力，进行自动排列的属性
        physics: {
          enabled: false, // 默认是true，设置为false后，节点将不会自动改变，拖动谁谁动。不影响其他的节点
          maxVelocity: 20,
          minVelocity: 0.1
        }
      }
      network = new Vis.Network(container, data, options)
      // 鼠标点击事件
      network.on('doubleClick', (e) => {
        // 通过nodes：[],来判断是节点还是线
        // 如果nodes是空则是线，反之则是节点
        if (e.nodes.length !== 0) {
          let that = this
          let sn = e.nodes[0]
          this.getModifyData(sn).then(function (data) {
            console.log(data)
            if (data.sim.dev.online) {
              that.detailsForm.ifOnline = '在线'
            } else {
              that.detailsForm.ifOnline = '离线'
            }
          })
          this.getDeviceRole(sn).then(function (data) {
            console.log(data)
            if (!data.flag) return
            let temp = that.nodesList.find(function (item) {
              return item.id === sn
            })
            let name = temp.label
            that.detailsHandle(sn, name)
          })
        } else {
        }
      })
      // 悬停在节点上显示弹窗
      // network.on('hoverNode', (e) => {
      //   let c = ''
      //   data.nodes.forEach(i => {
      //     if (i.id === e.node) {
      //       c = i
      //     }
      //   })
      //   let ul = ''
      //   if (c.type === 'File') {  // 文件
      //     ul = '<ul>' + '<li>我是文件</li>' + '</ul>'
      //   } else {   // 项目
      //     ul = '<ul>' + '<li>我是项目</li>' + '</ul>'
      //   }
      //   let divHoverNode = document.getElementById('divHoverNode')
      //   divHoverNode.innerHTML = ul
      //   divHoverNode.style = `display:block;left: ${e.event.offsetX + 15}px;top: ${e.event.offsetY + 15}px`
      // })
      // // 离开节点
      // network.on('blurNode', () => {
      //   let divHoverNode = document.getElementById('divHoverNode')
      //   divHoverNode.innerHTML = ''
      //   divHoverNode.style = `display:none;`
      // })
      // 拖拽节点
      network.on('oncontext', (e) => { // 右击触发此事件
      })
    },
    // 获取设备下拉列表信息(设备sn)
    getTopology () {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/tpl/all'),
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
        console.log(data)
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
          console.log(data)
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
    // 获取设备权限信息
    getDeviceRole (devSn) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/tpl/isView'),
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
    // 获取修改信息
    getModifyData (devSn) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/dev/sim'),
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
  top:50px;
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
<style scoped>
/*.home-container {*/
/*  height: 800px;*/
/*  width: 1658px;*/
/*  background-image: url("~@/assets/img/tuopu.jpg");*/
/*}*/

</style>
