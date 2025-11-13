"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Download, RefreshCw, Github, FileText, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { useAnalysisStore, useTeamStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalysisPage() {
  const params = useParams();
  const teamId = params.id as string;

  const { isAuthenticated } = useRequireAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentAnalysis = useAnalysisStore((state) => state.currentAnalysis);
  const analysisStatus = useAnalysisStore((state) => state.analysisStatus);
  const fetchAnalysisByTeam = useAnalysisStore((state) => state.fetchAnalysisByTeam);
  const startAnalysis = useAnalysisStore((state) => state.startAnalysis);
  const teams = useTeamStore((state) => state.teams);
  const fetchTeam = useTeamStore((state) => state.fetchTeam);

  const team = teams.find((t) => t.id === teamId);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeam(teamId);
      fetchAnalysisByTeam(teamId);
    }
  }, [isAuthenticated, teamId, fetchTeam, fetchAnalysisByTeam]);

  if (!isAuthenticated) {
    return null;
  }

  if (!team) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">팀을 찾을 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  // 분석 데이터가 없는 경우
  if (!currentAnalysis || analysisStatus === 'pending') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <BarChart3 className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">분석 결과가 없습니다</h2>
          <p className="text-muted-foreground">
            팀 활동을 분석하여 인사이트를 얻으세요
          </p>
          <Button onClick={handleStartAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 중... (약 2초 소요)
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                분석 시작
              </>
            )}
          </Button>
        </div>
      </MainLayout>
    );
  }

  const analysisData = {
    team: { id: teamId, name: team.name },
    status: currentAnalysis.status,
    analyzed_at: currentAnalysis.analyzed_at || new Date().toISOString(),
    github: currentAnalysis.github_data || [],
    notion: currentAnalysis.notion_data || [],
    ai_insights: currentAnalysis.ai_insights || "",
  };

  async function handleStartAnalysis() {
    setIsAnalyzing(true);
    try {
      await startAnalysis(teamId);
      toast({
        title: "분석 완료",
        description: "팀 활동 분석이 성공적으로 완료되었습니다.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "분석 실패",
        description: "분석 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  const githubChartData = analysisData.github.map((member) => ({
    name: member.user,
    커밋: member.commits,
    PR: member.prs,
    "코드 라인": Math.floor(member.code_lines / 100),
  }));

  const notionChartData = analysisData.notion.map((member) => ({
    name: member.user,
    페이지: member.pages,
    댓글: member.comments,
  }));

  const contributionPieData = analysisData.github.map((member, index) => ({
    name: member.user,
    value: member.commits + member.prs * 2,
  }));

  // 시간에 따른 활동 추이 Mock 데이터 (주간 데이터)
  const activityTrendData = [
    { week: 'Week 1', commits: 15, prs: 2, pages: 3 },
    { week: 'Week 2', commits: 22, prs: 4, pages: 5 },
    { week: 'Week 3', commits: 28, prs: 6, pages: 8 },
    { week: 'Week 4', commits: 35, prs: 8, pages: 12 },
    { week: 'Week 5', commits: 42, prs: 10, pages: 15 },
    { week: 'Week 6', commits: 48, prs: 12, pages: 18 },
  ];

  const handleDownloadPDF = () => {
    // Generate report content in Markdown format
    const reportContent = generateReportMarkdown(analysisData);

    // Create a Blob
    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${team.name}_분석결과_${new Date().toISOString().split('T')[0]}.md`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "다운로드 완료",
      description: "분석 결과가 Markdown 파일로 다운로드되었습니다.",
    });
  };

  const generateReportMarkdown = (data: typeof analysisData): string => {
    const date = new Date(data.analyzed_at).toLocaleString("ko-KR");

    let markdown = `# ${data.team.name} 팀 분석 결과\n\n`;
    markdown += `**분석 일시**: ${date}\n`;
    markdown += `**상태**: ${data.status === 'completed' ? '완료' : '진행 중'}\n\n`;

    markdown += `---\n\n`;

    // GitHub Analysis
    markdown += `## 📊 GitHub 분석\n\n`;
    markdown += `### 팀원별 기여도\n\n`;
    markdown += `| 팀원 | 커밋 수 | Pull Requests | 코드 라인 |\n`;
    markdown += `|------|---------|--------------|----------|\n`;

    data.github.forEach(member => {
      markdown += `| ${member.user} | ${member.commits} | ${member.prs} | ${member.code_lines} |\n`;
    });

    markdown += `\n### 팀원별 인사이트\n\n`;
    data.github.forEach(member => {
      markdown += `**${member.user}**\n`;
      markdown += `- ${member.insights}\n\n`;
    });

    // Notion Analysis
    markdown += `---\n\n`;
    markdown += `## 📝 Notion 분석\n\n`;
    markdown += `### 팀원별 활동\n\n`;
    markdown += `| 팀원 | 페이지 작성 | 댓글 |\n`;
    markdown += `|------|-----------|------|\n`;

    data.notion.forEach(member => {
      markdown += `| ${member.user} | ${member.pages} | ${member.comments} |\n`;
    });

    // AI Insights
    if (data.ai_insights) {
      markdown += `\n---\n\n`;
      markdown += `## 🤖 AI 종합 평가\n\n`;
      markdown += `${data.ai_insights}\n\n`;
    }

    // Team Statistics
    markdown += `---\n\n`;
    markdown += `## 📈 팀 통계\n\n`;

    const totalCommits = data.github.reduce((sum, m) => sum + m.commits, 0);
    const totalPRs = data.github.reduce((sum, m) => sum + m.prs, 0);
    const totalCodeLines = data.github.reduce((sum, m) => sum + m.code_lines, 0);
    const totalPages = data.notion.reduce((sum, m) => sum + m.pages, 0);
    const totalComments = data.notion.reduce((sum, m) => sum + m.comments, 0);

    markdown += `- **총 커밋 수**: ${totalCommits}\n`;
    markdown += `- **총 Pull Requests**: ${totalPRs}\n`;
    markdown += `- **총 코드 라인**: ${totalCodeLines}\n`;
    markdown += `- **총 Notion 페이지**: ${totalPages}\n`;
    markdown += `- **총 댓글**: ${totalComments}\n`;

    markdown += `\n---\n\n`;
    markdown += `*Generated by GoodLab - 팀 프로젝트 협업 관리 플랫폼*\n`;
    markdown += `*Report generated on ${new Date().toLocaleString("ko-KR")}*\n`;

    return markdown;
  };

  const handleReanalyze = async () => {
    await handleStartAnalysis();
  };

  // AI 인사이트를 팀원별로 분리
  const memberInsights = analysisData.github.reduce((acc, member) => {
    acc[member.user] = member.insights;
    return acc;
  }, {} as Record<string, string>);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              팀 {analysisData.team.name} - 분석 결과
            </h1>
            <p className="text-muted-foreground">
              분석 일시:{" "}
              {new Date(analysisData.analyzed_at).toLocaleString("ko-KR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReanalyze}>
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 분석
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF 다운로드
            </Button>
          </div>
        </div>

        {/* GitHub Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub 분석
            </CardTitle>
            <CardDescription>
              커밋, Pull Request, 코드 기여도 분석
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Table */}
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">팀원</th>
                    <th className="p-3 text-center font-medium">커밋 수</th>
                    <th className="p-3 text-center font-medium">PR</th>
                    <th className="p-3 text-center font-medium">코드 라인</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.github.map((member, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 font-medium">{member.user}</td>
                      <td className="p-3 text-center">{member.commits}</td>
                      <td className="p-3 text-center">{member.prs}</td>
                      <td className="p-3 text-center text-green-600">
                        +{member.code_lines.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={githubChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="커밋" fill="#3b82f6" />
                  <Bar dataKey="PR" fill="#10b981" />
                  <Bar dataKey="코드 라인" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Notion Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notion 분석
            </CardTitle>
            <CardDescription>
              페이지 작성, 댓글 기여도 분석
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Table */}
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">팀원</th>
                    <th className="p-3 text-center font-medium">페이지 작성</th>
                    <th className="p-3 text-center font-medium">댓글</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.notion.map((member, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 font-medium">{member.user}</td>
                      <td className="p-3 text-center">{member.pages}</td>
                      <td className="p-3 text-center">{member.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="페이지" fill="#8b5cf6" />
                  <Bar dataKey="댓글" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Trend Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>주간 활동 추이</CardTitle>
            <CardDescription>
              시간에 따른 팀의 GitHub 및 Notion 활동 변화
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrendData}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPRs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="commits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCommits)" name="커밋" />
                  <Area type="monotone" dataKey="prs" stroke="#10b981" fillOpacity={1} fill="url(#colorPRs)" name="PR" />
                  <Area type="monotone" dataKey="pages" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPages)" name="Notion 페이지" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Overall Contribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>전체 기여도 비율</CardTitle>
            <CardDescription>
              커밋과 PR을 기준으로 한 기여도 분포
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contributionPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>🤖 AI 종합 평가</CardTitle>
            <CardDescription>
              팀원별 활동 분석 및 인사이트
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 전체 인사이트 */}
              {analysisData.ai_insights && (
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <p className="font-medium mb-1">팀 전체 평가</p>
                  <p className="text-sm text-muted-foreground">{analysisData.ai_insights}</p>
                </div>
              )}

              {/* 팀원별 인사이트 */}
              {Object.entries(memberInsights).map(([name, insight]) => (
                <div key={name} className="border-l-4 border-primary pl-4">
                  <p className="font-medium mb-1">{name}</p>
                  <p className="text-sm text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
