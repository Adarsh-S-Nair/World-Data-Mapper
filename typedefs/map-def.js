const { gql } = require('apollo-server');

const typeDefs = gql`
    type Map {
        _id: String!
        name: String!
        owner: String!
        subregions: [Region]
        index: Int!
    }
    type Region {
        _id: String!
        name: String!
        capital: String!
        leader: String!
        flag: String!
        landmarks: [String!]!
        parent: String!
    }
    extend type Query {
        getAllMaps: [Map]
        getMapById(_id: String!): Map
    }
    extend type Mutation {
        addMap(map: MapInput!): String
        renameMap(_id: String!, name: String!): String
        deleteMap(_id: String!): Boolean
        moveMapToTop(_id: String!, owner: String!): Boolean
        addSubregion(mapID: String!, regionID: String!): String
    }
    input MapInput {
        _id: String
        name: String
        owner: String
        subregions: [RegionInput]
    }
    input RegionInput {
        _id: String
        name: String
        parent: String
    }
`;

module.exports = { typeDefs: typeDefs }