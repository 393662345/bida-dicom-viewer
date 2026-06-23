// const storageData = {
//     studyZid: this.targetStudyZid,
//     _t : Math.random()
// }
//localStorage key
const storageKey = 'STG_ZY_VIEWER' 

let storageData = {
  studyZid: this.targetStudyZid,
  _t : Math.random()
}

export default function LocalStorageManager(callback) {
  // localStorage.setItem(storageKey, initValue);
  window.addEventListener("storage", function (event) {
    const key = event.key
    const value = event.newValue
    // console.error("storage: " + event.key + "=" + event.newValue)
    if(key == storageKey){
      if(!value || value == 'close'){
        storageData = callback(null)
        window.opener=null
        window.close()
        event.preventDefault()
        return
      }
      const jsondata = value ? JSON.parse(value) : null
      storageData = callback(jsondata)
    }
  });
  window.onunload = function onunload_handler(){
    localStorage.removeItem(storageKey)
  }

  this.setItemData = function(data){
    localStorage.setItem(storageKey, data);
  }

  this.getItemData = function(){
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : null
  }
}