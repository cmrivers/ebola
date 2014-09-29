Processors
===========


### Geocode

The geocode processor will read in the locations from locations.geojson and geocode the locations missing a geometry.

You can update the root location file by doing the following.

    npm i

    npm i -g coffeescript

    coffee geocode.coffee > tmp.geojson
    mv tmp.geojson ../locations.geojson
