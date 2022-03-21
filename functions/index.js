const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const dbRef = admin.firestore().doc('tokens/demo');

console.log(dbRef)
var TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
    clientId: "Mm9jU3JkbDNYSm1hU2lxVnZlU3c6MTpjaQ",
    clientSecret: "Z0J2SBAZzjZeUbUyAZ0iWHUNg9TBq3-gMWgwRtmEtMZcd7bPTa"
});

const callbackURL = "https://us-central1-twitterbot-2bd3a.cloudfunctions.net/callback"
exports.auth = functions.https.onRequest(async (request, response) => {
    const {url, codeVerifier, state} = twitterClient.generateOAuth2AuthLink(callbackURL, {scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']});

    await dbRef.set({codeVerifier,state});

    response.redirect(url)
});

exports.callback = functions.https.onRequest(async (request, response) => {
    const { state, code } = request.query;

  const dbSnapshot = await dbRef.get();
  const { codeVerifier, state: storedState } = dbSnapshot.data();

  if (state !== storedState) {
    return response.status(400).send('Stored tokens do not match!');
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL,
  });

  await dbRef.set({ accessToken, refreshToken });

  const { data } = await loggedClient.v2.me(); // start using the client if you want

  response.send(data);
});

exports.tweet = functions.https.onRequest(async (request, response) => {
  const { state, code } = request.query;

  const dbSnapshot = await dbRef.get();
  const { codeVerifier, state: storedState } = dbSnapshot.data();

  if (state !== storedState) {
    return response.status(400).send('Stored tokens do not match!');
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL,
  });

  await dbRef.set({ accessToken, refreshToken });

  const { data } = await loggedClient.v2.me(); // start using the client if you want

  response.send(data);
});

exports.tweet = functions.https.onRequest(async (request, response) => {
  try{
    const { refreshToken } = (await dbRef.get()).data();

    const {
      client: refreshedClient,
      accessToken,
      refreshToken: newRefreshToken,
    } = await twitterClient.refreshOAuth2Token(refreshToken);

    await dbRef.set({ accessToken, refreshToken: newRefreshToken });
    const fetch = require('node-fetch');
    const query = `
    {
      storiesFeed(type: NEW, page: 0) {
          title
          brief
          slug
          author{
              name
              publicationDomain
              socialMedia {
                  twitter
                  github
              }
          }
      } 
    }                  
    `;
  fetchPosts = async () => {
  const response = await fetch('https://api.hashnode.com', {
      method: 'POST',
      headers: {
          'Content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
  })
  const ApiResponse = await response.json();

  return(ApiResponse)
  }
  
  const ApiRes = await fetchPosts()
  console.log(ApiRes.data.storiesFeed[0]);

  let isExists=false;
  let i=-1;
  while(!isExists && i<8){
      i+=1;
      console.log(ApiRes.data.storiesFeed[i].author.publicationDomain)
      isExists = (ApiRes.data.storiesFeed[i].author.socialMedia.twitter != "" &  (ApiRes.data.storiesFeed[i].author.publicationDomain != "" & ApiRes.data.storiesFeed[i].author.publicationDomain != null)) ? 1 : 0; //Change second condition
      if (isExists){
        break;
      }
  }
  if(i==10){
      response.send("No new posts");
  }
  const name = isExists? ApiRes.data.storiesFeed[i].author.socialMedia.twitter.split("/")[3] : ApiRes.data.storiesFeed[i].author.name;
  const post = ApiRes.data.storiesFeed[i];
  var theLine;
  var descript="";
  var midArray = post.brief.split(" ");
  for (var j = 0; j < 15; j++){
    descript += midArray[j] + " ";
  }
  descript += "...";
  if(isExists){
    theLine = '@' + name + ' talks about ' +  post.title + ':\n' + descript + '\nRead more at https://' + post.author.publicationDomain + '/'  + post.slug;
  }
  else{
    theLine = name + ' talks about ' +  post.title + ':\n' + descript + '\nRead more at https://hashnode.com/' + post.slug;
  }
  console.log(theLine);
  data = await refreshedClient.v2.tweet(theLine);
  response.send(data);
}
catch (err) {
  response.send(err);
}
});