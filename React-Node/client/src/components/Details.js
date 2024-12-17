import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import EventsTab from './EventsTab';
import Button from 'react-bootstrap/Button';
import { ChevronLeft } from 'react-bootstrap-icons';
import VenueTab from './VenueTab';
import ArtistsTab from './ArtistsTab';
import {BsFillHeartFill} from 'react-icons/bs';
import {MdOutlineFavoriteBorder} from 'react-icons/md'




export default class Details extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         date: "",
    //     artists: "",
    //     venue_name: "",
    //     genres: "",
    //     price: "",
    //     status: "",
    //     ticket: "",
    //     seatmap: "",
    //     name: "",
    //     contact: "",
    //     openhours: "",
    //     general: "",
    //     child: "",
    //     address: "",
    //     lat: "",
    //     lng: "",
    //         heart_check: false
    //     };
    // this.color_change= this.color_change.bind(this);
    //   }

    state = {
        date: "",
        artists: "",
        venue_name: "",
        genres: "",
        price: "",
        status: "",
        ticket: "",
        seatmap: "",
        name: "",
        contact: "",
        openhours: "",
        general: "",
        child: "",
        address: "",
        lat: "",
        lng: "",
        heart_check: false




    }

    async componentDidMount() {


        await this.event_details();
        await this.venue_details();
        this.check_in_favorites();


    }

    check_in_favorites = () => {
        var x = false
        for (var i=0 ; i<localStorage.length ; i++){
            if(localStorage.key(i) === this.state.name){
                x = true;
                break;
            }
        }   
        if(x) {
            this.setState({heart_check:true})
        }
    }


    on_back = () => {
        this.props.update_onback();


    }

    venue_details = async () => {

        console.log("venue name:", this.state.venue_name)

        var url = `https://reactticketmaster.wl.r.appspot.com/venue_details?keyword=${this.state.venue_name}`
        console.log("url:", url)
        return await fetch(`https://reactticketmaster.wl.r.appspot.com/venue_details?keyword=${this.state.venue_name}`)
            .then((res) => res.json())
            .then(data => {
                console.log("venue_data: ", data);

                var address_arr = []
                if (data !== undefined && data !== null) {
                    if (data._embedded !== undefined && data._embedded !== null) {


                        console.log("entering venues", data._embedded.venues[0].address)

                        console.log("typeof venue:", typeof (data._embedded.venues))


                        if (data._embedded.venues[0].address !== undefined && data._embedded.venues[0].address !== null) {
                            address_arr.push(data._embedded.venues[0].address.line1);
                        }
                        else {
                            console.log(this.state)
                        }

                        if (data._embedded.venues[0].city !== undefined && data._embedded.venues[0].city !== null) {
                            address_arr.push(data._embedded.venues[0].city.name);
                        }

                        if ((data._embedded.venues[0].state !== undefined && data._embedded.venues[0].state !== null)) {
                            address_arr.push(data._embedded.venues[0].state.name);
                        }



                        if ((data._embedded.venues[0].boxOfficeInfo !== undefined && data._embedded.venues[0].boxOfficeInfo !== null)) {

                            if ((data._embedded.venues[0].boxOfficeInfo.phoneNumberDetail !== undefined && data._embedded.venues[0].boxOfficeInfo.phoneNumberDetail !== null)) {

                                this.setState({ contact: data._embedded.venues[0].boxOfficeInfo.phoneNumberDetail })
                            }
                            else {
                                this.setState({ contact: null })
                            }


                            if ((data._embedded.venues[0].boxOfficeInfo.openHoursDetail !== undefined && data._embedded.venues[0].boxOfficeInfo.openHoursDetail !== null)) {
                                this.setState({ openhours: data._embedded.venues[0].boxOfficeInfo.openHoursDetail })
                            }
                            else {
                                this.setState({ openhours: null })
                            }

                            if (data._embedded.venues[0].location !== undefined && data._embedded.venues[0].location !== null) {
                                this.setState({ lat: data._embedded.venues[0].location.latitude })
                            }
                            if (data._embedded.venues[0].location !== undefined && data._embedded.venues[0].location !== null) {
                                this.setState({ lng: data._embedded.venues[0].location.longitude })
                                console.log(this.state.lat, this.state.lng)
                            }


                        }
                        else {
                            this.setState({ contact: null })
                            this.setState({ openhours: null })
                        }

                        if ((data._embedded.venues[0].generalInfo !== undefined && data._embedded.venues[0].generalInfo !== null)) {


                            if ((data._embedded.venues[0].generalInfo.childRule !== undefined && data._embedded.venues[0].generalInfo.childRule !== null)) {

                                this.setState({ child: data._embedded.venues[0].generalInfo.childRule })
                            }
                            else {
                                this.setState({ child: null })
                            }


                            if ((data._embedded.venues[0].generalInfo.generalRule !== undefined && data._embedded.venues[0].generalInfo.generalRule !== null)) {

                                this.setState({ general: data._embedded.venues[0].generalInfo.generalRule })
                            }
                            else {
                                this.setState({ general: null })
                            }


                        }
                        else {
                            this.setState({ child: null })
                            this.setState({ general: null })
                        }




                    }

                    else {
                        this.setState({ address: null })
                        this.setState({ child: null })
                        this.setState({ general: null })
                        this.setState({ contact: null })
                        this.setState({ openhours: null })

                        console.log(this.state)

                    }


                }

                this.setState({ address: address_arr.join(", ") })








            })
    }







    async event_details() {

        this.props.table_hide();
        this.setState({ name: this.props.details_data.name })


        console.log(" details data in details:", this.props.details_data)
        if ((this.props.details_data.dates.start.localDate) !== undefined && (this.props.details_data.dates.start.localDate) !== null) {

            this.setState({ date: this.props.details_data.dates.start.localDate })
            console.log("date:", this.state.date)

        } else {
            this.setState({ date: null })
        }

        var artist_arr = [];


        if ((this.props.details_data._embedded.attractions !== undefined && (this.props.details_data._embedded.attractions) !== null)) {


            for (var i = 0; i < (this.props.details_data._embedded.attractions.length); i++) {

                if ((this.props.details_data._embedded.attractions[i].name !== undefined && (this.props.details_data._embedded.attractions[i].name) !== null)) {

                    artist_arr.push(this.props.details_data._embedded.attractions[i].name)
                } else {
                    this.setState({ artists: null })
                }



            }
        }

        if (artist_arr !== null) {

            artist_arr = artist_arr.join(" | ")
            this.setState({ artists: artist_arr })
            console.log("artists:", this.state.artists)

        } else {
            this.setState({ artists: null })
        }

        if ((this.props.details_data._embedded) !== undefined && (this.props.details_data._embedded) !== null) {

            if ((this.props.details_data._embedded.venues) !== undefined && (this.props.details_data._embedded.venues) !== null) {

                this.setState({ venue_name: this.props.details_data._embedded.venues[0].name })
                console.log("venue:", this.state.venue_name)


            } else {
                this.setState({ venue_name: null })
            }
        }

        var genres_arr = []

        if ((this.props.details_data.classifications[0].genre) !== undefined && (this.props.details_data.classifications[0].genre) !== null) {

            genres_arr.push(this.props.details_data.classifications[0].genre.name)

        }
        if ((this.props.details_data.classifications[0].segment) !== undefined && (this.props.details_data.classifications[0].segment) !== null) {

            genres_arr.push(this.props.details_data.classifications[0].segment.name)

        }
        if ((this.props.details_data.classifications[0].subGenre) !== undefined && (this.props.details_data.classifications[0].subGenre) !== null) {

            genres_arr.push(this.props.details_data.classifications[0].subGenre.name)

        }
        if ((this.props.details_data.classifications[0].type) !== undefined && (this.props.details_data.classifications[0].type) !== null) {

            genres_arr.push(this.props.details_data.classifications[0].type.name)

        }
        if ((this.props.details_data.classifications[0].subType) !== undefined && (this.props.details_data.classifications[0].subType) !== null) {

            genres_arr.push(this.props.details_data.classifications[0].subType.name)

        }

        if (genres_arr !== null) {

            this.setState({ genres: genres_arr.join(" | ") })
            console.log("genres:", this.state.genres)

        } else {
            this.setState({ artists: null })
        }

        var price_arr = []
        if ((this.props.details_data.priceRanges) !== undefined && (this.props.details_data.priceRanges) !== null) {

            if ((this.props.details_data.priceRanges[0].min) !== undefined && (this.props.details_data.priceRanges[0].min) !== null) {

                price_arr.push(this.props.details_data.priceRanges[0].min)

            }
            if ((this.props.details_data.priceRanges[0].max) !== undefined && (this.props.details_data.priceRanges[0].max) !== null) {

                price_arr.push(this.props.details_data.priceRanges[0].max)

            }
        }
        if (price_arr !== null && price_arr.length > 1) {

            this.setState({ price: price_arr.join("-") })
            console.log("price:", this.state.price)

        } else {
            this.setState({ price: null })
        }
        if ((this.props.details_data.dates.status.code) !== undefined && (this.props.details_data.dates.status.code) !== null) {

            this.setState({ status: this.props.details_data.dates.status.code })
            console.log("status:", this.state.status)

        } else {
            this.setState({ status: null })
        }

        if ((this.props.details_data.url) !== undefined && (this.props.details_data.url) !== null) {

            this.setState({ ticket: this.props.details_data.url })
            console.log("ticket:", this.state.ticket)

        } else {
            this.setState({ ticket: null })
        }

        if ((this.props.details_data.seatmap) !== undefined && (this.props.details_data.seatmap) !== null) {

            if ((this.props.details_data.seatmap.staticUrl) !== undefined && (this.props.details_data.seatmap.staticUrl) !== null) {

                this.setState({ seatmap: this.props.details_data.seatmap.staticUrl })
                console.log("seatmap:", this.state.seatmap)

            } else {
                this.setState({ seatmap: null })
            }

        }









    }




    color_change(){
        

        if(this.state.heart_check !== false){

            console.log("entered if else")
            // eslint-disable-next-line
            for (var x=0 ; x<localStorage.length ; x++){
                if(localStorage.key(x) === this.state.name){
                    localStorage.removeItem(this.state.name);
                    alert("Removed from Favorites!");
                }
            }
            this.setState({heart_check:false})
            document.getElementById("heart_button").classList.remove('heart_active');
            document.getElementById("heart_button").classList.add('heart');
            console.log("heart:", this.state.heart_check)


            
        }
        else{
            var temp = {date:this.props.details_data.dates.start.localDate,name:this.state.name,category:this.state.genres,venue:this.state.venue_name}

            localStorage.setItem(this.state.name,JSON.stringify(temp))
            alert("Event Added to Favorites!");
             

            console.log("entered if")
            this.setState({heart_check:true})

            
            document.getElementById("heart_button").classList.remove('heart');
            document.getElementById("heart_button").classList.add('heart_active');
            

            console.log("heart:", this.state.heart_check)
            
        }
        console.log("local storage",localStorage)

       }





    render() {
        console.log("name", this.state.name)

        var heart;
        if(this.state.heart_check) {

           heart = <div className='border rounded-circle bg-white ml-3!important' style={{display: "inline", height:"3rem", width:"3rem"}}><BsFillHeartFill onClick={() => this.color_change()} id='heart_button' className='heart_active' /> </div>
        }
        else {
            heart = <MdOutlineFavoriteBorder onClick={() => this.color_change()} style={{display: "inline", height:"2rem", width:"2rem", backgroundColor:"white"}} id='heart_button' className='heart rounded-circle p-1 mb-1'  color="gray" /> 
        }

        // <div className='border rounded-circle bg-white d-flex' style={{display: "inline", height:"2rem", width:"2rem"}}>{heart}</div>
        return (


            <>
                <Card id='card_' className='mx-auto bg-secondary p-2 bg-opacity-25 text-white border-0 ' style={{ backdropFilter: "blur(13px)", width: "70%", borderRadius: "none" }} >
                    <div >

                        <ChevronLeft className='p-0' />
                        <Button variant="link" className='p-0 text-white' onClick={this.on_back}>Back</Button>

                    </div>
                    <Card.Header className='border-0' >
                        <Card.Title className='text-center'  >{this.state.name} {"  "}
                        {heart}
                        </Card.Title>
                        {/* <span onClick={this.color_change()} >text</span> */}
                        {/* <RiHeart3Fill className={
                            this.state.heart_check ? 'heart_active' : 'heart'
                        } onClick={this.color_change()} /> */}
                       



                    </Card.Header>
                    <Card.Body>


                        <Tabs

                            className="mb-3 border-0 mx-auto!important tabs_ justify-content-evenly" style={{ backgroundColor: 'rgb(104, 212, 190)', color: 'white !important' }} >


                            <Tab eventKey="Events" title="Events" style={{ Color: "white !important", backgroundColor: "none !important" }} className='border-0' id='card_nav' >
                                <EventsTab date={this.state.date} artists={this.state.artists} venue_name={this.state.venue_name} genres={this.state.genres} price={this.state.price} status={this.state.status} ticket={this.state.ticket} seatmap={this.state.seatmap} name={this.state.name} details_data={this.props.details_data} />

                            </Tab>
                            <Tab eventKey="Artist/Teams" title="Artist/Teams" className='border-0' style={{ Color: "white !important", backgroundColor: "transparent !important" }}  >
                                <ArtistsTab details_data={this.props.details_data} artists={this.state.artists} />
                            </Tab>
                            <Tab eventKey="Venue" title="Venue" className='border-0'>
                                <VenueTab lat={this.state.lat} lng={this.state.lng} venue_name={this.state.venue_name} contact={this.state.contact} openhours={this.state.openhours} general={this.state.general} child={this.state.child} address={this.state.address} />


                            </Tab>
                        </Tabs>


                    </Card.Body>
                </Card>



            </>
        )

    }

}

