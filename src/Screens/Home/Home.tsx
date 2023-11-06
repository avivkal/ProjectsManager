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
import { FiltersBox } from '../../Components/FiltersBox/FiltersBox';
import { FiltersPreview } from '../../Components/FiltersPreview/FiltersPreview';

function removeFromArray<T>(array: T[], item: T) {
    return array.filter((el) => el !== item);
}

const Home = () => {
    // ! if enters without auth kick him out
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [skillSets, setSkillSets] = useState<Skill[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [isWorkingOnProject, setIsWorkingOnProject] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                    skill_sets: skillSets.map((current) => current.id),
                    keywords: keyword,
                    is_working_on_project: isWorkingOnProject,
                    is_verified: isVerified,
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
        <div style={{ padding: '50px 30px' }}>
            <div dir="rtl" className="flex justify-center items-stretch gap-6">
                <FiltersBox
                    filters={[
                        {
                            type: 'Working',
                            title: 'פניות',
                            isActive: isWorkingOnProject,
                            value: isWorkingOnProject,
                            setValue: (newIsWorking) =>
                                setIsWorkingOnProject(newIsWorking),
                        },
                        {
                            type: 'Skills',
                            title: 'כישורים',
                            isActive: skillSets.map((s) => s.name).length > 0,
                            value: skillSets,
                            setValue: setSkillSets,
                            allSkills: allSkills,
                        },
                        {
                            type: 'Verified',
                            title: 'מאומת',
                            isActive: isVerified,
                            value: isVerified,
                            setValue: (newIsVerified) =>
                                setIsVerified(newIsVerified),
                        },
                        {
                            type: 'Keyword',
                            title: 'מילות חיפוש',
                            isActive: keyword.length > 0,
                            value: keyword,
                            setValue: setKeyword,
                        },
                    ]}
                />

                <div className="border-2 border-[#00F3DB] rounded-xl">
                    <Button
                        variant="ghost"
                        onClick={searchVolunteers}
                        disabled={isLoading}
                        className="h-full rounded-xl"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
            <FiltersPreview
                skills={skillSets}
                onSkillRemove={(skill) =>
                    setSkillSets((prevSkills) =>
                        removeFromArray(prevSkills, skill)
                    )
                }
                keyword={keyword}
            />
            <VolunteersTable volunteers={volunteers} />
        </div>
    );
};

export default Home;
