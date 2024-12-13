import express from 'express';
import {buildSchema} from 'graphql';
import {graphqlHTTP} from 'express-graphql';
import fs from 'fs';
import path from 'path';

const COMPUTERS = [
  {id: 'Computer1', cpu: "386", year: 1993, screen: {resolution: "640x480", isColor: false}},
  {id: 'Computer2', cpu: "486", year: 1996, screen: {resolution: "800x600", isColor: true}},
]

// Read the SDL from a file
const schemaPath = path.join(process.cwd(), 'computers.graphqls');
const sdl = fs.readFileSync(schemaPath, 'utf-8');

// Resolvers object
const root = {
  computers: () => {
    return COMPUTERS;
  },
  computer: (_, args) => {
    return COMPUTERS.find(p => p.id === args.id);
  },
  Computer: {
    errorField: (_) => {
      throw new Error("Error field");
    },
    nonNullErrorField: (_, args, context) => {
      return null;
    }
  }
};

// Build schema from SDL
const schema = buildSchema(sdl);

// Create Express app
const app = express();

// Add GraphQL endpoint with resolvers
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true // Enable GraphiQL interface for testing
}));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
