<template>
  <div>
    <!-- bridger -->
  </div>
</template>
<script>
export default {
  mounted () {
    window.addEventListener('storage', this.handleLocalstorage, false)
    window.addEventListener('message', this.handleReceiveMsg, false)
  },
  methods: {
    handleLocalstorage (event) {
      let data = JSON.parse(event.newValue)
      if (event.key === 'messge' && ['reportToViewer', 'viewerToReport'].includes(data.type)) {
        window.parent.postMessage(JSON.parse(event.newValue), '*')
      }
    },
    handleReceiveMsg (event) {
      let { data } = event
      if (['reportToViewer', 'viewerToReport'].includes(data.type)) {
        this.handleBroadcast(data)
      }
    },
    handleBroadcast (msg) {
      // console.log('bridage listened msg')
      localStorage.setItem('messge', JSON.stringify(msg))
      localStorage.removeItem('message')
    }
  }
}
</script>
