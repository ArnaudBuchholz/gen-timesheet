'use strict'

/* global gpf, XMLWorkbook */

const tags = {}
'div,span,form,label,button,select,option'
  .split(',').forEach(tag => { tags[tag] = gpf.web.createTagFunction(tag) })

const weekDays = [1, 2, 3, 4, 5, 6] // Ignore sunday
const DAY = 24 * 60 * 60 * 1000

const FORMAT_NORMAL = 0
const FORMAT_BREAKOUT = 1
const FORMAT_OUT = 2

const FORMAT_CONSOLE = [
  'background: white; color: black;',
  'background: blue; color: yellow;',
  'background: black; color: yellow;'
]

function pad (number, length = 2) {
  return number.toString().padStart(length, '0')
}

function dateToUsrFmt (date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}

function clearTime (date) {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
}

function generateFor (year) {
  console.log('Generating calendar for year ' + year)
  const workbook = new XMLWorkbook()
  const janFirst = new Date(year, 0, 1, 0, 0, 0, 0)
  let day = janFirst
  // Search for the first day of the week
  while (day.getDay() !== weekDays[0]) {
    day = new Date(day.getTime() - DAY)
  }
  console.log('First day of the week for this year: ' + dateToUsrFmt(day))
  // Breakout dates
  const breakoutDates = [new Date(year, 0, 15)]
  for (var month = 1; month < 13; ++month) {
    breakoutDates.push(new Date(year, month, 0), new Date(year, month, 15))
  }
  breakoutDates.push(new Date(year, 11, 31));
  breakoutDates.forEach(clearTime)
  console.log('Breakout dates:')
  breakoutDates.forEach(date => console.log(`\t${dateToUsrFmt(date)}`))
  // Render calendar
  const dates = []
  const formats = []
  let breakout = false
  let lastBreakoutDate
  let loops = 100
  let firstDayOfWeek = day
  while (day.getFullYear() !== year + 1 && --loops) {
    dates.length = 0
    formats.length = 0
    weekDays.forEach(() => {
      dates.push(`%c${dateToUsrFmt(day)}`)
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
      day = new Date(day.getTime() + DAY)
      clearTime(day)
    })
    if (formats.includes(FORMAT_NORMAL)) {
      console.log.apply(console, [dates.join(' ')].concat(formats.map(format => FORMAT_CONSOLE[format])));
    }
    if (breakout) {
      console.log(`%c--- BREAKOUT OF ${dateToUsrFmt(breakoutDates[0])} ---`, 'color: red')
      lastBreakoutDate = breakoutDates.shift()
      breakout = false
    } else {
      firstDayOfWeek = new Date(firstDayOfWeek.getTime() + 7 * DAY)
      clearTime(firstDayOfWeek)
    }
    day = firstDayOfWeek
  }
  return workbook.toString()
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
    /*location.href =*/ generateFor(selectedYear)
  })
})
