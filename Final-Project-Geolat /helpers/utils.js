var geolib = require('geolib');
var request = require('request');

// Helper function
// Take the list of results from the db
// Filter out bad results
// Calculate additional parameters (distance, speed)
// Format and return the info
var SERVER_LOCATION = [39.043720245361, -77.487487792969];
function filterAndCalculate(results) {
    return results.filter(function(result) {
        return !(result.location === null || result.rtt === null || result.rtt < 5);
    }).map(function(result) {
        var distance = Math.round(geolib.getDistance(
            {latitude: SERVER_LOCATION[0], longitude: SERVER_LOCATION[1]},
            {latitude: result.location.coordinates[0], longitude: result.location.coordinates[1]}
        ) / 1609.34, 2);

        return {
            id: result.uuid,
            date: result.createdAt.toString(),
            location: result.location,
            rtt: result.rtt,
            distance: distance,
            speed: Math.round(distance / result.rtt),
            country: result.country,
            continent: result.continent
        };
    });
}

// Helper function
// Average values from an array and round result to 2 decimal places
function average(array) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return Math.round(sum / array.length, 2);
}

// Mapping of country codes to continent
var continentLookup = { "AD": "Europe",  "AE": "Asia",  "AF": "Asia",  "AG": "North America",  "AI": "North America",  "AL": "Europe",  "AM": "Asia",  "AN": "North America",  "AO": "Africa",  "AQ": "Antarctica",  "AR": "South America",  "AS": "Australia",  "AT": "Europe",  "AU": "Australia",  "AW": "North America",  "AZ": "Asia",  "BA": "Europe",  "BB": "North America",  "BD": "Asia",  "BE": "Europe",  "BF": "Africa",  "BG": "Europe",  "BH": "Asia",  "BI": "Africa",  "BJ": "Africa",  "BM": "North America",  "BN": "Asia",  "BO": "South America",  "BR": "South America",  "BS": "North America",  "BT": "Asia",  "BW": "Africa",  "BY": "Europe",  "BZ": "North America",  "CA": "North America",  "CC": "Asia",  "CD": "Africa",  "CF": "Africa",  "CG": "Africa",  "CH": "Europe",  "CI": "Africa",  "CK": "Australia",  "CL": "South America",  "CM": "Africa",  "CN": "Asia",  "CO": "South America",  "CR": "North America",  "CU": "North America",  "CV": "Africa",  "CX": "Asia",  "CY": "Asia",  "CZ": "Europe",  "DE": "Europe",  "DJ": "Africa",  "DK": "Europe",  "DM": "North America",  "DO": "North America",  "DZ": "Africa",  "EC": "South America",  "EE": "Europe",  "EG": "Africa",  "EH": "Africa",  "ER": "Africa",  "ES": "Europe",  "ET": "Africa",  "FI": "Europe",  "FJ": "Australia",  "FK": "South America",  "FM": "Australia",  "FO": "Europe",  "FR": "Europe",  "GA": "Africa",  "GB": "Europe",  "GD": "North America",  "GE": "Asia",  "GF": "South America",  "GG": "Europe",  "GH": "Africa",  "GI": "Europe",  "GL": "North America",  "GM": "Africa",  "GN": "Africa",  "GP": "North America",  "GQ": "Africa",  "GR": "Europe",  "GS": "Antarctica",  "GT": "North America",  "GU": "Australia",  "GW": "Africa",  "GY": "South America",  "HK": "Asia",  "HN": "North America",  "HR": "Europe",  "HT": "North America",  "HU": "Europe",  "ID": "Asia",  "IE": "Europe",  "IL": "Asia",  "IM": "Europe",  "IN": "Asia",  "IO": "Asia",  "IQ": "Asia",  "IR": "Asia",  "IS": "Europe",  "IT": "Europe",  "JE": "Europe",  "JM": "North America",  "JO": "Asia",  "JP": "Asia",  "KE": "Africa",  "KG": "Asia",  "KH": "Asia",  "KI": "Australia",  "KM": "Africa",  "KN": "North America",  "KP": "Asia",  "KR": "Asia",  "KW": "Asia",  "KY": "North America",  "KZ": "Asia",  "LA": "Asia",  "LB": "Asia",  "LC": "North America",  "LI": "Europe",  "LK": "Asia",  "LR": "Africa",  "LS": "Africa",  "LT": "Europe",  "LU": "Europe",  "LV": "Europe",  "LY": "Africa",  "MA": "Africa",  "MC": "Europe",  "MD": "Europe",  "ME": "Europe",  "MG": "Africa",  "MH": "Australia",  "MK": "Europe",  "ML": "Africa",  "MM": "Asia",  "MN": "Asia",  "MO": "Asia",  "MP": "Australia",  "MQ": "North America",  "MR": "Africa",  "MS": "North America",  "MT": "Europe",  "MU": "Africa",  "MV": "Asia",  "MW": "Africa",  "MX": "North America",  "MY": "Asia",  "MZ": "Africa",  "NA": "Africa",  "NC": "Australia",  "NE": "Africa",  "NF": "Australia",  "NG": "Africa",  "NI": "North America",  "NL": "Europe",  "NO": "Europe",  "NP": "Asia",  "NR": "Australia",  "NU": "Australia",  "NZ": "Australia",  "OM": "Asia",  "PA": "North America",  "PE": "South America",  "PF": "Australia",  "PG": "Australia",  "PH": "Asia",  "PK": "Asia",  "PL": "Europe",  "PM": "North America",  "PN": "Australia",  "PR": "North America",  "PS": "Asia",  "PT": "Europe",  "PW": "Australia",  "PY": "South America",  "QA": "Asia",  "RE": "Africa",  "RO": "Europe",  "RS": "Europe",  "RU": "Europe",  "RW": "Africa",  "SA": "Asia",  "SB": "Australia",  "SC": "Africa",  "SD": "Africa",  "SE": "Europe",  "SG": "Asia",  "SH": "Africa",  "SI": "Europe",  "SJ": "Europe",  "SK": "Europe",  "SL": "Africa",  "SM": "Europe",  "SN": "Africa",  "SO": "Africa",  "SR": "South America",  "ST": "Africa",  "SV": "North America",  "SY": "Asia",  "SZ": "Africa",  "TC": "North America",  "TD": "Africa",  "TF": "Antarctica",  "TG": "Africa",  "TH": "Asia",  "TJ": "Asia",  "TK": "Australia",  "TM": "Asia",  "TN": "Africa",  "TO": "Australia",  "TR": "Asia",  "TT": "North America",  "TV": "Australia",  "TW": "Asia",  "TZ": "Africa",  "UA": "Europe",  "UG": "Africa",  "US": "North America",  "UY": "South America",  "UZ": "Asia",  "VC": "North America",  "VE": "South America",  "VG": "North America",  "VI": "North America",  "VN": "Asia",  "VU": "Australia",  "WF": "Australia",  "WS": "Australia",  "YE": "Asia",  "YT": "Africa",  "ZA": "Africa",  "ZM": "Africa",  "ZW": "Africa" };


// Helper function
// Reverse geocodes a result to find the country and continent
// Initiates a callback function with an error or the filled results object
function reverseGeocode(result, callback) {
    var latlng = result.location.coordinates[0] + "," + result.location.coordinates[1];
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=AIzaSyAzNbfObZ2JWVGV9EfApshy1hxETOLONlM";
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            if (!data || !data.results) {
                callback({}, result);
                console.log(url);
            } else {
                var address = null;

                data.results.forEach(function(result) {
                    result.address_components.forEach(function(component) {
                        if (component.types[0] == 'country') {
                            address = {
                                country: component.long_name,
                                country_abbreviation: component.short_name
                            };
                        }
                    });
                });

                if (!address || !address.country || !address.country_abbreviation) {
                    callback({}, result);
                    console.log(url);
                } else {
                    result.country = address.country;
                    result.country_abbreviation = address.country_abbreviation;
                    result.continent = continentLookup[address.country_abbreviation];

                    callback(null, result);
                }
            }
        } else {
            callback({}, result);
        }
    });
}

module.exports = {
    filterAndCalculate: filterAndCalculate,
    average: average,
    reverseGeocode: reverseGeocode
};
