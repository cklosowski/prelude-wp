jQuery(function($) {
  'use strict';

  var isTouchDevice;

  // Touch Device Detection
  isTouchDevice = 'ontouchstart' in document.documentElement;

  if (isTouchDevice) {
    $('body').removeClass('no-touch');
  }
});
