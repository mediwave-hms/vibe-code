import { useMemo } from 'react';
import {
  Users,
  CalendarCheck,
  BedDouble,
  Activity,
  Clock,
  Heart,
  Pill,
  Thermometer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useStore } from '../store';
import { StatsCard } from '../components/dashboard/StatsCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { format, isSameDay } from 'date-fns';
import { Department, AdmissionStatus } from '../types/enums';
import type { Patient, Appointment, Admission, Room } from '../types/models';

const HOUR_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const DEPARTMENT_COLORS: Record<string, string> = {
  CARDIOLOGY: '#ef4444',
  NEUROLOGY: '#8b5cf6',
  PEDIATRICS: '#06b6d4',
  ORTHOPEDICS: '#f59e0b',
  GYNECOLOGY: '#ec4899',
  GENERAL_MEDICINE: '#10b981',
  SURGERY: '#6366f1',
  EMERGENCY: '#dc2626',
  ONCOLOGY: '#7c3aed',
  DERMATOLOGY: '#14b8a6',
  OPHTHALMOLOGY: '#0ea5e9',
  ENT: '#f97316',
  PSYCHIATRY: '#a855f7',
  RADIOLOGY: '#64748b',
  PATHOLOGY: '#94a3b8',
  PHARMACY: '#22c55e',
  LABORATORY: '#84cc16',
  PHYSIOTHERAPY: '#0891b2',
};

type ActivityEvent = {
  id: string;
  patientName: string;
  patientId: string;
  event: string;
  timestamp: Date;
  status: 'success' | 'info' | 'warning' | 'default';
  icon: 'admission' | 'vitals' | 'prescription';
};

export default function DashboardPage() {
  const patients = useStore((s) => s.patients);
  const appointments = useStore((s) => s.appointments);
  const admissions = useStore((s) => s.admissions);
  const rooms = useStore((s) => s.rooms);

  const today = useMemo(() => new Date(), []);
  const totalPatients = patients.length;
  const todayAppointments = appointments.filter((a: Appointment) =>
    isSameDay(new Date(a.appointmentDate), today)
  ).length;
  const activeAdmissions = admissions.filter(
    (a: Admission) =>
      a.status === AdmissionStatus.ADMITTED || a.status === AdmissionStatus.PENDING
  ).length;

  const totalBeds = rooms.reduce((sum: number, r: Room) => sum + r.capacity, 0);
  const occupiedBeds = rooms.reduce(
    (sum: number, r: Room) => sum + r.currentOccupancy,
    0
  );
  const occupancyPercent = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  const hourlyData = useMemo(() => {
    const counts: Record<number, number> = {};
    HOUR_SLOTS.forEach((h) => (counts[h] = 0));
    appointments
      .filter((a: Appointment) => isSameDay(new Date(a.appointmentDate), today))
      .forEach((a: Appointment) => {
        const hour = new Date(a.startTime).getHours();
        if (counts[hour] !== undefined) counts[hour]++;
      });
    return HOUR_SLOTS.map((h) => ({
      hour: `${h.toString().padStart(2, '0')}:00`,
      appointments: counts[h],
    }));
  }, [appointments, today]);

  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach((a: Appointment) => {
      counts[a.department] = (counts[a.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value,
    }));
  }, [appointments]);

  const recentActivity = useMemo<ActivityEvent[]>(() => {
    const events: ActivityEvent[] = [];

    const recentAdmissions = [...admissions]
      .sort(
        (a: Admission, b: Admission) =>
          new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      )
      .slice(0, 3);
    recentAdmissions.forEach((a: Admission) => {
      const patient = patients.find((p: Patient) => p.id === a.patientId);
      if (patient) {
        events.push({
          id: `adm-${a.id}`,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientId: patient.id,
          event: 'Patient admitted',
          timestamp: new Date(a.admissionDate),
          status: a.status === AdmissionStatus.DISCHARGED ? 'default' : 'success',
          icon: 'admission',
        });
      }
    });

    for (let i = 0; i < 4; i++) {
      const patient = patients[i % patients.length];
      if (patient) {
        const ts = new Date(Date.now() - i * 3600000 - 7200000);
        events.push({
          id: `vit-${patient.id}-${i}`,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientId: patient.id,
          event: 'Vitals recorded',
          timestamp: ts,
          status: 'info',
          icon: 'vitals',
        });
      }
    }

    for (let i = 0; i < 3; i++) {
      const idx = (i + 2) % Math.max(patients.length, 1);
      const patient = patients[idx];
      if (patient) {
        const ts = new Date(Date.now() - i * 7200000 - 1800000);
        events.push({
          id: `rx-${patient.id}-${i}`,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientId: patient.id,
          event: 'Prescription dispensed',
          timestamp: ts,
          status: 'warning',
          icon: 'prescription',
        });
      }
    }

    return events
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  }, [patients, admissions]);

  const displayRooms = useMemo(() => {
    return rooms.slice(0, 6).map((r: Room) => {
      const pct = r.capacity > 0 ? (r.currentOccupancy / r.capacity) * 100 : 0;
      const variant: 'default' | 'success' | 'warning' | 'danger' =
        pct >= 100 ? 'danger' : pct >= 75 ? 'warning' : pct >= 25 ? 'success' : 'default';
      return { ...r, occupancyPct: pct, barVariant: variant };
    });
  }, [rooms]);

  function getActivityIcon(icon: ActivityEvent['icon']) {
    switch (icon) {
      case 'admission':
        return <BedDouble className="w-4 h-4" />;
      case 'vitals':
        return <Thermometer className="w-4 h-4" />;
      case 'prescription':
        return <Pill className="w-4 h-4" />;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back. Here's what's happening at the hospital today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="w-5 h-5" />}
          subtitle="Registered patients"
          accentColor="emerald"
        />
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments}
          icon={<CalendarCheck className="w-5 h-5" />}
          subtitle={format(today, 'MMM d, yyyy')}
          accentColor="blue"
        />
        <StatsCard
          title="Active Admissions"
          value={activeAdmissions}
          icon={<BedDouble className="w-5 h-5" />}
          subtitle="Currently admitted"
          accentColor="violet"
        />
        <StatsCard
          title="Occupancy"
          value={`${occupancyPercent.toFixed(1)}%`}
          icon={<Activity className="w-5 h-5" />}
          subtitle={`${occupiedBeds}/${totalBeds} beds in use`}
          accentColor={occupancyPercent >= 85 ? 'rose' : 'amber'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                Appointments Today
              </CardTitle>
              <Badge variant="info">{todayAppointments} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  name="Appointments"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Department Distribution
              </CardTitle>
              <Badge variant="brand">{appointments.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          DEPARTMENT_COLORS[
                            Object.keys(Department).find(
                              (k) =>
                                Department[k as keyof typeof Department]
                                  .toString()
                                  .replace(/_/g, ' ') === entry.name
                            ) || ''
                          ] || '#64748b'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No appointment data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-600" />
              Recent Patient Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((e) => (
                  <TableRow key={e.id} className="cursor-pointer">
                    <TableCell className="font-medium text-slate-900">
                      {e.patientName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{getActivityIcon(e.icon)}</span>
                        <span className="text-slate-700">{e.event}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                      {format(new Date(e.timestamp), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={e.status}>
                        {e.icon.charAt(0).toUpperCase() + e.icon.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {recentActivity.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                      No recent activity
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-violet-600" />
              Bed Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayRooms.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-slate-900 text-lg">
                        Room {r.roomNumber}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {r.type.replace(/_/g, ' ')} · Floor {r.floor}
                      </div>
                    </div>
                    <Badge variant="default">
                      {r.currentOccupancy}/{r.capacity}
                    </Badge>
                  </div>
                  <ProgressBar
                    value={r.occupancyPct}
                    variant={r.barVariant}
                    showPercentage
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {r.capacity - r.currentOccupancy} bed
                      {r.capacity - r.currentOccupancy === 1 ? '' : 's'} free
                    </span>
                    <span className="font-medium">
                      ${r.dailyRate.toLocaleString()}/day
                    </span>
                  </div>
                </div>
              ))}
              {displayRooms.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
                  No rooms configured
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
