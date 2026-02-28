export interface ListMeta {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  lastPage?: number;
  totalItems: number;
  page: number;
}

export interface QueryResponse<DataType> {
  IsSuccess: boolean;
  message: string;
  data: DataType;
  meta: ListMeta;
}
