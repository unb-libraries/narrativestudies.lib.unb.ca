<?php

/**
 * @file
 * Contains script to delete all bibliographic data.
 */

// Temporarily increase memory allowance.
ini_set('memory_limit', '1024M');

$entities = ['keyword', 'contributor', 'reference'];

foreach ($entities as $type) {
  $storage = \Drupal::entityTypeManager()->getStorage("bibcite_{$type}");
  while (1) {
    $ids = $storage->getQuery()->range(0, 100)->execute();
    print "{$type}: " . count($ids) . "\n";
    if (empty($ids)) {
      break;
    }
    $storage->delete($storage->loadMultiple($ids));
  }
}
