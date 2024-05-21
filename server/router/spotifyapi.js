import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

// dotenv.config();
// const app = express();
// router.use(cors());
// // body-parser 미들웨어 등록
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// SECTION - token
router.post("/refresh", (req, res) => {
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

router.post("/login", (req, res) => {
  const code = req.body.code;
  // spotifyApi.setRedirectURI(process.env.REDIRECT_URI);
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
// router.get('/callback', (req, res) => {
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
router.post("/userprofile", (req, res) => {
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
router.post("/createPlaylist", (req, res) => {
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

router.post("/getPlaylist", (req, res) => {
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

router.post("/getUserPlaylists", (req, res) => {
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

router.post("/addTracksToPlaylist", (req, res) => {
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

router.post("/UpdatePlaylistItems", (req, res) => {
  const tracks = req.body.tracks; // tracks uris
  const id = req.body.playlistId;
  const accessToken = req.body.accessToken;
  let url = `${process.env.SPOTIFY_API}/playlists/${id}/tracks?uris=${tracks}`;
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
    .catch((err) => console.log(err));
});

//!SECTION - search

router.post("/search", (req, res) => {
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

export default router;