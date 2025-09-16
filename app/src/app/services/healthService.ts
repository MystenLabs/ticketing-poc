// healthService.ts

export const checkHealth = async (): Promise<{ status: string }> => {
  return { status: "OK" };
};
