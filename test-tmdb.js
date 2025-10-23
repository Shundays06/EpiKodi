const axios = require('axios');

const TMDB_API_KEY = 'a683fb7fe3e97f401b4b60df6763ceb5';

async function testTMDB() {
  try {
    console.log('Testing TMDB API for Avatar...');
    
    // Search for Avatar
    const searchResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        language: 'fr-FR',
        query: 'Avatar',
        year: 2009
      }
    });
    
    console.log('Search results:', searchResponse.data.results.length);
    if (searchResponse.data.results.length > 0) {
      const movie = searchResponse.data.results[0];
      console.log('Found:', movie.title, '(ID:', movie.id, ')');
      
      // Get details
      const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'fr-FR',
          append_to_response: 'credits'
        }
      });
      
      console.log('Details retrieved successfully');
      console.log('Title:', detailsResponse.data.title);
      console.log('Poster:', detailsResponse.data.poster_path);
      console.log('Rating:', detailsResponse.data.vote_average);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testTMDB();
