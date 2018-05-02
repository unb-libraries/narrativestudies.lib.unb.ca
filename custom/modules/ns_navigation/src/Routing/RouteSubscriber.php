<?php

namespace Drupal\ns_navigation\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    // Modify restricted routes.
    if ($route = $collection->get('entity.user.edit_form')) {
      $route->setRequirement('_permission', 'access administration pages');
    }
    if ($route = $collection->get('user.pass')) {
      $route->setRequirement('_permission', 'access administration pages');
    }
    if ($route = $collection->get('user.register')) {
      $route->setRequirement('_permission', 'access administration pages');
    }
    if ($route = $collection->get('entity.user.canonical')) {
      $route->setDefault('_controller',
        '\Drupal\ns_navigation\Controller\NsNavigationController::goHome');
    }
  }

}
