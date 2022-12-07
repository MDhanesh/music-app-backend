const Artist = require("../schema/artist");

exports.save = async (req, res) => {
  const newArtist = Artist({
    name: req.body.name,
    imageURL: req.body.imageURL,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
  });
  try {
    const savedArtist = await newArtist.save();
    res.status(200).send({ artist: savedArtist });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error" });
  }
};

exports.getone = async (req, res) => {
  const userid = { _id: req.params.id };
  const data = await Artist.findOne(userid);
  if (data) {
    res.status(200).send({ artist: data });
  } else {
    res.status(400).json({ msg: "error" });
  }
};

exports.getall = async (req, res) => {
  const options = {
    // sort returned documents in ascending order
    sort: { createdAt: 1 },
    // Include only the following
    // projection : {}
  };

  const data = await Artist.find(options);
  if (data) {
    res.status(200).send({ success: true, data: data });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
};

exports.update = async (req, res) => {
  const userid = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Artist.findOneAndUpdate(
      userid,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, msg: error });
  }
};

exports.delete = async (req, res) => {
  const userid = { _id: req.params.id };
  const result = await Artist.deleteOne(userid);
  if (result) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};
