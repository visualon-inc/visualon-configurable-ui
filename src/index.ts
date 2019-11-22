import UIEngine from './ui/js/ui_engine';

declare global {
  interface Window { voPlayer: any; }
}

window.voPlayer = window.voPlayer || {};
window.voPlayer.UIEngine = UIEngine;

declare const module: any;
module.exports = window.voPlayer;





