import { prisma } from '../database';
import { Job, JobStage, Prisma } from '../generated/prisma';

export class JobRepository {
  async create(data: Prisma.JobCreateInput): Promise<Job> {
    return prisma.job.create({
      data,
      include: {
        contacts: true,
        interviews: true,
      },
    });
  }

  async findAll(): Promise<Job[]> {
    return prisma.job.findMany({
      include: {
        contacts: true,
        interviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id },
      include: {
        contacts: true,
        interviews: true,
      },
    });
  }

  async update(id: string, data: Prisma.JobUpdateInput): Promise<Job> {
    return prisma.job.update({
      where: { id },
      data,
      include: {
        contacts: true,
        interviews: true,
      },
    });
  }

  async delete(id: string): Promise<Job> {
    return prisma.job.delete({
      where: { id },
    });
  }

  async findByStage(stage: JobStage): Promise<Job[]> {
    return prisma.job.findMany({
      where: { currentStage: stage },
      include: {
        contacts: true,
        interviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStats() {
    const totalJobs = await prisma.job.count();
    const jobsByStage = await prisma.job.groupBy({
      by: ['currentStage'],
      _count: true,
    });

    return {
      totalJobs,
      jobsByStage: jobsByStage.reduce((acc, item) => {
        acc[item.currentStage] = item._count;
        return acc;
      }, {} as Record<JobStage, number>),
    };
  }
} 