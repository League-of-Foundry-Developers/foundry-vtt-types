if (game instanceof Game) {
  game.settings.registerMenu('core', 'webrtc', {
    name: 'WEBRTC.Title',
    label: 'WEBRTC.MenuLabel',
    hint: 'WEBRTC.MenuHint',
    icon: 'fas fa-headset',
    type: AVConfig,
    restricted: false
  });
}
