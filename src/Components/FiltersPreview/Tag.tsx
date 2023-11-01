import { X } from './X';
import { Skill } from '../../utils/types';
import { Badge } from '../common/badge';

interface TagProps {
    skill: Skill;
    onRemove: (skill: Skill) => void;
}

export function Tag({ skill, onRemove }: TagProps) {
    return (
        <div className="relative">
            <div className="absolute top-0 right-2 flex h-full items-center">
                <X
                    className="hover:cursor-pointer"
                    onClick={() => onRemove(skill)}
                />
            </div>
            <Badge
                key={skill.id}
                className="py-4 px-10 bg-[#E7E7E7] hover:bg-[#E7E7E7] text-[#868686] rounded-md"
            >
                {skill.name}
            </Badge>
        </div>
    );
}
