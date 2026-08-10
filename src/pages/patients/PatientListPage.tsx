import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  X,
  UserPlus,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../store';
import { Gender, BloodGroup } from '../../types/enums';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { toastSuccess, toastError } from '../../lib/toast';
import { filterPatients } from '../../utils/patientSearch';

export default function PatientListPage() {
  const patients = useStore((s) => s.patients);
  const deletePatient = useStore((s) => s.deletePatient);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<string>('');
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('');
  const [filterActive, setFilterActive] = useState<string>('');

  const filtered = useMemo(
    () =>
      filterPatients(patients, {
        query: searchQuery,
        gender: filterGender || null,
        bloodGroup: filterBloodGroup || null,
        isActive: filterActive === '' ? null : filterActive === 'true',
      }),
    [patients, searchQuery, filterGender, filterBloodGroup, filterActive]
  );

  const handleDelete = (id: string) => {
    if (confirm('Remove this patient record?')) {
      const ok = deletePatient(id);
      if (ok) toastSuccess('Patient removed');
      else toastError('Failed to remove patient');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterGender('');
    setFilterBloodGroup('');
    setFilterActive('');
  };

  const hasFilters = searchQuery || filterGender || filterBloodGroup || filterActive;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage registered patients and their records</p>
        </div>
        <Link to="/patients/new">
          <Button leftIcon={<UserPlus className="w-4 h-4" />}>New Patient</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, MRN, email, phone..."
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                <option value="">All</option>
                {Object.values(Gender).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Blood Group</Label>
              <Select value={filterBloodGroup} onChange={(e) => setFilterBloodGroup(e.target.value)}>
                <option value="">All</option>
                {Object.values(BloodGroup).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          </div>
          {hasFilters && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
              <button onClick={clearFilters} className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                <X className="w-3 h-3" /> Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No patients found"
              description={hasFilters ? 'Try adjusting your search or filters.' : 'Get started by registering a new patient.'}
              ctaLabel={!hasFilters ? 'Register Patient' : undefined}
              onCtaClick={() => {}}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Gender / Blood</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{p.firstName} {p.lastName}</div>
                      <div className="text-xs text-slate-500">{p.email || '-'}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.medicalRecordNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">{p.gender}</div>
                      <div className="text-xs text-slate-500">{p.bloodGroup || '-'}</div>
                    </TableCell>
                    <TableCell className="text-sm">{p.phone}</TableCell>
                    <TableCell>
                      <Badge variant={p.isActive ? 'success' : 'default'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/patients/${p.id}`}>
                          <Button variant="ghost" size="sm" title="View"><Eye className="w-4 h-4 text-blue-600" /></Button>
                        </Link>
                        <Button variant="ghost" size="sm" title="Edit"><Edit className="w-4 h-4 text-amber-600" /></Button>
                        <Button variant="ghost" size="sm" title="Delete" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
