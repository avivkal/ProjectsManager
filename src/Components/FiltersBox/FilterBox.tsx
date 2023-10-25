import { Dispatch, SetStateAction } from 'react';
import { Button } from '../common/button';
import { Popover, PopoverContent, PopoverTrigger } from '../common/popover';
import { SkyblueToggle } from '../SkyblueToggle/SkyblueToggle';
import { cn } from '../../utils/utils';

type VerifiedFilter = {
    type: 'verified';
    title: string;
    isActive: boolean;
    isVerified: boolean;
    setIsVerified: Dispatch<SetStateAction<boolean>>;
    onOpenChange?: (open: boolean) => void;
};

type Filter = VerifiedFilter;

interface FiltersBoxProps {
    filters: Filter[];
    cleanFilters: () => void;
}

export function FiltersBox({ filters, cleanFilters }: FiltersBoxProps) {
    return (
        <div
            dir="rtl"
            className="grid grid-flow-col auto-cols-auto p-4 rounded-xl bg-[#00F3DB]"
        >
            <ul className="text-center">
                {filters.map((filter) => (
                    <li key={filter.title}>
                        {filter.type === 'verified' && (
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
                                    <SkyblueToggle
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
                                        value={filter.isVerified}
                                        onChange={filter.setIsVerified}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </li>
                ))}
            </ul>
            <Button
                variant="ghost"
                className="hover:bg-inherit"
                onClick={() => cleanFilters()}
            >
                {`נקה פילטרים`}
            </Button>
        </div>
    );
}
