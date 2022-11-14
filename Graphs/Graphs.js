import React from 'react';
import { injectIntl } from 'react-intl';
import {
  Box,
} from '@material-ui/core';
import { connect } from 'react-redux';
import _ from 'lodash';
import store from 'src/store/index';
import { prepareDateFromTo, getMomentWithTimeZone } from '../../../../utils/index';

import Metrics from './Metrics';
import ChartContainer from './ChartContainer';

import {
  METRICS_DATA,
  DASHBOARD_METRICS_LIST,
  METRICS_DATA_CHARTS_COLORS,
  METRICS_DATA_CHARTS_DEF_COLOR,
} from '../../../../constants/dashboard';
import { DATE_FORMAT_HOUR, LAST_HOUR_FLAG_VALUE } from '../../../../constants/index';

class Graphs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metrics: {
        metrics_A: {
          options: METRICS_DATA,
          value: '',
          index: null,
          lineChartProperties: {},
        },
        metrics_B: {
          options: METRICS_DATA,
          value: '',
          index: null,
          lineChartProperties: {},
        },
        metrics_C: {
          options: METRICS_DATA,
          value: '',
          index: null,
          lineChartProperties: {},
        },
        metrics_D: {
          options: METRICS_DATA,
          value: '',
          index: null,
          lineChartProperties: {},
        },
        lineCharts: [],
      },
    };

    this.saveSelectedMetrics = this.saveSelectedMetrics.bind(this);
    this.prepareSortedReportColumns = this.prepareSortedReportColumns.bind(this);
    this.prepareTodayStats = this.prepareTodayStats.bind(this);
    this.disableSelectedMetrics = this.disableSelectedMetrics.bind(this);
    this.handleChangeMetrics_A = this.handleChangeMetrics_A.bind(this);
    this.handleChangeMetrics_B = this.handleChangeMetrics_B.bind(this);
    this.handleChangeMetrics_C = this.handleChangeMetrics_C.bind(this);
    this.handleChangeMetrics_D = this.handleChangeMetrics_D.bind(this);
    this.renderMetricsChartColors = this.renderMetricsChartColors.bind(this);
    this.renderMetricsColors = this.renderMetricsColors.bind(this);
  }

  componentDidMount() {
    if (_.has(this.props.users, 'currentUser.settings.dashboard')) {
      if (this.props.users.currentUser && this.props.users.currentUser.settings.dashboard.metrics) {
        const settingsMetrics = this.props.users.currentUser.settings.dashboard.metrics;
        DASHBOARD_METRICS_LIST.map((metric, i) => {
          this.disableSelectedMetrics({
            value: settingsMetrics[metric].value,
            currentMetric: metric,
            otherMetrics: DASHBOARD_METRICS_LIST.filter((el) => el !== metric),
            lineChartProperties: { ...metric.lineChartProperties },
          }, () => null);
        });
      }
    } else {
      this.disableSelectedMetrics({
        value: METRICS_DATA[1].value,
        currentMetric: 'metrics_A',
        otherMetrics: ['metrics_A', 'metrics_B', 'metrics_C', 'metrics_D'].filter((metric) => metric !== 'metrics_A'),
      }, this.saveSelectedMetrics);
      this.disableSelectedMetrics({
        value: METRICS_DATA[2].value,
        currentMetric: 'metrics_B',
        otherMetrics: ['metrics_A', 'metrics_B', 'metrics_C', 'metrics_D'].filter((metric) => metric !== 'metrics_B'),
      }, this.saveSelectedMetrics);
    }
  }

  componentWillUnmount() {
    METRICS_DATA.map((el, i) => el.disabled = false);
  }

  saveSelectedMetrics(metricData) {
  }

  prepareSortedReportColumns(metrics) {
    const metricsReportsColumns = [];
    const metricsKey = Object.keys(metrics);
    metricsKey.splice(-1, 1);
    metricsKey.map((el, i) => {
      if (metrics[el].value) {
        metricsReportsColumns.push(metrics[el].value);
      }
    });
    return metricsReportsColumns;
  }

  prepareTodayStats() {
    const { stat } = this.props;
    const items = stat.items || [];
    let todayStats = [];
    const currentMomentDate = {
      date_from: getMomentWithTimeZone().startOf('day'),
      date_to: getMomentWithTimeZone().endOf('day'),
    };
    const currentDate = prepareDateFromTo(currentMomentDate, LAST_HOUR_FLAG_VALUE, DATE_FORMAT_HOUR);
    const { filters } = store.getState().stat;
    const date = prepareDateFromTo(filters, LAST_HOUR_FLAG_VALUE, DATE_FORMAT_HOUR);
    const { date_from, date_to } = date;
    const isTodayRange = date_from === currentDate.date_from && date_to === currentDate.date_to;
    const isTodayStatPresent = items.some((element) => element.date === currentDate.date_from && element.date === currentDate.date_to);
    if (isTodayStatPresent) {
      todayStats = items.filter((element) => element.date === currentDate.date_from && element.date === currentDate.date_to);
    }
    return {
      isTodayRange,
      isTodayStatPresent,
      todayStats,
    };
  }

  disableSelectedMetrics({ value, currentMetric, otherMetrics }, saveMetrics) {
    const { metrics } = this.state;
    const { renderReportColumns } = this.props;
    metrics.lineCharts = [];
    const metrics_currentMetric = metrics[currentMetric];
    const lineChartData = METRICS_DATA.find((el) => el.value === value);
    metrics_currentMetric.value = value;
    metrics_currentMetric.lineChartProperties = { ...(lineChartData ? lineChartData.lineChartProperties : lineChartData) };
    if (metrics_currentMetric.index !== null) {
      otherMetrics.map((el) => {
        metrics[el].options[metrics_currentMetric.index].disabled = false;
      });
    }
    const index = metrics_currentMetric.options.findIndex((el) => el.value === value);
    metrics_currentMetric.index = (value === null || index < 0) ? null : index;
    if (value) {
      otherMetrics.map((el) => {
        metrics[el].options[metrics_currentMetric.index].disabled = true;
      });
    }

    const metricsReportsColumns = this.prepareSortedReportColumns(metrics);
    metrics_currentMetric.options.map((el, i) => {
      if (el.disabled) {
        metrics.lineCharts.push(el);
      }
    });
    metrics.lineCharts.sort((a, b) => metricsReportsColumns.indexOf(a.value) - metricsReportsColumns.indexOf(b.value));
    this.setState({ metrics }, () => {
      renderReportColumns(this.state.metrics.lineCharts);
      saveMetrics(this.state.metrics);
    });
  }

  handleChangeMetrics_A(value) {
    this.disableSelectedMetrics({
      value,
      currentMetric: 'metrics_A',
      otherMetrics: ['metrics_B', 'metrics_C', 'metrics_D'],
    }, this.saveSelectedMetrics);
  }

  handleChangeMetrics_B(value) {
    this.disableSelectedMetrics({
      value,
      currentMetric: 'metrics_B',
      otherMetrics: ['metrics_A', 'metrics_C', 'metrics_D'],
    }, this.saveSelectedMetrics);
  }

  handleChangeMetrics_C(value) {
    this.disableSelectedMetrics({
      value,
      currentMetric: 'metrics_C',
      otherMetrics: ['metrics_A', 'metrics_B', 'metrics_D'],
    }, this.saveSelectedMetrics);
  }

  handleChangeMetrics_D(value) {
    this.disableSelectedMetrics({
      value,
      currentMetric: 'metrics_D',
      otherMetrics: ['metrics_A', 'metrics_B', 'metrics_C'],
    }, this.saveSelectedMetrics);
  }

  renderMetricsChartColors(metrics) {
    if (metrics.lineCharts) {
      metrics.lineCharts.map((charts, index) => {
        if (charts.lineChartProperties) {
          charts.lineChartProperties.stroke = METRICS_DATA_CHARTS_COLORS[index]
            ? METRICS_DATA_CHARTS_COLORS[index] : METRICS_DATA_CHARTS_DEF_COLOR;
        }
        if (charts.yaxisProperties && charts.yaxisProperties.tick) {
          charts.yaxisProperties.tick.fill = METRICS_DATA_CHARTS_COLORS[index]
            ? METRICS_DATA_CHARTS_COLORS[index] : METRICS_DATA_CHARTS_DEF_COLOR;
        }
      });
    }
    return metrics;
  }

  renderMetricsColors(metrics) {
    if (metrics.lineCharts) {
      DASHBOARD_METRICS_LIST.map((metric, index) => {
        if (metrics[metric].lineChartProperties && metrics[metric].lineChartProperties.stroke) {
          metrics[metric].lineChartProperties.stroke = METRICS_DATA_CHARTS_COLORS[index]
            ? METRICS_DATA_CHARTS_COLORS[index] : METRICS_DATA_CHARTS_DEF_COLOR;
        }
      });
    }
    return metrics;
  }

  render() {
    const { metrics } = this.state;
    const { stat } = this.props;
    const todayInfo = this.prepareTodayStats();

    return (
      <Box>
        <Metrics
          todayInfo={todayInfo}
          metrics={this.renderMetricsColors(metrics)}
          stat={stat}
          handleChangeMetrics_A={this.handleChangeMetrics_A}
          handleChangeMetrics_B={this.handleChangeMetrics_B}
          handleChangeMetrics_C={this.handleChangeMetrics_C}
          handleChangeMetrics_D={this.handleChangeMetrics_D}
        />
        <ChartContainer
          metrics={this.renderMetricsChartColors(metrics)}
        />
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.users,
  stat: state.stat,
});

export default connect(
  mapStateToProps,
)(injectIntl(Graphs));
