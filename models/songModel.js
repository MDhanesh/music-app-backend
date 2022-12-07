const Song = require("../schema/song");

exports.save = async (req, res) => {
  const newSong = Song({
    name: req.body.name,
    imageURL: req.body.imageURL,
    songUrl: req.body.songUrl,
    album: req.body.album,
    artist: req.body.artist,
    language: req.body.language,
    category: req.body.category,
  });
  try {
    const savedSong = await newSong.save();

    return res.status(200).send({ Song: savedSong });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "error" });
  }
};

exports.getone = async (req, res) => {
  const userid = { _id: req.params.id };
  const data = await Song.findOne(userid);
  if (data) {
    res.status(200).send({ Song: data });
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

  const cursor = await Song.find(options);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
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
    const result = await Song.findOneAndUpdate(
      userid,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songUrl: req.body.songUrl,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
      },
      options
    );
    res.status(200).send({ Song: result });
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(400).send({ success: false, msg: error });
  }
};

exports.delete = async (req, res) => {
  const userid = { _id: req.params.id };
  const result = await Song.deleteOne(userid);
  if (result) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};
