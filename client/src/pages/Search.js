import FormComp from "../components/FormComp";
import EventTable from "../components/EventTable";

import React, { Component } from 'react'
import Details from "../components/Details";


export default class Search extends Component {

  state = {
    events_data: null,
    display_table: false,
    record: false,
    details_data : null,
    card : false
  }

  table_show = () => {
    this.setState({ display_table: true })

  }

  table_hide = () => {
    this.setState({ display_table: false })
  }

  card_show = () => {
    this.setState({card:true})
  }

  card_hide =() => {
    this.setState({card:false})
  }

  update_details = (data) => {
    if (data !== null){
      this.setState({details_data : data},() => {
        console.log("details data:", this.state.details_data)
        this.card_show();

      })
      
    }
    else {
      console.log("details data not found")
      this.card_hide();
    }
  }

  update_events_data = (data) => {
    if (data !== null) {
     

      data.sort(function (a, b) {      

        var x = new Date(a.dates.start.localDate);
        var xt = a.dates.start.localTime===undefined?"":a.dates.start.localTime;
        var y = new Date(b.dates.start.localDate);
        var yt = b.dates.start.localTime===undefined?"":b.dates.start.localTime;

        if (x < y) {
          return -1;
        } else if (x === y && xt.localeCompare(yt)<0) {
          return -1;
        } else {
          return 1;
        }
      });

      this.setState({ events_data: data }, () => {
      })

      this.record_found();

    }
    else {
      this.table_hide();
      this.no_record();
    }

    

  }

  update_onback= () =>{
    this.table_show();
    this.card_hide();
  }

  
  no_record = () => {
    this.setState({ record: true }, () => {
      console.log("no record")
    })
  }

  record_found = () => {
    this.setState({ record: false }, () => {
      console.log("record")
    })
  }


  render() {

    console.log("recieved list and updated", this.state.events_data)
    console.log("display_table:", this.state.display_table)
    console.log("recieved details data and updated", this.state.details_data)
    console.log("card:", this.state.card)



    return <>

      <FormComp update_events_data={this.update_events_data} no_record={this.no_record} record_found={this.record_found} table_hide={this.table_hide} table_show={this.table_show} card_hide={this.card_hide}/>

      { (this.state.record === true ) ? <div className='no_data justify-align-center text-center text-danger '>No results available</div>  : <div></div> }


      { (this.state.display_table === true && this.state.record === false) ? (<EventTable  events_data={this.state.events_data} table_show={this.table_show} update_details = {this.update_details} card_hide={this.card_hide} card_show={this.card_show} /> ) : <div></div> }
      

      { this.state.card === true ? (<Details update_onback={this.update_onback} table_hide={this.table_hide} table_show={this.table_show} details_data = {this.state.details_data} card={this.state.card} card_hide={this.card_hide} card_show={this.card_show} /> ) : <div></div> }
    </>;
  }



}


