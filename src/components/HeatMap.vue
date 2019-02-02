<template>
  <div class="heatmap-wrap">
    <div class="tool-bar">
      <button class="button" @click="download">
        下载模板
      </button>
      <button class="button">
        <label>
            <input type="file" @change="getFile">
            上传文件
        </label>
      </button>
    </div>

    <div id="heatmap" class="heatmap"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { format } from '@/utils/tools'
import config from '@/utils/config'
export default {
  name: 'HeatMap',
  props: {
    // UI configuration
    theme: {
      type: String,
      default: 'light'
    },
    cellSize: {
      type: Number,
      default: 20
    },
    buckets: {
      type: Number,
      default: 4
    },
    colors: {
      type: Array,
      default: () => {
        return [
          '#636cff',
          '#f981b7',
          '#82adcf',
          '#f29e78',
          '#44c0c9',
          '#2196f3',
          '#9c27b0',
          '#ffc107',
          '#f44336'
        ]
      }
    },
    margin: {
      type: Object,
      default: () => ({ top: 30, right: 90, bottom: 50, left: 50 })
    }
  },
  data () {
    return {
      svg: null,
      toolTip: null,
      finishingRate: null,
      data: [],
      key: null,
      height: 0
    }
  },
  computed: {
    rows () {
      return this.data && this.data.columns.filter(_ => _)
    },
    colNumber () {
      return Math.ceil(this.data.length / 7)
    },
    rowNumber () {
      return 7
    }
  },
  methods: {
    download () {
      window.open('/data/template.numbers')
    },
    getFile (e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      // 默认使用UTF-8格式
      reader.readAsText(file)
      reader.onload = (evt) => {
        document.querySelector('#heatmap').innerHTML = ''
        this.finishingRate = null
        this.data = d3.csvParse(evt.target.result, (d) => {
          return {
            ...d, date: new Date(d.date)
          }
        })
        this.render(this.data)
      }
    },
    initData () {
      // var buckets = this.colors.length
      // const url = '/data/201901-time.csv'
      const url = '/data/checklist.csv'
      d3.csv(url, (d) => {
        return {
          ...d, date: new Date(d.date)
        }
      })
        .then((data) => {
          this.data = data
          this.render(this.data)
        })
    },
    initSvg () {
      this.height = this.rowNumber * this.cellSize + this.margin.top + this.margin.bottom
      this.svg = d3.select('#heatmap').append('svg')
        .attr('width', this.colNumber * this.cellSize + this.margin.left + this.margin.right)
        .attr('height', this.height)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
    },
    renderToolTip () {
      if (!this.toolTip) {
        this.toolTip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)
      }
    },
    renderLabel () {
      // 所有月份
      const allMonth = Array.from(this.data, (d) => format.month(d.date))
      // 所有周一的日期
      const allMon = this.data.filter(d => format.weekday(d.date) === config.weekday.en[0])
      // 添加时间标签 横轴
      const xLabels = [...new Set(allMonth)]
      this.svg.selectAll('.x-labels')
        .data(xLabels)
        .enter().append('text')
        .text(d => d)
        .attr('x', (label, i) => {
          let x = 0
          allMon.map(m => {
            if (format.month(m.date) === label) {
              x = Math.floor(+format.yearDay(m.date) / 7) * this.cellSize
            }
          })
          return x
        })
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .attr('transform', `translate(${this.cellSize / 2}, -4)`)
        .attr('class', 'x-labels')

      // 添加纵轴标签
      this.svg.selectAll('.y-labels')
        .data(config.weekday.en)
        .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', (d, i) => i * this.cellSize)
        .style('text-anchor', 'end')
        .attr('transform', 'translate(-6,' + this.cellSize / 1.5 + ')', -100)
        .attr('class', 'y-labels')
    },
    renderCell () {
      const self = this
      const legendArr = this.rows.slice(1)
      const baseColor = this.colors[legendArr.indexOf(this.key)]
      // console.log(baseColor)
      const card =
      this.svg.selectAll('.item')
        .data(this.data)
        .enter().append('rect')
        .attr('width', this.cellSize)
        .attr('height', this.cellSize)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('x', (d, i) => {
          return Math.floor(+format.yearDay(d.date) / 7) * this.cellSize
        })
        .attr('y', (d, i) => {
          return config.weekday.en.indexOf(format.weekday(d.date)) * this.cellSize
        })
      card.style('fill', '#ddd')
        .style('stroke', '#fff')
        .style('stroke-width', 1)
        .transition()
        .delay(300)
        .style('fill', (d, i) => {
          // console.log(d)
          var c = d3.color(baseColor)
          if (d[this.key] === 'TRUE') {
            return c
          } else {
            return '#ddd'
          }
        })
        .attr('class', 'card')

      card
        .on('mouseover', function (d, i) {
          self.toolTip.transition()
            .duration(200)
            .style('opacity', 0.9)
          self.toolTip.html(format.date(d.date))
            .style('left', (d3.event.pageX + 2) + 'px')
            .style('top', (d3.event.pageY + 2) + 'px')
          d3.select(this)
            .transition()
            .duration(100)
            .style('fill-opacity', 0.8)
        })
        .on('mousemove', function (d, i) {
          self.toolTip.html(format.date(d.date))
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px')
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration(100)
            .style('fill-opacity', 1)
          self.toolTip.transition()
            .duration(500)
            .style('opacity', 0)
        })
    },
    renderLegend () {
      const size = {
        width: 20,
        height: 14
      }
      const gap = {
        x: 10,
        y: 10
      }
      const legendsArr = this.rows.slice(1)
      const legends = this.svg.selectAll('.legends')
        .data(legendsArr)

      legends.enter().append('rect')
        .attr('width', size.width)
        .attr('height', size.height)
        .style('fill', (d, i) => this.colors[i])
        // .attr('x', (d, i) => i * (size.width + 20))
        // .attr('y', this.rowNumber * this.cellSize + 10)
        .attr('x', this.colNumber * this.cellSize + this.margin.right - size.width - gap.x)
        .attr('y', (d, i) => i * (size.height + gap.y))

        .attr('class', 'legends')
        .on('click', (d) => {
          this.key = d
          this.renderCell()
          this.renderText()
        })
      legends.enter().append('text')
        .text(d => d)
        .attr('x', this.colNumber * this.cellSize + this.margin.right - size.width - gap.x - 5)
        .attr('y', (d, i) => i * (size.height + gap.y))
        .style('fill', (d, i) => this.colors[i])
        .style('text-anchor', 'end') // 文本锚点尾对齐
        .attr('dy', '1em')
        .attr('class', 'legends-text')
    },
    renderText () {
      if (!this.finishingRate) {
        this.finishingRate = this.svg.append('text')
        this.svg.append('text')
          .text(`热度公式：当前完成天数/今年已过去天数`)
          .attr('x', 0)
          .attr('y', this.rowNumber * this.cellSize + 40)
          .style('fill', '#999')
          .style('font-size', '12px')
      }
      const finish = Array.from(this.data, (d) => d[this.key]).filter(_ => _ === 'TRUE')
      const rate = (finish.length / format.yearDay(new Date())) * 100
      this.finishingRate
        .text(`${this.key} 热度： ${rate.toFixed(2)} %`)
        .attr('x', 0)
        .attr('y', this.rowNumber * this.cellSize + 20)
        .style('fill', '#666')
        .style('font-size', '13px')
    },
    render () {
      this.key = this.data.columns[1]
      this.initSvg()
      this.renderLabel()
      this.renderCell()
      this.renderLegend()
      this.renderText()
    }
  },
  mounted () {
    this.initData()
    this.renderToolTip()
  }
}
</script>

<style lang="scss">
.heatmap-wrap{
  flex: 1;
}
.tool-bar{
  text-align: center;
  margin: 50px;
  button+button{
    margin-left: 20px;
  }
}
.heatmap{
  margin: 20px auto
}
.tooltip {
  position: absolute;
  padding: 5px 10px;
  font: 12px sans-serif;
  background: rgba(255,255,255,0.5);
  box-shadow: 1px 1px 5px 0px rgb(183, 183, 183) ;
  border-radius: 3px;
  pointer-events: none;
}
svg{
  display: block;
  margin: 0 auto;
  border: 1px solid #ddd;
}

.x-labels,.y-labels{
  fill: #aaa;
  font-size: 13px;
}

.legends{
  cursor: pointer;
}
.legends-text{
  font-size: 10px;
  color: #aaa;
}
// -----------------------
$theme-color : #409EFF;
$input-radius: 3px;
$input-border-color: #dcdfe6;

button{
  border-radius: $input-radius;
  background: $theme-color;
  color: #fff;
  border: 1px solid $theme-color;
  padding: 5px 12px;
  box-shadow: 1px 1px 2px 0px rgba(64, 158, 255, 0.6);
  cursor: pointer;
  transition: all linear 0.35s;
  &:hover{
    background: #65affb;
    border: 1px solid #65affb;
  }
}
input[type="file"]{
  display: none;
  cursor: pointer;
}
</style>
