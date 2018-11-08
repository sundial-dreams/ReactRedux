import React, {Component} from "react";
import style from "./button.scss";
export default class Button extends Component{
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className={style.button}>
        <button>{this.props.text}</button>
      </div>
    )
  }
}

