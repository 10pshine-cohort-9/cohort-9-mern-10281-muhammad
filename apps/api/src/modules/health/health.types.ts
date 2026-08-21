export type DBStatus = "up" | "down";

export type HealthResponse = {
  status: "ok" | "degraded";
  uptime: number;
  timestamp: string;
  services: {
    database: DBStatus;
  };
};
