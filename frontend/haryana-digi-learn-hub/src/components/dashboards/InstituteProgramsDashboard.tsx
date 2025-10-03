import { Card } from "@/components/ui/card";
import Plot from 'react-plotly.js';

const instituteData = [
  { name: 'JCBUST', totalPrograms: 20, ugPrograms: 2, ugPercentage: 10, bvocPrograms: 5 },
  { name: 'GJU', totalPrograms: 10, ugPrograms: 3, ugPercentage: 30, bvocPrograms: 1 },
  { name: 'Manav Rachna', totalPrograms: 15, ugPrograms: 0, ugPercentage: 0, bvocPrograms: 1 },
  { name: 'DCRUST', totalPrograms: 25, ugPrograms: 6, ugPercentage: 24, bvocPrograms: 3 },
];

export const InstituteProgramsDashboard = () => {
  const pieData = [{
    values: instituteData.map(inst => inst.totalPrograms),
    labels: instituteData.map(inst => inst.name),
    type: 'pie' as const,
    marker: {
      colors: ['#FF6B35', '#1E40AF', '#F59E0B', '#10B981']
    },
    textinfo: 'label+percent',
    textposition: 'auto',
  }];

  const barData = [{
    x: instituteData.map(inst => inst.name),
    y: instituteData.map(inst => inst.ugPrograms),
    type: 'bar' as const,
    marker: {
      color: '#FF6B35',
    },
    name: 'UG Programs'
  }, {
    x: instituteData.map(inst => inst.name),
    y: instituteData.map(inst => inst.bvocPrograms),
    type: 'bar' as const,
    marker: {
      color: '#1E40AF',
    },
    name: 'B.VOC Programs'
  }];

  const layout = {
    font: { family: 'Inter, sans-serif' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 40, r: 40, b: 40, l: 40 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 shadow-card bg-gradient-card">
        <h3 className="text-xl font-bold text-foreground mb-4">Total Programs Distribution</h3>
        <Plot
          data={pieData}
          layout={{
            ...layout,
            title: 'Programs by Institute',
            height: 400,
          }}
          config={{ displayModeBar: false }}
          className="w-full"
        />
      </Card>

      <Card className="p-6 shadow-card bg-gradient-card">
        <h3 className="text-xl font-bold text-foreground mb-4">UG vs B.VOC Programs</h3>
        <Plot
          data={barData}
          layout={{
            ...layout,
            title: 'Program Types Comparison',
            height: 400,
            barmode: 'group',
            xaxis: { title: 'Institutes' },
            yaxis: { title: 'Number of Programs' },
          }}
          config={{ displayModeBar: false }}
          className="w-full"
        />
      </Card>
    </div>
  );
};