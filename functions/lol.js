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
      i=i+1;
      // console.log(ApiRes.data.storiesFeed[i].author);
      console.log(ApiRes.data.storiesFeed[i].author.publicationDomain!= null)
      isExists = (ApiRes.data.storiesFeed[i].author.socialMedia.twitter != "" & ( ApiRes.data.storiesFeed[i].author.publicationDomain != "" & ApiRes.data.storiesFeed[i].author.publicationDomain != null)) ? 1 : 0; //Change second condition
      console.log(isExists)
      if (isExists){
        break;
      }
  }
  if(i==8){
      // response.send("No new posts");
  }
  const name = isExists? ApiRes.data.storiesFeed[i].author.socialMedia.twitter.split("/")[3] : ApiRes.data.storiesFeed[i].author.name;
  const post = ApiRes.data.storiesFeed[i];
  var theLine;
  if(isExists){
    theLine = '@' + name + ' talks about ' +  post.title + ':\n' + post.brief + '\nRead more at https://' + post.author.publicationDomain + '/'  + post.slug;
  }
  else{
    theLine = name + ' talks about ' +  post.title + ':\n' + post.brief + '\nRead more at https://hashnode.com/' + post.slug;
  }
  console.log(theLine);
}
ok();