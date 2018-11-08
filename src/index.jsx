import React, {Component} from "react";
import ReactDOM from "react-dom";
import style from "./test.scss";
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.app}>
        <h1>using devServer</h1>
        <span>using devServers</span>
        <h2>using hello world</h2>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));