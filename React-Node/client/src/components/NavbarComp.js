import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'




export default class NavbarComp extends Component {


  render() {
    return (
      <Navbar bg="none" expand="lg" variant="dark" id='navbar_'>
        
        
          <Nav className="ms-auto justify-content-end !important nav_search_fav" style={{marginRight:"1rem"}}>
            <LinkContainer to="/">
              <Nav.Link className='nav_fav mr-1'>Search</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/Favorites">
              <Nav.Link className='nav_fav mr-1'>Favorites</Nav.Link>
            </LinkContainer>
          </Nav>
        
      </Navbar>
    )
  }
}

