import * as PIXI from 'pixi.js'
import {
  META
} from './config'


// function randomColor() {
//   let letters = '0123456789ABCDEF'
//   let color = '0x'
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)]
//   }
//   return parseInt(color)
// }

/**
 * loading ui
 */
export default class Loading extends PIXI.Container {

  /**
   * @param {object} options   
   * @param {boolean} options.progress is to show the progress text
   */
  constructor(options) {
    super()

    this.options = Object.assign({
      progress: true
    }, options)

    //angle of the arc
    let arcAngle = Math.PI * 0.2

    //gap angle
    let gapAngle = Math.PI * 0.05

    //offset angle, graphics start  from 3 o'clock
    let offsetAngle = -arcAngle * 0.5

    //radius of the angle
    let radius = 80

    //background mask
    let bg = new PIXI.Graphics()
    bg.moveTo(0, 0)
    bg.beginFill(0x000000, 0.8)
    bg.drawRect(-META.width / 2, -META.height / 2, META.width, META.height)
    bg.interactive = true
    this.addChild(bg)

    //create 8 arcs
    for (let i = 0; i < 8; i++) {
      let arc = new PIXI.Graphics()
      arc.lineStyle(16, 0xffffff, 1, 0.5)
      let startAngle = offsetAngle + gapAngle * i + arcAngle * i
      let endAngle = startAngle + arcAngle
      arc.arc(0, 0, radius, startAngle, endAngle)
      this.addChild(arc)
    }

    //create ratating arc
    let mask = new PIXI.Graphics()
    this.addChild(mask)

    if (this.options.progress) {
      this.indicatorText = new PIXI.Text('0%', new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: '#ffffff',
      }))

      this.indicatorText.anchor.set(0.5)
      this.addChild(this.indicatorText)
    }

    let maskIndex = 0

    this.timer = setInterval(() => {
      mask.clear()
      mask.lineStyle(16, 0x000000, 0.5, 0.5)
      let startAngle = offsetAngle + gapAngle * maskIndex + arcAngle * maskIndex
      let endAngle = startAngle + arcAngle
      mask.arc(0, 0, radius, startAngle, endAngle)
      maskIndex = (maskIndex + 1) % 8
    }, 100)
  }

  /**
   * set progress text
   * @param {number} newValue
   */
  set progress(newValue) {
    if (this.options.progress) {
      this.indicatorText.text = `${newValue}%`
    }
  }

  destroy() {
    clearInterval(this.timer)
    super.destroy(true)
  }
}