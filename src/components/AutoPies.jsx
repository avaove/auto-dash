import React, { Component } from 'react';
import AutoPie from './AutoPie'
import { std_lbls, ext_lbls, ps1_lbls, ps2_lbls, 
  std_to_auto, ext_to_auto, ps1_to_auto, ps2_to_auto, 
  dynamicColorsList, getNumAutomatedTestsForAllLabel, removeTestCaseFromLabel} from '../Loader.js'

class AutoPies extends Component {
  constructor() {
    super();

    this.state = {
      standardNumAutomatedData: {},
      extensionsNumAutomatedData: {},
      psExtensionsActiveNumAutomatedData: {},
      psExtensionsRetiredNumAutomatedData: {},
    }
  }

  getNumAutomatedData() {
    this.setState({
      standardNumAutomatedData: {
        labels: removeTestCaseFromLabel(std_lbls),
        datasets: [{
          label: 'Number of tests automated',
          data: getNumAutomatedTestsForAllLabel(std_to_auto),
          borderWidth: 0.5,
          backgroundColor: dynamicColorsList(std_lbls)
        }]
      }
    });
    this.setState({
      extensionsNumAutomatedData: {
        labels: removeTestCaseFromLabel(ext_lbls),
        datasets: [{
          label: 'Number of tests automated',
          data: getNumAutomatedTestsForAllLabel(ext_to_auto),
          borderWidth: 0.5,
          backgroundColor: dynamicColorsList(ext_lbls)
        }]
      }
    });
    this.setState({
      psExtensionsActiveNumAutomatedData: {
        labels: removeTestCaseFromLabel(ps1_lbls),
        datasets: [{
          label: 'Number of tests automated',
          data: getNumAutomatedTestsForAllLabel(ps1_to_auto),
          borderWidth: 0.5,
          backgroundColor: dynamicColorsList(ps1_lbls)
        }]
      }
    });
    this.setState({
      psExtensionsRetiredNumAutomatedData: {
        labels: removeTestCaseFromLabel(ps2_lbls),
        datasets: [{
          label: 'Number of tests automated',
          data: getNumAutomatedTestsForAllLabel(ps2_to_auto),
          borderWidth: 0.5,
          backgroundColor: dynamicColorsList(ps2_lbls)
        }]
      }
    });
  }

  componentWillMount() {
    this.getNumAutomatedData();
  }

  render() {
    return (
      <div>
        <div class="row pie">
          <AutoPie numAutomatedData={this.state.standardNumAutomatedData} type={"standard"} title="Standard" legendPosition="right" />
          <AutoPie numAutomatedData={this.state.extensionsNumAutomatedData} type={"extensions"} title="Extensions" legendPosition="right" />
        </div>
        <div class="row pie">
          <AutoPie numAutomatedData={this.state.psExtensionsActiveNumAutomatedData} type={"psExtensionsActive"} title="PS Extensions Active" legendPosition="right" />
          <AutoPie numAutomatedData={this.state.psExtensionsRetiredNumAutomatedData} type={"psExtensionsRetired"} title="PS Extension Retired" legendPosition="right" />
        </div>
        <br />
        <br />
      </div>
    )
  }
}

export default AutoPies;