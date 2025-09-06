import {
  X,
  User,
  Phone,
  Calendar,
  FileText,
  Edit,
  Trash2,
  Upload,
  ArrowUp,
  Loader2,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  fatherName: string;
  class: string;
  section: "boys" | "girls";
  gender: "male" | "female";
  adNo: string;
  image?: string;
  dob?: string;
  b_form_no?: string;
  phone_no?: string;
  father_id_no?: string;
  image_url?: string;
}

interface StudentModalProps {
  student: Student;
  onClose: () => void;
  onUpdate?: (student: Student) => void;
  onRemove?: (studentId: number) => void;
  onPromote?: (studentId: number) => void;
}

export const StudentModal = ({
  student,
  onClose,
  onUpdate,
  onRemove,
  onPromote,
}: StudentModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);

  const genderIcon = student.gender === "male" ? "👦" : "👧";

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update student in database
      const { error } = await supabase
        .from("students")
        .update({
          student_name: editedStudent.name,
          father_name: editedStudent.fatherName,
          class: editedStudent.class,
          section: editedStudent.section,
          ad_no: editedStudent.adNo,
          dob: editedStudent.dob,
          b_form_no: editedStudent.b_form_no,
          phone_no: editedStudent.phone_no,
          father_id_no: editedStudent.father_id_no,
          image_url: editedStudent.image,
        })
        .eq("id", student.id);

      if (error) {
        toast.error("Failed to update student: " + error.message);
        return;
      }

      if (onUpdate) {
        onUpdate(editedStudent);
      }
      setIsEditing(false);
      toast.success("Student updated successfully!");
    } catch (error) {
      toast.error("An error occurred while updating the student");
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = () => {
    if (onPromote) {
      onPromote(student.id);
    }
    onClose();
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(student.id);
    }
    onClose();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      // Increased to 500KB for better quality
      toast.error("Image size should be less than 500KB");
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;

        // Update the edited student state
        const updatedStudent = {
          ...editedStudent,
          image: imageDataUrl,
        };
        setEditedStudent(updatedStudent);

        // Immediately save to database
        const { error } = await supabase
          .from("students")
          .update({
            image_url: imageDataUrl,
          })
          .eq("id", student.id);

        if (error) {
          toast.error("Failed to save image: " + error.message);
        } else {
          toast.success("Image uploaded and saved successfully!");
          // Update the parent component with new image
          if (onUpdate) {
            onUpdate(updatedStudent);
          }
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm("Are you sure you want to delete this student's image?")) {
      return;
    }

    setDeletingImage(true);
    try {
      // Remove image from database
      const { error } = await supabase
        .from("students")
        .update({
          image_url: null,
        })
        .eq("id", student.id);

      if (error) {
        toast.error("Failed to delete image: " + error.message);
      } else {
        // Update the edited student state to remove image
        const updatedStudent = {
          ...editedStudent,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            student.name
          )}`, // Fallback to generated avatar
        };
        setEditedStudent(updatedStudent);

        toast.success("Image deleted successfully!");
        // Update the parent component
        if (onUpdate) {
          onUpdate(updatedStudent);
        }
      }
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Image delete error:", error);
    } finally {
      setDeletingImage(false);
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
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-foreground">
              Student Profile
            </h2>
            <span className="text-2xl">{genderIcon}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-primary flex items-center justify-center">
                {(isEditing ? editedStudent.image : student.image) ? (
                  <img
                    src={isEditing ? editedStudent.image : student.image}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}

                {isEditing && (
                  <>
                    {/* Upload overlay */}
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6 text-white" />
                        )}
                        {/* Delete button - only show if student has a custom image */}
                        {editedStudent.image &&
                          !editedStudent.image.includes("dicebear.com") && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteImage();
                              }}
                              disabled={deletingImage || uploadingImage}
                              className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                              title="Delete image"
                            >
                              {deletingImage ? (
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                              ) : (
                                <ImageOff className="w-4 h-4 text-white" />
                              )}
                            </button>
                          )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage || deletingImage}
                      />
                    </label>
                  </>
                )}
              </div>

              <Badge
                variant="outline"
                className={
                  student.gender === "male"
                    ? "border-primary text-primary"
                    : "border-secondary text-secondary"
                }
              >
                Class {student.class}{" "}
                {student.section === "boys" ? "Boys" : "Girls"} {genderIcon}
              </Badge>

              {/* Delete Image Button - Show only if student has a custom image and not in edit mode */}
              {!isEditing &&
                student.image &&
                !student.image.includes("dicebear.com") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteImage}
                    disabled={deletingImage}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    {deletingImage ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <ImageOff className="mr-2 h-3 w-3" />
                    )}
                    {deletingImage ? "Deleting..." : "Remove Photo"}
                  </Button>
                )}
            </div>

            {/* Student Details */}
            <div className="flex-1 space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Student Name
                      </label>
                      <Input
                        value={editedStudent.name}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Father Name
                      </label>
                      <Input
                        value={editedStudent.fatherName}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            fatherName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Class
                      </label>
                      <Select
                        value={editedStudent.class}
                        onValueChange={(value) =>
                          setEditedStudent({ ...editedStudent, class: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Class 5</SelectItem>
                          <SelectItem value="6">Class 6</SelectItem>
                          <SelectItem value="7">Class 7</SelectItem>
                          <SelectItem value="8">Class 8</SelectItem>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Section
                      </label>
                      <Select
                        value={editedStudent.section}
                        onValueChange={(value: "boys" | "girls") =>
                          setEditedStudent({
                            ...editedStudent,
                            section: value,
                            gender: value === "boys" ? "male" : "female",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boys">👦 Boys Section</SelectItem>
                          <SelectItem value="girls">
                            👧 Girls Section
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={editedStudent.dob}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            dob: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Phone No.
                      </label>
                      <Input
                        value={editedStudent.phone_no || ""}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            phone_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        B.Form No.
                      </label>
                      <Input
                        value={editedStudent.b_form_no || ""}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            b_form_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Father ID No.
                      </label>
                      <Input
                        value={editedStudent.father_id_no || ""}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            father_id_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Admission No.
                      </label>
                      <Input
                        value={editedStudent.adNo || ""}
                        onChange={(e) =>
                          setEditedStudent({
                            ...editedStudent,
                            adNo: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {student.name}
                  </h3>
                  <p className="text-muted-foreground">
                    Father: {student.fatherName}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Admission No.
                          </p>
                          <p className="text-muted-foreground">
                            {student.adNo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Date of Birth
                          </p>
                          <p className="text-muted-foreground">
                            {student.dob || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            B.Form No.
                          </p>
                          <p className="text-muted-foreground">
                            {student.bFormNo || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Phone No.
                          </p>
                          <p className="text-muted-foreground">
                            {student.phone_no || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Father ID No.
                          </p>
                          <p className="text-muted-foreground">
                            {student.father_id_no || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Add B.Form No. display */}
                    <div className="mt-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            B.Form No.
                          </p>
                          <p className="text-muted-foreground">
                            {student.b_form_no || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-3">
            {!showConfirmDelete ? (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={saving || uploadingImage || deletingImage}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="btn-primary"
                      disabled={saving || uploadingImage || deletingImage}
                    >
                      {saving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Student</span>
                    </Button>

                    {onPromote && student.class !== "10" && (
                      <Button
                        onClick={handlePromote}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span>
                          Promote to Class {parseInt(student.class) + 1}
                        </span>
                      </Button>
                    )}

                    {onPromote && student.class === "10" && (
                      <Button
                        onClick={handlePromote}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span>Graduate Student</span>
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <p className="text-destructive font-medium">
                  Are you sure you want to remove this student?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRemove}>
                  Confirm Remove
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!isEditing && !showConfirmDelete && onRemove && (
              <Button
                variant="destructive"
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Student</span>
              </Button>
            )}

            <Button onClick={onClose} className="btn-primary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
