import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

let metadata = require('../data/metadata.json');
let standard_labels = metadata["standard"];
let extensions_labels = metadata["extensions"];
let ps_extensions_active_labels = metadata["ps_extensions_active"];
let ps_extensions_retired_labels = metadata["ps_extensions_retired"];

class AutoPie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numAutomatedData: props.numAutomatedData,
      type: props.type,
      title: props.title,
      legendPosition: props.legendPosition
    }
    this.onclick = this.onclick.bind(this);
  }

  onclick(evt, element) {
    if (element.length > 0) {
      console.log(evt.chart);
      var labelClicked = '';
      if (this.state.type == "standard")  
        var labelClicked = standard_labels[element[0].index];
      if (this.state.type == "extensions")  
        var labelClicked = extensions_labels[element[0].index];
      if (this.state.type == "psExtensionsActive")  
        var labelClicked = ps_extensions_active_labels[element[0].index];
      if (this.state.type == "psExtensionsRetired")
        var labelClicked = ps_extensions_retired_labels[element[0].index];
      window.open("https://fake/jira/url/to/labels/within/" + labelClicked + "/and/status/of/automation/complete");
    }
  }


  render() {
    return (
      <div className={this.props.type, "col-lg-6 col-md-6 col-xs-6"}>
        <Pie
          data={this.state.numAutomatedData}
          options={{
            pointHitDetectionRadius: 1,
            plugins: {
              tooltips: {
                mode: 'neareest',
                intersect: false
              },
              legend: {
                display: true,
                position: this.props.legendPosition
              },
              title: {
                display: true,
                text: this.props.title,
                fontSize: 30,
                position: 'left',
                font: {
                  size: 18,
                  weight: 'bold',
                  lineHeight: 1.5,
                },
              },
            },
            maintainAspectRatio: false,
            responsive: true,
            onClick: this.onclick
          }}
        />
      </div>
    )
  }
}


export default AutoPie;