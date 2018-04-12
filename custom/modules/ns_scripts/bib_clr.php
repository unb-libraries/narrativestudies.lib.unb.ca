<?php

/**
 * @file
 * Contains script to delete all bibliographic data.
 */

// Temporarily increase memory allowance.
ini_set('memory_limit', '1024M');

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
  ->range(0, 100)
  ->execute();

while ($query) {
  entity_delete_multiple('bibcite_reference', $query);

  $query = \Drupal::entityQuery('bibcite_reference')
    ->range(0, 100)
    ->execute();
}
