import { useMutation } from '@apollo/client';
import { UPDATE_ACCOUNT } from '../../cache/mutations';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const UpdateAccount = (props) => {
    const [input, setInput] = useState({
        name: props.user.name,
        email: props.user.email,
        password: props.user.password,
        _id: props.user._id.toString()
    });
    const [loading, toggleLoading] = useState(false);
    const [showErr, displayErrorMsg] = useState(false);
    const errorMsg = "Email/Password not found.";
    const [UpdateAccount] = useMutation(UPDATE_ACCOUNT);

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleUpdate = async (e) => {
        for (let field in input) {
            if(!input[field]) {
                alert('All fields must be filled out to update your account.');
                return;
            }
        }
        const {loading, error, data} = await UpdateAccount({ variables: { ...input } });
        if (loading) { toggleLoading(true) };
        if (data.updateAccount.email === "already exists") {
            alert('User with that email already registered');
            return;
        }
        if (data) {
            props.fetchUser();
            toggleLoading(false);
            history.push('/');
        }
    }

    const history = useHistory();

    return (
        <div className="signup-card">
            <h1>Update Account</h1>
            <div className="form">
                <div class="text-field">
                    <input defaultValue={props.user.name} name="name" type="text" onBlur={updateInput} required></input>
                    <label>Name</label>
                </div>
                <div class="text-field">
                    <input defaultValue={props.user.email} name="email" type="text" onBlur={updateInput} required></input>
                    <label>Email</label>
                </div>
                <div class="text-field">
                    <input defaultValue={props.user.password} name="password" type="password" onBlur={updateInput} required></input>
                    <label>Password</label>
                </div>
                <div className="form-buttons">
                    <input onClick={() => {history.push('/')}} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                    <input onClick={handleUpdate} className="form-button submit-button" type="submit" value="UPDATE"></input>
                </div>
            </div>
        </div>
    );
}

export default UpdateAccount;