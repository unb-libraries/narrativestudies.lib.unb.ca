<?php

/**
 * @file
 * Contains TextAuthor.php.
 */

namespace Drupal\ns_author\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;

/**
 * Field handler to add a text author to bibcite reference views.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("text_author")
 */
class TextAuthor extends FieldPluginBase {

  /**
   * @{inheritdoc}
   */
  public function query() {
    // Leave empty to avoid adding field to query.
  }

  /**
   * @{inheritdoc}
   */
   public function render(ResultRow $values) {
    $node = $values->_entity;
    // kint($node->get('author')->getValue());
    return $this->t('TEST');
  }
}
