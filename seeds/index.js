const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedhelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/NewStuff');

const db = mongoose.connection;
db.on('error', console.error.bind( console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // YOUR USED ID
            author: '65fe97081e8070c0678f8add',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'hello there we are on vacation, took the leave after messing up things, lying from the boss but yes got the leave at last',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url:'https://res.cloudinary.com/dhl4uk0d0/image/upload/v1711450237/cld-sample-2.jpg',
                //   url: 'https://res.cloudinary.com/dhl4uk0d0/image/upload/v1711459445/NewStuff/imq8gwmgmitgh9qxdl9h.png',
                  filename: 'NewStuff/imq8gwmgmitgh9qxdl9h'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})