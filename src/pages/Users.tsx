import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-gray-900">Users</h1>
        <Button>Add User</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter users..."
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                  <td className="p-4 align-middle font-medium">Alice Johnson</td>
                  <td className="p-4 align-middle">alice@example.com</td>
                  <td className="p-4 align-middle">Admin</td>
                  <td className="p-4 align-middle"><Badge variant="success">Active</Badge></td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
                <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                  <td className="p-4 align-middle font-medium">Bob Smith</td>
                  <td className="p-4 align-middle">bob@example.com</td>
                  <td className="p-4 align-middle">User</td>
                  <td className="p-4 align-middle"><Badge variant="warning">Pending</Badge></td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
                 <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                  <td className="p-4 align-middle font-medium">Charlie Brown</td>
                  <td className="p-4 align-middle">charlie@example.com</td>
                  <td className="p-4 align-middle">User</td>
                  <td className="p-4 align-middle"><Badge variant="error">Inactive</Badge></td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
