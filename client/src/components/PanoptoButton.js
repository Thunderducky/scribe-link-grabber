import React from "react";

// expected props, reset view
export const PanoptoButton = props => {
  return (
    <div className="card blue-grey" style={{flexGrow:1,margin:"10px"}}>
		<div onClick={props.click} className={!props.isActive ? "line-item-title" : "line-item-title-active"}>
			{props.day}
		</div>
    </div>
  );
}
