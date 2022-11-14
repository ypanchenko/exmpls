import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import {
  DASHBOARD_METRICS_LIST,
} from '../../../../constants/dashboard';
import MetricBlock from './MetricBlock';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(3),
    alignItems: 'center',
    overflow: 'visible',
    justifyContent: 'space-between',
  },
  label: {
    marginLeft: theme.spacing(1),
  },
  select: {
    width: '100%',
  },
  center: {
    textAlign: 'center',
  },
  spaceBox: {
    marginBottom: 10,
  },
});

const Metrics = (props) => {
  const {
    // eslint-disable-next-line camelcase
    handleChangeMetrics_A,
    // eslint-disable-next-line camelcase
    handleChangeMetrics_B,
    // eslint-disable-next-line camelcase
    handleChangeMetrics_C,
    // eslint-disable-next-line camelcase
    handleChangeMetrics_D,
    stat,
    metrics,
    todayInfo,
  } = props;
  const {
    // eslint-disable-next-line camelcase
    metrics_A, metrics_B, metrics_C, metrics_D,
  } = metrics;

  const getStylesForSelect = () => {
    const s = {};
    DASHBOARD_METRICS_LIST.forEach((metric) => {
      s[metric] = {
        border: metrics[metric].lineChartProperties.stroke
          ? `1px solid ${metrics[metric].lineChartProperties.stroke}` : '',
      };
    });
    return s;
  };
  const _styles = getStylesForSelect();

  const items = stat.items || [];

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        lg={3}
        sm={3}
        xs={12}
      >
        <MetricBlock
          handleChange={handleChangeMetrics_A}
          metricsName="metric_A"
          metrics={metrics_A}
          items={items}
          todayInfo={todayInfo}
          customStyles={_styles.metrics_A}
        />
      </Grid>

      <Grid
        item
        lg={3}
        sm={3}
        xs={12}
      >
        <MetricBlock
          handleChange={handleChangeMetrics_B}
          metricsName="metric_B"
          metrics={metrics_B}
          items={items}
          todayInfo={todayInfo}
          customStyles={_styles.metrics_B}
        />
      </Grid>

      <Grid
        item
        lg={3}
        sm={3}
        xs={12}
      >
        <MetricBlock
          handleChange={handleChangeMetrics_C}
          metricsName="metric_C"
          metrics={metrics_C}
          items={items}
          todayInfo={todayInfo}
          customStyles={_styles.metrics_C}
        />
      </Grid>

      <Grid
        item
        lg={3}
        sm={3}
        xs={12}
      >
        <MetricBlock
          handleChange={handleChangeMetrics_D}
          metricsName="metric_D"
          metrics={metrics_D}
          items={items}
          todayInfo={todayInfo}
          customStyles={_styles.metrics_D}
        />
      </Grid>
    </Grid>
  );
};

Metrics.propTypes = {
  handleChangeMetrics_A: PropTypes.func,
  handleChangeMetrics_B: PropTypes.func,
  handleChangeMetrics_C: PropTypes.func,
  handleChangeMetrics_D: PropTypes.func,
  stat: PropTypes.object,
  metrics: PropTypes.object,
  todayInfo: PropTypes.object,
};

export default withStyles(styles)(Metrics);
