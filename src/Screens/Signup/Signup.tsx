import { Auth } from 'aws-amplify';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';


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

    return (
        <div>
            <h2>Signup</h2>
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
                    <button onClick={createAccount}>Create Account</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
