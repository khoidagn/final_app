/**
 * Formats an ISO date string into a display format: HH:MM DD/MM/YYYY
 * @param dateString ISO date string received from the Backend
 * @returns Formatted date string or "N/A" if invalid
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'N/A';
  }
}