import { User } from 'lucide-react';

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

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export const StudentCard = ({ student, onClick }: StudentCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="card-student cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Student Image */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-primary flex items-center justify-center">
            {student.image ? (
              <img 
                src={student.image} 
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Student Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {student.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            Class: {student.class}
          </p>
          <p className="text-muted-foreground text-xs">
            AD.NO: {student.adNo}
          </p>
        </div>

        {/* Class Badge */}
        <div className="w-full">
          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            student.class.includes('Boys') 
              ? 'bg-primary/10 text-primary' 
              : 'bg-secondary/10 text-secondary'
          }`}>
            {student.class}
          </div>
        </div>
      </div>
    </div>
  );
};