import { useState } from 'react';
import { Search, Bell, User, BookOpen, Users, BarChart3, Settings, GraduationCap } from 'lucide-react';
import { StudentCard } from './StudentCard';
import { StudentModal } from './StudentModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock student data
const mockStudents = [
  {
    id: 1,
    name: "Ahmed Ali",
    fatherName: "Muhammad Ali",
    class: "5 Boys",
    adNo: "001",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    dob: "2014-05-15",
    bFormNo: "35201-1234567-8",
    phoneNo: "+92-300-1234567",
    fatherIdNo: "35201-9876543-2"
  },
  {
    id: 2,
    name: "Fatima Khan",
    fatherName: "Hassan Khan",
    class: "5 Girls",
    adNo: "002",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    dob: "2014-03-22",
    bFormNo: "35201-2345678-9",
    phoneNo: "+92-301-2345678",
    fatherIdNo: "35201-8765432-1"
  },
  {
    id: 3,
    name: "Muhammad Hassan",
    fatherName: "Ali Hassan",
    class: "6 Boys",
    adNo: "003",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
    dob: "2013-08-10",
    bFormNo: "35201-3456789-0",
    phoneNo: "+92-302-3456789",
    fatherIdNo: "35201-7654321-0"
  },
  {
    id: 4,
    name: "Aisha Malik",
    fatherName: "Omar Malik",
    class: "6 Girls",
    adNo: "004",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    dob: "2013-12-05",
    bFormNo: "35201-4567890-1",
    phoneNo: "+92-303-4567890",
    fatherIdNo: "35201-6543210-9"
  },
  {
    id: 5,
    name: "Ali Raza",
    fatherName: "Imran Raza",
    class: "7 Boys",
    adNo: "005",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliRaza",
    dob: "2012-06-18",
    bFormNo: "35201-5678901-2",
    phoneNo: "+92-304-5678901",
    fatherIdNo: "35201-5432109-8"
  },
  {
    id: 6,
    name: "Zara Ahmed",
    fatherName: "Tariq Ahmed",
    class: "7 Girls",
    adNo: "006",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara",
    dob: "2012-09-30",
    bFormNo: "35201-6789012-3",
    phoneNo: "+92-305-6789012",
    fatherIdNo: "35201-4321098-7"
  }
];

const sidebarItems = [
  { name: 'Dashboard', icon: BarChart3, active: true },
  { name: 'Students', icon: Users, active: false },
  { name: 'Classes', icon: BookOpen, active: false },
  { name: 'Reports', icon: BarChart3, active: false },
  { name: 'Settings', icon: Settings, active: false }
];

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-foreground">NEMHS</h1>
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
                key={item.name}
                className={`sidebar-item w-full ${item.active ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
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
            {sidebarCollapsed ? '→' : '←'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-foreground">Student Dashboard</h2>
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
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
              </Button>
              
              {/* Profile */}
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-student">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-primary">1,247</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="card-student">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Classes</p>
                  <p className="text-3xl font-bold text-secondary">8</p>
                </div>
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
            </div>
            
            <div className="card-student">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Boys</p>
                  <p className="text-3xl font-bold text-primary">623</p>
                </div>
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="card-student">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Girls</p>
                  <p className="text-3xl font-bold text-secondary">624</p>
                </div>
                <GraduationCap className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </div>

          {/* Students Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Recent Students</h3>
              <Button className="btn-primary">Add New Student</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student, index) => (
                <div key={student.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <StudentCard 
                    student={student} 
                    onClick={() => setSelectedStudent(student)}
                  />
                </div>
              ))}
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No students found matching your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Student Modal */}
      {selectedStudent && (
        <StudentModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};