import { useMutation } from '@apollo/client';
import { REGISTER } from '../../cache/mutations';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SignUp = (props) => {
    const [input, setInput] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [Register] = useMutation(REGISTER);

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleSignUp = async (e) => {
        for (let field in input) {
            if(!input[field]) {
                alert('All fields must be filled out to register');
                return;
            }
        }
        const {user} = await Register({ variables: { ...input } });
        if(user) {
            console.log(user);
            if(user.register.email === 'already exists') {
                alert('User with that email already registered');
            }
        }
    }

    const history = useHistory();

    return (
        <div className="signup-card">
            <h1>Sign Up</h1>
            <div className="form">
                <div class="text-field">
                    <input name="name" type="text" onBlur={updateInput} required></input>
                    <label>Name</label>
                </div>
                <div class="text-field">
                    <input name="email" type="text" onBlur={updateInput} required></input>
                    <label>Email</label>
                </div>
                <div class="text-field">
                    <input name="password" type="password" onBlur={updateInput} required></input>
                    <label>Password</label>
                </div>
                <div className="form-buttons">
                    <input onClick={() => {history.push('/')}} className="form-button cancel-button" type="submit" value="CANCEL"></input>
                    <input onClick={() => {
                        handleSignUp();
                        history.push('/');
                    }} className="form-button submit-button" type="submit" value="SIGN UP"></input>
                </div>
            </div>
        </div>
    );
}

export default SignUp;