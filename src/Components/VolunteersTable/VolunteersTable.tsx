import { ColumnDef, Row } from '@tanstack/react-table';
import { Status, Volunteer } from '../../utils/types';
import { DataTable } from '../common/DataTable/DataTable';
import { VolunteerCard } from './VolunteerCard';
import { hebrewStatusesMap } from '../../utils/statusStringsMap';

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
    { accessorKey: 'job_title', header: 'תפקיד' },
    {
        accessorKey: 'status',
        header: 'מאומת',
        cell: (c) => <span>{hebrewStatusesMap[c.getValue() as Status]}</span>,
    },
];

interface VolunteersTableProps {
    volunteers: Volunteer[];
}

const renderSubComponent = ({ row }: { row: Row<Volunteer> }) => {
    return (
        <div className="px-28">
            <VolunteerCard volunteer={row.original} />
        </div>
    );
};

export function VolunteersTable({ volunteers }: VolunteersTableProps) {
    return (
        <DataTable
            columns={columns}
            data={volunteers}
            getRowCanExpand={() => true}
            renderSubComponent={renderSubComponent}
        />
    );
}
