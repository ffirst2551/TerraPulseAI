import { emitScanUpdate } from "../lib/events.js";
import { store } from "./store.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockResultForMode = (mode) => {
  if (mode === "acoustic") {
    return {
      stage: "Vibrant Restoration Zone",
      confidence: 95,
      metrics: {
        carbon_tco2: 980,
        biomass_index: 0.86,
      },
      explainer:
        "ระบบเสียงบ่งชี้ว่าพื้นที่มีความหลากหลายทางชีวภาพสูงขึ้นและมีแนวโน้มกักเก็บคาร์บอนได้ดีขึ้นอย่างต่อเนื่อง",
    };
  }

  return {
    stage: "Healthy Mangrove Canopy",
    confidence: 97,
    metrics: {
      carbon_tco2: 1240,
      biomass_index: 0.91,
    },
    explainer:
      "ภาพถ่ายดาวเทียมแสดงความหนาแน่นเรือนยอดที่สอดคล้องกับการฟื้นตัวของระบบนิเวศป่าชายเลนระดับดีมาก",
  };
};

export async function runMockScanLifecycle(fastify, scan) {
  const transitions = [
    { status: "PROCESSING", progress: 16 },
    { status: "PROCESSING", progress: 42 },
    { status: "PROCESSING", progress: 74 },
    { status: "COMPLETED", progress: 100, result: mockResultForMode(scan.mode) },
  ];

  for (const step of transitions) {
    await wait(1200);
    const updated = await store.updateScanJob(scan.id, step);
    if (!updated) return;
    emitScanUpdate(fastify, updated);
  }
}
