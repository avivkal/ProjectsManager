import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
    Autocomplete,
    Button,
    Checkbox,
    CircularProgress,
    InputLabel,
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

const mapSelection = {
    NoPreference: null,
    Selected: true,
    NonSelected: false,
};

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
        <div style={{ marginTop: '15px' }}>
            <h2
                style={{
                    margin: 'auto',
                    textAlign: 'center',
                    color: '#897d7d',
                    fontWeight: 400,
                }}
            >
                Search Volunteers
            </h2>

            <div style={{ margin: '30px' }}>
                <div>
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
                <div
                    style={{
                        display: 'flex',
                        marginTop: '10px',
                        marginBottom: '15px',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <InputLabel id="isWorkingOnProject">
                            Work Status
                        </InputLabel>
                        <Select
                            labelId="isWorkingOnProject"
                            id="isWorkingOnProject"
                            value={isWorkingOnProject}
                            onChange={handleIsWorkingOnProjectChange}
                        >
                            <MenuItem value={'NoPreference'}>
                                No Preference
                            </MenuItem>
                            <MenuItem value={'Selected'}>Working</MenuItem>
                            <MenuItem value={'NonSelected'}>
                                Not Working
                            </MenuItem>
                        </Select>
                    </div>

                    <div style={{ marginLeft: '15px' }}>
                        <InputLabel id="isStudent">Student</InputLabel>
                        <Select
                            labelId="isStudent"
                            id="isStudent"
                            value={isStudent}
                            onChange={handleStudentChange}
                        >
                            <MenuItem value={'NoPreference'}>
                                No Preference
                            </MenuItem>
                            <MenuItem value={'Selected'}>Yes</MenuItem>
                            <MenuItem value={'NonSelected'}>No</MenuItem>
                        </Select>
                    </div>

                    <div style={{ marginLeft: '15px' }}>
                        <InputLabel id="isVerified">Verified</InputLabel>
                        <Select
                            labelId="isVerified"
                            id="isVerified"
                            value={isVerified}
                            onChange={handleIsVerifiedChange}
                        >
                            <MenuItem value={'NoPreference'}>
                                No Preference
                            </MenuItem>
                            <MenuItem value={'Selected'}>Yes</MenuItem>
                            <MenuItem value={'NonSelected'}>No</MenuItem>
                        </Select>
                    </div>

                    <div style={{ marginLeft: '15px' }}>
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
                        }}
                    >
                        <CircularProgress size={24} color="inherit" />
                    </div>
                ) : (
                    <VolunteersTable volunteers={volunteers} />
                )}
            </div>
        </div>
    );
};

export default Home;
