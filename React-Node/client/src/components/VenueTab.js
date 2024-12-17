import React, { Component } from 'react';
import ShowMoreText from "react-show-more-text";
import { BiChevronUp, BiChevronDown } from 'react-icons/bi';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GoogleMap, LoadScript,  MarkerF } from '@react-google-maps/api';


const containerStyle = {
  width: '400px',
  height: '400px'
};

var center_point;


export default class VenueTab extends Component {

  state = {
    map: false,
   


  }



  on_click(isExpanded) {
    console.log(isExpanded);
  }
  show_map = () => {

    this.setState({ map: true }, () => {
      console.log("map value in show_map:", this.state.map)
      console.log(this.props.lat, this.props.lng)

    })

   

    center_point = {lat:Number(this.props.lat),lng:Number(this.props.lng)}

    



  }

  hide_map = () => {

    this.setState({ map: false }, () => {
      console.log("map value in hide_map:", this.state.map)
    })

  }





  render() {

console.log("center point",center_point)

    return (
      <>
        <div className='venue_tab d-flex flex-row justify-content-evenly justify-align-center p-1  mt-3'>

          <div id='venue_left' style={{width:"50%"}} className=" p-3 mr-3 text-center ml-3" >

            {(this.props.venue_name !== undefined && this.props.venue_name !== null) ? <div> <p id='venue_name_heading' className="venue_heading p-0 mt-3 mb-0" >Name</p><p id='venue_name'>{this.props.venue_name}</p> </div> : <div id='hide_div'></div>}
            {(this.props.address !== undefined && this.props.address !== null) ? <div> <p id='address_heading' className="venue_heading p-0 mt-3 mb-0" >Address</p><p id='address'>{this.props.address}</p> </div> : <div id='hide_div'></div>}
            {(this.props.contact !== undefined && this.props.contact !== null) ? <div> <p id='contact_heading' className="venue_heading p-0 mt-3 mb-0" >Phone Number</p><p id='contact'>{this.props.contact}</p> </div> : <div id='hide_div'></div>}


          </div>


          <div id='venue_right' style={{width:"50%"}} className=" p-3 text-center mr-3 ml-3">

            {(this.props.openhours !== undefined && this.props.openhours !== null) ? <div> <p id='openhours_heading' className="venue_heading p-0 mt-3 mb-0" >Open Hours</p>

              <ShowMoreText
                /* Default options */
                lines={2}
                more={<span className="show_more_less"><br />Show more <BiChevronDown /> </span>}
                less={<span className="show_more_less"><br />Show less <BiChevronUp /> </span>}
                className="content-css"
                anchorClass="show-more-less-clickable"
                onClick={this.on_click}
                expanded={false}
                width={350}
                truncatedEndingComponent={"... "} >

                <p id='openhours'>{this.props.openhours}</p></ShowMoreText> </div> : <div id='hide_div'></div>}




            {(this.props.general !== undefined && this.props.general !== null) ? <div> <p id='general_heading' className="venue_heading p-0 mt-3 mb-0" >General Rule</p>

              <ShowMoreText
                /* Default options */
                lines={2}
                more={<span className="show_more_less"><br />Show more <BiChevronDown /> </span>}
                less={<span className="show_more_less"><br />Show less <BiChevronUp /> </span>}
                className="content-css"
                anchorClass="show-more-less-clickable"
                onClick={this.on_click}
                expanded={false}
                width={350}
                truncatedEndingComponent={"... "} >

                <p id='general'>{this.props.general}</p> </ShowMoreText></div> : <div id='hide_div'></div>}




            {(this.props.child !== undefined && this.props.child !== null) ? <div> <p id='child_heading' className="venue_heading p-0 mt-3 mb-0" >Child Rule</p>

              <ShowMoreText
                /* Default options */
                lines={2}
                more={<span className="show_more_less"><br /> Show more <BiChevronDown /> </span>}
                less={<span className="show_more_less"><br />Show less <BiChevronUp /> </span>}
                className="content-css"
                anchorClass="show-more-less-clickable"
                onClick={this.on_click}
                expanded={false}
                width={350}
                truncatedEndingComponent={"... "} >

                <p id='child'>{this.props.child}</p></ShowMoreText> </div> : <div id='hide_div'></div>}


          </div>
</div>
<div>
  
          <div>
            <Button className='d-flex justify-content-center align-items-center p-1 align-middle mt-5 mb-1' style={{marginLeft:"37%", marginRight: "20%"}} width="50%" variant="danger" onClick={this.show_map}>Show venue on Google map</Button>
          </div>
          <div>

            <Modal show={this.state.map} onHide={this.hide_map}>
              <Modal.Header>
                <Modal.Title>Event Venue</Modal.Title>
              </Modal.Header>

              <Modal.Body>             

                <LoadScript googleMapsApiKey="<Your Key>" >
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center_point}
                    zoom={10}>
                    <MarkerF position={center_point} />                  
                  </GoogleMap>
                </LoadScript>

              </Modal.Body>


              <Modal.Footer  >
                <Button id='button_modal' className='me-auto' onClick={this.hide_map}>
                  Close
                </Button>

              </Modal.Footer>
            </Modal>
          </div>




        </div>





      </>
    )
  }
}

