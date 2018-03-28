<?php

namespace Drupal\ns_navigation\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Controller for Narrative Studies navigation.
 */
class NsNavigationController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function archives() {
    return new TrustedRedirectResponse('https://www.lib.unb.ca/archives/');
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

  /**
   * {@inheritdoc}
   */
  public function about() {
    $element = [
      '#theme' => 'ns_about',
      '#attributes' => [],
    ];
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function user() {
    return new RedirectResponse("/");
  }
}
