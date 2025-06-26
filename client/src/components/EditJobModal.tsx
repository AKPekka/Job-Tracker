import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  CloseButton,
  Button,
  VStack,
  HStack,
  Input,
  Textarea,
  Box,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Job, api } from '@/lib/api';

interface EditJobModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdated: () => void;
}

export function EditJobModal({ job, isOpen, onClose, onJobUpdated }: EditJobModalProps) {
  const [formData, setFormData] = useState({ ...job });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...job });
    }
  }, [job, isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.updateJob(job.id, {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobUrl: formData.jobUrl,
        notes: formData.notes,
        currentStage: formData.currentStage,
      });
      onJobUpdated();
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>Edit Job</ModalHeader>
        <CloseButton onClick={onClose} position="absolute" top="8px" right="8px" />
        <ModalBody>
          <VStack gap={4} align="stretch">
            <HStack gap={4}>
              <Box flex={1}>
                <Text mb={2} color="fg" fontSize="sm">Job Title *</Text>
                <Input
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  required
                />
              </Box>
              <Box flex={1}>
                <Text mb={2} color="fg" fontSize="sm">Company *</Text>
                <Input
                  value={formData.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('company', e.target.value)}
                  placeholder="e.g. TechCorp"
                  required
                />
              </Box>
            </HStack>

            <HStack gap={4}>
              <Box flex={1}>
                <Text mb={2} color="fg" fontSize="sm">Location</Text>
                <Input
                  value={formData.location || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </Box>
              <Box flex={1}>
                <Text mb={2} color="fg" fontSize="sm">Stage</Text>
                <select
                  value={formData.currentStage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('currentStage', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--chakra-colors-border)',
                    backgroundColor: 'var(--chakra-colors-bg-subtle)',
                    color: 'var(--chakra-colors-fg)',
                  }}
                >
                  <option value="SAVED">Saved</option>
                  <option value="APPLIED">Applied</option>
                  <option value="PHONE_SCREEN">Phone Screen</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </Box>
            </HStack>

            <Box>
              <Text mb={2} color="fg" fontSize="sm">Job URL</Text>
              <Input
                value={formData.jobUrl || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('jobUrl', e.target.value)}
                placeholder="https://company.com/jobs/123"
                type="url"
              />
            </Box>

            <Box>
              <Text mb={2} color="fg" fontSize="sm">Notes</Text>
              <Textarea
                value={formData.notes || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about this position..."
                rows={4}
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 