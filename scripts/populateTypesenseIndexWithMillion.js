require("dotenv").config();

const Typesense = require("typesense");
const fs = require('fs');

const BASE_IMAGE_PATH = "https://image.tmdb.org/t/p/w300";

module.exports = (async () => {
  const TYPESENSE_CONFIG = {
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.TYPESENSE_PORT,
        protocol: process.env.TYPESENSE_PROTOCOL,
      },
    ],
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
  };

  console.log("Config: ", TYPESENSE_CONFIG);

  const typesense = new Typesense.Client(TYPESENSE_CONFIG);

  const schema = {
    name: "movies",
    num_documents: 0,
    fields: [
      {
        name: "title",
        type: "string",
        facet: false,
      },
      {
        name: "overview",
        type: "string",
        facet: false,
      },
      {
        name: "genres",
        type: "string[]",
        facet: true,
      },
      {
        name: "genres.lvl0",
        type: "string[]",
        facet: true,
      },
      {
        name: "genres.lvl1",
        type: "string[]",
        facet: true,
        optional: true,
      },
      {
        name: "genres.lvl2",
        type: "string[]",
        facet: true,
        optional: true,
      },
      {
        name: "release_date",
        type: "string",
        facet: true,
      },
      {
        name: "popularity",
        type: "float",
        facet: true,
      },
      {
        name: "vote_average",
        type: "float",
        facet: true,
      },
      {
        name: "image",
        type: "string",
        facet: true,
      },
    ],
    default_sorting_field: "popularity",
  };

  try {
    const collection = await typesense.collections("movies").retrieve();
    console.log("Found existing collection of movies");
    console.log(JSON.stringify(collection, null, 2));

    console.log("Deleting existing collection to replace with new data");
    await typesense.collections("movies").delete();
  } catch (err) {
    console.log("No existing collection found, creating new one");
  }

  console.log("Creating schema...");
  console.log(JSON.stringify(schema, null, 2));

  await typesense.collections().create(schema);

  console.log("Populating collection...");

  // Check if combined file exists, otherwise use original
  const dataFile = fs.existsSync('./scripts/data/all-movies-combined.json') 
    ? './scripts/data/all-movies-combined.json' 
    : './scripts/data/popular-movies-with-genres.json';

  console.log(`Using data file: ${dataFile}`);
  
  const movies = require(dataFile);
  console.log(`Total movies to import: ${movies.length}`);

  // Process movies in batches for better performance
  const batchSize = 1000;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);
    
    // Process each movie in the batch
    const processedBatch = batch.map(movie => {
      movie.image = BASE_IMAGE_PATH + movie.poster_path;

      delete movie.poster_path;
      delete movie.original_language;
      delete movie.original_title;
      delete movie.video;
      delete movie.backdrop_path;
      delete movie.vote_count;
      delete movie.id;
      delete movie.adult;
      delete movie.genre_ids;

      movie.genres.forEach((genre, idx) => {
        movie[`genres.lvl${idx}`] = [movie.genres.slice(0, idx + 1).join(">")];
      });

      return movie;
    });

    try {
      const returnData = await typesense
        .collections("movies")
        .documents()
        .import(processedBatch);

      // Count successes and errors
      const results = Array.isArray(returnData) ? returnData : [returnData];
      results.forEach(result => {
        if (result.success) {
          successCount += result.num_imported || 1;
        } else {
          errorCount += result.num_failed || 1;
          console.error('Import error:', result.error);
        }
      });

      console.log(`Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(movies.length / batchSize)}: ${processedBatch.length} movies processed`);
      console.log(`Progress: ${i + batch.length}/${movies.length} (${((i + batch.length) / movies.length * 100).toFixed(1)}%)`);
      
    } catch (err) {
      console.error(`Error importing batch ${Math.floor(i / batchSize) + 1}:`, err);
      errorCount += batch.length;
    }
  }

  console.log("Import completed!");
  console.log(`Successfully imported: ${successCount} movies`);
  console.log(`Failed imports: ${errorCount} movies`);
  console.log(`Total processed: ${successCount + errorCount} movies`);

  // Get final collection stats
  try {
    const finalCollection = await typesense.collections("movies").retrieve();
    console.log("Final collection stats:", JSON.stringify(finalCollection, null, 2));
  } catch (err) {
    console.error("Error retrieving final collection stats:", err);
  }

})(); 