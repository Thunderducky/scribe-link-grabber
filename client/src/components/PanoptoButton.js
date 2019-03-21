import React from "react";

// expected props, reset view
export const PanoptoButton = props => {
  return (
    <div onClick={props.click} className="card blue-grey" style={{flexGrow:1,margin:"0 10px"}}>
		<div>
			{props.day}
		</div>
    </div>
  );
}
