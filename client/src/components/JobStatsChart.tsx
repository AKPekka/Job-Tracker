import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { JobStats } from '@/lib/api';
import { Card, Heading, Text } from '@chakra-ui/react';

interface JobStatsChartProps {
  stats: JobStats;
}

const STAGE_COLORS: { [key: string]: string } = {
  SAVED: '#718096', // gray
  APPLIED: '#4299E1', // blue
  PHONE_SCREEN: '#ED8936', // orange
  INTERVIEW: '#9F7AEA', // purple
  OFFER: '#48BB78', // green
  REJECTED: '#F56565', // red
};

const STAGE_ORDER = ['SAVED', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED'];

export function JobStatsChart({ stats }: JobStatsChartProps) {
  const chartData = STAGE_ORDER.map(stage => ({
    name: stage.replace('_', ' '),
    count: stats.jobsByStage[stage] || 0,
    color: STAGE_COLORS[stage],
  })).filter(item => item.count > 0);

  if (chartData.length === 0) {
    return (
        <Card.Root p={6} variant="outline">
            <Card.Body>
                <Heading size="md" mb={4}>Job Pipeline</Heading>
                <Text color="fg.muted">No job data to display yet. Add a job to see your pipeline!</Text>
            </Card.Body>
        </Card.Root>
    )
  }

  return (
    <Card.Root p={6} variant="outline">
        <Card.Body>
            <Heading size="md" mb={4}>Job Pipeline</Heading>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-border)" />
                <XAxis dataKey="name" stroke="var(--chakra-colors-fg-muted)" />
                <YAxis stroke="var(--chakra-colors-fg-muted)" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--chakra-colors-bg-muted)',
                        borderColor: 'var(--chakra-colors-border)',
                        color: 'var(--chakra-colors-fg)',
                    }}
                />
                <Bar dataKey="count">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </Card.Body>
    </Card.Root>
  );
} 