<?php

/**
 * @file
 * Contains script to delete all bibliographic data.
 */

// Delete all keywords.
$query = \Drupal::entityQuery('bibcite_keyword')
  ->execute();
entity_delete_multiple('bibcite_keyword', $query);
// Delete all contributors.
$query = \Drupal::entityQuery('bibcite_contributor')
  ->execute();
entity_delete_multiple('bibcite_contributor', $query);
// Delete all references.
$query = \Drupal::entityQuery('bibcite_reference')
  ->execute();
entity_delete_multiple('bibcite_reference', $query);
