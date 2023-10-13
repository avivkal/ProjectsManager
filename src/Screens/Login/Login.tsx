import { Auth } from 'aws-amplify';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../authAxiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const Login = () => { // ! loader
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePassswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const signIn = async () => {
        try {
            const response = await Auth.signIn({ username: email, password });

            console.log(JSON.parse(JSON.stringify(response)))

            const { data } = await axios.post<StatusCodesResponse>('/sign_in', {
                email,
                user_type: 'manager',
                device_token: '0000000'
            });

            if (errorStatusCodes[data.status]) {
                throw new Error(errorStatusCodes[data.status]);
            }

            navigate('/');
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <h2 style={{ color: '#897d7d', fontWeight: 400 }}>Sign In</h2>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    label="Email"
                    variant="outlined" />

                <TextField
                    style={{ marginTop: '10px' }}
                    type="text"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePassswordChange}
                    label="Password"
                    variant="outlined" />

                <Button
                    style={{ marginTop: '13px' }}
                    onClick={signIn}
                    variant="contained">Sign In</Button>

            </div>
        </div>
    );
}

export default Login;
