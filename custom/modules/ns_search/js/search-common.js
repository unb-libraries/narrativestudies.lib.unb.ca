/**
 * @file
 * Reference search logic, free of the DOM so it can also run under Node.
 */
;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.NsSearch = factory()
  }
}(this, function () {
  var PER_PAGE = 10,
      PAGER_QUANTITY = 9

  // Accent-insensitive matching, as with the site's MySQL collation.
  function fold (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  }

  /**
   * Indexes the records. The ref is each record's position, which is its
   * display order, so matches are put in order by sorting refs.
   */
  function buildIndex (lunr, data) {
    return lunr(function () {
      this.ref('i')
      // As the fields of the former view's "combine" filter, less abstract,
      // which is not in the export.
      this.field('title')
      this.field('author')
      this.field('subject')
      this.field('year')
      this.field('type')
      this.field('lang')

      data.records.forEach(function (r, i) {
        this.add({
          i: i,
          title: fold(r[2]),
          author: fold(r[4]),
          subject: fold(r[5]),
          year: r[3] === null ? '' : String(r[3]),
          type: fold(r[1] + ' ' + (data.types[r[1]] || '')),
          lang: fold(r[6])
        })
      }, this)
    })
  }

  function toYear (s) {
    s = String(s || '').trim()
    return /^-?\d+$/.test(s) ? Number(s) : null
  }

  /**
   * Normalizes query-string params (named as the former view's filters, so
   * existing links keep working).
   */
  function readParams (search) {
    var p = new URLSearchParams(search)
    var type = p.get('type') || ''
    return {
      combine: (p.get('combine') || '').trim(),
      author: (p.get('text_author__value') || '').trim(),
      type: type === 'All' ? '' : type,
      lang: (p.get('bibcite_lang') || '').trim(),
      yearFrom: (p.get('bibcite_year') || '').trim(),
      yearTo: (p.get('bibcite_year_1') || '').trim(),
      page: Math.max(0, parseInt(p.get('page'), 10) || 0)
    }
  }

  function writeParams (params, page) {
    var p = new URLSearchParams()
    if (params.combine) p.set('combine', params.combine)
    if (params.author) p.set('text_author__value', params.author)
    if (params.type) p.set('type', params.type)
    if (params.lang) p.set('bibcite_lang', params.lang)
    if (params.yearFrom) p.set('bibcite_year', params.yearFrom)
    if (params.yearTo) p.set('bibcite_year_1', params.yearTo)
    if (page) p.set('page', page)
    var s = p.toString()
    return s ? '?' + s : ''
  }

  /**
   * Turns free text into query terms: tokenized and run through the same
   * steps as indexing (so stop words drop out and words are stemmed). The
   * index's own pipeline is the search pipeline, which only stems.
   */
  var termPipeline = null
  function queryTerms (lunr, text) {
    if (!termPipeline) {
      termPipeline = new lunr.Pipeline()
      termPipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer)
    }
    return termPipeline.run(lunr.tokenizer(fold(text)))
      .map(String).filter(Boolean)
  }

  /**
   * Drupal's "allwords" filters: every word must match. A trailing
   * wildcard on each stemmed word keeps prefix matches ("narrat" finds
   * "narratology"), close to the old LIKE '%word%' behaviour.
   *
   * Returns the matching record positions in display order, or null when
   * there is no text query (i.e. every record matches).
   */
  function textMatches (lunr, idx, params) {
    var clauses = []
    queryTerms(lunr, params.combine).forEach(function (t) {
      clauses.push({ term: t })
    })
    queryTerms(lunr, params.author).forEach(function (t) {
      clauses.push({ term: t, fields: ['author'] })
    })
    if (!clauses.length) return null

    return idx.query(function (q) {
      clauses.forEach(function (c) {
        var opts = {
          presence: lunr.Query.presence.REQUIRED,
          wildcard: lunr.Query.wildcard.TRAILING,
          usePipeline: false
        }
        if (c.fields) opts.fields = c.fields
        q.term(c.term, opts)
      })
    }).map(function (r) { return Number(r.ref) })
      .sort(function (a, b) { return a - b })
  }

  /**
   * Returns the matching records, in the view's sort order.
   */
  function search (lunr, idx, records, params) {
    var positions = textMatches(lunr, idx, params),
        from = toYear(params.yearFrom),
        to = toYear(params.yearTo),
        lang = fold(params.lang).toLowerCase(),
        list = positions
          ? positions.map(function (i) { return records[i] })
          : records

    if (!params.type && !lang && from === null && to === null) return list

    return list.filter(function (r) {
      if (params.type && r[1] !== params.type) return false
      // The former view's "contains" filter.
      if (lang && fold(r[6]).toLowerCase().indexOf(lang) === -1) return false
      // As in SQL, a record without a year fails any year comparison.
      if (from !== null && (r[3] === null || r[3] < from)) return false
      if (to !== null && (r[3] === null || r[3] > to)) return false
      return true
    })
  }

  /**
   * Page window for Drupal's "full" pager (template_preprocess_pager).
   */
  function pager (total, page) {
    var totalPages = Math.ceil(total / PER_PAGE)
    page = Math.min(page, Math.max(0, totalPages - 1))
    var middle = Math.ceil(PAGER_QUANTITY / 2),
        current = page + 1,
        first = current - middle + 1,
        last = current + PAGER_QUANTITY - middle

    if (last > totalPages) {
      first += totalPages - last
      last = totalPages
    }
    if (first <= 0) {
      last += 1 - first
      first = 1
    }

    return {
      page: page,
      totalPages: totalPages,
      first: first,
      last: Math.min(last, totalPages),
      start: total ? page * PER_PAGE + 1 : 0,
      end: Math.min(total, (page + 1) * PER_PAGE)
    }
  }

  return {
    PER_PAGE: PER_PAGE,
    fold: fold,
    buildIndex: buildIndex,
    readParams: readParams,
    writeParams: writeParams,
    search: search,
    pager: pager
  }
}))
