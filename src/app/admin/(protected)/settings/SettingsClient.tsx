"use client";

import { useState } from "react";
import { changeEmail, changePassword, updateSettings } from "@/app/admin/actions";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
  const [emailStatus, setEmailStatus] = useState("");
  const [passStatus, setPassStatus] = useState("");

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailStatus("Processing...");
    const formData = new FormData(e.currentTarget);
    try {
      await changeEmail(formData);
      setEmailStatus("Email updated! Please login again.");
      setTimeout(() => window.location.href = "/admin/login", 2000);
    } catch (err: any) {
      setEmailStatus(err.message);
    }
  };

  const handlePassChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPassStatus("Processing...");
    const formData = new FormData(e.currentTarget);
    try {
      await changePassword(formData);
      setPassStatus("Password updated! Please login again.");
      setTimeout(() => window.location.href = "/admin/login", 2000);
    } catch (err: any) {
      setPassStatus(err.message);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Payment Settings */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
          <form action={updateSettings} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">WAMD Mobile</label>
                <input name="WAMD_MOBILE" defaultValue={settings.WAMD_MOBILE} className="w-full h-11 px-4 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm mb-1">WAMD Holder Name</label>
                <input name="WAMD_HOLDER" defaultValue={settings.WAMD_HOLDER} className="w-full h-11 px-4 border rounded-md" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Bank Name</label>
                <input name="BANK_NAME" defaultValue={settings.BANK_NAME} className="w-full h-11 px-4 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm mb-1">Account Holder</label>
                <input name="BANK_HOLDER" defaultValue={settings.BANK_HOLDER} className="w-full h-11 px-4 border rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">IBAN</label>
              <input name="BANK_IBAN" defaultValue={settings.BANK_IBAN} className="w-full h-11 px-4 border rounded-md" />
            </div>
            <Button type="submit">Save Payment Settings</Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Change Email</h2>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input type="password" name="currentPassword" required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">New Email</label>
              <input type="email" name="newEmail" required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <Button type="submit">Update Email</Button>
            {emailStatus && <p className="text-sm text-muted">{emailStatus}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePassChange} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input type="password" name="currentPassword" required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input type="password" name="newPassword" required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm New Password</label>
              <input type="password" name="confirmPassword" required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <Button type="submit">Update Password</Button>
            {passStatus && <p className="text-sm text-muted">{passStatus}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}