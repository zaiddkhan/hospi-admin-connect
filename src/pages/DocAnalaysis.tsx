import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import AppLayout from "@/components/layout/AppLayout";
import { cleanAnalysisData } from "@/lib/utils";

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
      {status?.replace("_", " ")}
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

const DocAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<any>(null);
  console.log('analysisData :', analysisData);

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("documentAnalysis"));

    console.log(rawData);
    if (rawData) {
      console.log(" Inside if:");
      const cleanedData = cleanAnalysisData(rawData);
      setAnalysisData(JSON.parse(cleanedData));
      console.log("cleanedData :", JSON.parse(cleanedData));
    }
  }, []);

  if (!analysisData) return null;

  const {
    patientInfo,
    glucoseMonitoring,
    bloodPressureMonitoring,
    medicationAdherence,
    lifestyleMetrics,
    riskAssessment,
  } = analysisData;
  console.log("patientInfo :", patientInfo);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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
                    Chronic Care Monitoring
                  </h1>
                  <p className="text-sm text-gray-500">
                    Last updated: {patientInfo?.reportDate}
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
                    {patientInfo?.age} years • {patientInfo?.gender} •{" "}
                    {patientInfo?.condition}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object?.entries(patientInfo?.deviceIntegration).map(
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
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {glucoseMonitoring?.fastingGlucose?.value}{" "}
                      {glucoseMonitoring?.fastingGlucose?.unit}
                    </span>
                    <StatusBadge
                      status={glucoseMonitoring?.fastingGlucose?.status}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HbA1c</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {glucoseMonitoring?.hba1c?.value}{" "}
                      {glucoseMonitoring?.hba1c?.unit}
                    </span>
                    <StatusBadge status={glucoseMonitoring?.hba1c?.status} />
                  </div>
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
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {bloodPressureMonitoring?.morningReading?.systolic?.value}/
                      {bloodPressureMonitoring?.morningReading?.diastolic.value}{" "}
                      mmHg
                    </span>
                    <StatusBadge
                      status={
                        bloodPressureMonitoring?.morningReading?.systolic?.status
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Average</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {bloodPressureMonitoring?.weeklyAverage?.systolic}/
                      {bloodPressureMonitoring?.weeklyAverage?.diastolic} mmHg
                    </span>
                    <StatusBadge
                      status={bloodPressureMonitoring?.weeklyAverage?.status}
                    />
                  </div>
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
                {medicationAdherence?.medications?.map((med: any) => (
                  <div
                    key={med?.name}
                    className="flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium">{med?.name}</p>
                      <p className="text-sm text-gray-500">
                        {med?.dosage} • {med?.frequency}
                      </p>
                    </div>
                    <StatusBadge status={med?.status} />
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t">
                  <p className="text-sm text-gray-500">
                    Next refill: {medicationAdherence?.nextRefill}
                  </p>
                </div>
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
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {lifestyleMetrics?.physicalActivity?.dailySteps}
                    </span>
                    <StatusBadge
                      status={lifestyleMetrics?.physicalActivity?.status}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Diet Adherence</span>
                  <span className="font-medium">
                    {lifestyleMetrics?.diet?.adherenceToMealPlan}
                  </span>
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
                  <StatusBadge status={riskAssessment?.cardiovascularRisk} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Diabetic Complications</span>
                  <StatusBadge status={riskAssessment?.diabeticComplications} />
                </div>
                <div className="pt-3 mt-3 border-t">
                  <p className="text-sm text-gray-500">
                    Next checkup: {riskAssessment?.nextCheckupDue}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Clinical Assessment</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {analysisData?.overallImpression}
            </p>
          </Card>
        </main>
      </div>
    </AppLayout>
  );
};

export default DocAnalysis;
