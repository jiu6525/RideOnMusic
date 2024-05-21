import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
// const lyricsFinder = require("lyrics-finder")
import SpotifyWebApi from "spotify-web-api-node";

dotenv.config();
const app = express();
app.use(cors());
// body-parser 미들웨어 등록
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// SECTION - token
app.post("/spotify/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  spotifyApi.setRefreshToken(refreshToken);
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/spotify/login", (req, res) => {
  const code = req.body.code;
  console.log(process.env.REDIRECT_URI);
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      // res.sendStatus(400);
      console.log(err);
    });
});
// app.get('/callback', (req, res) => {
//   const code = req.query.code;
//   console.log("callback" + code)
//   if (code) {
//     spotifyApi
//       .authorizationCodeGrant(code)
//       .then((data) => {
//         res.json({
//           accessToken: data.body.access_token,
//           refreshToken: data.body.refresh_token,
//           expiresIn: data.body.expires_in,
//         });
//       })
//       .catch((err) => {
//         res.sendStatus(400);
//       });
//   } else {
//     res.send('Authentication failed.');
//   }
// });

// SECTION - user info
app.post("/spotify/userprofile", (req, res) => {
  const accessToken = req.body.accessToken;

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getMe()
    .then((data) => {
      // console.log(data.body)
      res.json({
        display_name: data.body.display_name,
        href: data.body.href,
        id: data.body.id,
        images: data.body.images,
        uri: data.body.uri,
        email: data.body.email,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

// SECTION - playlist
app.post("/spotify/createPlaylist", (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const accessToken = req.body.accessToken;

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .createPlaylist(name, { description: description, public: true, collaborative: true })
    .then(
      function (data) {
        console.log("Created playlist!");
        res.json(data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
});

app.post("/spotify/getPlaylist", (req, res) => {
  const playlistId = req.body.playlistId;

  const accessToken = req.body.accessToken;
  spotifyApi.setAccessToken(accessToken);

  spotifyApi.getPlaylist(playlistId).then(
    function (data) {
      // console.log("Some information about this playlist", data.body);
      // console.log(data.body);
      res.json(data.body);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.post("/spotify/getUserPlaylists", (req, res) => {
  const id = req.body.id;
  // console.log("getUserPlaylist " + id);

  const accessToken = req.body.accessToken;

  spotifyApi.setAccessToken(accessToken);

  spotifyApi.getUserPlaylists(id).then(
    function (data) {
      // console.log("Retrieved playlists", data.body);
      res.json(data.body);
    },
    function (err) {
      console.log("Something went wrong in get user Playlist!", err);
    }
  );
});

app.post("/spotify/addTracksToPlaylist", (req, res) => {
  const tracks = req.body.tracks;
  const id = req.body.playlistId;
  const accessToken = req.body.accessToken;

  spotifyApi.setAccessToken(accessToken);

  spotifyApi.addTracksToPlaylist(id, tracks).then(
    function (data) {
      console.log("Added tracks to playlist!");
      res.json(data.body);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.post("/spotify/UpdatePlaylistItems", (req, res) => {
  const tracks = req.body.tracks; // tracks uris
  const id = req.body.playlistId;
  const accessToken = req.body.accessToken;
  let url = `${process.env.SPOTIFY_API}/playlists/${id}/tracks?uris=${tracks}`;
  console.log(url);
  fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
    });
});

//!SECTION - search

app.post("/spotify/search", (req, res) => {
  const accessToken = req.body.accessToken;
  const keyword = req.body.keyword;
  const offset = req.body.offset;
  spotifyApi.setAccessToken(accessToken);
  // console.log(offset)
  spotifyApi.searchTracks(keyword, { limit: 10, offset: offset }).then(
    function (data) {
      // console.log('Search by ' + keyword, data.body);
      res.json(data.body);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});
app.listen(5174);
