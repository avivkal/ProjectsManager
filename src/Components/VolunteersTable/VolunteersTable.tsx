import { ColumnDef } from '@tanstack/react-table';
import { Status, Volunteer } from '../../utils/types';
import { DataTable } from '../common/DataTable/DataTable';

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
    { accessorKey: 'linkedin_profile', header: 'קישור' },
    { accessorKey: 'can_help_with', header: 'יכול לעזור ב' },
];

interface VolunteersTableProps {
    volunteers: Volunteer[];
}

export function VolunteersTable({ volunteers }: VolunteersTableProps) {
    return <DataTable columns={columns} data={volunteers} />;
}
