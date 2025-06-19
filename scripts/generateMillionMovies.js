const fs = require('fs');
const path = require('path');

// Sample data for generating synthetic movies
const sampleGenres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 
  'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
];

const sampleTitles = [
  'The Lost City', 'Shadow Protocol', 'Eternal Quest', 'Neon Dreams', 'Silent Echo',
  'Crimson Dawn', 'Golden Horizon', 'Silver Lining', 'Dark Waters', 'Bright Future',
  'Hidden Truth', 'Open Secret', 'Final Chapter', 'First Light', 'Last Stand',
  'Ancient Wisdom', 'Modern Times', 'Future World', 'Past Lives', 'Present Moment'
];

const sampleOverviews = [
  'A thrilling adventure that takes you to the edge of reality.',
  'When the world changes, heroes emerge from unexpected places.',
  'Love, loss, and redemption in a world turned upside down.',
  'The greatest challenge is not the enemy, but the journey within.',
  'Sometimes the most powerful weapon is the truth.',
  'In a world of chaos, one person can make all the difference.',
  'The past never truly dies, it just waits for the right moment.',
  'Courage is not the absence of fear, but the triumph over it.',
  'Every choice has consequences, every action has meaning.',
  'The future is not written, it is created by those who dare to dream.'
];

function generateRandomMovie(id) {
  const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
  const overview = sampleOverviews[Math.floor(Math.random() * sampleOverviews.length)];
  
  // Generate 1-3 random genres
  const numGenres = Math.floor(Math.random() * 3) + 1;
  const genres = [];
  const availableGenres = [...sampleGenres];
  
  for (let i = 0; i < numGenres; i++) {
    const randomIndex = Math.floor(Math.random() * availableGenres.length);
    genres.push(availableGenres.splice(randomIndex, 1)[0]);
  }
  
  // Generate random date between 1990 and 2024
  const year = 1990 + Math.floor(Math.random() * 35);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const releaseDate = `${year}-${month}-${day}`;
  
  // Generate random popularity and vote average
  const popularity = Math.random() * 100;
  const voteAverage = Math.random() * 10;
  
  // Generate random poster path (simulating TMDB poster paths)
  const posterPath = `/poster_${Math.floor(Math.random() * 1000000)}.jpg`;
  
  return {
    title: `${title} ${id}`,
    overview,
    genres,
    release_date: releaseDate,
    popularity: parseFloat(popularity.toFixed(2)),
    vote_average: parseFloat(voteAverage.toFixed(1)),
    poster_path: posterPath
  };
}

async function generateMillionMovies() {
  console.log('Starting to generate 1 million synthetic movies...');
  
  const totalMovies = 1000000;
  const batchSize = 10000; // 10,000 movies per batch file
  const numBatches = Math.ceil(totalMovies / batchSize);
  
  console.log(`Will generate ${totalMovies} movies in ${numBatches} batches of ${batchSize} each`);
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  let totalGenerated = 0;
  
  for (let batchNum = 0; batchNum < numBatches; batchNum++) {
    console.log(`Generating batch ${batchNum + 1}/${numBatches}...`);
    
    const batchMovies = [];
    const startId = batchNum * batchSize + 1;
    const endId = Math.min((batchNum + 1) * batchSize, totalMovies);
    
    for (let i = startId; i <= endId; i++) {
      batchMovies.push(generateRandomMovie(i));
    }
    
    // Save batch to file
    const batchFilename = path.join(dataDir, `million-movies-batch-${batchNum}.json`);
    fs.writeFileSync(batchFilename, JSON.stringify(batchMovies, null, 2));
    
    totalGenerated += batchMovies.length;
    console.log(`✅ Batch ${batchNum + 1} completed: ${batchMovies.length} movies saved to ${batchFilename}`);
    console.log(`Progress: ${totalGenerated}/${totalMovies} (${(totalGenerated / totalMovies * 100).toFixed(1)}%)`);
    
    // Add a small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🎉 Successfully generated 1 million synthetic movies!');
  console.log(`📁 Batch files saved in: ${dataDir}`);
  console.log(`📊 Total movies generated: ${totalGenerated}`);
  
  // Calculate total file size
  let totalSize = 0;
  for (let batchNum = 0; batchNum < numBatches; batchNum++) {
    const batchFilename = path.join(dataDir, `million-movies-batch-${batchNum}.json`);
    if (fs.existsSync(batchFilename)) {
      const stats = fs.statSync(batchFilename);
      totalSize += stats.size;
    }
  }
  
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`💾 Total file size: ${totalSizeInMB} MB`);
  console.log('\n🚀 You can now run: node scripts/combineAllMovies.js');
}

generateMillionMovies().catch(console.error); 