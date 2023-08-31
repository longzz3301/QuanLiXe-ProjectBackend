
export interface GetStatus {
    WAIT: string ,
    APPROVED : string ,
    CANCEL : string ,
    BOOKED : string ,
    COMPLETE:string 

}


// const getStatus : GetStatus = {  

//     "WAIT" : "WAIT_FOR_APPROVE" , 
//     "APPROVED" : "APPROVED" ,
//     "CANCEL" : "CANCEL_FORM" ,
//     "BOOKED" : "BOOKED" ,
//     "COMPLETE" : "COMPLETE_FORM"



// }

export const enum FormStatus {
    WAIT = 'WAIT_FOR_APPROVE',
    APPROVED = "APPROVED" ,
    CANCEL = "CANCEL_FORM" ,
    BOOKED = "BOOKED_FORM" ,
    COMPLETE ="COMPLETE_FORM"
}



export const enum DriverStatus {
    READY = "READY_FOR_DRIVE" ,
    BUSY = "DRIVING " ,
    DONE = "MISSION_COMPLETE"
}

// export const enum {
    
// }