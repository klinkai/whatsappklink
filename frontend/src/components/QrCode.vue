<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
            <qrcode-vue v-if="!ready" :value="qrCodeValue" size="300" level="H"></qrcode-vue>
            <div style="font-weight: bold;" v-if="ready">WhatsApp Ready</div><div v-else>WhatsApp Not Ready</div>
    </div>
</template>

<script>

  import QrcodeVue from 'qrcode.vue';


  export default {
    name: 'QrCode',
    data() {
        return {
          qrCodeValue: "",
          ready: false
        }
    },
    mounted() {
        this.refresh()
         this.interval = setInterval(() => this.refresh(), 1000);
    },
    components: {
      QrcodeVue,
    },
    props: {
      msg: String,
    },
    methods: {

      refresh() {
        this.getQrcode()
        this.getStatus()
      },

      getQrcode() {
        this.$axios.get(this.$apiConfig.getQrCodeUrl)
          .then(response => {
            this.qrCodeValue = response.data.qrCode
          }).catch(response => {
            console.log(response);
          });
      },
      getStatus() {
        this.$axios.get(this.$apiConfig.getStatusUrl)
          .then(response => {
            this.ready = response.data.ready
          }).catch(response => {
          console.log(response);
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
