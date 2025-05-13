import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  FileText,
  Heart,
  Microscope,
  Pill,
  Smartphone,
  TrendingUp,
  User,
  Utensils,
  Watch,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { cleanAnalysisData } from "@/lib/utils";

const EmptyState = ({ text = "No data available" }) => (
  <div className="text-sm text-gray-500 italic">{text}</div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "high":
      case "reactive":
        return "bg-red-100 text-red-800";
      case "low":
      case "borderline":
        return "bg-yellow-100 text-yellow-800";
      case "normal":
      case "good":
      case "non-reactive":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status?.replace("_", " ") || "N/A"}
    </span>
  );
};

const DeviceStatus: React.FC<{ status: string }> = ({ status }) => {
  const isConnected = status === "Connected";
  return (
    <div
      className={`flex items-center gap-2 ${
        isConnected ? "text-green-600" : "text-gray-400"
      }`}
    >
      <Smartphone className="h-4 w-4" />
      <span className="text-sm">{status}</span>
    </div>
  );
};

const TestResult: React.FC<{
  test: string;
  result: string;
  unit?: string;
  referenceRange?: string;
}> = ({ test, result, unit, referenceRange }) => {
  // Determine if the result is within, above, or below reference range
  const getStatus = () => {
    if (!referenceRange) return "normal";
    const numericResult = parseFloat(result);
    if (isNaN(numericResult)) return "normal";

    if (referenceRange.includes("-")) {
      const [min, max] = referenceRange
        .split("-")
        .map((n) => parseFloat(n.trim()));
      if (numericResult < min) return "low";
      if (numericResult > max) return "high";
      return "normal";
    }

    if (referenceRange.startsWith("<")) {
      const max = parseFloat(referenceRange.substring(1).trim());
      return numericResult > max ? "high" : "normal";
    }

    if (referenceRange.startsWith(">")) {
      const min = parseFloat(referenceRange.substring(1).trim());
      return numericResult < min ? "low" : "normal";
    }

    return "normal";
  };

  const status = getStatus();
  const statusColors = {
    normal: "bg-green-50 border-green-200",
    high: "bg-red-50 border-red-200",
    low: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div
      className={`flex flex-col space-y-2 p-4 rounded-lg border ${statusColors[status]} transition-colors duration-200 hover:shadow-sm`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">{test}</h4>
            <StatusBadge status={status} />
          </div>
          {referenceRange && (
            <p className="text-sm text-gray-500 mt-1">
              Reference Range: {referenceRange}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span
              className={`font-medium text-lg ${
                status === "high"
                  ? "text-red-600"
                  : status === "low"
                  ? "text-yellow-600"
                  : "text-gray-900"
              }`}
            >
              {result}
            </span>
            {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("documentAnalysis"));
    if (rawData) {
      const cleanedData = cleanAnalysisData(rawData);
      setAnalysisData(JSON.parse(cleanedData));
    }
  }, []);

  if (!analysisData) return null;

  const {
    patientIdentification,
    dateAndTime,
    procedureDetails,
    findingsAndResults,
    interpretation,
    recommendations,
    authentication,
    deviceIntegration,
    overallImpression,
  } = analysisData;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/upload")}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {procedureDetails?.testType || "Medical Report"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Generated: {dateAndTime?.reportGenerated || "Not available"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 max-w-7xl mx-auto">
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-indigo-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-indigo-900">
                      {patientIdentification?.name}
                    </h2>
                    <p className="text-indigo-700">
                      {patientIdentification?.age} years •{" "}
                      {patientIdentification?.gender}
                      {patientIdentification?.medicalRecordNumber &&
                        ` • MRN: ${patientIdentification.medicalRecordNumber}`}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(deviceIntegration || {}).map(
                    ([device, status]) => (
                      <DeviceStatus key={device} status={status as string} />
                    )
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 p-2 rounded-full">
                  <Microscope className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Procedure Details</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Test Type
                  </span>
                  <p className="font-medium mt-1">
                    {procedureDetails?.testType}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-500">
                    Methodology
                  </span>
                  <p className="font-medium mt-1">
                    {procedureDetails?.methodology}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <span className="text-sm font-medium text-gray-500">
                    Equipment
                  </span>
                  <p className="font-medium mt-1">
                    {procedureDetails?.equipmentUsed}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-blue-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Interpretation
                  </h3>
                </div>
                <div className="space-y-4">
                  {interpretation?.significantFindings && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-blue-800 leading-relaxed">
                        {interpretation.significantFindings}
                      </p>
                    </div>
                  )}
                  {recommendations?.additionalTesting && (
                    <div className="pt-4 mt-4 border-t border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Recommendations
                      </p>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-blue-800 leading-relaxed">
                          {recommendations.additionalTesting}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-amber-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    Authentication
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-amber-800">
                      Authorized by
                    </p>
                    <p className="font-medium text-amber-900">
                      {authentication?.providerSignature}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-amber-800">
                      Credentials
                    </p>
                    <p className="font-medium text-amber-900">
                      {authentication?.credentials}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Test Results</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
                    <span>Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                    <span>High</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                {findingsAndResults?.otherMeasurements?.map((test, index) => (
                  <TestResult
                    key={index}
                    test={test?.test || test?.testName}
                    result={test.result || test.value}
                    unit={test.unit}
                    referenceRange={test.referenceRange}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-emerald-50/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900">
                  Overall Assessment
                </h3>
              </div>
              <div className="prose prose-sm max-w-none">
                {overallImpression ? (
                  <p className="text-emerald-800 leading-relaxed">
                    {overallImpression}
                  </p>
                ) : (
                  <EmptyState />
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default DocAnalysis;
