import {createSchema, createYoga} from 'graphql-yoga'
import { useDeferStream } from '@graphql-yoga/plugin-defer-stream';
import {createServer} from 'node:http'
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
const schema = createSchema({
  typeDefs: sdl,
  resolvers: {
    Query: {
      computers: () => {
        return COMPUTERS;
      },
      computer: (_, args) => {
        return COMPUTERS.find(p => p.id === args.id);
      }
    },
    Computer: {
      errorField: (_) => {
        throw new Error("Error field");
      },
      nonNullErrorField: (_, args, context) => {
        return null;
      }
    }
  }
});

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
  schema: schema,
  plugins: [useDeferStream()]
})

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
})
