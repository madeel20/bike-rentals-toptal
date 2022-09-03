interface Reservation {
    id?: string,
    uid: string,
   email: string,
   startTime: { seconds: number} , 
   endTime: { seconds: number},
   cancelled?: boolean,
   bikeId: string,
   model?: string
   rating?: number
}

export default Reservation;