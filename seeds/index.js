const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/yelp_camp")
  .then(() => {
    console.log("connected");
  })
  .catch((res) => {
    console.log("not connected", res);
  });
const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100) + 10;
    const camp = new Campground({
      author: "66599eebd326cfb6c20a1415",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          url: "https://res.cloudinary.com/dj0ntkvhw/image/upload/v1717694996/yelpcampproject/xwxemtljtix3nvycpmz8.jpg",
          filename: "yelpcampproject/xwxemtljtix3nvycpmz8",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus ab nisi delectus accusantium dolor nihil neque esse atque expedita quos.",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
