import {
  DataGrid,
  GridColDef,
  GridRowSpacingParams,
  GridValueGetterParams,
  GridAlignment,
} from '@mui/x-data-grid';
import { Status, Volunteer } from '../../utils/types';
import { useCallback } from 'react';

interface Props {
  volunteers: Volunteer[];
}

const DEFAULT_COLUMN_SETTINGS = {
  headerClassName: 'super-column',
  headerAlign: 'center' as GridAlignment,
};

const hebrewStatusesMap = {
  [Status.NOT_PROCESSED]: 'לא מעובד',
  [Status.AUTHORIZED]: 'מאושר',
  [Status.SUSPICIOUS]: 'חשוד',
  [Status.MESSAGE_SENT]: 'הודעה נשלחה',
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'שם', width: 200 },
  { field: 'whatsapp_num', headerName: 'טלפון', width: 180 },
  { field: 'email', headerName: 'אימייל', width: 220 },
  { field: 'job_title', headerName: 'תפקיד', width: 220 },
  {
    field: 'status',
    headerName: 'מאומת',
    width: 107,
    valueGetter: (params: GridValueGetterParams) =>
      hebrewStatusesMap[params.row.status as keyof typeof hebrewStatusesMap],
  },
  { field: 'linkedin_profile', headerName: 'קישור', width: 102 },
  { field: 'can_help_with', headerName: 'יכול לעזור ב', width: 180 },
];

const VolunteersTable = ({ volunteers }: Props) => {
  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      bottom: params.isLastVisible ? 0 : 30,
    };
  }, []);

  return volunteers?.length > 0 ? (
    <div dir="rtl" style={{ height: '750px' }}>
      <DataGrid
        rows={volunteers}
        columns={columns.map((c) => ({ ...c, ...DEFAULT_COLUMN_SETTINGS }))}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        rowSelection={true}
        pageSizeOptions={[5, 10, 25]}
        getRowClassName={() => `super-row`}
        getRowSpacing={getRowSpacing}
        showColumnVerticalBorder
        sx={{
          '&, [class^=MuiDataGrid-cell]': {
            border: 'none',
            justifyContent: 'center',
          },
          '--unstable_DataGrid-headWeight': 600,
        }}
      />
    </div>
  ) : null;
};

export default VolunteersTable;
