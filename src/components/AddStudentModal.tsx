import { X, Upload, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

interface Student {
  name: string;
  fatherName: string;
  class: string;
  gender: 'male' | 'female';
  adNo: string;
  image?: string;
  dob?: string;
  bFormNo?: string;
  phoneNo?: string;
  fatherIdNo?: string;
}

interface AddStudentModalProps {
  onClose: () => void;
  onAdd: (student: Student) => void;
}

export const AddStudentModal = ({ onClose, onAdd }: AddStudentModalProps) => {
  const [student, setStudent] = useState<Student>({
    name: '',
    fatherName: '',
    class: '5',
    gender: 'male',
    adNo: '',
    dob: '',
    bFormNo: '',
    phoneNo: '',
    fatherIdNo: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!student.name.trim()) newErrors.name = 'Student name is required';
    if (!student.fatherName.trim()) newErrors.fatherName = 'Father name is required';
    if (!student.adNo.trim()) newErrors.adNo = 'Admission number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onAdd(student);
      onClose();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50000) {
        alert('Image size should be less than 50KB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudent({ ...student, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
          <h2 className="text-2xl font-bold text-foreground">Add New Student</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-primary flex items-center justify-center">
                {student.image ? (
                  <img 
                    src={student.image} 
                    alt="Student preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
                
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Click to upload photo<br />
                (Max 50KB)
              </p>
            </div>
            
            {/* Student Form */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Student Name *</label>
                  <Input
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Father Name *</label>
                  <Input
                    value={student.fatherName}
                    onChange={(e) => setStudent({ ...student, fatherName: e.target.value })}
                    className={errors.fatherName ? 'border-destructive' : ''}
                  />
                  {errors.fatherName && <p className="text-xs text-destructive mt-1">{errors.fatherName}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Class</label>
                  <Select 
                    value={student.class} 
                    onValueChange={(value) => setStudent({ ...student, class: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Class 5</SelectItem>
                      <SelectItem value="6">Class 6</SelectItem>
                      <SelectItem value="7">Class 7</SelectItem>
                      <SelectItem value="8">Class 8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Gender</label>
                  <Select 
                    value={student.gender} 
                    onValueChange={(value: 'male' | 'female') => setStudent({ ...student, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">👦 Male</SelectItem>
                      <SelectItem value="female">👧 Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Admission No. *</label>
                  <Input
                    value={student.adNo}
                    onChange={(e) => setStudent({ ...student, adNo: e.target.value })}
                    className={errors.adNo ? 'border-destructive' : ''}
                  />
                  {errors.adNo && <p className="text-xs text-destructive mt-1">{errors.adNo}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Date of Birth</label>
                  <Input
                    type="date"
                    value={student.dob}
                    onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">B.Form No.</label>
                  <Input
                    value={student.bFormNo}
                    onChange={(e) => setStudent({ ...student, bFormNo: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Phone No.</label>
                  <Input
                    value={student.phoneNo}
                    onChange={(e) => setStudent({ ...student, phoneNo: e.target.value })}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Father ID No.</label>
                  <Input
                    value={student.fatherIdNo}
                    onChange={(e) => setStudent({ ...student, fatherIdNo: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <Button onClick={handleSave} className="btn-primary">
            Add Student
          </Button>
        </div>
      </div>
    </div>
  );
};