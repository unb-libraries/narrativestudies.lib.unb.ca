<?php

namespace Drupal\ns_navigation\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a title block for the exposed global search form.
 *
 * @Block(
 *   id = "search_label",
 *   admin_label = @Translation("Search Label"),
 *   category = @Translation("Misc"),
 * )
 */
class SearchLabel extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $text = '<b>Search more than 9,000 items from the blibliography, ' .
      'including articles, books, essays, and videos.</b>';

    return [
      '#markup' => $this->t($text),
    ];
  }

}
