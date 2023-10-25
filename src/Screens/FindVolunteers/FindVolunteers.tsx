import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { VolunteersTable } from '../../Components/VolunteersTable/VolunteersTable';
import axios from '../../generalAxiosConfig';
import { errorStatusCodes } from '../../utils/statusCodes';
import { MatchingVolunteers, Volunteer } from '../../utils/types';

const FindVolunteers = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searchVolunteers = async () => {
        // if(!name || !email || !phoneNumber) {
        //     toast.error('Missing parameters', {
        //         position: 'top-right',
        //         autoClose: 3000
        //     });
        //     return;
        // }

        setIsLoading(true);
        try {
            const userInfo = await Auth.currentUserInfo();

            const { data } = await axios.post<MatchingVolunteers>(
                '/find_volunteers',
                {
                    email: userInfo.username,
                    user_type: 'manager',
                    name: name,
                    phone_number: phoneNumber,
                    v_email: email,
                }
            );

            if (errorStatusCodes[data.status]) {
                throw new Error(errorStatusCodes[data.status]);
            }

            setVolunteers(data.volunteers);
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    marginTop: '15px',
                    alignItems: 'center',
                }}
            >
                <TextField
                    id="email"
                    label="Email"
                    variant="standard"
                    style={{ height: 'fit-content' }}
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(event.target.value);
                    }}
                />
                <TextField
                    id="name"
                    label="Name"
                    variant="standard"
                    style={{ height: 'fit-content', marginLeft: '15px' }}
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}
                />
                <TextField
                    id="phoneNumber"
                    label="Phone Number"
                    variant="standard"
                    style={{ height: 'fit-content', marginLeft: '15px' }}
                    value={phoneNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPhoneNumber(event.target.value);
                    }}
                />

                <Button
                    style={{ height: 'fit-content', marginLeft: '15px' }}
                    variant="outlined"
                    onClick={searchVolunteers}
                >
                    Search
                </Button>
            </div>

            {isLoading ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '20px',
                    }}
                >
                    <CircularProgress size={24} color="inherit" />
                </div>
            ) : (
                <VolunteersTable volunteers={volunteers} />
            )}
        </div>
    );
};

export default FindVolunteers;
