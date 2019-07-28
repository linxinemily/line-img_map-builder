<template>
  <v-app>
    <template>
      <v-container grid-list-md>
        <h1 class="mt-10 mb-10 text-center">LINE IMGMAP BUILDER</h1>
        <!-- <v-btn
          class="mt-12"
          @click="dialog = !dialog"
        >
          設定欄和列
        </v-btn>
        <v-dialog
          class="mb-12"
          v-model="dialog"
          max-width="400"
        >
          <v-card>
            <v-card-title class="headline grey lighten-2">設定欄和列</v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
              <v-select
                :items="columnItems"
                filled
                label="橫列個數"
                item-value="num"
                item-text="num"
                v-model="customColumn"
              ></v-select>
              <v-text-field
                v-model="customGap"
                label="按鈕間距"
                class="mt-0 pt-0"
                type="number"
                suffix="px"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="green darken-1"
                text
                @click="SetColumnsRows"
              >
                確定
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
        <v-layout wrap>
          <v-flex xs6>
            <button @click.self="downloadImg" color="primary" class="mb-5 self_btn mb-5 self_btn v-btn v-btn--contained theme--light v-size--default primary">匯出圖片
              <a class="no_css" ref="link" style="visibility: hidden;"></a>
            </button>
            <div
              ref="btnsImg"
              class="grid"
              :style="{ 'grid-template-columns': columnPrefixer(customColumn), 'grid-gap':  pxSubfixer(customGap) }"
            >
                <div
                  class="grid-cell"
                  :style="{ 'background-color': styleOptions.bgc, 'border-radius': pxSubfixer(styleOptions.bdrs)}"
                  v-for="(item, index) in items "
                  :key="index"
                >
                  <input type="text" v-model="item.text">
                </div>
            </div>
          </v-flex>
          <v-flex xs6 d-flex justify-center>
            <v-card max-width="450px" min-width="400px">
              <v-card-text>
                <v-select
                  :items="columnItems"
                  label="橫列個數"
                  class="mt-4 pt-4"
                  item-value="num"
                  item-text="num"
                  v-model="customColumn"
                ></v-select>
                <v-text-field
                  v-model="customGap"
                  label="按鈕間距"
                  class="mt-4 pt-4"
                  type="number"
                  suffix="px"
                ></v-text-field>
                <v-text-field
                  v-model="itemsNum"
                  label="按鈕個數"
                  type="number"
                  class="mt-4 pt-4"
                ></v-text-field>
                <v-text-field
                  v-model="styleOptions.bgc"
                  label="按鈕顏色"
                  class="mt-4 pt-4"
                ></v-text-field>
                <v-text-field
                  v-model="styleOptions.bdrs"
                  label="按鈕圓角"
                  type="number"
                  class="mt-4 pt-4"
                  suffix="px"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import Vue from 'vue'
import html2canvas from 'html2canvas';
Vue.use(html2canvas)
export default {
  name: 'App',
  components: {
    // HelloWorld,
  },
  data: () => ({
    columnItems: [ 2, 3, 4 ],
    customColumn: 3,
    items: [],
    dialog: false,
    templateGap: 10,
    customGap: 10,
    templateColumns: `repeat(3, 1fr)`,
    itemsNum: 6,
    styleOptions: {
      bgc: '#eee',
      bdrs: 4
    },
    bgcColorPicker: false
  }),
  created() {
    for (let i = 0; i < this.itemsNum; i ++){
      this.items.push({
        text: '按鈕' + (i + 1)
      })
    }
  },
  watch: {
    itemsNum(val, oldVal) {
      let currenLastIdx = this.items.length + 1
      if (val > oldVal) {
        const increaseNum = val - oldVal
        for (let i = 0; i < increaseNum; i ++){
          this.items.push({
            text: '按鈕' + currenLastIdx
          })
          currenLastIdx ++
        }
      } else {
        const decreaseNum = oldVal - val
        for (let i = 0; i < decreaseNum; i ++){
          this.items.splice(this.items.length - 1, decreaseNum)
        }
      }
    }
  },
  methods: {
    SetColumnsRows() {
      this.templateColumns = `repeat(${this.customColumn}, 1fr)`
      this.dialog = false
      this.templateGap = this.customGap + 'px'
    },
    pickBgcColor() {
      this.bgcColorPicker = !this.bgcColorPicker
    },
    pxSubfixer(val) {
      return val + 'px'
    },
    columnPrefixer(val) {
      return 'repeat(' + val + ', 1fr)'
    },
    downloadImg(){
        const dom = this.$refs.btnsImg;
        const link = this.$refs.link
        html2canvas(dom, { width: dom.clientWidth, backgroundColor: 'transparent' })
          .then(function(canvas) {
            const url = canvas.toDataURL("image/png")
            link.href = url
            link.target = "_blank"
            link.download = 'IMGMAP'
            link.click()
          })
    },
    // domtoimageload(canvas, el) {
    //     // const base64 = canvas.toDataURL("image/png")
    //     el.target.href = canvas.toDataURL("image/png")
    //     el.target = "_blank"
    //     el.download = 'IMGMAP'
    // }
  }
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-gap: 8px;
  background-color: transparent;
  grid-template-columns: repeat(3, 1fr);
  &-cell {
    background-color: #eee;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      text-align: center;
      &:focus {
        outline: none;
      }
    }
  }
}

@media (min-width: 0) {
  .flex.xs6 {
    min-width: initial;
  }

}
.no_css {
  color: #fff;
  text-decoration-line: none;
}
</style>

