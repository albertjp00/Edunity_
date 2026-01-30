import { IAdminCourseService, PurchaseResult } from "../../interfaces/adminInterfaces";
import { IUserRepository } from "../../interfaces/userInterfaces";
import { ICategory } from "../../models/category";
import { IInstructor } from "../../models/instructor";
import { IAdminRepository } from "../../repositories/adminRepositories";
import { IInsRepository } from "../../repositories/instructorRepository";
import PDFDocument from "pdfkit";
import { once } from "events";
import { mapAdminCourseDetailsToDTO, mapCategoryDto, mapCourseToDTO, mapPurchaseToDTO, mapReportDto } from "../../mapper/admin.mapper";
import { AdminPurchaseService, CategoryDTO, PurchaseAdminDTO, ReportDTO } from "../../dto/adminDTO";
import { IReport } from "../../models/report";

export class AdminCourseService implements IAdminCourseService {
  constructor(
    private adminRepository: IAdminRepository,
    private instructorRepository: IInsRepository,
    private userRepository: IUserRepository,
  ) {}

  getInstructorsRequest = async (id: string): Promise<IInstructor | null> => {
    try {
      const result = await this.instructorRepository.findById(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getCoursesRequest = async (page: number, search: string, limit: number) => {
    try {
      const skip = (page - 1) * limit;

      const query: any = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { instructorName: { $regex: search, $options: "i" } },
        ];
      }

      const courses =
        (await this.userRepository.getAllCourses(query, skip, limit, {
          createdAt: -1,
        })) || [];


      const totalCourses = await this.userRepository.countCourses();

      const courseDTOs = (courses ?? []).map(mapCourseToDTO);

      return {
        courses : courseDTOs,
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: page,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getCourseDetailsRequest = async (courseId: string) => {
    try {
      const details = await this.adminRepository.getFullCourseDetails(courseId);
      console.log('details',details);
      // const dto = await mapAdminCourseDetailsToDTO(details)
      

      return details;
    } catch (err) {
      console.error("Error fetching course details:", err);
      return null;
    }
  };

  getQuizRequest = async (courseId: string) => {
    try {
      const details = await this.adminRepository.getQuiz(courseId);
      console.log(details);
      
      return details;

    } catch (err) {
      console.error("Error fetching    course details:", err);
      throw err;
    }
  };

  getPurchaseDetails = async (search: string, page: number):Promise<AdminPurchaseService | null | undefined> => {
    try {
      const data = await this.adminRepository.getPurchases(search, page);
      console.log('purchase',data);
        const dtoPurchase = data?.purchases.map(mapPurchaseToDTO)
        console.log('dto',dtoPurchase);
        
      
    //   return {...data , purchases : dtoPurchase}
    return data
    } catch (error) {
      console.log(error);
      throw error
    }
  };

  generatePurchasesPDF = async (purchases: any[]): Promise<Buffer> => {
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    doc.fontSize(18).text("Purchase Report", { align: "center" });
    doc.moveDown(2);

    doc
      .fontSize(10)
      .text("User | Email | Course | Price | Paid | Status | Date", {
        underline: true,
      });
    doc.moveDown(1);

    purchases.forEach((p, index) => {
      doc
        .fontSize(9)
        .text(
          `${index + 1}. ${p.userName} | ${p.userEmail} | ${p.courseTitle} | ₹${p.coursePrice} | ₹${p.amountPaid} | ${p.paymentStatus} | ${new Date(
            p.createdAt,
          ).toLocaleDateString()}`,
        )
        .moveDown(0.5);
    });
    doc.end();

    await once(doc, "end");

    return Buffer.concat(chunks);
  };

  
  addCategoryRequest = async (
    category: string,
    skills: string[],
  ): Promise<ICategory | null> => {
    try {
      const data = await this.adminRepository.addCategory(category, skills);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getCategoryRequest = async (): Promise<CategoryDTO[] | null> => {
    try {
      const data = await this.adminRepository.getCategory();

      console.log('category',data);

      const category = data?.map(mapCategoryDto)
        if(!category) return null

      return category;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteCategoryRequest = async (category: string) => {
    try {
      await this.adminRepository.deleteCategory(category);

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  blockCourseRequest = async (courseId: string) => {
    try {
      const data = await this.adminRepository.blockCourse(courseId);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getReportsRequest = async (): Promise<ReportDTO[] | null> => {
    try {
      const data = await this.adminRepository.getReports();
      const report = data?.map(mapReportDto)!
      return report;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
