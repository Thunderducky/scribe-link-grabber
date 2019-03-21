import React, { Component } from "react";
import {Viewer} from "./components/Viewer";
import {LineItem} from "./components/LineItem";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor(){
    super();
    this.state = {
	  jumpTime: 0,
	  urls: [],
    };
  }

  setJumpTime(time){
    this.setState({jumpTime: time});
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
	if(this.state.urls.length>0){
		let lastElement = this.state.urls[this.state.urls.length-1]
		return (
			<div className="App">
				<div style={{display:"flex", flexWrap: "wrap"}}>
				<Viewer url={lastElement.link} start={this.state.jumpTime}/>
				<div id="mycollection">
					<ul className="collection">
					{lastElement.activites.map(activity=>(
						<LineItem
							title={`${activity.unit} : ${activity.activityName}`}
							startTime={this.timeConverter(activity.tsOnPanopto)}
							click={()=>this.setJumpTime(activity.tsOnPanopto)}
						>
							<a rel="noopener noreferrer" target="_blank" href={activity.link}>Activity Readme</a>
						</LineItem>
					))}
					</ul>
				</div>
				</div>
			</div>
		);
  }else{
	  return(<div>Loading</div>)
  }
}
}

export default App;
