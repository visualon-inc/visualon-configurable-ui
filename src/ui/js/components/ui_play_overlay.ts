import UIContainer from './ui_container';

class UIPlayOverlay extends UIContainer {
  private vopPlayOverlay_: HTMLElement;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-play-overlay-container');

    this.initChildren();
  }

  initChildren() {
    this.vopPlayOverlay_ = document.createElement('div');
    this.vopPlayOverlay_.setAttribute('class', 'vop-play-overlay');
    this.vopPlayOverlay_.addEventListener('mouseup', this.onPlayOverlayClick.bind(this));
    this.element_.appendChild(this.vopPlayOverlay_);
  }

  onPlayOverlayClick(e) {
    e.stopPropagation()
    let result = this.player_.play();
    if (result && (typeof Promise !== 'undefined') && (result instanceof Promise)) {
      result.then(function(){console.log('play successfully')}).catch(function(error){console.log(error)});
    }
  }
}

export default UIPlayOverlay;