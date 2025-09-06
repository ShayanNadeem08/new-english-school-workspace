import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  User,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  Upload,
  LogOut,
} from "lucide-react";
import { StudentCard } from "./StudentCard";
import { StudentModal } from "./StudentModal";
import { AddStudentModal } from "./AddStudentModal";
import { PromotionProgress } from "./PromotionProgress";
import { PromotionConfirmDialog } from "./PromotionConfirmDialog";
import { ExcelUpload } from "./ExcelUpload";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Student as SupabaseStudent } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Student {
  id: number;
  sr_no?: number;
  student_name: string;
  father_name: string;
  class: string;
  section: "boys" | "girls";
  ad_no: string;
  dob?: string;
  b_form_no?: string;
  phone_no?: string;
  father_id_no?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for compatibility
  name: string;
  fatherName: string;
  adNo: string;
  gender: "male" | "female";
  image?: string;
}

// Mock data removed - now using real data from Supabase

const sidebarItems = [
  { name: "Dashboard", icon: BarChart3, key: "dashboard" },
  { name: "Upload Data", icon: Upload, key: "upload" },
  { name: "5 Boys", icon: BookOpen, key: "5-boys" },
  { name: "5 Girls", icon: BookOpen, key: "5-girls" },
  { name: "6 Boys", icon: BookOpen, key: "6-boys" },
  { name: "6 Girls", icon: BookOpen, key: "6-girls" },
  { name: "7 Boys", icon: BookOpen, key: "7-boys" },
  { name: "7 Girls", icon: BookOpen, key: "7-girls" },
  { name: "8 Boys", icon: BookOpen, key: "8-boys" },
  { name: "8 Girls", icon: BookOpen, key: "8-girls" },
  { name: "Reports", icon: BarChart3, key: "reports" },
  { name: "Settings", icon: Settings, key: "settings" },
];

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [promotionProgress, setPromotionProgress] = useState(false);
  const [activeFilter, setActiveFilter] = useState("dashboard");
  const [showPromotionDialog, setShowPromotionDialog] = useState<{
    show: boolean;
    student?: Student;
    classSection?: string;
    isClassPromotion?: boolean;
  }>({ show: false });

  // Fetch students from Supabase
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("class", { ascending: true })
        .order("student_name", { ascending: true });

      if (error) {
        toast.error("Failed to fetch students: " + error.message);
        return;
      }

      // Convert Supabase data to our Student interface
      const convertedStudents: Student[] = (data || []).map(
        (student: SupabaseStudent) => ({
          id: student.id || 0,
          sr_no: student.sr_no,
          student_name: student.student_name,
          father_name: student.father_name,
          class: student.class,
          section: student.section,
          ad_no: student.ad_no,
          dob: student.dob,
          b_form_no: student.b_form_no,
          phone_no: student.phone_no,
          father_id_no: student.father_id_no,
          created_at: student.created_at,
          updated_at: student.updated_at,
          image_url: student.image_url,
          // Legacy fields for compatibility
          name: student.student_name,
          fatherName: student.father_name,
          adNo: student.ad_no,
          gender: student.section === "boys" ? "male" : "female",
          image:
            student.image_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              student.student_name
            )}`,
        })
      );

      setStudents(convertedStudents);
    } catch (error) {
      toast.error("An error occurred while fetching students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const filteredStudents = students.filter((student) => {
    // Search filter
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchQuery.toLowerCase());

    // Class section filter
    if (activeFilter === "dashboard") return matchesSearch;

    const [classNum, section] = activeFilter.split("-");
    return (
      matchesSearch && student.class === classNum && student.section === section
    );
  });

  const promoteStudent = (studentId: number) => {
    setStudents((prev) =>
      prev
        .map((student) => {
          if (student.id === studentId) {
            const currentClass = parseInt(student.class);
            if (currentClass === 10) {
              // Class 10 students graduate and are removed
              return null;
            }
            return { ...student, class: (currentClass + 1).toString() };
          }
          return student;
        })
        .filter((student): student is Student => student !== null)
    );
  };

  const handlePromoteStudent = (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setShowPromotionDialog({
        show: true,
        student,
        isClassPromotion: false,
      });
    }
  };

  const promoteEntireClass = (classSection: string) => {
    setPromotionProgress(true);
    const [classNum, section] = classSection.split(" ");
    setTimeout(() => {
      setStudents((prev) =>
        prev
          .map((student) => {
            if (student.class === classNum && student.section === section) {
              const currentClass = parseInt(student.class);
              if (currentClass === 10) {
                // Class 10 students graduate and are removed
                return null;
              }
              return { ...student, class: (currentClass + 1).toString() };
            }
            return student;
          })
          .filter((student): student is Student => student !== null)
      );
      setPromotionProgress(false);
    }, 2000);
  };

  const handlePromoteClass = (classSection: string) => {
    setShowPromotionDialog({
      show: true,
      classSection,
      isClassPromotion: true,
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const removeStudent = (studentId: number) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
  };

  const addStudent = (newStudent: Omit<Student, "id">) => {
    const student: Student = {
      ...newStudent,
      id: Math.max(...students.map((s) => s.id)) + 1,
    };
    setStudents((prev) => [...prev, student]);
  };

  const getClassStats = () => {
    const stats = students.reduce((acc, student) => {
      const sectionKey = `${student.class} ${student.section}`;
      if (!acc[sectionKey]) {
        acc[sectionKey] = { total: 0, boys: 0, girls: 0 };
      }
      acc[sectionKey].total++;
      if (student.gender === "male") acc[sectionKey].boys++;
      else acc[sectionKey].girls++;
      return acc;
    }, {} as Record<string, { total: number; boys: number; girls: number }>);

    return {
      totalStudents: students.length,
      totalBoys: students.filter((s) => s.gender === "male").length,
      totalGirls: students.filter((s) => s.gender === "female").length,
      activeSections: Object.keys(stats).length,
      sectionBreakdown: stats,
    };
  };

  const confirmPromotion = () => {
    if (showPromotionDialog.isClassPromotion) {
      promoteEntireClass(showPromotionDialog.classSection!);
    } else {
      promoteStudent(showPromotionDialog.student!.id);
    }
    setShowPromotionDialog({ show: false });
  };

  const stats = getClassStats();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <img
              src="/logo/new-english-logo.svg"
              alt="New English Model School Logo"
              className="w-10 h-10"
            />
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-foreground">NEMS</h1>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveFilter(item.key)}
                className={`sidebar-item w-full ${
                  activeFilter === item.key ? "active" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full"
          >
            {sidebarCollapsed ? "→" : "←"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-px bg-border mx-4"></div>
              <h2 className="text-2xl font-bold text-foreground">
                Student Dashboard
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students or classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-expand pl-10 bg-background"
                />
              </div>
              {/* Profile */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {activeFilter === "upload" ? (
            <ExcelUpload onDataUploaded={fetchStudents} />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-student">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Total Students
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {stats.totalStudents}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="card-student">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Boys
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {stats.totalBoys}
                      </p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="card-student">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Girls
                      </p>
                      <p className="text-3xl font-bold text-secondary">
                        {stats.totalGirls}
                      </p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-secondary" />
                  </div>
                </div>
              </div>

              {/* Students Grid */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {loading ? "Loading Students..." : "Students"}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={fetchStudents}
                      disabled={loading}
                    >
                      Refresh Data
                    </Button>
                    <Button
                      className="btn-primary"
                      onClick={() => setShowAddStudent(true)}
                    >
                      Add New Student
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Loading students...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredStudents.map((student, index) => (
                        <div
                          key={student.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <StudentCard
                            student={student}
                            onClick={() => setSelectedStudent(student)}
                            onPromote={() => handlePromoteStudent(student.id)}
                          />
                        </div>
                      ))}
                    </div>

                    {filteredStudents.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                          No students found matching your search.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Student Modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={updateStudent}
          onRemove={removeStudent}
          onPromote={handlePromoteStudent}
        />
      )}

      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={addStudent}
        />
      )}

      {promotionProgress && <PromotionProgress />}

      {showPromotionDialog.show && (
        <PromotionConfirmDialog
          student={showPromotionDialog.student}
          classSection={showPromotionDialog.classSection}
          isClassPromotion={showPromotionDialog.isClassPromotion}
          onConfirm={confirmPromotion}
          onCancel={() => setShowPromotionDialog({ show: false })}
        />
      )}
    </div>
  );
};
