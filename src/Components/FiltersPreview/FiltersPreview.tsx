import { Skill } from '../../utils/types';
import { Tag } from './Tag';

interface FiltersPreviewProps {
    skills: Skill[];
    onSkillRemove: (skill: Skill) => void;
    keyword: string;
}

export function FiltersPreview({
    skills,
    onSkillRemove,
    keyword,
}: FiltersPreviewProps) {
    return (
        <div dir="rtl" className="flex flex-col mt-8 gap-6">
            <div className="grid grid-cols-[200px_auto] items-center">
                <div>{`כישורים:`}</div>
                <ul className="flex gap-3 flex-wrap">
                    {skills.map((s) => (
                        <Tag key={s.id} skill={s} onRemove={onSkillRemove} />
                    ))}
                </ul>
            </div>
            <div className="grid grid-cols-[200px_auto] items-center mb-8">
                <div>{`מילות חיפוש:`}</div>
                <div>{keyword}</div>
            </div>
        </div>
    );
}
