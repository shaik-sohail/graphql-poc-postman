const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type Query {
    coinsAvg(skip: Int, limit: Int, currency: String): [Coin!]!
    coinAvg(name: String!, currency: String!): Coin!
    coinChart(period: String!, coinId: String!): [[Float!]!]!
  }

  type Coin {
    id: ID
    icon: String
    name: String
    symbol: String
    rank: Int
    price: Float
    priceBtc: Float
    volume: Int
    availableSupply: Float
    totalSupply: Int
    priceChange1h: Float
    priceChange1d: Float
    priceChange1w: Float
    websiteUrl: String
    twitterUrl: String
    contractAddress: String
    decimals: Int
    exp: [String]
  }
`;
const resolvers = {
  Query: {
    coinsAvg: async (parent, args, context) => {
      const response = await axios.get(
        `https://api.coinstats.app/public/v1/coins`
      );
      let data = response.data.coins;
      if (args) {
        if (args.skip) {
          data = data.slice(args.skip, data.length);
        }
        if (args.limit) {
          data = data.slice(0, args.limit);
        }
      }
      return data;
    },
    coinAvg: async (parent, args, context) => {
      if (!args) {
        return null;
      } else {
        const response = await axios.get(
          `https://api.coinstats.app/public/v1/coins/${args.name}?currency=${args.currency}`
        );
        let data = response.data.coin;
        return data;
      }
    },
    coinChart: async (parent, args, context) => {
      if (!args) return null;
      const response = await axios.get(
        `https://api.coinstats.app/public/v1/charts?period=${args.period}&coinId=${args.coinId}`
      );
      let data = response.data.chart;
      return data;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log("Listening at: " + url);
});
