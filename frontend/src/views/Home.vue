<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <QrCode msg="Scan QrCode using Whatsapp in your phone and keep it on"/>
  </div>
</template>

<script>
// @ is an alias to /src
import QrCode from '@/components/QrCode.vue'

export default {
  name: 'Home',
  components: {
    QrCode
  }
}
</script>
