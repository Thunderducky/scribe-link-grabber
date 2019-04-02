import React from "react"

// expected props, reset view
export const PanoptoButton = props => {
    return (
        <div className="card blue-grey" style={{margin:"10px",padding:"20px",flexGrow:"1"}}>
            <div onClick={props.click} className={!props.isActive ? "line-item-title" : "line-item-title-active"}>
                {props.day}
            </div>
        </div>
    )
}
