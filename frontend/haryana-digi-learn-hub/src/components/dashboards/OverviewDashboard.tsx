import { Card } from "@/components/ui/card";
import Plot from 'react-plotly.js';
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react';

const summaryStats = {
  totalInstitutes: 4,
  totalPrograms: 70,
  averageCompliance: 16,
  totalBVOCPrograms: 10
};

export const OverviewDashboard = () => {
  const trendData = [{
    x: ['JCBUST', 'GJU', 'Manav Rachna', 'DCRUST'],
    y: [20, 10, 15, 25],
    type: 'scatter' as const,
    mode: 'lines+markers',
    marker: { color: '#FF6B35', size: 10 },
    line: { color: '#FF6B35', width: 3 },
    name: 'Total Programs'
  }];

  const donutData = [{
    values: [10, 30, 0, 24, 36],
    labels: ['JCBUST (10%)', 'GJU (30%)', 'Manav Rachna (0%)', 'DCRUST (24%)', 'Remaining (36%)'],
    type: 'pie' as const,
    hole: 0.4,
    marker: {
      colors: ['#FF6B35', '#1E40AF', '#EF4444', '#10B981', '#F59E0B']
    },
    textinfo: 'label',
    textposition: 'auto',
  }];

  const layout = {
    font: { family: 'Inter, sans-serif' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 40, r: 40, b: 40, l: 40 },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Institutes</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.totalInstitutes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Programs</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.totalPrograms}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-accent/20">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Compliance</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.averageCompliance}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">B.VOC Programs</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.totalBVOCPrograms}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card bg-gradient-card">
          <h3 className="text-xl font-bold text-foreground mb-4">Program Trends</h3>
          <Plot
            data={trendData}
            layout={{
              ...layout,
              title: 'Total Programs by Institute',
              height: 400,
              xaxis: { title: 'Institutes' },
              yaxis: { title: 'Number of Programs' },
            }}
            config={{ displayModeBar: false }}
            className="w-full"
          />
        </Card>

        <Card className="p-6 shadow-card bg-gradient-card">
          <h3 className="text-xl font-bold text-foreground mb-4">Compliance Distribution</h3>
          <Plot
            data={donutData}
            layout={{
              ...layout,
              title: 'UGC Compliance Percentage',
              height: 400,
              showlegend: false,
            }}
            config={{ displayModeBar: false }}
            className="w-full"
          />
        </Card>
      </div>
    </div>
  );
};