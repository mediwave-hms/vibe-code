import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Input, Label } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

const schema = z.object({
  reviewerId: z.string().min(1, 'Reviewer is required'),
  revieweeId: z.string().min(1, 'Reviewee is required'),
  overallRating: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  quality: z.number().min(1).max(5),
  timeliness: z.number().min(1).max(5),
  comment: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ReviewSubmitPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const theCase = useStore((s) => s.cases.find((item) => item.id === caseId));
  const users = useStore((s) => s.users);
  const submitReview = useStore((s) => s.submitReview);

  const reviewerOptions = useMemo(
    () => users.filter((user) => user.role === 'DOCTOR' || user.role === 'NURSE'),
    [users]
  );

  const revieweeOptions = useMemo(
    () => users.filter((user) => user.role !== 'PATIENT'),
    [users]
  );

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      reviewerId: reviewerOptions[0]?.id ?? '',
      revieweeId: revieweeOptions[0]?.id ?? '',
      overallRating: 5,
      communication: 5,
      quality: 5,
      timeliness: 5,
      comment: '',
    },
  });

  if (!theCase) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <EmptyState
          icon={<span className="text-4xl">📝</span>}
          title="Review case not found"
          description="Select a case from the review queue to submit feedback."
        />
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    submitReview(
      theCase.id,
      data.reviewerId,
      data.revieweeId,
      data.overallRating,
      {
        communication: data.communication,
        quality: data.quality,
        timeliness: data.timeliness,
      },
      data.comment || undefined
    );
    navigate('/reviews');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submit Review</h1>
        <p className="text-sm text-slate-500 mt-1">Provide feedback for the clinical case workflow.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-slate-900 font-medium">{theCase.title}</div>
            <div className="text-sm text-slate-500">{theCase.description}</div>
            <div className="text-xs text-slate-500">Status: {theCase.status}</div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Review details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <Label>Reviewer</Label>
              <Select {...register('reviewerId')}>
                {reviewerOptions.map((user) => (
                  <option key={user.id} value={user.id}>{user.firstName} {user.lastName} ({user.role})</option>
                ))}
              </Select>
              {errors.reviewerId && <p className="text-xs text-red-600 mt-1">{errors.reviewerId.message}</p>}
            </div>
            <div>
              <Label>Reviewee</Label>
              <Select {...register('revieweeId')}>
                {revieweeOptions.map((user) => (
                  <option key={user.id} value={user.id}>{user.firstName} {user.lastName} ({user.role})</option>
                ))}
              </Select>
              {errors.revieweeId && <p className="text-xs text-red-600 mt-1">{errors.revieweeId.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Overall</Label>
                <Input type="number" min={1} max={5} {...register('overallRating', { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Communication</Label>
                <Input type="number" min={1} max={5} {...register('communication', { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Quality</Label>
                <Input type="number" min={1} max={5} {...register('quality', { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Timeliness</Label>
                <Input type="number" min={1} max={5} {...register('timeliness', { valueAsNumber: true })} />
              </div>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea rows={4} {...register('comment')} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate('/reviews')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit review
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
