import prisma from "../../config/prisma";
import { StatisticsSchemaType } from "./statistics.schema";

export class StatisticsService {
  static async getStatistics() {
    const [totalSubmissions, totalPass, totalFail, totalAirlines] =
      await Promise.all([
        prisma.submission.count(),
        prisma.submission.count({
          where: {
            status: "PASS",
          },
        }),
        prisma.submission.count({
          where: {
            status: "FAIL",
          },
        }),
        prisma.airlines.count(),
      ]);

    return {
      totalSubmissions,
      totalPass,
      totalFail,
      totalAirlines,
    };
  }

  static async airlinesOverview({ name, date }: StatisticsSchemaType) {
    let month: number | undefined;
    let year: number | undefined;

    if (date) {
      month = date.getMonth() + 1; // getMonth() is 0-based
      year = date.getFullYear();
    }

    const submissions = await prisma.submission.findMany({
      where:
        month && year
          ? {
              createdAt: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
              },
            }
          : undefined,
      include: {
        airline: true,
        assessments: true,
      },
    });

    // Group by airline
    const overviewMap = new Map<string, any>();

    submissions.forEach((sub) => {
      const airlineId = sub.airline.id;
      if (!overviewMap.has(airlineId)) {
        overviewMap.set(airlineId, {
          airlineId,
          airlineName: sub.airline.name,
          totalSubmissions: 0,
          pass: 0,
          fail: 0,
          totalAssessments: 0,
        });
      }
      const data = overviewMap.get(airlineId);
      data.totalSubmissions += 1;
      data.pass += sub.status === "PASS" ? 1 : 0;
      data.fail += sub.status === "FAIL" ? 1 : 0;
      data.totalAssessments += sub.assessments.length;
    });

    // compute assessments
    const assessments = new Set<string>();

    submissions.forEach((a) =>
      a.assessments.forEach((e) => {
        assessments.add(e.name);
      }),
    );
    // Compute success rate

    return Array.from(overviewMap.values()).map((d) => ({
      ...d,
      successRate: d.totalSubmissions ? (d.pass / d.totalSubmissions) * 100 : 0,
      assessments: Array.from(assessments),
    }));
  }

  static async byPassRate(date: Date) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (date) {
      const year = date.getFullYear();
      startDate = new Date(year, 0, 1);
      endDate = new Date(year + 1, 0, 1);
    }

    // Step 1: Group by airlineId and status to get counts
    const grouped = await prisma.submission.groupBy({
      by: ["airlineId", "status"],
      where:
        startDate && endDate
          ? {
              createdAt: { gte: startDate, lt: endDate },
            }
          : undefined,
      _count: { id: true },
    });

    // Step 2: Fetch airline names
    const airlineIds = Array.from(new Set(grouped.map((g) => g.airlineId)));
    const airlines = await prisma.airlines.findMany({
      where: { id: { in: airlineIds } },
      select: { id: true, name: true },
    });

    // Step 3: Merge counts per airline
    const overviewMap = new Map<
      string,
      {
        airlineName: string;
        totalSubmissions: number;
        totalPass: number;
        totalFail: number;
      }
    >();

    airlines.forEach((a) => {
      overviewMap.set(a.id, {
        airlineName: a.name,
        totalSubmissions: 0,
        totalPass: 0,
        totalFail: 0,
      });
    });

    grouped.forEach((g) => {
      const data = overviewMap.get(g.airlineId);
      if (!data) return;

      data.totalSubmissions += g._count.id;
      if (g.status === "PASS") data.totalPass = g._count.id;
      if (g.status === "FAIL") data.totalFail = g._count.id;
    });

    return Array.from(overviewMap.values());
  }

  static bySubmissions(date: Date) {
    const year = date.getFullYear();
    const startDate = new Date(year, 0, 1); // Jan 1
    const endDate = new Date(year + 1, 0, 1); // Jan 1 next year

    return prisma.airlines.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        _count: {
          select: {
            submissions: true, // total submissions per airline
          },
        },
      },
    });
  }
}
