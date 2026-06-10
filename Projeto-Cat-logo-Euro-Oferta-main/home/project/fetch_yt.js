const https = require('https');
https.get('https://html.duckduckgo.com/html/?q=site:youtube.com+bedroom+interior+design+tour', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/v=([a-zA-Z0-9_-]{11})/g);
    console.log(matches ? [...new Set(matches)] : 'No matches found');
  });
}).on('error', (e) => {
  console.error(e);
});
