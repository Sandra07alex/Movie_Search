const { execSync } = require('child_process');
const fs = require('fs');

async function runProcess() {
  console.log('=== Starting 1 Million Movies Generation and Population Process ===\n');
  
  try {
    // Step 1: Generate 1 million movies
    console.log('Step 1: Generating 1 million movies...');
    console.log('This may take several minutes...\n');
    
    execSync('node scripts/generateMillionMovies.js', { stdio: 'inherit' });
    
    console.log('\n✅ Step 1 completed: 1 million movies generated\n');
    
    // Step 2: Combine all movies
    console.log('Step 2: Combining original 10,000 movies with new 1 million movies...');
    console.log('This may take a few minutes...\n');
    
    execSync('node scripts/combineAllMovies.js', { stdio: 'inherit' });
    
    console.log('\n✅ Step 2 completed: All movies combined\n');
    
    // Step 3: Check if Typesense is running
    console.log('Step 3: Checking if Typesense server is running...');
    
    try {
      // Try to start Typesense if not running
      execSync('node scripts/startTypesenseServer.js', { stdio: 'inherit' });
      console.log('✅ Typesense server started\n');
    } catch (error) {
      console.log('ℹ️  Typesense server may already be running or failed to start\n');
    }
    
    // Step 4: Populate Typesense with all movies
    console.log('Step 4: Populating Typesense with all movies...');
    console.log('This will take a significant amount of time for 1M+ movies...\n');
    
    execSync('node scripts/populateTypesenseIndexWithMillion.js', { stdio: 'inherit' });
    
    console.log('\n✅ Step 4 completed: Typesense populated with all movies\n');
    
    // Step 5: Final summary
    console.log('=== Process Completed Successfully! ===');
    console.log('📊 Summary:');
    console.log('- Original movies: 10,000');
    console.log('- Generated movies: 1,000,000');
    console.log('- Total movies: 1,010,000');
    
    if (fs.existsSync('scripts/data/all-movies-combined.json')) {
      const stats = fs.statSync('scripts/data/all-movies-combined.json');
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`- Combined file size: ${fileSizeInMB} MB`);
    }
    
    console.log('\n🎉 Your Typesense search engine now has over 1 million movies!');
    console.log('🚀 You can now test your React search application with the massive dataset.');
    
  } catch (error) {
    console.error('\n❌ Error during process:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure you have enough disk space (at least 2-3 GB free)');
    console.log('2. Ensure Typesense is properly configured in your .env file');
    console.log('3. Check that all required dependencies are installed');
    console.log('4. If the process fails, you can run individual steps manually:');
    console.log('   - node scripts/generateMillionMovies.js');
    console.log('   - node scripts/combineAllMovies.js');
    console.log('   - node scripts/populateTypesenseIndexWithMillion.js');
  }
}

runProcess(); 