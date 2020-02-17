class UITvNoiseCanvas {
  private context_: any;
  private canvasElement_: any;
  private canvasContext_: any;
  private interferenceHeight_: any;
  private lastFrameUpdate_: any;
  private frameInterval_: any;
  private useAnimationFrame_: any;
  private frameUpdateHandlerId_: any;

  private renderFrame_ = this.renderFrame.bind(this);
  constructor(context) {
    this.context_ = context;
    this.canvasElement_ = this.context_.element;
    this.canvasContext_;
    this.interferenceHeight_ = 50;
    this.lastFrameUpdate_ = 0;
    this.frameInterval_ = 60;
    this.useAnimationFrame_ = !!window.requestAnimationFrame;
    this.frameUpdateHandlerId_;

    this.renderFrame_ = this.renderFrame.bind(this);
  }

  start() {
    this.canvasContext_ = this.canvasElement_.getContext('2d');
    this.lastFrameUpdate_ = 0;

    this.renderFrame_();
  }

  stop() {
    if (this.useAnimationFrame_) {
      cancelAnimationFrame(this.frameUpdateHandlerId_);
    } else {
      clearTimeout(this.frameUpdateHandlerId_);
    }
  }

  renderFrame() {
    // This code has been copied from the player controls.js and simplified

    if (this.lastFrameUpdate_ + this.frameInterval_ > new Date().getTime()) {
      // It's too early to render the next frame
      this.scheduleNextRender();
      return;
    }

    let currentPixelOffset;
    let canvasWidth_ = this.canvasElement_.clientWidth;
    let canvasHeight_ = this.canvasElement_.clientHeight;
    let noiseAnimationWindowPos_ = -canvasHeight_;

    if (canvasWidth_ == 0) {
        canvasWidth_ = document.getElementById('player-container').clientWidth;
        canvasHeight_ = document.getElementById('player-container').clientHeight;
    }

    // Create texture
    let noiseImage = this.canvasContext_.createImageData(canvasWidth_, canvasHeight_);

    // Fill texture with noise
    for (let y = 0; y < canvasHeight_; y++) {
      for (let x = 0; x < canvasWidth_; x++) {
        currentPixelOffset = (canvasWidth_ * y * 4) + x * 4;
        noiseImage.data[currentPixelOffset] = Math.random() * 255;
        if (y < noiseAnimationWindowPos_ || y > noiseAnimationWindowPos_ + this.interferenceHeight_) {
          noiseImage.data[currentPixelOffset] *= 0.85;
        }
        noiseImage.data[currentPixelOffset + 1] = noiseImage.data[currentPixelOffset];
        noiseImage.data[currentPixelOffset + 2] = noiseImage.data[currentPixelOffset];
        noiseImage.data[currentPixelOffset + 3] = 50;
      }
    }

    // Put texture onto canvas
    this.canvasContext_.putImageData(noiseImage, 0, 0);

    this.lastFrameUpdate_ = new Date().getTime();
    noiseAnimationWindowPos_ += 0;
    if (noiseAnimationWindowPos_ > canvasHeight_) {
      noiseAnimationWindowPos_ = -canvasHeight_;
    }

    this.scheduleNextRender();
  }

  scheduleNextRender() {
    if (this.useAnimationFrame_) {
      this.frameUpdateHandlerId_ = window.requestAnimationFrame(this.renderFrame_);
    } else {
      this.frameUpdateHandlerId_ = setTimeout(this.renderFrame_, this.frameInterval_);
    }
  }
};

export default UITvNoiseCanvas;
