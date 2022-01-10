let metadata = require('./data/metadata.json');
let fixVersion = metadata["fixVersion"];
let std_lbls = metadata["standard"];
let ext_lbls = metadata["extensions"];
let ps1_lbls = metadata["ps_extensions_active"];
let ps2_lbls = metadata["ps_extensions_retired"];
let all_labels = std_lbls.concat(ext_lbls).concat(ps1_lbls).concat(ps2_lbls);
let lblsToDisplay = removeTestCaseFromLabel(std_lbls).concat(removeTestCaseFromLabel(ext_lbls)).concat(removeTestCaseFromLabel(ps1_lbls)).concat(removeTestCaseFromLabel(ps2_lbls));

let std_to_auto = require('./data/standard_label_to_automated_issue_ids.json');
let ext_to_auto = require('./data/extensions_label_to_automated_issue_ids.json');
let ps1_to_auto = require('./data/ps_extensions_active_label_to_automated_issue_ids.json');
let ps2_to_auto = require('./data/ps_extensions_retired_label_to_automated_issue_ids.json');
let std_to_cycle = require('./data/standard_label_to_cycled_issue_ids.json');
let ext_to_cycle = require('./data/extensions_label_to_cycled_issue_ids.json');
let ps1_to_cycle = require('./data/ps_extensions_active_label_to_cycled_issue_ids.json');
let ps2_to_cycle = require('./data/ps_extensions_retired_label_to_cycled_issue_ids.json');
let std_to_status = require('./data/standard_label_to_execution_statuses.json');
let ext_to_status = require('./data/extensions_label_to_execution_statuses.json');
let ps1_to_status = require('./data/ps_extensions_active_label_to_execution_statuses.json');
let ps2_to_status = require('./data/ps_extensions_retired_label_to_execution_statuses.json');
let ext_to_cycle_adhoc = require('./data/extensions_label_to_cycled_issue_ids_adhoc.json');
let ext_to_status_adhoc = require('./data/extensions_label_to_execution_statuses_adhoc.json');
let ps1_to_cycle_adhoc = require('./data/ps_extensions_active_label_to_cycled_issue_ids_adhoc.json');
let ps1_to_status_adhoc = require('./data/ps_extensions_active_label_to_execution_statuses_adhoc.json');
let ps2_to_cycle_adhoc = require('./data/ps_extensions_retired_label_to_cycled_issue_ids.json');
let ps2_to_status_adhoc = require('./data/ps_extensions_retired_label_to_execution_statuses_adhoc.json');
let std_to_cycle_adhoc = require('./data/standard_label_to_cycled_issue_ids_adhoc.json');
let std_to_status_adhoc = require('./data/standard_label_to_execution_statuses_adhoc.json');
let label_to_failed_tests_release = require('./data/label_to_failed_tests_release.json');

let totalAutoPerLabel = []; // list of total automated test for all labels
let allAuto = new Set(); // list of all unique automated issues
let allCycle = new Set(); // list of all unique cycled issues 
let total_automated_tests, total_missing_tests_count;


for (const label of std_lbls) {
  for (const issue of std_to_auto[label]) allAuto.add(issue);
  for (const issue of std_to_cycle[label]) allCycle.add(issue);
  totalAutoPerLabel.push(std_to_auto[label].length);
}
for (const label of ext_lbls) {
  for (const issue of ext_to_auto[label]) allAuto.add(issue);
  for (const issue of ext_to_cycle[label]) allCycle.add(issue);
  totalAutoPerLabel.push(ext_to_auto[label].length);
}
for (const label of ps1_lbls) {
  for (const issue of ps1_to_auto[label]) allAuto.add(issue);
  for (const issue of ps1_to_cycle[label]) allCycle.add(issue);
  totalAutoPerLabel.push(ps1_to_auto[label].length);
}
for (const label of ps2_lbls) {
  for (const issue of ps2_to_auto[label]) allAuto.add(issue);
  for (const issue of ps2_to_cycle[label]) allCycle.add(issue);
  totalAutoPerLabel.push(ps2_to_auto[label].length);
}

total_automated_tests = getTotalAutomatedTests();
total_missing_tests_count = allAuto.size - allCycle.size; // difference between lengths of allAuto set and allCycledIssues set

let status_to_nums = {
    "release": {
        "PASS": [], "FAIL": [], "WIP": [], "CONDITIONAL PASS": [], "UNEXECUTED": [], "BLOCKED": [], "NOT IN CYCLE": [], "CRC FAILURE": []
    }, "adhoc": {
        "PASS": [], "FAIL": [], "WIP": [], "CONDITIONAL PASS": [], "UNEXECUTED": [], "BLOCKED": [], "CRC FAILURE": []
    }  
}

// get total automated test counts and num automated per label
let allCycledIssuesRelease = new Set(); // list of all unique cycled issues no overlap
let allCycledIssuesAdhoc = new Set(); // list of all unique cycled issues no overlap
let executionStatusPerLabelRelease;
let executionStatusPerLabelAdhoc;
let nonAdhocFailedTests; // to obe graphed
let statuses = ["PASS", "FAIL", "CRC FAILURE", "WIP", "CONDITIONAL PASS", "UNEXECUTED", "BLOCKED", "NOT IN CYCLE"];
let all_adhoc_issues = []; //to check failed tests not added to adhoc
let nonAdhocFails = []; // maps label to 1782&38903&283 -> for url
var label_to_execution_status_lists = [std_to_status, ext_to_status, ps1_to_status, ps2_to_status];

for (const label_to_execution_status_list of label_to_execution_status_lists) {
  for (const label in label_to_execution_status_list) {
    status_to_nums["release"]["PASS"].push(label_to_execution_status_list[label]["PASS"]);
    status_to_nums["release"]["FAIL"].push(label_to_execution_status_list[label]["FAIL"]);
    status_to_nums["release"]["CRC FAILURE"].push(label_to_execution_status_list[label]["CRC FAILURE"]);
    status_to_nums["release"]["WIP"].push(label_to_execution_status_list[label]["WIP"]);
    status_to_nums["release"]["CONDITIONAL PASS"].push(label_to_execution_status_list[label]["CONDITIONAL PASS"]);
    status_to_nums["release"]["UNEXECUTED"].push(label_to_execution_status_list[label]["UNEXECUTED"]);
    status_to_nums["release"]["BLOCKED"].push(label_to_execution_status_list[label]["BLOCKED"]);
    status_to_nums["release"]["NOT IN CYCLE"].push(label_to_execution_status_list[label]["NOT IN CYCLE"]);
  }
}
var label_to_execution_status_lists = [std_to_status_adhoc, ext_to_status_adhoc, ps1_to_status_adhoc, ps2_to_status_adhoc];
for (const label_to_execution_status_list of label_to_execution_status_lists) {
  for (const label in label_to_execution_status_list) {
    status_to_nums["adhoc"]["PASS"].push(label_to_execution_status_list[label]["PASS"]);
    status_to_nums["adhoc"]["FAIL"].push(label_to_execution_status_list[label]["FAIL"]);
    status_to_nums["adhoc"]["CRC FAILURE"].push(label_to_execution_status_list[label]["CRC FAILURE"]);
    status_to_nums["adhoc"]["WIP"].push(label_to_execution_status_list[label]["WIP"]);
    status_to_nums["adhoc"]["CONDITIONAL PASS"].push(label_to_execution_status_list[label]["CONDITIONAL PASS"]);
    status_to_nums["adhoc"]["UNEXECUTED"].push(label_to_execution_status_list[label]["UNEXECUTED"]);
    status_to_nums["adhoc"]["BLOCKED"].push(label_to_execution_status_list[label]["BLOCKED"]);
  }
}
for (const label of std_lbls) {
  for (const issue of std_to_cycle[label]) allCycledIssuesRelease.add(issue);
  for (const issue of std_to_cycle_adhoc[label]) allCycledIssuesAdhoc.add(issue); 
  for (const issue of std_to_cycle_adhoc[label]) if (!(all_adhoc_issues.includes(issue))) all_adhoc_issues.push(issue);
}

for (const label of ext_lbls) {
  for (const issue of ext_to_cycle[label]) allCycledIssuesRelease.add(issue);
  for (const issue of ext_to_cycle_adhoc[label]) allCycledIssuesAdhoc.add(issue); 
  for (const issue of ext_to_cycle_adhoc[label]) if (!(all_adhoc_issues.includes(issue))) all_adhoc_issues.push(issue);
}

for (const label of ps1_lbls) {
  for (const issue of ps1_to_cycle[label]) allCycledIssuesRelease.add(issue);
  for (const issue of ps1_to_cycle_adhoc[label]) allCycledIssuesAdhoc.add(issue); 
  for (const issue of ps1_to_cycle_adhoc[label]) if (!(all_adhoc_issues.includes(issue))) all_adhoc_issues.push(issue);
}
for (const label of ps2_lbls) {
  for (const issue of ps2_to_cycle[label]) allCycledIssuesRelease.add(issue);
  for (const issue of ps2_to_cycle_adhoc[label]) allCycledIssuesAdhoc.add(issue);
  for (const issue of ps2_to_cycle_adhoc[label]) if (!(all_adhoc_issues.includes(issue))) all_adhoc_issues.push(issue);
}

executionStatusPerLabelRelease = [
  { label: 'PASS', data: status_to_nums["release"]["PASS"], backgroundColor: '#75B000' },
  { label: 'FAIL', data: status_to_nums["release"]["FAIL"], backgroundColor: '#CC3300' },
  { label: 'CRC Failure', data: status_to_nums["release"]["CRC Failure"], backgroundColor: '#ff6600' },
  { label: 'WIP', data: status_to_nums["release"]["WIP"], backgroundColor: '#F2B000' },
  { label: 'CONDITIONAL PASS', data: status_to_nums["release"]["CONDITIONAL PASS"], backgroundColor: '#ccff00' },
  { label: 'UNEXECUTED', data: status_to_nums["release"]["UNEXECUTED"], backgroundColor: '#A0A0A0' },
  { label: 'BLOCKED', data: status_to_nums["release"]["BLOCKED"], backgroundColor: '#6693B0' },
  { label: 'NOT IN CYCLE', data: status_to_nums["release"]["NOT IN CYCLE"], backgroundColor: '#A667D2' },
]
executionStatusPerLabelAdhoc = [
  { label: 'PASS', data: status_to_nums["adhoc"]["PASS"], backgroundColor: '#75B000' },
  { label: 'FAIL', data: status_to_nums["adhoc"]["FAIL"], backgroundColor: '#CC3300' },
  { label: 'CRC Failure', data: status_to_nums["adhoc"]["CRC FAILURE"], backgroundColor: '#ff6600' },
  { label: 'WIP', data: status_to_nums["adhoc"]["WIP"], backgroundColor: '#F2B000' },
  { label: 'CONDITIONAL PASS', data: status_to_nums["adhoc"]["CONDITIONAL PASS"], backgroundColor: '#ccff00' },
  { label: 'UNEXECUTED', data: status_to_nums["adhoc"]["UNEXECUTED"], backgroundColor: '#A0A0A0' },
  { label: 'BLOCKED', data: status_to_nums["adhoc"]["BLOCKED"], backgroundColor: '#6693B0' }
]

//get list of all tests added to adhoc
var label_to_failed_non_adhoc_issues = {}
var num_failed_non_adhoc_per_label = []
for (const label of Object.keys(label_to_failed_tests_release)) {
  label_to_failed_non_adhoc_issues[label] = []
  nonAdhocFails[label] = ''
  for (const issue of label_to_failed_tests_release[label]) {
    if (!all_adhoc_issues.includes(issue)) {
      label_to_failed_non_adhoc_issues[label].push(issue);
      nonAdhocFails[label] = nonAdhocFails[label] + issue + "%2C";
    }
  }
  //remove the last &
  if (nonAdhocFails[label].includes("%2C"))
    nonAdhocFails[label] = nonAdhocFails[label].slice(0, nonAdhocFails[label].length - 3)
  num_failed_non_adhoc_per_label.push(label_to_failed_non_adhoc_issues[label].length)
}
nonAdhocFailedTests = [
  {
    label: 'NON ADHOC FAIL or CRC FAIL', data: num_failed_non_adhoc_per_label, backgroundColor: '#ff6666'
  }
]

// get total automated tests by summing the number of tests automated for each label (all labels under standard, extensions, ps extensions active and retired)
// takes into account tests that have multiple labels assigned to them
function getTotalAutomatedTests() {
  var allallAuto = [];
  for (const label of std_lbls) {
    for (const issue of std_to_auto[label]) if (!allallAuto.includes(issue)) allallAuto.push(issue)
  }
  for (const label of ext_lbls) {
    for (const issue of ext_to_auto[label]) {
      if (!allallAuto.includes(issue)) allallAuto.push(issue)
    }
  }
  for (const label of ps1_lbls) {
    for (const issue of ps1_to_auto[label]) {
      if (!allallAuto.includes(issue)) allallAuto.push(issue)
    }
  }
  for (const label of ps2_lbls) {
    for (const issue of ps2_to_auto[label]) {
      if (!allallAuto.includes(issue)) allallAuto.push(issue)
    }
  }
  return allallAuto.length;
}

export function dynamicColorsList(lst) {
    var colorList = [];
    for (var i in lst) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        colorList.push("rgb(" + r + "," + g + "," + b + ")");
    }
    return colorList;
};

export function getNumAutomatedTestsForAllLabel(label_to_automated_issue_ids) {
    var numAutomated = [];
    for (const label in label_to_automated_issue_ids) numAutomated.push(label_to_automated_issue_ids[label].length);
    return numAutomated;
}

export function removeTestCaseFromLabel(labelLst) {
    var outLst = []
    for (const label of labelLst) {
        if (label.includes('_Test_Cases'))
        outLst.push(label.slice(0, label.length - 11))
        else
        outLst.push(label)
    }
    return outLst;
}

export { fixVersion, 
        std_lbls, ext_lbls, ps1_lbls, ps2_lbls, all_labels, lblsToDisplay, 
        std_to_auto, ext_to_auto, ps1_to_auto, ps2_to_auto, 
        std_to_cycle, ext_to_cycle, ps1_to_cycle, ps2_to_cycle, 
        std_to_status, ps1_to_status, ps2_to_status, ext_to_status, 
        ext_to_cycle_adhoc, ext_to_status_adhoc, ps1_to_cycle_adhoc, ps1_to_status_adhoc, ps2_to_cycle_adhoc, 
        ps2_to_status_adhoc, std_to_cycle_adhoc ,std_to_status_adhoc, 
        label_to_failed_tests_release,
        totalAutoPerLabel, allAuto, allCycle, total_automated_tests, total_missing_tests_count, 
        allCycledIssuesRelease, allCycledIssuesAdhoc, all_adhoc_issues, 
        executionStatusPerLabelRelease, executionStatusPerLabelAdhoc, 
        nonAdhocFailedTests, status_to_nums, statuses, nonAdhocFails, label_to_execution_status_lists };

    