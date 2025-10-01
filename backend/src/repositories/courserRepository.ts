import { IUserRepository } from "../interfaces/userInterfaces";
import { CourseModel, ICourse } from "../models/course";
import { BaseCourseRepository } from "./baseRepository";
import { ISkills } from "./instructorRepository";



export interface ICourseRepository {

    getCourse(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

    countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number, sortOption: any): Promise<ICourse[] | null>
}



export class CourseRepository
extends BaseCourseRepository<ICourse>
implements ICourseRepository {

    constructor(){
        super(CourseModel)
    }

    //User side course changes / updates -----------------------

      async getCourse(id: string): Promise<ICourse | null> {
        return await this.model.findById(id)
      }
    
      async buyCourse(id: string): Promise<ICourse | null> {
        return await this.model.findByIdAndUpdate(id, { $inc: { totalEnrolled: 1 } })
      }

        async getCourses(skip: number, limit: number) {
          return this.model.aggregate([
            { $skip: skip },
            { $limit: limit },
            {
              $addFields: {
                instructorIdObj: { $toObjectId: "$instructorId" }
              }
            },
            {
              $lookup: {
                from: "instructors",
                localField: "instructorIdObj",
                foreignField: "_id",
                as: "instructor",
              },
            },
            { $unwind: "$instructor" },
            {
              $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                price: 1,
                skills: 1,
                level: 1,
                totalEnrolled: 1,
                category: 1,
                createdAt: 1,
                instructorName: "$instructor.name",
                instructorImage: "$instructor.profileImage",
              },
            },
          ]);
        }
      

          async countCourses(): Promise<number> {
            return await this.model.countDocuments();
          }
        
        
        



           async findSkills(): Promise<ISkills> {
              const result = await this.model.aggregate([
                { $unwind: "$skills" },
                { $group: { _id: null, uniqueSkills: { $addToSet: "$skills" } } },
                { $project: { _id: 0, uniqueSkills: 1 } }
              ])
          
              return result[0]
            }
          
            async getAllCourses(
              query: any,
              skip: number,
              limit: number,
              sortOption?: any
            ): Promise<ICourse[]> {
              const pipeline: any[] = [
                { $match: query },
              ];
          
              // Add sort stage only if sortOption exists
              if (sortOption && Object.keys(sortOption).length > 0) {
                pipeline.push({ $sort: sortOption });
              }
          
              pipeline.push(
                { $skip: skip },
                { $limit: limit },
                {
                  $addFields: {
                    instructorIdObj: { $toObjectId: "$instructorId" },
                    moduleCount: { $size: { $ifNull: ["$modules", []] } }
                  }
                },
                {
                  $lookup: {
                    from: "instructors",
                    localField: "instructorIdObj",
                    foreignField: "_id",
                    as: "instructor",
                  },
                },
                { $unwind: "$instructor" },
                {
                  $project: {
                    title: 1,
                    description: 1,
                    thumbnail: 1,
                    price: 1,
                    skills: 1,
                    level: 1,
                    totalEnrolled: 1,
                    category: 1,
                    createdAt: 1,
                    instructorName: "$instructor.name",
                    instructorImage: "$instructor.profileImage",
                    moduleCount: 1,
                  },
                }
              );
          
              return await this.model.aggregate(pipeline);
            }
          
          
          
          
            async countAllCourses(query: any): Promise<number> {
              return this.model.countDocuments(query);
            }
          

}