const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.rendernewform = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createcampgrounds = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save(``);
  // console.log(campground);
  req.flash("success", "New campground saved");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "user",
      },
    })
    .populate("author");
  console.log("author");
  if (!campground) {
    req.flash("error", "campground not found");
    return res.redirect("/campgrounds");
  }
  console.log(campground);
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditform = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await Campground.image.push(...images);
  campground.save();
  req.flash("success", "updated the campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const cmp = Campground.findById(id);
  // console.log(cmp.image);
  // cloudinary.uploader.destroy(cmp.image.filename);
  await Campground.findByIdAndDelete(id);
  req.flash("success", "deleted the campground");
  res.redirect("/campgrounds");
};
