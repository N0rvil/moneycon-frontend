export const euDate = (d) => {
    const date = new Date(parseInt(d));
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${day}.${month+1}.${year}`;
}