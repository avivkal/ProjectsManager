interface XProps extends React.HTMLAttributes<SVGElement> {}

export function X({ className, onClick }: XProps) {
    return (
        <svg
            className={className}
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            fill="none"
        >
            <path
                stroke="url(#a)"
                stroke-linecap="round"
                stroke-width="4.119"
                d="M18.45 5.908 5.876 17.351"
            />
            <path
                stroke="url(#b)"
                stroke-linecap="round"
                stroke-width="4.043"
                d="M17.852 18.622 6.409 6.05"
            />
            <defs>
                <linearGradient
                    id="a"
                    x1="17.776"
                    x2="5.204"
                    y1="5.169"
                    y2="16.611"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#00F3DB" />
                    <stop offset=".974" stop-color="#06B8FD" />
                </linearGradient>
                <linearGradient
                    id="b"
                    x1="18.591"
                    x2="7.149"
                    y1="17.949"
                    y2="5.376"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#00F3DB" />
                    <stop offset=".974" stop-color="#06B8FD" />
                </linearGradient>
            </defs>
        </svg>
    );
}
