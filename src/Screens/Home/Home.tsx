import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { VolunteersTable } from '../../Components/VolunteersTable/VolunteersTable';
import axios from '../../generalAxiosConfig';
import { errorStatusCodes } from '../../utils/statusCodes';
import {
    AllSkills,
    MatchingVolunteers,
    Skill,
    Volunteer,
} from '../../utils/types';
import { Button } from '../../Components/common/button';
import { Loader2, Search } from 'lucide-react';
import { FiltersBox, Filter } from '../../Components/FiltersBox/FiltersBox';

type ActiveFiltersMap = Record<Filter['type'], boolean>;

const Home = () => {
    // ! if enters without auth kick him out
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [skillSets, setSkillSets] = useState<Skill[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [isWorkingOnProject, setIsWorkingOnProject] = useState(true);
    const [isVerified, setIsVerified] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeFiltersMap, setActiveFiltersMap] = useState<ActiveFiltersMap>(
        {} as ActiveFiltersMap
    );

    useEffect(() => {
        fetchAllSkills();
    }, []);

    const fetchAllSkills = async () => {
        try {
            const userInfo = await Auth.currentUserInfo();

            const { data } = await axios.post<AllSkills>('/get_all_skills', {
                email: userInfo.username,
                user_type: 'manager',
            });

            if (errorStatusCodes[data.status]) {
                throw new Error(errorStatusCodes[data.status]);
            }

            setAllSkills(data.skills);
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const searchVolunteers = async () => {
        setIsLoading(true);
        try {
            const userInfo = await Auth.currentUserInfo();

            // ! should i remove nulls from sending at all
            const { data } = await axios.post<MatchingVolunteers>(
                '/get_matching_volunteers',
                {
                    email: userInfo.username,
                    user_type: 'manager',
                    skill_sets:
                        activeFiltersMap['Skills'] !== undefined
                            ? skillSets.map((current) => current.id)
                            : [],
                    keywords:
                        activeFiltersMap['Keyword'] !== undefined
                            ? keyword
                            : '',
                    is_working_on_project:
                        activeFiltersMap['Working'] !== undefined
                            ? isWorkingOnProject
                            : null,
                    is_verified:
                        activeFiltersMap['Verified'] !== undefined
                            ? isVerified
                            : null,
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

    const handleFilterOpenChange = (
        open: boolean,
        filterType: Filter['type']
    ) => {
        if (open && !activeFiltersMap[filterType]) {
            setActiveFiltersMap((prevMap) => ({
                ...prevMap,
                [filterType]: true,
            }));
        }
    };

    return (
        <div style={{ padding: '50px 30px' }}>
            <div className="flex justify-center">
                <FiltersBox
                    filters={[
                        {
                            type: 'Working',
                            title: 'עבודה',
                            isActive: Boolean(activeFiltersMap['Working']),
                            value: isWorkingOnProject,
                            setValue: setIsWorkingOnProject,
                            onOpenChange: (open: boolean) =>
                                handleFilterOpenChange(open, 'Working'),
                        },
                        {
                            type: 'Skills',
                            title: 'כישורים',
                            isActive: Boolean(activeFiltersMap['Skills']),
                            value: skillSets,
                            setValue: setSkillSets,
                            allSkills: allSkills,
                            onOpenChange: (open: boolean) =>
                                handleFilterOpenChange(open, 'Skills'),
                        },
                        {
                            type: 'Verified',
                            title: 'מאומת',
                            isActive: Boolean(activeFiltersMap['Verified']),
                            value: isVerified,
                            setValue: setIsVerified,
                            onOpenChange: (open: boolean) =>
                                handleFilterOpenChange(open, 'Verified'),
                        },
                        {
                            type: 'Keyword',
                            title: 'מילות חיפוש',
                            isActive: Boolean(activeFiltersMap['Keyword']),
                            value: keyword,
                            setValue: setKeyword,
                            onOpenChange: (open: boolean) =>
                                handleFilterOpenChange(open, 'Keyword'),
                        },
                    ]}
                />
            </div>

            <div className="flex justify-center w-full my-4 gap-2">
                <Button onClick={searchVolunteers} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="mr-2 h-4 w-4" />
                    )}
                    {`חיפוש`}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setActiveFiltersMap({} as ActiveFiltersMap)}
                >
                    {`נקה פילטרים`}
                </Button>
            </div>

            <VolunteersTable volunteers={volunteers} />
        </div>
    );
};

export default Home;
