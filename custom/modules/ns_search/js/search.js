/**
 * @file
 * In-browser reference search for /references and /references-advanced.
 *
 * Loads the search data, indexes it with lunr and renders results into
 * #ns-results, using the markup of the Views pages this replaced. Pages
 * without #ns-results (such as the front page) submit the form normally.
 */
(function (drupalSettings, S) {
  var RETURN_KEY = 'nsSearch:last',
      settings = drupalSettings.nsSearch,
      baseUrl = drupalSettings.path.baseUrl,
      data = null,
      idx = null,
      form,
      results

  function esc (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
  }

  // Same escaping as the Google Scholar links Drupal rendered.
  function scholarUrl (title) {
    return 'https://scholar.google.com/scholar?q=' + encodeURIComponent(title)
      .replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
  }

  // Remembers the last search so reference edit/delete forms can return to
  // it; storage may be unavailable, which only loses that convenience.
  function remember (search) {
    try { sessionStorage.setItem(RETURN_KEY, location.pathname + search) } catch (e) {}
  }

  function recall () {
    try { return sessionStorage.getItem(RETURN_KEY) } catch (e) { return null }
  }

  function field (name) {
    return form.elements.namedItem(name)
  }

  function fillForm (params) {
    var values = {
      combine: params.combine,
      text_author__value: params.author,
      type: params.type || 'All',
      bibcite_lang: params.lang,
      bibcite_year: params.yearFrom,
      bibcite_year_1: params.yearTo
    }
    Object.keys(values).forEach(function (name) {
      var el = field(name)
      if (el) el.value = values[name]
    })
  }

  function readForm () {
    var p = new URLSearchParams()
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && el.value) p.set(el.name, el.value)
    })
    return S.readParams(p.toString())
  }

  function renderRow (r) {
    var subjects = r[5]
      ? '<li>Subject(s): ' + esc(r[5]) + '</li>'
      : ''
    return '<div class="views-row"><div class="views-field views-field-nothing-2">' +
      '<span class="field-content"><br>' +
      '<div class="container">' +
        '<div class="col-md-6"><ul>' +
          '<li>Author(s): ' + esc(r[4]) + '</li>' +
          '<li>Title: <b>' + esc(r[2]) + '</b></li>' +
          '<li>Year: ' + esc(r[3]) + '</li>' +
          '<li>Format: ' + esc(data.types[r[1]] || r[1]) + '</li>' +
          subjects +
        '</ul></div>' +
        '<div class="col-md-2"></div>' +
        '<div class="col-md-2"><a href="' + baseUrl + 'bibcite/reference/' + r[0] + '">Details</a></div>' +
        '<div class="col-md-2"><a href="' + esc(scholarUrl(r[2])) + '">Google Scholar</a></div>' +
      '</div></span></div></div>'
  }

  function pagerItem (params, page, cls, title, hidden, text, rel) {
    return '<li class="pager__item' + (cls ? ' ' + cls : '') + '">' +
      '<a href="' + esc(S.writeParams(params, page) || '?') + '" title="' + title + '"' +
      (rel ? ' rel="' + rel + '"' : '') + ' data-page="' + page + '"' +
      (cls === 'is-active active' ? ' aria-current="page"' : '') + '>' +
      '<span class="visually-hidden">' + hidden + '</span>' + text + '</a></li>'
  }

  function renderPager (params, p) {
    if (p.totalPages < 2) return ''
    var items = [],
        ellipsis = '<li class="page-item" role="presentation"><span class="page-link">&hellip;</span></li>'

    if (p.page > 0) {
      items.push(pagerItem(params, 0, 'pager__item--first', 'Go to first page',
        'First page', '<span aria-hidden="true">« First</span>'))
      items.push(pagerItem(params, p.page - 1, 'pager__item--previous', 'Go to previous page',
        'Previous page', '<span aria-hidden="true">‹‹</span>', 'prev'))
    }
    if (p.first > 1) items.push(ellipsis)
    for (var n = p.first; n <= p.last; n++) {
      items.push(n - 1 === p.page
        ? pagerItem(params, n - 1, 'is-active active', 'Current page', 'Current page', n)
        : pagerItem(params, n - 1, '', 'Go to page ' + n, 'Page', n))
    }
    if (p.last < p.totalPages) items.push(ellipsis)
    if (p.page < p.totalPages - 1) {
      items.push(pagerItem(params, p.page + 1, 'pager__item--next', 'Go to next page',
        'Next page', '<span aria-hidden="true">››</span>', 'next'))
      items.push(pagerItem(params, p.totalPages - 1, 'pager__item--last', 'Go to last page',
        'Last page', '<span aria-hidden="true">Last »</span>', 'last'))
    }

    return '<nav class="pager-nav text-center" role="navigation" aria-labelledby="pagination-heading">' +
      '<h4 id="pagination-heading" class="visually-hidden">Pagination</h4>' +
      '<ul class="pagination js-pager__items">' + items.join('') + '</ul></nav>'
  }

  function render (params) {
    var list = S.search(lunr, idx, data.records, params),
        p = S.pager(list.length, params.page),
        header = list.length
          ? 'Displaying ' + p.start + ' - ' + p.end + ' of ' + list.length + ' results'
          : 'No references match your search.'

    results.innerHTML =
      '<div class="view-header" tabindex="-1">' + header + '</div>' +
      '<div class="view-content">' +
        list.slice(p.start - 1, p.end).map(renderRow).join('') +
      '</div>' +
      renderPager(params, p)
  }

  function go (params, page) {
    var search = S.writeParams(params, page)
    history.pushState(null, '', location.pathname + search)
    remember(search)
    params.page = page
    render(params)
  }

  function fromLocation () {
    var params = S.readParams(location.search)
    remember(location.search)
    fillForm(params)
    if (idx) render(params)
  }

  // "?return" comes from the reference edit/delete forms: go back to the
  // last search, made on either search page (both take the same params).
  function restoreReturn () {
    if (!new URLSearchParams(location.search).has('return')) return
    var last = recall(),
        q = last ? last.indexOf('?') : -1,
        search = q === -1 ? '' : last.slice(q)
    history.replaceState(null, '', location.pathname + search)
  }

  function load () {
    fetch(settings.dataUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      })
      .then(function (loaded) {
        data = loaded
        // Indexing blocks for a moment; let the loading message paint first.
        return new Promise(function (resolve) { setTimeout(resolve, 0) })
      })
      .then(function () {
        idx = S.buildIndex(lunr, data)
        fromLocation()
      })
      .catch(function (err) {
        results.innerHTML = '<div class="alert alert-danger" role="alert">' +
          'Sorry, the reference search could not be loaded. (' + esc(err.message) + ')</div>'
      })
  }

  function init () {
    form = document.querySelector('form[data-ns-search]')
    results = document.getElementById('ns-results')
    if (!form || !results || !settings) return

    restoreReturn()
    fillForm(S.readParams(location.search))

    // Until the search is ready, the form and reset link work as normal.
    form.addEventListener('submit', function (e) {
      if (!idx) return
      e.preventDefault()
      go(readForm(), 0)
    })

    var reset = form.querySelector('[data-ns-search-reset]')
    if (reset) {
      reset.addEventListener('click', function (e) {
        if (!idx) return
        e.preventDefault()
        fillForm(S.readParams(''))
        go(S.readParams(''), 0)
      })
    }

    results.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-page]')
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      go(S.readParams(location.search), Number(a.dataset.page))
      var header = results.querySelector('.view-header')
      header.scrollIntoView()
      header.focus({ preventScroll: true })
    })

    window.addEventListener('popstate', fromLocation)

    load()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}(drupalSettings, window.NsSearch))
