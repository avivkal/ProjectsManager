import { Link, Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <>
            <header
                className="relative top-0 pt-4 w-full min-h-[250px]"
                style={{
                    background:
                        'linear-gradient(118deg, #1C31D9 9.73%, #3219CA 37.53%, #2F19C5 37.54%, #111D88 58.94%, #041E6E 68.2%, #1E1676 102.35%)',
                }}
            >
                <div dir="rtl" className="flex justify-center">
                    <nav>
                        <ul className="flex justify-center gap-4">
                            <li>
                                <Link
                                    className="text-white font-bold"
                                    to="/"
                                >{`פילטור מתנדבים`}</Link>
                            </li>
                            <li>
                                <Link
                                    className="text-white font-bold"
                                    to="/findVolunteers"
                                >{`חיפוש מתנדבים`}</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="text-[#00F3DB] font-bold"></div>
                </div>
                <div className="flex justify-center w-full py-[5rem]">
                    <div className="text-white text-6xl font-bold">{`מתנדבים`}</div>
                </div>
                <img
                    className="absolute bottom-[-2rem]"
                    src="./volunteerPerson.svg"
                    alt="volunteerPerson"
                />
            </header>

            <Outlet />
        </>
    );
}
