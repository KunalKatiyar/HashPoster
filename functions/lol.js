ok = async () => {
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
if(isTwitterExists){
console.log(
    '@%s talks about %s:\n%s \nRead more at https://hashnode.com/%s', name, post.title, post.brief, post.slug
);
// response.send(data);
}
else{
console.log(
    '%s talks about %s:\n%s \nRead more at https://hashnode.com/%s', name, post.title, post.brief, post.slug
);
// response.send(data);
}
}
ok();