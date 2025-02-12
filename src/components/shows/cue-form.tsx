import { useState } from 'react';
import { Cue } from '@/types/cue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clock, AlertCircle } from 'lucide-react';

interface CueFormProps {
  initialData?: Partial<Cue>;
  onSubmit: (data: Partial<Cue>) => Promise<void>;
  onCancel?: () => void;
}

export default function CueForm({
  initialData,
  onSubmit,
  onCancel
}: CueFormProps) {
  const [formData, setFormData] = useState<Partial<Cue>>(initialData || {
    cue_number: '',
    start_time: '',
    run_time: '',
    end_time: '',
    activity: '',
    graphics: '',
    video: '',
    audio: '',
    lighting: '',
    notes: '',
    status: 'upcoming'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cue_number?.trim()) {
      newErrors.cue_number = 'Cue number is required';
    }

    // Time format validation (HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    
    if (formData.start_time && !timeRegex.test(formData.start_time)) {
      newErrors.start_time = 'Invalid time format (HH:MM:SS)';
    }

    if (formData.run_time && !timeRegex.test(formData.run_time)) {
      newErrors.run_time = 'Invalid time format (HH:MM:SS)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting cue:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save cue. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {initialData ? 'Edit Cue' : 'New Cue'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Cue Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cue Number
              <span className="text-destructive">*</span>
            </label>
            <Input
              name="cue_number"
              value={formData.cue_number}
              onChange={handleInputChange}
              placeholder="e.g., 1.0"
              className={errors.cue_number ? 'border-destructive' : ''}
            />
            {errors.cue_number && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.cue_number}
              </p>
            )}
          </div>

          {/* Timing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Start Time
              </label>
              <Input
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                placeholder="HH:MM:SS"
                className={errors.start_time ? 'border-destructive' : ''}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive">{errors.start_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Run Time
              </label>
              <Input
                name="run_time"
                value={formData.run_time}
                onChange={handleInputChange}
                placeholder="HH:MM:SS"
                className={errors.run_time ? 'border-destructive' : ''}
              />
              {errors.run_time && (
                <p className="text-sm text-destructive">{errors.run_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                End Time
              </label>
              <Input
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                placeholder="HH:MM:SS"
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Department Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity</label>
              <Input
                name="activity"
                value={formData.activity}
                onChange={handleInputChange}
                placeholder="Main action or event"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Graphics</label>
              <Input
                name="graphics"
                value={formData.graphics}
                onChange={handleInputChange}
                placeholder="Graphics details"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Video</label>
              <Input
                name="video"
                value={formData.video}
                onChange={handleInputChange}
                placeholder="Video requirements"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Audio</label>
              <Input
                name="audio"
                value={formData.audio}
                onChange={handleInputChange}
                placeholder="Audio elements"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lighting</label>
              <Input
                name="lighting"
                value={formData.lighting}
                onChange={handleInputChange}
                placeholder="Lighting instructions"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes"
              />
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.submit}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Cue' : 'Create Cue'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}