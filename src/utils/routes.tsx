import FindVolunteers from "../Screens/FindVolunteers/FindVolunteers";
import Home from "../Screens/Home/Home";

export const protectedRoutes = [
  { route: "/", text: 'Filter Volunteers', element: <Home /> },
  { route: "/findVolunteers", text: 'Find Volunteers', element: <FindVolunteers /> },
];  