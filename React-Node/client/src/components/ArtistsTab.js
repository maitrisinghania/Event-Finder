import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
// import { NumericFormat } from 'react-number-format';
import { FaSpotify } from 'react-icons/fa';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class ArtistsTab extends Component {


    state = {
        music_check: false,
        details_spotify: [],
        artists_arr: [],
        arr_artist: [],
        arr_album: [],
        albums_images: []

    }

    async componentDidMount() {

        console.log("entered update artists")
        await this.update_artists();
        await this.spotify_details();



    }

    async spotify_details() {

        var music = []
        var artist = []


        for (var i = 0; i < this.state.artists_arr.length; i++) {

            if (this.props.details_data._embedded.attractions[i].classifications[0].segment.name === 'Music' || this.props.details_data._embedded.attractions[i].classifications[0].segment.name === 'music') {

                await fetch(`https://reactticketmaster.wl.r.appspot.com/spotify?name=${this.state.artists_arr[i]}`)

                    .then((res) => res.json())
                    // eslint-disable-next-line
                    .then(async (data) => {
                        console.log("artist:", data)




                        if (data.error === 'No artist') {
                            music.push("")
                        } else {
                            music.push("music")
                            artist.push(data)
                        }
                    });
            }
            else {
                console.log("entered ")
                music.push("")

            }

        }

        this.setState({ arr_artist: artist })
        console.log(" artist array :", this.state.arr_artist)
        var albums_details = {}
        var temp = []

        for (var x = 0; x < this.state.arr_artist.length; x++) {

            var images = []

            await fetch(`https://reactticketmaster.wl.r.appspot.com/spotify_albums?id=${this.state.arr_artist[x].id}`)
                .then((res) => res.json())
                // eslint-disable-next-line
                .then((data) => {
                    console.log("album:", data)


                    data.map((album) =>
                        images.push(album.images[0].url)
                    )

                    console.log("images:", images)

                    albums_details = { id: this.state.arr_artist[x].id, album: images }

                    console.log("album_details:", albums_details)

                    temp.push(albums_details)



                });
        }
        console.log("temp:", temp)
        this.update_album_arr(temp);

        console.log("array albums:", this.state.arr_album)




        for (var j = 0; j < music.length; j++) {
            if (music[j] === "music") {
                this.setState({ music_check: true })
            }
        }
    }


    async update_artists() {
        var artist_ = [];

        if ((this.props.details_data._embedded.attractions) !== undefined && (this.props.details_data._embedded.attractions) !== null) {


            for (var i = 0; i < (this.props.details_data._embedded.attractions.length); i++) {
                console.log("entered for loop")
                console.log("names:", this.props.details_data._embedded.attractions[i].name)

                if ((this.props.details_data._embedded.attractions[i].name !== undefined && (this.props.details_data._embedded.attractions[i].name) !== null)) {

                    artist_.push(this.props.details_data._embedded.attractions[i].name)
                    console.log("artists name:", artist_)
                } else {
                    this.setState({ artists_: null })
                }

            }
        }

        if (artist_ !== null) {

            this.update_arr(artist_);
            console.log("artists:", artist_, this.state.artists_arr)

        } else {
            this.setState({ artists_arr: null })
        }




    }


    update_arr(artist_) {
        this.setState({ artists_arr: artist_ }, () => {
            console.log("updated artist array:", this.state.artists_arr)
        })
    }

    update_album_arr(temp) {
        console.log("entered function:", temp)
        this.setState({ arr_album: temp }, () => {
            console.log(" album array :", this.state.arr_album)
        })

    }


    get_images(artistId) {

        var img = []

        for (var i = 0; i < this.state.arr_album.length; i++) {

            if (artistId === this.state.arr_album[i].id) {

                img = this.state.arr_album[i].album
                console.log("img arr:", img)




            }



        }
        return img


    }

    // spotify_playlist(link_spotify) {
    //     console.log("entered spotify")
    //     window.open(link_spotify, "_blank");
    // }

    Commas(followers) {
        return followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }




    render() {

        console.log('artists:', this.state.music_check, this.state.artists_arr)

        return (

            <>

                {(this.state.artists_arr !== undefined && this.state.artists_arr !== null && this.state.music_check === true && this.state.artists_arr.length === 1) ? <div>
<div className='border-0 p-2 flex-wrap parent_artist' >

                    <div className='d-flex flex-row justify-content-evenly justify-align-center p-1 align-middle mt-3' style={{height: "15rem"}}>
                                            <div className='d-flex flex-column ' style={{ width:"30%"}}  >

                                            <span className='p-0 mb-0 justify-align-center  ' style={{height:"11rem", width:"60%"}} ><img src={this.state.arr_artist[0].images[0].url} alt="" style={{ borderRadius:"50%",height:"100%",marginLeft:"4rem" }} className="justify-content-center"  /></span>
                                            <p className='artists_heading p-0 mt-3 text-center flex-fill artist_names'>{this.state.arr_artist[0].name}</p>
                                            </div>
                                            <div style={{ width: "10%", marginleft: "2rem "}} className="justify-content-center justify-align-center"  >
                                                <p className='artists_heading p-0 mt-1 text-center flex-fill sm '>Popularity</p>



                                                <div id='popularity_bar' ><CircularProgressbar value={this.state.arr_artist[0].popularity} text={this.state.arr_artist[0].popularity} strokeWidth={10} styles={buildStyles({textSize:"30px", textColor:"white", pathColor:"red"})} /></div>
                                            </div>
                                            <div>
                                                <p className='artists_heading p-0 mt-1 text-center flex-fill '>Followers</p>

                                                <span>{this.Commas(this.state.arr_artist[0].followers.total)}</span>

                                            </div>
                                            <div style={{ margin_left: "10px" }}>
                                                <p className='artists_heading p-0 mt-1 text-center flex-fill ' >Spotify Link</p>
                                               

                                                {/* eslint-disable-next-line */}
                                                <a href={this.state.arr_artist[0].external_urls.spotify} target="_blank" id='spotify_link' ><FaSpotify size={50} /></a>
                                               
                                            </div>
                                        </div>

                                        <div className='d-flex flex-column  mt-5 mb-3'>


                                        <p className='artists_heading' id='album_featuring' >Album featuring {this.state.arr_artist[0].name}</p>
                                        <div className='d-flex image_artist flex-row justify-content-center!important align-items-center p-1 align-middle  mt-5 mb-1' style={{marginLeft:"6rem", marginRight:"8rem"}}>

                                            
                                            {this.get_images(this.state.arr_artist[0].id).map((images, y) =>
                                                
                                                
                                                <img key="{y}" src={images} alt="" style={{width:"30%", height:"30%", marginLeft:"1rem", marginRight:"1rem"}} className="p-1  " />
                                                
                                                
                                                
                                                
                                                )}
                                        </div>



                                                </div>
                                    </div>





                </div> : (this.state.artists_arr !== undefined && this.state.artists_arr !== null && this.state.music_check === true && this.state.artists_arr.length > 1) ? <div>
                    <Carousel variant="dark" prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon border-0 p-2 " />} nextIcon={<span aria-hidden="true" className="carousel-control-next-icon"   />} controls={true} touch={false} indicators={false} interval={50000} >

                        {this.state.arr_artist.map(
                            (artist, index) => (

                                <Carousel.Item  className='border-0 p-2 flex-wrap parent_artist'  key="{index}" >
                                    
                                        <div className='d-flex flex-row justify-content-evenly justify-align-center p-1 align-middle mt-3' style={{height: "15rem"}}>
                                            <div className='d-flex flex-column ' style={{ width:"30%"}}  >

                                            <span className='p-0 mb-0 justify-align-center  ' style={{height:"11rem", width:"60%"}} ><img src={artist.images[0].url} alt="" style={{ borderRadius:"50%",height:"100%",marginLeft:"4rem" }} className="justify-content-center"  /></span>
                                            <p className='artists_heading p-0 mt-3 text-center flex-fill '>{artist.name}</p>
                                            </div>
                                            <div style={{ width: "10%", marginleft: "2rem "}} className="justify-content-center justify-align-center"  >
                                                <p className='artists_heading p-0 mt-1 text-center flex-fill sm '>Popularity</p>



                                                <div id='popularity_bar' ><CircularProgressbar value={artist.popularity} text={artist.popularity} strokeWidth={10} styles={buildStyles({textSize:"30px", textColor:"white", pathColor:"red"})} /></div>
                                            </div>
                                            <div>
                                                <p className='artists_heading p-0 mt-1 text-center flex-fill '>Followers</p>

                                                <span>{this.Commas(artist.followers.total)}</span>

                                            </div>
                                            <div style={{ margin_left: "10px" }}>
                                                <p className='artists_heading p-0 mt-1 text-center flex-fill ' >Spotify Link</p>
                                               

                                                {/* eslint-disable-next-line */}
                                                <a href={artist.external_urls.spotify} target="_blank" id='spotify_link' ><FaSpotify size={50} /></a>
                                               
                                            </div>
                                        </div>

                                        <div className='d-flex flex-column  mt-5 mb-3'>


                                        <p className='artists_heading' id='album_featuring' >Album featuring {this.state.arr_artist[0].name}</p>
                                        <div className='d-flex image_artist flex-row justify-content-center!important align-items-center p-1 align-middle  mt-5 mb-1' style={{marginLeft:"6rem", marginRight:"8rem"}}>

                                            
                                            {this.get_images(artist.id).map((images_, i) =>
                                                
                                                
                                                <img key="{i}" src={images_} alt="" style={{width:"30%", height:"30%", marginLeft:"1rem", marginRight:"1rem"}} className="p-1  " />
                                                
                                                
                                                
                                                
                                                )}
                                        </div>



                                                </div>
                                    


                                </Carousel.Item>
                            ))}







                    </Carousel>

                </div> : <div className='no_data justify-align-center text-center text-danger '>No music related artist details to show</div>}

            </>
        )
    }
}
