import { Auth } from 'aws-amplify';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const Signup = () => { // ! loader

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePassswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const createAccount = async () => {
        try {
            // const { data: checkBeforeSignupData } = await axios.post<StatusCodesResponse>('/check_before_sign_up', {
            //     email,
            //     user_type: 'manager' // ! need clarification about that
            // });

            // if (errorStatusCodes[checkBeforeSignupData.status]) {
            //     throw new Error(errorStatusCodes[checkBeforeSignupData.status]);
            // }

            const response = await Auth.signUp({ username: email, password, attributes: { email } });
            const parsedResponse = JSON.parse(JSON.stringify(response));
            const cognitoUserName = JSON.stringify(parsedResponse.userSub).slice(1, -1);

            // const { data: preSignupData } = await axios.post<StatusCodesResponse>('/pre_sign_up', {
            //     email,
            //     user_type: 'manager',
            //     third_party_user_name: cognitoUserName
            // });

            // if (errorStatusCodes[preSignupData.status]) {
            //     throw new Error(errorStatusCodes[preSignupData.status]);
            // }

            navigate('/confirmSignup', { state: { email } });
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        }
    };

    console.log(email)

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <h2 style={{ color: '#897d7d', fontWeight: 400 }}>Signup</h2>

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
                    onClick={createAccount}
                    variant="contained">Create Account</Button>

            </div>
        </div>
    );
}

export default Signup;
