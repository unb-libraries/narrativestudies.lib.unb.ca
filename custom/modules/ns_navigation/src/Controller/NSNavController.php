<?php

namespace Drupal\ns_navigation\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Controller for Narrative Studies navigation.
 */
class NSNavController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function archives() {
    return new TrustedRedirectResponse('https://www.lib.unb.ca/archives/');
  }

  /**
   * {@inheritdoc}
   */
  public function user() {
    return new RedirectResponse("/");
  }

  /**
   * {@inheritdoc}
   */
  public function home() {
    $element = [
      '#theme' => 'ns_intro',
      '#attributes' => [],
    ];
    return $element;
  }

}
