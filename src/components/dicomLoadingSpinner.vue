<template>
  <div class="zy-dicom-spinner">
    <div class="zy-dicom-spinner-item1"></div>
    <div class="zy-dicom-spinner-item2"></div>
    <div class="zy-dicom-spinner-item3"></div>
    <div class="zy-dicom-spinner-item4"></div>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: function() {
        return 'No Dicom File'
      }
    },
  },
}
</script>
<style lang="less" scoped>
@dicomSpinnerItemSize: 12px;
.zy-dicom-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  height: @dicomSpinnerItemSize * 2;
  width: @dicomSpinnerItemSize * 2;
  margin-top: -@dicomSpinnerItemSize;
  margin-left: -@dicomSpinnerItemSize;
  /* -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg); */
  -webkit-animation: zy-dicom-spinner 1.5s infinite;
  animation: zy-dicom-spinner 1.5s infinite;
}

.zy-dicom-spinner>div {
  width: @dicomSpinnerItemSize;
  height: @dicomSpinnerItemSize;
  background-color: #ccc;
  float: left;
}

.zy-dicom-spinner-item1 {
  -webkit-animation: zy-dicom-spinner-item1 1.5s infinite;
  animation: zy-dicom-spinner-item1 1.5s infinite;
}

.zy-dicom-spinner-item2 {
  -webkit-animation: zy-dicom-spinner-item2 1.5s infinite;
  animation: zy-dicom-spinner-item2 1.5s infinite;
}

.zy-dicom-spinner-item3 {
  -webkit-animation: zy-dicom-spinner-item3 1.5s infinite;
  animation: zy-dicom-spinner-item3 1.5s infinite;
}

.zy-dicom-spinner-item4 {
  -webkit-animation: zy-dicom-spinner-item4 1.5s infinite;
  animation: zy-dicom-spinner-item4 1.5s infinite;
}

@-webkit-keyframes zy-dicom-spinner {
  100% {
    -webkit-transform: rotate(-90deg);
  }
}

@keyframes zy-dicom-spinner {
  100% {
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
  }
}

@-webkit-keyframes zy-dicom-spinner-item1 {
  25% {
    -webkit-transform: translate(0, -15px) rotate(-180deg);
  }
  100% {
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}

@keyframes zy-dicom-spinner-item1 {
  25% {
    transform: translate(0, -15px) rotate(-180deg);
    -webkit-transform: translate(0, -15px) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) rotate(-180deg);
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}


@-webkit-keyframes zy-dicom-spinner-item2 {
  25% {
    -webkit-transform: translate(15px, 0) rotate(-180deg);
  }
  100% {
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}

@keyframes zy-dicom-spinner-item2 {
  25% {
    transform: translate(15px, 0) rotate(-180deg);
    -webkit-transform: translate(15px, 0) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) rotate(-180deg);
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}

@-webkit-keyframes zy-dicom-spinner-item3 {
  25% {
    -webkit-transform: translate(-15px, 0) rotate(-180deg);
  }
  100% {
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}

@keyframes zy-dicom-spinner-item3 {
  25% {
    transform: translate(-15px, 0) rotate(-180deg);
    -webkit-transform: translate(-15px, 0) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) rotate(-180deg);
    -webkit-transform: rtranslate(0, 0) rotate(-180deg);
  }
}


@-webkit-keyframes zy-dicom-spinner-item4 {
  25% {
    -webkit-transform: translate(0, 15px) rotate(-180deg);
  }
  100% {
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}

@keyframes zy-dicom-spinner-item4 {
  25% {
    transform: translate(0, 15px) rotate(-180deg);
    -webkit-transform: translate(0, 15px) rotate(-180deg);
  }
  100% {
    transform: translate(0, 0) rotate(-180deg);
    -webkit-transform: translate(0, 0) rotate(-180deg);
  }
}
</style>

