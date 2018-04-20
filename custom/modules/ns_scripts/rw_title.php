<?php

/**
 * @file
 * Contains script to truncate long RefWorks titles from BibTex export.
 */

// Open BibTex file.
$file = file_get_contents('../modules/custom/ns_scripts/cirn-EndNote-bibtex-2.txt');
$results = [];
preg_match_all('/title = {(.*?)}/', $file, $results);

foreach ($results as $result) {
  foreach ($result as $res) {
    if (!strpos($res, '=')) {
      $file = str_replace($res, substr($res, 0, 255), $file);
    }
  }
}

$results = [];
preg_match_all('/url = {(.*?)}/', $file, $results);

foreach ($results as $result) {
  foreach ($result as $res) {
    if (!strpos($res, '=')) {
      $file = str_replace($res, substr($res, 0, 255), $file);
    }
  }
}

echo $file;
file_put_contents('../modules/custom/ns_scripts/cirn-EndNote-bibtex-2OUT.txt',
  $file);
