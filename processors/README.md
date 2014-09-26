Processors
===========


### Geocode

The geocode processor will read in the locations from locations.json and geocode the locations missing a lat and lng pair.

You can update the root location file by doing the following.

    npm i

    npm i -g coffeescript

    coffee geocode.coffee > tmp.json
    mv tmp.json ../locations.json
    rm tmp.json
