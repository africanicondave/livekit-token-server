const express = require('express');
const cors = require('cors');
const { AccessToken } = require('@livekit/server-sdk');  // ✅ Corrected import

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/token', (req, res) => {
  const { identity, room } = req.body;
  if (!identity || !room) {
    return res.status(400).json({ error: 'Missing identity or room' });
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    ttl: 60 * 60, // 1 hour
  });
  at.addGrant({ roomJoin: true, room });

  const token = at.toJwt();
  res.json({ token });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`LiveKit token server running on ${port}`);
});
