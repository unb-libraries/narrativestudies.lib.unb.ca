<?php

namespace Drupal\ns_navigation\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
   * Serves the pre-generated export of all references as a download.
   *
   * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
   *   The CSV export, sent as an attachment.
   */
  public function downloadReferences() {
    $file = ns_navigation_reference_export_file();

    if (!$file) {
      throw new NotFoundHttpException();
    }

    $response = new BinaryFileResponse($file);
    $response->headers->set('Content-Type', 'text/csv');
    $response->setContentDisposition(
      ResponseHeaderBag::DISPOSITION_ATTACHMENT,
      'narrative-studies-references.csv'
    );

    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function goHome() {
    return new RedirectResponse('/');
  }

}
