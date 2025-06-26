'use client'

import { 
  Box, Button, Heading, Text, VStack, HStack, Input, Textarea, Spinner, Badge,
  IconButton, Flex, Container, useDisclosure, SimpleGrid
} from "@chakra-ui/react"
import { ColorModeButton } from "@/components/ui/color-mode"
import { useEffect, useState } from "react"
import { api, Job, JobStats, CreateJobData } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { JobStatsChart } from "@/components/JobStatsChart"

interface FormData {
  title: string
  company: string
  location: string
  jobUrl: string
  notes: string
  currentStage: Job['currentStage']
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<JobStats>({ totalJobs: 0, jobsByStage: {} })
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('updatedAt')
  const [activeView, setActiveView] = useState<'dashboard' | 'jobs' | 'add' | 'settings'>('dashboard')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    location: '',
    jobUrl: '',
    notes: '',
    currentStage: 'SAVED'
  })
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const { open: isChartsOpen, onOpen: onChartsOpen, onClose: onChartsClose } = useDisclosure()
  const selectBg = 'var(--chakra-colors-bg-subtle)'
  const selectColor = 'var(--chakra-colors-fg)'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, searchTerm, filterStage, sortBy])

  const fetchData = async () => {
    try {
      setLoading(true)
      setConnectionError(null)
      
      const [jobsData, statsData] = await Promise.all([
        api.getJobs(),
        api.getJobStats()
      ])
      
      setJobs(jobsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setConnectionError(`Unable to connect to server. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStage = filterStage === 'ALL' || job.currentStage === filterStage
      return matchesSearch && matchesStage
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'company':
          return a.company.localeCompare(b.company)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'stage':
          return a.currentStage.localeCompare(b.currentStage)
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.company.trim()) {
      alert('Please fill in the required fields (Title and Company)')
      return
    }

    try {
      setSubmitLoading(true)
      
      const jobData: CreateJobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim() || undefined,
        jobUrl: formData.jobUrl.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        currentStage: formData.currentStage,
        applicationDate: new Date().toISOString()
      }
      
      await api.createJob(jobData)
      
      setFormData({
        title: '',
        company: '',
        location: '',
        jobUrl: '',
        notes: '',
        currentStage: 'SAVED'
      })
      
      setActiveView('jobs')
      setSuccessMessage('Job added successfully!')
      await fetchData()
      setTimeout(() => setSuccessMessage(null), 3000)
      
    } catch (error) {
      console.error('Failed to create job:', error)
      alert(`Failed to add job: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return
    }

    try {
      await api.deleteJob(jobId)
      setSuccessMessage('Job deleted successfully!')
      await fetchData()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to delete job:', error)
      alert(`Failed to delete job: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUpdateJob = async (job: Job) => {
    try {
      await api.updateJob(job.id, {
        title: job.title,
        company: job.company,
        location: job.location,
        jobUrl: job.jobUrl,
        notes: job.notes,
        currentStage: job.currentStage,
      })
      setEditingJobId(null)
      setSuccessMessage('Job updated successfully!')
      fetchData()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to update job:', error)
      alert(`Failed to update job: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleJobCardChange = (jobId: string, field: keyof Job, value: any) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, [field]: value } : job))
  }

  const getStageColor = (stage: string) => {
    const colors = {
      'SAVED': 'gray',
      'APPLIED': 'blue',
      'PHONE_SCREEN': 'orange',
      'INTERVIEW': 'purple',
      'OFFER': 'green',
      'REJECTED': 'red'
    }
    return colors[stage as keyof typeof colors] || 'gray'
  }

  const getProgressValue = () => {
    const totalJobs = stats.totalJobs
    if (totalJobs === 0) return 0
    const activeJobs = totalJobs - (stats.jobsByStage.REJECTED || 0)
    return (activeJobs / totalJobs) * 100
  }

  const renderNavigation = () => (
    <HStack gap={2} p={1} bg="gray.100" borderRadius="xl" _dark={{ bg: "gray.800" }}>
      {[
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'jobs', label: '💼 Jobs', icon: '💼' },
        { id: 'add', label: '➕ Add Job', icon: '➕' },
        { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
      ].map((item) => (
        <Button
          key={item.id}
          variant={activeView === item.id ? 'solid' : 'ghost'}
          colorScheme={activeView === item.id ? 'blue' : 'gray'}
          size="sm"
          borderRadius="lg"
          onClick={() => setActiveView(item.id as any)}
          fontWeight="medium"
        >
          {item.label}
        </Button>
      ))}
    </HStack>
  )

  const renderDashboard = () => (
    <VStack gap={8} align="stretch">
      {/* Overview Stats */}
      <Box borderRadius="2xl" boxShadow="lg" border="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} p={8}>
        <VStack gap={6}>
          <HStack justify="space-between" w="full">
            <VStack align="start" gap={1}>
              <Heading size="lg" color="gray.700" _dark={{ color: "gray.300" }}>
                Application Progress
              </Heading>
              <Text color="gray.500" fontSize="sm">
                {stats.totalJobs > 0 ? `${Math.round(getProgressValue())}% active applications` : 'No applications yet'}
              </Text>
            </VStack>
            <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
              {stats.totalJobs} Total
            </Badge>
          </HStack>
          {/* Progress Bar */}
          <Box w="full" h="8px" bg="gray.100" _dark={{ bg: "gray.700" }} borderRadius="md">
            <Box h="full" bg="blue.500" borderRadius="md" style={{ width: `${getProgressValue()}%` }} />
          </Box>
        </VStack>
      </Box>

      {/* Quick Stats Grid */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
        {Object.entries(stats.jobsByStage).map(([stage, count]) => (
          <Box key={stage} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} p={6}>
            <VStack gap={2}>
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                {stage.replace('_', ' ')}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={`${getStageColor(stage)}.500`}>
                {loading ? <Spinner size="sm" /> : count}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {stats.totalJobs > 0 ? `${Math.round((count / stats.totalJobs) * 100)}%` : '0%'}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Recent Jobs Preview */}
      <Box borderRadius="xl" boxShadow="md" p={6}>
        <VStack gap={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Recent Applications</Heading>
            <Button variant="outline" size="sm" onClick={() => setActiveView('jobs')}>
              View All
            </Button>
          </HStack>
          {loading ? (
            <VStack gap={4} py={8}>
              <Spinner size="lg" color="blue.500" />
              <Text color="gray.500">Loading applications...</Text>
            </VStack>
          ) : jobs.length === 0 ? (
            <VStack gap={4} py={8}>
              <Text fontSize="4xl">💼</Text>
              <Text color="gray.500">No applications yet</Text>
              <Button colorScheme="blue" onClick={() => setActiveView('add')}>
                Add Your First Job
              </Button>
            </VStack>
          ) : (
            <VStack gap={3} align="stretch">
              {jobs.slice(0, 3).map((job) => (
                <Box key={job.id} p={4} borderRadius="lg" bg="gray.50" _dark={{ bg: "gray.800" }}>
                  <HStack justify="space-between">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold">{job.title}</Text>
                      <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                        {job.company}
                      </Text>
                    </VStack>
                    <Badge colorScheme={getStageColor(job.currentStage)} borderRadius="full">
                      {job.currentStage.replace('_', ' ')}
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Box>

      {/* Analytics Button */}
      <Box borderRadius="xl" boxShadow="md" bg="purple.50" _dark={{ bg: "purple.900" }} p={6}>
        <HStack justify="space-between">
          <VStack align="start" gap={1}>
            <Heading size="md" color="purple.700" _dark={{ color: "purple.300" }}>
              Analytics & Charts
            </Heading>
            <Text color="purple.600" _dark={{ color: "purple.400" }} fontSize="sm">
              Visualize your job search progress with detailed charts
            </Text>
          </VStack>
          <Button colorScheme="purple" onClick={onChartsOpen} size="lg">
            📊 View Analytics
          </Button>
        </HStack>
      </Box>
    </VStack>
  )

  const renderJobs = () => (
    <VStack gap={6} align="stretch">
      {/* Search and Filters */}
      <Box borderRadius="xl" boxShadow="sm" p={6}>
        <VStack gap={4}>
          <HStack w="full" gap={4}>
            <Input
              placeholder="🔍 Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="lg"
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              border="none"
              flex={2}
            />
            <select
              value={filterStage}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStage(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectBg,
                color: selectColor,
                minWidth: '150px',
                fontSize: '14px'
              }}
            >
              <option value="ALL">All Stages</option>
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="PHONE_SCREEN">Phone Screen</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectBg,
                color: selectColor,
                minWidth: '150px',
                fontSize: '14px'
              }}
            >
              <option value="updatedAt">Latest Update</option>
              <option value="company">Company</option>
              <option value="title">Job Title</option>
              <option value="stage">Stage</option>
            </select>
          </HStack>
        </VStack>
      </Box>

      {/* Jobs List */}
      {loading ? (
        <VStack gap={4} py={12}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.500">Loading your applications...</Text>
        </VStack>
      ) : filteredJobs.length === 0 ? (
        <VStack gap={4} py={12}>
          <Text fontSize="6xl">💼</Text>
          <Heading size="md" color="gray.500">
            {jobs.length === 0 ? 'No jobs yet' : 'No matching jobs'}
          </Heading>
          <Text color="gray.400" textAlign="center">
            {jobs.length === 0 
              ? 'Start by adding your first job application'
              : 'Try adjusting your search or filters'
            }
          </Text>
          {jobs.length === 0 && (
            <Button colorScheme="blue" onClick={() => setActiveView('add')}>
              Add Your First Job
            </Button>
          )}
        </VStack>
      ) : (
        <VStack gap={4} align="stretch">
          <Text color="gray.600" _dark={{ color: "gray.400" }} fontSize="sm">
            Showing {filteredJobs.length} of {jobs.length} applications
          </Text>
          <AnimatePresence>
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Box borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.200" _hover={{ shadow: "lg", borderColor: "blue.300" }} transition="all 0.2s" p={6}>
                  {editingJobId === job.id ? (
                    <VStack gap={4} align="stretch">
                      <HStack gap={4}>
                        <Input
                          value={job.title}
                          onChange={(e) => handleJobCardChange(job.id, 'title', e.target.value)}
                          placeholder="Job Title"
                          borderRadius="lg"
                        />
                        <Input
                          value={job.company}
                          onChange={(e) => handleJobCardChange(job.id, 'company', e.target.value)}
                          placeholder="Company"
                          borderRadius="lg"
                        />
                      </HStack>
                      <HStack gap={4}>
                        <Input
                          value={job.location || ''}
                          onChange={(e) => handleJobCardChange(job.id, 'location', e.target.value)}
                          placeholder="Location"
                          borderRadius="lg"
                        />
                        <select
                          value={job.currentStage}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleJobCardChange(job.id, 'currentStage', e.target.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--chakra-colors-gray-200)',
                            backgroundColor: selectBg,
                            color: selectColor,
                            minWidth: '150px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="SAVED">Saved</option>
                          <option value="APPLIED">Applied</option>
                          <option value="PHONE_SCREEN">Phone Screen</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="OFFER">Offer</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </HStack>
                      <Textarea
                        value={job.notes || ''}
                        onChange={(e) => handleJobCardChange(job.id, 'notes', e.target.value)}
                        placeholder="Notes..."
                        borderRadius="lg"
                        rows={3}
                      />
                      <HStack>
                        <Button size="sm" colorScheme="blue" onClick={() => handleUpdateJob(job)}>
                          💾 Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingJobId(null)}>
                          Cancel
                        </Button>
                      </HStack>
                    </VStack>
                  ) : (
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={3} flex={1}>
                        <HStack gap={3}>
                          <Box boxSize="32px" borderRadius="full" bg="gray.300" />
                          <VStack align="start" gap={1}>
                            <Heading size="md" color="gray.800" _dark={{ color: "white" }}>
                              {job.title}
                            </Heading>
                            <Text color="gray.600" _dark={{ color: "gray.400" }} fontWeight="medium">
                              {job.company}
                            </Text>
                          </VStack>
                        </HStack>
                        
                        <HStack gap={3} wrap="wrap">
                          <Badge colorScheme={getStageColor(job.currentStage)} borderRadius="full" px={3}>
                            {job.currentStage.replace('_', ' ')}
                          </Badge>
                          {job.location && (
                            <Box as="span" fontSize="sm" bg="gray.100" _dark={{ bg: 'gray.700' }} px={2} py={1} borderRadius="full">
                              📍 {job.location}
                            </Box>
                          )}
                        </HStack>
                        
                        <Text fontSize="xs" color="gray.500">
                          Updated {new Date(job.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </VStack>
                      
                      <VStack gap={2}>
                        <HStack>
                          <IconButton 
                            aria-label="Edit job"
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingJobId(job.id)}
                          >
                            ✏️
                          </IconButton>
                          {job.jobUrl && (
                            <IconButton 
                              aria-label="View job"
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(job.jobUrl, '_blank')}
                            >
                              🔗
                            </IconButton>
                          )}
                          <IconButton 
                            aria-label="Delete job"
                            size="sm" 
                            variant="outline"
                            colorScheme="red"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            🗑️
                          </IconButton>
                        </HStack>
                      </VStack>
                    </HStack>
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </VStack>
      )}
    </VStack>
  )

  const renderAddJob = () => (
    <VStack gap={6} maxW="2xl" mx="auto">
      <VStack gap={2} textAlign="center">
        <Heading size="lg">Add New Job Application</Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Track a new opportunity in your pipeline
        </Text>
      </VStack>
      
      <Box w="full" borderRadius="xl" boxShadow="md" p={8}>
        <form onSubmit={handleSubmit}>
          <VStack gap={6} align="stretch">
            <HStack gap={4}>
              <VStack align="start" flex={1}>
                <Text mb={2} fontWeight="medium" color="gray.700" _dark={{ color: "gray.300" }}>
                  Job Title *
                </Text>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  required
                  borderRadius="lg"
                  size="lg"
                />
              </VStack>
              <VStack align="start" flex={1}>
                <Text mb={2} fontWeight="medium" color="gray.700" _dark={{ color: "gray.300" }}>
                  Company *
                </Text>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="e.g. TechCorp Inc."
                  required
                  borderRadius="lg"
                  size="lg"
                />
              </VStack>
            </HStack>

            <HStack gap={4}>
              <VStack align="start" flex={1}>
                <Text mb={2} fontWeight="medium" color="gray.700" _dark={{ color: "gray.300" }}>
                  Location
                </Text>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  borderRadius="lg"
                  size="lg"
                />
              </VStack>
              <VStack align="start" flex={1}>
                <Text mb={2} fontWeight="medium" color="gray.700" _dark={{ color: "gray.300" }}>
                  Initial Stage
                </Text>
                <select
                  value={formData.currentStage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('currentStage', e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--chakra-colors-gray-200)',
                    backgroundColor: selectBg,
                    color: selectColor,
                    width: '100%',
                    fontSize: '16px'
                  }}
                >
                  <option value="SAVED">Saved</option>
                  <option value="APPLIED">Applied</option>
                  <option value="PHONE_SCREEN">Phone Screen</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </VStack>
            </HStack>

            <VStack align="start">
              <Text mb={2} fontWeight="medium" color="gray.700" _dark={{ color: "gray.300" }}>
                Job URL
              </Text>
              <Input
                value={formData.jobUrl}
                onChange={(e) => handleInputChange('jobUrl', e.target.value)}
                placeholder="https://company.com/jobs/123"
                type="url"
                borderRadius="lg"
                size="lg"
              />
            </VStack>

            <VStack align="start">
              <Text mb={2} fontWeight="medium" color="gray.700" _dark={{ color: "gray.300" }}>
                Notes
              </Text>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any relevant details about this position..."
                borderRadius="lg"
                rows={4}
                resize="vertical"
              />
            </VStack>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              loading={submitLoading}
              borderRadius="xl"
              w="full"
            >
              🚀 Add Job Application
            </Button>
          </VStack>
        </form>
      </Box>
    </VStack>
  )

  const renderSettings = () => (
    <VStack gap={6} maxW="2xl" mx="auto">
      <VStack gap={2} textAlign="center">
        <Heading size="lg">Settings</Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Customize your job tracking experience
        </Text>
      </VStack>
      
      <Box w="full" borderRadius="xl" boxShadow="md" p={8}>
        <VStack gap={6} align="stretch">
          <VStack align="start" gap={4}>
            <Text fontWeight="semibold" fontSize="lg">Data Management</Text>
            <Button variant="outline" colorScheme="blue" size="lg" w="full">
              📤 Export All Data
            </Button>
            <Button variant="outline" colorScheme="orange" size="lg" w="full">
              📥 Import Data
            </Button>
          </VStack>
          
          <Box h="1px" bg="gray.200" _dark={{ bg: "gray.700" }} />
          
          <VStack align="start" gap={4}>
            <Text fontWeight="semibold" fontSize="lg">Quick Actions</Text>
            <Button onClick={fetchData} variant="outline" size="lg" w="full" loading={loading}>
              🔄 Refresh All Data
            </Button>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  )

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard()
      case 'jobs':
        return renderJobs()
      case 'add':
        return renderAddJob()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" gap={1}>
            <Heading size="2xl" color="gray.800" _dark={{ color: "white" }}>
              Job Tracker Pro
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }} fontSize="lg">
              Manage your job applications with precision
            </Text>
          </VStack>
          <HStack gap={4}>
            <Button
              colorScheme="purple"
              variant="outline"
              onClick={onChartsOpen}
              size="lg"
            >
              📊 Analytics
            </Button>
            <ColorModeButton />
          </HStack>
        </Flex>

        {/* Navigation */}
        <Flex justify="center" mb={8}>
          {renderNavigation()}
        </Flex>

        {/* Alerts */}
        <AnimatePresence>
          {connectionError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Box p={4} bg="red.50" color="red.800" rounded="lg" borderWidth="1px" borderColor="red.200" mb={4}>
                <Text fontWeight="bold">Connection Error</Text>
                <Text fontSize="sm">{connectionError}</Text>
                <Button size="sm" mt={2} colorScheme="red" variant="outline" onClick={fetchData}>
                  Retry Connection
                </Button>
              </Box>
            </motion.div>
          )}
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Box p={4} bg="green.50" color="green.800" rounded="lg" borderWidth="1px" borderColor="green.200" mb={4}>
                <Text>{successMessage}</Text>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Analytics Panel */}
        {isChartsOpen && (
          <>
            {/* Backdrop */}
            <Box position="fixed" inset={0} bg="blackAlpha.600" zIndex={1000} onClick={onChartsClose} />
            {/* Panel */}
            <Box position="fixed" top={0} left={0} w={{ base: '100%', md: '420px' }} h="100vh" bg="white" _dark={{ bg: 'gray.900' }} boxShadow="lg" zIndex={1001} p={6} display="flex" flexDirection="column">
              <HStack justify="space-between" mb={4}>
                <Heading size="lg">📊 Analytics Dashboard</Heading>
                <IconButton aria-label="Close analytics" variant="ghost" size="sm" onClick={onChartsClose}>
                  ✖
                </IconButton>
              </HStack>
              <Box flex={1} overflowY="auto">
                <VStack gap={8} align="stretch">
                  <JobStatsChart stats={stats} />
                  <Box w="full" borderRadius="xl" boxShadow="md" p={6}>
                    <Heading size="md" mb={4}>Application Timeline</Heading>
                    <Text color="gray.500" textAlign="center" py={8}>
                      📈 Timeline chart coming soon...
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}
