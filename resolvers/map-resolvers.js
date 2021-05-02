const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
            const _id = new ObjectId(req.userId);
            if(!_id) { return([])};
            const maps = await Map.find({owner: _id});
            if(maps) return (maps);
        },
        getMapById: async (_, args) => {
            const { _id } = args;
            const objectId = new ObjectId(_id);
            const map = await Todolist.findOne({_id: objectId});
            if(map) return map;
            return ({});
        }
    },
    Mutation: {
        addMap: async (_, args) => {
            const { map } = args;
            const objectId = new ObjectId();
            const {_id, name, owner, subregions } = map;
            const newMap = new Map({
                _id: objectId,
                name: name,
                owner: owner,
                subregions: [ {
                    _id: new ObjectId(),
                    name: name,
                    capital: '',
                    leader: '',
                    flag: '',
                    landmarks: [],
                    parent: ''
                } ]
            });
            const updated = await newMap.save();
            if(updated) return objectId;
            else return ('Could not add map');
        },
        renameMap: async (_, args) => {
            const { _id, name } = args;
            const mapId = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapId });
            if(!found) return ("Map not found");
            found.name = name;
            await found.save();
            console.log(found.name);
            return found.name;
        },
        deleteMap: async (_, args) => {
            const { _id } = args;
            const mapId = new ObjectId(_id);
            const deleted = await Map.deleteOne({ _id: mapId });
            if(deleted) return true;
            return false;
        },
        moveMapToTop: async (_, args) => {
            const { _id, owner} = args;
            const mapId = new ObjectId(_id);
            const maps = await Map.find({owner: owner}).sort({index: -1}).exec();
            const largestIndex = maps[0].index;
            const map = await Map.findOne({_id: mapId});
            map.index = largestIndex + 1;
            try {
                await map.save();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },
        addSubregion: async (_, args) => {
            const { mapID, regionID } = args;
            const mapObjId = new ObjectId(mapID);
            const map = await Map.findOne({ _id: mapObjId });
            const region = {
                _id: new ObjectId(),
                name: "Untitled",
                capital: "N/A",
                leader: "N/A",
                flag: "[Image Here]",
                landmarks: "N/A",
                parent: regionID
            };
            let subregions = map.subregions;
            subregions.push(region);
            const updated = await Map.updateOne({ _id: mapObjId }, { subregions: subregions });
            if (updated) return (region._id);
            else return ("Could not add subregion");
        }
    }
}