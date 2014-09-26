Promise = require('bluebird')
fs      = Promise.promisifyAll(require('fs'))
path    = require('path')
request = require('request-promise')
base    = "https://maps.googleapis.com/maps/api/geocode/json?address="

fs.readFileAsync(path.join('../', 'locations.json'), 'utf8')
.then (locs) ->
  Promise.resolve(JSON.parse(locs))
.then (locs) ->
  Promise.reduce(locs, ((list, loc, index) ->
    # return if locs[index-1].location?

    request.get(base+encodeURIComponent("#{loc.address || ''}, #{loc.country}"))
    .then((v) ->
      v = JSON.parse(v)
      locs[index].location = v?.results?[0]?.geometry.location
    )
  ), [])
  .then -> locs
.then (locs) ->
  console.log JSON.stringify(locs, null, 2)
