import UIComponent from './ui_component';
import DOM from '../dom';

class UIBufferingOverlay extends UIComponent {
  private vopSpinnerContainer_: HTMLElement;
  private vopSpinnerRotator_: HTMLElement;
  private vopSpinnerLeft_: HTMLElement;
  private vopSpinnerCircle1_: HTMLElement;
  private vopSpinnerRight_: HTMLElement;
  private vopSpinnerCircle2_: HTMLElement;
  private vopPlayer_: HTMLElement;
  private onMediaPlaying_: any;
  private onMediaWaiting_: any;
  private onMediaClosed_: any;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-spinner');

    this.vopSpinnerContainer_ = document.createElement('div');
    this.vopSpinnerContainer_.setAttribute('class', 'vop-spinner-container');

    this.vopSpinnerRotator_ = document.createElement('div');
    this.vopSpinnerRotator_.setAttribute('class', 'vop-spinner-rotator');

    this.vopSpinnerLeft_ = document.createElement('div');
    this.vopSpinnerLeft_.setAttribute('class', 'vop-spinner-left');

    this.vopSpinnerCircle1_ = document.createElement('div');
    this.vopSpinnerCircle1_.setAttribute('class', 'vop-spinner-circle');

    this.vopSpinnerRight_ = document.createElement('div');
    this.vopSpinnerRight_.setAttribute('class', 'vop-spinner-right');

    this.vopSpinnerCircle2_ = document.createElement('div');
    this.vopSpinnerCircle2_.setAttribute('class', 'vop-spinner-circle');

    this.vopSpinnerLeft_.appendChild(this.vopSpinnerCircle1_);
    this.vopSpinnerRight_.appendChild(this.vopSpinnerCircle2_);
    this.vopSpinnerRotator_.appendChild(this.vopSpinnerLeft_);
    this.vopSpinnerRotator_.appendChild(this.vopSpinnerRight_);
    this.vopSpinnerContainer_.appendChild(this.vopSpinnerRotator_);

    this.element_.appendChild(this.vopSpinnerContainer_);
  }

  destroy() {
    super.destroy();
  }
}

export default UIBufferingOverlay;
