import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {
  constructor (props) {
    super(props);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMarkerMoved = this.onMarkerMoved.bind(this);
  }

  onMarkerClick (par) {
    // console.log(par, 'marker click param');
  }

  onMarkerMoved (marker_data, par2) {
    let position = { lat: par2.position.lat(), lng: par2.position.lng() };
    window.sessionStorage.setItem('gmap_marker', JSON.stringify(position));
  }

  render () {
    let marker_position = this.props.marker_coords || { lat: 37.778519, lng: -122.405640 };
    const style = {
      width: 'calc(100% - 30px)',
      height: '400px',
      position: 'relative'
    }
    // title={'Test title'}
    return (
      <div style={style}>
        <Map google={this.props.google} zoom={10} initialCenter={marker_position} style={style}>
          <Marker onClick={this.onMarkerClick}
            name={'Current location'}

            onDragend={this.onMarkerMoved}
            position={marker_position}
            draggable = {true}
          />

          <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>this.state.selectedPlace.name</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBA8nrWEy-nD9qPW4dnPVsuYGHNHTbgXxM'
})(MapContainer)
