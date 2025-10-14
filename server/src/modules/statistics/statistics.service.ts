import prisma from "../../config/prisma";

export class StatisticsService {
  static async airlinesOverview(month?: number, year?: number) {
    const submissions = await prisma.submission.findMany({
      where:
        month && year
          ? {
              date: {
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

    // Compute success rate
    const overview = Array.from(overviewMap.values()).map((d) => ({
      ...d,
      successRate: d.totalSubmissions ? (d.pass / d.totalSubmissions) * 100 : 0,
    }));

    return overview;
  }
  byPassRate() {}
  airlinesOverview() {}
}
