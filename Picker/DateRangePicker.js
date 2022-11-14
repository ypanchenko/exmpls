import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { injectIntl } from 'react-intl';
import { MenuItem, TextField, withStyles } from '@material-ui/core';
import { DateRangePicker } from 'materialui-daterange-picker';
import _ from 'lodash';
import { getMomentWithTimeZone } from 'src/utils';

import { connect } from 'react-redux';
import { LAST_HOUR_FLAG_VALUE } from '../constants/index';

import './daterangepicker.css';

const styles = (theme) => ({
  rangesList: {
    position: 'relative',
    zIndex: 1,
  },
});

class DateRangePickerWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenLabel: '',
      ranges: this.Ranges(),
      open: true,
      dateRange: null,
    };

    this.Ranges = this.Ranges.bind(this);
    this.calculateChosenLabel = this.calculateChosenLabel.bind(this);
    this.applyHandler = this.applyHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeRange = this.changeRange.bind(this);
    this.onClickCustomRange = this.onClickCustomRange.bind(this);
  }

  componentDidMount() {
    const { startDate, endDate, time_interval } = this.props;
    if (startDate && endDate) {
      this.calculateChosenLabel(startDate, endDate, time_interval);
    }
  }

  Ranges(chosenLabel) {
    const { intl, user, customTimeZone } = this.props;
    const { formatMessage } = intl;
    let timeZone = user ? user.timezone : null;
    if (customTimeZone) {
      timeZone = customTimeZone;
    }
    let ranges = null;
    if (this.state) {
      ranges = this.state.ranges;
    }
    const today = formatMessage({ id: 'daterangepicker.today' });
    const lastHour = formatMessage({ id: 'daterangepicker.last_hour' });
    const yesterday = formatMessage({ id: 'daterangepicker.yesterday' });
    const thisWeek = formatMessage({ id: 'daterangepicker.this_week' });
    const last7Days = formatMessage({ id: 'daterangepicker.last_seven_days' });
    const lastWeek = formatMessage({ id: 'daterangepicker.last_week' });
    const thisMonth = formatMessage({ id: 'daterangepicker.this_month' });
    const last30Days = formatMessage({ id: 'daterangepicker.last_thirty_days' });
    const lastMonth = formatMessage({ id: 'daterangepicker.last_month' });
    const customRange = formatMessage({ id: 'daterangepicker.custom_range' });
    if (timeZone) {
      return {
        [today]: [getMomentWithTimeZone().startOf('day'), getMomentWithTimeZone().endOf('day')],
        [yesterday]: [getMomentWithTimeZone().subtract(1, 'day').startOf('day'), getMomentWithTimeZone().subtract(1, 'day').endOf('day')],
        [lastHour]: [getMomentWithTimeZone().subtract(1, 'hour'), getMomentWithTimeZone()],
        [thisWeek]: [getMomentWithTimeZone().startOf('isoweek'), getMomentWithTimeZone().endOf('isoweek')],
        [last7Days]: [getMomentWithTimeZone().subtract(6, 'days').startOf('day'), getMomentWithTimeZone().endOf('day')],
        [lastWeek]: [getMomentWithTimeZone().subtract(1, 'week').startOf('isoweek'), getMomentWithTimeZone().subtract(1, 'week').endOf('isoweek')],
        [thisMonth]: [getMomentWithTimeZone().startOf('month'), getMomentWithTimeZone().endOf('month')],
        [last30Days]: [getMomentWithTimeZone().subtract(29, 'days').startOf('day'), getMomentWithTimeZone().endOf('day')],
        [lastMonth]: [getMomentWithTimeZone().subtract(1, 'month').startOf('month'), getMomentWithTimeZone().subtract(1, 'month').endOf('month')],
        [customRange]: (ranges && chosenLabel) ? [ranges[chosenLabel][0], ranges[chosenLabel][1]] : [],
      };
    }
    return {
      [today]: [moment().startOf('day'), moment().endOf('day')],
      [yesterday]: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
      [lastHour]: [moment().subtract(1, 'hour'), moment()],
      [thisWeek]: [moment().startOf('isoweek'), moment().endOf('isoweek')],
      [last7Days]: [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
      [lastWeek]: [moment().subtract(1, 'week').startOf('isoweek'), moment().subtract(1, 'week').endOf('isoweek')],
      [thisMonth]: [moment().startOf('month'), moment().endOf('month')],
      [last30Days]: [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
      [lastMonth]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      [customRange]: (ranges && chosenLabel) ? [ranges[chosenLabel][0], ranges[chosenLabel][1]] : [],
    };
  }

  calculateChosenLabel(startDate, endDate, datePickerChosenLabel) {
    const { ranges } = this.state;
    const { timePicker, intl } = this.props;
    const { formatMessage } = intl;
    const customRangeLabel = formatMessage({ id: 'daterangepicker.custom_range' });
    const lastHour = formatMessage({ id: 'daterangepicker.last_hour' });
    let customRange = true;
    let { chosenLabel } = this.state;
    const _startDate = moment(startDate)
    const _endDate = moment(endDate)
    for (const range in ranges) {
      if (timePicker) {
        const format = this.timePickerSeconds ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD hh:mm';
        // ignore times when comparing dates if time picker seconds is not enabled
        if (ranges[range] && (_startDate.format(format) === ranges[range][0].format(format)
          && _endDate.format(format) === ranges[range][1].format(format))) {
          customRange = false;
          chosenLabel = range;
          break;
        }
      } else {
        const format = datePickerChosenLabel === lastHour ? 'YYYY-MM-DD hh:mm' : 'YYYY-MM-DD';
        // ignore times when comparing dates if time picker is not enabled
        if (ranges[range] && (ranges[range][0] && (_startDate.format(format) === ranges[range][0].format(format))
          && ranges[range][1] && (_endDate.format(format) === ranges[range][1].format(format)))) {
          customRange = false;
          chosenLabel = range;
          break;
        }
      }
    }
    if (customRangeLabel === datePickerChosenLabel) {
      customRange = false;
      chosenLabel = datePickerChosenLabel;
    }
    chosenLabel = datePickerChosenLabel === lastHour ? lastHour : chosenLabel;
    this.setState({
      chosenLabel,
      dateRange: {
        startDate: _startDate,
        endDate: _endDate,
      },
      ranges: this.Ranges(chosenLabel),
    });
  }

  applyHandler(event, picker) {
    const { onApply, intl } = this.props;
    const { formatMessage } = intl;
    const { ranges } = this.state;
    const _picker = { ...picker };
    let params = {
      date_from: _picker.startDate,
      date_to: _picker.endDate,
    };
    const lastHour = formatMessage({ id: 'daterangepicker.last_hour' });
    if (_picker.chosenLabel === lastHour) {
      params = {
        ...params,
        time_interval: LAST_HOUR_FLAG_VALUE,
        date_from: ranges[_picker.chosenLabel][0],
        date_to: ranges[_picker.chosenLabel][1],
      };
      this.calculateChosenLabel(ranges[_picker.chosenLabel][0], ranges[_picker.chosenLabel][1], lastHour);
    } else {
      params = {
        ...params,
        time_interval: '',
      };
      this.calculateChosenLabel(_picker.startDate, _picker.endDate, _picker.chosenLabel);
    }
    onApply(event, params);
  }

  toggle() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  changeRange(range) {
    const { onApply, intl } = this.props;
    const { formatMessage } = intl;
    const customRange = formatMessage({ id: 'daterangepicker.custom_range' });
    this.setState(
      { dateRange: range, open: false },
      () => {
        this.calculateChosenLabel(moment(range.startDate), moment(range.endDate), customRange);
        onApply(range, { date_from: moment(range.startDate), date_to: moment(range.endDate) });
      },
    );
  }

  onClickCustomRange() {
    this.setState({ open: true });
  }

  render() {
    const {
      classes, locale, showCompareRows, intl, user,
    } = this.props;
    const { formatMessage } = intl;
    const {
      ranges, chosenLabel, open, dateRange,
    } = this.state;
    const customRange = formatMessage({ id: 'daterangepicker.custom_range' });
    const { format } = locale;
    let helperText = '';
    let minDate = '';
    if (chosenLabel === customRange && dateRange) {
      helperText = moment(dateRange.startDate).format(format) + locale.separator + moment(dateRange.endDate).format(format);
    }
    if (_.has(user, 'features.data_retention')) {
      const dataRetention = user.features.data_retention;
      if (dataRetention && _.isNumber(dataRetention)) {
        minDate = getMomentWithTimeZone().subtract(dataRetention, 'month').startOf('day').format('YYYY-MM-DD');
      }
    }

    return (
      <>
        <TextField
          className={classes.rangesList}
          label={showCompareRows ? 'Compare to' : 'Date'}
          fullWidth
          size="small"
          name="date"
          helperText={helperText}
          onChange={(e) => {
            const { value } = e.target;
            this.applyHandler(e, {
              startDate: ranges[value][0],
              endDate: ranges[value][1],
              chosenLabel: e.target.value,
            });
          }}
          select
          SelectProps={{
            value: chosenLabel,
          }}
          variant="outlined"
        >
          {Object.keys(ranges).map((el, index) => (
            <MenuItem
              key={`range_list_${index + 1}`}
              name={el}
              value={el}
              onClick={el === customRange ? this.onClickCustomRange : () => {}}
            >
              {el}
            </MenuItem>
          ))}
        </TextField>
        {chosenLabel === customRange && (
        <DateRangePicker
          minDate={minDate}
          closeOnClickOutside
          open={open}
          wrapperClassName="custom-daterangepicker"
          initialDateRange={{
            startDate: ranges[chosenLabel][0],
            endDate: ranges[chosenLabel][1],
          }}
          toggle={this.toggle}
          onChange={this.changeRange}
        />
        )}
      </>
    );
  }
}

DateRangePickerWidget.propTypes = {
  showCompareRows: PropTypes.bool,
  onApply: PropTypes.func,
  locale: PropTypes.object,
  intl: PropTypes.object,
  classes: PropTypes.object,
  user: PropTypes.object,
};

DateRangePickerWidget.defaultProps = {
  onApply: () => null,
  showCustomRangeLabel: true,
  locale: { format: 'MM-DD-YYYY', separator: ' to ' },
  btnBlock: true,
  showCompareRows: false,
};

const mapStateToProps = (state) => ({
  user: state.accountReducer.user,
});

export default connect(mapStateToProps)(injectIntl(withStyles(styles)(DateRangePickerWidget)));
