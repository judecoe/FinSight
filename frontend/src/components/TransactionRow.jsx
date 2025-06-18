import React, { useState } from 'react';

const TransactionRow = ({ transaction, onUpdateTransaction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(transaction.merchant || transaction.name || '');
  const [editedAmount, setEditedAmount] = useState(Math.abs(transaction.amount).toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedName.trim() || !editedAmount.trim()) return;
    
    setIsSaving(true);
    try {
      const newAmount = transaction.amount < 0 ? -Math.abs(parseFloat(editedAmount)) : Math.abs(parseFloat(editedAmount));
      const updatedTransaction = {
        ...transaction,
        merchant: editedName,
        name: editedName,
        amount: newAmount
      };
      
      await onUpdateTransaction(updatedTransaction);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(transaction.merchant || transaction.name || '');
    setEditedAmount(Math.abs(transaction.amount).toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <tr className="hover:bg-gray-700 transition-colors group">
      <td className="py-3 px-3">
        <div className="flex items-center space-x-2">
          <div
            className={`h-2 w-2 rounded-full flex-shrink-0 ${
              transaction.amount > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-gray-600 text-white text-sm px-2 py-1 rounded border border-gray-500 focus:border-blue-500 focus:outline-none flex-1 min-w-0"
                autoFocus
                disabled={isSaving}
              />
            ) : (
              <div className="flex items-center space-x-1 flex-1 min-w-0">
                <span className="text-sm font-medium text-white truncate flex-1">
                  {transaction.merchant || transaction.name}
                </span>
                {transaction.isUserEdited && (
                  <span 
                    className="text-xs text-blue-400 font-medium"
                    title="This transaction has been edited"
                  >
                    ✓
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
              title={isEditing ? "Save changes" : "Edit transaction"}
            >
              {isEditing ? (
                isSaving ? (
                  <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                title="Cancel editing"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="text-xs text-gray-400">
          {transaction.category}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-gray-600 text-white text-sm px-2 py-1 rounded border border-gray-500 focus:border-blue-500 focus:outline-none w-20 text-right"
                disabled={isSaving}
              />
            </div>
          ) : (
            <span
              className={`text-sm font-medium ${
                transaction.amount > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {transaction.amount > 0 ? "+" : ""}$
              {Math.abs(transaction.amount).toFixed(2)}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-3 text-right">
        <span className="text-xs text-gray-400">
          {transaction.date}
        </span>
      </td>
    </tr>
  );
};

export default TransactionRow;
