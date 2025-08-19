import { X, User, Phone, Calendar, FileText, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: number;
  name: string;
  fatherName: string;
  class: string;
  adNo: string;
  image?: string;
  dob?: string;
  bFormNo?: string;
  phoneNo?: string;
  fatherIdNo?: string;
}

interface StudentModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentModal = ({ student, onClose }: StudentModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card glass-modal rounded-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Student Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-primary flex items-center justify-center">
                {student.image ? (
                  <img 
                    src={student.image} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              
              <Badge 
                variant="outline" 
                className={
                  student.class.includes('Boys') 
                    ? 'border-primary text-primary' 
                    : 'border-secondary text-secondary'
                }
              >
                {student.class}
              </Badge>
            </div>
            
            {/* Student Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{student.name}</h3>
                <p className="text-muted-foreground">Father: {student.fatherName}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Admission No.</p>
                      <p className="text-muted-foreground">{student.adNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date of Birth</p>
                      <p className="text-muted-foreground">{student.dob || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">B.Form No.</p>
                      <p className="text-muted-foreground">{student.bFormNo || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Phone No.</p>
                      <p className="text-muted-foreground">{student.phoneNo || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Father ID No.</p>
                      <p className="text-muted-foreground">{student.fatherIdNo || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Student</span>
          </Button>
          
          <Button variant="destructive" className="flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Remove Student</span>
          </Button>
          
          <Button onClick={onClose} className="btn-primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};