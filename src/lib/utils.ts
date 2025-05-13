import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pdfToText from "react-pdftotext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractPDFText = async (
  files: File[],
  comments: string
): Promise<any> => {
  try {
    if (!files || files.length === 0) {
      return ["Please upload a file in proper format"];
    }

    const file = files[0];
    const text = await pdfToText(file);

    if (!text) {
      return { error: 1 };
    }

    console.log("text PDF reader:", text);
    return [
      `==== PDF DOCUMENT: ${file.name} ====\n\n${text}\n\n==== END OF ${file.name} ====`,
    ];

    // const results = await Promise.all(
    //   files.map(async (file) => {
    //     console.log(`Starting PDF extraction for ${file.name}`);
    //     try {
    //       // Try to read PDF as text - this is a fallback approach without using PDF.js
    //       const text = await file.text();

    //       // Basic check if this looks like a PDF
    //       if (text.substring(0, 5) === "%PDF-") {
    //         console.log(`Successfully identified PDF format for ${file.name}`);
    //         return `==== PDF DOCUMENT: ${file.name} ====\n\n${text}\n\n==== END OF ${file.name} ====`;
    //       } else {
    //         return `==== DOCUMENT: ${file.name} ====\n\n${text}\n\n==== END OF ${file.name} ====`;
    //       }
    //     } catch (error: any) {
    //       console.error(`Error extracting text from PDF ${file.name}:`, error);
    //       return `[Error extracting text from ${file.name}: ${error.message}]`;
    //     }
    //   })
    // );
    // console.log("results of extraction:", results);
    // return results;
  } catch (error: any) {
    console.error("Error processing files:", error);
    return [`Error processing files: ${error.message}`];
  }
};

export async function callGeminiAPI(
  prompt: string,
  temperature = 0.3,
  maxTokens = 4000
): Promise<string> {
  console.log("prompt inside gemini:", prompt);
  try {
    console.log(
      "API",
      `Calling Google Gemini 2.0 Flash API with ${prompt.length} character prompt`
    );

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA_EJIr4YJMnBXokQpKYiz4Enceeflp12U`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract text from Gemini response
    const responseText = response.data.candidates[0].content.parts[0].text;
    console.log("responseText :", responseText);
    return responseText;
  } catch (error: any) {
    console.error(
      "Error calling Google Gemini API:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to call Google Gemini API: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
}

export const analyzeDocumentsPrompt = (document: any) => {
  return `
  You are a medical data extractor. Your job is to read the provided medical document and extract the key patient information in a clear, human-readable format.

  Document to analyze: ${JSON.stringify(document)}

  Please extract and present the following information:
  1. Basic patient details (name, age, gender)
  2. Medical conditions
  3. Key measurements (blood pressure, glucose, etc.) with their values and units
  4. Current medications with dosages
  5. Lifestyle information
  6. Risk factors
  7. Doctor's assessment
  8. Upcoming appointments

  Format the information in simple, readable sections with appropriate headings. Highlight abnormal values (high/low) where relevant. Only include information that is clearly present in the document - do not make assumptions about missing data.
  

  Return a JSON object with the following structure:
{
  "patientInfo": {
    "name": "Full patient name",
    "age": "Age in years (numeric only)",
    "gender": "Patient gender",
    "condition": "Primary medical condition",
    "reportDate": "Date of the report in readable format",
    "deviceIntegration": {
      "Mobile": "Connected or Not Connected",
      "Tablet": "Connected or Not Connected",
      "Desktop": "Connected or Not Connected"
    }
  },
  "glucoseMonitoring": {
    "fastingGlucose": {
      "value": numeric value,
      "unit": "mg/dL",
      "status": "high/normal/low"
    },
    "hba1c": {
      "value": numeric value,
      "unit": "%",
      "status": "high/normal/low"
    }
  },
  "bloodPressureMonitoring": {
    "morningReading": {
      "systolic": {
        "value": numeric value,
        "status": "high/normal/low"
      },
      "diastolic": {
        "value": numeric value
      }
    },
    "weeklyAverage": {
      "systolic": numeric value,
      "diastolic": numeric value,
      "status": "high/normal/low"
    }
  },
  "medicationAdherence": {
    "medications": [
      {
        "name": "Medication name",
        "dosage": "Dosage info",
        "frequency": "Frequency info",
        "status": "good/below_target"
      }
    ],
    "nextRefill": "Next refill date"
  },
  "lifestyleMetrics": {
    "physicalActivity": {
      "dailySteps": numeric value,
      "status": "good/below_target"
    },
    "diet": {
      "adherenceToMealPlan": "Percentage or description"
    }
  },
  "riskAssessment": {
    "cardiovascularRisk": "moderate/low/high",
    "diabeticComplications": "low/moderate/high",
    "nextCheckupDue": "Next checkup date"
  },
  "overallImpression": "Detailed clinical assessment text"
}

Important guidelines:
1. Use the EXACT field names shown above
2. For missing data, use reasonable defaults based on available information
3. Status values must be one of: "high", "low", "normal", "good", "below_target", "moderate"
4. Ensure all numeric values are actual numbers without units (units are separate fields)
5. DO NOT add any explanatory text outside the JSON object
6. Only return valid JSON that can be parsed with JSON.parse()
7. Format dates as readable strings (e.g., "May 15, 2025")
8. If a field is not present in the given pdf make up the value but make sure you send all of the values given in the JSON in a string
9. Return {the specified json}
10. Do not add anything else do not add delimeter or json or \n in your reply just a single object 


  `;
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const MAX_FILES = 10;
export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
  "image/*": [".png", ".jpg", ".jpeg"], // More permissive for images
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/markdown": [".md"],
};
// Format file size
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export const cleanAnalysisData = (data) => {
  try {
    if (!data) {
      console.error("No data provided to cleanAnalysisData");
      return "null";
    }

    console.log("data:", data);

    let outputString = data.replace("```json", "").replace("```", "").trim();
    console.log("outputString :", outputString);
    console.log("for default", JSON.stringify(outputString));
    return outputString;
  } catch (error) {
    console.log("error parsing:", error);

    // If all else fails, create a minimal valid object
    return JSON.stringify({
      patientInfo: {
        name: "Sourav dey",
        age: "23",
        gender: "Male",
        condition: "Unknown",
        reportDate: "October 18, 2024",
        deviceIntegration: {
          Mobile: "Not Connected",
          Tablet: "Not Connected",
          Desktop: "Not Connected",
        },
      },
      glucoseMonitoring: {
        fastingGlucose: {
          value: 90,
          unit: "mg/dL",
          status: "normal",
        },
        hba1c: {
          value: 5.5,
          unit: "%",
          status: "normal",
        },
      },
      bloodPressureMonitoring: {
        morningReading: {
          systolic: {
            value: 120,
            status: "normal",
          },
          diastolic: {
            value: 80,
          },
        },
        weeklyAverage: {
          systolic: 120,
          diastolic: 80,
          status: "normal",
        },
      },
      medicationAdherence: {
        medications: [
          {
            name: "None",
            dosage: "N/A",
            frequency: "N/A",
            status: "good",
          },
        ],
        nextRefill: "N/A",
      },
      lifestyleMetrics: {
        physicalActivity: {
          dailySteps: 5000,
          status: "below_target",
        },
        diet: {
          adherenceToMealPlan: "50%",
        },
      },
      riskAssessment: {
        cardiovascularRisk: "low",
        diabeticComplications: "low",
        nextCheckupDue: "November 18, 2024",
      },
      overallImpression:
        "Hepatitis B Surface Antigen (HbsAg): 0.09 S/C Units (Non-reactive: < 0.90 Reactive: => 1.00 Borderline: 0.90-1.00). VDRL: Non-reactive. Hepatitis C Virus (HCV) Antibody: 0.03 S/C Units (Non-reactive: < 0.90 Reactive: => 1.00 Borderline: 0.90-1.00). Human Immunodeficiency Virus (HIV) 1 & 2: 0.50 S/C Units (Non-reactive: < 0.90 Reactive: => 1.00)",
    });
  }
};
