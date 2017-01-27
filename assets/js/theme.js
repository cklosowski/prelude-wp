'use strict';

jQuery(function($) {
  var isTouchDevice;

  // Touch Device Detection
  isTouchDevice = 'ontouchstart' in document.documentElement;

  if (isTouchDevice) {
    $('body').removeClass('no-touch');
  }
});
