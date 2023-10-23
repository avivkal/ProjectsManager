import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface Props {
    onChange: (value: string) => void,
    password: string
}

const PasswordTextField = ({ onChange, password }: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handlePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <TextField
            name='password'
            // autoComplete='off'
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                // autoComplete: 'new-password',
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handlePasswordVisibility}>
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}

export default PasswordTextField;
