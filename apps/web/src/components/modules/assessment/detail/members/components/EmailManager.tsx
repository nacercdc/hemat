"use client";

import React, { useState, ChangeEvent } from "react";

// Helper to get initials from email
const getInitials = (email: string): string => {
  const name = email.split("@")[0];
  const parts = name.split(".");
  const initials =
    parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return initials.toUpperCase();
};

export default function EmailManager(): JSX.Element {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState<string>("");

  const addEmail = (): void => {
    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
      setNewEmail("");
    }
  };

  const removeEmail = (email: string): void => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewEmail(e.target.value);
  };

  return (
    <div className="max-w-3xl p-6">
      {/* Email Input */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="email"
          placeholder="Add email"
          value={newEmail}
          onChange={handleChange}
          className="border px-3 py-1 rounded w-full max-w-sm"
        />
        <button
          onClick={addEmail}
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* Email List */}
      <div className="border-t pt-4">
        <div className="text-sm text-right text-red-500 font-semibold mb-2">
          Groups Leader
        </div>
        <ul>
          {emails.map((email) => (
            <li
              key={email}
              className="flex items-center justify-between py-2 border-b"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold uppercase">
                  {getInitials(email)}
                </div>
                <span>{email}</span>
              </div>
              <button
                className="ml-2 text-red-500 font-bold"
                onClick={() => removeEmail(email)}
                title="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
