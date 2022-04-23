ok = async () => {
    const fetch = require('node-fetch');
    const functions = require("firebase-functions");
    const admin = require("firebase-admin");
    const serviceAccount = require("./twitterbot-2bd3a-firebase-adminsdk-apue5-790f621bca.json");
    admin.initializeApp({
        credential: firebase_admin.credential.cert(serviceAccount),
        projectId: "twitterbot-2bd3a"
    });

    const dbRef = admin.firestore().doc('tokens/demo');
    const dbblogs = admin.firestore().collection('blogs');

    console.log(dbRef)
    console.log(dbblogs)
    const query = `
    {
      storiesFeed(type: COMMUNITY, page: 0) {
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
  
  const ApiRes = await fetchPosts()
  console.log((ApiRes.data.storiesFeed));

  let isExists=false;
  let i=-1;
  let goodPosts = [];
  while(i<9){
      i=i+1;
      // console.log(ApiRes.data.storiesFeed[i].author);
    //   console.log(ApiRes.data.storiesFeed[i].author.publicationDomain!= null)
      if (ApiRes.data.storiesFeed[i].author.socialMedia.twitter != "" & ( ApiRes.data.storiesFeed[i].author.publicationDomain != "" & ApiRes.data.storiesFeed[i].author.publicationDomain != null)) {
        goodPosts.push(ApiRes.data.storiesFeed[i]);
      } 
      //Change second condition
    //   console.log(isExists)
  }
  if(goodPosts.length==0){
      // response.send("No new posts");
  }
  for(let i=1;i<goodPosts.length;i++){
    const docRef = dbblogs.doc(String(goodPosts.dateAdded));

    async function setblogs() {
        await docRef.set({
            data: goodPosts[i]
        })
    };
    setblogs();
  }

  const name = isExists? goodPosts[0].author.socialMedia.twitter.split("/")[3] : goodPosts[0].author.name;
  const post = goodPosts[0];
  var theLine;
  theLine = '@' + name + ' talks about ' +  post.title + ':\n' + post.brief + '\nRead more at https://' + post.author.publicationDomain + '/'  + post.slug;
  console.log(theLine);
}
ok();






// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp({
//   projectId : 'twitterbot-2bd3a'
// });
// const dbblogs = admin.firestore().collection("blogs");

// dbblogs.listDocuments().then(snapshot => {
//   print(snapshot)
// })

// console.log(dbRef)
// console.log(dbblogs)
