import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store';
import { Department, VisitType } from '../../types/enums';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Input, Label } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  title: z.string().min(5, 'Title is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  visitType: z.nativeEnum(VisitType),
  department: z.nativeEnum(Department),
  roomId: z.string().optional(),
  notes: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function AppointmentNewPage() {
  const navigate = useNavigate();
  const patients = useStore((s) => s.patients);
  const doctors = useStore((s) => s.getDoctors());
  const rooms = useStore((s) => s.rooms);
  const addAppointment = useStore((s) => s.addAppointment);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: patients[0]?.id ?? '',
      doctorId: doctors[0]?.id ?? '',
      title: '',
      appointmentDate: new Date().toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '09:30',
      visitType: VisitType.CONSULTATION,
      department: Department.GENERAL_MEDICINE,
      roomId: rooms[0]?.id ?? '',
      notes: '',
    },
  });

  const availableRooms = useMemo(() => rooms, [rooms]);

  const onSubmit = (data: FormData) => {
    addAppointment({
      patientId: data.patientId,
      doctorId: data.doctorId,
      title: data.title,
      appointmentDate: new Date(`${data.appointmentDate}T${data.startTime}`),
      startTime: new Date(`${data.appointmentDate}T${data.startTime}`),
      endTime: new Date(`${data.appointmentDate}T${data.endTime}`),
      visitType: data.visitType,
      department: data.department,
      roomId: data.roomId || undefined,
      notes: data.notes || undefined,
      isEmergency: false,
    });
    navigate('/appointments');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Schedule Appointment</h1>
        <p className="text-sm text-slate-500 mt-1">Book a patient appointment with a doctor and room assignment.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Appointment details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label>Patient</Label>
              <Select {...register('patientId')}>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient.firstName} {patient.lastName}</option>
                ))}
              </Select>
              {errors.patientId && <p className="text-xs text-red-600 mt-1">{errors.patientId.message}</p>}
            </div>
            <div>
              <Label>Doctor</Label>
              <Select {...register('doctorId')}>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>Dr. {doctor.firstName} {doctor.lastName}</option>
                ))}
              </Select>
              {errors.doctorId && <p className="text-xs text-red-600 mt-1">{errors.doctorId.message}</p>}
            </div>
            <div>
              <Label>Title</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" {...register('appointmentDate')} />
                {errors.appointmentDate && <p className="text-xs text-red-600 mt-1">{errors.appointmentDate.message}</p>}
              </div>
              <div>
                <Label>Start time</Label>
                <Input type="time" {...register('startTime')} />
                {errors.startTime && <p className="text-xs text-red-600 mt-1">{errors.startTime.message}</p>}
              </div>
              <div>
                <Label>End time</Label>
                <Input type="time" {...register('endTime')} />
                {errors.endTime && <p className="text-xs text-red-600 mt-1">{errors.endTime.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Visit type</Label>
                <Select {...register('visitType')}>
                  {Object.values(VisitType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select {...register('department')}>
                  {Object.values(Department).map((department) => (
                    <option key={department} value={department}>{department.replace('_', ' ')}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Room</Label>
                <Select {...register('roomId')}>
                  <option value="">None</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.roomNumber}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea rows={4} {...register('notes')} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate('/appointments')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Schedule
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
