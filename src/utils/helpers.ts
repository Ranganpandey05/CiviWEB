export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const handleApiError = (error: any): string => {
    if (error.response) {
        return error.response.data.message || 'An error occurred';
    }
    return 'Network error, please try again later';
};

export const isEmptyObject = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};