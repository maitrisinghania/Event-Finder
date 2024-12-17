import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';



import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';



export default class EventsTab extends Component {

    state = {
        note: "",
    }



    async componentDidMount() {
        console.log("event tab did mount", this.props)

        await this.update_note();
        console.log("note:", this.state.note)
    }


    update_note = () => {

        var final;

        if (this.props.name !== null && this.props.name !== "") {

            final = "Check " + this.props.name + " on Ticketmaster.";
            this.setState({ note: final })
        } else {
            final = "Check " + this.props.details_data.name + " on Ticketmaster.";
            this.setState({ note: final })
        }
        console.log("enetered update note:", this.props.name)
        console.log("note:", this.state.note)
    }

    render() {
        return (
            <>
            <div id='event_tab'>

                <div className='d-flex flex-row justify-content-evenly mt-5'>

                    <div id='event_details' className='text-center'>

                        {(this.props.date !== undefined && this.props.date !== null) ? <div> <p className='mb-0 p-0 heading' id='date_heading'>Date</p><p id='date'>{this.props.date}</p> </div> : <div id='hide_div'></div>}

                        {(this.props.artists !== undefined && this.props.artists !== null) ? <div> <p className='mb-0 p-0 heading' id='artists_heading'>Artist/Team</p><p id='artists'>{this.props.artists}</p> </div> : <div id='hide_div'></div>}

                        {(this.props.venue_name !== undefined && this.props.venue_name !== null) ? <div> <p className='mb-0 p-0 heading' id='venue_name_heading'>Venue</p><p id='venue'>{this.props.venue_name}</p> </div> : <div id='hide_div'></div>}

                        {(this.props.genres !== undefined && this.props.genres !== null) ? <div> <p className='mb-0 p-0 heading' id='genres_heading'>Genres</p><p id='genres'>{this.props.genres}</p> </div> : <div id='hide_div'></div>}

                        {(this.props.price !== undefined && this.props.price !== null) ? <div> <p className='mb-0 p-0 heading' id='price_heading'>Price</p><p id='price'>{this.props.price}</p> </div> : <div id='hide_div'></div>}

                        {(this.props.status === undefined && this.props.status === null) ? <div id='hide_div'></div> :
                            (this.props.status) === "onsale" ? <div> <p className='mb-0 p-0 heading' id='status_heading'>Ticket Status</p> <Button className='p-1 text-sm  'variant="success" id='status'>On Sale</Button> </div> :
                            (this.props.status) === "offsale" ? <div> <p className='mb-0 p-0 heading' id='status_heading'>Ticket Status</p> <Button className='p-1 text-sm'variant="danger" id='status'>Off Sale</Button> </div> :
                            (this.props.status) === "canceled" ? <div> <p className='mb-0 p-0 heading' id='status_heading'>Ticket Status</p> <Button className='p-1 text-sm' variant="dark" id='status'>Canceled</Button> </div> :
                            (this.props.status) === "postponed" ? <div> <p className='mb-0 p-0 heading' id='status_heading'>Ticket Status</p> <Button className='p-1 text-sm' variant="warning" id='status'>postponed</Button> </div> :
                            (this.props.status) === "rescheduled" ? <div> <p className='mb-0 p-0 heading' id='status_heading'>Ticket Status</p> <Button className='p-1 text-sm' variant="warning" id='status'>rescheduled</Button> </div> : <></>}

                        {/*  eslint-disable-next-line */}
                        {(this.props.ticket !== undefined && this.props.ticket !== null) ? <div> <p className='mt-3 mb-0 p-0 heading' id='ticket_heading'>Buy Ticket At</p> <a className='mt-0' id='ticket' href={this.props.ticket} target="_blank" >Ticketmaster</a> </div> : <div id='hide_div'></div>}

                    </div>
                    <div  >
                        {(this.props.seatmap !== undefined && this.props.seatmap !== null) ? <div className='d-flex justify-content-center'> <img  src={this.props.seatmap} alt="" style={{width:"80%", height:"40%", justifyContent:"center !important"}} /> </div> : <div id='hide_div'></div>}
                    </div>
                </div>

                <footer className='d-flex flex-row justify-content-center align-items-center p-1 align-middle mt-5 mb-1'>Share on:<FacebookShareButton url={this.props.ticket} target="_top">
                    
                    <TwitterShareButton  url={this.props.ticket} title={this.state.note} target="_top"   >
                        <TwitterIcon size={70} 
                         bgStyle={{ fill: 'transparent'  }} iconFillColor={"aqua"} 
                         />
                        
                    </TwitterShareButton>

                    <FacebookIcon  size={40} borderRadius="10px" target='_blank' iconFillColor={"grey"}  />
                </FacebookShareButton>

                </footer>
                         </div>
                         </>

            
        )
    }
}
