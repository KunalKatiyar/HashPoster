const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const serviceAccount = require("./twitterbot-2bd3a-firebase-adminsdk-apue5-790f621bca.json")
admin.initializeApp({
  // credential: firebase_admin.credential.cert(serviceAccount),
  projectId: "twitterbot-2bd3a"
});

const dbRef = admin.firestore().doc('tokens/demo');
const dbblogs = admin.firestore().collection('blogs');

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

  const { data } = await loggedClient.v2.me();

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
          dateAdded
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
  var fs = require('fs'); 
  var parse = require('csv-parse');
  var WhichX = require("whichx");
  var whichtech = new WhichX();
  var labels = ["tech","notech"];

  whichtech.addLabels(labels);

  var parser1 = parse.parse({columns: true}, function (err, records) {});
  var parser2 = parse.parse({columns: true}, function (err, records) {});

  var results1= [];
  var results2= [];
  
  const ApiRes = await fetchPosts()

  let i=-1;
  let goodPosts = [];
  while(i<9){
      i=i+1;
      if (ApiRes.data.storiesFeed[i].author.socialMedia.twitter != "" & ( ApiRes.data.storiesFeed[i].author.publicationDomain != "" & ApiRes.data.storiesFeed[i].author.publicationDomain != null)) {
        goodPosts.push(ApiRes.data.storiesFeed[i]);
      } 
  }
 
  let check=0;
  let ans="";

  fs.createReadStream('data/tech.csv').pipe(parser1).on('data', (data) => {
    results1.push(data);
  })
  .on('end', () => {
    fs.createReadStream('data/notech.csv').pipe(parser2).on('data', (data) => {
      results2.push(data);
    })
    .on('end', async () => {
      for(var i=0;i<results1.length;i++){
        whichtech.addData('tech',results1[i]['text']);
      }
      for(var i=0;i<results2.length;i++){
        whichtech.addData('notech', results2[i]['text']);
      }
      for(var i=0;i<goodPosts.length;i++){
        const name = goodPosts[i].author.socialMedia.twitter.split("/")[3];
        const post = goodPosts[i];
        descript="";
        var theLine;
        var midArray = post.brief.split(" ");
        for (var j = 0; j < 15; j++){
          descript += midArray[j] + " ";
        }
        descript += "...";
        theLine = post.title + ':\n' + descript;
        var ans = whichtech.classify(theLine);
        var values = whichtech.returnClassifyValues(theLine);
        let value,sum=0;
        console.log(values)
        for(let obj of values){
          console.log(obj)
          sum+=obj.chance;
          if(obj.label === 'tech'){
            value = obj.chance;
          }
        }
        goodPosts[i]['category'] = {
          name: 'tech',
          value: (value/sum)*100
        }
      }
      console.log(goodPosts)
      goodPosts.sort((a, b) => parseFloat(b.category.value) - parseFloat(a.category.value));
      console.log(goodPosts)
      if(goodPosts.length==0){
        check=1;
        async function getblogs() {
          console.log("ok")
          admin.firestore().collection("blogs")
          .orderBy("value", "desc")
          .limit(1)
          .get()
          .then(querySnapshot => {
              if (!querySnapshot.empty) {
                  const queryDocumentSnapshot = querySnapshot.docs[0].data();
                  console.log(queryDocumentSnapshot.theLine)
                  data = refreshedClient.v2.tweet(queryDocumentSnapshot.theLine);
                  response.send(data);
                  return querySnapshot.docs[0].ref.delete();
              } else {
                  console.log("No document corresponding to the query!");
                  return null;
              }
          });
        }
  
        snapshot = await getblogs();
    }
    console.log("end")
    for(let i=1;i<goodPosts.length;i++){
      try{
        const docRef = dbblogs.doc(String(goodPosts[i].dateAdded));
        async function setblogs() {
          const name = goodPosts[i].author.socialMedia.twitter.split("/")[3];
          const post = goodPosts[i];
          var theLine;
          var descript="";
          var midArray = post.brief.split(" ");
          for (var j = 0; j < 15; j++){
            descript += midArray[j] + " ";
          }
          descript += "...";
          theLine = '@' + name + ' talks about ' +  post.title + ':\n' + descript + '\nRead more at https://' + post.author.publicationDomain + '/'  + post.slug;
          await docRef.set({
              theLine: theLine,
              date: goodPosts[i].dateAdded,
              category: goodPosts[i].category.name,
              value: goodPosts[i].category.value
          })
        };
        await setblogs();
      }
      catch(err){
        console.log(err);
      }
    }
    
    if(!check){
      const name = goodPosts[0].author.socialMedia.twitter.split("/")[3];
      const post = goodPosts[0];
      descript="";
      var theLine;
      var midArray = post.brief.split(" ");
      for (var j = 0; j < 15; j++){
        descript += midArray[j] + " ";
      }
      descript += "...";
      console.log(ans)
      console.log("Pog")
      theLine = check?ans:'@' + name + ' talks about ' +  post.title + ':\n' + descript + '\nRead more at https://' + post.author.publicationDomain + '/'  + post.slug;
      console.log(theLine)
      data = await refreshedClient.v2.tweet(theLine);
      response.send(data);
    }
    console.log("done")
    });
  });

  
  
}
catch (err) {
  response.send(err);
}
});

