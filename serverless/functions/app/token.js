exports.handler = function (context, event, callback) {
  const verifyExpiry = require(Runtime.getAssets()['/verify_expiry.js'].path);
  verifyExpiry.handler(context, event, callback);

  const VOICE_IDENTITY = context.VOICE_IDENTITY || 'test_user_' + Math.random().toString(36).substr(2, 8);

  const AccessToken = Twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: context.TWIML_APP_SID,
  });

  const token = new AccessToken(
    context.ACCOUNT_SID,
    context.API_KEY,
    context.API_SECRET,
    {
      ttl: 3600,
      identity: VOICE_IDENTITY,
    }
  );

  token.addGrant(voiceGrant);

  callback(null, { token: token.toJwt() });
};
