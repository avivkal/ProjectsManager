import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactCodeInput from 'react-verification-code-input';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';
import Loader from "react-spinners/BeatLoader";

const VALID_VERIFICATION_CODE_LENGTH = 6;

const ConfirmSignup = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { email } = location.state;

    const handleVerificationCodeChange = (value: string) => {
        setVerificationCode(value);
    };

    const verifyCode = async () => {
        setIsLoading(true);

        try {
            await Auth.confirmSignUp(email, verificationCode);

            // const { data } = await axios.post<StatusCodesResponse>('/sign_up', {
            //     email,
            //     user_type: 'manager'
            // });

            // if (errorStatusCodes[data.status]) {
            //     throw new Error(errorStatusCodes[data.status]);
            // }

            navigate('/login');

        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        } finally {
            setIsLoading(false);
        }
    }

    const isVerifyButtonDisabled = verificationCode.length !== VALID_VERIFICATION_CODE_LENGTH || isLoading;

    return (
        <div>
            <label htmlFor="verificationCode">Verification Code:</label>
            <ReactCodeInput
            loading={isLoading}
                onChange={handleVerificationCodeChange}
            />

            <button disabled={isVerifyButtonDisabled} onClick={verifyCode}>Verify</button>

        </div>
    );
}

export default ConfirmSignup;
