<?php

namespace Drupal\ns_navigation\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Views;

/**
 * EditAddressesForm object.
 */
class EditAuthorsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ns_navifation_edit_authors_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $node = NULL) {
    $form = [];
    // List authors.
    $view = Views::getView('authors_for');
    $view->setDisplay('block_1');

    $here = \Drupal::service('path.current')->getPath();
    preg_match('/reference\/(.*)\/authors/', $here, $ref);
    $view->setArguments([$ref[1]]);
    $render = $view->render();
    $form['edit_ceremony_addresses_view'] = $render;

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  }

}
