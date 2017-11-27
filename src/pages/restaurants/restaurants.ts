import { Component, NgZone} from '@angular/core';
import { LoadingController, IonicPage, NavParams,  NavController   } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html'
})
export class RestaurantsPage {
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  nearbyItems: any = new Array<any>();
  loading: any;
  pos: any;

  constructor( public zone: NgZone, public loadingCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams ) {
    this.pos = this.navParams.get('pos');

    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.autocompleteItems = [];
    this.loading = this.loadingCtrl.create();
    this.getlist();
  }




  getlist(){
    this.loading.present();
    this.autocompleteItems = [];
    this.geocoder.geocode({'location': this.pos}, (results, status) => {
      if(status === 'OK' && results[0]){
        this.autocompleteItems = [];
        this.GooglePlaces.nearbySearch({
          location: results[0].geometry.location,
          radius: '500',
          types: ['restaurant'], 
          key: 'AIzaSyCgSmTDbN6CzpQAR88D49LFRbLyMPFsK2g'
        }, (near_places) => {
          this.zone.run(() => {
            this.nearbyItems = [];
            for (var i = 0; i < near_places.length; i++) {
              this.nearbyItems.push(near_places[i]);
            }
            this.loading.dismiss();
          });
        })
      }
    });
  }
}
