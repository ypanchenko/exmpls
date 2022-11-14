import React from 'react'
import { injectIntl } from 'react-intl'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  Card,
  withStyles,
} from '@material-ui/core';
import { scaleTime } from 'd3-scale'
import { timeDay } from "d3-time"
import moment from 'moment-timezone'

import store from 'src/store/index'

import { renderConvTypeTitle, renderRevenueTypeTitle } from '../../../../constants/dashboard'

const styles = theme => ({
  root: {
    padding: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    fontSize: '12px'
  },
});

class ChartContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
    }
  }

  static getDerivedStateFromProps(props, state) {
    const date_from = store.getState().stat.filters.date_from
    const date_to = store.getState().stat.filters.date_to
    const items = store.getState().stat.items || []
    let emptyChartData = {}
    props.metrics.lineCharts.map((el,i) => {
      emptyChartData[el.value] = 0

    })
    const xTicks = (date_from && date_to) ? scaleTime().domain([date_from, date_to]).ticks(timeDay.every(1)) : []
    let chartData = items.slice(0)
    xTicks.forEach(tick => {
      const tickFormatted = moment(tick).format('YYYY-MM-DD')
      if (chartData.findIndex(d => d.date === tickFormatted) < 0) {
        chartData.push({
          date: tickFormatted,
          ...emptyChartData,
        })
      }
    })
    chartData.sort((a, b) => moment(a.date) - moment(b.date))
    return {
      chartData: chartData,
    }
  }

  _renderYAxis = () => {
    const { metrics } = this.props
    const lineCharts = metrics.lineCharts
    const YAxises = []
    lineCharts.map((el, i) => {
      YAxises.push(
        <YAxis
          key={i}
          orientation={i > 1 ? 'right' : 'left'}
          yAxisId={i}
          {...el.yaxisProperties}
        />
      )
    })
    return YAxises
  }

  _renderMetricTitle = (metricKey) => {
    const { formatMessage } = this.props.intl
    const user = store.getState().accountReducer.user
    let label = ''
    if (metricKey.split('convtype').length > 1) {
      label = renderConvTypeTitle(metricKey, 'conv', user)
    } else if (metricKey.split('revenuetype').length > 1) {
      label = renderRevenueTypeTitle(metricKey, 'revenue', user)
    } else {
      if (metricKey === 'conversions') {
        label = renderConvTypeTitle('conv_default_type', 'conv_', user)
      } else if (metricKey === 'revenue') {
        label = renderRevenueTypeTitle('revenue_default_type', 'revenue_', user)
      } else {
        label = formatMessage({ id: `common.fields.${metricKey}` })
      }
    }
    return label
  }

  _renderLine = () => {
    const { metrics } = this.props
    const lineCharts = metrics.lineCharts
    const Lines = []
    lineCharts.map((el, i) => {
      Lines.push(
        <Line
          name={this._renderMetricTitle(el.value)}
          key={i}
          dataKey={el.value}
          yAxisId={i}
          {...el.lineChartProperties}
        />
      )
    })
    return Lines
  }

  render() {
    const { chartData } = this.state
    const { classes } = this.props
    const dateFormat = d => moment(d).format('DD/MM')
    return (
      <Card
        className={classes.root}
      >
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="date" name="Date" tickFormatter={dateFormat}/>
            {this._renderYAxis()}
            {this._renderLine()}
            <Tooltip isAnimationActive={false}/>
            <Legend/>
            <CartesianGrid strokeDasharray="3 3"/>
          </ComposedChart>
        </ResponsiveContainer>

      </Card>
    )
  }

}

export default injectIntl(withStyles(styles)(ChartContainer))
