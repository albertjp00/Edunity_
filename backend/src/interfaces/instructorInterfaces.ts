import { IEvent } from "../models/events.js";
import { IInstructor } from "../models/instructor.js";



export interface IMyEventInterface{
    events:IEvent[] | null,
    instructor: IInstructor | null
}