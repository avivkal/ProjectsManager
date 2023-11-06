import { Linkedin } from 'lucide-react';
import { Volunteer } from '../../utils/types';
import { Button } from '../common/button';
import { hebrewStatusesMap } from '../../utils/statusStringsMap';

interface VolunteerCardProps {
    volunteer: Volunteer;
}

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
    return (
        <article className="px-8 py-8 border-2 border-sky-500 rounded-lg">
            <div className="flex justify-center">
                <h2 className="text-[#0620F6] text-2xl font-bold capitalize py-6 px-16">
                    {volunteer.job_title}
                </h2>
            </div>
            <div className="flex justify-between">
                <ul className="flex flex-col items-center gap-2 ml-auto">
                    <li className="text-lg">{volunteer.name}</li>
                    <li className="text-lg">{volunteer.email}</li>
                    <li className="text-lg">
                        <span dir="ltr">{volunteer.whatsapp_num}</span>
                    </li>
                    <li className="text-lg">
                        {hebrewStatusesMap[volunteer.status]}
                    </li>
                    {volunteer.linkedin_profile?.length > 1 && (
                        <li>
                            <Button variant="link" size="icon">
                                <a
                                    href={volunteer.linkedin_profile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Linkedin className="h-8 w-8" />
                                </a>
                            </Button>
                        </li>
                    )}
                </ul>

                <div className="flex flex-col max-w-sm gap-8">
                    <div className="flex flex-col text-lg">
                        <div className="font-bold">{`כישורים`}</div>
                        <ul>
                            {volunteer.skills.map((s) => (
                                <li key={s.id}>{s.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col text-lg col-span-2 mr-auto">
                        <div className="font-bold">{`יכול לעזור ב`}</div>
                        <div>{volunteer.can_help_with}</div>
                    </div>
                </div>
            </div>
        </article>
    );
}
