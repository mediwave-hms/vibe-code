import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  LayoutGrid,
  List,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
  PlayCircle,
  LogIn,
  User,
  Stethoscope,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  addMinutes,
  setHours,
  setMinutes,
  isWithinInterval,
  parseISO,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { useStore } from '../../store';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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
import { EmptyState } from '../../components/ui/EmptyState';
import { AppointmentStatus, Department } from '../../types/enums';
import type { Appointment } from '../../types/models';

type ViewMode = 'month' | 'day' | 'list';

const STATUS_BADGE_VARIANT: Record<AppointmentStatus, 'info' | 'warning' | 'brand' | 'success' | 'default' | 'danger'> = {
  [AppointmentStatus.SCHEDULED]: 'info',
  [AppointmentStatus.CHECKED_IN]: 'warning',
  [AppointmentStatus.IN_PROGRESS]: 'brand',
  [AppointmentStatus.COMPLETED]: 'success',
  [AppointmentStatus.CANCELLED]: 'default',
  [AppointmentStatus.NO_SHOW]: 'danger',
  [AppointmentStatus.RESCHEDULED]: 'warning',
};

const DEPARTMENT_COLORS: Record<Department, string> = {
  [Department.CARDIOLOGY]: 'bg-rose-500',
  [Department.NEUROLOGY]: 'bg-violet-500',
  [Department.PEDIATRICS]: 'bg-sky-500',
  [Department.ORTHOPEDICS]: 'bg-amber-500',
  [Department.GYNECOLOGY]: 'bg-pink-500',
  [Department.GENERAL_MEDICINE]: 'bg-teal-500',
  [Department.SURGERY]: 'bg-red-500',
  [Department.EMERGENCY]: 'bg-orange-500',
  [Department.ONCOLOGY]: 'bg-purple-500',
  [Department.DERMATOLOGY]: 'bg-lime-500',
  [Department.OPHTHALMOLOGY]: 'bg-cyan-500',
  [Department.ENT]: 'bg-yellow-500',
  [Department.PSYCHIATRY]: 'bg-indigo-500',
  [Department.RADIOLOGY]: 'bg-fuchsia-500',
  [Department.PATHOLOGY]: 'bg-stone-500',
  [Department.PHARMACY]: 'bg-emerald-500',
  [Department.LABORATORY]: 'bg-blue-500',
  [Department.PHYSIOTHERAPY]: 'bg-green-500',
};

const TIME_SLOTS = (() => {
  const slots: Date[] = [];
  const base = new Date();
  for (let h = 8; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(setMinutes(setHours(base, h), m));
    }
  }
  return slots;
})();

export default function AppointmentCalendarPage() {
  const appointments = useStore((s) => s.appointments);
  const patients = useStore((s) => s.patients);
  const users = useStore((s) => s.users);
  const rooms = useStore((s) => s.rooms);
  const checkIn = useStore((s) => s.checkIn);
  const startConsultation = useStore((s) => s.startConsultation);
  const completeAppointment = useStore((s) => s.completeAppointment);
  const cancelAppointment = useStore((s) => s.cancelAppointment);
  const getDoctors = useStore((s) => s.getDoctors);

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterDoctor, setFilterDoctor] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [filterDateTo, setFilterDateTo] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const doctors = useMemo(() => getDoctors(), [getDoctors]);
  const departments = Object.values(Department);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (filterDoctor && apt.doctorId !== filterDoctor) return false;
      if (filterDepartment && apt.department !== filterDepartment) return false;
      if (filterStatus && apt.status !== filterStatus) return false;
      const aptDate = startOfDay(new Date(apt.appointmentDate));
      const from = filterDateFrom ? startOfDay(parseISO(filterDateFrom)) : null;
      const to = filterDateTo ? endOfDay(parseISO(filterDateTo)) : null;
      if (from && aptDate < from) return false;
      if (to && aptDate > to) return false;
      return true;
    });
  }, [appointments, filterDoctor, filterDepartment, filterStatus, filterDateFrom, filterDateTo]);

  const getPatientName = (id: string) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  };

  const getDoctorName = (id: string) => {
    const d = users.find((x) => x.id === id);
    return d ? `Dr. ${d.firstName} ${d.lastName}` : 'Unknown';
  };

  const getRoomNumber = (id?: string) => {
    if (!id) return '-';
    const r = rooms.find((x) => x.id === id);
    return r ? r.roomNumber : '-';
  };

  const handleCheckIn = (id: string) => checkIn(id);
  const handleStart = (id: string) => startConsultation(id);
  const handleComplete = (id: string) => completeAppointment(id);
  const handleCancel = (id: string) => {
    if (confirm('Cancel this appointment?')) cancelAppointment(id, 'Cancelled by user');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and schedule patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'month' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" /> Month
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'day' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Day
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === 'list' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
          </div>
          <Link to="/appointments/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>New Appointment</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Doctor</Label>
              <Select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
                <option value="">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName} ({d.department})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d.replace('_', ' ')}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {Object.values(AppointmentStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Date From</Label>
              <Input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
            </div>
            <div>
              <Label>Date To</Label>
              <Input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'month' && (
        <MonthView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          appointments={filteredAppointments}
        />
      )}
      {viewMode === 'day' && (
        <DayView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          appointments={filteredAppointments}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
        />
      )}
      {viewMode === 'list' && (
        <ListView
          appointments={filteredAppointments}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
          getRoomNumber={getRoomNumber}
          onCheckIn={handleCheckIn}
          onStart={handleStart}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

function MonthView({
  currentDate,
  setCurrentDate,
  appointments,
}: {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  appointments: Appointment[];
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((a) => {
      const key = format(new Date(a.appointmentDate), 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return map;
  }, [appointments]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-semibold text-slate-500 text-center py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayApts = appointmentsByDay.get(key) || [];
            const inMonth = isSameMonth(day, currentDate);
            const dots = dayApts.slice(0, 4).map((a) => DEPARTMENT_COLORS[a.department] || 'bg-slate-400');
            return (
              <div
                key={key}
                className={`min-h-[92px] p-2 rounded-lg border transition ${
                  inMonth
                    ? isToday(day)
                      ? 'bg-brand-50 border-brand-200'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                    : 'bg-slate-50 border-transparent'
                }`}
              >
                <div className={`text-sm font-medium ${isToday(day) ? 'text-brand-700' : inMonth ? 'text-slate-900' : 'text-slate-400'}`}>
                  {format(day, 'd')}
                </div>
                {dayApts.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {dots.map((c, i) => (
                        <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
                      ))}
                    </div>
                    {dayApts.length > 4 && (
                      <div className="text-[10px] text-slate-500">+{dayApts.length - 4} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DayView({
  currentDate,
  setCurrentDate,
  appointments,
  getPatientName,
  getDoctorName,
}: {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  appointments: Appointment[];
  getPatientName: (id: string) => string;
  getDoctorName: (id: string) => string;
}) {
  const dayStart = startOfDay(currentDate);
  const dayEnd = endOfDay(currentDate);

  const dayAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const d = new Date(a.appointmentDate);
      return isWithinInterval(d, { start: dayStart, end: dayEnd });
    });
  }, [appointments, dayStart, dayEnd]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{format(currentDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addMinutes(currentDate, -1440))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addMinutes(currentDate, 1440))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {dayAppointments.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-10 h-10" />}
            title="No appointments"
            description="There are no appointments scheduled for this day."
          />
        ) : (
          <div className="relative space-y-1">
            {TIME_SLOTS.map((slot, idx) => {
              const slotStart = setMinutes(setHours(startOfDay(currentDate), slot.getHours()), slot.getMinutes());
              const slotEnd = addMinutes(slotStart, 30);
              const slotApts = dayAppointments.filter((a) => {
                const s = new Date(a.startTime);
                return isSameDay(s, slotStart) && s >= slotStart && s < slotEnd;
              });
              return (
                <div key={idx} className="flex gap-4 min-h-[52px]">
                  <div className="w-20 flex-shrink-0 text-xs font-medium text-slate-500 pt-3 text-right">
                    {format(slot, 'h:mm a')}
                  </div>
                  <div className="flex-1 border-l border-slate-100 pl-4 py-1">
                    {slotApts.length > 0 ? (
                      <div className="space-y-1">
                        {slotApts.map((apt) => (
                          <div
                            key={apt.id}
                            className={`rounded-lg px-3 py-2 text-xs border-l-4 bg-slate-50 ${DEPARTMENT_COLORS[apt.department]?.replace('bg-', 'border-') || 'border-slate-400'}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-slate-900">{apt.title}</div>
                              <Badge variant={STATUS_BADGE_VARIANT[apt.status]}>{apt.status.replace('_', ' ')}</Badge>
                            </div>
                            <div className="mt-1 text-slate-600 flex items-center gap-3 flex-wrap">
                              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(apt.startTime), 'h:mm a')} - {format(new Date(apt.endTime), 'h:mm a')}</span>
                              <span className="inline-flex items-center gap-1"><User className="w-3 h-3" /> {getPatientName(apt.patientId)}</span>
                              <span className="inline-flex items-center gap-1"><Stethoscope className="w-3 h-3" /> {getDoctorName(apt.doctorId)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-10 border-b border-dashed border-slate-100" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ListView({
  appointments,
  getPatientName,
  getDoctorName,
  getRoomNumber,
  onCheckIn,
  onStart,
  onComplete,
  onCancel,
}: {
  appointments: Appointment[];
  getPatientName: (id: string) => string;
  getDoctorName: (id: string) => string;
  getRoomNumber: (id?: string) => string;
  onCheckIn: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState icon={<Search className="w-10 h-10" />} title="No appointments found" description="Try adjusting your filters or schedule a new appointment." />
        </CardContent>
      </Card>
    );
  }

  const sorted = [...appointments].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date / Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell>
                  <div className="font-medium text-slate-900">{format(new Date(apt.appointmentDate), 'MMM d, yyyy')}</div>
                  <div className="text-xs text-slate-500">
                    {format(new Date(apt.startTime), 'h:mm a')} - {format(new Date(apt.endTime), 'h:mm a')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{getPatientName(apt.patientId)}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{getDoctorName(apt.doctorId)}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{apt.department.replace('_', ' ')}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="brand">{apt.visitType.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[apt.status]}>{apt.status.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{getRoomNumber(apt.roomId)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {apt.status === AppointmentStatus.SCHEDULED && (
                      <Button variant="ghost" size="sm" onClick={() => onCheckIn(apt.id)} title="Check In">
                        <LogIn className="w-4 h-4 text-blue-600" />
                      </Button>
                    )}
                    {apt.status === AppointmentStatus.CHECKED_IN && (
                      <Button variant="ghost" size="sm" onClick={() => onStart(apt.id)} title="Start Consultation">
                        <PlayCircle className="w-4 h-4 text-amber-600" />
                      </Button>
                    )}
                    {apt.status === AppointmentStatus.IN_PROGRESS && (
                      <Button variant="ghost" size="sm" onClick={() => onComplete(apt.id)} title="Complete">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </Button>
                    )}
                    {(apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.CHECKED_IN) && (
                      <Button variant="ghost" size="sm" onClick={() => onCancel(apt.id)} title="Cancel">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
