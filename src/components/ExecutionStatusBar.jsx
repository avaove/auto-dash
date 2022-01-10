import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { fixVersion, lblsToDisplay, std_lbls, ext_lbls, ps1_lbls, ps2_lbls, all_labels, 
          std_to_auto, ext_to_auto, ps1_to_auto, ps2_to_auto, std_to_cycle, ext_to_cycle, ps1_to_cycle, ps2_to_cycle, 
          executionStatusPerLabelRelease, executionStatusPerLabelAdhoc, nonAdhocFailedTests,
          statuses, nonAdhocFails } from '../Loader.js';

let currentCycle = 'Release Candidate';

class ExecutionStatusBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      executionStatusData: {
        labels: lblsToDisplay,
        datasets: executionStatusPerLabelRelease
      },
      totalAutomatedTestsPerLabel: props.totalAutomatedTestsPerLabel,
      position: props.position,

    }
    this.onToggle1 = this.onToggle1.bind(this);
    this.onToggle2 = this.onToggle2.bind(this);
    this.onToggle3 = this.onToggle3.bind(this);
    this.makeBtnActive = this.makeBtnActive.bind(this);
    this.onclick = this.onclick.bind(this);
    this.getMissingTests = this.getMissingTests.bind(this);
  }

  makeBtnActive(id) {
    var btns = document.getElementsByClassName("btn");
    for (const btn of btns) btn.classList.remove("btn-active");
    var clickedBtn = document.getElementById("release");
    clickedBtn.classList.add("btn-active");
  }

  onToggle1() {
    this.setState({
      executionStatusData: {
        labels: lblsToDisplay,
        datasets: executionStatusPerLabelRelease
      },
    });
    currentCycle = 'Release Candidate'
    var btns = document.getElementsByClassName("btn");
    for (const btn of btns) btn.classList.remove("btn-active");
    var clickedBtn = document.getElementById("release");
    clickedBtn.classList.add("btn-active");
  }
  onToggle2() {
    this.setState({
      executionStatusData: {
        labels: lblsToDisplay,
        datasets: executionStatusPerLabelAdhoc
      },
    });
    currentCycle = 'Ad hoc';
    var btns = document.getElementsByClassName("btn");
    for (const btn of btns) btn.classList.remove("btn-active");
    var clickedBtn = document.getElementById("adhoc");
    clickedBtn.classList.add("btn-active");
  }
  onToggle3() {
    this.setState({
      executionStatusData: {
        labels: lblsToDisplay,
        datasets: nonAdhocFailedTests
      },
    });
    currentCycle = 'Non Ad hoc Fails'
    var btns = document.getElementsByClassName("btn");
    for (const btn of btns) btn.classList.remove("btn-active");
    var clickedBtn = document.getElementById("non-adhoc-fails");
    clickedBtn.classList.add("btn-active");
  }

  getMissingTests(label) {
    // show issues that are mismatching between "in cycle" and "auto complete"
    let automatedIssues = [], cycledIssues = [], missingTests = [];
    if (std_lbls.includes(label)) {
      automatedIssues = std_to_auto[label];
      cycledIssues = std_to_cycle[label];
    } else if (ext_lbls.includes(label)) {
      automatedIssues = ext_to_auto[label];
      cycledIssues = ext_to_cycle[label];
    } else if (ps1_lbls.includes(label)) {
      automatedIssues = ps1_to_auto[label];
      cycledIssues = ps1_to_cycle[label];
    } else if (ps2_lbls.includes(label)) {
      automatedIssues = ps2_to_auto[label];
      cycledIssues = ps2_to_cycle[label];
    }
    for (let issueId of automatedIssues) {
      if (!cycledIssues.includes(issueId)) {
        missingTests.push(issueId)
      }
    }
    //formate issue ids to be used in the url e.g. (53800%2C46878%2C46877%2C46876%2C46875)
    let missingIssuesTuple = ''
    for (let issue of missingTests)
      missingIssuesTuple += issue + "%2C";
    //remove last %2C 
    if (missingIssuesTuple.includes("%2C"))
      missingIssuesTuple = missingIssuesTuple.slice(0, missingIssuesTuple.length - 3)
    return missingIssuesTuple;
  }

  onclick(evt, element) {
    if (element.length > 0) {
      var statusInd = element[0].datasetIndex;
      var label = all_labels[element[0].index];
      //dynamically generate query link -- change current cycle to something else
      if (!(currentCycle == 'Non Ad hoc Fails')) {
        if (statuses[statusInd] != "NOT IN CYCLE") {
          window.open("https://fake/jira/url/to/labels/" + label + "project/release/and/fix/version/" + fixVersion + "/and/cycle/name/" + currentCycle + "and/execution/statuses/" + statuses[statusInd] + "%22&view=list&searchType=basic");
        } else {
          window.open("https://fake/jira/url/to/issue/keys/within/this/list(" + this.getMissingTests(label) + ")");
        }
      } else {
        window.open("https://fake/jira/url/to/issue/keys/within/this/list(" + nonAdhocFails[label] + ")");
      }
    }
  }

  render() {
    return (
      <div className="chart">
        <button type="button" class="btn btn-secondary btn-sm" style={{ "margin": "5px" }} onClick={this.onToggle1.bind(this)} id="release">Release Candidate</button>
        <button type="button" class="btn btn-secondary btn-sm" style={{ "margin": "5px" }} onClick={this.onToggle2.bind(this)} id="adhoc">Ad hoc</button>
        <button type="button" class="btn btn-secondary btn-sm" style={{ "margin": "5px"}} onClick={this.onToggle3.bind(this)} id="non-adhoc-fails">Non Ad hoc Fails or CRC Fails</button>
        <br/>
        <br/>
        <Bar id="executionStatus"
          data={this.state.executionStatusData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  footer: (context) => {
                    if (this.props.totalAutomatedTestsPerLabel === undefined) { return }
                    let indexOfLabelHovered = context[0].dataIndex;
                    return 'Total: ' + this.props.totalAutomatedTestsPerLabel[indexOfLabelHovered];

                  }
                }
              }
            },
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: false,
              text: 'Execution Status per Label',
              fontSize: 25
            },
            responsive: true,
            indexAxis: 'y',
            scales: {
              x: {
                stacked: true,
                barPercentage: 0.2,
                ticks: {
                  autoSkip: false
                }
              },
              y: {
                stacked: true,
                ticks: {
                  autoSkip: false
                }
              }
            },
            legend: {
              display: false,
              position: 'bottom'
            },
            onClick: this.onclick
          }}
        />
      </div>
    )
  }
}

export default ExecutionStatusBar;