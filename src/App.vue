<template>
  <v-app>
    <template>
      <v-container grid-list-md>
        <h1 class="mt-10 mb-10 text-center">LINE IMGMAP BUILDER</h1>
        <v-dialog
          v-model="openUploadSuccessModal"
          width="500"
        >
          <v-card>
            <v-card-text>
              上傳圖片成功！可以複製下方的JSON到你的LINE bot當中囉！
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="openUploadSuccessModal = false"
              >
                確定
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-layout row>
          <v-flex xs6 lg7>
            <v-btn @click.self="downloadImg" color="primary" class="ma-2">
              <v-icon class="mr-1">save</v-icon> 另存圖片
              <a class="no_css" ref="link" style="visibility: hidden;"></a>
            </v-btn>
            <v-btn @click="uploadImg" :loading="loading" :disabled="loading" color="success" class="ma-2">
              <v-icon class="mr-1">cloud_upload</v-icon>上傳圖片
            </v-btn>
            <h4 class="title mt-3">圖片編輯</h4>
            <v-card outlined>
              <v-card-text>
                <div ref="btnsImgOuter">
                  <div
                    ref="btnsImg"
                    class="grid"
                    :style="{ 'grid-template-columns': columnPrefixer(customColumn), 'grid-gap':  pxSubfixer(customGap) }"
                  >
                    <div
                      class="grid-cell"
                      ref="cell"
                      :style="{ 
                          'background': btnBgColor,
                          'border-radius': pxSubfixer(borderRadius),
                          'color' : textColor,
                          'border-color': borderColor,
                          'border-width': pxSubfixer(borderWidth)
                        }"
                      v-for="(item, index) in items "
                      :key="index"
                    >
                      <input type="text" v-model="item.text">
                    </div>
                </div>
              </div>
              </v-card-text>
            </v-card>
            <h4 class="title mt-10">JSON資料</h4>
            <div style="position: relative;">
                <v-btn class="ma-2 copy_btn" @click="copyToClipboard">
                  複製到剪貼簿
                </v-btn>
                <v-textarea
                  ref="jsonData"
                  filled
                  height="400"
                  name="input-7-4"
                  :value="JSON.stringify(output, null, 4)"
                ></v-textarea>
            </div>
          </v-flex>
          <v-flex xs6 lg5 d-flex justify-center>
            <v-card max-width="450px" min-width="400px">
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs6>
                    <v-select
                      :items="columnItems"
                      label="橫列個數"
                      class="mt-4 pt-4"
                      item-value="num"
                      item-text="num"
                      v-model="customColumn"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="customGap"
                      label="按鈕間距"
                      class="mt-4 pt-4"
                      type="number"
                      suffix="px"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="itemsNum"
                      label="按鈕個數"
                      type="number"
                      class="mt-4 pt-4"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="borderRadius"
                      label="按鈕圓角"
                      type="number"
                      class="mt-4 pt-4"
                      suffix="px"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="borderWidth"
                      label="邊線寬度"
                      type="number"
                      class="mt-4 pt-4"
                      suffix="px"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <div>
                  <div>按鈕顏色</div>
                  <v-radio-group v-model="colorPickerMode" row>
                    <v-radio label="純色" value="single"></v-radio>
                    <v-radio label="漸層" value="gradient"></v-radio>
                  </v-radio-group>
                  <div class="color_picker--single" v-if="colorPickerMode === 'single'">
                     <div
                        class="color_picked_box"
                        @click="showBtnColorPicker = !showBtnColorPicker"
                      >
                        <div
                          class="color_picked_box-inner"
                          :style="{ 'background-color': singleBgColor }"
                        ></div>
                      </div>
                      <v-color-picker v-show="showBtnColorPicker" v-model="singleBgColor" mode="hexa"></v-color-picker>
                  </div>
                  <div class="color_picker--gradient" v-else>
                      <span>顏色 1</span>                      
                      <div
                        class="color_picked_box"
                        @click="showBtnGradientPicker_1 = !showBtnGradientPicker_1"
                      >
                        <div
                          class="color_picked_box-inner"
                          :style="{ 'background-color': gradientBgColor_1 }"
                        ></div>
                      </div>
                      <v-color-picker v-show="showBtnGradientPicker_1" v-model="gradientBgColor_1" mode="hexa"></v-color-picker>
                      <span>顏色 2</span>                      
                      <div
                        class="color_picked_box"
                        @click="showBtnGradientPicker_2 = !showBtnGradientPicker_2"
                      >
                        <div
                          class="color_picked_box-inner"
                          :style="{ 'background-color': gradientBgColor_2 }"
                        ></div>
                      </div>
                      <v-color-picker v-show="showBtnGradientPicker_2" v-model="gradientBgColor_2" mode="hexa"></v-color-picker>
                  </div>
                </div>
                <div class="mt-5 mb-5">
                  <div>字體顏色</div>
                  <div
                    class="color_picked_box"
                    @click="showTextColorPicker = !showTextColorPicker"
                  >
                    <div
                      class="color_picked_box-inner"
                      :style="{ 'background-color': textColor }"
                    ></div>
                  </div>
                  <v-color-picker v-show="showTextColorPicker" v-model="textColor" mode="hexa"></v-color-picker>
                </div>
                  <div>邊線顏色</div>
                  <div
                    class="color_picked_box"
                    @click="showBorderColorPicker = !showBorderColorPicker"
                  >
                    <div
                      class="color_picked_box-inner"
                      :style="{ 'background-color': borderColor }"
                    ></div>
                  </div>
                  <v-color-picker v-show="showBorderColorPicker" v-model="borderColor" mode="hexa"></v-color-picker>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </v-app>
</template>

<script>
import Vue from 'vue'
import domtoimage from 'dom-to-image';
import { setTimeout } from 'timers';
Vue.use(domtoimage)

export default {
  name: 'App',
  data: () => ({
    columnItems: [ 2, 3, 4 ],
    customColumn: 3,
    items: [],
    customGap: 10,
    itemsNum: 6,
    borderRadius: 4,
    showBtnColorPicker: false,
    showBtnGradientPicker_1: false,
    showBtnGradientPicker_2: false,
    singleBgColor: '#00b900',
    gradientBgColor_1: '#00b900',
    gradientBgColor_2: '#00ad00',
    showTextColorPicker: false,
    textColor: '#fff',
    showBorderColorPicker: false,
    borderColor: '#009300',
    borderWidth: 1,
    colorPickerMode: 'single',
    openUploadSuccessModal: false,
    output: {
      type: "imagemap", 
      baseUrl: "PROVIDE_URL_FROM_YOUR_SERVER", 
      altText: "This is an imagemap", 
      baseSize: {
        width: 1040, 
        height: 0
      }, 
      actions: []
    },
    loading: false
  }),
  mounted() {
    for (let i = 0; i < this.itemsNum; i ++){
      this.items.push({
        text: '按鈕' + (i + 1)
      })
    }
    this.$nextTick(() => {
      this.renderData()
    })
  },
  computed: {
    btnBgColor() {
      return this.colorPickerMode === 'single' ? this.singleBgColor : `linear-gradient(${this.gradientBgColor_1}, ${this.gradientBgColor_2})`
    }
  },
  watch: {
    itemsNum(val, oldVal) {
      let currenLastIdx = this.items.length + 1
      val = parseInt(val)
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
      
      this.$nextTick(() => {
        this.renderData()
      })
    }
  },
  methods: {
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
      const options = {
        style: {
          'transform': 'scale(2)',
          'transform-origin': 'top left'
        },
        width: 1040,
        height: dom.clientHeight * 2
      }
      domtoimage.toPng(dom, options)
        .then(function(url) {
          link.href = url
          link.target = "_blank"
          link.download = 'IMGMAP'
          link.click()
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.error('oops, something went wrong!', error);
        });
    },
    renderData() {
      this.output.actions = this.items.map((el, idx) => {
        return {
          type: "message", 
          area: {
            x: this.$refs.cell[idx].offsetLeft * 2,
            y: this.$refs.cell[idx].offsetTop * 2, 
            width: this.$refs.cell[idx].clientWidth * 2, 
            height: this.$refs.cell[idx].clientHeight * 2
          }, 
          text: "動作" + (idx + 1)
        }
      })
      this.output.baseSize.height = this.$refs.btnsImg.clientHeight * 2
    },
    copyToClipboard() {
      const jsonData = document.querySelector('.v-text-field__slot > textarea')
      jsonData.select()
      document.execCommand("copy")
    },
    uploadImg() {
      this.loading = true
      const dom = this.$refs.btnsImg;
      const options = {
        style: {
          'transform': 'scale(2)',
          'transform-origin': 'top left'
        },
        width: 1040,
        height: dom.clientHeight * 2
      }
      const self = this
      domtoimage.toPng(dom, options)
        .then(function(url) {
            let formData = new FormData();
            formData.append('image', url.split(',')[1]);
              (async() => {
                const { data } = await Vue.axios.post('https://api.imgur.com/3/image', 
                  formData
                ,{
                  headers: {
                    'content-type': 'multipart/form-data',
                  }
                })
                self.output.baseUrl = data.data.link
                self.openUploadSuccessModal = true
                self.loading = false
              })()          
          })
      
    }
  }
};
</script>

<style lang="scss">
body, html {
  font-family: 'PingFang SC.', '微軟正黑體'
}

#app {
  font-family: 'PingFang SC.', '微軟正黑體'
}

textarea {
  font-family: monospace !important;
}
.grid {
  position: relative;
  width: 520px;
  display: grid;
  grid-gap: 8px;
  background-color: transparent;
  grid-template-columns: repeat(3, 1fr);
  &-cell {
    border-style: solid;
    background-color: #eee;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      text-align: center;
      width: 100%;
      letter-spacing: 2px;
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

.color_picked_box {
  margin-right: 10px;
  border: 1px solid #eee;
  display: inline-block;
  &-inner {
    width: 28px;
    height: 20px;
    margin: 4px;
    border-radius: 2px;
  }
}
.copy_btn {
  position: absolute !important;
  right: 4px;
  top: 4px;
  z-index: 100;
}
</style>

