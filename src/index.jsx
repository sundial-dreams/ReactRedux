import React, {Component} from "react";
import ReactDOM from "react-dom";
import style from "./test.scss";
import image from "./a.jpg";//导入图片
import Button from "components/Button/button";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.app}>
        <img src={image}/>
        <h1>dpf</h1>
        <Button text="click"/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));