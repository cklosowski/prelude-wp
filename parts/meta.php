<?php
/**
 * Template file for displaying blog post meta-data
 */
?>

<div class="meta">
  <span><?php the_time( 'F jS, Y' ); ?></span>
  <?php
  if ( comments_open() ) :
    echo sprintf('| <span>%s<span>', comments_popup_link( 'No Comments Yet', '1 Comment', '', 'comments-link', 'No Comments Allowed' ));
  endif;
  ?>
</div>
