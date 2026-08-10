import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../../store';
import { Gender, BloodGroup, MaritalStatus } from '../../types/enums';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { toastSuccess, toastError } from '../../lib/toast';

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.nativeEnum(Gender),
  phone: z.string().min(1, 'Phone is required'),
  alternatePhone: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  pincode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  bloodGroup: z.nativeEnum(BloodGroup).optional().nullable(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional().nullable(),
  occupation: z.string().optional().or(z.literal('')),
  emergencyContactName: z.string().optional().or(z.literal('')),
  emergencyContactPhone: z.string().optional().or(z.literal('')),
  emergencyContactRelation: z.string().optional().or(z.literal('')),
  insuranceProvider: z.string().optional().or(z.literal('')),
  insuranceNumber: z.string().optional().or(z.literal('')),
  insuranceExpiryDate: z.string().optional().or(z.literal('')),
  primaryDoctorId: z.string().optional().or(z.literal('')),
  allergies: z.string().optional().or(z.literal('')),
  chronicConditions: z.string().optional().or(z.literal('')),
  pastSurgeries: z.string().optional().or(z.literal('')),
  familyHistory: z.string().optional().or(z.literal('')),
  currentMedications: z.string().optional().or(z.literal('')),
  height: z.coerce.number().optional().nullable(),
  weight: z.coerce.number().optional().nullable(),
  bmi: z.coerce.number().optional().nullable(),
  isSmoker: z.boolean().optional(),
  drinksAlcohol: z.boolean().optional(),
  organDonor: z.boolean().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientNewPage() {
  const navigate = useNavigate();
  const addPatient = useStore((s) => s.addPatient);
  const users = useStore((s) => s.users);
  const doctors = users.filter((u) => u.role === 'DOCTOR');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: Gender.MALE,
      phone: '',
      alternatePhone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'USA',
      bloodGroup: null,
      maritalStatus: null,
      occupation: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      insuranceProvider: '',
      insuranceNumber: '',
      insuranceExpiryDate: '',
      primaryDoctorId: '',
      allergies: '',
      chronicConditions: '',
      pastSurgeries: '',
      familyHistory: '',
      currentMedications: '',
      height: null,
      weight: null,
      bmi: null,
      isSmoker: false,
      drinksAlcohol: false,
      organDonor: false,
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const patient = addPatient({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        phone: data.phone,
        alternatePhone: data.alternatePhone || undefined,
        email: data.email || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        pincode: data.pincode || undefined,
        country: data.country || undefined,
        bloodGroup: data.bloodGroup ?? undefined,
        maritalStatus: data.maritalStatus ?? undefined,
        occupation: data.occupation || undefined,
        emergencyContactName: data.emergencyContactName || undefined,
        emergencyContactPhone: data.emergencyContactPhone || undefined,
        emergencyContactRelation: data.emergencyContactRelation || undefined,
        insuranceProvider: data.insuranceProvider || undefined,
        insuranceNumber: data.insuranceNumber || undefined,
        insuranceExpiryDate: data.insuranceExpiryDate ? new Date(data.insuranceExpiryDate) : undefined,
        primaryDoctorId: data.primaryDoctorId || undefined,
        allergies: data.allergies ? data.allergies.split(',').map((s) => s.trim()) : undefined,
        chronicConditions: data.chronicConditions ? data.chronicConditions.split(',').map((s) => s.trim()) : undefined,
        pastSurgeries: data.pastSurgeries ? data.pastSurgeries.split(',').map((s) => s.trim()) : undefined,
        familyHistory: data.familyHistory ? data.familyHistory.split(',').map((s) => s.trim()) : undefined,
        currentMedications: data.currentMedications ? data.currentMedications.split(',').map((s) => s.trim()) : undefined,
        height: data.height ?? undefined,
        weight: data.weight ?? undefined,
        bmi: data.bmi ?? undefined,
        isSmoker: data.isSmoker,
        drinksAlcohol: data.drinksAlcohol,
        organDonor: data.organDonor,
      });
      toastSuccess('Patient registered', `${patient.firstName} ${patient.lastName}`);
      reset();
      navigate('/patients');
    } catch {
      toastError('Registration failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Register New Patient</h1>
          <p className="text-sm text-slate-500 mt-1">Enter patient demographics and contact details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input {...register('firstName')} />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label>Last Name</Label>
              <Input {...register('lastName')} />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" {...register('dateOfBirth')} />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <Label>Gender</Label>
              <Select {...register('gender')}>
                {Object.values(Gender).map((g) => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <Label>Alternate Phone</Label>
              <Input {...register('alternatePhone')} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Blood Group</Label>
              <Select {...register('bloodGroup')}>
                <option value="">None</option>
                {Object.values(BloodGroup).map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
            </div>
            <div>
              <Label>Marital Status</Label>
              <Select {...register('maritalStatus')}>
                <option value="">None</option>
                {Object.values(MaritalStatus).map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
            <div>
              <Label>Occupation</Label>
              <Input {...register('occupation')} />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input {...register('address')} />
            </div>
            <div>
              <Label>City</Label>
              <Input {...register('city')} />
            </div>
            <div>
              <Label>State</Label>
              <Input {...register('state')} />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input {...register('pincode')} />
            </div>
            <div>
              <Label>Country</Label>
              <Input {...register('country')} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Medical & Emergency</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Allergies (comma-separated)</Label>
              <Input {...register('allergies')} />
            </div>
            <div>
              <Label>Chronic Conditions (comma-separated)</Label>
              <Input {...register('chronicConditions')} />
            </div>
            <div>
              <Label>Past Surgeries (comma-separated)</Label>
              <Input {...register('pastSurgeries')} />
            </div>
            <div>
              <Label>Family History (comma-separated)</Label>
              <Input {...register('familyHistory')} />
            </div>
            <div>
              <Label>Current Medications (comma-separated)</Label>
              <Input {...register('currentMedications')} />
            </div>
            <div>
              <Label>Primary Doctor</Label>
              <Select {...register('primaryDoctorId')}>
                <option value="">None</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
              </Select>
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input type="number" {...register('height')} />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" {...register('weight')} />
            </div>
            <div>
              <Label>Emergency Contact Name</Label>
              <Input {...register('emergencyContactName')} />
            </div>
            <div>
              <Label>Emergency Contact Phone</Label>
              <Input {...register('emergencyContactPhone')} />
            </div>
            <div>
              <Label>Emergency Contact Relation</Label>
              <Input {...register('emergencyContactRelation')} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Insurance Provider</Label>
              <Input {...register('insuranceProvider')} />
            </div>
            <div>
              <Label>Insurance Number</Label>
              <Input {...register('insuranceNumber')} />
            </div>
            <div>
              <Label>Insurance Expiry Date</Label>
              <Input type="date" {...register('insuranceExpiryDate')} />
            </div>
          </CardContent>
        </Card>

        <CardFooter className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/patients')}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Register Patient</Button>
        </CardFooter>
      </form>
    </div>
  );
}
