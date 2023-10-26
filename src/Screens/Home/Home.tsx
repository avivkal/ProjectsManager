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
import { Loader2, Search } from 'lucide-react';

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
            {/* Filters */}
            <div dir="rtl">
                <div className="grid grid-cols-[220px_200px] mb-8">
                    <label>{`כישורים`}</label>

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
                        renderOption={(props, option, { selected }) => (
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
                                            (curr) => curr.id === option.id
                                        )
                                    }
                                />
                                {option.name}
                            </li>
                        )}
                        style={{ width: 800 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Skills" />
                        )}
                    />
                </div>

                <div className="grid grid-cols-[220px_200px] mb-8">
                    <label>{`סטטוס עבודה`}</label>
                    <Select
                        id="isWorkingOnProject"
                        value={isWorkingOnProject}
                        onChange={handleIsWorkingOnProjectChange}
                    >
                        <MenuItem value={'NoPreference'}>
                            {`ללא העדפה`}
                        </MenuItem>
                        <MenuItem value={'Selected'}>{`עובד`}</MenuItem>
                        <MenuItem value={'NonSelected'}>{`לא עובד`}</MenuItem>
                    </Select>
                </div>

                <div className="grid grid-cols-[220px_200px] mb-8">
                    <label>{`סטודנט`}</label>
                    <Select
                        id="isStudent"
                        value={isStudent}
                        onChange={handleStudentChange}
                    >
                        <MenuItem value={'NoPreference'}>
                            {`ללא העדפה`}
                        </MenuItem>
                        <MenuItem value={'Selected'}>{`סטודנט`}</MenuItem>
                        <MenuItem value={'NonSelected'}>{`לא סטודנט`}</MenuItem>
                    </Select>
                </div>

                <div className="grid grid-cols-[220px_200px] mb-8">
                    <label>{`מאומת`}</label>
                    <Select
                        labelId="isVerified"
                        id="isVerified"
                        value={isVerified}
                        onChange={handleIsVerifiedChange}
                    >
                        <MenuItem value={'NoPreference'}>
                            {`ללא העדפה`}
                        </MenuItem>
                        <MenuItem value={'Selected'}>{`מאומת`}</MenuItem>
                        <MenuItem value={'NonSelected'}>{`לא מאומת`}</MenuItem>
                    </Select>
                </div>

                <div className="grid grid-cols-[220px_200px] mb-8">
                    <label>{`מילות חיפוש`}</label>
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

            <div className="flex justify-center w-full my-4">
                <Button onClick={searchVolunteers} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="mr-2 h-4 w-4" />
                    )}
                    {`חיפוש`}
                </Button>
            </div>

            <VolunteersTable volunteers={volunteers} />
        </div>
    );
};

export default Home;
