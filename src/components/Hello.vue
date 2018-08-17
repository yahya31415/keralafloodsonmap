<template>
  <v-container fluid class="hello pa-0">
    <div id="map"></div>
    <div id="panel" class="grey lighten-3">
      <v-container>
        <h3 class="display-3">Kerala Floods</h3>
      </v-container>
      <v-card v-if="af_e_open">
        <v-card-title>
          Add affected person
        </v-card-title>
        <v-card-text>
          <v-text-field id="search"></v-text-field>
          <v-text-field v-model="afe_name" placeholder="Name"></v-text-field>
          <v-text-field v-model="afe_phone" placeholder="Phone"></v-text-field>
          <v-btn @click="add_afe">Add</v-btn>
        </v-card-text>
      </v-card>
      <v-card class="mt-2 mb-2">
        <v-card-title>
          <h4 class="display-1">Actions</h4>
        </v-card-title>
        <v-card-text>
          <v-btn @click="af_pe">Mark an affected person</v-btn>
          <!-- <v-btn>Mark an affected area</v-btn> -->
        </v-card-text>
      </v-card>
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
      afe_markers: []
    }
  },
  computed: {
    afe () {
      return this.$root.afe
    }
  },
  watch: {
    afe () {
      var res = []
      for (var i in this.afe) {
        var marker = new window.google.maps.Marker({
          position: this.afe[i].latlng,
          map: this.map,
          label: 'A',
          animation: window.google.maps.Animation.DROP,
          title: 'Effected Person\'s Location'
        })
        res.push(marker)
      }
      this.afe_markers = res
    }
  },
  methods: {
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
        phone: this.afe_phone
      })
    }
  },
  mounted () {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 10.6127242, lng: 75.88381},
      zoom: 8
    })
    const stretchMap = () => {
      const height = window.innerHeight
      const width = window.innerWidth
      const map = document.getElementById('map')
      map.style.height = height + 'px'
      map.style.width = width - 495 + 'px'
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
  width: 480px;
  box-sizing: border-box;
  background: #fff;
}
.v-card {
  width: 400px;
  margin: auto;
}
@media (max-width: 800px) {
  #panel {
    height: 33%;
    left: 0;
    top: unset;
    width: 100%;
    overflow-y: auto;
  }
  h3 {
    display: none;
  }
}
</style>
