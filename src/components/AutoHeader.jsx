import React, { Component } from 'react';

class AutoHeader extends Component {
  render() {
    return (
      <div className={this.props.position}>
        <h1 className="title" style={{ "padding-bottom": "5px", "padding-top": "100px" }}>Automation Coverage</h1>
        <h3 className="subtitle" >Automation Complete Count per Label</h3>
        <p style={{ "font-size": "18px", "margin": "50px", "font-family": "Helvetica", "color": "#00897b"}}>Clicking on a pie slice opens a Jira query of all automated tests within the label chosen.</p>
      </div>
    )
  }
}

export default AutoHeader;