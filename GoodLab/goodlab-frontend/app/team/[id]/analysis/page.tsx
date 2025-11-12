"use client";

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
import { BarChart3, Download, RefreshCw, Github, FileText } from "lucide-react";
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
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalysisPage() {
  const params = useParams();
  const teamId = params.id as string;

  // TODO: Replace with actual data from store
  const analysisData = {
    team: { id: teamId, name: "팀 A" },
    status: "completed" as const,
    analyzed_at: "2026-03-15T10:30:00Z",
    github: [
      { name: "김철수", commits: 45, prs: 12, code_lines: 2340 },
      { name: "이영희", commits: 38, prs: 10, code_lines: 1890 },
      { name: "박민수", commits: 22, prs: 5, code_lines: 780 },
    ],
    notion: [
      { name: "김철수", pages: 8, comments: 24 },
      { name: "이영희", pages: 12, comments: 35 },
      { name: "박민수", pages: 6, comments: 18 },
    ],
    insights: {
      "김철수": "코드 기여도가 높으며 문서화 작업도 우수합니다. PR 리뷰에도 적극적으로 참여하고 있습니다.",
      "이영희": "전반적으로 균형잡힌 기여를 보이고 있습니다. 특히 Notion 문서 작성과 팀 협업에 뛰어납니다.",
      "박민수": "코드 기여도가 다소 낮습니다. 향후 더 적극적인 참여가 필요합니다.",
    },
  };

  const githubChartData = analysisData.github.map((member) => ({
    name: member.name,
    커밋: member.commits,
    PR: member.prs,
    "코드 라인": Math.floor(member.code_lines / 100),
  }));

  const notionChartData = analysisData.notion.map((member) => ({
    name: member.name,
    페이지: member.pages,
    댓글: member.comments,
  }));

  const contributionPieData = analysisData.github.map((member, index) => ({
    name: member.name,
    value: member.commits + member.prs * 2,
  }));

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert("PDF 다운로드 기능 (백엔드 연동 필요)");
  };

  const handleReanalyze = () => {
    // TODO: Implement reanalysis
    alert("재분석 기능 (백엔드 연동 필요)");
  };

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
                      <td className="p-3 font-medium">{member.name}</td>
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
                      <td className="p-3 font-medium">{member.name}</td>
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
              {Object.entries(analysisData.insights).map(([name, insight]) => (
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
