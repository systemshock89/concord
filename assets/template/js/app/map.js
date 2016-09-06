$(function () {

    // var GMAP = undefined;
    GMAP = initialize();

    $('.contacts-page .adress a').click(function() {
        $('.contacts-page .adress a').removeClass('active');
        $(this).toggleClass('active');
    });

}); // END READY

function initialize() {

    var styles = [ { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#cecece" }, { "visibility": "simplified" } ] },{ "featureType": "water", "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "featureType": "landscape", "stylers": [ { "color": "#ecece6" }, { "visibility": "simplified" } ] },{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [ { "color": "#8e8e8e" }, { "visibility": "on" } ] },{ "featureType": "administrative", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] },{ "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#cecece" } ] },{ "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },{ "featureType": "poi", "elementType": "geometry.fill", "stylers": [ { "visibility": "off" } ] },{ "featureType": "administrative.country", "elementType": "geometry.fill", "stylers": [ { "visibility": "off" }, { "color": "#a0a0a0" } ] } ];

  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

    var isMain = false;
    if ( window.location.href == "http://groupconcord.ru/"){
        isMain = true;
    }

    if (isMain){
        var myOptions = {
            center: new google.maps.LatLng(55.761066, 37.5845371),
            zoom: 12,
            disableDefaultUI: true,
            mapTypeControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };
    } else {
        var myOptions = {
            center: new google.maps.LatLng(55.761066, 37.5845371),
            zoom: 13,
            disableDefaultUI: true,
            mapTypeControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };
    }





  var map = new google.maps.Map(document.getElementById("map_canvas"),
      myOptions);
      map.mapTypes.set('map_style', styledMap);
  	  map.setMapTypeId('map_style');

  //var transitLayer = new google.maps.TransitLayer();
  //transitLayer.setMap(map);


 var pin_r = '/assets/template/img/pin_r_r.png';

 var TvrLat = new google.maps.LatLng(55.766260, 37.604296);
 var PresnLat = new google.maps.LatLng(55.7497929, 37.5374139);


// Метки Точек

   var Tvr = new google.maps.Marker({
      position: TvrLat,
      map: map,
      icon: pin_r
  });

   var Presn = new google.maps.Marker({
      position: PresnLat,
      map: map,
      icon: pin_r
  });

   var ret = new Object();
   ret.map = map;
   ret.Tvr = TvrLat;
   ret.Presn = PresnLat;
   return ret;
}
// Конец инициализация объектов на карте //
