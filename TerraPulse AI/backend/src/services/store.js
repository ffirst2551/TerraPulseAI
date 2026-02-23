import { prisma } from "../lib/prisma.js";
import { mockStore } from "../data/mock-store.js";

const normalizeScan = (scan) =>
  scan
    ? {
        ...scan,
        createdAt: scan.createdAt instanceof Date ? scan.createdAt.toISOString() : scan.createdAt,
        updatedAt: scan.updatedAt instanceof Date ? scan.updatedAt.toISOString() : scan.updatedAt,
      }
    : null;

export const store = {
  async authenticateUser(email, password) {
    if (!prisma) {
      const user = mockStore.findUserByEmail(email);
      if (!user || user.password !== password) return null;
      return user;
    }

    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (!user || user.password !== password) return null;
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async getProjectSectors(projectId) {
    if (!prisma) {
      const project = mockStore.getProject(projectId);
      const sectors = mockStore.getProjectSectors(projectId);
      return { project, sectors };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { sectors: { orderBy: { idx: "asc" } } },
    });

    if (!project) return { project: null, sectors: [] };
    return {
      project: {
        id: project.id,
        name: project.name,
        region: project.region,
      },
      sectors: project.sectors,
    };
  },

  async getDashboard(projectId) {
    if (!prisma) return mockStore.getDashboard(projectId);

    const data = await prisma.project.findUnique({
      where: { id: projectId },
      include: { sectors: { orderBy: { idx: "asc" } } },
    });
    if (!data) return null;

    const average = (key) =>
      data.sectors.length === 0
        ? 0
        : Number((data.sectors.reduce((acc, item) => acc + Number(item[key] || 0), 0) / data.sectors.length).toFixed(1));

    return {
      project: { id: data.id, name: data.name, region: data.region },
      summary: {
        sectorCount: data.sectors.length,
        healthAvg: average("health"),
        biomassAvg: average("biomass"),
        speciesAvg: average("species"),
      },
      sectors: data.sectors,
      generatedAt: new Date().toISOString(),
    };
  },

  async createScanJob(payload) {
    if (!prisma) return mockStore.createScan(payload);

    const scan = await prisma.scanJob.create({
      data: {
        projectId: payload.projectId,
        mode: payload.mode,
        inputUrl: payload.inputUrl || null,
        status: "QUEUED",
        progress: 0,
        createdById: payload.createdById || null,
      },
    });
    return normalizeScan(scan);
  },

  async updateScanJob(scanId, patch) {
    if (!prisma) return mockStore.updateScan(scanId, patch);

    const scan = await prisma.scanJob.update({
      where: { id: scanId },
      data: patch,
    });
    return normalizeScan(scan);
  },

  async getScanJob(scanId) {
    if (!prisma) return mockStore.getScan(scanId);
    const scan = await prisma.scanJob.findUnique({ where: { id: scanId } });
    return normalizeScan(scan);
  },

  async createVerificationRecord(payload) {
    if (!prisma) return mockStore.createVerification(payload);

    const created = await prisma.verificationRecord.create({
      data: {
        source: payload.source,
        hash: payload.hash,
        algorithm: payload.algorithm || "sha256",
        payload: payload.payload,
        createdById: payload.createdById || null,
      },
    });
    return {
      ...created,
      createdAt: created.createdAt.toISOString(),
    };
  },

  async getVerificationRecord(id) {
    if (!prisma) return mockStore.getVerification(id);
    const record = await prisma.verificationRecord.findUnique({ where: { id } });
    if (!record) return null;
    return {
      ...record,
      createdAt: record.createdAt.toISOString(),
    };
  },
};
