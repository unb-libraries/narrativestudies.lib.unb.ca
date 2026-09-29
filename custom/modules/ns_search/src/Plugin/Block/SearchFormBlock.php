<?php

namespace Drupal\ns_search\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Provides the reference search form.
 *
 * Searching happens in the browser (see the search library); the form is a
 * plain GET form so that it also works from pages without results, such as
 * the front page.
 *
 * @Block(
 *   id = "ns_search_form",
 *   admin_label = @Translation("Reference search form"),
 *   category = @Translation("Narrative Studies")
 * )
 */
class SearchFormBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The request stack.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  protected $requestStack;

  /**
   * Constructs a SearchFormBlock.
   *
   * @param array $configuration
   *   The plugin configuration.
   * @param string $plugin_id
   *   The plugin ID.
   * @param mixed $plugin_definition
   *   The plugin definition.
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   The request stack.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, RequestStack $request_stack) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->requestStack = $request_stack;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('request_stack')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return ['advanced' => FALSE];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['advanced'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show the advanced search fields'),
      '#default_value' => $this->configuration['advanced'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['advanced'] = (bool) $form_state->getValue('advanced');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $advanced = !empty($this->configuration['advanced']);
    $route = $advanced ? 'ns_search.references_advanced' : 'ns_search.references';
    $data = $advanced ? ns_search_data() : NULL;

    // Keep the current search in the form; the script updates it as the
    // search changes.
    $query = $this->requestStack->getCurrentRequest()->query;
    $values = [];
    foreach ([
      'combine',
      'text_author__value',
      'type',
      'bibcite_lang',
      'bibcite_year',
      'bibcite_year_1',
    ] as $key) {
      $values[$key] = (string) $query->get($key, '');
    }

    return [
      '#theme' => 'ns_search_form',
      '#advanced' => $advanced,
      '#action' => Url::fromRoute($route)->toString(),
      '#types' => $data ? $data['types'] : [],
      '#values' => $values,
      '#cache' => [
        'contexts' => ['url.query_args'],
      ],
    ];
  }

}
