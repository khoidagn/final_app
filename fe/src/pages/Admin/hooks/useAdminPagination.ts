import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../../services/admin.service';
import { ADMIN_CONSTANTS } from '../../../constants/admin.constant';
import { getBackendMessage } from '../../../utils/error';
import type { PaginatedData } from '../../../types/common.type';

interface UseAdminPaginationProps {
  endpoint: string;
  uiItemsPerPage?: number;
  bePagesPerBatch?: number;
}

export function useAdminPagination<T>({
  endpoint,
  uiItemsPerPage = 10,
  bePagesPerBatch = 3,
}: UseAdminPaginationProps) {
  const [allFetchedData, setAllFetchedData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const beLimitPerRequest = uiItemsPerPage * bePagesPerBatch;

  const startIndex = (currentPage - 1) * uiItemsPerPage;
  const endIndex = startIndex + uiItemsPerPage;
  const dataList = allFetchedData.slice(startIndex, endIndex);

  const hasDataInCache =
    allFetchedData.length > startIndex &&
    allFetchedData[startIndex] !== undefined;

  useEffect(() => {
    if (hasDataInCache) {
      Promise.resolve().then(() => setIsLoading(false));
      return;
    }

    let isMounted = true;
    const targetBePage = Math.floor((currentPage - 1) / bePagesPerBatch) + 1;

    Promise.resolve().then(() => {
      if (isMounted) {
        setIsLoading(true);
      }
    });

    adminService
      .getPaginatedData<T>(endpoint, targetBePage, beLimitPerRequest)
      .then((resData: PaginatedData<T>) => {
        if (!isMounted) return;

        if (resData && Array.isArray(resData.items)) {
          const newBatchData = resData.items;
          setTotalCount(resData.meta.total);

          setAllFetchedData((prev) => {
            const updatedCache = [...prev];
            const insertStartIndex = (targetBePage - 1) * beLimitPerRequest;

            for (let i = 0; i < newBatchData.length; i++) {
              updatedCache[insertStartIndex + i] = newBatchData[i];
            }
            return updatedCache;
          });
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        toast.error(
          getBackendMessage(
            err,
            ADMIN_CONSTANTS.API_RESPONSE.FETCH_PAGINATED_FAILED(endpoint)
          )
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    endpoint,
    beLimitPerRequest,
    bePagesPerBatch,
    hasDataInCache,
  ]);

  const totalPages = Math.ceil(totalCount / uiItemsPerPage) || 1;

  return {
    dataList,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    resetCache: () => {
      setAllFetchedData([]);
      setIsLoading(true);
    },
  };
}
