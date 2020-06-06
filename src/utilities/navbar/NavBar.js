import React from 'react';
import {Navbar, Nav } from 'react-bootstrap';
import './NavBar.css';

class NavBar extends React.Component{
  render(){
    return(
      <Navbar expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className={window.location.pathname==="/" && "active-link"} href="/">HOME</Nav.Link>
            <Nav.Link className={window.location.pathname==="/posts" && "active-link"} href="/posts">POSTS</Nav.Link>
            <Nav.Link className={window.location.pathname==="/tags" && "active-link"} href="/tags">TAGS</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar> 
    )
  }
}
export default NavBar;