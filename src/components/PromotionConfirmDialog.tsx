import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Student {
  id: number;
  name: string;
  fatherName: string;
  class: string;
  section: 'boys' | 'girls';
  gender: 'male' | 'female';
  adNo: string;
  image?: string;
  dob?: string;
  bFormNo?: string;
  phoneNo?: string;
  fatherIdNo?: string;
}

interface PromotionConfirmDialogProps {
  student?: Student;
  classSection?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isClassPromotion?: boolean;
}

export const PromotionConfirmDialog = ({ 
  student, 
  classSection, 
  onConfirm, 
  onCancel, 
  isClassPromotion = false 
}: PromotionConfirmDialogProps) => {
  const getNextClassSection = () => {
    if (student) {
      const currentClass = parseInt(student.class);
      const nextClass = currentClass + 1;
      return `${nextClass} ${student.section}`;
    }
    if (classSection) {
      const [classNum, section] = classSection.split(' ');
      const nextClass = parseInt(classNum) + 1;
      return `${nextClass} ${section}`;
    }
    return '';
  };

  const getCurrentClassSection = () => {
    if (student) return `${student.class} ${student.section}`;
    if (classSection) return classSection;
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-card glass-modal rounded-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-border">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Confirm Promotion</h3>
            <p className="text-sm text-muted-foreground">
              {isClassPromotion ? 'Promote entire class' : 'Promote student'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-4">
            {isClassPromotion ? (
              <p className="text-foreground">
                Are you sure you want to promote all students from{' '}
                <span className="font-semibold text-primary">{getCurrentClassSection()}</span>
                {' '}to{' '}
                <span className="font-semibold text-primary">{getNextClassSection()}</span>?
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground">
                  Are you sure you want to promote{' '}
                  <span className="font-semibold text-primary">{student?.name}</span>?
                </p>
                
                <div className="flex items-center justify-center space-x-4 py-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl">{student?.gender === 'male' ? '👦' : '👧'}</span>
                    </div>
                    <p className="text-sm font-medium">{getCurrentClassSection()}</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-primary" />
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl">{student?.gender === 'male' ? '👦' : '👧'}</span>
                    </div>
                    <p className="text-sm font-medium">{getNextClassSection()}</p>
                  </div>
                </div>
              </div>
            )}

            {getCurrentClassSection().includes('10') && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-700">
                  ⚠️ This student will graduate and leave the school system.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Confirm Promotion
          </Button>
        </div>
      </div>
    </div>
  );
};