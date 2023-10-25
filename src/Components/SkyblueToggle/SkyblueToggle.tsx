import { cn } from '../../utils/utils';

interface SkyblueToggleProps {
    options: {
        value: boolean;
        title: string;
    }[];
    value: boolean;
    onChange: (newVal: boolean) => void;
}

export function SkyblueToggle({
    options,
    value,
    onChange,
}: SkyblueToggleProps) {
    return (
        <div className="flex rounded-full bg-[#D9D9D9] text-[#4A5061] font-bold">
            {options.map((option) => {
                const valueAsString = String(option.value);
                return (
                    <div
                        key={option.title}
                        className={cn(
                            'rounded-full flex-1 text-center',
                            value === option.value &&
                                'text-blue-600 bg-gradient-to-r from-[#00F3EE] to-[#06B8FD]'
                        )}
                    >
                        <input
                            type="radio"
                            id={valueAsString}
                            name={valueAsString}
                            value={valueAsString}
                            checked={option.value === value}
                            className="h-0 absolute"
                            onChange={(e) =>
                                onChange(e.currentTarget.value === 'true')
                            }
                        />
                        <label
                            className="block h-full p-4"
                            htmlFor={valueAsString}
                        >
                            <div>{option.title}</div>
                        </label>
                    </div>
                );
            })}
        </div>
    );
}
