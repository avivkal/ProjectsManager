import { Amplify, Auth, Hub } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ConfirmSignup from './Screens/ConfirmSignup/ConfirmSignup';
import Login from './Screens/Login/Login';
import Signup from './Screens/Signup/Signup';
import awsconfig from './aws-exports';
import { protectedRoutes } from './utils/routes';
import Home from './Screens/Home/Home';
import { Layout } from './Components/Layout/Layout';

Amplify.configure(awsconfig);

function App() {
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const getIsAuth = async () => {
        try {
            await Auth.currentAuthenticatedUser();
            setAuthenticated(true);
        } catch (error: any) {
            setAuthenticated(false);
        }
    };

    useEffect(() => {
        getIsAuth();

        const hubObj = {
            onHubCapsule: (capsule: { payload: { event: any } }) => {
                switch (capsule.payload.event) {
                    case 'signIn':
                        setAuthenticated(true);
                        break;
                    case 'signOut':
                        setAuthenticated(false);
                        break;
                    default:
                        return;
                }
            },
        };

        Hub.listen('auth', hubObj, 'onHubCapsule');
    }, []);

    return (
        <HashRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/confirmSignup" element={<ConfirmSignup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />

                {authenticated ? (
                    protectedRoutes.map(({ route, element }) => (
                        <Route key={route} element={<Layout />}>
                            <Route path={route} element={element} />
                        </Route>
                    ))
                ) : (
                    <Route
                        path="*"
                        element={<Navigate replace to="/login" />}
                    />
                )}
            </Routes>
        </HashRouter>
    );
}

export default App;
