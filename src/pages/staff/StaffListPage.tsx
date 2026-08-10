import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../../store';
import { Role } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function StaffListPage() {
  const getAllStaff = useStore((s) => s.getAllStaff);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const staff = useMemo(() => {
    return getAllStaff().filter((user) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (!fullName.includes(q) && !(user.email?.toLowerCase().includes(q))) return false;
      }
      if (roleFilter && user.role !== roleFilter) return false;
      return true;
    });
  }, [getAllStaff, query, roleFilter]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Manage clinical and administrative care teams.</p>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search staff..."
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                <option value="">All roles</option>
                {Object.values(Role).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <EmptyState
              icon={<span className="text-4xl">👥</span>}
              title="No staff found"
              description="Use search filters to locate team members."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.department ?? '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'default'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/staff/${user.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
