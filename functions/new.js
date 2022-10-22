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

exports.tweet = functions.https.onRequest(async (request, response) => {
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

  let isTwitterExists = 0;
  let i=-1;
  while(!isTwitterExists && i<10){
      i+=1;
      isTwitterExists = ApiRes.data.storiesFeed[i].author.socialMedia.twitter != "" ? 1 : 0;
  }
  if(i==10){
      response.send("No new posts");
  }
  const name = isTwitterExists? ApiRes.data.storiesFeed[i].author.socialMedia.twitter.split("/")[3] : ApiRes.data.storiesFeed[i].author.name;
  const post = ApiRes.data.storiesFeed[i];
  var theLine;
  if(isTwitterExists){
    theLine = '@' + name + ' talks about ' +  post.title + ':\n' + post.brief + '\nRead more at https://hashnode.com/' + post.slug;
  }
  else{
    theLine = name + ' talks about ' +  post.title + ':\n' + post.brief + '\nRead more at https://hashnode.com/' + post.slug;
  }
  console.log(theLine);
  data = await refreshedClient.v2.tweet(theLine);
  response.send(data);
});