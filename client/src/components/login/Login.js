import { useMutation } from '@apollo/client';
import { LOGIN } from '../../cache/mutations';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = (props) => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [loading, toggleLoading] = useState(false);
    const errorMsg = "Email/Password not found.";
    const [Login] = useMutation(LOGIN);

    const updateInput = (e) => {
        const { name, value } = e.target;
        const updated = { ...input, [name]: value };
        setInput(updated);
    }

    const handleLogin = async (e) => {
        for (let field in input) {
            if(!input[field]) {
                alert('All fields must be filled out to login');
                return;
            }
        }
        const {loading, error, data} = await Login({ variables: { ...input } });
        if (loading) { toggleLoading(true) };
        if (data.login._id === null) {
            alert("Invalid Email/Password");
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
        <div className="card">
            <h1>Login</h1>
            <div className="form">
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
                    <input onClick={handleLogin} className="form-button submit-button" type="submit" value="LOGIN"></input>
                </div>
            </div>
        </div>
    );
}

export default Login;