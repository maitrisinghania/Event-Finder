import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
// import Spinner from 'react-bootstrap/Spinner';

import Autocomplete from '@mui/material/Autocomplete';

// const options = ['Option 1', 'Option 2'];


export default class FormComp extends Component {



  state = {
    keyword: "",
    category: "",
    distance: 10,
    location: "",
    checkbox: false,
    suggests: [],
    loader: false


  }


  keyword_change = (event) => {

    this.keyword_auto();
    console.log("before:", this.state.keyword)
    this.setState({ keyword: event.target.value });
    console.log("after:", this.state.keyword)
    

  }
  on_change = (new_value) => {
    
      if (typeof newValue === 'string') {
        this.setState({keyword: new_value});
        
      } else if (new_value && new_value.inputValue) {
        // Create a new value from the user input
        this.setState({keyword: new_value.inputValue});
        
        
      } else {
        this.setState({keyword: new_value});
        
      }

      
    

    // this.setState({ keyword: new_keyword });
    

  }

  distance_change = (event) => {
    this.setState({ distance: event.target.value });
  }
  location_change = (event) => {
    this.setState({ location: event.target.value });
  }
  category_change = (event) => {
    this.setState({ category: event.target.value });
  }


  on_submit = async (event) => {
    console.log("entered onsubmit")
    this.props.card_hide()

    var longitude;
    var latitude;

    event.preventDefault();

    if (this.state.checkbox === false) {
      this.setState({ location: document.getElementById("location").value });
      let temp = await this.location_detect(this.state.location)
      latitude = temp[0];
      longitude = temp[1];
      console.log(temp, latitude, longitude)


    } else {

      document.getElementById('location').disabled = true;
      document.getElementById('location').value = "";
      let temp = await this.location_checked()
      latitude = temp[0];
      longitude = temp[1];
      console.log(temp, latitude, longitude)

    }



    await this.events(latitude, longitude);
    this.props.table_show();








  }

  suggests_change = (lst) => {

    this.setState({ suggests: lst });

  }

  on_clear = () => {
    this.props.record_found()
    this.props.table_hide()
    this.setState({ category: "" })
    this.setState({ location: "" })
    this.setState({ keyword: "" })
    this.setState({ distance: 10 })
    this.setState({ checkbox: false })
    document.getElementById('location').value = "";
    document.getElementById('category').value = "";
    document.getElementById('keyword').value = "";
    document.getElementById('distance').value = 10;
    document.getElementById('checkbox').checked = false;
    document.getElementById('location').disabled = false;
    console.log("after clear:", this.state)
    this.setState({ suggests: [] })
    this.props.card_hide()

  }

  checkbox_checked = (event) => {
    var ischecked = document.getElementById('checkbox')
    if (ischecked.checked) {

      this.setState({ checkbox: true })
      document.getElementById('location').disabled = true;
      document.getElementById('location').value = "";
    }

    else {

      this.setState({ checkbox: false })
      document.getElementById('location').disabled = false;
    }

  }

  events = async (latitude, longitude) => {

    console.log("before events call:", this.state, longitude, latitude)
    console.log(`/events?keyword=${this.state.keyword}&category=${this.state.category}&longitude=${longitude}&latitude=${latitude}&radius=${this.state.distance}`)
    return await fetch(`https://reactticketmaster.wl.r.appspot.com/events?keyword=${this.state.keyword}&category=${this.state.category}&longitude=${longitude}&latitude=${latitude}&radius=${this.state.distance}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("events:", data)

        if (data._embedded !== null && data._embedded !== undefined) {
          if (data._embedded.events !== null && data._embedded.events !== undefined) {

            var events_data = data._embedded.events;
            console.log("events list after embedded:", events_data)

            this.props.update_events_data(events_data);

          } else {
            this.props.no_record()
            // eslint-disable-next-line
            var events_data = null;
            this.props.update_events_data(events_data);


          }

        }
        else {
          // eslint-disable-next-line
          var events_data = null;
          this.props.update_events_data(events_data);
          this.props.no_record()


        }
      })



  }



  location_detect = async (location) => {
    console.log("hello");

    var longitude;
    var latitude;

    await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBLaW8canq4wF2xpICnYkxpE0i8Y3b07u0`)
      .then((res) => res.json())
      .then((data) => {
        console.log("geocode:", data)

        if (data.status === "OK") {
          longitude = data["results"][0]['geometry']["location"]["lng"]
          latitude = data["results"][0]['geometry']["location"]["lat"]
          console.log(latitude, longitude);

        }
        else {
          alert("The location entered is not valid, try again");
        }

      })
    return [latitude, longitude];

  }

  location_checked = async () => {

    var longitude;
    var latitude;
    await fetch(`https://ipinfo.io/?token=8310e76c5e2882`)
      .then((res) => res.json())
      .then((data) => {
        console.log("ipinfo:", data)

        const arr = data['loc'].split(',')
        latitude = arr[0];
        longitude = arr[1];



        console.log(latitude, longitude);


      })
    return [latitude, longitude];
  }





  keyword_auto = async () => {
    this.setState({loader: true},async () => {

      var lst = []

      await fetch(`https://reactticketmaster.wl.r.appspot.com/suggest?keyword=${this.state.keyword}`)
        .then((res) => res.json())
        .then(data => {
  
          for (var i = 0; i < data._embedded.attractions.length; i++) {
  
            lst.push(data._embedded.attractions[i]['name'])
  
          }
          // this.setState({ keyword: data._embedded.attractions[0]['name'] })
          console.log(data);
  
          console.log("lst:", lst)
          this.suggests_change(lst)
          this.setState({loader: false})
          console.log(this.state.suggests)
  
  
        })
      return lst;
  

    })

   
  }




  render() {
    console.log("render");
    console.log(this.state);


    return (
      <div  id='form' className="mx-auto p-4 mt-4 text-white" >
        <h2 className='mx-auto mt-4' id="event_search">Events Search</h2>
        
        <Form onSubmit={this.on_submit} className="mx-auto  " >



          <Form.Group   >
            <Form.Label>Keyword<span className='text-danger'>*</span>

              <Autocomplete

                // onInputChange={this.keyword_change}

                onChange={(event, newValue) => {
                  this.on_change(newValue);
                }}
                options={this.state.suggests}
                

                isOptionEqualToValue={(option, value) => option.text === value.text}

                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    
                    return option.inputValue;
                  }
                  // Regular option
                  return option;
                }}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                sx={{ width: 300 }}
                freeSolo

                renderInput={(params) => (
                  <div ref={params.InputProps.ref} >
                    <Form.Control {...params.inputProps} value={this.state.keyword} type="text"
                      onChange={this.keyword_change} id="keyword" required />
                  </div>
                )}
              />

            </Form.Label>

            {/* {<Auto_complete keyword_auto = {this.keyword_auto}  keyword_change = {this.keyword_change} keyword = {this.state.keyword}/>} */}


            {/* <Form.Control type="text" id='keyword' required onChange={this.keyword_change}/> */}
          </Form.Group>

          <Row className='distance_category'>
            <Col>
              <Form.Label>Distance</Form.Label>
              <Form.Control type="number" placeholder="10" defaultValue="10" onChange={this.distance_change} id='distance' />
            </Col>
            <Col>
              <Form.Label>Category<span className='text-danger'>*</span></Form.Label>
              <Form.Select onChange={this.category_change} id='category'>
                <option defaultValue value="">Default</option>
                <option value="KZFzniwnSyZfZ7v7nJ">Music</option>
                <option value="KZFzniwnSyZfZ7v7nE">Sports</option>
                <option value="KZFzniwnSyZfZ7v7na">Arts & Theatre</option>
                <option value="KZFzniwnSyZfZ7v7nn">Film</option>
                <option value="KZFzniwnSyZfZ7v7n1">Miscellaneous</option>
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Location<span className='text-danger'>*</span></Form.Label>
            <Form.Control type="text" id='location' onChange={this.location_change} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" id='checkbox' onClick={this.checkbox_checked} label="Auto-detect your location" />
          </Form.Group>

          <div className='buttons'>


          <Button variant="danger" type="submit" className='m-2' id='submit'  >
            SUBMIT
          </Button>

          <Button variant="primary"  id='clear' className='m-2' onClick={() => this.on_clear()}>
            CLEAR
          </Button>
          </div>

        </Form>

       


      </div>
    )
  }
}




