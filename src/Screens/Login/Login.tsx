import { Auth } from 'aws-amplify';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';
import { toast } from 'react-toastify';


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
            await Auth.signIn({ username: email, password });

            // const { data } = await axios.post<StatusCodesResponse>('/sign_in', {
            //     email,
            //     user_type: 'manager',
            //     device_token: '0000000'
            // });

            // if (errorStatusCodes[data.status]) {
            //     throw new Error(errorStatusCodes[data.status]);
            // }

            navigate('/');
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePassswordChange}
                        required
                    />
                </div>
                <div>
                    <button onClick={signIn}>Sign In</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
