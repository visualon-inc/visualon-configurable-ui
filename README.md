# VisualOn HTML5 Player UI


# Introduction

This repository contains the VisualOn Player UI framework.
It's designed as a modularized layer of the player UI.

## Setup

After cloning or pulling from the repository, first of all, make sure your local node-modules are up-to-date with the package deps:

```
npm install
```

## Build system (Webpack)

### Build debug version:
```
npm run dev
```
The output debug files are "voplayer-ui.debug.js" and "voplayer-ui.debug.css", they will be output in the path of "../tmpplugin/build".

### Build release version:
```
npm run build
```
The output release files are "voplayer-ui.min.js" and "voplayer-ui.min.css", they will be output in the path of "../tmpplugin/build".

## Sample codes
A simple example on how to use the configrable UI with our default skin are in the path of "samples/simple".
* samples/simple/index.html

Include the ui files in the html file: 
```js
  <!-- player ui sdk -->
  <link href="./voplayer-ui.min.css" rel="stylesheet" />
  <script src="./voplayer-ui.min.js"></script>
```

* samples/simple/js/main.js

After the player is created, build the UI module to player:
```js
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
```

## License
[MIT License](/LICENSE)
