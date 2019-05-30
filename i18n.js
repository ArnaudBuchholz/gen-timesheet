'use strict'

/* global gpf, location */

function i18n (key) {
  const item = key.split('.').reduce((data, subKey) => data[subKey], i18n._root)
  return item[i18n.locale] || item.en
}

i18n.capitalized = function (key) {
  const result = i18n(key)
  return result.charAt(0).toUpperCase() + result.substring(1)
}

i18n.locale = ((/\blang=([a-z]+)/).exec(location.search) || {})[1] || 'en'

i18n.ready = gpf.http.get('i18n.json')
  .then(response => JSON.parse(response.responseText))
  .then(langJson => {
    i18n._root = langJson
    i18n.locales = langJson.locales
  })
