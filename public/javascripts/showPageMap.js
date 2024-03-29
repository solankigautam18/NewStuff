mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: [12.550343, 55.665957], // starting position [lng, lat]
	zoom: 9, // starting zoom
});


new mapboxgl.Marker()
	.setLngLat([12.550343, 55.665957])
	// .setPopop(
	// 	new mapboxgl.Popup({offset: 25}).setHTML(
	// 		`<h3> ${campground.title} <p> ${campground.location} </p> </h3>`
	// 	)
	// )
	.addTo(map);
