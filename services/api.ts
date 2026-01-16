export async function runScan(payload: {
  type: string;
  content: string;
  label?: string;
}) {
  const response = await fetch("http://127.0.0.1:8001/api/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Scan request failed");
  }

  return response.json();
}

export async function verifyEvidence(hash: string) {
  const response = await fetch("http://127.0.0.1:8001/api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ evidenceHash: hash }),
  });
  return response.json();
}
