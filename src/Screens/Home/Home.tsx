import React, { useEffect, useState } from 'react';
import axios from '../../generalAxiosConfig'
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { StatusCodesResponse, errorStatusCodes } from '../../utils/statusCodes';

interface Skill {
    id: number,
    name: string
}
interface AllSkills extends StatusCodesResponse {
    skills: Skill[]
}

enum Status {
    NOT_PROCESSED = 0,
    AUTHORIZED = 1,
    SUSPICIOUS = 2,
    MESSAGE_SENT = 3
}

interface Volunteer {
    id: number,
    name: string,
    job_title: string,
    can_help_with: string,
    whatsapp_num: string,
    email: string,
    linkedin_profile: string,
    comments: string,
    status: Status,
    is_student: boolean
}

interface MatchingVolunteers extends StatusCodesResponse {
    volunteers: Volunteer[]
}

const Home = () => { // ! if enters without auth kick him out
    const [skills, setSkills] = useState<Skill[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    useEffect(() => {
        fetchAllSkills();
    }, []);

    const fetchAllSkills = async () => {
        try {
            const userInfo = await Auth.currentUserInfo();

            const { data } = await axios.post<AllSkills>('/get_all_skills', {
                email: userInfo.username,
                user_type: 'manager'
            });

            if (errorStatusCodes[data.status]) {
                throw new Error(errorStatusCodes[data.status]);
            }

            setSkills(data.skills);
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        }
    }

    const search = async () => {
        try {
            const userInfo = await Auth.currentUserInfo();

            const { data } = await axios.post<MatchingVolunteers>('/get_matching_volunteers', {
                email: userInfo.username,
                user_type: 'manager',
                skill_sets: [],
                keywords: '',
                is_working_on_project: false,
                is_student: false,
                is_verified: false
            });

            if (errorStatusCodes[data.status]) {
                throw new Error(errorStatusCodes[data.status]);
            }

            setVolunteers(data.volunteers);
        } catch (error: any) {
            toast.error(error?.message, {
                position: 'top-right',
                autoClose: 3000
            });
        }
    }

    return (
        <div>
            <h2>Home page</h2>

        </div>
    );
}

export default Home;
