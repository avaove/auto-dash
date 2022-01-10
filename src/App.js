import './App.css';
import React, { Component } from 'react';
import AutoPies from './components/AutoPies'
import ExecutionStatusBar from './components/ExecutionStatusBar'
import Metrics from './components/Metrics'
import AutoHeader from './components/AutoHeader'
import ExecutionStatusHeader from './components/ExecutionStatusHeader'
import { totalAutoPerLabel} from './Loader.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header" style={{ marginBottom: "5%" }}></header>
        <AutoHeader/>
        <Metrics/>
        <AutoPies/>
        
        <ExecutionStatusHeader/>
        <ExecutionStatusBar totalAutoPerLabel={totalAutoPerLabel} />
        <div style={{ "width": "5px", "height": "1700px" }}></div>
        <header className="App-header footer"></header>
      </div >
    )
  };
}

export default App;