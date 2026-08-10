import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function ReportsPage() {
  const programs = useStore((s) => s.programs);
  const waves = useStore((s) => s.waves);
  const cases = useStore((s) => s.cases);
  const reviews = useStore((s) => s.reviews);

  const programCounts = useMemo(() => {
    return programs.map((program) => ({
      name: program.name,
      waves: waves.filter((wave) => wave.programId === program.id).length,
      cases: cases.filter((c) => c.programId === program.id).length,
    }));
  }, [programs, waves, cases]);

  const reviewsPerProgram = useMemo(() => {
    return programs.map((program) => ({
      name: program.name,
      reviewCount: cases
        .filter((c) => c.programId === program.id)
        .reduce((sum, theCase) => sum + reviews.filter((review) => review.caseId === theCase.id).length, 0),
    }));
  }, [programs, cases, reviews]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor program performance, wave throughput, and review coverage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total programs</CardTitle>
          </CardHeader>
          <CardContent>{programs.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total waves</CardTitle>
          </CardHeader>
          <CardContent>{waves.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total cases</CardTitle>
          </CardHeader>
          <CardContent>{cases.length}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program review coverage</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reviewsPerProgram} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviewCount" name="Reviews" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programCounts.map((row) => (
              <div key={row.name} className="rounded-xl border border-slate-200 p-4 bg-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{row.name}</p>
                    <p className="text-sm text-slate-500">{row.waves} wave(s) • {row.cases} case(s)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
