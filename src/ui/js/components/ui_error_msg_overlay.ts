import UIComponent from './ui_component';
import UITvNoiseCanvas from './ui_tvnoise_canvas';

class UIErrorMsgOverlay extends UIComponent {
  private onClosed_: any;
  private onError_: any;
  private onHdcpPolicy_: any;
  private vopTvNoiseCanvas_: any;
  private vopErrorMsgText_: any;
  private tvNoiseCanvas_: any;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-error-msg-overlay');

    this.vopTvNoiseCanvas_ = document.createElement('canvas');
    this.vopTvNoiseCanvas_.setAttribute('class', 'vop-tvnoise-canvas');

    this.vopErrorMsgText_ = document.createElement('span');
    this.vopErrorMsgText_.setAttribute('class', 'vop-error-msg-text');

    this.element_.appendChild(this.vopTvNoiseCanvas_);
    this.element_.appendChild(this.vopErrorMsgText_);

    this.tvNoiseCanvas_ = new UITvNoiseCanvas({ element: this.vopTvNoiseCanvas_, parent: this.element_ });
    this.addEventListeners();
  }

  destroy() {
    super.destroy();
    this.removeEventListeners();
  }

  addEventListeners() {
    // super.addPlayerListeners();//has added in super()
    this.onClosed_ = this.onClosed.bind(this);
    this.onError_ = this.onError.bind(this);
    this.onHdcpPolicy_ = this.onHdcpPolicy.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onClosed_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_ERROR_EVENTS, this.onError_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_HDCP_POLICY, this.onHdcpPolicy_);
  }

  removeEventListeners() {
    super.removePlayerListeners();
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onClosed_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_ERROR_EVENTS, this.onError_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_HDCP_POLICY, this.onHdcpPolicy_);
    this.onClosed_ = null;
    this.onError_ = null;
  }
  onHdcpPolicy(payload) {
    if (payload) {
      if (payload.restricted === true) {
        this.startNoiseCanvas('<p style="font-size:2em">HDCP POLICY: DRM content is restricted on this machine!</p>');
      }else if (payload.restricted === false) {
        this.reset();
      }
    }
  }

  onPlayerOpenFinished() {
    this.reset();
  }

  onClosed() {
    this.reset();
  }

  reset() {
    if (this.element_.style.display === 'block') {
      this.tvNoiseCanvas_.stop();
    }

    this.element_.style.display = 'none';
  }

  onError(e) {
    var errCode = '0x' + (e.code.toString(16)).toUpperCase();
    // return if it is not a fatal error
    switch (errCode) {
      case (window as any).voPlayer.errorCode.VO_OSMP_LICENSE_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_FORMAT_UNSUPPORT:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_CODEC_UNSUPPORT:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_BROWSER_UNSUPPORT_MSE:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_MANIFEST_DOWNLOAD_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_MANIFEST_PARSE_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_CONTENT_DOWNLOAD_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_CONTENT_PARSE_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_DRM_ERR_BROWSER_UNSUPPORT:
      case (window as any).voPlayer.errorCode.VO_OSMP_DRM_ERR_KEY_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_DRM_ERR_KEY_SESSION_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_DRM_ERR_LICENSE_REQUEST_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_DRM_ERR_SELECT_KEY_SYSTEM_FAIL:
      case (window as any).voPlayer.errorCode.VO_OSMP_SRC_ERR_SOURCE_BUFFER_ERROR:
      case (window as any).voPlayer.errorCode.VO_OSMP_DRM_ERR_HDCP_RESTRICTED:
        break;
      default:
        return;
        break;
    }

    var errId = 'ERROR: ' + errCode;
    var errMsg = e.message;
    this.startNoiseCanvas('<strong>' + errId + '<\/strong>' + '<br\/>' + errMsg);
  }
  
  startNoiseCanvas(errMsg) {
    this.vopErrorMsgText_.innerHTML = errMsg;
    this.element_.style.display = 'block';
    this.tvNoiseCanvas_.start();
    // not use Animation on smart TV
    if (this.uaInfo_.isWebApp) this.tvNoiseCanvas_.stop();
  }
}

export default UIErrorMsgOverlay;
