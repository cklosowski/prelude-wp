<?php
function prelude_theme_scripts() {
  // CSS
  wp_enqueue_style( 'prelude', get_theme_file_uri( '/assets/css/theme.min.css' ), array(), filemtime( get_theme_file_path( '/assets/css/theme.min.css' ) ) );

  // JS
  wp_enqueue_script( 'prelude', get_theme_file_uri( '/assets/js/theme.min.js' ), array('jquery'), filemtime( get_theme_file_path( '/assets/js/theme.min.js' ) ), true );

  if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
    wp_enqueue_script( 'comment-reply' );
  }
}
add_action( 'wp_enqueue_scripts', 'prelude_theme_scripts' );
