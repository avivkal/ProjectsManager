import { ColumnDef } from '@tanstack/react-table';
import { Status, Volunteer } from '../../utils/types';
import { DataTable } from '../common/DataTable/DataTable';
import { Button } from '../common/button';
import { Linkedin } from 'lucide-react';

const hebrewStatusesMap = {
    [Status.NOT_PROCESSED]: 'לא מעובד',
    [Status.AUTHORIZED]: 'מאושר',
    [Status.SUSPICIOUS]: 'חשוד',
    [Status.MESSAGE_SENT]: 'הודעה נשלחה',
};

const columns: ColumnDef<Volunteer>[] = [
    {
        accessorKey: 'name',
        header: 'שם',
    },
    {
        accessorKey: 'whatsapp_num',
        header: 'טלפון',
        cell: (c) => <span dir="ltr">{c.getValue() as string}</span>,
    },
    {
        accessorKey: 'email',
        header: 'אימייל',
    },
    {
        accessorKey: 'status',
        header: 'מאומת',
        cell: (c) => (
            <span>
                {
                    hebrewStatusesMap[
                        c.getValue() as keyof typeof hebrewStatusesMap
                    ]
                }
            </span>
        ),
    },
    { accessorKey: 'job_title', header: 'תפקיד' },
    {
        accessorKey: 'linkedin_profile',
        header: 'קישור',
        cell: (c) => (
            <span>
                <Button variant="link" size="icon">
                    <Button asChild>
                        <a
                            href={c.getValue() as string}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </Button>
                </Button>
            </span>
        ),
    },
    {
        accessorKey: 'can_help_with',
        header: 'יכול לעזור ב',

        cell: (c) => (
            <span className="truncate max-w-md">{c.getValue() as string}</span>
        ),
    },
];

interface VolunteersTableProps {
    volunteers: Volunteer[];
}

export function VolunteersTable({ volunteers }: VolunteersTableProps) {
    return <DataTable columns={columns} data={volunteers} />;
}
