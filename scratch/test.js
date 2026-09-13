fetch('https://leetcode.com/graphql', { 
  method: 'POST', 
  headers: { 
    'Content-Type': 'application/json', 
    'Origin': 'http://localhost:5173' 
  }, 
  body: JSON.stringify({query: '{ matchedUser(username: "shiva") { username } }'}) 
}).then(r => {
  console.log(r.status);
  console.log(r.headers.get('access-control-allow-origin'));
  return r.text();
}).then(console.log).catch(console.error);
