import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
    Autocomplete,
    Checkbox,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
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
import { Loader2, Minus, Plus, Search } from 'lucide-react';

const mapSelection = {
    NoPreference: null,
    Selected: true,
    NonSelected: false,
};

type ActiveFiltersMap = Record<'verified', boolean>;

const Home = () => {
    // ! if enters without auth kick him out
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [skillSets, setSkillSets] = useState<Skill[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [isWorkingOnProject, setIsWorkingOnProject] =
        useState<keyof typeof mapSelection>('NoPreference');
    const [isStudent, setIsStudent] =
        useState<keyof typeof mapSelection>('NoPreference');
    const [isVerified, setIsVerified] =
        useState<keyof typeof mapSelection>('NoPreference');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFiltersBoxOpen, setIsFiltersBoxOpen] = useState(true);

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
                    is_working_on_project: mapSelection[isWorkingOnProject],
                    is_student: mapSelection[isStudent],
                    is_verified: mapSelection[isVerified],
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

    const handleStudentChange = (event: SelectChangeEvent) => {
        setIsStudent(event.target.value as keyof typeof mapSelection);
    };

    const handleIsWorkingOnProjectChange = (event: SelectChangeEvent) => {
        setIsWorkingOnProject(event.target.value as keyof typeof mapSelection);
    };

    const handleIsVerifiedChange = (event: SelectChangeEvent) => {
        setIsVerified(event.target.value as keyof typeof mapSelection);
    };

    return (
        <div style={{ padding: '50px 30px' }}>
            {isFiltersBoxOpen && (
                <div dir="rtl">
                    <div className="grid grid-flow-col auto-cols-fr gap-x-32 mx-96">
                        <div className="grid grid-flow-col grid-cols-[100px_400px] mb-8">
                            <div className="flex flex-wrap content-center">
                                <label>{`כישורים`}</label>
                            </div>

                            <Autocomplete
                                multiple
                                value={skillSets}
                                onChange={(_event, newValue) => {
                                    setSkillSets(newValue);
                                }}
                                id="skills"
                                options={allSkills}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={
                                                <CheckBoxOutlineBlankIcon fontSize="small" />
                                            }
                                            checkedIcon={
                                                <CheckBoxIcon fontSize="small" />
                                            }
                                            style={{ marginRight: 8 }}
                                            checked={
                                                !!skillSets.find(
                                                    (curr) =>
                                                        curr.id === option.id
                                                )
                                            }
                                        />
                                        {option.name}
                                    </li>
                                )}
                                style={{ width: 400 }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Skills" />
                                )}
                            />
                        </div>
                        <div className="grid grid-flow-col grid-cols-[100px_400px] mb-8">
                            <div className="flex flex-wrap content-center justify-center">
                                <label>{`מילות חיפוש`}</label>
                            </div>
                            <TextField
                                id="keyword"
                                label="Keywords"
                                variant="standard"
                                style={{ height: 'fit-content' }}
                                value={keyword}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setKeyword(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-flow-col auto-cols-fr gap-x-32 mx-96">
                        <div className="grid grid-flow-col grid-cols-[100px_400px] mb-8">
                            <div className="flex flex-wrap content-center">
                                <label>{`עבודה`}</label>
                            </div>
                            <Select
                                id="isWorkingOnProject"
                                value={isWorkingOnProject}
                                onChange={handleIsWorkingOnProjectChange}
                            >
                                <MenuItem value={'NoPreference'}>
                                    {`ללא העדפה`}
                                </MenuItem>
                                <MenuItem value={'Selected'}>{`עובד`}</MenuItem>
                                <MenuItem
                                    value={'NonSelected'}
                                >{`לא עובד`}</MenuItem>
                            </Select>
                        </div>

                        <div className="grid grid-flow-col grid-cols-[100px_400px] mb-8">
                            <div className="flex flex-wrap content-center">
                                <label>{`מאומת`}</label>
                            </div>
                            <Select
                                labelId="isVerified"
                                id="isVerified"
                                value={isVerified}
                                onChange={handleIsVerifiedChange}
                            >
                                <MenuItem value={'NoPreference'}>
                                    {`ללא העדפה`}
                                </MenuItem>
                                <MenuItem
                                    value={'Selected'}
                                >{`מאומת`}</MenuItem>
                                <MenuItem
                                    value={'NonSelected'}
                                >{`לא מאומת`}</MenuItem>
                            </Select>
                        </div>
                    </div>
                </div>
            )}

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
                    variant="secondary"
                    onClick={() => setIsFiltersBoxOpen((prevOpen) => !prevOpen)}
                >
                    {isFiltersBoxOpen ? (
                        <>
                            <Minus className="mr-2 h-4 w-4" />
                            {`סגור פילטרים`}
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            {`פתח פילטרים`}
                        </>
                    )}
                </Button>
            </div>

            <VolunteersTable volunteers={volunteers} />
        </div>
    );
};

export default Home;
