import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { supabase, Student } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ParsedStudent extends Omit<Student, "id"> {
  sr_no?: number;
}

interface ExcelUploadProps {
  onDataUploaded?: () => void;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onDataUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [uploadResults, setUploadResults] = useState<{
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  } | null>(null);

  const parseExcelFile = async (file: File): Promise<ParsedStudent[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          console.log("📊 Excel Debug: Found sheets:", workbook.SheetNames);

          const allStudents: ParsedStudent[] = [];
          // Updated to match your actual sheet names (5TH BOYS, 5TH GIRLS, etc.)
          const validSheetPatterns = [
            { pattern: /^5th\s+(boys|girls)$/i, class: "5" },
            { pattern: /^6th\s+(boys|girls)$/i, class: "6" },
            { pattern: /^7th\s+(boys|girls)$/i, class: "7" },
            { pattern: /^8th\s+(boys|girls)$/i, class: "8" },
          ];

          for (const sheetName of workbook.SheetNames) {
            console.log(`🔍 Processing sheet: "${sheetName}"`);

            // Check if this sheet matches any of our expected patterns
            const normalizedSheetName = sheetName.toLowerCase().trim();
            const matchedPattern = validSheetPatterns.find((pattern) =>
              pattern.pattern.test(normalizedSheetName)
            );

            if (!matchedPattern) {
              console.log(
                `⏭️ Skipping sheet "${sheetName}" - not in expected format`
              );
              console.log(
                `Expected formats: 5TH BOYS, 5TH GIRLS, 6TH BOYS, 6TH GIRLS, 7TH BOYS, 7TH GIRLS, 8TH BOYS, 8TH GIRLS`
              );
              continue;
            }

            console.log(`✅ Processing valid sheet: "${sheetName}"`);

            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: "", // Default value for empty cells
              raw: false, // Convert everything to strings first
            }) as unknown[][];

            console.log(`📋 Sheet "${sheetName}" has ${jsonData.length} rows`);

            // Debug: Show first few rows with detailed column info
            if (jsonData.length > 0) {
              console.log(`🔍 Header row:`, jsonData[0]);
              if (jsonData.length > 1) {
                console.log(`🔍 First data row:`, jsonData[1]);
                console.log(`🔍 Column mapping check:`, {
                  "Col 0 (SR)": jsonData[1][0],
                  "Col 1 (Student Name)": jsonData[1][1],
                  "Col 2 (Father Name)": jsonData[1][2],
                  "Col 3 (DOB)": jsonData[1][3],
                  "Col 4 (B.Form.No)": jsonData[1][4],
                  "Col 5 (PH.NO)": jsonData[1][5],
                  "Col 6 (Father/ID No)": jsonData[1][6],
                  "Col 7 (Class)": jsonData[1][7],
                  "Col 8 (AD.NO)": jsonData[1][8],
                  "Col 9 (AD pic)": jsonData[1][9],
                });
              }
            }

            // Extract class and section from matched pattern
            const classNum = matchedPattern.class;
            const section = sheetName.toLowerCase().includes("boys")
              ? "boys"
              : "girls";

            console.log(`📝 Extracted: Class ${classNum}, Section ${section}`);

            let processedCount = 0;

            // Process rows (skip header row)
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i] as unknown[];

              // Check if row exists and has data
              if (!row || row.length === 0) {
                continue;
              }

              // Only process rows with non-empty student name (column 2, index 1)
              const studentName = row[1]?.toString().trim();
              if (!studentName) {
                continue;
              }

              const student: ParsedStudent = {
                sr_no: row[0] ? Number(row[0]) || undefined : undefined,
                student_name: studentName,
                father_name: row[2]?.toString().trim() || "",
                dob: row[3] ? formatDate(row[3]) : undefined,
                b_form_no: row[4]?.toString().trim() || undefined,
                phone_no: row[5]?.toString().trim() || undefined,
                father_id_no: row[6]?.toString().trim() || undefined,
                class: classNum,
                ad_no: row[8]?.toString().trim() || "",
                section,
              };

              allStudents.push(student);
              processedCount++;
            }

            console.log(
              `✅ Sheet "${sheetName}": Processed ${processedCount} students`
            );
          }

          console.log(`🎯 Total students found: ${allStudents.length}`);
          resolve(allStudents);
        } catch (error) {
          console.error("❌ Error parsing Excel file:", error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const formatDate = (dateValue: unknown): string | undefined => {
    if (!dateValue) return undefined;

    try {
      // Handle Excel date serial numbers
      if (typeof dateValue === "number") {
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(
          excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000
        );
        return date.toISOString().split("T")[0];
      }

      // Handle string dates
      if (typeof dateValue === "string") {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }

      return undefined;
    } catch {
      return undefined;
    }
  };

  const uploadStudentsToDatabase = useCallback(
    async (students: ParsedStudent[]) => {
      const results = {
        totalProcessed: students.length,
        successCount: 0,
        errorCount: 0,
        errors: [] as string[],
      };

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        setProgress((i / students.length) * 100);

        try {
          const { error } = await supabase.from("students").insert([student]);

          if (error) {
            results.errorCount++;
            results.errors.push(`Row ${i + 1}: ${error.message}`);
          } else {
            results.successCount++;
          }
        } catch (error) {
          results.errorCount++;
          results.errors.push(
            `Row ${i + 1}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      return results;
    },
    []
  );

  const deleteAllData = useCallback(async () => {
    if (
      !confirm(
        "⚠️ Are you sure you want to delete ALL student data? This action cannot be undone!"
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase.from("students").delete().neq("id", 0); // Delete all records

      if (error) {
        toast.error("Failed to delete data: " + error.message);
      } else {
        toast.success("All student data has been deleted successfully");
        onDataUploaded?.(); // Refresh the data
      }
    } catch (error) {
      toast.error("An error occurred while deleting data");
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  }, [onDataUploaded]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
        return;
      }

      setUploading(true);
      setUploadStatus("processing");
      setProgress(0);
      setUploadResults(null);

      try {
        // Parse Excel file
        toast.info("Parsing Excel file...");
        const students = await parseExcelFile(file);

        if (students.length === 0) {
          setUploadStatus("error");
          toast.error("No valid student data found in the Excel file");
          return;
        }

        toast.info(
          `Found ${students.length} students. Uploading to database...`
        );

        // Upload to database
        const results = await uploadStudentsToDatabase(students);
        setUploadResults(results);

        if (results.errorCount === 0) {
          setUploadStatus("success");
          toast.success(
            `Successfully uploaded ${results.successCount} students!`
          );
          onDataUploaded?.(); // Refresh data in parent component
        } else {
          setUploadStatus("error");
          toast.error(`Upload completed with ${results.errorCount} errors`);
          if (results.successCount > 0) {
            onDataUploaded?.(); // Refresh data even if there were some errors
          }
        }
      } catch (error) {
        setUploadStatus("error");
        toast.error(
          error instanceof Error ? error.message : "Failed to process file"
        );
      } finally {
        setUploading(false);
        setProgress(100);
      }
    },
    [onDataUploaded, parseExcelFile, uploadStudentsToDatabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: uploading || deleting,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Upload Student Data
          </CardTitle>
          <CardDescription>
            Upload an Excel file with student data. The file should contain
            sheets named: 5 boys, 5 girls, 6 boys, 6 girls, 7 boys, 7 girls, 8
            boys, 8 girls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }
              ${
                uploading || deleting
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-primary hover:bg-primary/5"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              {uploading || deleting ? (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-muted-foreground" />
              )}
              <div>
                <p className="text-lg font-medium">
                  {uploading
                    ? "Processing..."
                    : deleting
                    ? "Deleting all data..."
                    : isDragActive
                    ? "Drop your Excel file here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Excel files (.xlsx, .xls) only
                </p>
              </div>
            </div>
          </div>

          {uploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {uploadResults && (
            <div className="mt-4 space-y-3">
              {uploadStatus === "success" ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully uploaded {uploadResults.successCount} students
                    to the database!
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload completed with {uploadResults.errorCount} errors out
                    of {uploadResults.totalProcessed} records.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-muted p-3 rounded-lg text-sm">
                <p>
                  <strong>Total Processed:</strong>{" "}
                  {uploadResults.totalProcessed}
                </p>
                <p>
                  <strong>Successful:</strong> {uploadResults.successCount}
                </p>
                <p>
                  <strong>Errors:</strong> {uploadResults.errorCount}
                </p>
              </div>

              {uploadResults.errors.length > 0 && (
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <p className="font-medium text-sm mb-2">Errors:</p>
                  <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                    {uploadResults.errors.map((error, index) => (
                      <p key={index} className="text-destructive">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delete All Data Button */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground">
                  Delete all student data from the database
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={deleteAllData}
                disabled={uploading || deleting}
                className="ml-4"
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete All Data"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
