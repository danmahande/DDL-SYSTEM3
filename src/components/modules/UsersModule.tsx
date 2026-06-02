"use client";

import { UserCog, Plus, Edit, Trash2 } from "lucide-react";

const users = [
  { id: "USR-001", name: "System Admin", email: "admin@ddl.com", role: "super_admin", status: "Active", created: "2026-01-15" },
  { id: "USR-002", name: "John Manager", email: "john@ddl.com", role: "admin", status: "Active", created: "2026-02-20" },
  { id: "USR-003", name: "Jane Supplier", email: "jane@ddl.com", role: "supplier", status: "Active", created: "2026-03-10" },
  { id: "USR-004", name: "Bob Driver", email: "bob@ddl.com", role: "driver", status: "Active", created: "2026-03-15" },
  { id: "USR-005", name: "Alice Viewer", email: "alice@ddl.com", role: "viewer", status: "Inactive", created: "2026-04-01" },
];

const roleColors: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700",
  admin: "bg-orange-100 text-orange-700",
  supplier: "bg-blue-100 text-blue-700",
  driver: "bg-green-100 text-green-700",
  viewer: "bg-gray-100 text-gray-700",
};

export default function UsersModule() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-5 h-5 text-[#1B2A4A]" />
            <span className="text-gray-500 text-sm">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-[#1B2A4A]">12</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-5 h-5 text-green-500" />
            <span className="text-gray-500 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">10</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-5 h-5 text-red-500" />
            <span className="text-gray-500 text-sm">Inactive</span>
          </div>
          <p className="text-2xl font-bold text-red-600">2</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Users</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role]}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#1B2A4A] hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
