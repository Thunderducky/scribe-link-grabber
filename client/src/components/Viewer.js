import React from "react";

// expected props, reset view
export const Viewer = props => {
  const url = `${props.url}&v=1&autoplay=true&start=${props.start}`;
  return (
    <div className="row col s12">
      <iframe title="test" src={url} width="1000" height="1000" allow="autoplay"></iframe>
    </div>
  );
}
