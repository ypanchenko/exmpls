import React from 'react';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Card,
  TextField,
  MenuItem,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  getConvTypeWithAliasDashboard,
  renderConvTypeTitle, renderRevenueTypeTitle,
} from '../../../../constants/dashboard';
import { getCurrencySign } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  todayValue: {
    color: '#aaaaaa',
  },
}));

const MetricBlock = (props) => {
  const {
    handleChange, metricsName, intl, metrics, customStyles, items, todayInfo,
  } = props;
  const { formatMessage } = intl;
  const classes = useStyles();
  const _label = `dashboard.graphs.metrics.select.placeholder.${metricsName}`;

  const { currentUser } = useSelector((state) => state.users);
  const user = currentUser || {};
  const currencySign = getCurrencySign(user);

  const getListMetricsOptions = (data) => getConvTypeWithAliasDashboard(user, 'value', data).map((option) => {
    let label = '';
    if (option.value.split('convtype').length > 1) {
      label = renderConvTypeTitle(option.value, 'conv', user);
    } else if (option.value.split('revenuetype').length > 1) {
      label = renderRevenueTypeTitle(option.value, 'revenue', user);
    } else if (option.value === 'conversions') {
      label = renderConvTypeTitle('conv_default_type', 'conv_', user);
    } else if (option.value === 'revenue') {
      label = renderRevenueTypeTitle('revenue_default_type', 'revenue_', user);
    } else {
      label = formatMessage({ id: `dashboard.graphs.metrics.select.options.${option.value}` });
    }
    return ({
      value: option.value,
      label,
    });
  });

  const options = getListMetricsOptions(metrics.options);
  const _value = (metrics.index || metrics.index === 0)
    && `${metrics.options[metrics.index].currency
      ? currencySign : ''}
      ${metrics.options[metrics.index].aggregator(_.sumBy, items)}`;

  const _handleChange = (e) => {
    const { value } = e.target;
    handleChange(value);
  };

  const _todayValue = (metrics.index || metrics.index === 0) && metrics.options[metrics.index].aggregator(_.sumBy, todayInfo.todayStats);

  return (
    <Card
      style={{
        ...customStyles,
        display: 'flex',
        justifyContent: 'center',
        // padding: '12px',
      }}
      className={classes.root}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
        >
          <TextField
            id={`input${metricsName}`}
            select
            fullWidth
            label={formatMessage({ id: _label })}
            placeholder={formatMessage({ id: _label })}
            value={metrics.value}
            onChange={_handleChange}
            name="value"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <hr />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4" component="strong">
              {_value}
              {!todayInfo.isTodayRange && todayInfo.isTodayStatPresent
                && <span className={classes.todayValue}> ({_todayValue} today)</span>}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

MetricBlock.propTypes = {
  handleChange: PropTypes.func,
  metricsName: PropTypes.string,
  intl: PropTypes.object,
  metrics: PropTypes.object,
  customStyles: PropTypes.object,
  todayInfo: PropTypes.object,
  items: PropTypes.array,
};

export default injectIntl(MetricBlock);
