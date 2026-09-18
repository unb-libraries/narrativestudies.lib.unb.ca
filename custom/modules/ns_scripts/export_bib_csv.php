<?php

/**
 * @file
 * Contains script to export all bibcite_reference entities to CSV.
 *
 * Usage: drush scr modules/custom/ns_scripts/export_bib_csv.php > export.csv
 */

// Temporarily increase memory allowance.
ini_set('memory_limit', '1024M');

$columns = [
  'id',
  'type',
  'title',
  'bibcite_year',
  'text_author',
  'text_keyword',
  'bibcite_secondary_title',
  'bibcite_volume',
  'bibcite_issue',
  'bibcite_pages',
  'bibcite_publisher',
  'bibcite_isbn',
  'bibcite_issn',
  'bibcite_doi',
  'bibcite_url',
  'bibcite_citekey',
  'status',
];

$out = fopen('php://stdout', 'w');
fputcsv($out, $columns);

$storage = \Drupal::entityTypeManager()->getStorage('bibcite_reference');
$offset = 0;
$batch_size = 100;

while (1) {
  $ids = $storage->getQuery()->range($offset, $batch_size)->execute();
  if (empty($ids)) {
    break;
  }

  foreach ($storage->loadMultiple($ids) as $entity) {
    $row = [];
    foreach ($columns as $field) {
      if ($field === 'id') {
        $row[] = $entity->id();
        continue;
      }
      if ($field === 'type') {
        $row[] = $entity->bundle();
        continue;
      }
      $row[] = $entity->hasField($field) && !$entity->get($field)->isEmpty()
        ? $entity->get($field)->value
        : '';
    }
    fputcsv($out, $row);
  }

  $offset += $batch_size;
}

fclose($out);
