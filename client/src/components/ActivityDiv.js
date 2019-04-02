import React from "react"
import {Viewer} from "./Viewer"
import {LineItem} from "./LineItem"

// expected props, reset view
export const ActivityDiv = props => {
    return (
        <div className="App" style={{margin:"10px"}}>
            <Viewer url={props.currentPanopto.link} start={props.jumpTime}/>
            <div id="mycollection" className="row">
                <ul className="collection col s12">
                    {props.currentPanopto.activites.map((activity,index)=>{return(
                        <div onClick={()=>props.setJumpTime(activity.tsOnPanopto)}>
                            <LineItem
                                title={`${activity.unit} : ${activity.activityName}`}
                                startTime={props.secondsToHms(activity.tsOnPanopto)}
                                key={index}
                            >
                                <a rel="noopener noreferrer" target="_blank" href={activity.link}>Activity Readme</a>
                            </LineItem>
                        </div>

                    )})}
                </ul>
            </div>
        </div>
    )
}
