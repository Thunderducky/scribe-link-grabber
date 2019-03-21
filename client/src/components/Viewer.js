import React from "react";

// expected props, reset view
export const Viewer = props => {
  const url = `${props.url}&v=1&autoplay=true&start=${props.start}`;
  return (
    <div>
      <iframe title="test" src={url} width="720" height="405" allow="autoplay"></iframe>
    </div>
  );
}
