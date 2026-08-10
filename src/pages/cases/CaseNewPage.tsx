import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store';
import { CaseComplexity, Department, CaseStatus } from '../../types/enums';
import { COMPLEXITY_POINTS } from '../../data/constants';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Label } from '../../components/ui/Input';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  title: z.string().min(3, 'Case title is required'),
  description: z.string().min(10, 'Case description is required'),
  programId: z.string().min(1, 'Program is required'),
  waveId: z.string().optional(),
  department: z.nativeEnum(Department),
  complexity: z.nativeEnum(CaseComplexity),
  priority: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CaseNewPage() {
  const navigate = useNavigate();
  const programs = useStore((s) => s.programs);
  const waves = useStore((s) => s.waves);
  const createCase = useStore((s) => s.createCase);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      programId: programs[0]?.id ?? '',
      waveId: '',
      department: Department.GENERAL_MEDICINE,
      complexity: CaseComplexity.MEDIUM,
      priority: 'MEDIUM',
      tags: '',
    },
  });

  const selectedProgramId = watch('programId');

  const availableWaves = useMemo(
    () => waves.filter((wave) => wave.programId === selectedProgramId),
    [selectedProgramId, waves]
  );

  const onSubmit = (data: FormData) => {
    createCase({
      title: data.title,
      description: data.description,
      programId: data.programId,
      waveId: data.waveId || undefined,
      department: data.department,
      complexity: data.complexity,
      points: COMPLEXITY_POINTS[data.complexity] ?? 100,
      status: CaseStatus.OPEN,
      applicantCount: 0,
      priority: (data.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') || ('MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'),
      tags: data.tags ? data.tags.split(',').map((item) => item.trim()) : [],
    });
    navigate('/cases');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Open New Case</h1>
        <p className="text-sm text-slate-500 mt-1">Capture clinical details and assign this case to a program wave.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Case information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label>Title</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={4} {...register('description')} />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Program</Label>
                <Select {...register('programId')}>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>{program.name}</option>
                  ))}
                </Select>
                {errors.programId && <p className="text-xs text-red-600 mt-1">{errors.programId.message}</p>}
              </div>
              <div>
                <Label>Wave</Label>
                <Select {...register('waveId')}>
                  <option value="">Unassigned</option>
                  {availableWaves.map((wave) => (
                    <option key={wave.id} value={wave.id}>{wave.name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                <Select {...register('department')}>
                  {Object.values(Department).map((department) => (
                    <option key={department} value={department}>{department.replace('_', ' ')}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Complexity</Label>
                <Select {...register('complexity')}>
                  {Object.values(CaseComplexity).map((complexity) => (
                    <option key={complexity} value={complexity}>{complexity}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Input {...register('priority')} />
              </div>
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input {...register('tags')} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate('/cases')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create case
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
