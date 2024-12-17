var latitude;
var longitude;
var eventMainArr = [];
var event_header = `<tr ><th class="header" style="width:15%;">Date</th><th class="header" style="width:15%;">Icon</th><th class="header heading" style="width:40%;" onclick="eventReOrder('Event')">Event</th><th class="header heading" style="width:10%;" onclick="eventReOrder('Genre')">Genre</th><th class="header heading" style="width:20%;" onclick="eventReOrder('Venue')">Venue</th></tr>`;
var event_rows = "";


// Search button
async function on_click() {
    var clear_btn_div = document.getElementById("clear_btn_div").style;
    if (clear_btn_div.display !== "none") {
        clear_btn_div.display = "none";
    }


    if (validate() === true) {
        if (document.getElementById("checkbox").checked == false) {
            location_detect();

        }
        else {

            events_table();
        }
    }
}

// checkbox function
function checkbox_checked() {

    var ischecked = document.getElementById('checkbox')
    if (ischecked.checked) {
        document.getElementById('location').style.display = 'none';
        location_checked();
    } else {
        document.getElementById('location').style.display = 'block';
    }
}


// clear button
function clear_btn() {

    document.getElementById('keyword').value = "";
    document.getElementById('distance').value = "10";
    document.getElementById('location').value = "";
    document.getElementById('location').style.display = 'block';
    document.getElementById('checkbox').checked = false;
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("clear_btn_div").style.display = "none";
    removeAllChildRows(document.getElementById("events"));
    eventMainArr = [];
    event_rows = "";

}

// removing child rows from the table
function removeAllChildRows(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// Function for giving tooltip if any of the fields is empty
function validate() {
    var key = document.getElementById('keyword');
    var loc = document.getElementById('location');

    if (key.value === "" || (loc.style.display !== 'none' && loc.value === "")) {
        return false;
    }

    return true;

}


// Arranging event, genre and venue in ascending and descending order
function eventReOrder(headerType) {





    if (headerType === "Event") {

        localStorage.setItem("GenreClick", 0);
        localStorage.setItem("VenueClick", 0);

        var event_click = parseInt(localStorage.getItem("EventClick"))
        console.log("event arr ", eventMainArr)

        if (event_click % 2 == 0) {
            eventMainArr.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        } else {
            eventMainArr.sort(function (a, b) {
                return b.name.localeCompare(a.name);
            });
        }

        var count = (parseInt(localStorage.getItem("EventClick"))) + 1;
        localStorage.setItem("EventClick", count);


    }
    if (headerType === "Genre") {

        localStorage.setItem("EventClick", 0);
        localStorage.setItem("VenueClick", 0);


        if (parseInt(localStorage.getItem("GenreClick")) % 2 == 0) {
            eventMainArr.sort(function (a, b) {
                return a.classifications[0].segment.name.localeCompare(b.classifications[0].segment.name);
            });
        } else {
            eventMainArr.sort(function (a, b) {
                return b.classifications[0].segment.name.localeCompare(a.classifications[0].segment.name);
            });
        }

        var count = (parseInt(localStorage.getItem("GenreClick"))) + 1;
        localStorage.setItem("GenreClick", count);

    }
    if (headerType === "Venue") {

        console.log("venue_arr", eventMainArr._embedded)
        localStorage.setItem("GenreClick", 0);
        localStorage.setItem("EventClick", 0);


        var venue_click = parseInt(localStorage.getItem("VenueClick"))
        console.log(venue_click)

        if (venue_click % 2 == 0) {
            eventMainArr.sort(function (a, b) {
                return a._embedded.venues[0].name.localeCompare(b._embedded.venues[0].name);
            });
        } else {
            eventMainArr.sort(function (a, b) {
                return b._embedded.venues[0].name.localeCompare(a._embedded.venues[0].name);
            });
        }

        var count = (parseInt(localStorage.getItem("VenueClick"))) + 1;
        localStorage.setItem("VenueClick", count);

    }


    event_rows = "";
    event_rows += event_header;
    for (var i = 0; i < eventMainArr.length; i++) {
        var tr = `<tr style="height: 70px;">`;

        if (eventMainArr[i].dates.start.localDate !== undefined || eventMainArr[i].dates.start.localTime !== undefined) {
            if (eventMainArr[i].dates.start.localDate !== undefined && eventMainArr[i].dates.start.localTime === undefined) {
                tr += "<td>" + eventMainArr[i].dates.start.localDate.toString() + "</td>";
            }
            else if (eventMainArr[i].dates.start.localTime !== undefined && eventMainArr[i].dates.start.localDate === undefined) {
                tr += "<td>" + eventMainArr[i].dates.start.localTime.toString() + "</td>";

            }
            else if (eventMainArr[i].dates.start.localDate !== undefined && eventMainArr[i].dates.start.localTime !== undefined) {

                tr += "<td>" + eventMainArr[i].dates.start.localDate.toString() + "</br>" + eventMainArr[i].dates.start.localTime.toString() + "</td>";
            }

        }
        else {


            tr += "<td> </td>";
        }
        tr += `<td> <img src='` + eventMainArr[i].images[0].url + `'width="70" height="50" > </td>`;
        tr += `<td onclick="eventDetail('` + eventMainArr[i].id.toString() + `')"><span class="_eventName">` + eventMainArr[i].name + "<span/></td>";
        tr += "<td>" + eventMainArr[i].classifications[0].segment.name + "</td>";
        tr += "<td>" + eventMainArr[i]._embedded.venues[0].name + "</td>";
        tr += "</tr>";
        event_rows += tr;
    }
    console.log(event_rows);
    document.getElementById("events").innerHTML = event_rows;

}


// events table function
async function events_table() {
    removeAllChildRows(document.getElementById("events"));
    eventMainArr = [];
    event_rows = "";
    event_rows += event_header;

    document.getElementById("clear_btn_div").style.display = "inline-block";
    document.getElementById("table_content").style.display = "none";
    document.getElementById('no_record').style.display = "none";
    document.getElementById("parent_EventDetail").style.display = "none";
    document.getElementById("old_ShowVenueDetail").style.display = "none";
    document.getElementById("showVenueDetailRender").style.height = '10px'

    var keyword = document.getElementById('keyword').value
    var distance = document.getElementById('distance').value
    var category = document.getElementById('category').value
    document.getElementById('_loader').style.display = "inline-block";



    try {
        var events_list = '/events?keyword=' + keyword + '&distance=' + distance + '&category=' + category + '&latitude=' + latitude + '&longitude=' + longitude;
        console.log(events_list);
        const response = await fetch(events_list);
        var data = await response.json();
        console.log(data);
        console.log("type of data", typeof data);
        if (data !== null) {
            document.getElementById('no_record').style.display = "none";
            document.getElementById("table_content").style.display = "grid";

            var temp = data._embedded
            if (temp !== undefined) {

                var events_arr = temp.events
                console.log("event-aray", events_arr)
                // console.log("local-time",events_arr[0].dates.start.localTime.toString())

                eventMainArr = [...events_arr];

                for (var i = 0; i < eventMainArr.length; i++) {
                    var tr = `<tr style="height: 70px;">`;

                    if (eventMainArr[i].dates.start.localDate !== undefined || eventMainArr[i].dates.start.localTime !== undefined) {
                        if (eventMainArr[i].dates.start.localDate !== undefined && eventMainArr[i].dates.start.localTime === undefined) {
                            tr += "<td>" + eventMainArr[i].dates.start.localDate.toString() + "</td>";
                        }
                        else if (eventMainArr[i].dates.start.localTime !== undefined && eventMainArr[i].dates.start.localDate === undefined) {
                            tr += "<td>" + eventMainArr[i].dates.start.localTime.toString() + "</td>";

                        }
                        else if (eventMainArr[i].dates.start.localDate !== undefined && eventMainArr[i].dates.start.localTime !== undefined) {

                            tr += "<td>" + eventMainArr[i].dates.start.localDate.toString() + "</br>" + eventMainArr[i].dates.start.localTime.toString() + "</td>";
                        }

                    }
                    else {


                        tr += "<td> </td>";
                    }
                    tr += `<td> <img src='` + eventMainArr[i].images[0].url + `'width="70" height="50" > </td>`;
                    tr += `<td onclick="eventDetail('` + eventMainArr[i].id.toString() + `')"><span class="_eventName">` + eventMainArr[i].name + "<span/></td>";
                    tr += "<td>" + eventMainArr[i].classifications[0].segment.name + "</td>";
                    tr += "<td>" + eventMainArr[i]._embedded.venues[0].name + "</td>";
                    tr += "</tr>";
                    event_rows += tr;
                }
                console.log(event_rows)
                document.getElementById("events").innerHTML = event_rows;
                document.getElementById('_loader').style.display = "none";
                //window.scrollBy(0, document.getElementById('clear_btn_div').offsetHeight);


            }
            else {
                document.getElementById('_loader').style.display = "none";
                document.getElementById("table_content").style.display = "none";
                document.getElementById('no_record').style.display = "inline-block";

            }
        } else {
            document.getElementById('_loader').style.display = "none";
            document.getElementById("table_content").style.display = "none";
            document.getElementById('no_record').style.display = "inline-block";
        }

    } catch (e) {

        alert("Something wrong with api : " + e.message);

    }
}

// event detail card function
async function eventDetail(id) {


    var detail_Api = '/event_details?event_id=' + id;
    console.log("Event Detail = ", detail_Api);
    const response = await fetch(detail_Api);
    var data = await response.json();
    console.log("Event Detail = ", data);

    localStorage.setItem("EventClick", 0);
    localStorage.setItem("GenreClick", 0);
    localStorage.setItem("VenueClick", 0);

    var event_D = "";

    if (data !== null) {
        document.getElementById("eventName").innerHTML = data.name;

        if (data.seatmap !== undefined && data.seatmap.staticUrl !== "")
            document.getElementById("eventImage").innerHTML = `<img src="` + data.seatmap.staticUrl + `" alt="Seat Map" width="85%" height="300px">`;

        if (data.dates !== undefined && data.dates !== null && data.dates !== null) {
            var locDate = "";
            var locTime = ""
            if (data.dates.start.localDate !== undefined && data.dates.start.localDate !== "") {
                locDate = data.dates.start.localDate;
            }
            if (data.dates.start.localTime !== undefined && data.dates.start.localTime !== "") {
                locTime = data.dates.start.localTime;
            }

            if (locDate !== "" && locTime !== "") {
                event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Date</span><br/><span class="eventDate eventDetailColr">` + data.dates.start.localDate + " " + data.dates.start.localTime + `</span></div>`
            }

        }

        if (data._embedded !== undefined && data._embedded.attractions !== null && data._embedded.attractions !== undefined && data._embedded.attractions !== null && data._embedded.attractions.length > 0) {
            var artarr = [];
            artarr.push(data._embedded.attractions.map((e) => {

                return `<a class="ticketmaster_link" href="` + e.url + `" target="_blank" style="color: deepskyblue; text-decoration: none;">` + e.name + `</a>`;
            }));

            var artists = artarr.join(' | ');
            artists = artists.replaceAll(",", " | ");
            event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Artist/Teams</span><br/><span class="eventArtists eventDetailColr">` + artists + `</span></div>`
        }

        if (data._embedded !== null && data._embedded.venues !== null && data._embedded.venues.length > 0) {

            document.getElementById("selectedVenue").value = data._embedded.venues[0].name.replaceAll(' ', '%');

            event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Venue</span><br/><span class="eventVenue eventDetailColr">` + data._embedded.venues[0].name + `</span></div>`

        }

        if (data.classifications !== undefined && data.classifications !== null && data.classifications.length > 0) {
            var genreArr = [];
            if (data.classifications[0].genre !== undefined && data.classifications[0].genre.name !== "Undefined")
                genreArr.push(data.classifications[0].genre.name);

            if (data.classifications[0].segment !== undefined && data.classifications[0].segment.name !== "Undefined")
                genreArr.push(data.classifications[0].segment.name);

            if (data.classifications[0].subGenre !== undefined && data.classifications[0].subGenre.name !== "Undefined")
                genreArr.push(data.classifications[0].subGenre.name);

            if (data.classifications[0].subType !== undefined && data.classifications[0].subType.name !== "Undefined")
                genreArr.push(data.classifications[0].subType.name);

            if (data.classifications[0].type !== undefined && data.classifications[0].type.name !== "Undefined")
                genreArr.push(data.classifications[0].type.name);

            genreArr = genreArr.filter((c, index) => {
                return genreArr.indexOf(c) === index;
            });
            var str = genreArr.join(' | ');


            event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Genre</span><br/><span class="eventGenre eventDetailColr">` + str + `</span></div>`
        }

        if (data.priceRanges !== undefined && data.priceRanges !== null && data.priceRanges[0].min !== "" && data.priceRanges[0].max !== "") {
            if (data.priceRanges[0].currency != undefined && data.priceRanges[0].currency != "") {

                var range = data.priceRanges[0].min + " - " + data.priceRanges[0].max + " " + data.priceRanges[0].currency;
                event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Price Ranges</span><br/><span class="eventPrice eventDetailColr">` + range + `</span></div>`
            }
            else {
                var range = data.priceRanges[0].min + " - " + data.priceRanges[0].max;
                event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Price Ranges</span><br/><span class="eventPrice eventDetailColr">` + range + `</span></div>`

            }
        }

        if (data.dates !== undefined && data.dates !== null) {
            var codeColor = "";

            if (data.dates.status.code.trim().toLocaleLowerCase() === "onsale".trim().toLocaleLowerCase())
                event_D += `<div style="margin-bottom: 10px;"><div style="margin-bottom: 5px;"><span class="eventDetailHeader eventDetailColr">Ticket Status</span></div><div><span class="eventDateStatus eventDetailColr" style="padding: 1px 5px;margin-top: 10px;background-color: Green;color: white;border-radius: 5px;">` + data.dates.status.code + `</span></div></div>`

            if (data.dates.status.code.trim().toLocaleLowerCase() === "Offsale".trim().toLocaleLowerCase())
                event_D += `<div style="margin-bottom: 10px;"><div style="margin-bottom: 5px;"><span class="eventDetailHeader eventDetailColr">Ticket Status</span></div><div><span class="eventDateStatus eventDetailColr" style="padding: 1px 5px;margin-top: 10px;background-color: Red;color: white;border-radius: 5px;">` + data.dates.status.code + `</span></div></div>`

            if (data.dates.status.code.trim().toLocaleLowerCase() === "cancelled".trim().toLocaleLowerCase())
                event_D += `<div style="margin-bottom: 10px;"><div style="margin-bottom: 5px;"><span class="eventDetailHeader eventDetailColr">Ticket Status</span></div><div><span class="eventDateStatus eventDetailColr" style="padding: 1px 5px;margin-top: 10px;background-color: Black;color: white;border-radius: 5px;">` + data.dates.status.code + `</span></div></div>`

            if (data.dates.status.code.trim().toLocaleLowerCase() === "Postponed".trim().toLocaleLowerCase())
                event_D += `<div style="margin-bottom: 10px;"><div style="margin-bottom: 5px;"><span class="eventDetailHeader eventDetailColr">Ticket Status</span></div><div><span class="eventDateStatus eventDetailColr" style="padding: 1px 5px;margin-top: 10px;background-color: Orange;color: white;border-radius: 5px;">` + data.dates.status.code + `</span></div></div>`

            if (data.dates.status.code.trim().toLocaleLowerCase() === "Rescheduled".trim().toLocaleLowerCase())
                event_D += `<div style="margin-bottom: 10px;"><div style="margin-bottom: 5px;"><span class="eventDetailHeader eventDetailColr">Ticket Status</span></div><div><span class="eventDateStatus eventDetailColr" style="padding: 1px 5px;margin-top: 10px;background-color: Orange;color: white;border-radius: 5px;">` + data.dates.status.code + `</span></div></div>`


        }

        if (data.url !== undefined && data.url !== "") {
            event_D += `<div style="margin-bottom: 10px;"><span class="eventDetailHeader eventDetailColr">Buy Ticket At:</span><br/><a class="ticketmaster_link" href="` + data.url + `" target="_blank" style="color: deepskyblue; text-decoration: none;">Ticketmaster</a></div>`
        }

        if (data._embedded !== undefined && data._embedded.venues !== undefined && data._embedded.venues !== null && data._embedded.venues.length > 0) {

            document.getElementById("selectedVenueName").value = data._embedded.venues[0].name;

        }


    }
    document.getElementById("old_ShowVenueDetail").style.display = "none";
    document.getElementById("parent_EventDetail").style.display = "inline-block";
    document.getElementById("show_VenueDetail").style.display = "inline-block";
    document.getElementById("showVenueDetailRender").style.height = '10px'
    document.getElementById("child_EventDetail").innerHTML = event_D;
    window.scrollTo(0, document.body.scrollHeight);
    event_D = "";
    console.log("event_d", event_D);

}


// venue card function
async function showVenue() {
    document.getElementById('_loader').style.display = "inline-block";
    var _name = document.getElementById("selectedVenue").value;
    var venue_Api = '/venue?venue=' + _name;
    console.log("Event Detail = ", venue_Api);
    const response = await fetch(venue_Api);
    var data = await response.json();
    console.log("Venue Detail = ", data);
    document.getElementById("old_ShowVenueDetail").style.display = "inline-block";
    document.getElementById("showVenueDetailRender").style.height = '400px'
    document.getElementById("_VenueName").innerHTML = document.getElementById("selectedVenueName").value;
    document.getElementById("venue_Link").innerHTML = `<span>N/A<span/>`
    document.getElementById("otherEvent_Venue").innerHTML = `<span>N/A<span/>`;
    document.getElementById("_VenueAddress").innerHTML = "N/A";


    if (data._embedded !== undefined && data._embedded !== null && data._embedded.venues !== undefined && data._embedded.venues !== null && data._embedded.venues.length > 0) {

        document.getElementById('_loader').style.display = "none";
        if (data._embedded.venues[0].name !== "")
            document.getElementById("_VenueName").innerHTML = data._embedded.venues[0].name;
        else
            document.getElementById("_VenueName").innerHTML = "N/A";



        if ((data._embedded.venues[0].address !== undefined && data._embedded.venues[0].address !== "") || (data._embedded.venues[0].city !== undefined && data._embedded.venues[0].city.name !== "") || (data._embedded.venues[0].state.stateCode !== undefined && data._embedded.venues[0].state.stateCode !== "") || (data._embedded.venues[0].postalCode !== undefined && data._embedded.venues[0].postalCode !== "")) {


            if (data._embedded.venues[0].address !== undefined && data._embedded.venues[0].address !== "")
                document.getElementById("_VenueAddress").innerHTML = data._embedded.venues[0].address.line1;

            if (data._embedded.venues[0].city !== undefined && data._embedded.venues[0].city.name !== "" && data._embedded.venues[0].state.stateCode !== undefined)
                document.getElementById("_VenueCity").innerHTML = data._embedded.venues[0].city.name + "," + data._embedded.venues[0].state.stateCode;

            if (data._embedded.venues[0].postalCode !== undefined && data._embedded.venues[0].postalCode !== "")
                document.getElementById("_VenuePostalCode").innerHTML = data._embedded.venues[0].postalCode;



        } else
            document.getElementById("_VenueAddress").innerHTML = "N/A";


        if (data._embedded.venues[0].address !== undefined && data._embedded.venues[0].city !== undefined && data._embedded.venues[0].state.stateCode !== undefined) {
            var mapAnchor = `<span>
                                        <a id="_VenueMapUrl" target="_blank"
                                            href="http://maps.google.com/maps?q=210+Louise+Ave,+Nashville,+TN+37203">Open
                                            in Google Maps</a>
                                    </span>`
            document.getElementById("venue_Link").innerHTML = mapAnchor;
            var mapAddrr = data._embedded.venues[0].address.line1 + data._embedded.venues[0].city.name + "," + data._embedded.venues[0].state.stateCode;
            document.getElementById("_VenueMapUrl").href = "http://maps.google.com/maps?q=" + mapAddrr.replaceAll(" ", "+");
        } else {
            document.getElementById("venue_Link").innerHTML = `<span>N/A<span/>`
        }
        document.getElementById("_VenueMapUrl").href = "http://maps.google.com/maps?q=" + mapAddrr.replaceAll(" ", "+");

        if (data._embedded.venues[0].url !== undefined && data._embedded.venues[0].url !== "") {
            var venueother = `<span><a id="_VenueMoreEvent" target="_blank"
                                        href="http://maps.google.com/maps?q=210+Louise+Ave,+Nashville,+TN+37203">More
                                        events at this venue</a></span>`
            document.getElementById("otherEvent_Venue").innerHTML = venueother;
            document.getElementById("_VenueMoreEvent").href = data._embedded.venues[0].url;
        }
        else {
            document.getElementById("otherEvent_Venue").innerHTML = `<span>N/A<span/>`;

        }

        if (data._embedded.venues[0].images !== undefined && data._embedded.venues[0].images !== null) {
            document.getElementById("venue_DetailImg").style.display = 'inline-block';
            document.getElementById("venue_DetailImg").src = data._embedded.venues[0].images[0].url;
        } else {
            document.getElementById("venue_DetailImg").style.display = 'none';
        }


        document.getElementById("show_VenueDetail").style.display = "none";
        window.scrollTo(0, document.body.scrollHeight);

    } else {

        window.scrollTo(0, document.body.scrollHeight);
        document.getElementById('_loader').style.display = "none";
    }

}


// Detect location when checkbox is not checked
async function location_detect() {

    try {
        var event_location = document.getElementById('location').value;
        // const myAPIKey= 'AIzaSyBLaW8canq4wF2xpICnYkxpE0i8Y3b07u0'
        var geourl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + event_location + '&key=AIzaSyBLaW8canq4wF2xpICnYkxpE0i8Y3b07u0';

        const response = await fetch(geourl);
        var data = await response.json();
        console.log("type of geocode", data)

        console.log(data["results"][0]['geometry']["location"])
        latitude = data["results"][0]['geometry']["location"]["lat"]
        longitude = data["results"][0]['geometry']["location"]["lng"]
        console.log(latitude, longitude);
        events_table();
    } catch (e) {
        alert('Something Wrong : ' + e.message)
    }




}


// Detect location when checkbox is checked
async function location_checked() {
    var ipurl = 'https://ipinfo.io/?token=8310e76c5e2882';

    const response = await fetch(ipurl);
    var data = await response.json();
    console.log(data);

    console.log(data['loc'])

    const arr = data['loc'].split(',')

    latitude = arr[0]
    longitude = arr[1]



}