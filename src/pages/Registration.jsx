import React, {useState} from 'react';
import axios from "axios";
import {registrationRoute} from "../api/api";
import {useNavigate} from "react-router-dom";

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleRegister = async () => {
        if (password.length >= 8) {
            const response = await axios.post(registrationRoute, {
                username, password
            })
            if (response.data.status) {
                navigate('/');
            }
            console.log(response);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Реєстрація</h1>
            <div style={styles.column}>
                <input
                    type="text"
                    placeholder="Введіть ім'я"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={true}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Введіть пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                    style={styles.input}
                />
                <button onClick={handleRegister} style={styles.button}>
                    Зареєструватися
                </button>
                <a href={'/login'}> Вже зареєствровані?</a>
            </div>
        </div>
    );
};

export default Registration;

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        marginBottom: '10px',
        padding: '5px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};
