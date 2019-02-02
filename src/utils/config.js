
export default {
  basePath: process.env.NODE_ENV === 'production'
    ? '/HabbitHeatMap'
    : '',
  month: {
    'January': '一月'
  },
  weekday: {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
}
