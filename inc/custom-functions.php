<?php
/**
 * Custom Functions
 */

/**
 * Debug some piece of code.
 * Remove the die; if you want the rest of the code on the page to execute
 *
 * @param $code The code that you want to check.
 */
function debug( $code ) {
  printf( '<pre>%s</pre>', print_r( $code, true ) );
  die;
}

// Get featured image as URL
function featuredURL( $size = 'full' ) {
  $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), $size );
  $url   = $thumb['0'];

  echo $url;
}

// Get featured image as URL and output style property
function featuredBG( $size = 'full', $pos_x = 'center', $pos_y = 'center', $repeat = 'no-repeat' ) {
  $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), $size );
  $url   = $thumb['0'];

  echo 'style="background: url(' . $url . ')' . $pos_x . ' ' . $pos_y . ' ' . $repeat . '"';
}

// Adds thumbnail support and additional thumbnail sizes
if ( function_exists( 'prelude_features' ) ) {
  // Use add_image_size below to add additional thumbnail sizes
}
