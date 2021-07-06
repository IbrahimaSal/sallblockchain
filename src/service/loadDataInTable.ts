/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import AWS from 'aws-sdk';

const fs = require('fs');

AWS.config.update({
  region: 'eu-west-3',
  // endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient();

// console.log('Importing movies into DynamoDB. Please wait.');

// const allMovies = JSON.parse(fs.readFileSync('src/assets/moviedata.json', 'utf8'));
// allMovies.forEach((movie) => {
//   const params = {
//     TableName: 'Movies',
//     Item: {
//       year: movie.year,
//       title: movie.title,
//       info: movie.info,
//     },
//   };

//   docClient.put(params, (err, data) => {
//     if (err) {
//       console.error('Unable to add movie', movie.title, '. Error JSON:', JSON.stringify(err, null, 2));
//     } else {
//       console.log('PutItem succeeded:', movie.title);
//     }
//   });
// });

// const table = 'Movies';
// const year = 2015;
// const title = 'The Big New Movie';

// const params = {
//   TableName: table,
//   Item: {
//     year,
//     title,
//     info: {
//       plot: 'Nothing happens at all.',
//       rating: 0,
//     },
//   },
// };

const MusicItemparams = {
  TableName: 'Music',
  Item: {
    Artist: 'No One You Know',
    SongTitle: 'Call Me Today',
    AlbumTitle: 'Somewhat Famous',
    Year: 2015,
    Price: 2.14,
    Genre: 'Country',
    Tags: {
      Composers: [
        'Smith',
        'Jones',
        'Davis',
      ],
      LengthInSeconds: 214,
    },
  },
};

console.log('Adding a new item...');
docClient.put(MusicItemparams, (err, data) => {
  if (err) {
    console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Added item:', JSON.stringify(data, null, 2));
  }
});
