export default class Helper {
    
    public static getCurrentDate() : string{
        const today = new Date();

        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const dd = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        console.log(formattedDate); // e.g., "2025-07-10"

        return formattedDate;
    }

    public static toTime(date) : string{
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    public static toHHmm(date) : string{
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}