import React from "react";
const NOOP = () => {};
// expected props, reset view
export const LineItem = props => {
  return (
    <li className="card blue-grey" style={{margin:15, padding: 5}}>
      <div className={!props.isActive ? "line-item-title" : "line-item-title-active"}>
        {props.startTime} - {props.title || "(unlabelled)"}
      </div>
      <div >
        {props.children}
      </div>

    </li>
  );
}
