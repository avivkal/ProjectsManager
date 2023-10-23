import { Auth } from 'aws-amplify';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../authAxiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress, Typography } from '@mui/material';
import PasswordTextField from '../../Components/PasswordTextField/PasswordTextField';


const Signup = () => { // ! loader

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePassswordChange = (value: string) => {
        setPassword(value);
    };

    const createAccount = async () => {
        setIsLoading(true);

        try {
            const { data: checkBeforeSignupData } = await axios.post<StatusCodesResponse>('/check_before_sign_up', {
                email,
                user_type: 'manager' // ! need clarification about that
            });

            if (errorStatusCodes[checkBeforeSignupData.status]) {
                throw new Error(errorStatusCodes[checkBeforeSignupData.status]);
            }

            const response = await Auth.signUp({ username: email, password, attributes: { email } });
            const parsedResponse = JSON.parse(JSON.stringify(response));
            const cognitoUserName = JSON.stringify(parsedResponse.userSub).slice(1, -1);

            const { data: preSignupData } = await axios.post<StatusCodesResponse>('/pre_sign_up', {
                email,
                user_type: 'manager',
                third_party_user_name: cognitoUserName
            });

            if (errorStatusCodes[preSignupData.status]) {
                throw new Error(errorStatusCodes[preSignupData.status]);
            }

            navigate('/confirmSignup', { state: { email } });
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        } finally{
            setIsLoading(false);
        }
    };

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

                <div style={{ marginTop: '10px' }}>
                    <PasswordTextField onChange={handlePassswordChange} password={password} />
                </div>

                <Button
                    style={{ marginTop: '13px' }}
                    onClick={createAccount}
                    variant="contained">{isLoading ? <CircularProgress size={24} color="inherit" /> : `Create Account`}</Button>

                <Typography style={{ textAlign: 'center', marginTop: '12px' }}>Already have a user?</Typography>
                <Button onClick={() => navigate('/login')}>Click here to sign in</Button>

            </div>
        </div>
    );
}

export default Signup;
