import { Card } from "@/components/ui/card";
import Plot from 'react-plotly.js';

const complianceData = [
  { institute: 'JCBUST', ugcCompliant: 2, nonCompliant: 18, complianceRate: 10 },
  { institute: 'GJU', ugcCompliant: 3, nonCompliant: 7, complianceRate: 30 },
  { institute: 'Manav Rachna', ugcCompliant: 0, nonCompliant: 15, complianceRate: 0 },
  { institute: 'DCRUST', ugcCompliant: 6, nonCompliant: 19, complianceRate: 24 },
];

export const ComplianceDashboard = () => {
  const gaugeData = complianceData.map((item, index) => ({
    type: 'indicator' as const,
    mode: 'gauge+number+delta',
    value: item.complianceRate,
    domain: { 
      x: [index % 2 * 0.5, (index % 2 + 1) * 0.5], 
      y: [Math.floor(index / 2) * 0.5, (Math.floor(index / 2) + 1) * 0.5] 
    },
    title: { text: item.institute, font: { size: 16 } },
    gauge: {
      axis: { range: [null, 100] },
      bar: { color: "#FF6B35" },
      steps: [
        { range: [0, 25], color: "#FEE2E2" },
        { range: [25, 50], color: "#FED7AA" },
        { range: [50, 75], color: "#D1FAE5" },
        { range: [75, 100], color: "#A7F3D0" }
      ],
      threshold: {
        line: { color: "#1E40AF", width: 4 },
        thickness: 0.75,
        value: 50
      }
    }
  }));

  const stackedBarData = [{
    x: complianceData.map(item => item.institute),
    y: complianceData.map(item => item.ugcCompliant),
    type: 'bar' as const,
    name: 'UGC Compliant',
    marker: { color: '#10B981' }
  }, {
    x: complianceData.map(item => item.institute),
    y: complianceData.map(item => item.nonCompliant),
    type: 'bar' as const,
    name: 'Non-Compliant',
    marker: { color: '#EF4444' }
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
        <h3 className="text-xl font-bold text-foreground mb-4">UGC Compliance Rates</h3>
        <Plot
          data={gaugeData}
          layout={{
            ...layout,
            height: 400,
            title: 'Compliance Performance',
            grid: { rows: 2, columns: 2, pattern: 'independent' }
          }}
          config={{ displayModeBar: false }}
          className="w-full"
        />
      </Card>

      <Card className="p-6 shadow-card bg-gradient-card">
        <h3 className="text-xl font-bold text-foreground mb-4">Compliance Breakdown</h3>
        <Plot
          data={stackedBarData}
          layout={{
            ...layout,
            title: 'Compliant vs Non-Compliant Programs',
            height: 400,
            barmode: 'stack',
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