var playerContainer_;
var cfg_;
var sourceCfg_;
var context_ = {
  flag: 'main'
};
var player_ = null;
var playerUI_ = null;


cfg_ = {
  // Please ask AE for an valid client key.
  key: '',
  width: '100%',
  height: '100%',
  playback: {
    autoPlay: true
  },
  logs: {
    logToConsole: true
  }
};

sourceCfg_ = {
  links: [{
    uri: 'https://vm2.dashif.org/dash/vod/testpic_2s/multi_subs.mpd',
    type: 'dash'
  }]
};

function onBtnOpen() {
  // open a link
  player_.open(sourceCfg_);
}

window.onload = function () {
  playerContainer_ = document.getElementById('player-container');
  // build player
  player_ = new voPlayer.Player(playerContainer_);
  player_.addPlugin(voPlayer.voAdsPlayerPlugin);
  player_.init(cfg_);

  // attach ui engine
  playerUI_ = new voPlayer.UIEngine(player_);
  playerUI_.buildUI();
};