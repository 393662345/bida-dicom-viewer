import * as ZyineConstants from '@/common/ZyineConstants.js'
import Utils from './utils.js'
import Formatters from './formatters.js'

/**
 * renders.js
 * 自定义渲染列，
 * 使用 Vue 的 Render 函数。
 * 传入两个参数，第一个是 h，第二个为对象，
 */
export default {

  /**
   * //紧急
   * @param {*} h 
   * @param {*} object 
   */
  renderUrgentOfTable(h, object) {
    var fmtText = Formatters.formatUrgent(object.urgent ? object.urgent : 'P')
    object._urgent_text = fmtText
    return h('div', {class: 'zy-urgency'},
    [
      h('span', {class: ['dot', object.urgent == 'J' ? 'urgent' : "normal"]}),
      h('span', {class: ''}, fmtText ? fmtText : '普')
    ])
  },

  
  /**
   * 诊断医师，带有催诊提示按钮
   * @param {*} h 
   * @param {*} object 
   * @param {*} func 
   */
  renderUrgeDoctorOfTable(h, object, func) {
    let iconClass = func ? 'ivu-icon ivu-icon-md-alarm' : null
    return h('div', {class: 'zy-diag-doctor'},
    [
      h('span', {class: 'doctor-name'}, object.reportUserName),
      h('a', {
          attrs: {
            title: '诊断提醒'
          },
          on:{
            click:()=>{
              if(func && func instanceof Function){
                func(object)
              }
            }
          }
        }, [
        h('i', {class: iconClass})
      ])
    ])
  },

  /**
   * 渲染进度条
   */
  renderProgressBar(h, object) {
    return h('Progress', 
      {
        class: 'zy-progress',
        props: {
          status: 'active',
          percent : 65
        }
      }
    )
  },

  /**
   * 设备显示 颜色区分
   * @param {*} h 
   * @param {*} object 
   */
  renderModalityWithColor(h, object) {
    const thisColor = object && object.modality ? Utils.getMainColorOfModality(object.modality) : null
    // console.log("thisColor", thisColor);
    return h('div', 
      {
        class: 'zy-modality-color',
        style : thisColor ? { backgroundColor: thisColor} : {}
      },
      [object.modality]
    )
  },

  /**
   * 检查内容渲染
   * @param {*} h 
   * @param {*} object 
   * @param {*} func 
   */
  renderStudyTypeOfTable(h, object, vm, editFunc, compareFunc) {
    let loginUser = vm ? vm.$store.state.login.user : null
    let tobeConfirm = object && !Utils.isObjectBlank(object.partModifier) && loginUser && loginUser.userZid != object.partModifier
    let iconClass = editFunc ? 'iconfont icon-xiugai zy-icon-edit' : null
    if(tobeConfirm){
      iconClass = compareFunc ? 'ivu-icon ivu-icon-alert zy-icon-alert' : null
    }
    return h('div', {class: 'zy-table-study-content'},
    [
      h('span', {class: 'study-content'}, object.studyType),
      h('a', {
          attrs: {
            title: tobeConfirm ? '存在修改' : '修改'
          },
          style: {
            display: object && object.status == 'S5' ? 'none' : 'inline-block'
          },
          on:{
            click:()=>{
              if(tobeConfirm){
                if(compareFunc && compareFunc instanceof Function){
                  compareFunc(object)
                }
              } else {
                if(editFunc && editFunc instanceof Function){
                  editFunc(object)
                }
              }
            }
          }
        }, [
        h('i', {class: iconClass})
      ])
    ])
  },

  //消息 标题
  renderMessageTitleOfTable(h, message, func) {
    return h('a', 
      {
        class: 'showDetail zy-table-message-title',
        on:{
          click:()=>{
            if(func && func instanceof Function){
              func(message)
            }
          }
        }
      },
      [
        h('span', {class: ['dot', message.status == 'N' ? 'blue' : "lucency"]}),
        h('span', {class: '', }, message.title)
      ]
    )
  },

  renderModalityEditable(h, object, modalities, changedHandler){
    modalities = modalities || []
    if(object._editing){
      return h('Select',{
        props: {
          value: object.modality,
          placeholder: '选择类型'
        },
        on: {
          'on-change': e => {
            object.modality = e
            if(changedHandler && changedHandler instanceof Function){
              changedHandler(object)
            }
          }
        },
      }, modalities.map(item => {
        return h('Option',{
          props: {
            value: item.value
          }
        }, item.text)
      }))
    } else {
      return h('div',object.modality)
    }
  },

  renderStudyOfficeEditable(h, object, offices){
    offices = offices || []
    if(object._editing){
      return h('Select',{
        props: {
          value: object.studyOfficeZid,
          placeholder: '选择科室'
        },
        on: {
          'on-change': e => {
            object.studyOfficeZid = e
            let t = Utils.getFirstElementByFilter(offices, 'zid', object.studyOfficeZid)
            object.studyOfficeName = t ? t.name : null
          }
        },
      }, offices.map(item => {
        return h('Option',{
          props: {
            value: item.zid
          }
        }, item.name)
      }))
    } else {
      return h('div', object.studyOfficeName)
    }
  },

  renderStudyRoomEditable(h, object, rooms, changedHandler){
    rooms = rooms || []
    if(object._editing){
      return h('Select',{
        props: {
          value: object.studyRoomZid,
          placeholder: '选择机房'
        },
        on: {
          'on-change': e => {
            object.studyRoomZid = e
            // let t = Utils.getFirstElementByFilter(rooms, 'zid', object.studyRoomZid)
            // object.studyRoomZid = t ? t.name : null
            if(changedHandler && changedHandler instanceof Function){
              changedHandler(object)
            }
          }
        },
      }, rooms.map(item => {
        return h('Option',{
          props: {
            value: item.zid
          }
        }, item.name)
      }))
    } else {
      return h('div', object.studyRoomZid)
    }
  },

  renderStudyDeviceEditable(h, object, devices){
    devices = devices || []
    if(object._editing){
      return h('Select',{
        props: {
          value: object.studyDeviceZid,
          placeholder: '选择设备'
        },
        on: {
          'on-change': e => {
            object.studyDeviceZid = e
            let t = Utils.getFirstElementByFilter(devices, 'zid', object.studyDeviceZid)
            object.studyDeviceZid = t ? t.name : null
          }
        },
      }, devices.map(item => {
        return h('Option',{
          props: {
            value: item.zid
          }
        }, item.name)
      }))
    } else {
      return h('div', object.studyDeviceZid)
    }
  },

  renderStudyAppointTimeEditable(h, object){
    if(object._editing){
      object._studyAppointTime = object.studyAppointTime ? new Date(object.studyAppointTime) : new Date()
      return h('DatePicker',{
        props: {
          value: object._studyAppointTime,
          placeholder: '检查日期',
          type: 'date',
          clearable: false,
          options:{
            //不能选择今天之前的时间
            disabledDate (date) {return date && date.valueOf() < Date.now() - 86400000},
          }
        },
        on: {
          'on-change': e => {
            object.studyAppointTime = e
          }
        },
      })
    }else{
      return h('div', object.studyAppointTime)
    }
  },

  // renderStudyBodyPartEditable(h, object, changedHandler){
  //   let hospitalZid = object.hospitalZid
  //   let bodyPartList = object._feeParts || [] //可选的收费的检查部位
  //   object.studyPartZids = object.studyPartZids || []
  //   if(object._editing){
  //     return h('Select',{
  //       props: {
  //         value: object.studyPartZids,
  //         placeholder: '选择部位项目',
  //         multiple: true,
  //         loading: object._feePartsLoading,
  //       },
  //       on: {
  //         'on-change': e => {
  //           object.studyPartZids = e
  //           // console.log('object.studyPartZids', e)
  //           if(changedHandler && changedHandler instanceof Function){
  //             changedHandler(object)
  //           }
  //         }
  //       },
  //     }, bodyPartList.map(item =>{
  //       return h('Option', {
  //         props: {
  //           value: item.studyPartZid,
  //           label: item.studyPartName,
  //         }
  //       }, [
  //         h('span', item.studyPartName),
  //         h('span', {style: {
  //           color: '#ccc',
  //           float: 'right',
  //           marginRight: '20px',
  //         }}, '¥'+Formatters.formatMoney(item.studyFee)),
  //       ])
  //     }))
  //   }else{
  //     return h('div', object.studyPartStr)
  //   }
  // },

  renderStudyBodyPartEditable(h, object, bodyPartList, usedBodyPart, changedHandler){
    // let hospitalZid = object.hospitalZid
    // let bodyPartList = object._feeParts || [] //可选的收费的检查部位
    bodyPartList = bodyPartList?bodyPartList:[]
    let bodyPartFilter =  bodyPartList.filter(bodyPart => {
      return usedBodyPart.indexOf(bodyPart.studyPartZid) == -1
    })
    object.studyBodyPart = object.studyBodyPart || ''
    if(object._editing){
      return h('Select',{
        props: {
          value: object.studyBodyPart,
          placeholder: '选择部位项目',
          loading: object._feePartsLoading,
        },
        on: {
          'on-change': e => {
            object.studyBodyPart = e
            if(changedHandler && changedHandler instanceof Function){
              changedHandler(object)
            }
          }
        },
      }, bodyPartFilter.map(item =>{
        return h('Option', {
          props: {
            value: item.studyPartZid,
            label: item.studyPartName,
          }
        }, [
          h('span', item.studyPartName),
          h('span', {style: {
            color: '#ccc',
            float: 'right',
            marginRight: '20px',
          }}, '¥'+Formatters.formatMoney(item.studyFee)),
        ])
      }))
    }else{
      return h('div', object.partName)
    }
  },

  renderStudyFeeMoney(h, object){
    return h('div', Formatters.formatMoney(object.studyFee))
  },

  renderStudyBaseMoney(h, object){
    return h('div', Formatters.formatMoney(object.baseFee))
  },


  renderStudyRealMoney(h, object){
    if(object._editing){
      return h('input',{
        domProps: {
          value: object.realFee,
        },
        attrs: {
          placeholder: '实收费用',
        },
        class: {
          'zy-render-input' : true
        },
        style: {
          width: '100px'
        },
        on: {
          input: e => {
            object.realFee = e.target.value
          }
        }
      })
    }else{
      return h('div', Formatters.formatMoney(object.realFee))
    }
  },

  renderLoadingSpin(loadingText){
    return { render: (h) => {
        return h("div", [
          h("Icon", {
            class: "zy-spin-icon-loading",
            props: {
              type: "ios-loading",
              size: 24
            }
          }),
          h("div", loadingText)
        ]);
      }
    };
  },
  renderPrintStatus(h, object){
    if(object.studyStatus == 'S5' && object.reportStatus == 'R5' ){
      return h('div', '已打印')
    }else{
      return h('div', '未打印')
    }
  }
}