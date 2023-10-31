import { Dispatch, SetStateAction } from 'react';
import { Button } from '../common/button';
import { Popover, PopoverContent, PopoverTrigger } from '../common/popover';
import { cn } from '../../utils/utils';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Skill } from '../../utils/types';

interface BaseFilter {
    title: string;
    isActive: boolean;
}

interface VerifiedFilter extends BaseFilter {
    type: 'Verified';
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
}

interface WorkingFilter extends BaseFilter {
    type: 'Working';
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
}

interface SkillsFilter extends BaseFilter {
    type: 'Skills';
    value: Skill[];
    setValue: Dispatch<SetStateAction<Skill[]>>;
    allSkills: Skill[];
}

interface KeywordFilter extends BaseFilter {
    type: 'Keyword';
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}

export type Filter =
    | VerifiedFilter
    | WorkingFilter
    | SkillsFilter
    | KeywordFilter;

interface FiltersBoxProps {
    filters: Filter[];
}

const TEXT_STYLE = `text-[#0620F6] font-bold`;

const isPopoverFilter = (type: Filter['type']) =>
    ['Skills', 'Keyword'].includes(type);

export function FiltersBox({ filters }: FiltersBoxProps) {
    return (
        <div
            dir="rtl"
            className="grid grid-flow-col auto-cols-auto p-4 rounded-xl bg-[#00F3DB]"
        >
            <ul className="flex justify-center gap-2">
                {filters.map((filter) => (
                    <li key={filter.title}>
                        {!isPopoverFilter(filter.type) && (
                            <Button
                                variant="ghost"
                                className="hover:bg-inherit"
                                onClick={() => {
                                    (
                                        filter as VerifiedFilter | WorkingFilter
                                    ).setValue(!filter.value);
                                }}
                            >
                                <span
                                    className={cn(
                                        filter.isActive && TEXT_STYLE
                                    )}
                                >
                                    {filter.title}
                                </span>
                            </Button>
                        )}
                        {isPopoverFilter(filter.type) && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="hover:bg-inherit"
                                    >
                                        <span
                                            className={cn(
                                                filter.isActive && TEXT_STYLE
                                            )}
                                        >
                                            {filter.title}
                                        </span>
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className={cn(
                                        filter.type === 'Skills'
                                            ? 'w-[55vh]'
                                            : 'w-80'
                                    )}
                                >
                                    {filter.type === 'Skills' && (
                                        <div className="flex justify-center">
                                            <Autocomplete
                                                id="skills"
                                                multiple
                                                disableCloseOnSelect
                                                value={filter.value}
                                                onChange={(_, newValue) => {
                                                    filter.setValue(newValue);
                                                }}
                                                options={filter.allSkills}
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                renderOption={(
                                                    props,
                                                    option
                                                ) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={
                                                                <CheckBoxOutlineBlankIcon fontSize="small" />
                                                            }
                                                            checkedIcon={
                                                                <CheckBoxIcon fontSize="small" />
                                                            }
                                                            style={{
                                                                marginRight: 8,
                                                            }}
                                                            checked={
                                                                !!filter.value.find(
                                                                    (curr) =>
                                                                        curr.id ===
                                                                        option.id
                                                                )
                                                            }
                                                        />
                                                        {option.name}
                                                    </li>
                                                )}
                                                style={{ width: 400 }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Skills"
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}
                                    {filter.type === 'Keyword' && (
                                        <div className="flex justify-center">
                                            <TextField
                                                id="keyword"
                                                label="Keywords"
                                                variant="standard"
                                                style={{
                                                    height: 'fit-content',
                                                }}
                                                value={filter.value}
                                                onChange={(e) => {
                                                    filter.setValue(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
