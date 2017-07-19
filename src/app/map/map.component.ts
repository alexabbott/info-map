import { Component, Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/take';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../services/global.service';
import '../../assets/markerclusterer.js';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  mapOptions: any;
  markerOptions: any;
  map: any;
  markers: any;
  coordinates: string;
  newlocation: string;
  locations: FirebaseListObservable<any[]>;
  showReset: boolean;
  googleMarkers: any;
  google: any;
  markerCount: number;
  markerCluster: any;

  constructor(public af: AngularFire, public globalService: GlobalService, public zone: NgZone, public router: Router, public route: ActivatedRoute) {
    const me = this;
    this.locations = af.database.list('/location-posts');
    this.googleMarkers = [];
    this.mapOptions = {
      zoom: 3,
      center: {lat: 35.730610, lng: -44.935242 },
      mapTypeControl: false,
      minZoom: 2,
      streetViewControl: false,
      styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#944242"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"},{"saturation":"-1"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#292929"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#494949"},{"saturation":"-85"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#888888"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dddddd"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]}]
    };

    this.locations.subscribe(locations => {
      if (!this.map) {
        this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
        this.globalService.updateMap(this.map);

        this.route.params.subscribe(() => {
          let locRef = this.af.database.object('/location-posts/' + this.route.snapshot.queryParams['search']);
          locRef.subscribe(ref => {
            if (ref.coordinates) {
              this.map.setCenter(new google.maps.LatLng(parseFloat(ref.coordinates.split(',')[0].trim()), parseFloat(ref.coordinates.split(',')[1].trim())));
              this.map.setZoom(8);
            }
          });
        });
      }
      this.markerCluster = new window['MarkerClusterer'](this.map, this.googleMarkers, { imagePath: '../../assets/cluster' } );
      this.initAutoComplete();

      // getLocation();

      // function getLocation() {
      //   if (navigator.geolocation) {
      //       navigator.geolocation.getCurrentPosition(showPosition);
      //   } else {
      //       console.log('Geolocation is not supported by this browser.');
      //   }
      // }

      // function showPosition(position) {
      //   me.map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
      //   me.map.setZoom(6);
      // }
    });

    this.locations.$ref.on("child_added", (location) => {
      if (location && location.val().coordinates) {
        let coordinatesArray = location.val().coordinates.split(',');
        let newMarker: any = new google.maps.Marker({
          position: {lat: parseFloat(coordinatesArray[0]), lng: parseFloat(coordinatesArray[1].trim())},
          title: location.key,
          map: me.map,
          icon: '../../assets/green-dot.png'
        });
        this.googleMarkers.push(newMarker);
        newMarker.addListener('click', function() {
          me.zone.run(() => {
            me.showReset = true;
            me.map.setCenter({lat: newMarker.position.lat(), lng: newMarker.position.lng()});
            me.map.setZoom(me.map.getZoom() + 1);
            me.globalService.filterBy.next('location');
            me.globalService.locationPosts.next(newMarker.title);
            me.globalService.showLocationPosts.next(true);
            me.globalService.updateReset();
            me.router.navigate(['/'], { queryParams: {search: newMarker.title} });
          });
        });
      }
    });

    globalService.coordinates.subscribe(coo => {
      this.coordinates = coo;
      if (this.coordinates) {
        let coordinateArray = this.coordinates.split(',');
        this.map.setCenter(new google.maps.LatLng(parseFloat(coordinateArray[0].trim()), parseFloat(coordinateArray[1].trim())));
        this.map.setZoom(10);
      }
    });
  }

  initAutoComplete() {
    let me = this;
    const input = <HTMLInputElement>document.getElementById('autocomplete');
    const autocompleteOptions = {
      types: ['(cities)']
    };
    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      this.globalService.postCoordinates.next(place.geometry.location.toString().replace('(', '').replace(')', ''));
      this.globalService.postLocation.next(place.formatted_address.replace(/[0-9]/g, '').replace(' ,', ','));

      if (!place.geometry) {
        console.log("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
        this.map.setZoom(10);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(10);
      }

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
    });
  }
}
