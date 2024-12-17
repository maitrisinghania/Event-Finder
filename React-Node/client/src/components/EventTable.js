import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';

export default class EventTable extends Component {

    details_card = async (event_id) => {
        console.log(`/event_details?event_id=${event_id}`)
        return await fetch(`https://reactticketmaster.wl.r.appspot.com/event_details?event_id=${event_id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("events details:", data)
                var details_data = data

                this.props.update_details(details_data);
                this.props.card_show();
            })


    }




    render() {
        console.log("events data:", this.props.events_data)




        return (
            <div id='events_table'className='mx-auto text-center' >
                <Table responsive striped hover variant="dark"   >
                    <thead>
                        <tr>
                            <th>Date/Time</th>
                            <th>Icon</th>
                            <th style={{width:"40%"}}>Event</th>
                            <th>Genre</th>
                            <th>Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.events_data.map(

                                (event) => <tr key={event.id} onClick={() => this.details_card(event.id)}>


                                    <td> {event.dates.start.localDate} <br />  {event.dates.start.localTime} </td>
                                    <td> <img src={event.images[0].url}  alt="no icon" style={{width:"70px" ,height:"50px"}} />  </td>
                                    <td> {event.name} </td>
                                    <td> {event.classifications[0].segment.name} </td>
                                    <td> {event._embedded.venues[0].name} </td>


                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
        )
    }

}





