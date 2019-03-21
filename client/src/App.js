import React, { Component } from 'react';
import {Viewer} from "./components/Viewer";
import {LineItem} from "./components/LineItem";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      jumpTime: 0,
    };
  }

  setJumpTime(time){
    this.setState({jumpTime: time});
  }

  render() {
    return (
      <div className="App">
        <div style={{display:"flex", flexWrap: "wrap"}}>
          <Viewer start={this.state.jumpTime}/>
          <div id="mycollection">
            <ul class="collection">
              <LineItem
                title="Activity 1: Introducing Github with Teams"
                startTime="0:00"
              >
                <a rel="noopener noreferrer" target="_blank" href="https://github.com/the-Coding-Boot-Camp-at-UT/UTAUS201902FSF3-FT/blob/master/01-class-content/08-project-1/01-Activities/01-Stu_Create-Repository/README.md">Activity Readme</a>
              </LineItem>
              <LineItem
                title="Creating the Repository"
                startTime="1:50"
                click={() => this.setJumpTime(110)}>
              </LineItem>
              <LineItem
                title="Protecting the master branch"
                startTime="5:17"
                click={() => this.setJumpTime(317)}>
              </LineItem>
              <LineItem
                title="Feature Branches"
                startTime="6:18"
                click={() => this.setJumpTime(378)}>
              </LineItem>
              <LineItem
                title="Pull Requests"
                startTime="12:00"
                click={() => this.setJumpTime(720)}>
              </LineItem>
              <LineItem
                title="Proposals"
                startTime="13:07"
                click={() => this.setJumpTime(787)}>
              </LineItem>
              <LineItem
                title="Presentations"
                startTime="13:31"
                click={() => this.setJumpTime(811)}>
              </LineItem>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
