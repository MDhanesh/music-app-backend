const Album = require("../schema/album");

exports.save = async (req, res) => {
  const newAlbum = Album({
    name: req.body.name,
    imageURL: req.body.imageURL,
  });
  try {
    const savedAlbum = await newAlbum.save();
    res.status(200).send({ Album: savedAlbum });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error" });
  }
};

exports.getone = async (req, res) => {
  const userid = { _id: req.params.id };
  const data = await Album.findOne(userid);
  if (data) {
    res.status(200).send({ Album: data });
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

  const cursor = await Album.find(options);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: false, msg: "No Data Found" });
  }
};

exports.update = async (req, res) => {
  const userid = { _id: req.params.id };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Album.findOneAndUpdate(
      userid,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
      },
      options
    );
    res.status(200).send({ Album: result });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, msg: error });
  }
};

exports.delete = async (req, res) => {
  const userid = { _id: req.params.id };
  const result = await Album.deleteOne(userid);
  if (result) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};
