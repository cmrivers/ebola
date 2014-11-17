Promise = require('bluebird')
fs      = Promise.promisifyAll(require('fs'))
path    = require('path')
request = require('request-promise')
base    = "https://maps.googleapis.com/maps/api/geocode/json?address="

fs.readFileAsync(path.join('../', 'map_data/', 'locations.geojson'), 'utf8')
.then (locs) ->
  Promise.resolve(JSON.parse(locs).features)
.then (locs) ->
  Promise.reduce(locs, ((list, loc, index) ->
   return if locs[index].geometry?

   request.get(base+encodeURIComponent("#{loc.properties.address || ''}, #{loc.properties.country}"))
    .then((v) ->
      v = JSON.parse(v)
      return unless  v?.results?[0]?.geometry.location

      locs[index].geometry =
        type: "Point",
        coordinates: [
          v.results[0].geometry.location.lng,
          v.results[0].geometry.location.lat
        ]
      )
  ), [])
  .then -> locs
.then (locs) ->
  console.log JSON.stringify({
    type: "FeatureCollection",
    features: locs
  }, null, 2)
