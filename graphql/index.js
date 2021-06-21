const { ApolloServer } = require('apollo-server');
const { getDataLoaders } = require('./loaders');
const { PORT = 3030 } = process.env;
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    loaders: getDataLoaders(),
  }),
});


server
  .listen(PORT)
  .then(({ url }) => console.log(`🚀 Server running at ${url}`));
