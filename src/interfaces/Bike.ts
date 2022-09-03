type rating = {
    rating: 1 | 2 | 3 | 4 |5,
    reservationId: string
};
interface Bike {
    id?: string,
    model: string,
    location: string,
    available: boolean,
    ratings: rating[],
    color: string,
    isDeleted?: boolean
}

export default Bike;