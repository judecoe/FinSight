// Utility functions for handling transaction edits

// Get user transaction edits from localStorage
export const getUserTransactionEdits = () => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem("user_transaction_edits");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading transaction edits:", error);
    return {};
  }
};

// Save user transaction edit to localStorage
export const saveTransactionEdit = (transactionId, edits) => {
  if (typeof window === "undefined") return;

  try {
    const currentEdits = getUserTransactionEdits();
    currentEdits[transactionId] = {
      ...edits,
      editedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "user_transaction_edits",
      JSON.stringify(currentEdits)
    );
  } catch (error) {
    console.error("Error saving transaction edit:", error);
  }
};

// Apply user edits to transactions array
export const applyUserEditsToTransactions = (transactions) => {
  const userEdits = getUserTransactionEdits();

  return transactions.map((transaction) => {
    const edit = userEdits[transaction.id];
    if (edit) {
      return {
        ...transaction,
        merchant: edit.name,
        name: edit.name,
        amount: edit.amount,
        isUserEdited: true,
        editedAt: edit.editedAt,
      };
    }
    return transaction;
  });
};

// Update a single transaction (API call)
export const updateTransaction = async (transactionId, updates) => {
  try {
    const response = await fetch("/api/banking/update-transaction", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: transactionId,
        name: updates.name || updates.merchant,
        amount: updates.amount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }

    const result = await response.json();

    // Also save to localStorage for immediate UI update
    saveTransactionEdit(transactionId, {
      name: updates.name || updates.merchant,
      amount: updates.amount,
    });

    return result;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete a transaction edit (restore original)
export const removeTransactionEdit = (transactionId) => {
  if (typeof window === "undefined") return;

  try {
    const currentEdits = getUserTransactionEdits();
    delete currentEdits[transactionId];
    localStorage.setItem(
      "user_transaction_edits",
      JSON.stringify(currentEdits)
    );
  } catch (error) {
    console.error("Error removing transaction edit:", error);
  }
};
