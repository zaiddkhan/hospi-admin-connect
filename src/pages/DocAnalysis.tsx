import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Heart,
  Pill,
  Smartphone,
  TrendingUp,
  User,
  Utensils,
  Watch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";

interface ReadingStatus {
  value: number;
  unit: string;
  status: string;
  timestamp?: string;
  trend?: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "normal":
      case "good":
        return "bg-green-100 text-green-800";
      case "below_target":
        return "bg-orange-100 text-orange-800";
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

const EmptyState = ({ text = "No data available" }) => (
  <div className="text-sm text-gray-500 italic">{text}</div>
);

const ValueDisplay = ({ value, unit, status = null }) => {
  if (!value) return <EmptyState />;

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">
        {value} {unit}
      </span>
      {status && <StatusBadge status={status} />}
    </div>
  );
};

const DocAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    // Get analysis data from localStorage
    const storedData = localStorage.getItem("documentAnalysis");

    if (!storedData) {
      toast.error("No analysis data found");
      navigate("/upload");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
    } catch (error) {
      console.error("Error parsing analysis data:", error);
      toast.error("Error loading analysis data");
      navigate("/upload");
    }
  }, [navigate]);

  if (!analysisData) return null;

  const {
    patientInfo,
    glucoseMonitoring,
    bloodPressureMonitoring,
    medicationAdherence,
    lifestyleMetrics,
    riskAssessment,
  } = analysisData || {};

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/upload")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Medical Report Analysis
                  </h1>
                  <p className="text-sm text-gray-500">
                    Last updated: {patientInfo?.reportDate || "Not available"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{patientInfo?.name}</h2>
                  <p className="text-gray-500">
                    {patientInfo?.age} years • {patientInfo?.gender}
                    {patientInfo?.condition && ` • ${patientInfo.condition}`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(patientInfo?.deviceIntegration || {}).map(
                  ([device, status]) => (
                    <DeviceStatus key={device} status={status as string} />
                  )
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Glucose Monitoring</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fasting Glucose</span>
                  <ValueDisplay
                    value={glucoseMonitoring?.fastingGlucose?.value}
                    unit={glucoseMonitoring?.fastingGlucose?.unit}
                    status={glucoseMonitoring?.fastingGlucose?.status}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HbA1c</span>
                  <ValueDisplay
                    value={glucoseMonitoring?.hba1c?.value}
                    unit={glucoseMonitoring?.hba1c?.unit}
                    status={glucoseMonitoring?.hba1c?.status}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold">Blood Pressure</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Morning Reading</span>
                  {bloodPressureMonitoring?.morningReading?.systolic?.value ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {bloodPressureMonitoring.morningReading.systolic.value}/
                        {bloodPressureMonitoring.morningReading.diastolic.value}{" "}
                        mmHg
                      </span>
                      <StatusBadge
                        status={
                          bloodPressureMonitoring.morningReading.systolic.status
                        }
                      />
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Average</span>
                  {bloodPressureMonitoring?.weeklyAverage?.systolic ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {bloodPressureMonitoring.weeklyAverage.systolic}/
                        {bloodPressureMonitoring.weeklyAverage.diastolic} mmHg
                      </span>
                      <StatusBadge
                        status={bloodPressureMonitoring.weeklyAverage.status}
                      />
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Pill className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Medications</h3>
              </div>
              <div className="space-y-4">
                {medicationAdherence?.medications?.length > 0 ? (
                  <>
                    {medicationAdherence.medications.map((med: any) => (
                      <div
                        key={med.name}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-500">
                            {med.dosage} • {med.frequency}
                          </p>
                        </div>
                        <StatusBadge status={med.status} />
                      </div>
                    ))}
                    {medicationAdherence.nextRefill && (
                      <div className="pt-3 mt-3 border-t">
                        <p className="text-sm text-gray-500">
                          Next refill: {medicationAdherence.nextRefill}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState text="No medications recorded" />
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold">Lifestyle</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Steps</span>
                  {lifestyleMetrics?.physicalActivity?.dailySteps ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {lifestyleMetrics.physicalActivity.dailySteps}
                      </span>
                      <StatusBadge
                        status={lifestyleMetrics.physicalActivity.status}
                      />
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Diet Adherence</span>
                  {lifestyleMetrics?.diet?.adherenceToMealPlan ? (
                    <span className="font-medium">
                      {lifestyleMetrics.diet.adherenceToMealPlan}
                    </span>
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold">Risk Assessment</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cardiovascular Risk</span>
                  {riskAssessment?.cardiovascularRisk ? (
                    <StatusBadge status={riskAssessment.cardiovascularRisk} />
                  ) : (
                    <EmptyState />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Diabetic Complications</span>
                  {riskAssessment?.diabeticComplications ? (
                    <StatusBadge
                      status={riskAssessment.diabeticComplications}
                    />
                  ) : (
                    <EmptyState />
                  )}
                </div>
                {riskAssessment?.nextCheckupDue && (
                  <div className="pt-3 mt-3 border-t">
                    <p className="text-sm text-gray-500">
                      Next checkup: {riskAssessment.nextCheckupDue}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Clinical Assessment</h3>
            </div>
            {analysisData?.overallImpression ? (
              <p className="text-gray-700 whitespace-pre-line">
                {analysisData.overallImpression}
              </p>
            ) : (
              <EmptyState text="No clinical assessment available" />
            )}
          </Card>
        </main>
      </div>
    </AppLayout>
  );
};

export default DocAnalysis;
