import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
    getExpandedRowModel,
    getPaginationRowModel,
    Row,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../common/table';
import { DataTablePagination } from './DataTablePagination';
import { Fragment } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    getRowCanExpand?: (row: Row<TData>) => boolean;
    renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    getRowCanExpand,
    renderSubComponent,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getRowCanExpand,
        getExpandedRowModel: getExpandedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <>
            <div dir="rtl">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow
                                        onClick={() => {
                                            row.toggleExpanded();
                                        }}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow className="hover:bg-inherit">
                                            <TableCell
                                                className="border-none"
                                                colSpan={
                                                    row.getVisibleCells().length
                                                }
                                            >
                                                {renderSubComponent?.({ row })}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {`אין תוצאות`}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    );
}
