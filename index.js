'use strict'

/* global gpf, XMLWorkbook, location, i18n */

const tags = {}
'h1,h6,a,p,div,span,form,label,button,select,option'
  .split(',').forEach(tag => { tags[tag] = gpf.web.createTagFunction(tag) })

function next (date, daysOffset) {
  const result = new Date(date)
  result.setDate(result.getDate() + daysOffset)
  return result
}

const FORMAT_NORMAL = 0
const FORMAT_BREAKOUT = 1
const FORMAT_OUT = 2

const FORMAT_CONSOLE = [
  'background: white; color: black;',
  'background: blue; color: yellow;',
  'background: black; color: yellow;'
]

const BREAKOUT_MONTH = 'month'
const BREAKOUT_BI15 = 'bi15'
const BREAKOUT_BIWEEK = 'biweek'
const BREAKOUT_BIWEEK_SHIFT = 'biweek-shift'
const BREAKOUT_NONE = 'none'

function pad (number, length = 2) {
  return number.toString().padStart(length, '0')
}

function dateToUsrFmt (date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}

function getBreakoutDates (firstDayOfTheWeek, year, breakoutType) {
  if (BREAKOUT_NONE === breakoutType) {
    return []
  }
  const breakoutDates = []
  if ([BREAKOUT_BIWEEK, BREAKOUT_BIWEEK_SHIFT].includes(breakoutType)) {
    let day
    if (BREAKOUT_BIWEEK === breakoutType) {
      day = next(firstDayOfTheWeek, 14)
    } else {
      day = next(firstDayOfTheWeek, 7)
    }
    while (day.getFullYear() <= year) {
      breakoutDates.push(next(day, -1))
      day = next(day, 14)
    }
    breakoutDates.push(next(day, -1))
  } else {
    if (breakoutType === BREAKOUT_BI15) {
      breakoutDates.push(new Date(year, 0, 15, 0, 0, 0, 0))
    }
    for (let month = 1; month < 13; ++month) {
      breakoutDates.push(new Date(year, month, 0, 0, 0, 0, 0))
      if (breakoutType === BREAKOUT_BI15) {
        breakoutDates.push(new Date(year, month, 15, 0, 0, 0, 0))
      }
    }
    breakoutDates.push(new Date(year, 11, 31, 0, 0, 0, 0))
  }
  return breakoutDates
}

function generateFor (year, weekDays, breakoutType) {
  console.log('Generating calendar for year ' + year)
  const workbook = new XMLWorkbook(year, weekDays)
  const janFirst = new Date(year, 0, 1, 0, 0, 0, 0)
  let day = janFirst
  // Search for the first day of the week
  while (day.getDay() !== weekDays[0]) {
    day = next(day, -1)
  }
  console.log('First day of the week for this year: ' + dateToUsrFmt(day))
  // Breakout dates
  const breakoutDates = getBreakoutDates(day, year, breakoutType)
  console.log('Breakout dates:')
  breakoutDates.forEach(date => console.log(`\t${dateToUsrFmt(date)}`))
  // Render calendar
  const dates = []
  const formats = []
  let breakout = false
  let lastBreakoutDate
  let maxNumberOfLoops = 100 // Security against infinite loops :-)
  let firstDayOfWeek = day
  function insertBreakout () {
    lastBreakoutDate = breakoutDates.shift()
    console.log(`%c--- BREAKOUT OF ${dateToUsrFmt(lastBreakoutDate)} ---`, 'color: red')
    workbook.renderBreakout(lastBreakoutDate)
    breakout = false
  }
  while (day.getFullYear() !== year + 1 && --maxNumberOfLoops) {
    dates.length = 0
    formats.length = 0
    weekDays.forEach(() => {
      dates.push(day)
      if (day.getFullYear() !== year) {
        formats.push(FORMAT_OUT)
      } else if (lastBreakoutDate && day <= lastBreakoutDate) {
        formats.push(FORMAT_BREAKOUT)
      } else if (day > breakoutDates[0]) {
        formats.push(FORMAT_BREAKOUT)
        breakout = true
      } else {
        formats.push(FORMAT_NORMAL)
      }
      day = next(day, 1)
    })
    if (formats.includes(FORMAT_NORMAL)) {
      console.log.apply(console, [dates.map(date => `%c${dateToUsrFmt(date)}`).join(' ')]
        .concat(formats.map(format => FORMAT_CONSOLE[format])))
      workbook.renderWeek(dates, formats)
    }
    if (breakout) {
      insertBreakout()
    } else {
      firstDayOfWeek = next(firstDayOfWeek, 7)
    }
    day = firstDayOfWeek
  }
  if (breakoutDates.length) {
    insertBreakout() // final one
  }
  return workbook.toString()
}

function getSelectedValue (id) {
  const select = document.getElementById(id)
  return select.options[select.selectedIndex].value
}

function showForm () {
  const currentYear = (new Date()).getFullYear()
  document.title = i18n('form.title')
  tags.div({ className: 'jumbotron' }, [
    tags.h1(document.title),
    tags.h6(Object.keys(i18n.locales)
      .filter(locale => locale !== i18n.locale)
      .map(locale => tags.a({ href: '?lang=' + locale }, tags.span({ className: 'badge badge-secondary' }, i18n.locales[locale])))
    ),
    tags.p(tags.form([
      tags.div({ className: 'form-group' }, [
        tags.label({ for: 'year' }, i18n('form.year')),
        tags.select({ className: 'form-control', id: 'year' }, [
          tags.option({ value: currentYear }, currentYear),
          tags.option({ value: currentYear + 1 }, currentYear + 1)
        ])
      ]),
      tags.div({ className: 'form-group' }, [
        tags.label({ for: 'week' }, i18n('form.week')),
        tags.select({ className: 'form-control', id: 'week' }, [
          '123456',
          '12345',
          '15',
          '1',
          '3',
          '5'
        ].map(days =>
          tags.option({ value: days.split('') }, days.split('').map(day => i18n.capitalized(`days.${day}`)).join(', '))
        ))
      ]),
      tags.div({ className: 'form-group' }, [
        tags.label({ for: 'breakouts' }, i18n('form.breakout')),
        tags.select({ className: 'form-control', id: 'breakouts' }, [
          BREAKOUT_MONTH,
          BREAKOUT_BI15,
          BREAKOUT_BIWEEK,
          BREAKOUT_BIWEEK_SHIFT,
          BREAKOUT_NONE
        ].map(breakout =>
          tags.option({ value: breakout }, i18n(`form.breakout.${breakout}`))
        ))
      ]),
      tags.button({ className: 'btn btn-primary', id: 'generate' }, i18n('form.generate'))
    ]))
  ]).appendTo(document.body)

  tags.div({ id: 'timesheet' }).appendTo(document.body)
  document.getElementById('generate').addEventListener('click', () => {
    window.event.preventDefault()
    const selectedYear = parseInt(getSelectedValue('year'), 10)
    const selectedWeek = getSelectedValue('week').split(',').map(day => parseInt(day, 10))
    const breakoutType = getSelectedValue('breakouts')
    location.href = generateFor(selectedYear, selectedWeek, breakoutType)
  })
}

window.addEventListener('load', () => {
  i18n.ready.then(showForm)
})
