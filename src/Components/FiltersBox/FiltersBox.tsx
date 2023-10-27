import { Dispatch, SetStateAction } from 'react';
import { Button } from '../common/button';
import { Popover, PopoverContent, PopoverTrigger } from '../common/popover';
import { Toggle } from '../Toggle/Toggle';
import { cn } from '../../utils/utils';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Skill } from '../../utils/types';

type YesNoFilter = {
    type: 'YesNo';
    title: string;
    isActive: boolean;
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
    onOpenChange: (open: boolean) => void;
};

type SkillsFilter = {
    type: 'Skills';
    title: string;
    isActive: boolean;
    value: Skill[];
    setValue: Dispatch<SetStateAction<Skill[]>>;
    allSkills: Skill[];
    onOpenChange: (open: boolean) => void;
};

type Filter = YesNoFilter | SkillsFilter;

interface FiltersBoxProps {
    filters: Filter[];
}

export function FiltersBox({ filters }: FiltersBoxProps) {
    return (
        <div
            dir="rtl"
            className="grid grid-flow-col auto-cols-auto p-4 rounded-xl bg-[#00F3DB]"
        >
            <ul className="flex justify-center gap-2">
                {filters.map((filter) => (
                    <li key={filter.title}>
                        <Popover onOpenChange={filter?.onOpenChange}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="hover:bg-inherit"
                                >
                                    <span
                                        className={cn(
                                            filter.isActive &&
                                                'text-[#0620F6] font-bold'
                                        )}
                                    >
                                        {filter.title}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                {filter.type === 'YesNo' && (
                                    <Toggle
                                        options={[
                                            {
                                                value: true,
                                                title: 'כן',
                                            },
                                            {
                                                value: false,
                                                title: 'לא',
                                            },
                                        ]}
                                        value={filter.value}
                                        onChange={filter.setValue}
                                    />
                                )}
                                {filter.type == 'Skills' && (
                                    <Autocomplete
                                        id="skills"
                                        multiple
                                        disableCloseOnSelect
                                        value={filter.value}
                                        onChange={(_, newValue) => {
                                            filter.setValue(newValue);
                                        }}
                                        options={filter.allSkills}
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
                                )}
                            </PopoverContent>
                        </Popover>
                    </li>
                ))}
            </ul>
        </div>
    );
}
