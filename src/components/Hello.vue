<template>
  <v-container fluid class="hello pa-0">
    <div id="map"></div>
    <div id="panel" class="white elevation-2">
      <v-container class="hide-mobile">
        <h3 class="display-3 ml-1 pl-2 grey--text text-darken-1">Kerala Floods</h3>
      </v-container>
      <v-card flat v-if="af_e_open" class="">
        <v-card-title>
          <h3> Add an Affected Person</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field id="search"></v-text-field>
          <v-text-field v-model="afe_name" placeholder="Name"></v-text-field>
          <v-text-field v-model="afe_phone" placeholder="Phone"></v-text-field>
          <v-btn @click="add_afe" class="red white--text lighten-1">Add</v-btn>
          <v-btn @click="af_e_open = false" class="grey white--text lighten-1">Close</v-btn>
        </v-card-text>
      </v-card>
      <v-card v-if="rec_open" flat class="">
        <v-card-title>
          <h3>Add Relief Camp</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field id="search"></v-text-field>
          <v-text-field v-model="rec_name" placeholder="Name"></v-text-field>
          <v-text-field v-model="rec_phone" placeholder="Phone"></v-text-field>
          <v-text-field v-model="rec_place" placeholder="Place"></v-text-field>
          <v-text-field v-model="rec_room" placeholder="Room"></v-text-field>
          <v-btn @click="add_rec" class="red white--text lighten-1">Add</v-btn>
          <v-btn @click="rec_open = false" class="grey white--text lighten-1">Close</v-btn>
        </v-card-text>
      </v-card>
      <v-card flat>
        <v-card-title>
          <h3>Actions</h3>
        </v-card-title>
        <v-card-text>
          <v-btn flat @click="af_pe" class="white red--text">Mark an affected person</v-btn>
          <v-btn flat @click="boata" class="white text--darken-2 teal--text">Im on a boat</v-btn>
          <v-btn flat @click="reca" class="white text--darken-2 cyan--text">Add a relief camp</v-btn>
          <!-- <v-btn>Mark an affected area</v-btn> -->
        </v-card-text>
      </v-card>
      <v-card flat class="">
        <v-card-title>
          <h3 class="grey--text text--lighten-1">Legend</h3>
        </v-card-title>
        <v-card-text>
          <p>Click on the markers (in the map) for more info</p>
          <v-layout align-items-center style="line-height: 24px"><img src="/static/icons/a.png" width="24" alt="" class="mr-2"> - Affected Person ({{ afe.length }})</v-layout>
          <v-layout class="pt-3" align-items-center style="line-height: 24px"><img src="/static/icons/boat.png" width="24" height="24" style="object-fit: contain" alt="" class="mr-2"> - Boat ({{ boat.length }})</v-layout>
          <v-layout class="pt-3" align-items-center style="line-height: 24px"><img src="/static/icons/house.png" width="24" height="24" style="object-fit: contain" alt="" class="mr-2"> - Relief Camp ({{ rec_markers.length }})</v-layout>
        </v-card-text>
      </v-card>
      <v-card flat v-if="helpline">
        <v-card-title>
          <h3 @click="hn_open = !hn_open" class="teal--text text--darken-3 pointer">Helpline Numbers</h3>
        </v-card-title>
        <v-card-text v-if="hn_open">
          <v-data-table :items="helpline.filter(h => h['Contact Number'].length > 0)" :headers="['Contact Number', 'District', 'Name', 'Type of service'].map((h) => {
            return {text: h, sortable: h === 'District' || h === 'Type of service', value: h}
          })">
            <template slot="items" slot-scope="props">
              <td style="max-width: 140px; word-break: break-all;">{{ typeof props.item['Contact Number'] === 'string' ? props.item['Contact Number'].trim() : props.item['Contact Number'] }}</td>
              <td>{{ props.item['District'] }}</td>
              <td style="max-width: 140px">{{ props.item['Name'] }}</td>
              <td>{{ props.item['Type of service'] }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-card flat  v-if="rel_camps">
        <v-card-title>
          <h3 @click="rc_open = !rc_open" class="cyan--text text--darken-3 pointer">Relief Camps</h3>
        </v-card-title>
        <v-card-text v-if="rc_open">
          <v-data-table :items="rel_camps.filter(h => h.Place)" :headers="['Name', 'Phone', 'Place', 'Room'].map((h) => {
            return {text: h, sortable: true, value: h}
          })">
            <template slot="items" slot-scope="props">
              <td>{{ props.item['Name'] }}</td>
              <td>{{ props.item['Phone'] }}</td>
              <td style="max-width: 140px">{{ props.item['Place'] }}</td>
              <td>{{ props.item['Room'] }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-layout justify-center align-center class="mt-5">
        <v-btn flat class="grey--text" href="mailto:yahya@codeworm.io">Contact Us</v-btn>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA',
      af_e_open: false,
      af_ar_open: false,
      af_e_mar: null,
      af_ar_mar: null,
      afe_name: '',
      afe_phone: '',
      rec_name: '',
      rec_phone: '',
      rec_room: '',
      rec_place: '',
      afe_markers: [],
      afe_iwindows: [],
      boat_markers: [],
      boat_iwindows: [],
      rec_markers: [],
      rec_iwindows: [],
      rec_open: false,
      hn_open: false,
      rc_open: false
    }
  },
  computed: {
    afe () {
      return this.$root.afe.filter(a => !a.safe)
    },
    boat () {
      return this.$root.boat
    },
    helpline () {
      return this.$root.helpline
    },
    rel_camps () {
      return this.$root.rel_camps
    }
  },
  watch: {
    afe () {
      var re = []
      var res = []
      for (var i in this.afe) {
        var infowindow = new window.google.maps.InfoWindow({
          content: `<h3>${this.afe[i].name}</h3><p>${this.afe[i].phone}</p><a href="/#/mark/safe/${this.afe[i]['.key']}">Mark Safe</a><span style="display: none">%11%${JSON.stringify(this.afe[i].latlng)}%11%</span>`
        })
        var marker = new window.google.maps.Marker({
          position: this.afe[i].latlng,
          map: this.map,
          icon: '/static/icons/a.png',
          animation: window.google.maps.Animation.DROP,
          title: this.afe[i].name
        })
        re.push(infowindow)
        res.push(marker)
        res[res.indexOf(marker)].addListener('click', (i) => {
          const latlng = i.latLng
          const mar = this.afe_markers.find((mar) => mar.position.lat() === latlng.lat() && mar.position.lng() === latlng.lng())
          console.log((this.afe_iwindows[0].content.split('%11%')[1]))
          const iw = this.afe_iwindows.find((iwi) => JSON.parse(iwi.content.split('%11%')[1]).lat === latlng.lat() && JSON.parse(iwi.content.split('%11%')[1]).lng === latlng.lng())
          iw.open(this.map, mar)
        })
      }
      this.afe_markers.forEach((m) => m.setMap(null))
      this.afe_markers = res
      this.afe_iwindows = re
    },
    boat () {
      var re = []
      var res = []
      for (var i in this.boat) {
        var infowindow = new window.google.maps.InfoWindow({
          content: `<h3>${this.boat[i]['.key']}</h3><span style="display: none">%11%${this.boat[i].position}%11%</span>`
        })
        var marker = new window.google.maps.Marker({
          position: this.boat[i].position,
          icon: '/static/icons/boat.png',
          map: this.map,
          label: 'B',
          animation: window.google.maps.Animation.DROP,
          title: this.boat[i]['.key']
        })
        re.push(infowindow)
        res.push(marker)
        res[res.indexOf(marker)].addListener('click', (i) => {
          const latlng = i.latLng
          const mar = this.boat_markers.find((mar) => mar.position.lat() === latlng.lat() && mar.position.lng() === latlng.lng())
          const iw = this.boat_iwindows.find((iwi) => JSON.parse(iwi.content.split('%11%')[1]).lat === latlng.lat() && JSON.parse(iwi.content.split('%11%')[1]).lng === latlng.lng())
          iw.open(this.map, mar)
        })
      }
      this.boat_markers.forEach((m) => m.setMap(null))
      this.boat_markers = res
      this.boat_iwindows = re
    },
    rel_camps () {
      var re = []
      var res = []
      for (var i in this.rel_camps) {
        if (this.rel_camps[i].latlng) {
          const ll = this.rel_camps[i].latlng
          const camp = this.rel_camps[i]
          var infowindow = new window.google.maps.InfoWindow({
            content: `<div><p><h3>Contact ${camp['Name']}</h3></p><p>Phone: ${camp['Phone']}</p><p>Place: ${camp['Place']}</p><p>Room: ${camp['Room']}</p><p>Age: ${camp['age']}</p><span style="display: none">%11%${JSON.stringify(ll)}%11%</span></div>`
          })
          var marker = new window.google.maps.Marker({
            position: ll,
            icon: {
              url: '/static/icons/house.png'
            },
            map: this.map,
            animation: window.google.maps.Animation.DROP,
            title: this.rel_camps[i]['Room']
          })
          marker.addListener('click', (i) => {
            const latlng = i.latLng
            const mar = this.rec_markers.find((mar) => mar.position.lat() === latlng.lat() && mar.position.lng() === latlng.lng())
            const iw = this.rec_iwindows.find((iwi) => JSON.parse(iwi.content.split('%11%')[1]).lat === latlng.lat() && JSON.parse(iwi.content.split('%11%')[1]).lng === latlng.lng())
            iw.open(this.map, mar)
          })
          re.push(infowindow)
          res.push(marker)
          this.rec_markers = res
          this.rec_iwindows = re
        }
        const geocoder = new window.google.maps.Geocoder()
        const camp = this.rel_camps[i]
        geocoder.geocode({address: this.rel_camps[i]['Place']}, (result, status) => {
          if (result === null || result.length === 0) return
          const ll = result[0].geometry.location
          var infowindow = new window.google.maps.InfoWindow({
            content: `<div><p><h3>Contact ${camp['Name']}</h3></p><p>Phone: ${camp['Phone']}</p><p>Place: ${camp['Place']}</p><p>Room: ${camp['Room']}</p><p>Age: ${camp['age']}</p><span style="display: none">%11%${JSON.stringify(ll)}%11%</span></div>`
          })
          var marker = new window.google.maps.Marker({
            position: ll,
            icon: {
              url: '/static/icons/house.png'
            },
            map: this.map,
            animation: window.google.maps.Animation.DROP,
            title: this.rel_camps[i]['Room']
          })
          marker.addListener('click', (i) => {
            const latlng = i.latLng
            const mar = this.rec_markers.find((mar) => mar.position.lat() === latlng.lat() && mar.position.lng() === latlng.lng())
            const iw = this.rec_iwindows.find((iwi) => JSON.parse(iwi.content.split('%11%')[1]).lat === latlng.lat() && JSON.parse(iwi.content.split('%11%')[1]).lng === latlng.lng())
            iw.open(this.map, mar)
          })
          re.push(infowindow)
          res.push(marker)
          this.rec_markers = res
          this.rec_iwindows = re
        })
      }
    }
  },
  methods: {
    reca () {
      this.rec_open = true
      this.af_e_mar = new window.google.maps.Marker({
        position: {lat: 10.6127242, lng: 75.88381},
        map: this.map,
        label: '+',
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Relief Camp\'s Location'
      })
      this.$nextTick(() => {
        var autocomplete = new window.google.maps.places.Autocomplete(document.querySelector('#search'))

        // // Bind the map's bounds (viewport) property to the autocomplete object,
        // // so that the autocomplete requests use the current map bounds for the
        // // bounds option in the request.
        autocomplete.bindTo('bounds', this.map)

        // // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name'])

        var infowindow = new window.google.maps.InfoWindow()
        var infowindowContent = document.getElementById('infowindow-content')
        infowindow.setContent(infowindowContent)

        autocomplete.addListener('place_changed', function () {
          infowindow.close()
          this.af_e_mar.setVisible(false)
          var place = autocomplete.getPlace()
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'")
            return
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport)
          } else {
            this.map.setCenter(place.geometry.location)
            this.map.setZoom(17) // Why 17? Because it looks good.
          }
          this.af_e_mar.setPosition(place.geometry.location)
          this.af_e_mar.setVisible(true)

          /* eslint-disable no-mixed-operators */
          var address = ''
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ')
          }

          infowindowContent.children['place-icon'].src = place.icon
          infowindowContent.children['place-name'].textContent = place.name
          infowindowContent.children['place-address'].textContent = address
          infowindow.open(this.map, this.af_e_mar)
        }.bind(this))
      })
    },
    boata () {
      var phone = prompt('Enter phone number')
      if (phone.length === 10 || phone.length === 13) {
        window.navigator.geolocation.watchPosition((position) => {
          const ll = {lat: position.coords.latitude, lng: position.coords.longitude}
          this.$root.$firebaseRefs.boat.child(phone).set({position: ll,
            timestamp: new Date()})
        })
        window.onbeforeunload = () => {
          this.$root.$firebaseRefs.boat.child(phone).remove()
        }
      }
    },
    af_pe () {
      this.af_e_open = true
      this.af_e_mar = new window.google.maps.Marker({
        position: {lat: 10.6127242, lng: 75.88381},
        map: this.map,
        label: '+',
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Effected Person\'s Location'
      })
      this.$nextTick(() => {
        var autocomplete = new window.google.maps.places.Autocomplete(document.querySelector('#search'))

        // // Bind the map's bounds (viewport) property to the autocomplete object,
        // // so that the autocomplete requests use the current map bounds for the
        // // bounds option in the request.
        autocomplete.bindTo('bounds', this.map)

        // // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name'])

        var infowindow = new window.google.maps.InfoWindow()
        var infowindowContent = document.getElementById('infowindow-content')
        infowindow.setContent(infowindowContent)

        autocomplete.addListener('place_changed', function () {
          infowindow.close()
          this.af_e_mar.setVisible(false)
          var place = autocomplete.getPlace()
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'")
            return
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport)
          } else {
            this.map.setCenter(place.geometry.location)
            this.map.setZoom(17) // Why 17? Because it looks good.
          }
          this.af_e_mar.setPosition(place.geometry.location)
          this.af_e_mar.setVisible(true)

          /* eslint-disable no-mixed-operators */
          var address = ''
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ')
          }

          infowindowContent.children['place-icon'].src = place.icon
          infowindowContent.children['place-name'].textContent = place.name
          infowindowContent.children['place-address'].textContent = address
          infowindow.open(this.map, this.af_e_mar)
        }.bind(this))
      })
    },
    add_afe () {
      this.$root.$firebaseRefs.afe.push({
        latlng: {lat: this.af_e_mar.position.lat(), lng: this.af_e_mar.position.lng()},
        name: this.afe_name,
        phone: this.afe_phone,
        timestamp: new Date().getTime()
      })
      this.af_e_mar.setVisible(false)
      this.afe_name = ''
      this.afe_phone = ''
    },
    add_rec () {
      this.$root.$firebaseRefs.rel_camps.push({
        latlng: {lat: this.af_e_mar.position.lat(), lng: this.af_e_mar.position.lng()},
        Name: this.rec_name,
        Phone: this.rec_phone,
        Room: this.rec_room,
        Place: this.rec_place,
        timestamp: new Date().getTime()
      })
      this.af_e_mar.setVisible(false)
      this.rec_name = ''
      this.rec_phone = ''
      this.rec_room = ''
      this.rec_place = ''
    }
  },
  mounted () {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 10.6127242, lng: 75.88381},
      zoom: 8,
      styles: [
        {
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#f5f5f5'
            }
          ]
        },
        {
          'elementType': 'labels.icon',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#616161'
            }
          ]
        },
        {
          'elementType': 'labels.text.stroke',
          'stylers': [
            {
              'color': '#f5f5f5'
            }
          ]
        },
        {
          'featureType': 'administrative.land_parcel',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#bdbdbd'
            }
          ]
        },
        {
          'featureType': 'poi',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#eeeeee'
            }
          ]
        },
        {
          'featureType': 'poi',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#757575'
            }
          ]
        },
        {
          'featureType': 'poi.park',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#e5e5e5'
            }
          ]
        },
        {
          'featureType': 'poi.park',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#9e9e9e'
            }
          ]
        },
        {
          'featureType': 'road',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#ffffff'
            }
          ]
        },
        {
          'featureType': 'road.arterial',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#757575'
            }
          ]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#dadada'
            }
          ]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#616161'
            }
          ]
        },
        {
          'featureType': 'road.local',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#9e9e9e'
            }
          ]
        },
        {
          'featureType': 'transit.line',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#e5e5e5'
            }
          ]
        },
        {
          'featureType': 'transit.station',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#eeeeee'
            }
          ]
        },
        {
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#c9c9c9'
            }
          ]
        },
        {
          'featureType': 'water',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#9e9e9e'
            }
          ]
        }
      ]
    })
    const stretchMap = () => {
      const height = window.innerWidth < 800 ? window.innerHeight * 0.35 : window.innerHeight
      const width = window.innerWidth
      const map = document.getElementById('map')
      map.style.height = height + 'px'
      map.style.width = width - 735 + 'px'
    }
    stretchMap()
    window.onresize = stretchMap
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#map {
  width: 100%;
  height: 100%;
}
#panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 720px;
  box-sizing: border-box;
  background: #fff;
    overflow-y: auto;
}
.v-card {
  width: 650px;
  margin: auto;
  border-bottom: solid 1px rgba(0,0,0,0.13);
}
.pointer {
  cursor: pointer;
}
@media (max-width: 800px) {
  .hide-mobile {
  display: none;
}
  #panel {
    position: static;
    padding: 6px 6px;
    box-sizing: border-box;
    width: 98%;
    left: 0;
    top: unset;
    overflow-y: auto;
  }
}
</style>
