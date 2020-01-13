import * as PIXI from 'pixi.js'

import {
  throttle
} from 'throttle-debounce'

/**
 * extends the PIXI.Application
 * add custom reize function
 */
export default class Application extends PIXI.Application {

  /**
   * constructor
   * @param {jsonobject} options same as PIXI.Application constrctor options parameter
   * @param {*} viewRect the viewport area of the canvas
   */
  constructor(options, viewRect) {

    //to disable PIXI ResizePlugin to resize the canvas.
    options.resizeTo = undefined

    super(options)
    this.viewRect = viewRect

    //optimize the resize invoke rate
    window.addEventListener('resize', throttle(300, () => {
      this.autoResize(this.viewRect)
    }))
    window.addEventListener('orientationchange', throttle(300, () => {
      this.autoResize(this.viewRect)
    }))

    this.autoResize(this.viewRect)
  }

  /**
   * resize the canvas size and position to the center of the container 
   * fill the canvas to container widh constant game ratio(config.js meta.width/meta.height).
   * 
   * pixi default ResizePlugin will change the canvas.width and canvas.height,thus it can't scale the canvas only padding the rest blank
   */
  autoResize() {

    let viewRect = Object.assign({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }, this.viewRect)

    const defaultRatio = this.view.width / this.view.height
    const windowRatio = viewRect.width / viewRect.height

    let width
    let height

    //autofit by width or height
    if (windowRatio < defaultRatio) {
      width = viewRect.width
      height = viewRect.width / defaultRatio
    } else {
      height = viewRect.height
      width = viewRect.height * defaultRatio
    }

    let x = viewRect.x + (viewRect.width - width) / 2
    let y = viewRect.y + (viewRect.height - height) / 2

    //center the canvas to the father
    this.view.style.left = `${x}px`
    this.view.style.top = `${y}px`
    // this.view.style.left = viewRect.x + 'px'
    // this.view.style.top = viewRect.y + 'px'

    this.view.style.width = `${width}px`
    this.view.style.height = `${height}px`

    let autofitItems = document.querySelectorAll('.autofit')
    autofitItems.forEach(item => {
      item.style.left = `${x}px`
      item.style.top = `${y}px`
      item.style.width = `${width}px`
      item.style.height = `${height}px`
    })
  }
}