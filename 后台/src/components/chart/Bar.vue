<template>
  <div>
    <p style="font-size:16px;margin:0;margin-bottom:10px;">{{ title }}</p>
    <v-chart :forceFit="true" :height="height" :data="dataSource" :scale="scale" :padding="padding">
      <v-tooltip/>
      <v-axis/>
      <v-bar position="x*y"/>
    </v-chart>
  </div>
</template>

<script>
  import { triggerWindowResizeEvent } from '@/utils/util'

  export default {
    name: 'Bar',
    props: {
      dataSource: {
        type: Array,
        required: true
      },
      yaxisText: {
        type: String,
        default: '趋势'
      },
      title: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: 300
      }
    },
    data() {
      return { padding: ['auto', 'auto', '20', '40'] }
    },
    computed: {
      scale() {
        return [{
          dataKey: 'y',
          alias: this.yaxisText
        }]
      }
    },
    mounted() {
      triggerWindowResizeEvent()
    }
  }
</script>
