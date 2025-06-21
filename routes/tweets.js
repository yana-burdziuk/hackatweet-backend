// Express imports
const express = require("express");
const router = express.Router();

// Database imports
require("../models/connection");
const User = require("../models/users");
const Tweet = require("../models/tweets");
const Hashtag = require("../models/hashtags");

// POST NEW TWEET
router.post("/addtweet", async (req, res) => {
  // Data in
  const { token, tweet } = req.body;
  const user = await User.findOne({ token: token })

  if (!user) 
    return
  res.status(401).json({ result: false, error: "Unauthorized" });
  //console.log(token, tweet);

  // Logic
  try {
    // (1) Checking that user is allowed to post
    const user = await User.findOne({ token });
    if (!user)
      res.status(400).send({
        result: false,
        error: "User needs to be signed in to post",
      });
    else {
      // (2) Checking that tweet doesn't exceed 280 characters
      if (tweet.length > 280)
        res.status(400).send({
          result: false,
          error: "Tweet is too long",
        });
      else {
        // (3) Saving the tweet to DB
        // (4) Checking if tweet contains one or more hashtags
        const tweetHashtags = tweet.match(/#.+?\b/g);
        // (4.1) The tweet contains hashtags
        if (tweetHashtags) {
          const hashtagIDs = [];
          for (let tweetHashtag of tweetHashtags) {
            // Checking if each tweet hashtag exists in DB
            let hashtag = await Hashtag.findOne({ content: tweetHashtag });
            // (1) tweet hashtag already exists in DB
            if (hashtag) {
              hashtagIDs.push(hashtag._id);
            } else {
              // (2) tweet hashtag doesn't exist in DB
              hashtag = new Hashtag({
                content: tweetHashtag,
              });
              const savedHashtag = await hashtag.save();
              hashtagIDs.push(savedHashtag._id);
            }
          }
          const newTweet = new Tweet({
            user: user._id,
            text: tweet,
            hashtags: hashtagIDs, 
          });
          await newTweet.save();
          res.status(201).send({
            result: true,
            message: "Tweet and hashtags saved to database!",
          });
        } else {
          // (4.2) The tweet doesn't contain hashtags
          const newTweet = new Tweet({
            user: user._id,
            text: tweet,
            hashtags: [],
          });
          await newTweet.save();
          res.status(201).send({
            result: true,
            message: "Tweet saved to database!",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error posting tweet: ", error);
    res.status(500).send({
      result: false,
      error: "Server error",
    });
  }
});

// GET ALL TWEETS
router.get("/alltweets", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({createdAt: -1}) // pour montrer les tweets les plus recents d'abord
      .populate("user", "username firstName")
      .populate("hashtags", "content");
    res.status(201).send({
      result: true,
      tweets,
    });
  } catch (error) {
    console.error("Error fetching tweets: ", error);
    res.status(500).send({
      result: false,
      error: "Server error",
    });
  }
});

// GET ALL TWEETS FOR A SPECIFIC HASHTAG

router.get("/alltweets/:hashtag", async (req, res) => {
  try {
    // Data, on recupère le hashtag
    const hashtag = req.params.hashtag.toLowerCase();

    // Trouver le hashtag dans la DB
    const tag = await Hashtag.findOne({ content: "#" + hashtag });
    if (!tag) {
      return res
        .status(404)
        .json({ result: false, message: "Hashtag not found" });
    }
    // Récupérer les tweets liés à ce hashtag
    const tweets = await Tweet.find({ hashtags: tag._id })
      .populate("user", "username firstName")
      .populate("hashtags", "content");
    res.json({ result: true, tweets });
  } catch (err) {
    console.error(err); // on peut mieux faire, je laisse comme ça pour l'instant
  }
});

module.exports = router;
