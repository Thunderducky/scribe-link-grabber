import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import {PanoptoButton} from "./components/PanoptoButton";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {ActivityDiv} from "./components/ActivityDiv"

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
	 //makes sure its a number
    d = Number(d);
	// gets the hours by dividing the seconds by 3600 and flooring it
	//E.G. : 
		//h = Math.floor(4000/3600)
		//h = Math.floor(1.111111111111111)
		//h = 1
	var h = Math.floor(d / 3600);
	//finds the minutes by getting the remainder of the hours then dividing it to get the minutes floors it so it doesn't have decimal spaces for the seconds
	//E.G. 
		//m = Math.floor(4000%3600/60)
		//m = Math.floor(400/60)
		//m = Math.floor(6.666666666666667)
		//m = 6
	var m = Math.floor(d % 3600 / 60);
	//Finds the seconds by getting the remainder of the hours then minutes,
	//E.G.
		//h = Math.floor(4000 % 3600 % 60)
		//h = Math.floor(400 % 60)
		//s = Math.floor(40)
		//s = 40
    var s = Math.floor(d % 3600 % 60);
	//makes sure theres a 0 and if theres more than two number associated w/ the variable it will cut it to be the last two
	//eg
	//return "01" + 			 ":" + "06"				   + ":" + "040"
	//in this case theres 3 numbers in the seconds so it takes the last two numbers which makes it 40
	//return "01:06:40"
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
			<ActivityDiv 
			currentPanopto={this.state.currentPanopto}
			jumpTime = {this.state.jumpTime}
			secondsToHms = {this.secondsToHms}
			setJumpTime = {(time) => this.setJumpTime(time)}
			></ActivityDiv>
		)
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
