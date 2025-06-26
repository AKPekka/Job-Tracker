"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const database_1 = require("../database");
class JobRepository {
    async create(data) {
        return database_1.prisma.job.create({
            data,
            include: {
                contacts: true,
                interviews: true,
            },
        });
    }
    async findAll() {
        return database_1.prisma.job.findMany({
            include: {
                contacts: true,
                interviews: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findById(id) {
        return database_1.prisma.job.findUnique({
            where: { id },
            include: {
                contacts: true,
                interviews: true,
            },
        });
    }
    async update(id, data) {
        return database_1.prisma.job.update({
            where: { id },
            data,
            include: {
                contacts: true,
                interviews: true,
            },
        });
    }
    async delete(id) {
        return database_1.prisma.job.delete({
            where: { id },
        });
    }
    async findByStage(stage) {
        return database_1.prisma.job.findMany({
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
        const totalJobs = await database_1.prisma.job.count();
        const jobsByStage = await database_1.prisma.job.groupBy({
            by: ['currentStage'],
            _count: true,
        });
        return {
            totalJobs,
            jobsByStage: jobsByStage.reduce((acc, item) => {
                acc[item.currentStage] = item._count;
                return acc;
            }, {}),
        };
    }
}
exports.JobRepository = JobRepository;
//# sourceMappingURL=jobRepository.js.map