import { useCallback } from 'react';
import { apiService } from '../services/api/apiSerivce';
import { ReportSubmissionData } from '../services/types/apiTypes';
import {  useApi } from './useApi';
import { useApiMutation } from './useApiMutation';
// Submit report hook
export function useSubmitReport() {
  return useApiMutation(
    (reportData: ReportSubmissionData) => apiService.submitReport(reportData),
    {
      onSuccess: (result) => {
        console.log('Report submitted successfully:', result);
      },
      onError: (error) => {
        console.error('Report submission failed:', error);
      },
    }
  );
}

// Get reports list hook
export function useReports(filters: any = {}) {
  const apiCall = useCallback(() => apiService.getReports(filters), [filters]);
  
  return useApi(
    apiCall,
    [JSON.stringify(filters)], // Re-fetch when filters change
    {
      onError: (error) => {
        console.error('Failed to fetch reports:', error);
      },
    }
  );
}

// Get single report hook
export function useReport(reportId: number | null) {
  const apiCall = useCallback(() => {
    if (!reportId) throw new Error('Report ID is required');
    return apiService.getReportDetails(reportId);
  }, [reportId]);

  return useApi(
    apiCall,
    [reportId],
    {
      immediate: !!reportId, // Only fetch if reportId is provided
    }
  );
}

// Get incident statistics hook
export function useIncidentStats(params: any = {}) {
  const apiCall = useCallback(() => apiService.getIncidentStats(params), [params]);
  
  return useApi(
    apiCall,
    [JSON.stringify(params)],
    {
      onError: (error) => {
        console.error('Failed to fetch incident stats:', error);
      },
    }
  );
}

// Update report status hook (for admin use)
export function useUpdateReportStatus() {
  return useApiMutation(
    ({ reportId, updates }: { reportId: number; updates: any }) =>
      apiService.updateReportStatus(reportId, updates),
    {
      onSuccess: (result) => {
        console.log('Report status updated:', result);
      },
    }
  );
}