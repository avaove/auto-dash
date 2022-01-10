import React, { Component } from 'react';
import Metric from './Metric'
import { total_automated_tests, total_missing_tests_count, all_labels } from '../Loader.js'

class Metrics extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      executionStatusData: props.executionStatusData,
      position: props.position,
      metricName: props.metricName,
      metricValue: props.metricValue
    }
  }

  render() {
    return (
      <div className="metrics">
        <Metric position="left" metricName="Total Automated Tests" metricValue={total_automated_tests} />
        <Metric position="right" metricName={"Total Tests not in Cycle"} metricValue={total_missing_tests_count} />
        <Metric position="center" metricName="Total Epics" metricValue={all_labels.length} />
      </div>
    )
  }
}

export default Metrics;