import {
  DataGrid,
  GridColDef,
  GridRowSpacingParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import { Status, Volunteer } from '../../utils/types'
import { useCallback } from 'react'

interface Props {
  volunteers: Volunteer[]
}

const hebrewStatusesMap = {
  [Status.NOT_PROCESSED]: 'לא מעובד',
  [Status.AUTHORIZED]: 'מאושר',
  [Status.SUSPICIOUS]: 'חשוד',
  [Status.MESSAGE_SENT]: 'הודעה נשלחה',
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'job_title', headerName: 'Job Title', width: 200 },
  { field: 'can_help_with', headerName: 'Can Help With', width: 300 },
  { field: 'whatsapp_num', headerName: 'Phone Number', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'linkedin_profile', headerName: 'Linkedin Profile', width: 200 },
  { field: 'comments', headerName: 'Comments', width: 130 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    valueGetter: (params: GridValueGetterParams) =>
      hebrewStatusesMap[params.row.status as keyof typeof hebrewStatusesMap],
  },
  {
    field: 'is_student',
    headerName: 'Is Student',
    width: 130,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.is_student ? 'כן' : 'לא',
  },
]

const VolunteersTable = ({ volunteers }: Props) => {
  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      bottom: params.isLastVisible ? 0 : 30,
    }
  }, [])

  return volunteers?.length > 0 ? (
    <div>
      <DataGrid
        rows={volunteers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        rowSelection={true}
        pageSizeOptions={[5, 10, 25]}
        getRowClassName={() => `super-row`}
        getRowSpacing={getRowSpacing}
        sx={{
          '&, [class^=MuiDataGrid-cell]': { border: 'none' },
        }}
      />
    </div>
  ) : null
}

export default VolunteersTable
