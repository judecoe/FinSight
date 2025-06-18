// API endpoint for updating transaction data (local edits only, not synced with bank)
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, name, amount } = req.body;

  if (!id || !name || amount === undefined) {
    return res
      .status(400)
      .json({ message: "Missing required fields: id, name, amount" });
  }

  try {
    // Since this is a demo app with mock data, we'll just validate the data here
    // The actual storage is handled client-side in localStorage via the utility functions

    // Validate the data
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Invalid amount value" });
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: {
        id,
        name: trimmedName,
        amount: parsedAmount,
      },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      error: "Failed to update transaction",
      message: error.message,
    });
  }
}
