import Button from '@mui/material/Button';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VerificationInput from 'react-verification-input';
import axios from '../../authAxiosConfig';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';

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

            const { data } = await axios.post<StatusCodesResponse>('/sign_up', {
                email,
                user_type: 'manager',
            });

            if (errorStatusCodes[data.status]) {
                throw new Error(errorStatusCodes[data.status]);
            }

            navigate('/login');
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        await Auth.resendSignUp(email);
    };

    const isVerifyButtonDisabled =
        verificationCode.length !== VALID_VERIFICATION_CODE_LENGTH || isLoading;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '30px',
            }}
        >
            <h2 style={{ color: '#897d7d', fontWeight: 400 }}>
                Verification Code
            </h2>
            <VerificationInput onChange={handleVerificationCodeChange} />

            <Button
                onClick={resendCode}
                style={{ marginTop: '5px' }}
                variant="text"
            >
                Resend code
            </Button>

            <Button
                style={{ marginTop: '13px' }}
                disabled={isVerifyButtonDisabled}
                onClick={verifyCode}
                variant="contained"
            >
                {isLoading ? 'Loading...' : 'Verify'}
            </Button>
        </div>
    );
};

export default ConfirmSignup;
