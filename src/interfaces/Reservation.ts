interface Reservation {
    id?: string,
    uid: string,
   email: string,
   startTime: Date,
   endTime: Date,
   cancelled?: boolean
}

export default Reservation;