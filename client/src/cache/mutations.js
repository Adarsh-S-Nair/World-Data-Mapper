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