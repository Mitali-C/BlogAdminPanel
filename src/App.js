import React from 'react';
import './App.css';
import Home from './components/home/Home';
import Posts from './components/posts/Posts';
import Tags from './components/tags/Tags';
import Navbar from './utilities/navbar/NavBar';
import {Container} from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component{
  render(){
    return(
      <>
        <Container className="App">
          <h1 style={{textAlign:'center', fontFamily:"'Karla', sans-serif"}}>BLOG NAME</h1>
          <Navbar/>
          <hr/>
          <Router>
            <Switch>
              <Route path="/posts" component={Posts}></Route>
              <Route path="/tags" component={Tags}></Route>
              <Route path="/" component={Home}></Route>
            </Switch>
          </Router>
        </Container>
        </>
      )
  }
}

export default App;
