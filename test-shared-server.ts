async function testDev() {
  console.log("Sending test request to Dev App URL...");
  try {
    const response = await fetch("http://127.0.0.1:3000/api/generate-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchParams: {
          query: "chicken",
          count: 3,
          source: "cook"
        }
      })
    });
    console.log("Status Code:", response.status);
    const text = await response.text();
    console.log("Response text length:", text.length);
    console.log("Response preview:", text.slice(0, 300));
  } catch (err: any) {
    console.error("Test failed:", err);
  }
}
testDev();
