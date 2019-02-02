import * as d3 from 'd3'

// https://github.com/d3/d3-time-format/blob/master/README.md
export const format = {
  date: d3.timeFormat('%B %d, %Y'),
  yearDay: d3.timeFormat('%j'),
  day: d3.timeFormat('%d'),
  weekday: d3.timeFormat('%a'),
  month: d3.timeFormat('%b'),
  fullMonth: d3.timeFormat('%B')
}

// https://github.com/d3/d3-color
export const color = {
}
