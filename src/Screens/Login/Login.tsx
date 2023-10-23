import { Auth } from 'aws-amplify';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../authAxiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress, Typography } from '@mui/material';
import PasswordTextField from '../../Components/PasswordTextField/PasswordTextField';


const Login = () => { // ! loader
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePassswordChange = (value: string) => {
        setPassword(value);
    };

    const signIn = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form autoComplete='off' style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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

                <div style={{ marginTop: '10px' }}>
                    <PasswordTextField onChange={handlePassswordChange} password={password} />
                </div>

                <Button
                    style={{ marginTop: '13px' }}
                    onClick={signIn}
                    variant="contained">{isLoading ? <CircularProgress size={24} color="inherit" /> : `Sign In`}</Button>

                <Typography style={{ textAlign: 'center', marginTop: '12px' }}>Have no user?</Typography>
                <Button onClick={() => navigate('/signup')}>Click here to sign up</Button>
            </div>
        </form>
    );
}

export default Login;
