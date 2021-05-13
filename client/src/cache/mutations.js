import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
            name
            email
            password
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`;

export const UPDATE_ACCOUNT = gql`
    mutation UpdateAccount($name: String!, $email: String!, $password: String!, $_id: String!) {
        updateAccount(name: $name, email: $email, password: $password, _id: $_id) {
            name
            email
            password
        }
    }
`;

export const ADD_MAP = gql`
    mutation AddMap($map: MapInput!) {
        addMap(map: $map)
    }
`;

export const RENAME_MAP = gql`
    mutation RenameMap($_id: String!, $name: String!) {
        renameMap(_id: $_id, name: $name)
    }
`;

export const DELETE_MAP = gql`
    mutation DeleteMap($_id: String!) {
        deleteMap(_id: $_id)
    }
`;

export const MOVE_MAP_TO_TOP = gql`
    mutation MoveMapToTop($_id: String!, $owner: String!) {
        moveMapToTop(_id: $_id, owner: $owner)
    }
`;

export const ADD_SUBREGION = gql`
    mutation AddSubregion($_id: String!, $region: RegionInput!) {
        addSubregion(_id: $_id, region: $region)
    }
`;

export const DELETE_SUBREGION = gql`
    mutation DeleteSubregion($_id: String!, $regionID: String!) {
        deleteSubregion(_id: $_id, regionID: $regionID)
    }
`;

export const UPDATE_REGION_FIELD = gql`
	mutation UpdateRegionField($_id: String!, $regionID: String!, $field: String!, $value: String!) {
		updateRegionField(_id: $_id, regionID: $regionID, field: $field, value: $value)
	}
`;

export const CHANGE_PARENT_REGION = gql`
    mutation ChangeParentRegion($_id: String!, $regionID: String!, $parent: String!) {
        changeParentRegion(_id: $_id, regionID: $regionID, parent: $parent)
    }
`;

export const SORT_BY_FIELD = gql`
    mutation SortByField($_id: String!, $field: String!) {
        sortByField(_id: $_id, field: $field)
    }
`;

export const SET_REGIONS = gql`
    mutation SetRegions($_id: String!, $subregions: [RegionInput!]!) {
        setRegions(_id: $_id, subregions: $subregions)
    }
`;

export const ADD_LANDMARK = gql`
    mutation AddLandmark($_id: String!, $regionID: String!, $landmark: String!) {
        addLandmark(_id: $_id, regionID: $regionID, landmark: $landmark)
    }
`;

export const DELETE_LANDMARK = gql`
    mutation DeleteLandmark($_id: String!, $regionID: String!, $landmark: String!) {
        deleteLandmark(_id: $_id, regionID: $regionID, landmark: $landmark)
    }
`;