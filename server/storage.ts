import { db } from "./db";
import { assessments, type Assessment, type InsertAssessment } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getAssessments(limit?: number, offset?: number): Promise<Assessment[]>;

  createAssessment(assessment: InsertAssessment & { 
    riskScore: string, 
    riskCategory: string, 
    factors: any,
    confidenceInterval?: string,
    modelConfidence?: string 
  }): Promise<Assessment>;
}

export class DatabaseStorage implements IStorage {
  async getAssessments(
    limit: number = 50,
    offset: number = 0
  ): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .orderBy(desc(assessments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createAssessment(assessment: InsertAssessment & { 
    riskScore: string, 
    riskCategory: string, 
    factors: any,
    confidenceInterval?: string,
    modelConfidence?: string 
  }): Promise<Assessment> {
    const [created] = await db.insert(assessments).values(assessment).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
