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
    mutation AddSubregion($mapID: String!, $regionID: String!) {
        addSubregion(mapID: $mapID, regionID: $regionID)
    }
`;