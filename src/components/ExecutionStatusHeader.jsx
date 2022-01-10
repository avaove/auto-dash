import React, { Component } from 'react';

let metadata = require('../data/metadata.json');
let fixVersion = metadata["fixVersion"];

class ExecutionStatusHeader extends Component {
  render() {
    return (
      <div className={this.props.position}>
        <h1 className="title" style={{ "padding-bottom": "5px", "padding-top": "150px" }}>Executions Status per Label</h1>
        <h3 className="subtitle">Version: {fixVersion} - Cycle: Release Candidate/Ad hoc</h3>
        <p style={{ "font-size": "12px" }}>Note: DAP Products, and other product installations are not included in the view as there are no automated tests for them.</p>
        <p style={{ "font-size": "18px", "padding-bottom": "50px", "font-family": "Helvetica", "color": "#00897b", "margin": "50px"}}>
          Clicking on any portion of the bars opens a Zephyr query with the information chosen.
        </p>
      </div>
    )
  }
}

export default ExecutionStatusHeader;