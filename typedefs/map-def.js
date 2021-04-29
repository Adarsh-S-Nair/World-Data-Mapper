const { gql } = require('apollo-server');

const typeDefs = gql`
    type Map {
        _id: String!
        name: String!
        owner: String!
        root: Region
        index: Int!
    }
    type Region {
        _id: String!
        name: String!
    }
    extend type Query {
        getAllMaps: [Map]
    }
`;

module.exports = { typeDefs: typeDefs }