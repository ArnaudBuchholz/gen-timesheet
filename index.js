'use strict'

/* global gpf */

const tags = {}
'div,span,form,label,button,select,option'
  .split(',').forEach(tag => { tags[tag] = gpf.web.createTagFunction(tag) })

function generateFor (year) {
  console.log('Generating calendar for year ' + year)
}

window.addEventListener('load', () => {
  const currentYear = (new Date()).getFullYear()
  tags.form([
    tags.div({ className: 'form-group' }, [
      tags.label({ for: 'year' }, 'Select year'),
      tags.select({ className: 'form-control', id: 'year' }, [
        tags.option({ value: currentYear }, currentYear),
        tags.option({ value: currentYear + 1 }, currentYear + 1)
      ])
    ]),
    tags.button({ className: 'btn btn-primary', id: 'generate' }, 'Generate')
  ]).appendTo(document.body)
  tags.div({ id: 'timesheet' }).appendTo(document.body)
  document.getElementById('generate').addEventListener('click', () => {
    window.event.preventDefault()
    const yearSelect = document.getElementById('year')
    const selectedYear = parseInt(yearSelect.options[yearSelect.selectedIndex].value, 10)
    generateFor(selectedYear)
  })
})
