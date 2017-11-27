import { Component, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController,  ToastController,  NavController  } from 'ionic-angular';


declare var google;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any;
  pos: any;
  devicePosition: Geoposition;


  constructor(public zone: NgZone, public geolocation: Geolocation, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navCtrl: NavController, ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {input: ''};
    this.autocompleteItems = [];
    this.markers = [];
    this.loading = this.loadingCtrl.create();
    
    
  }

  ionViewDidEnter(){

    /**
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.9011, lng: -56.1645},
      zoom: 15
    });
    */


    this.loading.present();
    this.geolocation.getCurrentPosition().then((position) => {

      this.devicePosition = position;
      this.markMyLocation();
      this.pos = {
        lat: this.devicePosition.coords.latitude,
        lng: this.devicePosition.coords.longitude
      };
      
      let latLng = new google.maps.LatLng(this.devicePosition.coords.latitude, this.devicePosition.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById('map'),mapOptions);
      

      
      this.loading.dismiss();
    }, (error) => {
      this.loading.dismiss();
      //this.messageToast(error.message);
    });
     
  }

  myLocation(){

    this.loading.present();
    this.clearMarkers();//remove previous markers
    this.geocoder.geocode({'location': this.pos}, (results, status) => {
      if(status === 'OK' && results[0]){
       this.GooglePlaces.nearbySearch({
          location: results[0].geometry.location,
          radius: '500',
          types: ['restaurant'], 
          key: 'AIzaSyCgSmTDbN6CzpQAR88D49LFRbLyMPFsK2g'
        }, (near_places) => {
          this.zone.run(() => {
       
            for (var i = 0; i < near_places.length; i++) {

                var marker = new google.maps.Marker({
                                position: near_places[i].geometry.location,
                                map: this.map,
                                title: near_places[i].name
                      
                              });
                this.markers.push(marker);
                var content = '<h4>'+near_places[i].name+'</h4>';
                this.addInfoWindow(marker, content);
                
            }

            this.markMyLocation();
            this.map.setCenter(results[0].geometry.location);
            this.loading.dismiss();
          });
        }).catch((error) => {
          console.log(error.message);
          this.loading.dismiss();
        });

      }



      this.loading.dismiss();
    }).catch((error) => {
      console.log(error.message);
      this.loading.dismiss();
    });

  }



  searchRestaurants() {
    this.loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.loading.dismiss();
      this.navCtrl.push('RestaurantsPage', {pos:pos});
      
    }).catch((error) => {
      console.log('Erro ao indetificar a localização', error.message);
      this.loading.dismiss();
    });
        



  }

  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  messageToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    }).present();
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker)
    });
  }

  markMyLocation(){
      var markerMyLocation = new google.maps.Marker({
        position: this.pos,
        color:'blue',
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor : '#039be5',
          strokeWeight : 5,
          scale: 5
        },
        title:'Minha localização'
      });
  
      this.markers.push(markerMyLocation);
  }

}