import express from 'express';
import request from 'request';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';
import cron from 'node-cron';
import { MongoClient } from 'mongodb';
import countryList from './country_list.json' assert { type: 'json' };

const db = 'covid-19';
const collection = 'covid_statistics';

const app = express();
app.use(cors());

const url = 'mongodb://localhost:27017/' + db;

// Run every minute
cron.schedule('23 59 * * * *', async function () {
    const dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = 2021;//dateObj.getUTCFullYear(); // Use current year

    const month_name = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let formattedMonth = month;

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    const newdate = `${month}-${day}-${year}`;

    const formatted_date = `${day} ${month_name[formattedMonth - 1]} ${year}`;
    const fileName = `${newdate}.csv`;

    const results = [];
    let data = [];
    let totalConfirmed = 0;
    let totalDeaths = 0;
    let totalRecovered = 0;

    const file = fs.createWriteStream(fileName);

    try {
        await new Promise((resolve, reject) => {
            // Correct the raw CSV URL (example URL from a raw file in GitHub)
            const csvUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${fileName}`;

            // Download and save the CSV file
            request({ uri: csvUrl })
                .pipe(file)
                .on('finish', () => {
                    // Read the file after it's saved
                    fs.createReadStream(fileName)
                        .pipe(csv())
                        .on('data', (data) => results.push(data))
                        .on('end', () => {
                            if (results.length > 0) {
                                for (let i = 0; i < results.length; i++) {
                                    totalConfirmed = parseInt(results[i].Confirmed) + totalConfirmed;
                                    totalDeaths = parseInt(results[i].Deaths) + totalDeaths;
                                    totalRecovered = parseInt(results[i].Recovered) + totalRecovered;
                                }

                                // Process data for each country
                                for (let j = 0; j < countryList.length; j++) {
                                    const country_obj = JSON.parse(JSON.stringify(countryList[j]));

                                    const state = getStatistics(country_obj, results);
                                    data.push(state);
                                }

                                // Create the data object to insert into MongoDB
                                const items = {
                                    total_confirmed: totalConfirmed,
                                    total_deaths: totalDeaths,
                                    total_recovered: totalRecovered,
                                    last_date_updated: formatted_date,
                                    country_statistics: data.sort((a, b) => b.confirmed - a.confirmed),
                                };

                                // Connect to MongoDB and insert data
                                MongoClient.connect(url, function (err, client) {
                                    if (err) throw err;
                                    const database = client.db(db);
                                    // Delete all existing data in the collection before inserting new data
                                    database.collection(collection).deleteOne({}, (err) => {
                                        if (err) throw err;
                                        // Insert the new data
                                        database.collection(collection).insertOne(items, (err, res) => {
                                            if (err) throw err;
                                            console.log('Data successfully inserted');
                                            client.close();
                                        });
                                    });
                                });
                            }
                        });
                    resolve();
                })
                .on('error', (error) => {
                    console.log(`Error downloading file: ${error}`);
                    reject(error);
                });
        });
    } catch (error) {
        console.log(`Something went wrong: ${error}`);
    }
});

app.get('/', async function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        const database = client.db(db);
        database.collection(collection).findOne().then(function (result) {
            if (result) {
                res.json(result);
            } else {
                res.status(404).send('No data found');
            }
        });
    });
});

app.get('/markers.geojson', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        const database = client.db(db);
        database.collection(collection).findOne().then(function (results) {
            if (results) {
                const data = [];
                const result = JSON.parse(JSON.stringify(results));
                let total_cases = 0;

                let country;

                for (let i = 0; i < result.country_statistics.length; i++) {
                    country = result.country_statistics[i].country;

                    for (let j = 0; j < result.country_statistics[i].states.length; j++) {

                        let state_name;
                        let state_address;
                        let latitude;
                        let longitude;
                        let confirmed = 0;
                        let deaths = 0;
                        let recovered = 0;

                        const name = result.country_statistics[i].states[j].name;

                        result.country_statistics[i].states.filter(city => city.name === name).map(e => {
                            state_name = e.name;
                            state_address = e.address;
                            latitude = e.latitude;
                            longitude = e.longitude;
                            confirmed = confirmed + parseInt(e.confirmed);
                            deaths = deaths + parseInt(e.deaths);
                            recovered = recovered + parseInt(e.recovered);
                            total_cases = parseInt(confirmed) + parseInt(deaths) + parseInt(recovered);
                        });

                        const item = {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [longitude, latitude]
                            },
                            properties: {
                                key: j,
                                country: country,
                                name: state_name,
                                address: state_address,
                                confirmed: confirmed,
                                deaths: deaths,
                                recovered: recovered,
                                total_cases: total_cases
                            }
                        };
                        data.push(item);
                    }
                }
                const filteredData = data.filter((obj, pos, arr) => {
                    return arr.map(mapObj => mapObj.properties.name).indexOf(obj.properties.name) == pos;
                });
                res.json(filteredData);
            }
        });
    });
});

function getStatistics(country_obj, results) {
    const statistics = [];

    let country;
    let code;
    let flag;
    let coordinates;

    let confirmed = 0;
    let deaths = 0;
    let recovered = 0;

    let state_name;
    let state_latitude;
    let state_longitude;
    let state_address;
    let state_confirmed_count = 0;
    let state_deaths_count = 0;
    let state_recovered_count = 0;

    let country_statistics;

    for (let i = 0; i < results.length; i++) {
        if (results[i].Country_Region == country_obj.country) {
            country = results[i].Country_Region;
            code = country_obj.code;
            flag = country_obj.flag;
            coordinates = country_obj.coordinates;

            confirmed = parseInt(results[i].Confirmed) + confirmed;
            deaths = parseInt(results[i].Deaths) + deaths;
            recovered = parseInt(results[i].Recovered) + recovered;

            if (results[i].Province_State.length > 0) {
                state_name = results[i].Province_State;
            } else {
                state_name = country;
            }
            state_address = results[i].Combined_Key;

            if (results[i].Lat !== undefined && results[i].Lat.length > 0 && results[i].Long_ !== undefined && results[i].Long_.length > 0) {
                state_latitude = parseFloat(results[i].Lat);
                state_longitude = parseFloat(results[i].Long_);
            } else {
                state_latitude = 0.0;
                state_longitude = 0.0;
            }

            state_confirmed_count = parseInt(results[i].Confirmed);
            state_deaths_count = parseInt(results[i].Deaths);
            state_recovered_count = parseInt(results[i].Recovered);
        }
    }

    country_statistics = {
        country: country,
        country_code: code,
        flag: flag,
        coordinates: coordinates,
        confirmed: confirmed,
        deaths: deaths,
        recovered: recovered,
        states: [{
            name: state_name,
            latitude: state_latitude,
            longitude: state_longitude,
            address: state_address,
            confirmed: state_confirmed_count,
            deaths: state_deaths_count,
            recovered: state_recovered_count
        }]
    };

    statistics.push(country_statistics);

    return statistics;
}

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
