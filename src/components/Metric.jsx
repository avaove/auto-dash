import React, { Component } from 'react';

class Metric extends Component {
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
      <div className={this.props.position}>
        <h1 className = "metricVal" style={{ "font-size": "40px" }}>{this.props.metricValue}</h1>
        <h2 className = "metricName" style={{ "font-size": "20px" }}>{this.props.metricName}</h2>
      </div>
    )
  }
}


export default Metric;