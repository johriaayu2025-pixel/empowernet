const API_URL = "http://localhost:8001/api/scan";

export async function scanContent(type, content, label) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type, content, label }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Scan API Error:", error);
        return { error: error.message };
    }
}

export async function verifyHash(evidenceHash) {
    try {
        const response = await fetch("http://localhost:8001/api/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ evidenceHash }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Verify API Error:", error);
        return { error: error.message };
    }
}
