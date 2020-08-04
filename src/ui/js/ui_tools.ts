import { ProgressInfo, ProgressInfoObj } from './common';

const UITools:any = {};

UITools.genGradientColor = function(posList, colorList) {
  let totalRange = posList[posList.length - 1];

  let gradient = ['to right'];
  for (let i = 0; i < posList.length; ++i) {
    let range = posList[i] * 100 / totalRange;

    if (i === 0) {
      gradient.push(colorList[0] + ' 0%');
      gradient.push(colorList[0] + ' ' + range + '%');
    } else {
      let lastRange = posList[i - 1] * 100 / totalRange;
      gradient.push(colorList[i] + ' ' + lastRange + '%');
      gradient.push(colorList[i] + ' ' + range + '%');
    }
  }

  return 'linear-gradient(' + gradient.join(',') + ')';
};

UITools.getProgressInfo = function(player) {
  let position = player.getPosition();
  let duration = player.getDuration();
  let live = player.isLive();
  let range = player.getSeekableRange();
  let videoBufferLength = player.getValidBufferDuration('video');
  let audioBufferLength = player.getValidBufferDuration('audio');
  let validBufferLength = Math.min(
      !isNaN(videoBufferLength) ? videoBufferLength : Number.MAX_VALUE,
      !isNaN(audioBufferLength) ? audioBufferLength : Number.MAX_VALUE);

  if (live) {
    position = position - range.start;
    // If position is out of the range of dvr window, set it to 0.
    if (position < 0) {
      position = 0;
    }
    duration = range.end - range.start;
  }

  let info: ProgressInfo = {
    position: position,
    duration: duration,
    live: live,
    range: range,
    validBufferLength: validBufferLength
  };

  return info;
};

function formatTime(time) {
  return time < 10 ? '0' + time.toString() : time.toString();
}

UITools.TimeToString = function (value) {
  value = Math.max(value, 0);
  let h = Math.floor(value / 3600);
  let m = Math.floor((value % 3600) / 60);
  let s = Math.floor((value % 3600) % 60);
  return (h === 0 ? '' : formatTime(h) + ':') + formatTime(m) + ':' + formatTime(s);
}

export default UITools;
