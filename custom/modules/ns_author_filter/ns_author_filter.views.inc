<?php

/**
 * @file
 * Contains ns_author_filter.views.inc
 */

/**
 * Implements hook_views_data_alter().
 */
function ns_author_filter_views_data_alter(&$data) {

  $data['bibcite_reference']['author_label'] = array(
    'title' => t('Author Label'),
    'help' => t('To use with filters.'), 
  );
  kint($data);

  /*
  $authors = $view->result[0]->_entity->get('author')->getValue();
  $author_id = $authors[0]['target_id'];

  $author_name = \Drupal::entityTypeManager()
    ->getStorage('bibcite_contributor')
    ->load($author_id);
  */
}
