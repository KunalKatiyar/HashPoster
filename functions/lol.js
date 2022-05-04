// ok = async () => {
//     const fetch = require('node-fetch');
//     const functions = require("firebase-functions");
//     const admin = require("firebase-admin");
//     const serviceAccount = require("./twitterbot-2bd3a-firebase-adminsdk-apue5-790f621bca.json");
//     admin.initializeApp({
//         credential: firebase_admin.credential.cert(serviceAccount),
//         projectId: "twitterbot-2bd3a"
//     });

//     const dbRef = admin.firestore().doc('tokens/demo');
//     const dbblogs = admin.firestore().collection('blogs');

//     console.log(dbRef)
//     console.log(dbblogs)
//     const query = `
//     {
//       storiesFeed(type: COMMUNITY, page: 0) {
//           title
//           brief
//           slug
//           dateAdded
//           author{
//               name
//               publicationDomain
//               socialMedia {
//                   twitter
//                   github
//               }
//           }
//       } 
//     }                
//     `;
//   fetchPosts = async () => {
//   const response = await fetch('https://api.hashnode.com', {
//       method: 'POST',
//       headers: {
//           'Content-type': 'application/json',
//       },
//       body: JSON.stringify({ query }),
//   })
//   const ApiResponse = await response.json();

//   return(ApiResponse)
//   }
  
//   const ApiRes = await fetchPosts()
//   console.log((ApiRes.data.storiesFeed));

//   let isExists=false;
//   let i=-1;
//   let goodPosts = [];
//   while(i<9){
//       i=i+1;
//       // console.log(ApiRes.data.storiesFeed[i].author);
//     //   console.log(ApiRes.data.storiesFeed[i].author.publicationDomain!= null)
//       if (ApiRes.data.storiesFeed[i].author.socialMedia.twitter != "" & ( ApiRes.data.storiesFeed[i].author.publicationDomain != "" & ApiRes.data.storiesFeed[i].author.publicationDomain != null)) {
//         goodPosts.push(ApiRes.data.storiesFeed[i]);
//       } 
//       //Change second condition
//     //   console.log(isExists)
//   }
//   if(goodPosts.length==0){
//       // response.send("No new posts");
//   }
//   for(let i=1;i<goodPosts.length;i++){
//     const docRef = dbblogs.doc(String(goodPosts.dateAdded));

//     async function setblogs() {
//         await docRef.set({
//             data: goodPosts[i]
//         })
//     };
//     setblogs();
//   }

//   const name = isExists? goodPosts[0].author.socialMedia.twitter.split("/")[3] : goodPosts[0].author.name;
//   const post = goodPosts[0];
//   var theLine;
//   theLine = '@' + name + ' talks about ' +  post.title + ':\n' + post.brief + '\nRead more at https://' + post.author.publicationDomain + '/'  + post.slug;
//   console.log(theLine);
// }
// ok();






// // const functions = require("firebase-functions");
// // const admin = require("firebase-admin");
// // admin.initializeApp({
// //   projectId : 'twitterbot-2bd3a'
// // });
// // const dbblogs = admin.firestore().collection("blogs");

// // dbblogs.listDocuments().then(snapshot => {
// //   print(snapshot)
// // })

// // console.log(dbRef)
// // console.log(dbblogs)


// var fs = require('fs'); 
// var parse = require('csv-parse');
// var WhichX = require("whichx");
// const { PassThrough } = require('stream');
// var whichtech = new WhichX();
// var labels = ["tech","notech"];

// whichtech.addLabels(labels);



// var parser1 = parse.parse({columns: true}, function (err, records) {});

// var parser2 = parse.parse({columns: true}, function (err, records) {});

// var results1= [];
// var results2= [];

// fs.createReadStream('data/tech.csv').pipe(parser1).on('data', (data) => {
//   results1.push(data);
// })
// .on('end', () => {
//   fs.createReadStream('data/notech.csv').pipe(parser2).on('data', (data) => {
//     results2.push(data);
//   })
//   .on('end', () => {
//     for(var i=0;i<results1.length;i++){
//       whichtech.addData('tech',results1[i]['text']);
//     }
//     for(var i=0;i<results2.length;i++){
//       whichtech.addData('notech', results2[i]['text']);
//     }
//     var ans = whichtech.returnClassify("@DEVfulness \ntalks about Day 2 - Differences between checked & unchecked exceptions in java!:\nChecked Exceptions\nThese are checked during compile time itself. Checked Exceptions should be either handled or ...\nRead more at");
//     console.log(ans);
//   });
// });


var data = [
      {
        title: 'Sometimes you just need to do the work',
        brief: "We spend so much of our days talking about the work that we're going or need to do. We attend endless waves of meetings where we seem to talk about the same things over and over. It feels as if we talk about the same things over and over, because tha...",      
        slug: 'sometimes-you-just-need-to-do-the-work',
        dateAdded: '2022-05-04T13:36:05.803Z',
        author: {
          name: 'Wes Kennedy',
          publicationDomain: 'wes.today',
          socialMedia: [Object]
       },
        category: { name: 'notech', value: 1.057736559595422e-52 }
      },
      {
        title: 'Sometimes you just need to do the work',
        brief: "We spend so much of our days talking about the work that we're going or need to do. We attend endless waves of meetings where we seem to talk about the same things over and over. It feels as if we talk about the same things over and over, because tha...",      
        slug: 'sometimes-you-just-need-to-do-the-work',
        dateAdded: '2022-05-04T13:36:05.803Z',
        author: {
          name: 'Wes Kennedy',
          publicationDomain: 'wes.today',
          socialMedia: [Object]
       },
        category: { name: 'notech', value: 1.057736559595422e-51 }
      }
    ]

console.log(data);

data.sort((a, b) => parseFloat(b.category.value) - parseFloat(a.category.value));

console.log(data);

