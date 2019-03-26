import React, { Component } from "react";
import {Viewer} from "./components/Viewer";
import {LineItem} from "./components/LineItem";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import {PanoptoButton} from "./components/PanoptoButton";

class App extends Component {
  constructor(){
    super();
    this.state = {
	  jumpTime: 0,
	  urls: [],
	  currentPanopto: null
    };
  }
  setJumpTime(time){
    this.setState({jumpTime: time});
  }
  displayPanopto(currentPanoptoIndex){
	  this.setState({currentPanopto:this.state.urls[currentPanoptoIndex]});
  }
  
 secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}
  componentDidMount(){
	  axios.get("/api/activities").then((activity)=>{
		this.setState({urls:activity.data});
	  }).catch(
		err => {throw err}
	  );
  }
  render() {
	let activityDiv;
	if(this.state.currentPanopto){
		activityDiv = (
		<div className="App" style={{margin:"10px"}}>
			<Viewer url={this.state.currentPanopto.link} start={this.state.jumpTime}/>
			<div id="mycollection" className="row">
				<ul className="collection col s12">
				{this.state.currentPanopto.activites.map((activity,index)=>{return(
					<LineItem
						title={`${activity.unit} : ${activity.activityName}`}
						startTime={this.secondsToHms(activity.tsOnPanopto)}
						click={()=>this.setJumpTime(activity.tsOnPanopto)}
						key={index}
					>
						<a rel="noopener noreferrer" target="_blank" href={activity.link}>Activity Readme</a>
					</LineItem>
				)})}
				</ul>
			</div>
		</div>)
	}
	if(this.state.urls.length>0){
		return (
		<div className="container">
			{activityDiv}
			<div style={{display:"flex",flexWrap:"wrap",marginBottom:"10px"}}>
				{this.state.urls.map((panopto,index)=>{return(
					<PanoptoButton
					key={index}
					day={panopto.day}
					click={()=>this.displayPanopto(index)}
					></PanoptoButton>
				)})}
			</div>
		</div>
	)
  }else{
	  return(<div>Loading</div>)
  }
}
}

export default App;
