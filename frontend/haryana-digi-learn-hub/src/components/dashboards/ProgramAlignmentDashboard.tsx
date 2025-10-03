import { Card } from "@/components/ui/card";
import Plot from 'react-plotly.js';

const alignmentData = [
  { institute: 'JCBUST', regulatingPrograms: 10, councilsNumber: 5, councilsPercentage: 50, bachelorPrograms: 3 },
  { institute: 'GJU', regulatingPrograms: 5, councilsNumber: 3, councilsPercentage: 50, bachelorPrograms: 0 },
  { institute: 'Manav Rachna', regulatingPrograms: 10, councilsNumber: 8, councilsPercentage: 67, bachelorPrograms: 2 },
  { institute: 'DCRUST', regulatingPrograms: 12, councilsNumber: 6, councilsPercentage: 48, bachelorPrograms: 0 },
];

export const ProgramAlignmentDashboard = () => {
  const radarData = [{
    type: 'scatterpolar' as const,
    r: alignmentData.map(item => item.councilsPercentage),
    theta: alignmentData.map(item => item.institute),
    fill: 'toself',
    marker: { color: '#FF6B35' },
    name: 'Council Alignment %'
  }];

  const heatmapData = [{
    z: [
      alignmentData.map(item => item.regulatingPrograms),
      alignmentData.map(item => item.councilsNumber),
      alignmentData.map(item => item.bachelorPrograms),
    ],
    x: alignmentData.map(item => item.institute),
    y: ['Regulating Programs', 'Councils Number', 'Bachelor Programs'],
    type: 'heatmap' as const,
    colorscale: [
      [0, '#FEE2E2'],
      [0.5, '#FED7AA'],
      [1, '#FF6B35']
    ]
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
        <h3 className="text-xl font-bold text-foreground mb-4">Council Alignment Performance</h3>
        <Plot
          data={radarData}
          layout={{
            ...layout,
            title: 'Council Alignment by Institute',
            height: 400,
            polar: {
              radialaxis: {
                visible: true,
                range: [0, 100]
              }
            }
          }}
          config={{ displayModeBar: false }}
          className="w-full"
        />
      </Card>

      <Card className="p-6 shadow-card bg-gradient-card">
        <h3 className="text-xl font-bold text-foreground mb-4">Program Distribution Heatmap</h3>
        <Plot
          data={heatmapData}
          layout={{
            ...layout,
            title: 'Program Types Distribution',
            height: 400,
            xaxis: { title: 'Institutes' },
            yaxis: { title: 'Program Categories' },
          }}
          config={{ displayModeBar: false }}
          className="w-full"
        />
      </Card>
    </div>
  );
};