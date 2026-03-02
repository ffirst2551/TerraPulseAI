import { randomUUID } from "node:crypto";

const clone = (value) => JSON.parse(JSON.stringify(value));

const users = [
  {
    id: "user_admin_001",
    email: "admin@terrapulse.ai",
    password: "terrapulse123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_analyst_001",
    email: "analyst@terrapulse.ai",
    password: "terrapulse123",
    role: "analyst",
    createdAt: new Date().toISOString(),
  },
];

const projects = [
  {
    id: "project-th-001",
    name: "Ranong Mangrove Belt",
    region: "Ranong, Thailand",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sectorsByProjectId = new Map([
  [
    "project-th-001",
    [
      {
        id: "sector-001",
        label: "Main Delta",
        idx: 0,
        x: 26,
        y: 30,
        health: 92,
        biomass: 78,
        species: 64,
        growth: 12.4,
        co2Offset: 2.4,
      },
      {
        id: "sector-002",
        label: "Canopy East",
        idx: 1,
        x: 62,
        y: 42,
        health: 88,
        biomass: 74,
        species: 71,
        growth: 9.6,
        co2Offset: 2.1,
      },
      {
        id: "sector-003",
        label: "Tidal Gate",
        idx: 2,
        x: 34,
        y: 69,
        health: 81,
        biomass: 67,
        species: 58,
        growth: 7.4,
        co2Offset: 1.8,
      },
      {
        id: "sector-004",
        label: "Creek South",
        idx: 3,
        x: 72,
        y: 64,
        health: 86,
        biomass: 72,
        species: 62,
        growth: 8.2,
        co2Offset: 1.9,
      },
    ],
  ],
]);

const scansById = new Map();
const verificationsById = new Map();

const nowIso = () => new Date().toISOString();

export const mockStore = {
  findUserByEmail(email) {
    return clone(users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null);
  },
  getProject(projectId) {
    return clone(projects.find((project) => project.id === projectId) || null);
  },
  getProjectSectors(projectId) {
    return clone(sectorsByProjectId.get(projectId) || []);
  },
  getDashboard(projectId) {
    const project = this.getProject(projectId);
    const sectors = this.getProjectSectors(projectId);
    if (!project) return null;

    const average = (key) =>
      sectors.length === 0
        ? 0
        : Number((sectors.reduce((acc, item) => acc + Number(item[key] || 0), 0) / sectors.length).toFixed(1));

    return {
      project,
      summary: {
        sectorCount: sectors.length,
        healthAvg: average("health"),
        biomassAvg: average("biomass"),
        speciesAvg: average("species"),
      },
      sectors,
      generatedAt: nowIso(),
    };
  },
  createScan(payload) {
    const id = `scan_${randomUUID()}`;
    const createdAt = nowIso();
    const record = {
      id,
      mode: payload.mode,
      inputUrl: payload.inputUrl || null,
      status: "QUEUED",
      progress: 0,
      result: null,
      error: null,
      projectId: payload.projectId,
      createdById: payload.createdById || null,
      createdAt,
      updatedAt: createdAt,
    };
    scansById.set(id, record);
    return clone(record);
  },
  updateScan(scanId, patch) {
    const current = scansById.get(scanId);
    if (!current) return null;
    const updated = {
      ...current,
      ...patch,
      updatedAt: nowIso(),
    };
    scansById.set(scanId, updated);
    return clone(updated);
  },
  getScan(scanId) {
    return clone(scansById.get(scanId) || null);
  },
  createVerification(payload) {
    const id = `ver_${randomUUID()}`;
    const createdAt = nowIso();
    const record = {
      id,
      source: payload.source,
      hash: payload.hash,
      algorithm: payload.algorithm || "sha256",
      payload: payload.payload,
      createdById: payload.createdById || null,
      createdAt,
    };
    verificationsById.set(id, record);
    return clone(record);
  },
  getVerification(id) {
    return clone(verificationsById.get(id) || null);
  },
};
