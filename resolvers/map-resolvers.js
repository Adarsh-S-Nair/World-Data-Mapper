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
            const { _id, region} = args;
            const mapID = new ObjectId(_id);
            const regionID = new ObjectId();
            const found = await Map.findOne({ _id: mapID });
            if(!found) return ("Map not found");
            if(region._id === '') region._id = regionID;
            let subregions = found.subregions;
            subregions.push(region);
            const updated = await Map.updateOne({ _id: mapID}, { subregions: subregions});
            if(updated) return (region._id);
            else return ('Could not add subregion');
        },
        deleteSubregion: async (_, args) => {
            const { _id, regionID } = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = found.subregions;
            subregions = subregions.filter(region => region._id != regionID);

            const updated = await Map.updateOne({_id: mapID}, { subregions: subregions })
            if(updated) return ("done")
            else return "not done";
        },
        updateRegionField: async (_, args) => {
            const { _id, regionID, field, value } = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = found.subregions;
            const index = subregions.findIndex(region => region._id == regionID);
            subregions[index][field] = value;
            const updated = await Map.updateOne({ _id: mapID}, { subregions: subregions });
            if(updated) return "Updated field";
            return "Could not update field";
        },
        changeParentRegion: async(_, args) => {
            const { _id, regionID, parent} = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = found.subregions;
            const index = subregions.findIndex(region => region._id == regionID);
            subregions[index].parent = parent;
            const updated = await Map.updateOne({ _id: mapID }, { subregions: subregions });
            if(updated) return "Changed parent";
            return "Could not change parent";
        },
        sortByField: async(_, args) => {
            const { _id, field } = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = [...found.subregions];
            subregions.sort((a, b) => a[field].localeCompare(b[field]));
            
            function checkIfListsEqual(list1, list2) {
                for(let i = 0; i < list1.length; i++) {
                    if(list1[i]._id != list2[i]._id) {
                        return false;
                    }
                }
                return true;
            }

            subregions = checkIfListsEqual(subregions, found.subregions) ? subregions.reverse() : subregions;

            const updated = await Map.updateOne({ _id: mapID }, { subregions: subregions });
            if(updated) return "Sorted";
            return "Could not sort";
        },
        setRegions: async(_, args) => {
            const { _id, subregions } = args;
            const mapID = new ObjectId(_id);
            const updated = await Map.updateOne({ _id: mapID }, { subregions: subregions });
            if(updated) return "List reverted";
            return "List could not be reverted";
        },
        addLandmark: async(_, args) => {
            const { _id, regionID, landmark } = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = found.subregions;
            let region = subregions.find((r) => r._id == regionID);
            let index = subregions.findIndex((r => r._id == regionID));
            region.landmarks.push(landmark);
            subregions.splice(index, 1, region);
            const updated = await Map.updateOne({ _id: mapID }, { subregions: subregions });
            if (updated) return "Added landmark";
            return "Could not add landmark";
        },
        deleteLandmark: async(_, args) => {
            const { _id, regionID, landmark } = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = found.subregions;
            let region = subregions.find((r) => r._id == regionID);
            let index = subregions.findIndex(r => r._id == regionID);
            region.landmarks = region.landmarks.filter(l => l != landmark);
            subregions.splice(index, 1, region);
            const updated = await Map.updateOne({ _id: mapID }, { subregions: subregions });
            if (updated) return "Deleted landmark";
            return "Could not delete landmark";
        },
        editLandmark: async(_, args) => {
            const { _id, regionID, prevLandmark, newLandmark } = args;
            const mapID = new ObjectId(_id);
            const found = await Map.findOne({ _id: mapID });
            let subregions = found.subregions;
            let region = subregions.find((r) => r._id == regionID);
            let index = subregions.findIndex(r => r._id == regionID);
            for(var i = 0; i < region.landmarks.length; i++) {
                if(region.landmarks[i] == prevLandmark) {
                    region.landmarks[i] = newLandmark
                }
            }
            subregions.splice(index, 1, region);
            const updated = await Map.updateOne({ _id: mapID }, { subregions: subregions });
            if (updated) return "Updated landmark name";
            return "Could not update landmark name";
        }
    }
}