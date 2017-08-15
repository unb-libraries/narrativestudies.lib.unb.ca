<?php

/**
 * @file
 * Contains ns_author.views.inc.
 */

/**
 * Implements hook_views_data_alter().
 */
 function ns_author_views_data_alter(array &$data) {
   $data['bibcite_reference']['text_author'] = array(
     'title' => t('Text Author'),
     'field' => array(
       'title' => t('Text Author'),
       'help' => t('Provides a text author field for bibcite references.'),
       'id' => 'text_author',
     ),
   );
 }
