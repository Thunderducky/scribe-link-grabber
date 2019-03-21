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
//   {
// 	"day": "03-20-19 10:40:25",
// 	"ts": 1553096425.0004,
// 	"link": "https://codingbootcamp.hosted.panopto.com/panopto/pages/viewer.aspx?id=a5ea0c8a-b006-4d2b-b819-aa0901061c02",
// 	"activites": [
// 		{
// 			"tsOnPanopto": 14,
// 			"unit": "05-timers",
// 			"activityName": "04-coinflip",
// 			"ts": 1553096439.0007,
// 			"link": "https://github.com/the-coding-boot-camp-at-ut/utaus201902fsf3-ft/blob/master/01-class-content/05-timers/01-activities/04-coinflip/readme.md"
// 		},
// 		{
// 			"tsOnPanopto": 22,
// 			"unit": "05-timers",
// 			"activityName": "08-simpletimer",
// 			"ts": 1553096447.0009,
// 			"link": "https://github.com/the-coding-boot-camp-at-ut/utaus201902fsf3-ft/blob/master/01-class-content/05-timers/01-activities/08-simpletimer/readme.md"
// 		},
// 		{
// 			"tsOnPanopto": 30,
// 			"unit": "05-timers",
// 			"activityName": "09-interval",
// 			"ts": 1553096455.0011,
// 			"link": "https://github.com/the-coding-boot-camp-at-ut/utaus201902fsf3-ft/blob/master/01-class-content/05-timers/01-activities/09-interval/readme.md"
// 		}
// 	]
// },
  setJumpTime(time){
    this.setState({jumpTime: time});
  }
  displayPanopto(currentPanoptoIndex){
	  this.setState({currentPanopto:this.state.urls[currentPanoptoIndex]});
  }
  timeConverter(t) {
	var minutes = Math.floor(t / 60);
	var seconds = t - (minutes * 60);
  
	if (seconds < 10) {
	  seconds = "0" + seconds;
	}
  
	if (minutes === 0) {
	  minutes = "00";
	}
	else if (minutes < 10) {
	  minutes = "0" + minutes;
	}
  
	return minutes + ":" + seconds;
  }
  componentDidMount(){
	  axios.get("/api/activities").then((activity)=>{
		this.setState({urls:activity.data});
		console.log(this.state);
	  }).catch(
		err => {throw err}
	  );
  }
  render() {
	let activityDiv;
	if(this.state.currentPanopto){
		activityDiv = (
		<div className="App">
			<div style={{display:"flex", flexWrap: "wrap"}}>
			<Viewer url={this.state.currentPanopto.link} start={this.state.jumpTime}/>
			<div id="mycollection">
				<ul className="collection">
				{this.state.currentPanopto.activites.map((activity,index)=>{return(
					<LineItem
						title={`${activity.unit} : ${activity.activityName}`}
						startTime={this.timeConverter(activity.tsOnPanopto)}
						click={()=>this.setJumpTime(activity.tsOnPanopto)}
						key={index}
					>
						<a rel="noopener noreferrer" target="_blank" href={activity.link}>Activity Readme</a>
					</LineItem>
				)})}
				</ul>
			</div>
			</div>
		</div>)
	}else{
		activityDiv
	}
	if(this.state.urls.length>0){
		return (
		<div>
			{activityDiv}
			<div style={{display:"flex"}}>
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
