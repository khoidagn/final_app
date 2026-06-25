import { useState, useEffect } from 'react';
import { adminService, type PaginatedResponse } from '../services/admin.service';

interface UseAdminPaginationProps {
  endpoint: string;       
  itemsPerPage: number;  
}

export function useAdminPagination<T>({ endpoint, itemsPerPage }: UseAdminPaginationProps) {
  const [dataList, setDataList] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    adminService.getPaginatedData<T>(endpoint, currentPage, itemsPerPage)
      .then((resData) => {
        if (!isMounted) return;

        if (resData && typeof resData === 'object' && 'data' in resData && Array.isArray(resData.data)) {
          const paginated = resData as PaginatedResponse<T>;
          setDataList(paginated.data);
          setTotalCount(paginated.items);
        } 
        else if (Array.isArray(resData)) {
          setDataList(resData);
          setTotalCount(resData.length);
        } 
        else {
          console.error(`Cấu trúc API lạ tại endpoint ${endpoint}:`, resData);
          setDataList([]);
          setTotalCount(0);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(`Lỗi xử lý tại hook dùng cho endpoint ${endpoint}:`, err);
        setDataList([]);
        setTotalCount(0);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false; 
    };
  }, [currentPage, endpoint, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return {
    dataList,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading
  };
}