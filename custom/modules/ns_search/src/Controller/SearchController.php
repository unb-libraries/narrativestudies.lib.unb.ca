<?php

namespace Drupal\ns_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Controller for the reference search pages.
 */
class SearchController extends ControllerBase {

  /**
   * Displays the reference search.
   */
  public function references() {
    return $this->search(FALSE);
  }

  /**
   * Displays the advanced reference search.
   */
  public function referencesAdvanced() {
    return $this->search(TRUE);
  }

  /**
   * Builds a reference search page.
   *
   * The search form is a block; this provides the results, which the search
   * library renders in the browser.
   *
   * @param bool $advanced
   *   Whether this is the advanced search page.
   *
   * @return array
   *   A render array.
   */
  protected function search($advanced) {
    $data = ns_search_data();

    if (!$data) {
      throw new NotFoundHttpException();
    }

    return [
      '#theme' => 'ns_search_results',
      '#advanced' => $advanced,
      '#attached' => [
        'library' => ['ns_search/search'],
        // Lets crawlers that do not run scripts, such as web archives, find
        // the data the search loads.
        'html_head_link' => [
          [
            [
              'rel' => 'preload',
              'href' => $data['url'],
              'as' => 'fetch',
              'crossorigin' => 'anonymous',
            ],
            FALSE,
          ],
        ],
        'drupalSettings' => [
          'nsSearch' => [
            'dataUrl' => $data['url'],
          ],
        ],
      ],
    ];
  }

}
