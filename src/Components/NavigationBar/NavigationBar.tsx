import { AppBar, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { protectedRoutes } from '../../utils/routes';


const NavigationBar = () => {
    const location = useLocation();

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {protectedRoutes.map(curr => curr.route).includes(location.pathname) && <AppBar position="static">
                <Toolbar>
                    {protectedRoutes.map(({ route, text }) =>
                        <Button component={Link} color="inherit" to={route}>{text}</Button>)
                    }
                </Toolbar>
            </AppBar>}
        </div>
    );
}

export default NavigationBar;
