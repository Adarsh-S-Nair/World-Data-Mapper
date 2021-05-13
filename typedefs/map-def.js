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
        addSubregion(_id: String!, region: RegionInput!): String
        deleteSubregion(_id: String!, regionID: String!): String
        updateRegionField(_id: String!, regionID: String!, field: String!, value: String!): String
        changeParentRegion(_id: String!, regionID: String!, parent: String!) : String
        sortByField(_id: String!, field: String!): String
        setRegions(_id: String!, subregions: [RegionInput!]!): String
        addLandmark(_id: String, regionID: String!, landmark: String!): String
        deleteLandmark(_id: String, regionID: String!, landmark: String!): String
        editLandmark(_id: String!, regionID: String!, prevLandmark: String!, newLandmark: String!): String
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
        capital: String
        leader: String
        flag: String
        landmarks: [String]
        parent: String
    }
`;

module.exports = { typeDefs: typeDefs }